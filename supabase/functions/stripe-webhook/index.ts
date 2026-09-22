/**
 * stripe-webhook — Supabase Edge Function pour traiter les events Stripe.
 *
 * Réf Feature Spec abonnement V1.0 §9.1.
 *
 * Reçoit les events Stripe sur l'endpoint :
 *   POST https://<project>.supabase.co/functions/v1/stripe-webhook
 *
 * Configuré côté Stripe Dashboard → Developers → Webhooks → Add endpoint
 *
 * Events écoutés :
 *  - checkout.session.completed     → user a payé, créer/activer subscription
 *  - customer.subscription.updated  → status changé (cancel, past_due, etc.)
 *  - customer.subscription.deleted  → expiration définitive
 *  - invoice.payment_succeeded      → renouvellement OK
 *  - invoice.payment_failed         → past_due
 *
 * Env vars requises (à set via : `supabase secrets set ...` ou Dashboard) :
 *  - STRIPE_SECRET_KEY        : sk_test_... ou sk_live_...
 *  - STRIPE_WEBHOOK_SECRET    : whsec_... (signing secret de l'endpoint Stripe)
 *  - SUPABASE_URL             : auto-injecté
 *  - SUPABASE_SERVICE_ROLE_KEY : auto-injecté (bypass RLS pour write)
 *  - RESEND_API_KEY           : optionnelle — active les alertes email
 *  - ALERT_EMAIL              : optionnelle — destinataire des alertes
 *                               (défaut admin@rawadventure.world)
 *
 * Mapping price_id → plan via lookup_key :
 *  - `ra_monthly`    → 'monthly'
 *  - `ra_semestrial` → 'semestrial'
 *  - `ra_annual`     → 'annual'
 *
 * Identification du user_id :
 *  - Priorité 1 : session.client_reference_id (transmis depuis app via URL)
 *  - Priorité 2 : lookup existing row par stripe_customer_id
 *  - Priorité 3 : match par email dans auth.users
 *  - Sinon : log warning + skip update (orphan)
 *
 * Idempotency (durci le 17 sept 2026, R2-16) :
 *  Table `stripe_webhook_events` (event_id PRIMARY KEY) dédupe les retries
 *  Stripe. INSERT ON CONFLICT au début du handler — atomique Postgres. Un
 *  event n'est considéré comme doublon QUE si `processed_at` est posé
 *  (traitement réussi) ; un row présent avec processed_at NULL = tentative
 *  précédente échouée → le retry Stripe est retraité. Cf migration
 *  supabase/migrations/20260608_stripe_webhook_events.sql.
 *
 * Alertes (R2-16) : email best-effort via Resend sur échec de traitement,
 * paiement orphelin et prix non mappé. Sans RESEND_API_KEY : silencieux.
 */

// @ts-ignore — Deno imports
import Stripe from 'https://esm.sh/stripe@17.5.0?target=denonext';
// @ts-ignore — Deno imports
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

// @ts-ignore — Deno globals
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!;
// @ts-ignore
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
// @ts-ignore
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
// @ts-ignore
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
// Optionnelle — active les alertes email (durcissement R2-16). Absente → silencieux.
// @ts-ignore
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
// @ts-ignore
const ALERT_EMAIL = Deno.env.get('ALERT_EMAIL') ?? 'admin@rawadventure.world';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

/**
 * Alerte email best-effort (durcissement R2-16, 17 sept 2026). Resend est déjà
 * en place pour les OTP (domaine rawadventure.world vérifié). Sans clé ou en
 * cas d'échec d'envoi : silencieux — une alerte ne doit jamais casser le
 * traitement d'un event.
 */
async function sendAlert(subject: string, detail: string): Promise<void> {
  if (!RESEND_API_KEY) return;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Raw Adventure Webhook <alertes@rawadventure.world>',
        to: [ALERT_EMAIL],
        subject: `[stripe-webhook] ${subject}`,
        text: detail,
      }),
    });
  } catch (e) {
    console.error('sendAlert failed (non bloquant)', e);
  }
}

type Plan = 'monthly' | 'semestrial' | 'annual';
const LOOKUP_KEY_TO_PLAN: Record<string, Plan> = {
  ra_monthly: 'monthly',
  ra_semestrial: 'semestrial',
  ra_annual: 'annual',
};

async function planFromPriceId(priceId: string): Promise<Plan | null> {
  try {
    const price = await stripe.prices.retrieve(priceId);
    const lookupKey = price.lookup_key;
    if (lookupKey && LOOKUP_KEY_TO_PLAN[lookupKey]) {
      return LOOKUP_KEY_TO_PLAN[lookupKey];
    }
    if (price.recurring?.interval === 'month') {
      const count = price.recurring.interval_count ?? 1;
      if (count === 1) return 'monthly';
      if (count === 6) return 'semestrial';
    }
    if (price.recurring?.interval === 'year') return 'annual';
    console.warn(`Cannot map price ${priceId} (lookup_key=${lookupKey}) to plan`);
    await sendAlert(
      'Prix Stripe non mappé',
      `Le price ${priceId} (lookup_key=${lookupKey}) ne correspond à aucun plan ` +
        `(ra_monthly/ra_semestrial/ra_annual). L'abonnement sera enregistré avec plan=null.`,
    );
    return null;
  } catch (e) {
    console.error('planFromPriceId error', e);
    return null;
  }
}

async function findUserId(opts: {
  clientReferenceId?: string | null;
  customerEmail?: string | null;
  customerId?: string | null;
}): Promise<string | null> {
  if (opts.clientReferenceId) {
    return opts.clientReferenceId;
  }

  if (opts.customerId) {
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', opts.customerId)
      .maybeSingle();
    if (existing) return existing.user_id;
  }

  if (opts.customerEmail) {
    // Rapprochement par email — priorité 3, dernier recours. Historique :
    // le défaut listUsers (50/page) faisait rater le match dès 50 comptes
    // (durci R2-16 avec perPage 1000) ; F-10 (audit Lou) généralise en
    // paginant jusqu'au bout — plus de plafond silencieux, quel que soit
    // le nombre de comptes. Cap de sécurité à 50 pages (50 000 comptes).
    const wanted = opts.customerEmail.toLowerCase();
    for (let page = 1; page <= 50; page++) {
      const { data: users, error } = await supabase.auth.admin.listUsers({
        page,
        perPage: 1000,
      });
      if (error || !users) break;
      const match = users.users.find(
        (u: any) => u.email?.toLowerCase() === wanted,
      );
      if (match) return match.id;
      if (users.users.length < 1000) break; // dernière page
    }
  }

  return null;
}

async function updateSubscription(userId: string, fields: Record<string, any>) {
  const { error } = await supabase
    .from('subscriptions')
    .update(fields)
    .eq('user_id', userId);
  if (error) {
    console.error('updateSubscription error', error);
    throw error;
  }
}

/**
 * Convertit un timestamp Unix Stripe (secondes) en ISO string, en gérant les
 * cas où le champ est absent / null / undefined / NaN.
 *
 * Indispensable depuis l'API Stripe 2024-12+ où certains champs (notamment
 * current_period_end) sont déplacés au niveau item plutôt que subscription.
 * Sans ce guard, `new Date(undefined * 1000).toISOString()` jette
 * RangeError: Invalid time value et fait crasher tout le handler.
 */
function unixToIsoOrNull(unixSec: number | null | undefined): string | null {
  if (typeof unixSec !== 'number' || !Number.isFinite(unixSec)) return null;
  return new Date(unixSec * 1000).toISOString();
}

/**
 * Extrait current_period_end depuis subscription ou item, selon la version
 * de l'API Stripe utilisée.
 *  - API < 2024-12 : subscription.current_period_end
 *  - API >= 2024-12 : subscription.items.data[0].current_period_end
 */
function getCurrentPeriodEnd(subscription: any): number | null {
  if (typeof subscription?.current_period_end === 'number') {
    return subscription.current_period_end;
  }
  const itemEnd = subscription?.items?.data?.[0]?.current_period_end;
  if (typeof itemEnd === 'number') return itemEnd;
  return null;
}

// ─── Handlers ───────────────────────────────────────────────────────────────

async function handleCheckoutCompleted(session: any) {
  const userId = await findUserId({
    clientReferenceId: session.client_reference_id,
    customerEmail: session.customer_email ?? session.customer_details?.email,
    customerId: session.customer,
  });
  if (!userId) {
    console.warn(
      'checkout.session.completed: no user_id found for session',
      session.id,
    );
    await sendAlert(
      'Paiement orphelin — user introuvable',
      `checkout.session.completed ${session.id} : aucun user_id trouvé ` +
        `(client_reference_id=${session.client_reference_id ?? 'null'}, ` +
        `email=${session.customer_email ?? session.customer_details?.email ?? 'null'}, ` +
        `customer=${session.customer ?? 'null'}). Un client a payé sans être ` +
        `rattaché à un compte — rapprochement manuel nécessaire dans Supabase.`,
    );
    return;
  }

  const subscriptionId = session.subscription;
  if (!subscriptionId) {
    console.warn('No subscription on session', session.id);
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price.id;
  const plan = priceId ? await planFromPriceId(priceId) : null;

  await updateSubscription(userId, {
    status: 'active',
    plan,
    started_at: unixToIsoOrNull(subscription.start_date),
    renews_at: unixToIsoOrNull(getCurrentPeriodEnd(subscription)),
    cancelled_at: null,
    stripe_customer_id: session.customer,
    stripe_subscription_id: subscriptionId,
  });
}

async function handleSubscriptionUpdated(subscription: any) {
  const customerId = subscription.customer;
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .maybeSingle();
  if (!existing) {
    console.warn('subscription.updated: no row for customer', customerId);
    return;
  }

  // Cancel detection robuste — couvre les variantes API Stripe :
  //  - subscription.cancel_at_period_end : true → cancel programmé fin période
  //  - subscription.cancel_at : timestamp futur → cancel programmé
  //  - subscription.canceled_at : timestamp passé → cancel déjà effectif
  //  - subscription.status === 'canceled' : cancel fully appliqué
  const cancelScheduled = Boolean(
    subscription.cancel_at_period_end ||
    subscription.cancel_at ||
    subscription.canceled_at,
  );

  let status: string = 'active';
  if (subscription.status === 'canceled' || subscription.status === 'incomplete_expired') {
    status = 'expired';
  } else if (subscription.status === 'past_due' || subscription.status === 'unpaid') {
    status = 'past_due';
  } else if (cancelScheduled) {
    status = 'cancelled';
  } else if (subscription.status === 'active' || subscription.status === 'trialing') {
    status = 'active';
  }

  const priceId = subscription.items.data[0]?.price.id;
  const plan = priceId ? await planFromPriceId(priceId) : null;

  await updateSubscription(existing.user_id, {
    status,
    plan,
    renews_at: unixToIsoOrNull(getCurrentPeriodEnd(subscription)),
    cancelled_at: unixToIsoOrNull(subscription.cancel_at ?? subscription.canceled_at),
    stripe_subscription_id: subscription.id,
  });
}

async function handleSubscriptionDeleted(subscription: any) {
  const customerId = subscription.customer;
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .maybeSingle();
  if (!existing) return;

  await updateSubscription(existing.user_id, {
    status: 'expired',
    plan: null,
    cancelled_at: new Date().toISOString(),
  });
}

async function handleInvoicePaid(invoice: any) {
  const customerId = invoice.customer;
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;

  const { data: existing } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .maybeSingle();
  if (!existing) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await updateSubscription(existing.user_id, {
    status: 'active',
    renews_at: unixToIsoOrNull(getCurrentPeriodEnd(subscription)),
  });
}

async function handleInvoiceFailed(invoice: any) {
  const customerId = invoice.customer;
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .maybeSingle();
  if (!existing) return;

  await updateSubscription(existing.user_id, {
    status: 'past_due',
  });
}

// ─── HTTP entry point ───────────────────────────────────────────────────────

// @ts-ignore — Deno globals
Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  const body = await req.text();
  let event: any;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET,
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log('Stripe event received:', event.type, event.id);

  // ── Idempotency : INSERT ON CONFLICT DO NOTHING (atomique Postgres) ──
  // Si le row existe déjà, deux cas (durcissement R2-16, 17 sept 2026) :
  //  - processed_at posé → event réellement traité → 200, stoppe les retries.
  //  - processed_at NULL → la tentative précédente a ÉCHOUÉ en cours de
  //    traitement (le row est créé avant le traitement). Le retry Stripe doit
  //    retraiter — l'ancien code le rejetait comme doublon et l'event était
  //    perdu pour toujours.
  const dedupedResponse = () =>
    new Response(JSON.stringify({ received: true, deduped: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  const alreadyProcessed = async (): Promise<boolean> => {
    const { data: row } = await supabase
      .from('stripe_webhook_events')
      .select('processed_at')
      .eq('event_id', event.id)
      .maybeSingle();
    if (row?.processed_at) return true;
    console.warn(
      `Event ${event.id} present but never processed (previous attempt failed) — reprocessing`,
    );
    return false;
  };

  const { data: insertedRows, error: insertErr } = await supabase
    .from('stripe_webhook_events')
    .insert({
      event_id: event.id,
      event_type: event.type,
    })
    .select('event_id');

  if (insertErr) {
    if (insertErr.code === '23505') {
      // Conflict PK : row existant — traité avec succès, ou tentative ratée ?
      if (await alreadyProcessed()) {
        console.log(`Event ${event.id} already processed, skipping`);
        return dedupedResponse();
      }
    } else {
      // Autre erreur DB → on log mais on continue (préfère traiter
      // deux fois plutôt que perdre un event).
      console.error('Idempotency insert error', insertErr);
    }
  } else if (!insertedRows || insertedRows.length === 0) {
    // Insert sans erreur mais aucune ligne créée → row existant.
    if (await alreadyProcessed()) {
      console.log(`Event ${event.id} already processed (no row inserted), skipping`);
      return dedupedResponse();
    }
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handleInvoicePaid(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handleInvoiceFailed(event.data.object);
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }

    // Marque l'event comme traité avec succès.
    await supabase
      .from('stripe_webhook_events')
      .update({ processed_at: new Date().toISOString() })
      .eq('event_id', event.id);

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err: any) {
    console.error('Handler error:', err);
    // Marque l'event en erreur pour debug. processed_at reste NULL → le
    // retry Stripe (500 ci-dessous) sera retraité, pas rejeté en doublon.
    await supabase
      .from('stripe_webhook_events')
      .update({ error: String(err?.message ?? err).slice(0, 1000) })
      .eq('event_id', event.id);
    await sendAlert(
      `Échec de traitement — ${event.type}`,
      `Event ${event.id} (${event.type}) a échoué : ${String(err?.message ?? err).slice(0, 500)}\n\n` +
        `Stripe va retenter automatiquement (jusqu'à 3 jours). Si l'erreur persiste, ` +
        `voir la table stripe_webhook_events (processed_at NULL + colonne error).`,
    );
    return new Response(`Handler error: ${err.message}`, { status: 500 });
  }
});

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

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

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
    const { data: users, error } = await supabase.auth.admin.listUsers();
    if (!error && users) {
      const match = users.users.find(
        (u: any) =>
          u.email?.toLowerCase() === opts.customerEmail!.toLowerCase(),
      );
      if (match) return match.id;
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
    started_at: new Date(subscription.start_date * 1000).toISOString(),
    renews_at: new Date(subscription.current_period_end * 1000).toISOString(),
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

  let status: string = 'active';
  if (subscription.cancel_at_period_end) status = 'cancelled';
  else if (subscription.status === 'past_due') status = 'past_due';
  else if (subscription.status === 'canceled') status = 'expired';
  else if (subscription.status === 'unpaid') status = 'past_due';
  else if (subscription.status === 'active') status = 'active';

  const priceId = subscription.items.data[0]?.price.id;
  const plan = priceId ? await planFromPriceId(priceId) : null;

  await updateSubscription(existing.user_id, {
    status,
    plan,
    renews_at: new Date(subscription.current_period_end * 1000).toISOString(),
    cancelled_at: subscription.cancel_at
      ? new Date(subscription.cancel_at * 1000).toISOString()
      : subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000).toISOString()
      : null,
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
    renews_at: new Date(subscription.current_period_end * 1000).toISOString(),
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

  console.log('Stripe event received:', event.type);

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

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err: any) {
    console.error('Handler error:', err);
    return new Response(`Handler error: ${err.message}`, { status: 500 });
  }
});

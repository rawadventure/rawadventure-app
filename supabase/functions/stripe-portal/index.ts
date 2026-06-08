/**
 * stripe-portal — Supabase Edge Function pour générer une session Customer Portal.
 *
 * Réf Feature Spec abonnement V1.0 §7 (gestion abonnement IA-71).
 *
 * Endpoint :
 *   POST https://<project>.supabase.co/functions/v1/stripe-portal
 *
 * Auth requise : Authorization: Bearer <user JWT supabase>
 *
 * Lookup user.id depuis JWT → row subscriptions → stripe_customer_id →
 * Stripe billing_portal.sessions.create → return URL au client.
 *
 * Le client (PaywallScreen ou ProfilTabScreen) ouvre cette URL dans
 * SFSafariViewController. L'utilisateur peut :
 *   - changer plan (mensuel/semestriel/annuel)
 *   - mettre à jour moyen paiement
 *   - télécharger factures
 *   - annuler abonnement
 *
 * Tous les changements déclenchent webhooks (`customer.subscription.updated`,
 * `customer.subscription.deleted`) qui mettent à jour la row Supabase via
 * `stripe-webhook` function → Realtime push → app reflète instantanément.
 *
 * Config Stripe Dashboard requise (Settings → Billing → Customer Portal) :
 *   - Activer le portail
 *   - Cocher "Customers can update payment methods"
 *   - Cocher "Customers can cancel subscriptions"
 *   - Cocher "Customers can switch plans" + ajouter les 3 prices
 *     (ra_monthly, ra_semestrial, ra_annual)
 *   - Cocher "Customers can view invoices"
 *   - Return URL : https://rawadventure.world/account-returned
 *
 * Env vars requises :
 *   - STRIPE_SECRET_KEY        : sk_test_... ou sk_live_...
 *   - SUPABASE_URL             : auto-injecté
 *   - SUPABASE_SERVICE_ROLE_KEY : auto-injecté (bypass RLS pour lookup)
 *
 * Pas de webhook signing ici, juste auth user via JWT.
 */

// @ts-ignore — Deno imports
import Stripe from 'https://esm.sh/stripe@17.5.0?target=denonext';
// @ts-ignore — Deno imports
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

// @ts-ignore — Deno globals
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!;
// @ts-ignore
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
// @ts-ignore
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const RETURN_URL = 'https://rawadventure.world/account-returned/';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// @ts-ignore — Deno globals
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Auth : lit le JWT user depuis Authorization header.
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }
    const token = authHeader.replace('Bearer ', '');

    // Vérif user via Supabase Auth admin (bypass RLS, mais valide JWT).
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData?.user) {
      console.warn('stripe-portal auth fail', userErr);
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }
    const userId = userData.user.id;

    // Lookup stripe_customer_id depuis subscriptions.
    const { data: sub, error: subErr } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_customer_id, status')
      .eq('user_id', userId)
      .maybeSingle();

    if (subErr) {
      console.error('stripe-portal subscriptions lookup error', subErr);
      return new Response(JSON.stringify({ error: 'DB error' }), {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    if (!sub || !sub.stripe_customer_id) {
      return new Response(
        JSON.stringify({
          error: 'No Stripe customer found',
          message:
            "Tu n'as pas encore d'abonnement actif. Souscris d'abord depuis l'écran d'abonnement.",
        }),
        {
          status: 404,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        },
      );
    }

    // Crée session Customer Portal.
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: RETURN_URL,
    });

    return new Response(
      JSON.stringify({ url: portalSession.url }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      },
    );
  } catch (err: any) {
    console.error('stripe-portal handler error', err);
    return new Response(
      JSON.stringify({ error: err.message ?? 'Internal error' }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      },
    );
  }
});

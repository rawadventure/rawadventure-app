-- Migration : Table stripe_webhook_events pour idempotency.
--
-- Stripe peut renvoyer le même event plusieurs fois (retries automatiques
-- sur 5xx, timeouts réseau). Sans dédup, un même event
-- checkout.session.completed pourrait déclencher 2 updates de la row
-- subscriptions, risque de race conditions.
--
-- Fonctionnement :
--  1. Au début du handler webhook, on INSERT event_id avec ON CONFLICT DO NOTHING.
--  2. Si rowCount == 0 → déjà traité (ou en cours dans une autre exécution),
--     on skip le traitement et retourne 200 OK à Stripe.
--  3. Sinon → on traite normalement.
--
-- Le PRIMARY KEY sur event_id rend l'INSERT atomique au niveau Postgres,
-- pas de risque de double traitement même en cas d'exécution concurrente.
--
-- À appliquer via Supabase Dashboard → SQL Editor (les migrations CLI ne
-- sont pas encore configurées sur ce projet).

CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  -- Si le handler échoue après l'INSERT, on garde la trace pour debug
  -- mais on permet un retry manuel via DELETE FROM stripe_webhook_events
  -- WHERE event_id = '...' puis Stripe Dashboard → Resend event.
  error TEXT
);

CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_received_at
  ON public.stripe_webhook_events (received_at DESC);

-- RLS : table système, aucun accès client direct. Seule la Service Role
-- Key (utilisée par Edge Function) peut lire/écrire.
ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- Pas de policy SELECT/INSERT pour rôle authenticated → blocage total
-- pour les utilisateurs de l'app. Service Role bypass RLS de toute façon.

-- Cleanup ancien (> 30 jours) — facultatif, à activer si volume devient
-- problématique. Pour V1, on garde tout pour audit.
-- CREATE OR REPLACE FUNCTION delete_old_webhook_events()
-- RETURNS void LANGUAGE plpgsql AS $$
-- BEGIN
--   DELETE FROM public.stripe_webhook_events
--   WHERE received_at < NOW() - INTERVAL '30 days';
-- END;
-- $$;
-- SELECT cron.schedule('cleanup-webhook-events', '0 3 * * *',
--   'SELECT delete_old_webhook_events()');

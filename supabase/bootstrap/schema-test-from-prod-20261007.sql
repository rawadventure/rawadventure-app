-- ============================================================================
-- Raw Adventure — Bootstrap du projet Supabase TEST (R6-2, 7 octobre 2026)
-- ============================================================================
--
-- Reconstruit le schéma `public` du projet PROD (aknvitrtfxqjdwiyxryt) tel que
-- relevé le 7 octobre 2026 après la migration R8-8 : 12 tables, contraintes,
-- index, 2 fonctions, 2 triggers, 39 policies RLS, privilèges de colonne
-- (F-07 / D43). Généré depuis information_schema / pg_catalog du live, pas
-- depuis les scripts docs/migrations (qui supposent les tables V0 profiles
-- et progress déjà présentes).
--
-- Cible : projet TEST oczteusahpcjzbjrvjfc, base vierge. Idempotent.
-- Application : `supabase link --project-ref oczteusahpcjzbjrvjfc` puis
-- `supabase db query --linked -f supabase/bootstrap/schema-test-from-prod-20261007.sql`
-- (ou copier-coller dans le SQL Editor du projet TEST).
--
-- Différence volontaire avec PROD : aucun privilège table n'est accordé au
-- rôle `anon` (l'app ne lit aucune table avant connexion ; PROD garde les
-- grants par défaut Supabase — hygiène à aligner plus tard si TEST le
-- confirme). Les vidéos restent servies par le bucket public de PROD
-- (URL codée dans TierReachedModal.tsx) : pas de storage à recréer ici.
--
-- Vérification après application : rejouer les requêtes de
-- docs/release/supabase-rls-audit.md §12 sur TEST et comparer à PROD.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Tables
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  onboarding_done boolean NOT NULL DEFAULT false,
  onboarding_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  profile_dynamic_id text,
  account_created_at timestamptz,
  narrative_flags jsonb NOT NULL DEFAULT '{}'::jsonb,
  current_pillar_id text,
  pillar_started_at timestamptz,
  pending_tier_reach jsonb,
  dev_tools_enabled boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_id integer NOT NULL,
  is_minimum boolean NOT NULL DEFAULT false,
  completed_at timestamptz NOT NULL DEFAULT now(),
  actions_count integer NOT NULL DEFAULT 0,
  validated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT progress_user_id_day_id_key UNIQUE (user_id, day_id),
  CONSTRAINT progress_actions_count_range CHECK (actions_count >= 0 AND actions_count <= 7)
);

CREATE TABLE IF NOT EXISTS public.streak_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  local_date date NOT NULL,
  validation_status text NOT NULL,
  phase text NOT NULL,
  streak_value_after integer NOT NULL DEFAULT 0,
  joker_used boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT streak_history_validation_status_check CHECK (validation_status IN (
    'valid_above_threshold', 'valid_with_joker', 'missed_with_joker', 'broken_streak', 'not_yet_processed')),
  CONSTRAINT streak_history_phase_check CHECK (phase IN ('phase_0', 'phase_1', 'post_s8'))
);
CREATE UNIQUE INDEX IF NOT EXISTS streak_history_user_date_unique ON public.streak_history (user_id, local_date);
CREATE INDEX IF NOT EXISTS streak_history_user_date_desc ON public.streak_history (user_id, local_date DESC);

CREATE TABLE IF NOT EXISTS public.joker_consumptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_key text NOT NULL,
  consumed_for_local_date date NOT NULL,
  consumed_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS joker_consumptions_user_week_unique ON public.joker_consumptions (user_id, week_key);

CREATE TABLE IF NOT EXISTS public.tier_reaches (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier_id integer NOT NULL,
  first_reached_at timestamptz NOT NULL DEFAULT now(),
  last_reached_at timestamptz NOT NULL DEFAULT now(),
  reach_count integer NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, tier_id),
  CONSTRAINT tier_reaches_tier_id_check CHECK (tier_id IN (7, 15, 30, 60, 100, 365))
);

CREATE TABLE IF NOT EXISTS public.pillar_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pillar_id text NOT NULL,
  evaluation_type text NOT NULL,
  responses jsonb NOT NULL,
  raw_score integer NOT NULL,
  normalized_score numeric NOT NULL,
  diagnostic_level integer NOT NULL,
  engagement_level_recommended text NOT NULL,
  engagement_level_chosen text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pillar_evaluations_pillar_id_check CHECK (pillar_id IN ('S1','S2','S3','S4','S5','S6','S7','S8')),
  CONSTRAINT pillar_evaluations_evaluation_type_check CHECK (evaluation_type IN ('initial', 'final')),
  CONSTRAINT pillar_evaluations_raw_score_check CHECK (raw_score >= 12 AND raw_score <= 60),
  CONSTRAINT pillar_evaluations_normalized_score_check CHECK (normalized_score >= 0 AND normalized_score <= 100),
  CONSTRAINT pillar_evaluations_diagnostic_level_check CHECK (diagnostic_level >= 1 AND diagnostic_level <= 5),
  CONSTRAINT pillar_evaluations_engagement_level_recommended_check CHECK (engagement_level_recommended IN ('essentiel', 'progression', 'immersion')),
  CONSTRAINT pillar_evaluations_engagement_level_chosen_check CHECK (engagement_level_chosen IN ('essentiel', 'progression', 'immersion'))
);
CREATE UNIQUE INDEX IF NOT EXISTS pillar_evaluations_user_pillar_type_unique ON public.pillar_evaluations (user_id, pillar_id, evaluation_type);
CREATE INDEX IF NOT EXISTS pillar_evaluations_user_pillar ON public.pillar_evaluations (user_id, pillar_id);

CREATE TABLE IF NOT EXISTS public.pillar_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pillar_id text NOT NULL,
  day_in_week integer NOT NULL,
  session_index integer NOT NULL,
  local_date date NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  duration_seconds integer,
  CONSTRAINT pillar_sessions_pillar_id_check CHECK (pillar_id IN ('S1','S2','S3','S4','S5','S6','S7','S8')),
  CONSTRAINT pillar_sessions_day_in_week_check CHECK (day_in_week >= 1 AND day_in_week <= 7),
  CONSTRAINT pillar_sessions_session_index_check CHECK (session_index >= 1 AND session_index <= 3)
);
CREATE UNIQUE INDEX IF NOT EXISTS pillar_sessions_user_pillar_day_session_unique ON public.pillar_sessions (user_id, pillar_id, day_in_week, session_index);
CREATE INDEX IF NOT EXISTS pillar_sessions_user_pillar_date ON public.pillar_sessions (user_id, pillar_id, local_date);

CREATE TABLE IF NOT EXISTS public.level_adaptive_choices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pillar_id text NOT NULL,
  session_id uuid REFERENCES public.pillar_sessions(id) ON DELETE SET NULL,
  choice text NOT NULL,
  chosen_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT level_adaptive_choices_pillar_id_check CHECK (pillar_id IN ('S1','S2','S3','S4','S5','S6','S7','S8','phase_0')),
  CONSTRAINT level_adaptive_choices_choice_check CHECK (choice IN ('less', 'same', 'more'))
);
CREATE INDEX IF NOT EXISTS level_adaptive_choices_user_pillar_recent ON public.level_adaptive_choices (user_id, pillar_id, chosen_at DESC);

CREATE TABLE IF NOT EXISTS public.notifications_sent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_slot text NOT NULL,
  phase text,
  pillar_id text,
  sent_at timestamptz NOT NULL DEFAULT now(),
  opened_at timestamptz,
  dismissed_at timestamptz,
  CONSTRAINT notifications_sent_phase_check CHECK (phase IN ('phase_0', 'phase_1')),
  CONSTRAINT notifications_sent_pillar_id_check CHECK (pillar_id IN ('S1','S2','S3','S4','S5','S6','S7','S8'))
);
CREATE INDEX IF NOT EXISTS notifications_sent_user_sent_desc ON public.notifications_sent (user_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS notifications_sent_user_slot_sent ON public.notifications_sent (user_id, notification_slot, sent_at DESC);

CREATE TABLE IF NOT EXISTS public.daily_check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  local_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'free',
  plan text,
  started_at timestamptz,
  renews_at timestamptz,
  cancelled_at timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT subscriptions_status_check CHECK (status IN ('free', 'trial', 'active', 'past_due', 'cancelled', 'expired')),
  CONSTRAINT subscriptions_plan_check CHECK (plan IS NULL OR plan IN ('monthly', 'semestrial', 'annual'))
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON public.subscriptions (stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription ON public.subscriptions (stripe_subscription_id);

CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
  event_id text PRIMARY KEY,
  event_type text NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  error text
);
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_received_at ON public.stripe_webhook_events (received_at DESC);

-- ----------------------------------------------------------------------------
-- 2. Fonctions et triggers
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, onboarding_done)
  VALUES (NEW.id, false)
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.subscriptions (user_id, status)
  VALUES (NEW.id, 'free')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 3. RLS + policies (état PROD post R8-8 : 39 policies)
-- ----------------------------------------------------------------------------

DO $$
DECLARE
  t text;
  tables text[] := ARRAY['streak_history', 'joker_consumptions', 'tier_reaches',
    'pillar_evaluations', 'pillar_sessions', 'level_adaptive_choices',
    'notifications_sent', 'daily_check_ins'];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "Users can read their own rows" ON public.%I', t);
    EXECUTE format('CREATE POLICY "Users can read their own rows" ON public.%I FOR SELECT USING (auth.uid() = user_id)', t);
    EXECUTE format('DROP POLICY IF EXISTS "Users can insert their own rows" ON public.%I', t);
    EXECUTE format('CREATE POLICY "Users can insert their own rows" ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id)', t);
    EXECUTE format('DROP POLICY IF EXISTS "Users can update their own rows" ON public.%I', t);
    EXECUTE format('CREATE POLICY "Users can update their own rows" ON public.%I FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)', t);
    EXECUTE format('DROP POLICY IF EXISTS "Users can delete their own rows" ON public.%I', t);
    EXECUTE format('CREATE POLICY "Users can delete their own rows" ON public.%I FOR DELETE USING (auth.uid() = user_id)', t);
  END LOOP;
END $$;

ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own progress" ON public.progress;
CREATE POLICY "Users read own progress" ON public.progress FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users insert own progress" ON public.progress;
CREATE POLICY "Users insert own progress" ON public.progress FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users update own progress" ON public.progress;
CREATE POLICY "Users update own progress" ON public.progress FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users delete own progress" ON public.progress;
CREATE POLICY "Users delete own progress" ON public.progress FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own subscription" ON public.subscriptions;
CREATE POLICY "Users read own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;
-- aucune policy : service role uniquement

-- ----------------------------------------------------------------------------
-- 4. Privilèges (explicites : les nouveaux projets n'exposent plus les tables
--    automatiquement ; anon volontairement exclu)
-- ----------------------------------------------------------------------------

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.progress, public.streak_history, public.joker_consumptions,
  public.tier_reaches, public.pillar_evaluations, public.pillar_sessions,
  public.level_adaptive_choices, public.notifications_sent, public.daily_check_ins
  TO authenticated;

GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (
  onboarding_done, onboarding_data, profile_dynamic_id, account_created_at,
  narrative_flags, current_pillar_id, pillar_started_at, pending_tier_reach
) ON public.profiles TO authenticated;

GRANT SELECT ON public.subscriptions TO authenticated;

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Fin. Vérification : voir docs/release/supabase-rls-audit.md §12.

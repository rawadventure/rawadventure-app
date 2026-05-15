-- ============================================================================
-- Raw Adventure App — Migration V1 (001)
-- ============================================================================
--
-- À exécuter UNE FOIS dans Supabase Dashboard → SQL Editor → Run.
-- Source de vérité : docs/specs/schema-donnees-v1-1.md
--
-- Contenu :
--   1. Patches sur les 2 tables V0 existantes (profiles + progress)
--   2. Création des 7 nouvelles tables V1
--   3. Création de la table V2 daily_check_ins (vide, réservée)
--   4. Activation RLS et politiques d'accès uniformes
--   5. Index de performance
--   6. Trigger AFTER INSERT auth.users → profiles auto-créé
--
-- Conventions :
--   - Tables et colonnes en snake_case (convention PostgreSQL / Supabase)
--   - Toutes les tables ont RLS activée
--   - Un utilisateur ne lit / modifie QUE ses propres lignes
--   - Pas de service_role utilisée côté client — uniquement la anon key
--
-- Idempotence : IF NOT EXISTS partout où possible. Les politiques RLS sont
-- droppées puis recréées (CREATE POLICY n'accepte pas IF NOT EXISTS en PG <= 16).
-- ============================================================================

-- ============================================================================
-- 1. PATCHES TABLES EXISTANTES (V0)
-- ============================================================================

-- 1.1 profiles : ajout profile_dynamic_id + account_created_at
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS profile_dynamic_id text,
  ADD COLUMN IF NOT EXISTS account_created_at timestamptz;

-- 1.2 progress : ajout actions_count + validated_at
ALTER TABLE progress
  ADD COLUMN IF NOT EXISTS actions_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS validated_at timestamptz NOT NULL DEFAULT now();

-- Contrainte de plage sur actions_count (0-7 pour Phase 0)
ALTER TABLE progress
  DROP CONSTRAINT IF EXISTS progress_actions_count_range;
ALTER TABLE progress
  ADD CONSTRAINT progress_actions_count_range
  CHECK (actions_count >= 0 AND actions_count <= 7);

-- ============================================================================
-- 2. NOUVELLES TABLES V1
-- ============================================================================

-- 2.1 streak_history — historique fin du streak par jour calendaire local
CREATE TABLE IF NOT EXISTS streak_history (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  local_date          date NOT NULL,
  validation_status   text NOT NULL CHECK (validation_status IN (
                        'valid_above_threshold',
                        'valid_with_joker',
                        'broken_streak',
                        'not_yet_processed'
                      )),
  phase               text NOT NULL CHECK (phase IN ('phase_0', 'phase_1')),
  streak_value_after  integer NOT NULL DEFAULT 0,
  joker_used          boolean NOT NULL DEFAULT false,
  created_at          timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS streak_history_user_date_unique
  ON streak_history (user_id, local_date);
CREATE INDEX IF NOT EXISTS streak_history_user_date_desc
  ON streak_history (user_id, local_date DESC);

-- 2.2 joker_consumptions — consommations du joker hebdomadaire (semaine fixe lundi-dimanche)
CREATE TABLE IF NOT EXISTS joker_consumptions (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_key                 text NOT NULL,
  consumed_for_local_date  date NOT NULL,
  consumed_at              timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS joker_consumptions_user_week_unique
  ON joker_consumptions (user_id, week_key);

-- 2.3 tier_reaches — franchissements paliers de récompense (schéma alternatif PK composite)
CREATE TABLE IF NOT EXISTS tier_reaches (
  user_id                  uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier_id                  integer NOT NULL CHECK (tier_id IN (7, 15, 30, 60, 100, 365)),
  first_reached_at         timestamptz NOT NULL DEFAULT now(),
  last_reached_at          timestamptz NOT NULL DEFAULT now(),
  reach_count              integer NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, tier_id)
);

-- 2.4 pillar_evaluations — évaluations 12 questions (initiale + finale par pilier)
CREATE TABLE IF NOT EXISTS pillar_evaluations (
  id                              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pillar_id                       text NOT NULL CHECK (pillar_id IN ('S1','S2','S3','S4','S5','S6','S7','S8')),
  evaluation_type                 text NOT NULL CHECK (evaluation_type IN ('initial', 'final')),
  responses                       jsonb NOT NULL,
  raw_score                       integer NOT NULL CHECK (raw_score >= 12 AND raw_score <= 60),
  normalized_score                numeric(5,2) NOT NULL CHECK (normalized_score >= 0 AND normalized_score <= 100),
  diagnostic_level                integer NOT NULL CHECK (diagnostic_level >= 1 AND diagnostic_level <= 5),
  engagement_level_recommended    text NOT NULL CHECK (engagement_level_recommended IN ('essentiel','progression','immersion')),
  engagement_level_chosen         text NOT NULL CHECK (engagement_level_chosen IN ('essentiel','progression','immersion')),
  completed_at                    timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS pillar_evaluations_user_pillar_type_unique
  ON pillar_evaluations (user_id, pillar_id, evaluation_type);
CREATE INDEX IF NOT EXISTS pillar_evaluations_user_pillar
  ON pillar_evaluations (user_id, pillar_id);

-- 2.5 pillar_sessions — sessions pratiquées en Phase 1 (3/jour × 7 × 8 = 168 max)
CREATE TABLE IF NOT EXISTS pillar_sessions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pillar_id           text NOT NULL CHECK (pillar_id IN ('S1','S2','S3','S4','S5','S6','S7','S8')),
  day_in_week         integer NOT NULL CHECK (day_in_week >= 1 AND day_in_week <= 7),
  session_index       integer NOT NULL CHECK (session_index >= 1 AND session_index <= 3),
  local_date          date NOT NULL,
  completed_at        timestamptz NOT NULL DEFAULT now(),
  duration_seconds    integer
);
CREATE UNIQUE INDEX IF NOT EXISTS pillar_sessions_user_pillar_day_session_unique
  ON pillar_sessions (user_id, pillar_id, day_in_week, session_index);
CREATE INDEX IF NOT EXISTS pillar_sessions_user_pillar_date
  ON pillar_sessions (user_id, pillar_id, local_date);

-- 2.6 level_adaptive_choices — choix Moins/Pareil/Plus
CREATE TABLE IF NOT EXISTS level_adaptive_choices (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pillar_id    text NOT NULL CHECK (pillar_id IN ('S1','S2','S3','S4','S5','S6','S7','S8','phase_0')),
  session_id   uuid REFERENCES pillar_sessions(id) ON DELETE SET NULL,
  choice       text NOT NULL CHECK (choice IN ('less', 'same', 'more')),
  chosen_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS level_adaptive_choices_user_pillar_recent
  ON level_adaptive_choices (user_id, pillar_id, chosen_at DESC);

-- 2.7 notifications_sent — historique des notifications push (anti-doublons + analytics)
CREATE TABLE IF NOT EXISTS notifications_sent (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_slot      text NOT NULL,
  phase                  text CHECK (phase IN ('phase_0', 'phase_1')),
  pillar_id              text CHECK (pillar_id IN ('S1','S2','S3','S4','S5','S6','S7','S8')),
  sent_at                timestamptz NOT NULL DEFAULT now(),
  opened_at              timestamptz,
  dismissed_at           timestamptz
);
CREATE INDEX IF NOT EXISTS notifications_sent_user_sent_desc
  ON notifications_sent (user_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS notifications_sent_user_slot_sent
  ON notifications_sent (user_id, notification_slot, sent_at DESC);

-- ============================================================================
-- 3. TABLE V2 RÉSERVÉE
-- ============================================================================

-- 3.1 daily_check_ins — vide en V1, schéma étendu en V2 quand D36 sera levée
CREATE TABLE IF NOT EXISTS daily_check_ins (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  local_date  date NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================================

-- Toutes les nouvelles tables : RLS activée + 4 politiques (SELECT/INSERT/UPDATE/DELETE)
-- L'utilisateur ne voit / modifie que ses propres lignes (auth.uid() = user_id).

-- Helper macro mentale : pour chaque table T à colonne user_id, on fait :
--   ALTER TABLE T ENABLE ROW LEVEL SECURITY;
--   DROP POLICY IF EXISTS "rls_select" ON T;
--   CREATE POLICY "rls_select" ON T FOR SELECT USING (auth.uid() = user_id);
--   ... idem INSERT / UPDATE / DELETE

-- 4.1 streak_history
ALTER TABLE streak_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read their own rows" ON streak_history;
DROP POLICY IF EXISTS "Users can insert their own rows" ON streak_history;
DROP POLICY IF EXISTS "Users can update their own rows" ON streak_history;
DROP POLICY IF EXISTS "Users can delete their own rows" ON streak_history;
CREATE POLICY "Users can read their own rows" ON streak_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own rows" ON streak_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own rows" ON streak_history FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own rows" ON streak_history FOR DELETE USING (auth.uid() = user_id);

-- 4.2 joker_consumptions
ALTER TABLE joker_consumptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read their own rows" ON joker_consumptions;
DROP POLICY IF EXISTS "Users can insert their own rows" ON joker_consumptions;
DROP POLICY IF EXISTS "Users can update their own rows" ON joker_consumptions;
DROP POLICY IF EXISTS "Users can delete their own rows" ON joker_consumptions;
CREATE POLICY "Users can read their own rows" ON joker_consumptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own rows" ON joker_consumptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own rows" ON joker_consumptions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own rows" ON joker_consumptions FOR DELETE USING (auth.uid() = user_id);

-- 4.3 tier_reaches
ALTER TABLE tier_reaches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read their own rows" ON tier_reaches;
DROP POLICY IF EXISTS "Users can insert their own rows" ON tier_reaches;
DROP POLICY IF EXISTS "Users can update their own rows" ON tier_reaches;
DROP POLICY IF EXISTS "Users can delete their own rows" ON tier_reaches;
CREATE POLICY "Users can read their own rows" ON tier_reaches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own rows" ON tier_reaches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own rows" ON tier_reaches FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own rows" ON tier_reaches FOR DELETE USING (auth.uid() = user_id);

-- 4.4 pillar_evaluations
ALTER TABLE pillar_evaluations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read their own rows" ON pillar_evaluations;
DROP POLICY IF EXISTS "Users can insert their own rows" ON pillar_evaluations;
DROP POLICY IF EXISTS "Users can update their own rows" ON pillar_evaluations;
DROP POLICY IF EXISTS "Users can delete their own rows" ON pillar_evaluations;
CREATE POLICY "Users can read their own rows" ON pillar_evaluations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own rows" ON pillar_evaluations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own rows" ON pillar_evaluations FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own rows" ON pillar_evaluations FOR DELETE USING (auth.uid() = user_id);

-- 4.5 pillar_sessions
ALTER TABLE pillar_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read their own rows" ON pillar_sessions;
DROP POLICY IF EXISTS "Users can insert their own rows" ON pillar_sessions;
DROP POLICY IF EXISTS "Users can update their own rows" ON pillar_sessions;
DROP POLICY IF EXISTS "Users can delete their own rows" ON pillar_sessions;
CREATE POLICY "Users can read their own rows" ON pillar_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own rows" ON pillar_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own rows" ON pillar_sessions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own rows" ON pillar_sessions FOR DELETE USING (auth.uid() = user_id);

-- 4.6 level_adaptive_choices
ALTER TABLE level_adaptive_choices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read their own rows" ON level_adaptive_choices;
DROP POLICY IF EXISTS "Users can insert their own rows" ON level_adaptive_choices;
DROP POLICY IF EXISTS "Users can update their own rows" ON level_adaptive_choices;
DROP POLICY IF EXISTS "Users can delete their own rows" ON level_adaptive_choices;
CREATE POLICY "Users can read their own rows" ON level_adaptive_choices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own rows" ON level_adaptive_choices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own rows" ON level_adaptive_choices FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own rows" ON level_adaptive_choices FOR DELETE USING (auth.uid() = user_id);

-- 4.7 notifications_sent
ALTER TABLE notifications_sent ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read their own rows" ON notifications_sent;
DROP POLICY IF EXISTS "Users can insert their own rows" ON notifications_sent;
DROP POLICY IF EXISTS "Users can update their own rows" ON notifications_sent;
DROP POLICY IF EXISTS "Users can delete their own rows" ON notifications_sent;
CREATE POLICY "Users can read their own rows" ON notifications_sent FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own rows" ON notifications_sent FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own rows" ON notifications_sent FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own rows" ON notifications_sent FOR DELETE USING (auth.uid() = user_id);

-- 4.8 daily_check_ins (V2 réservée)
ALTER TABLE daily_check_ins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read their own rows" ON daily_check_ins;
DROP POLICY IF EXISTS "Users can insert their own rows" ON daily_check_ins;
DROP POLICY IF EXISTS "Users can update their own rows" ON daily_check_ins;
DROP POLICY IF EXISTS "Users can delete their own rows" ON daily_check_ins;
CREATE POLICY "Users can read their own rows" ON daily_check_ins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own rows" ON daily_check_ins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own rows" ON daily_check_ins FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own rows" ON daily_check_ins FOR DELETE USING (auth.uid() = user_id);

-- 4.9 profiles : politiques par id (cas particulier, voir schéma-données §4)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;
CREATE POLICY "Users can read their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can delete their own profile" ON profiles FOR DELETE USING (auth.uid() = id);

-- 4.10 progress : (re)pose politiques RLS de cohérence
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read their own rows" ON progress;
DROP POLICY IF EXISTS "Users can insert their own rows" ON progress;
DROP POLICY IF EXISTS "Users can update their own rows" ON progress;
DROP POLICY IF EXISTS "Users can delete their own rows" ON progress;
CREATE POLICY "Users can read their own rows" ON progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own rows" ON progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own rows" ON progress FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own rows" ON progress FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- 5. TRIGGER auto-création profil à l'inscription
-- ============================================================================

-- Crée automatiquement une ligne dans `profiles` quand un user s'inscrit via Supabase Auth.
-- Évite l'oubli côté code applicatif.

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, onboarding_done, onboarding_data, account_created_at)
  VALUES (NEW.id, false, '{}'::jsonb, NEW.created_at)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- 6. VÉRIFICATIONS POST-MIGRATION
-- ============================================================================
--
-- Après exécution, lancer ces requêtes pour vérifier que tout est OK :
--
--   SELECT table_name FROM information_schema.tables
--     WHERE table_schema = 'public'
--     ORDER BY table_name;
--
--   Attendu (10 tables) : daily_check_ins, joker_consumptions,
--   level_adaptive_choices, notifications_sent, pillar_evaluations,
--   pillar_sessions, profiles, progress, streak_history, tier_reaches
--
--   SELECT tablename, rowsecurity FROM pg_tables
--     WHERE schemaname = 'public' AND rowsecurity = true;
--   → 10 tables RLS activée
--
-- ============================================================================
-- Fin de la migration 001-v1-tables.sql
-- ============================================================================

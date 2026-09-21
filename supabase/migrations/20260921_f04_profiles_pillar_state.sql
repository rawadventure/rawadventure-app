-- Migration F-04 (audit Lou Grenier, sept 2026) : l'état d'un utilisateur
-- CONNECTÉ ne vit plus uniquement dans le navigateur.
--
-- Contexte : narrative_flags (écrans narratifs déjà vus), current_pillar_id,
-- pillar_started_at et pending_tier_reach étaient stockés en AsyncStorage
-- seulement. Effacer les données Safari, réinstaller, ou passer de Safari à
-- la PWA installée (storages séparés) les perdait : vidéo J1 rejouée,
-- pilier reparti à S1, « En attente de pilier » (bugs vus en salve). Ces
-- quatre états deviennent des colonnes de profiles, write-through côté app
-- (commit F-04), AsyncStorage réservé au mode anonyme pré-signup.
--
-- Idempotente. À appliquer via Supabase Dashboard → SQL Editor.

-- 1. Nouvelles colonnes d'état répliqué.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS narrative_flags jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS current_pillar_id text,
  ADD COLUMN IF NOT EXISTS pillar_started_at timestamptz,
  ADD COLUMN IF NOT EXISTS pending_tier_reach jsonb;

-- 2. Définitions versionnées (demande F-09/F-04 du rapport : profiles et
--    progress n'existaient qu'en base live). Reconstituées depuis le code
--    client et docs/release/supabase-rls-audit.md §4 — no-op sur le live
--    (IF NOT EXISTS), référence pour un environnement neuf. Si le live
--    porte des colonnes supplémentaires, compléter ce fichier au moment où
--    le code s'en sert.
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  onboarding_done boolean NOT NULL DEFAULT false,
  onboarding_data jsonb NOT NULL DEFAULT '{}',
  profile_dynamic_id text,
  account_created_at timestamptz,
  narrative_flags jsonb NOT NULL DEFAULT '{}',
  current_pillar_id text,
  pillar_started_at timestamptz,
  pending_tier_reach jsonb
);

CREATE TABLE IF NOT EXISTS public.progress (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_id integer NOT NULL,
  is_minimum boolean NOT NULL DEFAULT false,
  actions_count integer,
  validated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, day_id)
);

-- 3. RLS (idempotent — recrée les policies attendues §4 du doc RLS si
--    absentes ; ne touche pas aux policies existantes du même nom).
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public'
      AND tablename = 'profiles' AND policyname = 'Users can read own profile'
  ) THEN
    CREATE POLICY "Users can read own profile"
      ON public.profiles FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public'
      AND tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON public.profiles FOR UPDATE
      USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public'
      AND tablename = 'progress' AND policyname = 'Users read own progress'
  ) THEN
    CREATE POLICY "Users read own progress"
      ON public.progress FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public'
      AND tablename = 'progress' AND policyname = 'Users insert own progress'
  ) THEN
    CREATE POLICY "Users insert own progress"
      ON public.progress FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public'
      AND tablename = 'progress' AND policyname = 'Users update own progress'
  ) THEN
    CREATE POLICY "Users update own progress"
      ON public.progress FOR UPDATE
      USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public'
      AND tablename = 'progress' AND policyname = 'Users delete own progress'
  ) THEN
    CREATE POLICY "Users delete own progress"
      ON public.progress FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- 4. Vérification attendue après application :
--    select column_name, data_type from information_schema.columns
--    where table_schema = 'public' and table_name = 'profiles'
--    order by ordinal_position;
--    → les 4 colonnes narrative_flags / current_pillar_id /
--      pillar_started_at / pending_tier_reach présentes.

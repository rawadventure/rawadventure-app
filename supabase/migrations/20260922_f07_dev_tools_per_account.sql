-- Migration F-07/K1 (audit Lou + décision D43) : panneau DEV par compte.
--
-- Le flag env Vercel EXPO_PUBLIC_ENABLE_DEV_PANEL est retiré du code : il
-- exposait le panneau DEV (reset complet, mock abonnement, horloge
-- virtuelle) à tous les utilisateurs du déploiement testeurs. À la place,
-- une colonne profiles.dev_tools_enabled, lue au chargement du profil.
--
-- SÉCURITÉ : la colonne doit être IMPOSSIBLE à modifier depuis le client —
-- sinon n'importe quel utilisateur connecté se flagge depuis la console
-- navigateur et obtient reset + snapshots. La policy RLS « update own
-- profile » ne distingue pas les colonnes : on passe par les privilèges de
-- colonne Postgres (REVOKE UPDATE table-wide, re-GRANT colonne par colonne
-- sans dev_tools_enabled). Le service role (webhook, SQL editor) bypasse.
--
-- Idempotente. À appliquer via Supabase Dashboard → SQL Editor.

-- 1. Colonne (défaut false : personne n'est flaggé).
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS dev_tools_enabled boolean NOT NULL DEFAULT false;

-- 2. Verrou : UPDATE autorisé uniquement sur les colonnes que l'app modifie
--    réellement — dev_tools_enabled exclu.
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (
  onboarding_done,
  onboarding_data,
  profile_dynamic_id,
  account_created_at,
  narrative_flags,
  current_pillar_id,
  pillar_started_at,
  pending_tier_reach
) ON public.profiles TO authenticated;

-- 3. Flagger un compte (à exécuter par Stéphane pour SES comptes — exemple) :
--    update public.profiles set dev_tools_enabled = true
--    where id = (select id from auth.users where email = 'xxx@yyy.zz');

-- 4. Vérifications attendues :
--    a) select column_name, is_updatable ... (privilèges) :
--       select privilege_type, column_name
--       from information_schema.column_privileges
--       where table_schema='public' and table_name='profiles'
--         and grantee='authenticated' and privilege_type='UPDATE'
--       order by column_name;
--       → 8 lignes, SANS dev_tools_enabled.
--    b) Depuis l'app connectée (console), un
--       update profiles set dev_tools_enabled=true → erreur permission.

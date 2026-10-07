-- Migration R8-8 (audit RLS complet, 7 octobre 2026) : durcissement.
--
-- Audit en lecture seule sur la base live (supabase db query --linked,
-- advisors sécurité). Résultats : docs/release/supabase-rls-audit.md §12.
--
-- 1. FAILLE — contournement du verrou D43 (profiles.dev_tools_enabled).
--    La base live portait deux policies non prévues sur profiles :
--    "Users can insert their own profile" et "Users can delete their own
--    profile", avec INSERT accordé sur toutes les colonnes (dont
--    dev_tools_enabled). Un utilisateur connecté pouvait supprimer sa row
--    profiles puis la réinsérer avec dev_tools_enabled = true → panneau DEV
--    (reset, mock abonnement = Phase 1 sans payer). Le verrou du 22 sept
--    (migration F-07) ne couvrait que l'UPDATE.
--    L'app n'insère ni ne supprime jamais profiles (row posée par le
--    trigger on_auth_user_created, SECURITY DEFINER) : retrait sans impact.
--
-- 2. Doublons de policies (profiles ×2 SELECT/UPDATE, progress ×2 CRUD)
--    issus de deux générations de nommage. Même prédicat, retrait du jeu
--    "their own" ; on garde le jeu documenté §4 du doc RLS.
--
-- 3. Fonctions : handle_new_user (SECURITY DEFINER) exécutable par anon /
--    authenticated via /rest/v1/rpc (advisors 0028/0029) ; set_updated_at
--    sans search_path fixé (advisor 0011). Fonctions trigger, jamais
--    appelées par le client.
--
-- Idempotente. Appliquée sur le live le 7 octobre 2026 via
-- `supabase db query --linked -f`.

-- 1. Faille D43
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
REVOKE INSERT, DELETE ON public.profiles FROM authenticated, anon;

-- 2. Doublons
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read their own rows" ON public.progress;
DROP POLICY IF EXISTS "Users can insert their own rows" ON public.progress;
DROP POLICY IF EXISTS "Users can update their own rows" ON public.progress;
DROP POLICY IF EXISTS "Users can delete their own rows" ON public.progress;

-- 3. Fonctions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
ALTER FUNCTION public.set_updated_at() SET search_path = public;

-- 4. Vérifications attendues après application :
--    select tablename, count(*) from pg_policies where schemaname='public'
--    group by 1 order by 1;
--    → profiles 2 (SELECT, UPDATE), progress 4, subscriptions 1,
--      stripe_webhook_events 0, 8 autres tables 4 → total 39.
--    select privilege_type from information_schema.role_table_grants
--    where table_schema='public' and table_name='profiles'
--      and grantee='authenticated';
--    → sans INSERT ni DELETE (ni UPDATE table-wide : colonne par colonne,
--      migration F-07).
--    supabase db advisors --linked --type security
--    → plus aucun WARN SQL (reste auth_leaked_password_protection,
--      réglage Dashboard).

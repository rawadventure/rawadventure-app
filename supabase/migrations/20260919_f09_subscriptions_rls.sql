-- Migration F-09 (audit Lou Grenier, sept 2026) : la table `subscriptions`
-- n'est modifiable QUE par le service role (webhook Stripe). Le client app
-- ne fait que lire sa propre row.
--
-- Contexte : le code client faisait insert/update sur cette table
-- (SubscriptionContext V0). Si une policy INSERT/UPDATE existait côté live,
-- n'importe quel utilisateur connecté pouvait s'activer la Phase 1 depuis la
-- console navigateur. Les écritures client sont retirées du code ; cette
-- migration verrouille la base et transfère la création de la row au trigger
-- on_auth_user_created (le webhook fait des UPDATE, jamais d'insert — sans
-- row préexistante, le paiement ne serait pas enregistré).
--
-- Idempotente. À appliquer via Supabase Dashboard → SQL Editor (les
-- migrations CLI ne sont pas encore configurées sur ce projet).

-- 1. Table (définition canonique — docs/release/supabase-rls-audit.md §8.1).
CREATE TABLE IF NOT EXISTS public.subscriptions (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'free',
  plan text,
  started_at timestamptz,
  renews_at timestamptz,
  cancelled_at timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 2. Purge de toute policy d'écriture (INSERT/UPDATE/DELETE/ALL) qui aurait
--    été créée à la main — seul le SELECT par propriétaire doit survivre.
DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'subscriptions'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.subscriptions', p.policyname);
  END LOOP;
END $$;

CREATE POLICY "Users read own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Pas de policy INSERT/UPDATE/DELETE : réservé au service role (webhook).

-- 3. Le trigger de création de compte pose profiles ET subscriptions.
--    (Remplace la version §7.1 qui ne créait que profiles.)
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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE event_object_schema = 'auth'
      AND event_object_table = 'users'
      AND trigger_name = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- 4. Backfill : les comptes existants sans row subscriptions (créés quand
--    c'était l'insert client qui la posait, parfois jamais passé).
INSERT INTO public.subscriptions (user_id, status)
SELECT id, 'free' FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- 5. Vérification attendue après application :
--    select policyname, cmd, roles, qual, with_check
--    from pg_policies
--    where schemaname = 'public' and tablename = 'subscriptions';
--    → exactement 1 policy, cmd = SELECT, qual = (auth.uid() = user_id).

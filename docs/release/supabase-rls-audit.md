# Audit RLS Supabase — V1 release readiness

**Date** : 5 juin 2026
**Statut** : Audit à exécuter par Stéphane sur Supabase Dashboard
**Criticité** : 🔴 Bloquant launch — sans RLS, n'importe quel user peut lire/modifier données autres users

---

## 1. Pourquoi RLS critique

Sans Row Level Security activée + policies correctes :
- User A connecté avec son JWT peut lire `profiles` de user B (PII : email, profil dynamique, données santé)
- User A peut écrire dans `progress` de user B → corruption données
- User A peut lire `pillar_evaluations` (scores santé) de tous les autres
- **Violation RGPD majeure** → amendes + perte confiance

RLS = filtre automatique côté Postgres : chaque query SQL est réécrite pour ne renvoyer/modifier que les rows dont `user_id = auth.uid()`.

---

## 2. Tables V1 — état attendu

8 tables utilisées dans le code app (cf. `grep "from('"` dans `src/`) :

| Table | Colonne ownership | RLS attendue |
|---|---|---|
| `profiles` | `id = auth.users.id` | User read/update self only |
| `progress` | `user_id` | User read/write self only |
| `streak_history` | `user_id` | User read/write self only |
| `joker_consumptions` | `user_id` | User read/write self only |
| `tier_reaches` | `user_id` | User read/write self only |
| `pillar_evaluations` | `user_id` | User read/write self only |
| `pillar_sessions` | `user_id` | User read/write self only |
| `level_adaptive_choices` | `user_id` | User read/write self only |

Tables documentées dans Schéma de données V1 mais pas encore utilisées :
- `notifications_sent` — Sprint S1+
- `subscriptions` — Webhook Stripe futur
- `daily_check_ins` — V2 (créée vide)

---

## 3. Procédure audit — étape par étape

### 3.1 Login Supabase Dashboard

1. https://supabase.com/dashboard
2. Sélectionne projet Raw Adventure

### 3.2 Vérif RLS activée — SQL Editor

Colle dans SQL Editor :

```sql
SELECT
  schemaname,
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Résultat attendu** : `rls_enabled = true` pour TOUTES les tables.

Si une ligne montre `false` :
```sql
ALTER TABLE public.<table_name> ENABLE ROW LEVEL SECURITY;
```

### 3.3 Liste policies existantes

```sql
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd AS operation,
  qual AS using_expression,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
```

Vérifie pour chaque table : au moins 1 policy par opération (SELECT, INSERT, UPDATE, DELETE) avec expression `auth.uid()`.

---

## 4. Policies attendues — SQL à appliquer si manquantes

### 4.1 `profiles`

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- INSERT géré par trigger on_auth_user_created (auto)
-- DELETE : pas de policy → personne ne peut delete profiles via API
```

### 4.2 Tables avec `user_id` (7 tables identiques)

Pour chaque table `progress`, `streak_history`, `joker_consumptions`, `tier_reaches`, `pillar_evaluations`, `pillar_sessions`, `level_adaptive_choices` :

```sql
-- Pattern à répéter pour chaque table — remplace <table_name>

ALTER TABLE public.<table_name> ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own <table_name>"
  ON public.<table_name> FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own <table_name>"
  ON public.<table_name> FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own <table_name>"
  ON public.<table_name> FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own <table_name>"
  ON public.<table_name> FOR DELETE
  USING (auth.uid() = user_id);
```

**Note DELETE** : utilisée par `resetAll()` qui supprime toutes les rows de l'user. Doit être autorisé.

---

## 5. Script complet — copier-coller dans SQL Editor

Si tables existent mais policies manquent, voici le script complet :

```sql
-- ========================================
-- RLS V1 Raw Adventure — script complet
-- À exécuter sur Supabase SQL Editor
-- ========================================

-- 1. profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2-8. Tables avec user_id
DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'progress',
    'streak_history',
    'joker_consumptions',
    'tier_reaches',
    'pillar_evaluations',
    'pillar_sessions',
    'level_adaptive_choices'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);

    EXECUTE format('DROP POLICY IF EXISTS "Users read own %I" ON public.%I', t, t);
    EXECUTE format(
      'CREATE POLICY "Users read own %I" ON public.%I FOR SELECT USING (auth.uid() = user_id)',
      t, t
    );

    EXECUTE format('DROP POLICY IF EXISTS "Users insert own %I" ON public.%I', t, t);
    EXECUTE format(
      'CREATE POLICY "Users insert own %I" ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id)',
      t, t
    );

    EXECUTE format('DROP POLICY IF EXISTS "Users update own %I" ON public.%I', t, t);
    EXECUTE format(
      'CREATE POLICY "Users update own %I" ON public.%I FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)',
      t, t
    );

    EXECUTE format('DROP POLICY IF EXISTS "Users delete own %I" ON public.%I', t, t);
    EXECUTE format(
      'CREATE POLICY "Users delete own %I" ON public.%I FOR DELETE USING (auth.uid() = user_id)',
      t, t
    );
  END LOOP;
END $$;
```

---

## 6. Vérification après exécution

### 6.1 Re-run audit

```sql
-- Doit retourner 0 ligne (toutes tables RLS enabled)
SELECT tablename FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = false;
```

### 6.2 Compte policies par table

```sql
SELECT
  tablename,
  COUNT(*) AS num_policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;
```

**Résultat attendu** :
- `profiles` : 2 policies (SELECT, UPDATE)
- `progress` : 4 policies (SELECT, INSERT, UPDATE, DELETE)
- 6 autres tables : 4 policies chacune

Total attendu : 2 + 7×4 = **30 policies**.

### 6.3 Test fonctionnel

Depuis l'app device :
1. Login user A → consulte son profil → OK
2. Tente de fetch un user_id de B → doit retourner `[]` (RLS bloque silencieusement)
3. Tente d'écrire `user_id = userB_id` dans `progress` → doit échouer avec erreur RLS

---

## 7. Cas particuliers à vérifier

### 7.1 Trigger `on_auth_user_created`

Quand Supabase Auth crée un nouvel user (signup), un trigger doit créer la row `profiles` correspondante.

```sql
-- Vérif trigger existe
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth' AND event_object_table = 'users';
```

Si absent, créer :

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, onboarding_done)
  VALUES (NEW.id, false);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 7.2 Service role bypass

Les Edge Functions (futur webhook Stripe) utilisent le **service role key** qui bypass RLS. Garde cette clé en variable d'environnement Edge Function, jamais dans le code client.

### 7.3 Anonymous access

Vérifie qu'aucune policy n'autorise `anon` role :

```sql
SELECT tablename, policyname, roles
FROM pg_policies
WHERE schemaname = 'public' AND 'anon' = ANY(roles);
```

**Résultat attendu** : 0 ligne.

---

## 8. Tables futures — préparation

### 8.1 `subscriptions` (Sprint webhook Stripe)

```sql
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

CREATE POLICY "Users read own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Pas de INSERT/UPDATE/DELETE policy — réservé au service role (webhook Stripe)
```

### 8.2 `notifications_sent` (S1+)

À cadrer plus tard, RLS pattern identique aux tables `user_id`.

---

## 9. Checklist Stéphane

- [ ] Login Supabase Dashboard
- [ ] Run query §3.2 → liste tables sans RLS
- [ ] Run query §3.3 → liste policies actuelles
- [ ] Compare aux §4 attentes
- [ ] Si manquantes : applique script §5
- [ ] Re-run §6.1 et §6.2 pour valider
- [ ] Test fonctionnel §6.3 depuis l'app
- [ ] Vérifie trigger §7.1
- [ ] Vérifie anon §7.3 = 0 ligne
- [ ] Reporte résultats Claude pour update audit

---

## 10. Rapport audit attendu

Quand exécuté, copier-coller dans ce doc :

```
Date audit : YYYY-MM-DD
Tables sans RLS : <count> → <noms ou "none">
Policies totales avant : <count>
Policies totales après : <count>
Trigger on_auth_user_created : présent / absent (créé)
Anon access : 0 / X policies trouvées
Test fonctionnel app : pass / fail (détails)
```

---

*Audit à exécuter avant TestFlight beta launch. Sans RLS valide, ne pas distribuer l'app.*

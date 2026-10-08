# Environnements Supabase — TEST et PROD (R6-2)

*Acté le 7 octobre 2026 (option 1). Règle : la production n'est jamais un terrain de test.*

## Les deux projets

| | TEST | PROD |
|---|---|---|
| Nom Dashboard | Rawadventure World App TEST | Rawadventure World App |
| Référence | `oczteusahpcjzbjrvjfc` | `aknvitrtfxqjdwiyxryt` |
| Région / plan | West EU (Ireland) / Free | West EU (Ireland) / Free (Pro à la bascule live) |
| Qui s'y connecte | dev local (`.env` du Mac), CI GitHub (secrets `EXPO_PUBLIC_SUPABASE_*`), previews Vercel | PWA `app.rawadventure.world` (testeurs beta), builds stores |
| Comptes | demo2 (CI E2E), demo3 (tests manuels Stéphane) — créés 7 oct, auto-confirmés | testeurs beta, anciens comptes demo, futurs clients |
| Emails | SMTP Resend, clé `supabase-smtp-test`, expéditeur « Raw Adventure TEST », 50/h, templates anglais par défaut | SMTP Resend, templates FR |
| Stripe | clés **test** (Edge Functions à déployer, voir § Reste à faire) | clés test jusqu'à R2-14, puis live |
| Vidéos | servies par le bucket public de PROD (URL codée dans `TierReachedModal.tsx`) | bucket `phase0-videos` |

## Schéma

TEST a été créé vierge puis reconstruit à l'identique de PROD avec `supabase/bootstrap/schema-test-from-prod-20261007.sql` (généré depuis l'état réel de PROD après R8-8, pas depuis `docs/migrations`). Vérification du 7 oct : colonnes, contraintes, index, triggers, RLS et 39 policies strictement identiques (diff vide). Une différence volontaire : TEST n'accorde **aucun privilège table au rôle `anon`** (l'app ne lit rien avant connexion). Si TEST tourne sans incident, appliquer la même révocation sur PROD.

**Discipline** : toute migration SQL s'applique désormais deux fois, TEST d'abord, PROD ensuite. Le CLI est lié à un seul projet à la fois : `supabase link --project-ref <ref> -p ""` puis `supabase db query --linked -f <fichier>`. Vérifier `supabase/.temp/project-ref` avant toute commande d'écriture.

## Vérifié le 8 octobre 2026

- Trigger `on_auth_user_created` : demo2 et demo3 ont reçu `profiles` + `subscriptions.status = 'free'` à la création.
- `npx playwright test e2e/auth-hub.spec.ts` en local, `.env` sur TEST : vert ; l'onboarding joué par le test est écrit sur TEST (`profiles.onboarding_done = true` pour demo2), PROD intact.
- Secrets GitHub `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` pointés sur TEST (8 oct).

## Fait le 8 octobre 2026 (suite)

- Vercel : `EXPO_PUBLIC_SUPABASE_*` recréées en type **Config** (le type Secret est refusé pour un préfixe public) — Production → PROD, Preview + Development → TEST. Redéploiement de la PWA vérifié de l'extérieur : le bundle servi référence PROD uniquement.
- Edge Functions déployées sur TEST (`stripe-webhook` sans vérification JWT, `stripe-portal`), secrets `STRIPE_SECRET_KEY` (test) et `STRIPE_WEBHOOK_SECRET` posés via Dashboard. Endpoint Stripe « Raw Adventure Subscriptions (Supabase TEST) », même environnement de test et même version d'API (`2026-05-27.dahlia`) que PROD, 5 événements. Test externe : 400 sans signature / signature invalide, 401 portail sans jeton.
- Le CLI local reste **lié à TEST** par défaut (`supabase/.temp/project-ref`). Pour écrire sur PROD : `supabase link --project-ref aknvitrtfxqjdwiyxryt -p ""` explicitement, puis revenir sur TEST.

## Reste à faire (non bloquant)

- Templates d'emails FR sur TEST : anglais accepté par Stéphane le 8 oct.
- Panneau DEV sur TEST : flagger demo3 (`update public.profiles set dev_tools_enabled = true where id = (select id from auth.users where email = 'stephanetossens+demo3@gmail.com')`).
- Comptes demo restés sur PROD : à supprimer ou garder, au choix de Stéphane.
- À la bascule live (R2-14) : PROD passe en clés Stripe live + endpoint live ; TEST garde test. D'ici là, en mode test, Stripe envoie chaque paiement test aux deux endpoints ; chacun ignore les comptes inconnus (`no user_id found`, sans effet).

## Piège rencontré

Un éditeur qui masque les valeurs de `.env` par des points « • » écrit ces points dans le fichier au collage (clé de 608 caractères au lieu de 208, erreur `String contains non ISO-8859-1 code point` à la connexion). Coller la clé dans un éditeur en texte brut, ou vérifier avec :
`grep -E "^EXPO_PUBLIC_SUPABASE_ANON_KEY=" .env | cut -d= -f2- | wc -c` → 209.

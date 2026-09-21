# Audit Lou Grenier — rdv du 9 septembre 2026

*Analyse du transcript du rdv (58 min, transcription whisper locale). Le rapport écrit de Lou est attendu — ce document consigne ce qui a été dit, confronté à l'état réel du code au 16 septembre 2026. Aucune modification de code n'a été faite sur cette base. Les chantiers seront lancés après réception du rapport et arbitrage de Stéphane.*

---

## 1. Points confirmés dans le code (actionnables)

### 1.1 ESLint absent — cause n°1 du « cycle de bugs » selon Lou

**Constat vérifié** : aucun `.eslintrc*` ni `eslint.config.*` dans le repo, pas d'ESLint dans `package.json`.

**Ce que dit Lou** : les violations des règles des hooks React (hooks enchaînés, dépendances manquantes) sont la première cause des bugs qui reviennent en cascade. Les tests passent car l'environnement de test est isolé et répond instantanément — le linter, lui, attrape la syntaxe fautive à chaque sauvegarde.

**Instruction** : installer ESLint + `eslint-plugin-react-hooks` (+ plugins jugés nécessaires pour Expo/TS), l'ajouter au hook pre-commit (`.githooks/pre-commit`, à côté de tsc + jest) et à la CI (`.github/workflows/tests.yml`).

**Note** : dépendance npm → validation Stéphane requise avant install (règle CLAUDE.md § 5). Premier run révélera probablement un backlog de warnings à traiter par vagues.

### 1.2 ProgressContext = « god context »

**Constat vérifié** : `src/hooks/ProgressContext.tsx` fait **1384 lignes, 17 `useState`, 7 `useEffect`**, et le `value` du Provider est un **objet littéral inline non mémoïsé** (ligne ~1336). Chaque changement d'état re-render tout l'arbre consommateur.

**Ce que dit Lou** (chiffres de son audit : « 1400 lignes, 30 états, 7 effets » — ordre de grandeur confirmé) : c'est la seconde cause du cycle de bugs, combinée aux race conditions (requêtes parallèles à vitesses de réponse variables, cas 23h59 → minuit avec rechargement de contexte).

**Instruction** (gros chantier — attendre le rapport de Lou avant de lancer) :
- Découper le god context en contextes par domaine (ex. position/parcours, streak/paliers, évaluations/sessions) selon un flow naturel.
- Mémoïser les `value` des Providers.
- Réduire les chaînes d'effets ; le linter react-hooks servira de garde-fou pendant le découpage.
- Chantier à faire en tracer bullet (règle TDD 6), en s'appuyant sur la suite existante (466 tests) comme filet. Le commentaire D38 en tête de ProgressContext doit survivre au découpage.

### 1.3 Sécurité paywall : vérification côté front + contenu payant dans le bundle

**Constat vérifié** : tout le contenu Phase 1 (programmes S1-S8) vit dans `src/data/*.ts`, embarqué dans le bundle JS. Le gating d'abonnement est dans `SubscriptionContext` (front-end). Quelqu'un qui s'y connaît peut couper le réseau, ouvrir la console navigateur et accéder au contenu post-paiement.

**Ce que dit Lou** : pas grave, pas un gros changement, pas besoin de changer de stack — mais à corriger avant un vrai lancement public. Il enverra le détail de quoi dire à Claude.

**Instruction** (attendre le détail de Lou) : déplacer la vérification d'abonnement côté serveur (Supabase RLS / Edge Functions) et/ou servir le contenu payant depuis le serveur après vérification, plutôt que de tout embarquer. À arbitrer contre l'architecture actuelle (D28 local-first, contenu statique dans `src/data/`).

---

## 2. Points vrais mais déjà connus / en cours

### 2.1 Outils de dev visibles « en production »

Lou a vu le panel DEV sur le lien qu'on lui a envoyé. Vérifié : les outils sont gatés par `isDevToolsEnabled()` (`src/lib/devToolsEnabled.ts`) = `__DEV__` **ou** `EXPO_PUBLIC_ENABLE_DEV_PANEL === 'true'` — flag actuellement actif sur le build Vercel pour les testeurs. C'est le point déjà tracé **R4 = K1** (retrait du panel DEV avant bascule clés Stripe live). Rien de nouveau, mais confirme qu'il faut le faire avant ouverture publique.

### 2.2 Tester en local plutôt qu'en prod (environnements)

Lou recommande : dev local sur l'ordinateur (retour immédiat, pas de déploiement à 5 min par itération), staging plus tard, prod jamais utilisée comme terrain de test. Chrome + vue téléphone pour tester.

État réel : l'app tourne déjà en local (`npx expo start`, presets DEV, comptes `+demo`). Le point de Lou vise surtout la **pratique de Stéphane** (tester sur le lien Vercel déployé) — pratique à changer, pas le code. Les clés Stripe test/live sont déjà distinguées (bascule tracée dans R4).

### 2.3 Temporalité : time freeze + faux utilisateurs antidatés

Lou : ne jamais changer la date de l'ordinateur ; les tests doivent mentir sur la date (time freeze) ou créer des utilisateurs antidatés (créé il y a N jours) ; les boutons « passer un jour » créent des bugs artificiels.

État réel : déjà en place — `devClock` (horloge épinglée, `pinClockTo` dans le harnais de tests), presets DEV antidatés, comptes `email+N`. Le cas 23h59 → minuit est un choix produit déjà cadré par D38 (position par validation). Rien à faire de neuf côté code ; éventuellement demander à Claude un inventaire de la couverture jour-par-jour de la temporalité (J1→J14) et un run E2E en navigateur visible si Stéphane veut « voir » les 14 jours défiler.

### 2.4 Tracer bullet, gestion de tâches, sous-tâches

Lou recommande tracer bullets (déjà règle TDD 6 du CLAUDE.md § 7), un gestionnaire de tâches connecté à Claude (déjà en place : kanban local + miroir Trello via `kanban/push-trello.py`), et le pattern « une conversation = plan global, sous-tâches en conversations dédiées, "on en était où ?" pour recadrer ». Process, pas code.

---

## 3. Points non confirmés — attendre le rapport écrit

### 3.1 « Pas de vérification d'erreur au sign-up »

Vérifié dans `src/screens/v1/RegisterScreen.tsx` : les erreurs de `signInWithPassword`, `signUpWithPassword` et `resetPasswordForEmail` sont toutes gérées (Alert + message). L'affirmation de l'audit de Lou ne colle pas à l'état actuel — soit elle vise un chemin précis (ex. échec d'insertion du profil après création auth, échec de migration locale→distante), soit son audit date d'un état antérieur. **À clarifier avec son rapport avant d'agir.**

### 3.2 « La moitié des états utilisateur uniquement dans le navigateur »

Partiellement structurel : D28 (local-first) assume que des états vivent en AsyncStorage, et la migration locale→distante (M7+A3) est implémentée pour profil + progression. Mais un inventaire clé par clé (quoi est local-only, quoi est répliqué dans Supabase, conséquence si l'utilisateur change de téléphone) vaut la peine. **Attendre la liste précise de Lou**, puis auditer les clés AsyncStorage restantes.

### 3.3 « 20 hooks à la suite »

Non localisé précisément dans le transcript. Le premier run d'ESLint react-hooks (§ 1.1) donnera la liste exacte des violations — inutile de chercher à la main avant.

---

## 4. Recommandations hors-code (process, pour Stéphane)

- **Feature flags** : protéger les nouvelles features par flag, activation par compte/groupe, désactivation instantanée en cas de bug sans redéploiement. Pertinent post-lancement — V2, pas maintenant.
- **Côté admin dans l'app** : alternative légère au staging. Le panel DEV actuel joue déjà ce rôle ; la piste « whitelist par email » est déjà notée en commentaire dans `devToolsEnabled.ts`.
- **Communication avec Claude** : donner du contexte (« je corrige un bug, trois reviennent ») plutôt que des ordres secs ; repasser en plan avant chaque correction plutôt que d'enchaîner en auto ; dire « je ne suis pas ingénieur, parle-moi simplement » (déjà la règle plain-language du CLAUDE.md § 1).
- **Période d'essai 14 jours** = cycle de feedback d'un mois sur tout changement d'activation/conversion. Point de vigilance produit, pas de code.

---

## 5. Ordre proposé (à valider par Stéphane, après réception du rapport de Lou)

1. **ESLint + react-hooks en pre-commit + CI** (§ 1.1) — petit, sans risque produit, prérequis du reste. Peut se faire dès validation, sans attendre le rapport.
2. **Triage du backlog ESLint** — corriger les violations react-hooks par vagues, tests verts à chaque vague.
3. **Découpage ProgressContext** (§ 1.2) — gros chantier, en tracer bullet, après 1-2 et après lecture du rapport de Lou.
4. **Gating serveur du contenu payant** (§ 1.3) — avec le détail que Lou enverra ; à coordonner avec R4 (retrait panel DEV + clés Stripe live) avant toute ouverture publique.
5. **Inventaire AsyncStorage local-only vs Supabase** (§ 3.2) — avec la liste de Lou.

*Transcript source : extrait de l'enregistrement du 9 sept (whisper large-v3-turbo). Fichiers de travail en scratchpad de session, non conservés dans le repo.*

---

## Addendum — exécution (à partir du 19 sept 2026)

Rapport écrit de Lou reçu le 19 sept (F-01 à F-17). Plan d'exécution approuvé, suivi kanban bloc R11.

**Vérification F-09 (21 sept 2026).** Migration `supabase/migrations/20260919_f09_subscriptions_rls.sql` appliquée par Stéphane dans le SQL Editor. Résultat de la requête de vérification `pg_policies` sur `public.subscriptions` :

| policyname | cmd | roles | qual | with_check |
|---|---|---|---|---|
| Users read own subscription | SELECT | {public} | (auth.uid() = user_id) | NULL |

Exactement une policy, SELECT only, par propriétaire — conforme à l'attendu du rapport (§ F-09). Le scénario « update depuis la console navigateur » est fermé côté base ; les écritures client avaient été retirées du code au commit `502a186`.

# Raw Adventure App — Schéma de données V1

**Version :** 1.1 (patch en sortie de production Feature Spec S1 — succède à V1.0 du 8 mai 2026)
**Date :** 8 mai 2026 (création V1.0) / 13 mai 2026 (patch V1.1 — ajout table `notifications_sent` + vérifications)
**Auteur :** Stéphane (avec assistance Claude)
**Statut :** Document de cadrage technique. Sert de référence à Claude Code pour la création / migration des tables Supabase de la V1.
**Lecteur cible :** Stéphane (validation produit) et Claude Code (exécution dev).
**Documents de référence :** Information Architecture V1 V3, Feature Spec V1 Socle minimum V1.1, Métriques V1 V1.5, Synthèse des décisions V8, Feature Spec S1 Respiration V1.0.

**Historique des versions.**

**V1.0 — 8 mai 2026.** Création du document. Stratégie hybride local + Supabase actée. Tables `profiles` et `progress` héritées du V0. Sept nouvelles tables cadrées pour la V1 (`pillar_evaluations`, `pillar_sessions`, `level_adaptive_choices`, `tier_reaches`, `streak_history`, et tables transverses). Mécaniques de validation Phase 0 (joker hebdomadaire calendaire) et Phase 1 (1 session sur 3 valide la journée) cadrées en § 5.

**V1.1 — 13 mai 2026.** Patch en sortie de production de la Feature Spec S1 Respiration. **Ajout de la table `notifications_sent`** (cf. § 2.X nouvelle, ci-dessous) pour tracer les notifications envoyées aux utilisateurs, éviter les doublons et alimenter les analytics V1. **Vérification du champ `duration_seconds` dans `pillar_sessions`** : déjà présent en V1.0 (§ 2.5 ligne 212), aucune modification structurelle nécessaire — le champ supporte le besoin Feature Spec S1 de tracer la durée effective d'une session pour le récap IA-47 et pour gérer les changements de niveau en cours de semaine. Aucune autre modification de V1.0.

---

## Préambule

Ce document définit le **schéma de données** de Raw Adventure App pour la V1. Il documente l'état des tables Supabase actuelles (héritage du V0 codé) et liste les tables à créer pour supporter la V1 complète (Phase 0 calendaire avec streak/joker, Phase 1 avec évaluations 12 questions et sessions par pilier, paliers de récompense streak).

**Principe directeur D28 — Storage local-only en V1 (clarification post-audit V0).** La V1 ne fait **pas de backend cloud lourd**. La synchronisation multi-appareil n'est pas un objectif V1, la perte de données à la désinstallation est acceptée comme un signal volontaire de désengagement. Cependant, le V0 actuel utilise déjà Supabase pour deux fonctions essentielles : (a) l'authentification utilisateur (gérée par Supabase Auth, pas de stockage manuel), (b) la persistance distante minimale du profil et de la progression (tables `profiles` et `progress`). Cette persistance Supabase reste **compatible avec D28 en pratique** : Supabase sert de "cloud minimal" qui permet à l'utilisateur de retrouver sa progression s'il réinstalle l'app sur le même téléphone (ce qui est plus rare qu'un changement de téléphone). La désinstallation reste un signal fort, mais on évite les pertes accidentelles de progression dues à des bugs de l'app qui videraient l'AsyncStorage.

**Stratégie hybride local + Supabase.** Le `ProgressContext` du V0 implémente déjà cette stratégie hybride : si l'utilisateur est connecté (`useAuth().user` non null), les lectures et écritures vont vers Supabase ; sinon (mode anonyme pendant l'onboarding), les données vivent en AsyncStorage et sont migrées vers Supabase au moment de la création de compte (mécanique M7 + A3 documentée dans Feature Spec V1.1 § 2.10). Cette stratégie est conservée pour la V1 et étendue aux nouvelles tables.

**Anti-scope.** Ce document ne traite **pas** les sujets suivants : (a) les schémas de données pour la V2 (intégration habitudes 9 mois thématiques) sauf une table vide réservée, (b) les détails d'implémentation des migrations Supabase (création des tables se fait via le dashboard Supabase ou via les outils CLI Supabase, pas via du code applicatif), (c) la gestion des médias vidéo et audio (qui passent par un CDN externe, pas par les tables Supabase), (d) le détail de l'intégration de la passerelle de paiement (Stripe / RevenueCat à arbitrer en Feature Spec abonnement dédiée).

---

## 1. Tables actuelles V0 (Supabase)

### 1.1. Table `profiles`

**Rôle.** Stocke le profil utilisateur (résultat de l'onboarding) et l'état du flag onboarding terminé.

**Schéma actuel V0 (déduit du code `ProgressContext.tsx`).**

| Colonne | Type | Contraintes | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, FK → `auth.users.id` | Identifiant utilisateur Supabase Auth |
| `onboarding_done` | `boolean` | default `false` | Flag : l'utilisateur a-t-il terminé l'onboarding ? |
| `onboarding_data` | `jsonb` | default `{}` | Réponses du questionnaire 4 dimensions (Record `{ dimensionId: 'low' | 'high' }` ou similaire selon l'implémentation V0) |

**Politique RLS attendue.** Un utilisateur peut lire et modifier **uniquement sa propre ligne** (filtre `auth.uid() = id`).

**Évolutions V1 (à appliquer).**

Aucune évolution structurelle du schéma actuel n'est strictement nécessaire pour la V1 si on continue à stocker les 4 réponses brutes en `onboarding_data` (jsonb). Néanmoins, deux ajouts utiles sont recommandés pour la lisibilité et la performance des requêtes futures :

- **Ajouter une colonne `profile_dynamic_id`** de type `text` ou `enum`, qui stocke l'identifiant du profil dynamique calculé à l'onboarding (par exemple `P1`, `P2`, ..., `P8`, `P0` pour défaut). Cette colonne est calculée à partir d'`onboarding_data` au moment de `completeOnboarding()` et stockée pour éviter de recalculer à chaque ouverture. Conformément à la décision A3.1 V0.2 résolue (les 8 profils sont la grille validée).
- **Ajouter une colonne `account_created_at`** de type `timestamptz` (timezone-aware), qui fixe le démarrage de la Phase 0 (J1 = jour calendaire local de cette valeur). Conformément à la décision D24 (démarrage différé optionnel) et à la mécanique M2 calendaire.

**Schéma cible V1.**

| Colonne | Type | Contraintes | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, FK → `auth.users.id` | Inchangé |
| `onboarding_done` | `boolean` | default `false` | Inchangé |
| `onboarding_data` | `jsonb` | default `{}` | Inchangé |
| `profile_dynamic_id` | `text` | default `null` | Nouveau — `P0` à `P8` |
| `account_created_at` | `timestamptz` | default `null` | Nouveau — démarrage de la Phase 0 |

### 1.2. Table `progress`

**Rôle.** Stocke pour chaque utilisateur la liste des jours validés en Phase 0, avec un flag `is_minimum` qui signale les validations en mode minimum (joker consommé ou validation sous le seuil acceptable).

**Schéma actuel V0 (déduit du code `ProgressContext.tsx`).**

| Colonne | Type | Contraintes | Notes |
|---|---|---|---|
| `user_id` | `uuid` | FK → `auth.users.id`, partie de PK composite | Identifiant utilisateur |
| `day_id` | `integer` | partie de PK composite | Numéro du jour de Phase 0 (1 à 14) |
| `is_minimum` | `boolean` | default `false` | Validation en mode minimum (joker consommé) |

**Note.** La PK composite `(user_id, day_id)` est utilisée par le `upsert` avec `onConflict: 'user_id,day_id'` dans `completeDay()`. Une ligne par jour validé par utilisateur, avec idempotence garantie.

**Politique RLS attendue.** Un utilisateur peut lire et modifier uniquement les lignes où `auth.uid() = user_id`.

**Évolutions V1 (à appliquer).**

La logique actuelle (un booléen `is_minimum` qui couvre le cas joker) est insuffisante pour la V1 qui distingue plusieurs cas de validation (au-dessus du seuil 5/7, sous le seuil avec joker, sous le seuil sans joker = streak cassé). Deux options.

**Option A — Conserver `progress` minimaliste, déporter le détail vers `streak_history`.** La table `progress` reste à peu près telle quelle (peut-être avec un champ `validated_actions_count` pour le score transitoire de la Phase 0), et toute la mécanique fine de validation/streak/joker passe par la nouvelle table `streak_history` (cf. § 2.1). Avantage : la table `progress` reste simple, lisible. Inconvénient : on duplique partiellement les données.

**Option B — Refondre `progress` en table riche.** Ajouter des colonnes `validated_at` (timestamptz), `actions_count` (integer 0-7 pour Phase 0, 0-3 pour Phase 1), `phase` (text, 'phase_0' ou 'phase_1'), `validation_status` (text, 'valid_above_threshold' / 'valid_with_joker' / 'broken_streak'). Avantage : tout est dans une table cohérente. Inconvénient : table volumineuse, RLS plus complexe à écrire.

**Recommandation produit V1.** **Option A**. Conserver `progress` simple et déporter la mécanique fine vers `streak_history`. C'est plus modulaire, plus facile à étendre en V2, et c'est aligné sur la stratégie "tables fines avec une responsabilité claire" qui marche bien sur Supabase.

**Schéma cible V1 (Option A).**

| Colonne | Type | Contraintes | Notes |
|---|---|---|---|
| `user_id` | `uuid` | FK + PK composite | Inchangé |
| `day_id` | `integer` | PK composite | Inchangé |
| `is_minimum` | `boolean` | default `false` | Inchangé pour rétrocompat — pourra être déprécié en V1.5 |
| `actions_count` | `integer` | default `0`, check `actions_count >= 0 AND actions_count <= 7` | Nouveau — score transitoire D34 |
| `validated_at` | `timestamptz` | default `now()` | Nouveau — moment de la validation |

---

## 2. Tables à créer pour la V1

### 2.1. Table `streak_history`

**Rôle.** Historique fin du streak quotidien sur tout le parcours (Phase 0 + Phase 1). Une ligne par jour calendaire local par utilisateur. Permet de calculer à tout moment le streak courant, le streak record, et de débloquer les paliers de récompense.

**Schéma.**

| Colonne | Type | Contraintes | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Identifiant unique de la ligne |
| `user_id` | `uuid` | FK → `auth.users.id`, indexé | Identifiant utilisateur |
| `local_date` | `date` | NOT NULL, indexé | Date calendaire locale du jour (YYYY-MM-DD) |
| `validation_status` | `text` | NOT NULL, check valeurs | `'valid_above_threshold'`, `'valid_with_joker'`, `'broken_streak'`, `'not_yet_processed'` |
| `phase` | `text` | NOT NULL, check valeurs | `'phase_0'`, `'phase_1'` |
| `streak_value_after` | `integer` | NOT NULL, default `0` | Valeur du streak après ce jour |
| `joker_used` | `boolean` | default `false` | Le joker a-t-il été consommé pour préserver ce jour ? |
| `created_at` | `timestamptz` | default `now()` | Moment de création de la ligne |

**Contrainte d'unicité.** Index unique sur `(user_id, local_date)` — une seule ligne par utilisateur par jour calendaire local.

**Politique RLS.** Un utilisateur peut lire et modifier uniquement ses propres lignes (`auth.uid() = user_id`).

**Notes pour le dev.** La fonction de cohérence à la prochaine ouverture après minuit (Feature Spec V1.1 § 2.5) traite les jours `'not_yet_processed'` et bascule leur statut vers la valeur définitive selon la mécanique joker. Le `streak_value_after` est calculé séquentiellement à partir des jours précédents.

### 2.2. Table `joker_consumptions`

**Rôle.** Enregistre les consommations du joker hebdomadaire, en semaine calendaire fixe (lundi 00:00 → dimanche 23:59 fuseau local). Une ligne par consommation. Permet de répondre à la question "le joker est-il dispo cette semaine ?" en O(1) avec un index sur `(user_id, week_key)`.

**Schéma.**

| Colonne | Type | Contraintes | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Identifiant unique |
| `user_id` | `uuid` | FK → `auth.users.id`, indexé | Identifiant utilisateur |
| `week_key` | `text` | NOT NULL | Identifiant semaine ISO 8601 (par exemple `2026-W19`) |
| `consumed_for_local_date` | `date` | NOT NULL | Date calendaire locale pour laquelle le joker a été consommé |
| `consumed_at` | `timestamptz` | default `now()` | Moment de la consommation |

**Contrainte d'unicité.** Index unique sur `(user_id, week_key)` — un seul joker par utilisateur par semaine calendaire.

**Politique RLS.** Idem.

**Notes pour le dev.** Le `week_key` est calculé à partir de `consumed_for_local_date` par une fonction utilitaire. La requête de disponibilité du joker pour la semaine courante : `SELECT EXISTS(SELECT 1 FROM joker_consumptions WHERE user_id = auth.uid() AND week_key = $current_week_key)`.

### 2.3. Table `tier_reaches`

**Rôle.** Enregistre les franchissements des paliers de récompense streak (7j, 15j, 30j, 60j, 100j, 1 an). Permet de gérer la décision D29 (premier franchissement avec vidéo dédiée, redéclenchements allégés sans vidéo) via un compteur `reach_count` par palier par utilisateur.

**Schéma.**

| Colonne | Type | Contraintes | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Identifiant unique |
| `user_id` | `uuid` | FK → `auth.users.id`, indexé | Identifiant utilisateur |
| `tier_id` | `integer` | NOT NULL, check valeurs | `7`, `15`, `30`, `60`, `100`, `365` (en jours) |
| `reached_at` | `timestamptz` | default `now()` | Moment du franchissement |
| `reach_count` | `integer` | NOT NULL, default `1` | Nombre de fois ce palier a été atteint par cet utilisateur |
| `streak_value_at_reach` | `integer` | NOT NULL | Valeur du streak au moment du franchissement |

**Contrainte d'unicité.** Pas d'unicité sur `(user_id, tier_id)` — un utilisateur peut franchir plusieurs fois le même palier après cassures et reprises. Mais le compteur `reach_count` agrège.

**Note alternative.** On peut aussi modéliser ça avec une seule ligne par `(user_id, tier_id)` et un `upsert` qui incrémente `reach_count` à chaque franchissement. Plus économe en lignes, plus simple à requêter pour savoir si c'est un premier franchissement (`reach_count == 1`). À privilégier.

**Schéma alternatif (recommandé).**

| Colonne | Type | Contraintes | Notes |
|---|---|---|---|
| `user_id` | `uuid` | FK + PK composite | Identifiant utilisateur |
| `tier_id` | `integer` | PK composite, check valeurs | `7`, `15`, `30`, `60`, `100`, `365` |
| `first_reached_at` | `timestamptz` | NOT NULL | Premier franchissement |
| `last_reached_at` | `timestamptz` | NOT NULL | Dernier franchissement (mis à jour à chaque reach) |
| `reach_count` | `integer` | NOT NULL, default `1` | Compteur (`tier{N}ReachedCount` de D29) |

**Politique RLS.** Idem.

### 2.4. Table `pillar_evaluations`

**Rôle.** Stocke les résultats des évaluations 12 questions pour chaque pilier de Phase 1 (initiale en début de semaine, finale en fin de semaine). Conformément aux décisions B1 et B2 et au format Métriques V1 V1.0 § 2.

**Schéma.**

| Colonne | Type | Contraintes | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Identifiant unique |
| `user_id` | `uuid` | FK → `auth.users.id`, indexé | Identifiant utilisateur |
| `pillar_id` | `text` | NOT NULL, check valeurs | `'S1'` à `'S8'` |
| `evaluation_type` | `text` | NOT NULL, check valeurs | `'initial'` ou `'final'` |
| `responses` | `jsonb` | NOT NULL | Tableau des 12 réponses : `[{ question_id, value: 1-5 }, ...]` |
| `raw_score` | `integer` | NOT NULL, check `raw_score >= 12 AND raw_score <= 60` | Somme des 12 réponses |
| `normalized_score` | `numeric(5,2)` | NOT NULL, check `normalized_score >= 0 AND normalized_score <= 100` | Score branche 0-100 |
| `diagnostic_level` | `integer` | NOT NULL, check `diagnostic_level >= 1 AND diagnostic_level <= 5` | Diagnostic 5 niveaux |
| `engagement_level_recommended` | `text` | NOT NULL, check valeurs | `'essentiel'`, `'progression'`, `'immersion'` |
| `engagement_level_chosen` | `text` | NOT NULL, check valeurs | Idem (peut différer de la recommandation si l'utilisateur a modifié manuellement) |
| `completed_at` | `timestamptz` | default `now()` | Moment de complétion de l'évaluation |

**Contrainte d'unicité.** Index unique sur `(user_id, pillar_id, evaluation_type)` — une seule évaluation initiale et une seule finale par pilier par utilisateur. Si l'utilisateur refait l'évaluation (cas marginal V1, à clarifier), on `upsert` plutôt que de créer une nouvelle ligne.

**Politique RLS.** Idem.

**Notes pour le dev.** Le `engagement_level_chosen` est égal au `engagement_level_recommended` par défaut. Il est mis à jour si l'utilisateur modifie manuellement son niveau via IA-41 ou IA-42. Le `normalized_score` est calculé par la formule `(raw_score - 12) × (100 / 48)` (Métriques V1 V1.0 § 2.3).

### 2.5. Table `pillar_sessions`

**Rôle.** Enregistre chaque session pratiquée en Phase 1 (3 sessions par jour × 7 jours × 8 piliers = 168 sessions max par utilisateur sur la durée totale de la Phase 1).

**Schéma.**

| Colonne | Type | Contraintes | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Identifiant unique |
| `user_id` | `uuid` | FK → `auth.users.id`, indexé | Identifiant utilisateur |
| `pillar_id` | `text` | NOT NULL, check valeurs | `'S1'` à `'S8'` |
| `day_in_week` | `integer` | NOT NULL, check `day_in_week >= 1 AND day_in_week <= 7` | Jour dans la semaine du pilier |
| `session_index` | `integer` | NOT NULL, check `session_index >= 1 AND session_index <= 3` | 1ère, 2ème ou 3ème session du jour |
| `local_date` | `date` | NOT NULL | Date calendaire locale |
| `completed_at` | `timestamptz` | default `now()` | Moment de complétion |
| `duration_seconds` | `integer` | default `null` | Durée effective de la session (optionnel, à utiliser si l'app track le temps) |

**Contrainte d'unicité.** Index unique sur `(user_id, pillar_id, day_in_week, session_index)` — chaque session est unique.

**Politique RLS.** Idem.

### 2.6. Table `level_adaptive_choices`

**Rôle.** Enregistre chaque choix de niveau adaptatif (`Moins`/`Pareil`/`Plus`) effectué via la modale IA-44, pour analyse future et déclenchement éventuel des messages contextuels d'adaptation messagée (D31 enrichi).

**Schéma.**

| Colonne | Type | Contraintes | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Identifiant unique |
| `user_id` | `uuid` | FK → `auth.users.id`, indexé | Identifiant utilisateur |
| `pillar_id` | `text` | NOT NULL, check valeurs | `'S1'` à `'S8'` (ou identifiant Phase 0 si applicable) |
| `session_id` | `uuid` | FK → `pillar_sessions.id`, default `null` | Lien vers la session concernée (Phase 1 uniquement) |
| `choice` | `text` | NOT NULL, check valeurs | `'less'`, `'same'`, `'more'` |
| `chosen_at` | `timestamptz` | default `now()` | Moment du choix |

**Politique RLS.** Idem.

**Notes pour le dev.** Cette table sert principalement à deux usages : (a) déclencher les messages de suggestion d'adaptation après N choix `'less'` consécutifs (D31 enrichi, calibration du seuil N à arbitrer), (b) analyser en V2 les patterns d'utilisation pour calibrer les niveaux par défaut. En V1, l'écriture est systématique mais la lecture est limitée au compteur de choix `'less'` récents.

### 2.7. Table `notifications_sent`

**Rôle.** Enregistre chaque notification push envoyée à un utilisateur — utile pour ne pas renvoyer la même notification deux fois, pour respecter le plafond 1 notification/jour en Phase 1, et pour alimenter les analytics V1 (taux d'ouverture, calibrage du programme de notifications par pilier).

**Cadrée en V1.1 sur la base de la Feature Spec S1 Respiration § 8.4. S'applique à toutes les notifications V1 : rappel quotidien Phase 0, rappel quotidien par pilier en Phase 1, célébrations de paliers de streak, alertes joker, retour après absence, messages de fond pédagogiques.**

**Schéma.**

| Colonne | Type | Contraintes | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Identifiant unique |
| `user_id` | `uuid` | FK → `auth.users.id`, indexé | Identifiant utilisateur |
| `notification_slot` | `text` | NOT NULL, indexé | Identifiant logique du slot (par exemple `'notification.s1.rappel-quotidien-matin'`, `'notification.s1.message-fond-1'`, `'notification.tier.7j'`, etc.). Convention de nommage cadrée dans les Feature Specs piliers et Feature Spec V1 Socle minimum. |
| `phase` | `text` | check valeurs | `'phase_0'` ou `'phase_1'` — utile pour les analytics et pour vérifier le plafond 1/jour en Phase 1 |
| `pillar_id` | `text` | check valeurs, default `null` | `'S1'` à `'S8'` si la notification est associée à un pilier, `null` pour les notifications transverses (paliers globaux, retour après absence) |
| `sent_at` | `timestamptz` | default `now()` | Moment d'envoi côté serveur |
| `opened_at` | `timestamptz` | default `null` | Moment d'ouverture de la notification par l'utilisateur (déduit du clic sur la notification, peut rester `null` si la notification n'est pas ouverte) |
| `dismissed_at` | `timestamptz` | default `null` | Moment de dismiss explicite par l'utilisateur (swipe sans ouverture, peut rester `null`) |

**Politique RLS.** Idem aux autres tables — l'utilisateur ne voit que ses propres lignes, pas de lecture cross-utilisateurs.

**Index recommandés.** `(user_id, sent_at DESC)` pour la lecture du dernier envoi par utilisateur, `(user_id, notification_slot, sent_at DESC)` pour vérifier rapidement si un slot précis a déjà été envoyé.

**Notes pour le dev.** Trois usages V1 :
- **Plafond 1 notification/jour en Phase 1** (Métriques V1.4 § ... et IA V1). Avant d'envoyer une nouvelle notification à un utilisateur en Phase 1, le serveur lit `notifications_sent` pour vérifier qu'aucune notification n'a été envoyée dans les dernières 24h (en heure locale utilisateur). Si oui, l'envoi est skippé.
- **Éviter les doublons de slot.** Certains slots sont à envoi unique (par exemple `'notification.tier.7j'` ne doit être envoyé qu'une fois par utilisateur). Le serveur vérifie l'existence d'une ligne `(user_id, notification_slot)` avant d'envoyer.
- **Analytics V1.** À la fin de chaque pilier ou de chaque palier de streak, comptage du taux d'ouverture des notifications associées pour ajuster le programme V2.

**Évolutivité V2.** Champs potentiels à ajouter sans patch structurel : `template_version` (pour A/B test des wordings), `delivery_status` (delivered / failed / clicked), `metadata` jsonb pour des contextes spécifiques.

---

## 3. Table réservée pour la V2

### 3.1. Table `daily_check_ins` (vide en V1, créée pour réserver le nom)

**Rôle V2.** Stockera les résultats du questionnaire de fin de journée (matière Jacky existante, différée par décision D36). Pas utilisée en V1, mais on crée la table avec un schéma minimal pour réserver le nom et éviter les collisions futures.

**Schéma minimal V1 (table créée, pas de colonnes métier en V1).**

| Colonne | Type | Contraintes | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Identifiant unique |
| `user_id` | `uuid` | FK → `auth.users.id` | Identifiant utilisateur |
| `local_date` | `date` | NOT NULL | Date calendaire locale |
| `created_at` | `timestamptz` | default `now()` | Moment de création |

**Note.** Les colonnes métier (réponses au questionnaire, scores, ressentis) seront ajoutées en V2 quand la décision D36 sera levée. La table existe en V1 vide pour signaler explicitement qu'elle est prévue dans le schéma global.

**Politique RLS.** Idem (déjà appliquée même si la table est vide).

---

## 4. Politiques RLS Supabase (Row Level Security)

**Principe général.** Toutes les tables de données utilisateur ont la RLS activée. Toutes les politiques suivent le même modèle : un utilisateur authentifié ne peut lire et modifier que ses propres lignes.

**Politique-type pour chaque table.**

```sql
-- Activation de la RLS
ALTER TABLE [nom_de_table] ENABLE ROW LEVEL SECURITY;

-- Politique de lecture
CREATE POLICY "Users can read their own rows"
  ON [nom_de_table] FOR SELECT
  USING (auth.uid() = user_id);

-- Politique d'insertion
CREATE POLICY "Users can insert their own rows"
  ON [nom_de_table] FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politique de mise à jour
CREATE POLICY "Users can update their own rows"
  ON [nom_de_table] FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Politique de suppression
CREATE POLICY "Users can delete their own rows"
  ON [nom_de_table] FOR DELETE
  USING (auth.uid() = user_id);
```

**Cas particulier de `profiles`.** La colonne d'identification est `id` (et non `user_id`), parce que `id` est directement la FK vers `auth.users.id`. Adapter les politiques :

```sql
CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- ... idem pour insert / update / delete
```

**Note de sécurité.** L'audit V0 a identifié que la clé Supabase (`SUPABASE_ANON`) est hardcodée dans `src/lib/supabase.ts` du V0. C'est une `anon` key (clé publique, limitée par les politiques RLS), donc moins critique qu'une `service_role` key qui serait exposée — mais la bonne pratique reste de l'externaliser en variables d'environnement Expo via `app.config.ts` avec les noms `EXPO_PUBLIC_SUPABASE_URL` et `EXPO_PUBLIC_SUPABASE_ANON_KEY`. Charge code estimée 30 minutes (cf. CLAUDE.md V1.2 section 5).

---

## 5. Flux de données — Qui écrit quoi, quand, depuis quel écran

Cette section trace les principaux flux de lecture/écriture entre code applicatif et tables Supabase. Sert de référence à Claude Code pour identifier où implémenter chaque mécanique.

### 5.1. Onboarding et création de compte

**Avant création de compte (mode anonyme).** Lectures et écritures dans AsyncStorage uniquement (4 clés `LOCAL_KEYS` du `ProgressContext`). Aucune interaction avec Supabase.

**À la création de compte (IA-10).** L'utilisateur valide email/mot de passe ou SSO. Supabase Auth crée la ligne dans `auth.users`. Le trigger Supabase (à mettre en place) ou le code applicatif crée immédiatement après une ligne dans `profiles` avec `id = auth.users.id`. Puis migration des 4 clés AsyncStorage vers Supabase (Feature Spec V1.1 § 2.10) : `onboarding_done`, `onboarding_data`, `profile_dynamic_id` (calculé à la volée), `account_created_at` (= `now()` ou `startOfNextLocalDay()` selon D24) sont écrits dans `profiles`. Les `completed_days` (généralement vide à la création de compte) sont écrits dans `progress` via `upsert`. Les 4 clés AsyncStorage sont effacées une fois l'écriture distante confirmée.

### 5.2. Validation quotidienne (modale IA-15)

**Cas Phase 0 — au-dessus du seuil 5/7.** Le `ProgressContext.completeDay()` est appelé avec `day` et `isMinimum = false`. Écritures :
- `progress` : ligne créée ou mise à jour avec `(user_id, day_id, is_minimum=false, actions_count, validated_at)`.
- `streak_history` : ligne créée pour le jour calendaire local avec `validation_status = 'valid_above_threshold'`, `streak_value_after = streak_précédent + 1`, `joker_used = false`, `phase = 'phase_0'`.
- Si le streak atteint un palier (7, 15, 30, 60, 100, 365) : `tier_reaches` upsert pour incrémenter `reach_count` et mettre à jour `last_reached_at`.

**Cas Phase 0 — sous le seuil avec joker dispo.** L'utilisateur valide quand même après soft-rappel. Écritures :
- `progress` : ligne créée avec `is_minimum=true, actions_count` (3 ou 4 par exemple).
- `streak_history` : ligne créée avec `validation_status = 'valid_with_joker'`, `streak_value_after = streak_précédent + 1`, `joker_used = true`.
- `joker_consumptions` : ligne créée avec `(user_id, week_key, consumed_for_local_date)`.

**Cas Phase 0 — sous le seuil sans joker dispo.** Le streak est cassé. Écritures :
- `progress` : ligne créée avec `is_minimum=true, actions_count` (faible).
- `streak_history` : ligne créée avec `validation_status = 'broken_streak'`, `streak_value_after = 0`, `joker_used = false`.

**Cas Phase 1 — au moins 1 session sur 3.** Idem Phase 0 au-dessus du seuil, mais avec `phase = 'phase_1'` dans `streak_history`. La table `progress` n'est pas utilisée en Phase 1 (elle est dédiée à la Phase 0 pour le moment, à clarifier en V1.5 si on veut la généraliser).

### 5.3. Évaluation initiale d'un pilier (IA-40 → IA-41)

L'utilisateur démarre une nouvelle semaine de Phase 1. L'écran IA-40 affiche les 12 questions une à une. À la fin, écriture dans `pillar_evaluations` :
- `(user_id, pillar_id, evaluation_type='initial', responses, raw_score, normalized_score, diagnostic_level, engagement_level_recommended, engagement_level_chosen)`.
- `engagement_level_chosen` est par défaut égal à `engagement_level_recommended`, modifiable plus tard via IA-41.

### 5.4. Modification manuelle du niveau d'engagement (IA-41 ou IA-42)

L'utilisateur tap sur "Modifier mon niveau" et choisit un nouveau niveau. Écriture :
- `pillar_evaluations` : update de la ligne `evaluation_type='initial'` du pilier courant pour fixer `engagement_level_chosen` au nouveau choix.

### 5.5. Session pratiquée en Phase 1 (IA-43)

L'utilisateur valide une session. Écriture :
- `pillar_sessions` : ligne créée avec `(user_id, pillar_id, day_in_week, session_index, local_date, completed_at)`.

### 5.6. Choix de niveau adaptatif (modale IA-44)

L'utilisateur tap sur Moins / Pareil / Plus. Écriture :
- `level_adaptive_choices` : ligne créée avec `(user_id, pillar_id, session_id, choice, chosen_at)`.

**Lecture pour déclencher la suggestion d'adaptation messagée.** À chaque ouverture de IA-44, le code peut lire les N derniers choix de l'utilisateur sur ce pilier : `SELECT choice FROM level_adaptive_choices WHERE user_id = $uid AND pillar_id = $pid ORDER BY chosen_at DESC LIMIT N`. Si tous les N derniers sont `'less'`, déclencher le message de suggestion (Feature Spec V1.1 § 2.7).

### 5.7. Évaluation finale d'un pilier (IA-46 → IA-47)

Identique à 5.3 mais avec `evaluation_type='final'`. L'écran IA-47 calcule le différentiel entre score final et score initial pour animer la branche de la toile.

---

## 6. Notes pour le dev

**Outils de migration.** Les tables sont à créer via le **dashboard Supabase** (Table Editor) ou via la **CLI Supabase** (`supabase migration new ...` puis `supabase db push`). Pas de migration applicative en V1 — c'est l'admin Supabase qui crée le schéma, le code applicatif consomme les tables.

**Convention de nommage SQL.** Tables et colonnes en `snake_case` (convention Supabase / PostgreSQL standard). Pas de PascalCase ni de camelCase côté DB. Les types TypeScript côté client peuvent utiliser camelCase via les conventions de Supabase JS qui convertissent automatiquement.

**Index de performance.** Au-delà des index uniques mentionnés dans chaque table, ajouter des index sur les colonnes fréquemment filtrées :
- `streak_history(user_id, local_date DESC)` pour les requêtes du streak récent.
- `joker_consumptions(user_id, week_key)` pour la disponibilité du joker.
- `pillar_evaluations(user_id, pillar_id)` pour récupérer les évaluations d'un pilier.
- `pillar_sessions(user_id, pillar_id, local_date)` pour l'historique de Phase 1.
- `level_adaptive_choices(user_id, pillar_id, chosen_at DESC)` pour la suggestion d'adaptation.

**Triggers Supabase.** Recommandation : un trigger `AFTER INSERT ON auth.users` qui crée automatiquement la ligne `profiles` correspondante. Évite d'oublier de créer le profil en code applicatif. À mettre en place via le dashboard Supabase (Database → Triggers).

**Tests.** Pas de tests automatisés en V1 (Stéphane n'est pas développeur, charge tests > valeur en V1). Les vérifications se font manuellement sur simulateur iOS via `npx expo start` puis `i`. Une suite de tests automatisés (Jest pour le code, ou des tests Supabase via SQL) pourra être ajoutée en V2 si l'équipe technique grandit.

---

## 7. Récapitulatif des tables V1

| Table | Statut V0 | Évolution V1 | Lignes attendues par utilisateur |
|---|---|---|---|
| `profiles` | Existe | Ajout `profile_dynamic_id` et `account_created_at` | 1 |
| `progress` | Existe | Ajout `actions_count` et `validated_at` | jusqu'à 14 (Phase 0) |
| `streak_history` | À créer | — | jusqu'à 70 (10 semaines V1) |
| `joker_consumptions` | À créer | — | jusqu'à 10 (1 par semaine) |
| `tier_reaches` | À créer | — | 0 à 6 (1 par palier atteint) |
| `pillar_evaluations` | À créer | — | jusqu'à 16 (8 piliers × 2 évaluations) |
| `pillar_sessions` | À créer | — | jusqu'à 168 (8 × 7 × 3) |
| `level_adaptive_choices` | À créer | — | variable, potentiellement plusieurs centaines |
| `notifications_sent` | À créer (V1.1) | — | variable, plusieurs dizaines en V1 selon programme de notifications |
| `daily_check_ins` | À créer (vide V1) | Réservée V2 | 0 en V1 |

**Total lignes par utilisateur en V1 (haut estimation pour les 10 semaines complètes) :** environ 300 lignes max, dominées par `pillar_sessions` (168) et `level_adaptive_choices` (~100). Volume tout à fait soutenable par Supabase au tier gratuit pour les premiers milliers d'utilisateurs.

---

## 8. Décisions tranchées dans le cadre de ce schéma

**Décision schéma 1.** Conserver la stratégie hybride local + Supabase héritée du V0, étendue aux nouvelles tables de la V1. Cohérent avec D28 et la décision A3 du Bloc 1 de l'audit (migration local→distant à la création de compte).

**Décision schéma 2.** Adopter l'Option A pour `progress` (table simple, mécanique fine déportée vers `streak_history`). Plus modulaire, plus extensible.

**Décision schéma 3.** Adopter le schéma alternatif de `tier_reaches` avec PK composite `(user_id, tier_id)` et `upsert` pour le compteur. Plus économe et plus simple à requêter pour identifier un premier franchissement.

**Décision schéma 4.** Créer la table `daily_check_ins` vide en V1 plutôt que d'attendre V2. Évite les collisions de nom et signale explicitement la place réservée.

**Décision schéma 5.** Politiques RLS uniformes sur toutes les tables — un utilisateur ne peut lire et modifier que ses propres lignes. Pas de cas particulier de partage de données entre utilisateurs en V1.

---

## 9. Mises à jour à propager dans les autres docs

**CLAUDE.md du repo (V1.2).** Section 5 enrichie avec une référence à ce nouveau document. Section 8 (sources de vérité) ajout d'une entrée "Schéma de données V1".

**Synthèse des décisions V6 → V7 (potentiel).** Si Stéphane confirme les 5 décisions schéma ci-dessus comme tranchées, on peut les acter en D38 à D42 dans la Synthèse pour traçabilité. Optionnel — ces décisions sont assez techniques et peuvent rester documentées uniquement dans ce schéma.

**Feature Spec V1.1 → V1.2 (potentiel).** Si on veut référencer précisément les tables dans la Feature Spec (par exemple ajouter "écriture dans `streak_history`" dans § 2.5), on patche la Feature Spec en V1.2. Optionnel.

**Au démarrage des chantiers code Bloc 1 (M2+M3 calendaire et streak/joker).** Référencer ce document comme la source de vérité technique des tables à créer. Claude Code lira ce schéma avant de commencer la création des tables sur Supabase.

---

## Historique des versions

**Version 1.0 — 8 mai 2026.** Création du document. Étape 7 du Plan de patches en cascade post-audit V0 vs docs fondateurs (livré le 7 mai 2026). Documente l'état actuel des tables V0 (`profiles`, `progress`), liste les 6 tables à créer pour la V1, plus la table vide réservée V2. Décrit les politiques RLS uniformes. Trace les flux de données entre code applicatif et tables. Conséquence directe des décisions B1, B2 (séparation diagnostic / engagement, table `pillar_evaluations`), D6 modifié (seuil 5/7, table `progress` enrichie d'`actions_count`), D34 (pas de score quotidien V1, `actions_count` non agrégé), D36 (table `daily_check_ins` créée vide).

---

*Fin du document Schéma de données V1.*

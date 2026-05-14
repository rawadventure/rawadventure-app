# CLAUDE.md — Raw Adventure App

*Ce fichier est le contexte projet de Claude Code pour le repo Raw Adventure App. Il vit à la racine du repo et est lu en début de chaque session. Sa source de vérité reste les documents du Project Claude.ai (référencés en section 8). Si une info de ce fichier semble contredire un doc Project plus récent, c'est le doc Project qui gagne — il faut alors mettre à jour ce CLAUDE.md.*

*Daté du 8 mai 2026 — Version 1.2 (post-audit V0 vs docs fondateurs). À mettre à jour à chaque décision structurelle nouvelle.*

---

## 1. Comment utiliser ce fichier

Avant chaque tâche, suis ce réflexe en trois temps. **Lire ce fichier**, au moins en survol, pour rappeler les principes et le périmètre. **Identifier l'écran ou le flow concerné** par son identifiant `IA-XX` (voir section 6). Si la tâche touche un écran qui n'est pas listé ici, c'est une alerte — soit l'écran a été ajouté hors process, soit la tâche déborde du périmètre V1, dans les deux cas il faut en parler à Stéphane avant de coder. **Si un cadrage manque** (par exemple le calcul exact de la toile d'araignée, la fréquence des notifications, le mapping profil → niveau), ne pas inventer — signaler à Stéphane que la décision est reportée (voir section 9) et attendre un arbitrage.

Stéphane n'est pas développeur de formation. Quand tu lui parles, plain language. Pas de jargon technique gratuit. Quand un terme technique est nécessaire, explique-le brièvement.

---

## 2. Le projet en une page

**Raw Adventure App** est une application mobile de santé naturelle, en abonnement mensuel, dont le cœur est un parcours de coaching guidé sur 12 mois qui fait ressentir la vitalité par l'expérimentation corporelle. L'app fait office de pré-mentorat — elle prépare l'utilisateur à un mentorat 1-to-1 (vente séparée, hors app).

**Mimi & Jacky** sont les visages incarnés de la marque. Ils parlent dans l'app via des vidéos pré-enregistrées et des messages écrits. Pas de live, pas de masterclass temps-réel, pas de coaching 1-to-1 dans l'app.

### Périmètre V1 figé

La V1 couvre uniquement les **10 premières semaines** de l'expérience utilisateur, dans cet ordre exact.

**Phase 0** — 14 jours gratuits, multi-actions en parallèle (**7 actions** de base : activation matinale, défi froid, mouvement ou récupération selon le jour, minéralisation, fenêtre digestive, fruits, soirée sans écrans). Validation streak à **5 actions sur 7 minimum** par jour (D6 modifié 7 mai 2026), avec soft-rappel non-culpabilisant en dessous du seuil (D26). Quatre écrans de jour-charnière (J3, J7, J11, J14) qui se superposent à l'accueil au premier lancement du jour concerné.

**S0** — transition de 2 jours gratuits. **S0.1** célèbre les 14 jours et révèle la toile d'araignée du score de vitalité. **S0.2** présente la roadmap des 8 semaines et enchaîne sur l'évaluation initiale du pilier S1.

**Phase 1** — 8 semaines payantes, ordre des piliers acté : Respiration → Alimentation → Mindset → Condition physique → Repos et régénération → Passion et chemin de vie → Connexion au vivant → Élimination et détox. Structure-type par semaine : évaluation initiale 12 questions, 3 niveaux d'intensité, 3 sessions/jour, niveau adaptatif manuel, test avant/après session, évaluation finale, mise à jour de la branche correspondante de la toile d'araignée. Validation streak à 1 session sur 3 minimum par jour. Les habitudes Phase 0 sont retirées en S1 (principe pédagogique fort : on isole le pilier). Une seule vidéo d'intro par pilier en V1 (D33).

**Sortie de S8** — célébration, mode consolidation libre, proposition active du mentorat (sans hard-sell).

### Hors-scope V1

Ces points sont explicitement exclus. Si tu identifies une feature qui ressemble à l'un d'eux, c'est une alerte.

Pas de Phase 2 (mois d'intégration) ni Phase 3 (9 mois thématiques) — V2/V3. Pas de coaching personnalisé réel ni de 1-to-1 dans l'app — c'est le mentorat externe. Pas de live, pas de masterclass temps-réel. Pas de contenu long (vidéos > 2 min). Pas de bibliothèque libre-service (l'utilisateur est guidé, il ne navigue pas). Pas de communauté intégrée (Telegram externe). Pas d'intégrations tierces (Apple Health, Garmin, etc.). Pas de multi-tier d'abonnement (un seul tier, deux durées : mensuel + annuel). Pas de personnalisation automatique de l'intensité (le niveau adaptatif est manuel : moins / pareil / plus, sans suggestion automatique en V1, voir D31). Pas de score de vitalité affiché en Phase 0 (la toile est révélée au S0.1 comme moment narratif). Pas de modification rétroactive d'un check journalier validé (D27). Pas de backend cloud, pas de synchronisation multi-appareil — storage local-only en V1 (D28). Pas de sélecteur de langue ni de traduction effective — contenu V1 français uniquement (D23, mais l'architecture est compatible multilingue).

---

## 3. Les 8 principes directeurs non-négociables

Ces principes guident chaque décision produit, chaque écran, chaque ligne de code, chaque mot de copy. Si une feature les contredit, elle dégage. Repris textuellement du Product Vision v2.2.

**1. L'utilisateur ne doit pas réfléchir.** Il doit être guidé. Aucun choix complexe, aucun arbitrage à faire seul.

**2. Le ressenti prime sur la théorie.** Avant d'expliquer, on fait vivre.

**3. Simplicité extrême.** Si une feature demande plus de 30 secondes d'explication, elle est probablement de trop.

**4. Moins d'une minute par jour en routine.** Le check quotidien est la mécanique cardinale.

**5. Progression visible et frustration positive.** L'utilisateur voit où il en est et a envie de débloquer la suite.

**6. Pas de marketing bien-être creux.** Ni dans le ton, ni dans les visuels, ni dans le copy.

**7. Mimi & Jacky parlent, mais en différé.** Pas de live, pas de dépendance à leur agenda.

**8. Ne pas mettre toujours +++.** Rééduquer les sens, aiguiser les sensations en isolant. La vraie progression passe par la finesse d'observation, pas par l'accumulation.

---

## 4. Voix et copy

Mimi & Jacky parlent à l'utilisateur. Le "on" et le "nous" renvoient à leur duo. Tutoiement systématique. Pas de "vous" ni de "l'utilisateur".

### Ton

Dense, direct, crédible, structuré, incarné. Calme mais impactant. Rationnel mais incarné. Inspirant sans naïveté. Direct sans agressivité. Style **mini-livre**, blocs compacts, phrases qui apportent quelque chose. Pas de retour à la ligne haché, pas de bullet point décoratif. Pas le style coach Instagram.

### Vocabulaire à utiliser

vitalité, énergie réelle, terrain, adaptation, physiologie, système nerveux, régénération, lecture du corps, compensation, expérimentation, transformation, ressenti, signal, observation, marge, rythme.

### Vocabulaire à éviter

wellness, bien-être (au sens marketing), miracle, magique, secret, hack, champion, guerrier, warrior, transformation totale, reset, boost, energy, vibe, mood, "Hey", "Salut !", "Coucou", "T'es prêt ?". Pas d'exclamations dans le copy produit. Pas d'emojis dans le copy produit (règle stricte, non-négociable). Pas de superlatifs creux ("incroyable", "magique"). Pas de sur-promesses ("tu vas te transformer", "tu ne te reconnaîtras plus"). Pas de pression par la perte ("ne perds pas ton streak").

### Note sur la joie

La joie, la légèreté, la couleur sont essentielles à Raw Adventure — mais elles passent par les **visuels, les couleurs, les illustrations, les vidéos**, pas par le copy survitaminé. Le visuel porte l'énergie, le texte porte la crédibilité. Cette répartition (visuel = énergie, texte = densité) distingue Raw Adventure d'une app coach Insta.

### Application au copy de placeholder

Quand tu génères du texte de placeholder pour un écran (libellé de bouton, message d'erreur, titre de section), respecte les règles ci-dessus. Pas de "Super, c'est parti !" ni de "Bienvenue sur ton incroyable parcours 🚀". Si tu n'es pas sûr de la formulation juste, pose-toi la question : "est-ce que Mimi & Jacky écriraient ça ?". En cas de doute, mets un placeholder neutre du type `[copy à valider]` et signale-le à Stéphane.

L'**Audit copy V1** (doc Project) contient les réécritures des slides d'onboarding, les sous-titres des jours problématiques de Phase 0, et la grille d'écriture des notifications. À consulter quand tu touches un écran qui porte du copy validé.

### Architecture multilingue

Bien que la V1 soit française uniquement, l'architecture du code est conçue pour pouvoir traduire à terme (D23). Trois règles s'appliquent dès la V1. Premièrement, **tout texte affiché à l'utilisateur passe par un slot de copy identifié** (clé symbolique, pas de chaîne en dur dans le code). Deuxièmement, **les médias référencés** (vidéos, images de copy) sont identifiés par un asset stable, pas par une URL ou un chemin codé en dur. Troisièmement, **les formats sensibles à la locale** (dates, durées, nombres) passent par des helpers dédiés. Pas de sélecteur de langue dans la V1, pas de fallback inter-langue, mais le terrain est préparé. Voir Feature Spec V1 Socle minimum pour les conventions précises.

---

## 5. Stack et conventions techniques

### Stack

**React Native + Expo** en TypeScript. Le proto V0 est déjà initialisé sous cette stack. Conserver Expo (managé) tant qu'aucune feature ne nécessite d'éjecter — éjecter alourdit la maintenance et n'est pas justifié pour la V1.

### Persistance des données — local-only en V1

Décision structurante (D28) : **pas de backend cloud, pas de synchronisation multi-appareil, pas de compte cloud**. Toutes les données utilisateur (profil, progression, streak, paliers atteints, scores des évaluations, branches de la toile, contenu bonus débloqué) sont stockées **localement sur le téléphone**. Le mécanisme de stockage exact (AsyncStorage, SQLite via expo-sqlite, MMKV, etc.) reste à arbitrer pilier par pilier en fonction du volume et de la complexité, mais le principe est figé : tout vit sur le device.

Conséquence directe : **désinstallation de l'app = streak perdu, progression perdue, contenu débloqué perdu**. C'est un choix volontaire — la désinstallation est un signal fort de désengagement, et la dette technique d'un backend cloud n'est pas justifiée en V1. À monitorer en cohorte d'utilisateurs payants (point de vigilance acté), avec migration backend probable en V2 si l'irritant est confirmé à volume.

Implications pratiques pour Claude Code. Pas de fetch vers une API distante pour les données métier. Pas de sync entre téléphone et tablette du même utilisateur. Pas de "récupérer mon compte" si désinstallation. Pas de Firebase Auth ni d'équivalent en V1. Les seules requêtes réseau légitimes en V1 concernent le téléchargement des médias vidéo (qui peuvent venir d'un CDN) et la gestion de l'abonnement (passerelle de paiement type Stripe/RevenueCat, à arbitrer en Feature Spec abonnement).

*Précision V1.2 (8 mai 2026, post-audit V0).* Le proto V0 actuel utilise **Supabase** comme backend pour `profiles` et `progress` (au lieu d'une approche purement locale). Cette décision V0 antérieure à D28 reste compatible avec D28 en pratique : Supabase sert à l'authentification et à la persistance distante minimale du profil et de l'historique de validation des jours, le reste vit en local (AsyncStorage). Les futures tables Supabase pour la V1 (streak_history, joker_consumptions, tier_reaches, pillar_evaluations, pillar_sessions, level_adaptive_choices) sont documentées dans le **Schéma de données V1** (étape 7 du Plan de patches en cascade, à venir).

### État du proto V0 et dette identifiée

*Section ajoutée le 8 mai 2026 suite à l'audit V0 vs docs fondateurs.*

Le proto V0 (déposé dans le Project Claude.ai courant mai 2026) est le **squelette** de la Phase 0 et de l'onboarding. La Phase 1 n'est pas codée — elle existe uniquement sous forme de fichiers spec produit écrits par Jacky pour les 8 piliers. L'audit V0 vs docs fondateurs a confronté l'état réel du V0 aux décisions des docs cadrage. Les éléments de dette technique et de chantiers identifiés sont les suivants.

**Code mort à supprimer.** Le fichier `src/hooks/useProgress.ts` est un doublon legacy non utilisé. `App.tsx` utilise `ProgressContext` depuis `src/lib/ProgressContext.tsx`. Le hook standalone est à supprimer pour éviter la confusion.

**Code à conserver comme prototype Phase 1 balisé.** Le composant `src/screens/ProtocolScreen.tsx` n'est pas encore branché dans `App.tsx` mais représente une bonne base pour la Phase 1 (sessions de pratique guidées). À conserver tel quel avec un commentaire en tête `// Prototype Phase 1 — non branché en V1, à reprendre lors de la refonte M5+ de la Phase 1`.

**Externalisation de la clé Supabase.** Actuellement, la clé Supabase est hardcodée dans `src/lib/supabase.ts`. À déplacer en variables d'environnement Expo via `app.config.ts` avec les noms `EXPO_PUBLIC_SUPABASE_URL` et `EXPO_PUBLIC_SUPABASE_ANON_KEY`. Charge code estimée : 30 minutes.

**Plan de refonte V1 (chantiers structurants).** Les chantiers code Bloc 1 listés dans l'audit V0 sont :

- **M2 + M3 — Refonte calendaire et streak/joker en bloc.** Le V0 actuel fait du `completedDays.length` sans notion calendaire ni joker. La V1 doit suivre le calendrier réel (`currentDay` calculé depuis `accountCreatedAt`) et implémenter la mécanique de joker en semaine calendaire fixe (lundi-dimanche) avec le seuil 5/7 en Phase 0 (D6 modifié 7 mai 2026). Charge estimée : **7 à 11 heures Claude Code**. Documentation de référence : Feature Spec V1.1 § 2.4 et § 2.5.

- **M5 Phase B — Refonte conversion.** Le V0 a un `ConversionScreen` avec 3 tiers d'abonnement (mensuel/trimestriel/annuel) et était auto-affiché à `streak >= 14`. Le patch V0 minimal du 7 mai 2026 (commit `207e573`) a retiré l'auto-affichage. La refonte V1 doit (a) supprimer le plan trimestriel pour ne garder que mensuel + annuel (D33), (b) refondre le copy en accord avec D3 (conversion accessible dès J3, pas concentrée sur J15), (c) intégrer le paiement in-app via Apple Pay / Google Pay / Stripe / RevenueCat. Charge à chiffrer en Feature Spec abonnement dédiée. Documentation de référence : IA V3 § IA-30.

- **M7 + A3 — Inversion flow auth/onboarding et migration local→distant.** Le V0 actuel affiche `AuthScreen` **avant** l'onboarding (App.tsx ligne 47). La V1 doit inverser ce flow : 10 slides d'onboarding accessibles en mode anonyme avec stockage AsyncStorage, création de compte uniquement à `IA-10` (slide 10), puis migration automatique des 4 clés AsyncStorage vers les tables Supabase `profiles` et `progress`. Charge estimée : **4 à 6 heures Claude Code**. Documentation de référence : IA V3 § IA-10 et Feature Spec V1.1 § 2.10.

**Convention de numérotation des fichiers Jacky.** Les 8 fichiers piliers de Phase 1 écrits par Jacky portent une numérotation antérieure à la décision **D8** (Synthèse V6, validée par Mimi & Jacky le 3 mai 2026). Lors de l'intégration de ces fichiers dans le repo (probablement dans `src/data/pillars/` ou similaire), appliquer le mapping suivant :

- `V0_PILIER_1___RESPIRATION` → `S1_Respiration` (inchangé)
- `V0_PILIER_2___ALIMENTATION` → `S2_Alimentation` (inchangé)
- `V0_PILIER_7___MENTAL` → `S3_Mindset`
- `V0_PILIER_3___CONDITION_PHYSIQUE` → `S4_Condition_physique`
- `V0_PILIER_4___REPOS___RE_GE_NE_RATION` → `S5_Repos_regeneration`
- `V0_PILIER_8___PASSION` → `S6_Passion`
- `V0_PILIER_7___CONNEXION_AU_VIVANT` → `S7_Connexion_vivant`
- `V0_PILIER_5___E_LIMINATION___DE_TOX` → `S8_Elimination_detox`

### Posture du reset utilisateur en V1

*Section ajoutée le 8 mai 2026 suite à la décision A2 du Bloc 1 de l'audit V0 vs docs fondateurs. Documentation de référence complète : Feature Spec V1.1 § 2.11.*

**En build production V1, aucun reset utilisateur n'est exposé.** Un utilisateur lambda ne peut pas remettre son parcours à zéro par accident ou par exploration de l'interface. C'est délibéré.

**Posture en mode développement.** Pour permettre à Stéphane et Claude Code de tester l'app rapidement sans devoir refaire le parcours à chaque test, les **raccourcis de reset hérités du V0** sont conservés mais conditionnés au flag `__DEV__` d'Expo. Concrètement, dans le code des `HomeScreen` et `ConversionScreen`, les handlers d'appui long sur les emojis ⚡ (HomeScreen) et 🏆 (ConversionScreen) — qui déclenchent `Alert.alert()` puis `resetAll()` du `ProgressContext` — sont entourés de `if (__DEV__) { ... }`. La variable `__DEV__` est `true` en mode développement (Expo Go, `npx expo start`) et `false` en build production (App Store / Play Store).

**Posture sur le paywall V0 — patch minimal du 7 mai 2026.** Le V0 forçait l'affichage du `ConversionScreen` à `streak >= 14`. Le commit `207e573` sur `main` a retiré ce comportement. Le `ConversionScreen` reste déclaré dans le `Stack.Navigator` principal pour rester atteignable par navigation programmatique, mais n'est plus terminal après J14. La refonte complète de l'écran (M5 Phase B, voir ci-dessus) viendra plus tard.

### Structure du repo

Repo local : `/Users/ASUS/Documents/RawAdventureRN`. À connecter à un repo GitHub **privé** (D22) — pas open source, pas public — dans les semaines qui viennent, idéalement avant que le volume de code à perdre ne devienne significatif. Au 6 mai 2026, le code n'existe qu'à un seul endroit (le disque dur du MacBook de Stéphane), ce qui constitue un risque de perte totale en cas de panne matérielle.

Arborescence à la racine :

```
RawAdventureRN/
├── App.tsx              ← point d'entrée
├── app.json             ← config Expo
├── index.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── assets/              ← images, polices, icônes statiques
├── node_modules/        ← dépendances (jamais commit)
├── web/                 ← spécifique build web Expo
└── src/
    ├── components/      ← composants réutilisables (Button, Card, Modal, etc.)
    ├── data/            ← contenu statique (jours Phase 0, semaines Phase 1, etc.)
    ├── hooks/           ← hooks React (useStreak, useAuth, etc.)
    ├── lib/             ← utilitaires (helpers, formatters, calculs)
    ├── screens/         ← un fichier par écran IA-XX
    └── theme/           ← tokens visuels (couleurs, typo, espacements)
```

Cette structure est conservée. Pas de réorganisation en V1 — on documente ce qui existe et on l'enrichit.

### Conventions de nommage

**Composants** en `PascalCase` : `OnboardingSlide.tsx`, `StreakBadge.tsx`. **Screens** : un fichier par écran V1, nommé selon son identifiant `IA-XX` ou un nom métier clair. Quand tu crées un nouvel écran, **inclure l'identifiant `IA-XX` en commentaire en tête du fichier** pour que la traçabilité repo ↔ Information Architecture soit immédiate. **Hooks** en `useXxx` : `useStreak`, `useDailyCheck`. **Utilitaires** en `camelCase` : `formatDate.ts`, `calculateBranch.ts`. **Fichiers de données** en `kebab-case` : `phase-0-days.ts`, `pillar-respiration.ts`.

### Patterns à privilégier

Composants fonctionnels avec hooks (pas de classes). State local avec `useState` / `useReducer` quand suffisant. State global uniquement si plusieurs écrans en dépendent (Context API en V1, pas de Redux ou Zustand sans justification). Tokens du `theme/` plutôt que valeurs en dur (`theme.colors.primary` plutôt que `#3a5a3a`). Composants réutilisables dans `components/`, screens dédiés dans `screens/`.

### Patterns à éviter

State global tentaculaire pour des données qui n'en ont pas besoin. Libs lourdes pour des problèmes simples (ex : pas de Lottie pour une animation que CSS résout, pas de Moment pour un format de date trivial). Inline styles à répétition (utiliser le `theme/`). Fichiers de plus de 300 lignes (signe qu'il faut découper). Toute dépendance qui sort des principes directeurs (ex : une lib de "gamification" qui pousserait au "champion / guerrier" — non).

### Avant d'ajouter une dépendance

Toute nouvelle dépendance npm doit être **validée par Stéphane**. Pas d'install silencieux. Justifier en une phrase : à quoi elle sert, pourquoi elle est nécessaire, alternative envisagée. Cette règle évite la dette technique et le bloat.

---

## 6. Carte des 45 écrans V1

Cette liste est l'**index** des écrans. La spec détaillée (rôle, contenu, états, transitions) est dans l'**Information Architecture V1** (doc Project). Quand tu travailles sur un écran, ouvre cette IA pour avoir le détail. Les écrans S0, le format-type intro de pilier (IA-41) et le Socle transverse de mécaniques sont également cadrés dans la **Feature Spec V1 Socle minimum** (version du 6 mai 2026).

**Statut** : `proto existant` = déjà codé dans le proto V0 (à enrichir ou refondre selon le cas), `à créer` = à coder en V1.

### Onboarding

| ID | Nom | Statut |
|---|---|---|
| IA-01 | Slide 1 — Le diagnostic | proto à enrichir copy |
| IA-02 | Slide 2 — Le constat | proto à enrichir copy |
| IA-03 | Slide 3 — La promesse | proto à enrichir copy |
| IA-04 | Slide 4 — Questionnaire partie 1 | proto existant |
| IA-05 | Slide 5 — Questionnaire partie 2 | proto existant |
| IA-06 | Slide 6 — La projection | proto à enrichir copy |
| IA-07 | Slide 7 — Profil dynamique | proto à enrichir copy |
| IA-08 | Slide 8 — Comment ça marche | proto à enrichir copy |
| IA-09 | Slide 9 — L'engagement | proto à enrichir copy |
| IA-10 | Slide 10 — Création de compte | proto existant (RegisterScreen) |
| IA-10b | Écran de choix de démarrage (couche superposée si moins de 4h avant minuit local) | à créer |
| IA-10c | Écran d'attente pré-Phase 0 (pleine page pendant la période d'attente) | à créer |

Les écrans IA-10b et IA-10c sont liés à la décision **D24** (démarrage différé optionnel à la création de compte). IA-10b apparaît seulement si la création de compte intervient à moins de 4 heures du minuit local suivant ; il propose à l'utilisateur de démarrer son J1 maintenant ou le lendemain matin. IA-10c est l'écran d'attente affiché si le démarrage différé a été choisi : tab bar Profil active, autres onglets masqués ou inactifs, sortie automatique à la première ouverture après le passage de minuit local. Voir Feature Spec V1 Socle minimum pour la spec technique complète.

### Hub central et Phase 0

| ID | Nom | Statut |
|---|---|---|
| IA-11 | Accueil quotidien | proto à enrichir (HomeScreen, mode Phase 0 uniquement) |
| IA-12 | Vidéo de bienvenue J1 | à créer |
| IA-13 | Détail d'un pilier (Phase 0) | proto à clarifier (DayDetail + Explication) |
| IA-14 | Écrans de jour-charnière (J3, J7, J11, J14) | à créer (4 variantes) |
| IA-15 | Modale de validation du check quotidien | à créer |

La modale IA-15 intègre le **soft-rappel non-culpabilisant** (D26) : quand l'utilisateur valide sa journée sous le seuil de **5 actions sur 7** en Phase 0, la modale affiche un message bienveillant avec deux options, "Cocher d'autres actions" ou "Valider quand même". Pas de soft-rappel en Phase 1.

### S0 (transition)

| ID | Nom | Statut |
|---|---|---|
| IA-20 | S0.1 — Célébration et toile révélée | à créer |
| IA-21 | S0.2 — Roadmap et évaluation S1 | à créer |

### Phase 1 et sortie de S8

| ID | Nom | Statut |
|---|---|---|
| IA-22 | Écran de sortie de S8 | à créer |
| IA-23 | Présentation du mode consolidation libre | à créer |
| IA-40 | Évaluation initiale d'un pilier (12 questions) | proto partiel (Questionnaire de départ) |
| IA-41 | Récapitulatif évaluation initiale | à créer |
| IA-42 | Vue d'ensemble du pilier en cours | à créer |
| IA-43 | Écran de session (Phase 1) | à créer |
| IA-44 | Bouton niveau adaptatif (modale) | à créer |
| IA-45 | Vidéo de transition Phase 0 → S1 | à créer |
| IA-46 | Évaluation finale d'un pilier | à créer |
| IA-47 | Récapitulatif évaluation finale + branche | à créer |

Le bouton niveau adaptatif (IA-44) est **manuel uniquement** en V1 (D31) : pas de suggestion automatique de réajustement en fonction des résultats des sessions, l'utilisateur choisit "moins / pareil / plus" lui-même depuis IA-41 ou IA-42.

### Toile d'araignée

| ID | Nom | Statut |
|---|---|---|
| IA-25 | Onglet Toile — Vue principale | à créer |
| IA-26 | Détail d'une branche | à créer |

### Streak et paliers

| ID | Nom | Statut |
|---|---|---|
| IA-50 | Modale de palier de récompense (6 paliers) | à créer |
| IA-51 | Galerie des paliers atteints | à créer |

La modale IA-50 a **deux variantes** selon la décision D29. Au **premier franchissement** d'un palier : modale complète avec vidéo de 30 secondes, badge plein, message personnalisé, accès galerie. Aux **franchissements suivants** (si le streak a été cassé puis reconstruit jusqu'au même palier) : modale simplifiée, pas de vidéo, badge en plus petit, message court de reconnaissance, un seul bouton "Continuer". Un compteur interne `tier{N}ReachedCount` permet de distinguer les deux cas. Voir Feature Spec V1 Socle minimum pour la spec technique. **Cas particulier de coordination** (D30) : si le palier 15 jours tombe le même jour que le déclenchement de S0.1, c'est S0.1 (IA-20) qui prime, et la modale IA-50 du palier 15j est différée à la prochaine validation. Logique généralisable : narratif structurant prime, palier différé d'un cran.

### Abonnement et conversion

| ID | Nom | Statut |
|---|---|---|
| IA-30 | Modale d'abonnement | proto à refondre intégralement (ConversionScreen) |
| IA-31 | Modale de confirmation post-abonnement | à créer |
| IA-32 | Espace contenu bonus | à créer |
| IA-33 | Lecture d'un contenu bonus | à créer |

### Mentorat

| ID | Nom | Statut |
|---|---|---|
| IA-60 | Modale de proposition active du mentorat (S8) | à créer |
| IA-61 | Onglet Mentorat — Présentation | à créer |

### Profil et paramètres

| ID | Nom | Statut |
|---|---|---|
| IA-70 | Profil utilisateur | à créer (partiel via Congratulation) |
| IA-71 | Gestion d'abonnement | à créer |
| IA-72 | Paramètres techniques | à créer |
| IA-73 | Aide et support | à créer |

### Légal

| ID | Nom | Statut |
|---|---|---|
| IA-74 | Conditions générales | à créer |
| IA-75 | Politique de confidentialité | à créer |

**Bilan : 45 écrans V1, environ 9 existent partiellement dans le proto, 36 sont à créer.** Un audit précis du proto sera mené dans une session ultérieure pour confronter le code existant à cet inventaire — d'ici là, considérer ce mapping comme indicatif.

### Mécaniques transverses qui ne sont pas des écrans

Le **streak** est affiché en permanence en haut de IA-11 et sur le profil IA-70 — pas un écran à part. Les **notifications push** Mimi & Jacky sont des éléments système, pas des écrans (max 1-2/jour en Phase 0, 1/jour en Phase 1, plage de silence 22h-8h locales actée par D32). La **toile d'araignée** est un composant graphique réutilisé sur IA-20, IA-25, IA-26, IA-47.

**Mécanique d'absence prolongée traversant un changement de phase (D25).** Si l'utilisateur revient après une absence longue qui couvre un changement de phase (par exemple absent de J12 à J20, donc traverse Phase 0 → S0 → début Phase 1), l'app **joue les écrans narratifs de transition dans l'ordre, à raison d'un par lancement**. Pas de saut direct à l'état théorique du jour, pas d'enchaînement multiple dans la même session. C'est une logique de file d'attente d'écrans narratifs : à chaque ouverture de l'app, l'écran narratif suivant non encore vu se joue, jusqu'à ce que l'utilisateur soit raccroché à son état réel. Impact code direct : prévoir un mécanisme de queue d'écrans narratifs avec un seul "tirage" par session.

---

## 7. Workflow de collaboration

### Règle de base

À chaque session de travail, Claude Code commence par **relire ce CLAUDE.md** (au moins en survol). Les principes directeurs et le périmètre V1 sont les filtres permanents. Une décision technique qui les contredit est à signaler à Stéphane avant d'être appliquée.

### Comment référencer un écran

Toujours par son identifiant `IA-XX`. Exemples : "je vais coder IA-15 (modale de validation du check quotidien)", "IA-30 demande une refonte intégrale du ConversionScreen actuel". Cet identifiant est stable, partagé entre les docs Project, ce CLAUDE.md, et le code (en commentaire en tête de fichier).

### Workflow git

**Option retenue (D21) : commits directs sur `main` avec validation avant chaque commit.**

Concrètement, à chaque modification significative (un écran codé, une feature ajoutée, un bug corrigé), Claude Code montre à Stéphane les changements proposés (diff lisible, en plain language : "j'ai créé le fichier `IA15ValidationModal.tsx`, modifié `HomeScreen.tsx` pour appeler la modale, ajouté un hook `useDailyCheck`"), explique le pourquoi en une phrase, puis demande "OK je commit ?". Stéphane valide ou corrige. Pas de commit sans validation explicite.

**Convention de message de commit** : format court, en français, à la première personne du pluriel ou à l'infinitif. Exemples : "Ajout de IA-15 — modale de validation du check quotidien", "Refonte de IA-30 (ex-ConversionScreen) selon décision D3", "Correction du calcul de streak en cas de joker utilisé". Inclure l'identifiant `IA-XX` quand c'est pertinent — la traçabilité avec l'IA V1 est précieuse.

**Pas de push automatique vers une branche distante.** Tant que GitHub n'est pas configuré, tous les commits restent locaux. Quand GitHub sera connecté (en mode **privé** — Raw Adventure est un produit commercial, pas open source — voir D22), Stéphane confirmera le passage au push manuel après validation.

### Quand un cadrage manque

Si tu rencontres une décision qui n'est pas dans ce CLAUDE.md ni dans les docs Project — typiquement un détail de calcul (toile d'araignée), de fréquence (notifications), de mapping (profil onboarding → niveau de départ), de prix d'abonnement, de copy précis — **ne pas inventer**. Signaler à Stéphane que la décision est reportée (voir section 9), proposer un placeholder explicite (commentaire `// TODO: décision Dxx reportée à Métriques V1` ou valeur de fallback claire), et continuer sur autre chose.

### Quand un écran touche du copy

Si tu dois écrire du copy qui n'est pas couvert par l'Audit copy V1 (placeholder, libellé, message d'erreur), respecter la grille de la section 4. En cas de doute, mettre un placeholder neutre (`[copy à valider]`) et signaler à Stéphane qui transmettra à Mimi & Jacky pour validation. Rappel architecture multilingue (D23) : tout texte affiché passe par un slot de copy identifié, pas de chaîne en dur dans le code.

### Quand un écran touche du contenu (vidéo, texte long, notification)

Le **contenu** (vidéos Mimi & Jacky, scripts, notifications, textes des évaluations 12 questions) est produit par Mimi & Jacky dans le cadre des **Briefs contenu** (Sessions 1, 2, 3 livrés au 6 mai, voir section 8). Mimi & Jacky écrivent leurs scripts au moment de cette V1.1. En attendant la livraison des médias définitifs, utiliser des placeholders cohérents avec le ton (pas de lorem ipsum générique sur des écrans qui seront vus en démo) et noter clairement ce qui doit être remplacé.

---

## 8. Sources de vérité (docs Project Claude.ai)

Ces documents vivent dans le Project Claude.ai de Stéphane, **pas dans le repo**. Quand un de ces docs est nécessaire pour une tâche, demander à Stéphane de le partager. Les versions ci-dessous sont à jour au 8 mai 2026.

**Product Vision v2.2** — `raw-adventure-product-vision-v2-2.md`. Vision produit complète, périmètre V1, principes directeurs, anti-scope, points de vigilance. Doc-source.

**Synthèse des décisions V6** — `raw-adventure-decisions-v5.md` (le nom de fichier reste `v5` pour stabilité, le contenu est en V6). Registre des **37 décisions tranchées** (D1 à D11, D17 à D37) et 5 reportées (D12 à D16). Pourquoi de chaque arbitrage. Référence majeure pour comprendre l'historique des arbitrages produit. **Patché le 7 mai 2026 (V5 → V6) suite à l'audit V0 vs docs fondateurs** : modification de D6 (seuil Phase 0 5/7 au lieu de 4/6), enrichissement de D31 (sémantique adaptation messagée), ajout de D34 (pas de score quotidien V1), D35 (pas de badges par pilier V1), D36 (pas de questionnaire fin de journée V1), D37 (effet miroir qualitatif V1, chiffré V2).

**Information Architecture V1 V3** — `raw-adventure-information-architecture-v1.md`. Spec détaillée des 45 écrans, navigation, flows utilisateur. **Source de vérité pour tout travail sur un écran IA-XX.** **Patché le 7 mai 2026 (V2 → V3) suite à l'audit V0** : 7 écrans patchés (IA-15 seuil 5/7, IA-30 entry points multiples, IA-40/IA-46 format évaluation 12 questions × 1-5 = score /60, IA-41 séparation diagnostic 5 niveaux + engagement 3 niveaux, IA-44 sémantique adaptation messagée, IA-10 flow nominal explicité, IA-14 état V0 partiel jours-charnière) plus 4 patches éditoriaux dans les Flows et IA-11.

**Feature Spec V1 Socle minimum V1.2** — `raw-adventure-feature-spec-v1-socle-minimum.md`. **Source de vérité technique** pour les écrans S0 (IA-20, IA-21), le format-type intro de pilier (IA-41), et le Socle transverse de mécaniques globales (états du parcours, transitions, file d'écrans narratifs, gestion du streak et des paliers, soft-rappel, niveau adaptatif manuel, plage de silence des notifications). Acte les décisions D23 à D33. À consulter dès qu'on touche un écran S0 ou une mécanique transverse. **Patché le 7 mai 2026 (V1.0 → V1.1) suite à l'audit V0** : refonte § 2.4 (seuil 5/7), § 2.5 (joker semaine calendaire fixe au lieu de glissante), § 2.7 (sémantique adaptation messagée), plus deux nouvelles sections § 2.10 (migration local→distant) et § 2.11 (posture reset V1). **Patché le 13 mai 2026 (V1.1 → V1.2)** : § 2.5 enrichi pour acter explicitement que le joker hebdomadaire continue de s'appliquer en Phase 1 sur la même logique qu'en Phase 0 (1 par semaine calendaire, lundi-dimanche, fuseau local).

**Feature Spec S1 Respiration V1.0** — `raw-adventure-feature-spec-pilier-s1-respiration.md`. **Source de vérité pour tout ce qui touche le pilier S1 Respiration**. Premier livrable des Feature Specs piliers. Document de référence pour les écrans IA-40, IA-41, IA-43, IA-44, IA-46, IA-47 dans le contexte du pilier S1. Cadre la mécanique 12 questions auto-déclaratives (avec inversion sémantique Q6/Q7/Q8 au calcul), le mapping diagnostic 5 niveaux S1 (Coûteuse / Instable / Respi en mode adaptation / Fonctionnelle / Régulatrice), l'application de la règle D40 sur S1, le paramètre principal cohérence cardiaque 5/10/20 min selon le niveau d'engagement, le programme 7 jours (J1 nez → J7 optimum), la mécanique 3 sessions/jour (matin/midi/soir), les 45 slots de copy spécifiques S1 à produire en Brief contenu V1, les 6 slots de visuels et médias (vidéos IA-41 et IA-45 à tourner par Mimi & Jacky), les notifications S1 (6/semaine en programme indicatif), les edge cases physiologiques. **Sert de pilier-pattern Type A** : sa structure (12 sections + annexe) sera reproduite plug-and-play pour les Feature Specs S2 à S8. Livré le 12 mai 2026 en V0.1 draft itératif, passé en V1.0 stable le 13 mai 2026 après relecture Stéphane et fermeture des zones résiduelles Z1, Z6, Z3.

**Métriques V1 V1.5** — `raw-adventure-metriques-v1-draft.md`. **Source de vérité pour le calcul du score de vitalité** (toile d'araignée), les évaluations 12 questions par pilier, le profil dynamique d'onboarding, les seuils par pilier, la mécanique du streak et des paliers, les KPIs business. À consulter dès qu'on travaille sur les écrans IA-25 (toile), IA-26 (détail branche), IA-40 (évaluation initiale), IA-41 (récap éval initiale), IA-46 (évaluation finale), IA-47 (récap éval finale + branche mise à jour), IA-50 (modale palier), IA-51 (galerie paliers). **Refondue le 8 mai 2026 (V0.3 → V1.0) suite à l'audit V0** : refonte intégrale du § 2 en deux sous-sections distinctes (diagnostic 5 niveaux + engagement 3 niveaux). **Patchée le 9 mai 2026 (V1.0 → V1.3)** : intégration matrice 8×8, migration ordre canonique D8 → D39, résolutions session relecture solo. **Patchée le 12 mai 2026 (V1.3 → V1.4)** : intégration des réponses Jacky session V5.0, actes D40 (règle simplifiée diagnostic → engagement) et D41 (typologie Type A / Type B des piliers). **Patchée le 13 mai 2026 (V1.4 → V1.5)** : recalibrage du paramètre principal S1 de 3/5/8 min à 5/10/20 min en sortie de production Feature Spec S1.

**Schéma de données V1 V1.1** — `raw-adventure-schema-donnees-v1.md`. Source de vérité technique pour les tables Supabase. Cadre 9 tables V1 (`profiles`, `progress`, `streak_history`, `joker_consumptions`, `tier_reaches`, `pillar_evaluations`, `pillar_sessions`, `level_adaptive_choices`, `notifications_sent`) plus la table réservée V2 `daily_check_ins`. **Patché le 13 mai 2026 (V1.0 → V1.1)** : ajout de la table `notifications_sent` (cadrée en sortie de production Feature Spec S1 § 8.4), confirmation du champ `duration_seconds` dans `pillar_sessions` (déjà présent en V1.0).

**Note de session avec Jacky V2.0** — `raw-adventure-metriques-v1-note-session-jacky.md`. Support de la session avec Jacky pour finaliser Métriques V1 V1.0. Refondue le 8 mai 2026 post-audit avec priorisation revue (table de correspondance pédagogique 5 × 8 en livrable principal).

**Customer Journey V1.3** — `raw-adventure-customer-journey-v1.md`. Parcours utilisateur en 10 sections, dramaturgie, moments-charnières. À consulter pour comprendre le pourquoi narratif d'un écran. **Patché le 13 mai 2026 (V1.2 → V1.3)** : migration des mentions d'ordre canonique D8 obsolète → D39 dans § "L'arc narratif des 8 semaines", récapitulatif des principes, liste des décisions actées.

**Audit copy V1** — `raw-adventure-audit-copy-v1.md`. Réécriture des slides d'onboarding, profils dynamiques, sous-titres de jours, grille d'écriture des notifications. À consulter dès qu'on touche du copy validé.

**Audit V0 vs docs fondateurs** — `raw-adventure-audit-v0-vs-docs-fondateurs.md`. Document de transition livré le 7 mai 2026, qui consolide l'audit du V0 codé contre les docs cadrage récents. Contient les 14 mécaniques auditées (M1-M14 sur Phase 0 codée et Phase 1 spec Jacky), les 5 sujets bonus Phase 0 narratif (N1-N5), les 11 décisions Stéphane tranchées (A1-A4, B1-B5, N1, N4) et le Plan de patches en cascade en 7 étapes. À consulter pour comprendre le pourquoi des refontes V1 en cours.

**Brief contenu Session 1** — `raw-adventure-brief-contenu-session-1.md`. Support de production des **6 vidéos de palier streak** (7j, 15j, 30j, 60j, 100j, 1 an). Tournage prévu en une demi-journée. Côté Claude Code : indique les médias vidéo qui seront intégrés à IA-50 (variante "premier franchissement").

**Brief contenu Session 2** — `raw-adventure-brief-contenu-session-2.md`. Support de production des **vidéos S0.1 et S0.2** (transition Phase 0 → Phase 1). Côté Claude Code : indique les médias vidéo qui seront intégrés à IA-20 et IA-21, avec une structure en 5 segments par vidéo.

**Brief contenu Session 3** — `raw-adventure-brief-contenu-session-3.md`. Support de production des **8 vidéos d'intro de pilier** Phase 1 (une par pilier, Respiration → Élimination et détox). Côté Claude Code : indique les médias vidéo qui seront intégrés à IA-41 (récapitulatif évaluation initiale, où l'intro pilier est présentée), avec une structure en 5 segments par vidéo.

**Brand Core** — `RAW_ADVENTURE___BRAND_CORE.md`. Positionnement, ton, vocabulaire, philosophie. Référence permanente pour le copy.

**Charte graphique** — `__Charte_Graphique___Raw_Adventure_.md`. Palette de couleurs, typographies, univers visuel. À consulter pour toute décision visuelle. Les tokens du `src/theme/` doivent en dériver.

**Cadrage stratégique** — `raw-adventure-cadrage-v2.md`. Vision long terme du parcours 12 mois (Phase 0 + Phase 1 + Phase 2 + Phase 3). Utile pour comprendre où va le produit, même si seules les Phase 0 + Phase 1 sont en V1.

**User Personas v1** — `raw-adventure-user-personas-v1.md`. Isabelle (segment A, chaude marque/chaude santé) et Caroline (segment C, froide marque/chaude santé). Personas V1.

**Avatar synthèse ChatGPT** — `raw-adventure-avatar-synthese-chatgpt.md`. Matière complémentaire personas.

**Note de passation post-audit** — `raw-adventure-passation-post-audit.md`. Récap de l'état du projet post-audit V0 et état d'avancement du Plan de patches en cascade. Remplace la précédente note de passation qui est devenue obsolète après livraison de l'audit le 7 mai 2026.

---

## 9. Décisions reportées (à ne pas inventer)

Ces points ne sont pas tranchés au 8 mai 2026. Si une tâche les touche, signaler à Stéphane et utiliser un placeholder explicite plutôt qu'inventer une réponse.

**D12 — Fréquence et contenu précis des notifications Mimi & Jacky.** Reporté à la Feature Spec dédiée par pilier et au Brief contenu V1 (Phase 0 et Phase 1 jour par jour, à venir). Principes actés : max 1-2/jour en Phase 0, 1/jour en Phase 1, 4 types de notifications (rappel, observation, encouragement, message de fond), plage de silence 22h-8h locales (D32).

**D13 — Détail des principes de sortie S8.** Reporté à la Feature Spec après discussion équipe. Principes actés : célébrer ce qui a été acquis, mode consolidation libre, activation de la proposition de mentorat, abonnement maintenu comme valeur.

**D14 — Calcul détaillé de la toile d'araignée.** **Résolu partiellement** par Métriques V1 V1.0 (livré le 8 mai 2026). Le calcul est désormais documenté : 8 branches, formule de score brut sur 60 normalisée sur 0-100 par `(brut - 12) × (100/48)`, mécanique de mise à jour décrite dans § 1.3. Les libellés narratifs des 5 niveaux par pilier (24 micro-textes section 1.6 et 40 libellés narratifs section 2.4) restent à compléter avec Jacky lors de la session dédiée (90 minutes).

**D15 — Mapping profil onboarding → niveau de départ par pilier.** **Résolu partiellement** par Métriques V1 V1.0 (livré le 8 mai 2026). La structure du mapping est désormais documentée : matrice 8 profils × 8 piliers = 72 cases pour la Phase 0, plus une nouvelle table de correspondance pédagogique 5 diagnostics × 8 piliers = 40 cases pour la Phase 1 (séparation diagnostic 5 niveaux + engagement 3 niveaux actée par décision B2 de l'audit V0). Le contenu des 112 cases reste à remplir avec Jacky lors de la session dédiée.

**D16 — Calibrage du contenu bonus Phase 1 (conversion précoce).** Reporté à la Feature Spec dédiée par pilier et au Brief contenu V1. Principes actés : déblocage progressif, 1-2 pièces de contenu par jour, ordre suivant les piliers de Phase 1, types = vidéos d'intro + podcasts + lectures.

**Prix d'abonnement précis.** Pas encore arrêté. Un seul tier, deux durées (mensuel et annuel) qui sont la même offre à durées différentes. Pas de trimestriel. Grille de prix précise à arrêter en Feature Spec abonnement.

### Note sur les prochains docs à produire

Au 8 mai 2026, le Plan de patches en cascade post-audit en est à 6 étapes sur 7 livrées. Reste l'étape 7 : **création du Schéma de données V1**, qui documente les tables Supabase actuelles (`profiles`, `progress`) et les tables à créer pour la V1 (`streak_history`, `joker_consumptions`, `tier_reaches`, `pillar_evaluations`, `pillar_sessions`, `level_adaptive_choices`), plus une table vide `daily_check_ins` réservée pour V2 (questionnaire fin de journée différé par D36). Ce doc est nécessaire avant le démarrage des chantiers code Bloc 1 (M2 + M3 calendaire et streak/joker, M7 + A3 inversion flow auth + migration local→distant).

Une fois le Schéma de données V1 livré, les **Feature Specs dédiées par pilier** (8 piliers, S1 Respiration en premier) seront le prochain bloc de cadrage produit, en parallèle de la session avec Jacky pour finaliser Métriques V1 V1.0 (compléments Annexe A + production des piliers atypiques S3 Mindset, S4 Condition physique, S5 Repos).

---

## 10. Décisions tranchées clés (résumé exécutif)

Pour aller plus vite quand la mémoire flanche. Détail complet dans la Synthèse des décisions V6.

*Note importante (V1.2, 8 mai 2026).* La numérotation des décisions de cette section diffère de celle de la Synthèse V6 dans certains cas (par exemple D7 ci-dessous correspond à D29 dans la Synthèse, D8 ci-dessous correspond à D9, D10 correspond à D11, D11 correspond à D33). C'est un héritage de la rédaction initiale du CLAUDE.md V1.0 qui précédait la stabilisation de la numérotation Synthèse. **La numérotation canonique reste celle de la Synthèse V6.** Cette section est conservée telle quelle pour stabilité, mais en cas de doute sur l'identifiant exact d'une décision, consulter la Synthèse V6.

**D1** — S0 de transition entre Phase 0 et Phase 1 (2 jours, gratuits).
**D2** — Toile d'araignée à 8 branches comme score de vitalité V1.
**D3** — Conversion accessible dès J3, pas concentrée sur J15 (J15 = palier narratif S0.1, pas paywall). **Modifié implicitement par audit V0** : le paywall terminal forcé à `streak >= 14` du V0 a été retiré le 7 mai 2026 (commit `207e573`), conformément à cette décision.
**D4** — Personnalisation Option B (profil onboarding calibre niveau de départ par pilier) + niveau adaptatif manuel "moins/pareil/plus" en cours de pratique.
**D5** — Toile d'araignée révélée au S0.1 uniquement (masquée pendant Phase 0).
**D6** — Streak avec 1 joker/semaine **calendaire fixe** (lundi-dimanche fuseau local), validation Phase 0 à **5 actions/7 minimum** (modifié 7 mai 2026, V6 de la Synthèse — était 4/6 dans V5), validation Phase 1 à 1 session/3 min.
**D7** — Six paliers de récompense streak (7j, 15j, 30j, 60j, 100j, 1 an), chaque palier déclenche une vidéo de 30s + message personnalisé (au premier franchissement, voir D29).
**D8** — Habitudes Phase 0 retirées en Phase 1 (principe pédagogique d'isolation des piliers).
**D9** — Mentorat visible passif S1-S7, proposition active à S8 sans hard-sell.
**D10** — Communauté = groupe Telegram externe en V1, pas de communauté intégrée.
**D11** — Un seul tier d'abonnement, deux durées (mensuel + annuel).
**D17** — Durée S0 actée à 2 jours (S0.1 + S0.2).
**D18** — Navigation à 3 onglets : Accueil (par défaut), Toile (masqué Phase 0, apparaît au S0.1), Profil. Pas de menu hamburger.
**D19** — Quatre écrans de jour-charnière en Phase 0 : J3, J7, J11, J14, qui se superposent à l'accueil au premier lancement du jour.
**D20** — Pas de rattrapage automatique des jours manqués. Le calendrier de l'app suit le calendrier réel.
**D21** — Workflow git : commits directs sur `main` avec validation explicite de Stéphane avant chaque commit. Pas de push tant que GitHub n'est pas configuré.
**D22** — Repo GitHub privé à connecter. Pas open source. Bénéfices : sauvegarde hors machine, possibilité d'inviter un collaborateur, historique sécurisé. À activer dans les semaines qui viennent.
**D23** — Architecture multilingue prévue dès la V1, contenu V1 français uniquement. Slots de copy identifiés, pas de chaînes en dur, médias référencés par asset stable, helpers de format pour les locales sensibles.
**D24** — Démarrage différé optionnel à la création de compte. Si moins de 4h avant minuit local, l'app propose explicitement "On démarre maintenant ou demain matin ?". Implique deux nouveaux écrans IA-10b et IA-10c.
**D25** — Absence prolongée traversant un changement de phase : les écrans narratifs de transition sont joués dans l'ordre, à raison d'un par lancement. Pas de saut direct, pas d'enchaînement multiple en une session.
**D26** — Soft-rappel non-culpabilisant en Phase 0 quand l'utilisateur valide sa journée **sous le seuil de 5 actions sur 7** (modifié 7 mai 2026 conformément à D6). Pas de soft-rappel en Phase 1.
**D27** — Pas de modification rétroactive d'un check journalier validé. Une journée validée reste validée. Pas de fenêtre de modification.
**D28** — Storage local-only pour la V1. Pas de backend cloud. Désinstallation = streak perdu. À monitorer en cohorte d'utilisateurs payants.
**D29** — Paliers de récompense — premier franchissement avec vidéo dédiée (modale IA-50 complète), redéclenchement allégé sans vidéo aux franchissements suivants après cassure (modale simplifiée). Compteur interne `tier{N}ReachedCount`.
**D30** — Coordination palier 15j et S0.1 : IA-20 prime, IA-50 du palier différé d'un cran. Logique généralisable : narratif structurant prime, palier différé.
**D31** — Niveau adaptatif manuel uniquement en V1. **Aucun changement automatique du niveau d'entrée** par l'app. Messages de suggestion contextuels autorisés (par exemple si plusieurs choix "Moins" successifs sont enregistrés, l'app peut suggérer à l'utilisateur de modifier son niveau d'entrée — mais le changement effectif reste manuel via IA-44 ou IA-41/IA-42). Sémantique précisée 7 mai 2026, V6 de la Synthèse.
**D32** — Plage de silence des notifications entre 22h et 8h locales. Aucune notification dans cette plage, quelle que soit la famille.
**D33** — Une seule vidéo d'intro par pilier en V1. Pas de variante par niveau d'entrée ni par profil dynamique. La vidéo s'adresse au niveau Progression par défaut. Production simplifiée : 8 vidéos au lieu de 24.
**D34** — **Pas de score quotidien V1** (ajouté 7 mai 2026, V6 de la Synthèse). Le ratio `doneCount/totalCount` (par exemple 5/7) est affiché transitoirement dans la modale IA-15 comme information utile en temps réel mais n'est ni stocké ni agrégé sur la durée. La table `daily_check_ins` est créée vide en V1, réservée pour V2.
**D35** — **Pas de badges par pilier V1** (ajouté 7 mai 2026, V6 de la Synthèse). Les libellés narratifs des fichiers piliers Jacky V0 (par exemple "Cohérence cardiaque acquise") restent réutilisables comme **moments narratifs** en cours de semaine, mais ne donnent pas lieu à un système de badges UI dédié. Système de badges potentiel pour V2.
**D36** — **Pas de questionnaire fin de journée V1** (ajouté 7 mai 2026, V6 de la Synthèse). La matière Jacky existante (questionnaire fin de journée Phase 0) est conservée comme matière V2. La table `daily_check_ins` est créée vide en V1.
**D37** — **Effet miroir qualitatif V1, chiffré V2** (ajouté 7 mai 2026, V6 de la Synthèse). En V1, on intègre 8 à 12 phrases d'effet miroir qualitatives dans les écrans de jour-charnière J3/J4/J7/J11 (Brief contenu V1 à produire). Pas de système de score quantitatif dynamique calculé sur le pourcentage de complétion, qui aurait nécessité D34 (score quotidien) déjà différée.

---

## 11. Historique des versions de ce CLAUDE.md

**Version 1.3 — 13 mai 2026.** Patch en sortie de production de la Feature Spec S1 Respiration (livrée le 12 mai 2026 en V0.1 draft itératif, passée en V1.0 stable le 13 mai après relecture Stéphane). Section 8 (sources de vérité) enrichie d'une nouvelle entrée pour la **Feature Spec S1 Respiration V1.0** comme source de vérité dédiée pour tout travail sur le pilier S1 et comme pilier-pattern Type A pour les Feature Specs S2 à S8 à venir. Quatre entrées existantes mises à jour : Feature Spec V1 Socle minimum V1.1 → V1.2 (acte du joker en Phase 1), Métriques V1 V1.0 → V1.5 (recalibrage paramètre principal S1 à 5/10/20 min), Schéma de données V1.0 → V1.1 (ajout table `notifications_sent`), Customer Journey V1.2 → V1.3 (migration ordre canonique D8 → D39). Aucune nouvelle décision structurelle D42+ — les choix faits sur S1 sont des spécifications de pilier consignées dans la Feature Spec S1, pas des décisions produit transverses. Section 7 du CLAUDE.md (carte des écrans IA) reste inchangée — l'inventaire des 45 écrans est stable.

**Version 1.2 — 8 mai 2026.** Patch suite à la livraison de l'audit V0 vs docs fondateurs (7 mai 2026) et à l'exécution des étapes 1 à 6 du Plan de patches en cascade. Section 5 enrichie de deux nouvelles sous-sections : "État du proto V0 et dette identifiée" (code mort `useProgress.ts` à supprimer, `ProtocolScreen.tsx` à conserver comme prototype Phase 1, externalisation de la clé Supabase, plan de refonte V1 avec chantiers M2/M3/M5/M7 et charges estimées, convention de numérotation des fichiers Jacky selon D8) et "Posture du reset utilisateur en V1" (flag `__DEV__` pour conserver les raccourcis dev sans les exposer en production, posture sur le paywall V0 patché par le commit `207e573`). Section 8 (sources de vérité) actualisée : Synthèse V5 → V6, IA V1 → V3, Feature Spec V1.0 → V1.1, Métriques V1 V0.3 → V1.0, ajout de l'entrée Audit V0 vs docs fondateurs, ajout de la note de session avec Jacky V2.0, mise à jour de la note de passation. Section 9 actualisée : statuts D14 et D15 partiellement résolus par Métriques V1 V1.0, retrait de la note "Métriques V1 prochain doc bloquant" remplacée par une note sur le Schéma de données V1 (étape 7 du Plan, à venir) et les Feature Specs dédiées par pilier. Section 10 (résumé exécutif des décisions) enrichie : modifications de D6 (5/7) et D31 (sémantique adaptation messagée), ajout de D34 à D37, plus une note d'avertissement sur la divergence de numérotation entre cette section et la Synthèse V6 canonique.

**Version 1.1 — 6 mai 2026.** Patch ciblé sur six écarts identifiés dans la note de passation du 6 mai. Synthèse des décisions actualisée V3 → V5 avec intégration des décisions D22 à D33 (résumé exécutif section 10 et implications de code remontées en sections 2, 4, 5, 6, 7). Inventaire des écrans actualisé 43 → 45 avec ajout de IA-10b (choix de démarrage) et IA-10c (attente pré-Phase 0) liés à D24. Feature Spec V1 Socle minimum (version du 6 mai) ajoutée en source de vérité technique pour les écrans S0, le format-type intro de pilier, et le Socle transverse de mécaniques. Briefs de contenu Sessions 1, 2 et 3 ajoutés en sources (paliers streak, vidéos S0, intros de pilier). Section 9 enrichie d'une note sur Métriques V1 comme prochain doc bloquant nécessitant une session dédiée avec Jacky. Section 5 enrichie d'un paragraphe sur le storage local-only (D28) avec ses implications pratiques pour Claude Code. La structure du document (11 sections) reste inchangée — c'est un incrément de contenu, pas une refonte. La section "Carte des écrans" est passée de section 6 à section 6 (identique) ; la numérotation des sections suivantes (7 à 11) reste stable.

**Version 1.0 — 5 mai 2026.** Création du fichier. Reflète l'état des docs Project au 5 mai 2026 (Product Vision v2.2, Synthèse des décisions V3, Information Architecture V1 à 43 écrans, Customer Journey V1.2). Décision D21 (workflow git) ajoutée.

À mettre à jour à chaque décision structurelle nouvelle (D38+), à chaque évolution majeure de la stack ou du périmètre, à chaque nouveau livrable Project (Schéma de données V1, Feature Spec dédiée par pilier, Brief contenu Phase 0 et Phase 1).

---

*Fin du fichier. Si tu lis ceci, tu es prêt à coder en accord avec Raw Adventure. Bon travail.*

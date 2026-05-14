# Brief Claude Code — Raw Adventure App V1

**Document de transmission pour démarrer le développement React Native de Raw Adventure App.**

Auteur : Stéphane (avec assistance Claude). Date : 14 mai 2026. Version : 1.0.

---

## Contexte court

Raw Adventure est un SaaS de santé naturelle en abonnement mensuel — app mobile React Native + Expo. Le périmètre V1 couvre **10 semaines d'expérience utilisateur** : Phase 0 (14 jours d'amorçage multi-piliers) + Phase 1 (8 semaines, un pilier de santé par semaine). Les phases 2 et 3 sont planifiées V2/V3 et sont **hors scope V1**.

Fondateur : Stéphane. Voix de l'app : Mimi & Jacky (en différé via vidéos, pas en live ni en 1-to-1).

Les documents de référence pour bien comprendre le produit avant de coder sont :
- `raw-adventure-product-vision-v2-2.md` (vision globale, principes directeurs non-négociables)
- `raw-adventure-feature-spec-v1-socle-minimum-v1-1.md` (mécaniques transverses)
- `raw-adventure-information-architecture-v1.md` (les 45 écrans V1 et leurs interactions)
- `raw-adventure-decisions-v8-1.md` (toutes les décisions tranchées à ce jour)
- `RAW_ADVENTURE___BRAND_CORE.md` (ton et vocabulaire à utiliser dans le copy)
- `raw-adventure-design-system-v1.md` (le document de design system V1.1 livré en session du 14 mai 2026 — ce que tu utiliseras le plus quand tu codes)

---

## Stack technique

**Core.** React Native + Expo (SDK le plus récent stable). TypeScript strict.

**Navigation.** React Navigation v6+, avec :
- Stack Navigator pour les flows linéaires (onboarding, évaluations)
- Bottom Tab Navigator pour la navigation principale (Accueil / Toile / Profil)
- Modal navigator pour les couches narratives (S0.1, S0.2, paliers, jours-charnière)

**Stockage.** Local-only en V1. AsyncStorage ou MMKV pour la persistance (AsyncStorage suffit pour démarrer, MMKV à envisager si performance limitante).

**Typographie.** `@expo-google-fonts/inter` pour Inter (poids 400, 500, 600, 700, 800). Lulo Clean en SVG figé (asset PNG ou SVG à intégrer). Georgia système en V1 (pas d'embedding).

**Iconographie.** `lucide-react-native`. Tree-shaking automatique, import nommé icône par icône.

**SVG.** `react-native-svg` pour la toile d'araignée, le logo Raw Adventure et tout asset graphique vectoriel.

**Animations.** `react-native-reanimated` v3+ pour les animations performantes (60fps). Pas de Lottie en V1.

**Safe area.** `react-native-safe-area-context` (hook `useSafeAreaInsets`).

**État.** À voir selon complexité. Pour V1 local-only, React Context + useReducer peut suffire. Zustand est une alternative légère et propre si on a beaucoup d'écrans à coordonner.

---

## Conventions de code

### Structure du repo

```
raw-adventure-app/
├── src/
│   ├── theme/
│   │   ├── tokens.ts          # Design tokens (cf. theme-tokens.ts livré)
│   │   ├── usePillarTheme.ts  # Hook pour couleurs du pilier courant
│   │   ├── useScaledFontSize.ts  # Hook pour Dynamic Type
│   │   └── index.ts
│   ├── components/
│   │   ├── primitives/        # Boutons, cards, inputs (Section 5)
│   │   ├── compositions/      # Header pilier, streak counter, tab bar
│   │   ├── toile/             # Composant Toile (Section 6)
│   │   └── illustrations/     # Logo Raw Adventure, motifs
│   ├── screens/
│   │   ├── onboarding/        # IA-01 à IA-09
│   │   ├── phase0/            # IA-10 à IA-22
│   │   ├── phase1/            # IA-30 à IA-50
│   │   ├── toile/             # IA-25, IA-26
│   │   ├── profil/            # IA-70 à IA-75
│   │   └── shared/            # Écrans réutilisables
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── TabNavigator.tsx
│   │   └── types.ts
│   ├── state/                 # Store global (parcours, streak, évaluations)
│   ├── data/                  # Données statiques (sessions piliers, copy)
│   ├── utils/
│   └── App.tsx
├── assets/
│   ├── fonts/                 # Fichiers Inter (chargés via expo-google-fonts)
│   ├── images/                # Logo Raw Adventure (PNG)
│   └── videos/                # Vidéos Mimi & Jacky (14 vidéos V1)
└── package.json
```

### Règles de discipline

**Zéro valeur visuelle en dur dans le code.** Toutes les couleurs, espacements, tailles typographiques, rayons, durées d'animation passent par `tokens.ts`. Pas de `paddingHorizontal: 22` — c'est `tokens.space[5]`.

**Un composant a un usage précis, pas deux.** Si une situation fait hésiter entre deux composants existants, c'est qu'il manque un troisième composant ou qu'on devrait en utiliser un et pas l'autre. Voir Section 5 du design system pour les règles d'arbitrage.

**TypeScript strict.** Pas de `any`. Tous les composants typés, tous les props validés, tous les retours de hooks typés.

**Pattern d'écran mentionné explicitement.** Chaque écran (composant Screen) commence par un commentaire en tête : `/** Référence IA : IA-XX. Pattern : [A/B/C/D/E/F/G]. */`. Permet de retrouver instantanément la structure de référence dans le design system Section 10.

**Tests visuels obligatoires sur device réel.** Les animations critiques (déploiement toile, validation action, palier) doivent être testées sur iPhone 11+ et Android Pixel 4+ avant validation, pas seulement sur simulateur.

---

## Référence des 4 maquettes validées

Quatre écrans de référence ont été produits et validés en session design. Ils servent de gabarit visuel pour l'implémentation.

**Maquette 1 — Écran jour Phase 1 (S7 Mindset).** Pattern B Hub d'accueil quotidien. Démontre la grammaire d'un écran de pilier en Phase 1 : header pilier illustré coloré + logo Raw Adventure en filigrane + bulle streak intégrée + fond pastel saturé + card sessions + bouton primaire. À répliquer pour les 8 piliers en variant la palette `pillar.{S}` (S1 à S8).

**Maquette 2 — Écran jour Phase 0 (Pêche corail).** Pattern B Hub d'accueil quotidien adapté Phase 0. Démontre l'écran sans pilier isolé : header Phase 0 corail profond `#E65D3C` + logo en filigrane + fond pêche `#FFB87A` + checklist 7 actions avec icônes Lucide neutres + tab bar 2 onglets (Toile masquée en Phase 0).

**Maquette 3 — Écran toile (IA-25 hybride camembert + radar).** Pattern E Hub de visualisation. Démontre le composant signature Toile en version V1.1 hybride. **Provisoire — à itérer avec Mimi après production de références visuelles complémentaires.** Implémenter d'abord la version V1.1 décrite Section 6, prêt à recevoir une refonte du composant Toile ultérieurement.

**Maquette 4 — Slide onboarding 1 Welcome.** Pattern A Écran narratif plein. Démontre l'écran d'entrée : logo Raw Adventure en grand format coloré (violet profond plein sur fond pêche corail) + indicateur de progression 10 segments + titre Display + sous-titre body large + bouton primaire avec icône flèche + bouton ghost.

Les maquettes sont visibles via un fichier HTML consolidé livré dans la session design (à demander à Stéphane si non transmis).

---

## Ordre de priorité de développement recommandé

Pour démarrer le code de manière la plus efficace possible, voici l'ordre que je recommande.

### Sprint 0 — Fondations (1-2 jours)

(1) Setup du projet Expo + TypeScript + dépendances core.
(2) Création du dossier `src/theme/` avec `tokens.ts` (depuis le fichier livré).
(3) Implémentation des hooks `usePillarTheme()` et `useScaledFontSize()`.
(4) Setup `@expo-google-fonts/inter` avec splash screen.
(5) Intégration du logo Raw Adventure (PNG) dans `assets/images/`.

### Sprint 1 — Composants primitives (3-5 jours)

(1) `Button` (primaire / secondaire / ghost / destructive, 3 tailles, états).
(2) `Card` (standard / forte / action / pilier).
(3) `Checkbox` (grande Phase 0 + standard).
(4) `Scale15` (composant échelle 1-5 pour évaluations).
(5) `LevelSelector` (Moins / Pareil / Plus).
(6) `StreakCounter` (bulle blanche avec flamme orange).
(7) `Modal` (plein écran + standard + bottom sheet).

### Sprint 2 — Composants signature (2-3 jours)

(1) `PillarHeader` (header pilier illustré avec logo en filigrane — Section 5.8).
(2) `LogoFiligrane` (composant SVG du logo Raw Adventure utilisable dans plusieurs contextes).
(3) `Toile` (composant signature avec 5 couches — Section 6).

### Sprint 3 — Navigation et écrans Phase 0 (5-7 jours)

(1) Setup RootNavigator + TabNavigator.
(2) Écrans IA-01 à IA-09 (Onboarding) — Pattern A et D.
(3) Écrans IA-10 à IA-15 (accueil Phase 0, jour Phase 0, détail pilier Phase 0, jours-charnière, modale validation).
(4) Logique de validation quotidienne, streak counter, paliers.

### Sprint 4 — Phase 1 et Toile (5-7 jours)

(1) Écran IA-20 révélation toile (S0.1).
(2) Écrans IA-30 à IA-50 (parcours Phase 1, sessions, évaluations, fin de pilier).
(3) Écrans IA-25 et IA-26 (onglet toile et détail branche).
(4) Logique des évaluations 12 questions, calcul des scores, mise à jour de la toile.

### Sprint 5 — Profil, finition, tests (3-5 jours)

(1) Écrans IA-70 à IA-75 (profil et paramètres).
(2) Écran IA-22 sortie de S8 et IA-23 mode consolidation.
(3) Tests sur device réel iPhone 11+ et Android.
(4) Polissage des animations, accessibilité (VoiceOver, Dynamic Type, Reduce Motion).

Total estimé : **3 à 4 semaines de développement** pour un développeur React Native expérimenté.

---

## Points d'attention spécifiques

### Le composant Toile est le plus risqué

C'est le composant le plus complexe techniquement (SVG + animations + 5 couches superposées) et celui dont la qualité fait le succès visuel de l'app. **Le V1.1 livré est validé provisoirement** — Stéphane prévoit de retravailler le design de la toile avec Mimi à partir de références visuelles complémentaires.

Recommandation : implémenter le composant Toile V1.1 tel que spécifié, mais le designer en composant React paramétré avec des props clairs, pour permettre une refonte ultérieure du rendu visuel sans casser l'architecture du composant.

### Le logo Raw Adventure est central

Le logo (`Raw_Adventure_Center_-_Cercle-Fleur_-_Transparent_Blanc.png` fourni) est utilisé dans plusieurs contextes : header pilier en filigrane (opacité 14-16%), slide onboarding en grand format coloré, splash screen, header de profil. Créer un composant `LogoRawAdventure` paramétré (taille, couleur, opacité) qui rend l'asset PNG ou SVG selon contexte.

### Le streak counter n'est PAS un composant flottant en haut de l'écran

Contrairement à ce qu'on pourrait penser, le streak counter (bulle blanche avec flamme orange) est **intégré dans le composant PillarHeader**, dans la ligne de métadonnées sous le titre du pilier. Voir Maquettes 1 et 2 pour le rendu.

### La palette par pilier change avec le contexte

Le hook `usePillarTheme()` doit retourner les bonnes couleurs selon où l'utilisateur se trouve dans son parcours. États possibles :
- Phase 0 (onboarding + 14 jours d'amorçage) → palette `pillar.phase0`
- Phase 1 semaine X (X de 1 à 8) → palette `pillar.s{X}`
- Onglet Toile ou Profil → palette `pillar.neutral`

Le hook lit l'état du parcours depuis le store global et retourne les couleurs correspondantes.

### Les vidéos Mimi & Jacky sont 14 unités V1

Au total : 6 vidéos paliers streak (7j, 15j, 30j, 60j, 100j, 365j) + 2 vidéos S0 (S0.1, S0.2) + 8 vidéos intros pilier Phase 1 + éventuellement vidéo de sortie S8. À intégrer en `assets/videos/` avec lecture inline via `expo-av` ou `expo-video`. Pas de plein écran natif obligatoire en V1, mais à envisager si limitation technique.

### Pas de pages "à propos", "CGU", "confidentialité" détaillées en V1

Les écrans IA-74 (CGU) et IA-75 (politique de confidentialité) sont à rédiger avec un avocat ou un template fiable. Pour le code V1, prévoir les écrans avec un placeholder "Contenu en cours de rédaction" plutôt que de tarder le développement.

---

## Comment travailler avec Stéphane

Stéphane est HPI avec TDAH : son cerveau génère beaucoup d'idées simultanément, il a besoin d'aide pour structurer et exécuter. Il n'est pas développeur de formation. Il préfère les explications en plain language, sans jargon technique inutile.

**Quand tu poses une question, sois précis et concis.** Préfère 2-3 choix précis qu'une question ouverte floue. Stéphane apprécie qu'on l'aide à trancher rapidement.

**Quand tu fais une décision technique non-évidente, documente-la.** Une décision tranchée mérite un commentaire dans le code et un rappel dans le `raw-adventure-decisions-v8-1.md` si elle est structurelle.

**Quand tu rencontres une ambiguïté dans le design system ou les specs, demande avant d'inventer.** L'app est encore au stade design, beaucoup de petites décisions restent à prendre. Mieux vaut une question rapide qu'une feature à refactorer.

**Reste fidèle aux principes directeurs non-négociables.** Cf. Section 1 du design system. Si une feature contredit un principe, dis-le clairement et propose une alternative.

---

## Décisions tranchées à respecter (rappel des décisions clés V1)

- **V1 = Phase 0 + Phase 1 uniquement** (10 semaines d'expérience utilisateur)
- **Voix dans l'app = Mimi & Jacky en différé** via vidéos préenregistrées
- **Communauté = groupe Telegram externe** (pas d'intégration en V1)
- **Mentorat = visible et désirable dans l'app, mais sans pression commerciale**
- **Pas de live, pas de coaching 1-to-1, pas d'intégrations tierces en V1**
- **Un seul tier d'abonnement** (modalités précisées dans Feature Spec)
- **Personas V1** = Isabelle (segment A, chaude marque/chaude santé) + Caroline (segment C, froide marque/chaude santé). Segments B et D explicitement hors-cible V1.
- **Tab bar 3 onglets** : Accueil / Toile / Profil. Onglet Toile masqué en Phase 0.
- **Local-only** : pas de backend en V1, tout en AsyncStorage ou MMKV.
- **Palette par pilier** qui bascule selon le contexte (signature visuelle de l'app).
- **Logo Raw Adventure utilisé comme motif identitaire** dans les headers pilier en filigrane et en grand format coloré dans l'onboarding.
- **Composant Toile en V1.1 provisoire**, à itérer avec Mimi en patch ultérieur.

---

**Fin du brief Claude Code V1.0.**

Pour toute question ou ambiguïté, contacter Stéphane directement. Bon développement.

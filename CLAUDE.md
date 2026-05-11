# CLAUDE.md — Raw Adventure App

*Fichier de contexte projet pour Claude Code, à la racine du repo Raw Adventure App. Lu en début de chaque session CLI. Sa source de vérité reste les documents du Project Claude.ai (référencés en section 10). Si une info de ce fichier semble contredire un doc Project plus récent, c'est le doc Project qui gagne — il faut alors mettre à jour ce CLAUDE.md.*

*Daté du 11 mai 2026 — Version 1.0 (création).*

---

## 1. Comment utiliser ce fichier

Avant chaque tâche, suis ce réflexe en trois temps. **Lire ce fichier**, au moins en survol, pour rappeler les principes, le périmètre et le glossaire métier. **Identifier l'élément concerné** par son identifiant stable : un écran porte un `IA-XX` (cartographie complète dans l'Information Architecture V1 V3), une mécanique transverse porte un `Mx-Ax` (Feature Spec V1 Socle minimum V1.1), une décision produit porte un `Dxx` (Synthèse des décisions V6). Si l'élément n'existe pas dans ces nomenclatures, c'est une alerte — soit l'élément a été ajouté hors process, soit la tâche déborde du périmètre V1. Dans les deux cas, en parler à Stéphane avant de coder. **Si un cadrage manque** — typiquement un détail de calcul, de fréquence, de mapping, de copy précis — ne pas inventer. Signaler à Stéphane que la décision est reportée (voir section 11), utiliser un placeholder explicite (`// TODO: décision Dxx reportée à <doc>` ou valeur de fallback documentée) et continuer sur autre chose.

Stéphane n'est pas développeur de formation. Plain language obligatoire dans les échanges. Quand un terme technique est nécessaire, l'expliquer brièvement. Pas de jargon décoratif. Style mini-livre, blocs compacts, pas de bullet points décoratifs ni de retours à la ligne hachés.

Pas de commit sans validation explicite de Stéphane. Pas de push vers une branche distante tant que GitHub n'est pas configuré. Quand il le sera, repo en mode **privé** — Raw Adventure est un produit commercial, pas open source (voir D22).

---

## 2. Le projet en une page

**Raw Adventure App** est une application mobile de santé naturelle, en abonnement mensuel, dont le cœur est un parcours de coaching guidé sur 12 mois qui fait ressentir la vitalité par l'expérimentation corporelle. L'app fait office de **pré-mentorat** — elle prépare l'utilisateur à un mentorat 1-to-1 (vente séparée, hors app).

**Mimi & Jacky** sont les visages incarnés de la marque. Ils parlent dans l'app via des vidéos pré-enregistrées et des messages écrits. Pas de live, pas de masterclass temps-réel, pas de coaching 1-to-1 dans l'app.

### Périmètre V1 figé

La V1 couvre uniquement les **10 premières semaines** de l'expérience utilisateur, dans cet ordre exact.

**Phase 0** — 14 jours gratuits, multi-actions en parallèle (**7 actions** de base : activation matinale, défi froid, mouvement ou récupération selon le jour, minéralisation, fenêtre digestive, fruits, soirée sans écrans). Validation streak à **5 actions sur 7 minimum** par jour (D6), avec soft-rappel non-culpabilisant en dessous du seuil (D26). Quatre écrans de jour-charnière (J3, J7, J11, J14) qui se superposent à l'accueil au premier lancement du jour concerné. Toile d'araignée masquée pendant toute la Phase 0 (D5).

**S0** — Transition de 2 jours gratuits (D1, D17). **S0.1** célèbre les 14 jours et révèle la toile d'araignée du score de vitalité. **S0.2** présente la roadmap des 8 semaines et enchaîne sur l'évaluation initiale du pilier S1.

**Phase 1** — 8 semaines payantes, **ordre canonique D39** des piliers (figé en V1, voir glossaire section 7) : S1 Respiration → S2 Activité physique → S3 Alimentation → S4 Connexion au vivant → S5 Repos et régénération → S6 Passion et chemin de vie → S7 Mindset → S8 Élimination et détox. Structure-type par semaine : évaluation initiale 12 questions (échelle 1-5, score brut /60), 3 niveaux d'engagement (Essentiel/Progression/Immersion), 3 sessions/jour, niveau adaptatif manuel, test avant/après session, évaluation finale, mise à jour de la branche correspondante de la toile. Validation streak à 1 session sur 3 minimum par jour. Les habitudes Phase 0 sont retirées en S1 (D9, principe d'isolation des piliers). Une seule vidéo d'intro par pilier en V1 (D33).

**Sortie de S8** — Célébration, mode consolidation libre, proposition active du mentorat sans hard-sell (D11).

### Voix et posture du produit

Mimi & Jacky parlent à la première personne du pluriel ("on", "nous"). Ton dense, direct, crédible, structuré, incarné. Calme mais impactant. Rationnel mais incarné. Inspirant sans naïveté. Direct sans agressivité. Détail complet en section 4.

### Hors-scope V1

Liste fermée en section 9. Si une feature ressemble à un point de cette liste, c'est une alerte rouge.

---

## 3. Les 8 principes directeurs non-négociables

Ces principes guident chaque décision produit, chaque écran, chaque ligne de code, chaque mot de copy. Si une feature les contredit, elle dégage. Repris textuellement du Product Vision v2.2. Pour chaque principe, une conséquence code typique est indiquée en italique — c'est la traduction opérationnelle que Claude Code doit garder en tête.

**1. L'utilisateur ne doit pas réfléchir.** Il doit être guidé. Aucun choix complexe, aucun arbitrage à faire seul. *Conséquence code : pas d'écran avec plus de 2 choix simultanés. Pas de réglages cachés dans Paramètres qui modifient la trajectoire du parcours. Les valeurs par défaut sont toujours la bonne réponse pour 80% des utilisateurs.*

**2. Le ressenti prime sur la théorie.** Avant d'expliquer, on fait vivre. *Conséquence code : les écrans d'action passent avant les écrans pédagogiques. Pas de longue intro théorique avant un exercice. Les vidéos d'intro de pilier sont limitées à 1-2 min (D33).*

**3. Simplicité extrême.** Si une feature demande plus de 30 secondes d'explication, elle est probablement de trop. *Conséquence code : pas d'onboarding interne d'une feature ("appuyez ici pour…"). Si on doit l'expliquer, on la simplifie ou on la coupe.*

**4. Moins d'une minute par jour en routine.** Le check quotidien est la mécanique cardinale. *Conséquence code : la modale de check (IA-15) doit se valider en moins de 5 taps. Pas de scroll obligatoire, pas de question intermédiaire. Performance perçue prioritaire sur les animations spectaculaires.*

**5. Progression visible et frustration positive.** L'utilisateur voit où il en est et a envie de débloquer la suite. *Conséquence code : streak toujours visible sur l'accueil. Paliers (D7, D29) annoncés en amont, pas surprise. Toile d'araignée révélée comme moment narratif structurant (D5), pas exposée à plat.*

**6. Pas de marketing bien-être creux.** Ni dans le ton, ni dans les visuels, ni dans le copy. *Conséquence code : pas d'emojis dans le copy produit, pas d'exclamations, pas de superlatifs (voir section 4). Pas de lottie "champion" ou "trophée doré clinquant".*

**7. Mimi & Jacky parlent, mais en différé.** Pas de live, pas de dépendance à leur agenda. *Conséquence code : pas d'intégration de chat, de visio, de webinar. Toutes les vidéos sont pré-enregistrées et servies depuis un CDN externe (à arbitrer en Feature Spec). Pas de WebRTC, pas de socket temps-réel pour du contenu humain.*

**8. Ne pas mettre toujours +++.** Principe pédagogique d'isolation des piliers. Rééduquer, aiguiser les sens, ressentir un seul pilier à la fois plutôt que d'empiler. La vraie progression passe par la finesse d'observation, pas par l'accumulation. *Conséquence code : les habitudes Phase 0 sont retirées en S1 sans mécanique de rappel automatique (D9). Pas de "feature de continuité" qui propose à l'utilisateur de garder une habitude Phase 0 active en Phase 1. Le retrait est délibéré, pas un bug.*

---

## 4. Voix Mimi & Jacky pour le copy en dur dans le code

Tout texte affiché dans l'app — libellés de boutons, titres d'écran, messages d'état, erreurs, placeholders — respecte la voix Mimi & Jacky. Le copy long (notifications, scripts vidéo, questions d'évaluation, messages de palier) est produit par Mimi & Jacky dans le cadre des Briefs contenu et de l'Audit copy V1. Pour tout texte que Claude Code écrit lui-même en absence de spec, respecter la grille ci-dessous. En cas de doute, placeholder neutre `[copy à valider]` et signalement à Stéphane.

### Tonalité

Dense, direct, crédible, structuré, incarné. Calme mais impactant. Rationnel mais incarné. Inspirant sans naïveté. Direct sans agressivité. C'est la voix Instagram de Mimi & Jacky transposée dans l'app. Le "on" et le "nous" renvoient au duo Mimi & Jacky. Tutoiement systématique vers l'utilisateur. Pas de "vous", pas de "l'utilisateur" dans le copy.

Style mini-livre : blocs compacts, phrases qui apportent quelque chose, pas de retour à la ligne haché, pas de bullet point décoratif dans le copy produit.

### Vocabulaire à utiliser

vitalité, énergie réelle, terrain, adaptation, physiologie, système nerveux, régénération, lecture du corps, compensation, expérimentation, transformation, ressenti, signal, observation, marge, rythme.

### Vocabulaire à éviter

wellness, bien-être (au sens marketing), miracle, magique, secret, hack, champion, guerrier, warrior, transformation totale, reset, boost, energy, vibe, mood.

### Règles strictes (non négociables)

Pas d'emojis dans le copy produit. La joie passe par la charte graphique (palette, illustrations, vidéos), pas par les pictogrammes. Pas d'exclamations sauf cas exceptionnel justifié (1 par mois maximum). Pas de "Hey", "Salut !", "Coucou", "T'es prêt ?". On entre dans le sujet. Pas de superlatifs. Pas de sur-promesse ("tu vas te transformer", "ta vie va changer"). Pas de pression par la perte ("ne perds pas ton streak", "tu vas tout perdre"). Pas de jugement positif vide ("trop bien", "bravo champion") — si on félicite, on dit pourquoi.

### Architecture multilingue (D23)

Tout texte affiché passe par un **slot de copy identifié**, jamais en dur dans un composant. Convention de naming des clés à acter en début de dev (proposition : `copy.<scope>.<element>`, ex : `copy.onboarding.slide1.title`). Le contenu V1 est en français uniquement, mais l'architecture est compatible multilingue dès le départ pour ne pas avoir à refactoriser plus tard. Pas de sélecteur de langue en V1, pas de traduction effective.

---

## 5. Stack technique et arborescence du repo

### Stack

**Framework** : React Native + Expo SDK 54 (managed workflow). TypeScript strict.

**Runtime** : React 19.1, React Native 0.81.

**Navigation** : `@react-navigation/native` v7 + `@react-navigation/native-stack`. Pas de menu hamburger, pas de tiroir latéral. Navigation à 3 onglets (Accueil, Toile, Profil) actée en D18 — l'onglet Toile reste masqué pendant toute la Phase 0 et apparaît au S0.1.

**Backend** : Supabase (`@supabase/supabase-js` v2). Auth Supabase pour la gestion utilisateur (pas de stockage manuel de mot de passe). Tables documentées dans le Schéma de données V1 (`profiles`, `progress` héritées du V0, plus les tables V1 à créer : `streak_history`, `joker_consumptions`, `tier_reaches`, `pillar_evaluations`, `pillar_sessions`, `level_adaptive_choices`, plus la table vide `daily_check_ins` réservée pour V2). La clé Supabase est **à externaliser dans un `.env` Expo** (jamais commitée en clair — c'est une dette V0 à régler dès le premier dev).

**Persistance locale** : `@react-native-async-storage/async-storage`. Stratégie hybride local + Supabase déjà en place dans le V0 (`ProgressContext`) : en mode anonyme pendant l'onboarding, les données vivent en AsyncStorage ; à la création de compte, migration vers Supabase (mécanique M7+A3 documentée dans Feature Spec V1.1 § 2.10). Cette stratégie est conservée et étendue aux nouvelles tables V1. Voir D28 (storage local-only V1, clarification post-audit : Supabase agit comme cloud minimal compatible).

**Gestion d'état** : Context API uniquement (`AuthContext`, `ProgressContext`, plus contextes V1 à créer au besoin). Pas de Redux, pas de Zustand, pas de Recoil en V1 sans justification écrite validée par Stéphane.

**Médias** : `expo-av` pour la lecture vidéo. Vidéos servies depuis un CDN externe (à arbitrer en Feature Spec) — pas de stockage dans les tables Supabase.

**Animations** : `react-native-reanimated` v4 disponible. À utiliser parcimonieusement, charte simplicité avant spectacle.

**Paiement** : Stripe ou RevenueCat à arbitrer en Feature Spec abonnement dédiée. Pas d'intégration en attendant — placeholder explicite dans IA-30 (écran conversion). Voir D3 (conversion accessible dès J3) et D22 (repo privé).

### Arborescence du repo (proposition ferme)

À utiliser telle quelle dès le premier dev. Toute modification structurelle passe par Stéphane.

```
raw-adventure-app/
├── CLAUDE.md                  # ce fichier
├── README.md                  # boot court : install, run, env vars
├── .env.example               # template des variables d'env (clés Supabase…)
├── app.json                   # config Expo
├── package.json
├── tsconfig.json
├── index.ts                   # entry point Expo
├── App.tsx                    # racine de l'app, providers Context, navigation
└── src/
    ├── screens/               # un fichier par écran IA-XX (ex: HomeScreen.tsx)
    ├── components/            # composants réutilisables (Button, Card…)
    ├── contexts/              # AuthContext, ProgressContext, etc.
    ├── hooks/                 # hooks métier (useStreak, useTier…)
    ├── lib/                   # clients externes (supabase, analytics…)
    ├── theme/                 # tokens charte graphique (colors, typo, spacing)
    ├── types/                 # types TypeScript partagés (Pillar, Archetype…)
    ├── data/                  # données statiques (days.ts, pillars.ts…)
    └── utils/                 # helpers purs (date, format, calcul streak…)
```

### Conventions de naming

Composants et écrans : **PascalCase** (`HomeScreen.tsx`, `StreakBadge.tsx`).
Fonctions, variables, hooks : **camelCase** (`completeDay`, `useStreak`).
Constantes globales : **SCREAMING_SNAKE_CASE** (`PHASE_0_DURATION_DAYS = 14`).
Fichiers de doc et de configuration : **kebab-case** (`raw-adventure-feature-spec.md`).
Clés de copy (D23) : **dot.notation** (`copy.onboarding.slide1.title`).
Clés AsyncStorage : préfixées par scope (`progress.completedDays`, `auth.session`).

Les écrans doivent porter le nom de l'identifiant IA quand c'est lisible — convention : `<NomLogique>Screen.tsx`, et un commentaire en tête de fichier renvoyant à l'ID (`// IA-15 — Modale de validation du check quotidien`).

---

## 6. Conventions de code

### TypeScript

**Strict mode activé** dans `tsconfig.json`. Pas de `any` non justifié — si un `any` est nécessaire (souvent à la frontière avec une lib non typée), commentaire explicite à côté. Types métier centralisés dans `src/types/` et réutilisés partout (ex : `Pillar`, `Archetype`, `EngagementLevel`, `BranchState`) plutôt que dupliqués. Préférer les **types unions littéraux** aux enums (`type EngagementLevel = 'essentiel' | 'progression' | 'immersion'` plutôt qu'un `enum`).

### Composants et écrans

Un fichier par composant ou écran. Fichier **> 300 lignes** = signe qu'il faut découper en sous-composants. Composants présentationnels purs dans `src/components/`, écrans complets (avec logique métier, accès aux contextes, appels Supabase) dans `src/screens/`. Hooks métier extraits dans `src/hooks/` dès qu'une logique est partagée entre 2+ écrans ou dès qu'un écran dépasse les 200 lignes par excès de hooks inline.

Tokens du `src/theme/` plutôt que valeurs en dur. Toujours `theme.colors.primary` plutôt que `#6F0FF0`, toujours `theme.spacing.md` plutôt que `16`. Inline styles à proscrire — utiliser `StyleSheet.create()` en bas de fichier ou des composants stylés dédiés.

### État, effets, dérivations

State local d'abord (`useState`). State partagé via Context uniquement si plusieurs écrans en dépendent. Pas de Context global tentaculaire — préférer plusieurs contextes ciblés (`AuthContext`, `ProgressContext`, `StreakContext` si besoin) à un `AppContext` fourre-tout.

`useEffect` à utiliser **parcimonieusement** et toujours avec un commentaire qui explique le pourquoi. Si une valeur peut être **dérivée** par calcul (ex : `isPhase0 = currentDay <= 14`), pas de `useState` + `useEffect` pour la synchroniser — un calcul direct dans le render suffit. Pas de double-source de vérité.

Pas de retour silencieux en cas d'erreur. Tout `catch` log explicitement avec `console.error` au minimum, et idéalement remonte une erreur à l'utilisateur via un état UI dédié (toast, modale d'erreur). Une exception avalée est un bug futur.

### Architecture multilingue (D23)

Pas de chaîne de caractères en dur dans le JSX. Tout texte affiché passe par une clé de copy (voir section 4). En attendant que Stéphane acte la lib de copy ou de i18n (proposition : démarrer avec un simple objet `copy` typé dans `src/data/copy.fr.ts`, basculable plus tard vers `i18next` ou équivalent si besoin V2), Claude Code utilise un helper minimal `t('copy.scope.element')` à créer dès le premier écran qui contient du texte.

### Dépendances

Toute nouvelle dépendance npm doit être **validée par Stéphane**. Pas d'install silencieux. Justifier en une phrase : à quoi elle sert, pourquoi elle est nécessaire, alternative envisagée. Cette règle évite la dette technique et le bloat. Éviter les libs lourdes pour des problèmes simples (pas de Lottie pour une animation que CSS résout, pas de Moment ni date-fns si quelques helpers `Date` suffisent — voir `src/utils/`).

Toute dépendance qui sort des principes directeurs est interdite par défaut. Exemple : une lib de "gamification" qui pousserait au "champion / guerrier" — non.

### Workflow Git et commits

Pas de commit sans validation explicite de Stéphane. Stéphane valide ou corrige.

**Format de message de commit** : court, en français, à l'infinitif ou à la première personne du pluriel. Inclure l'identifiant `IA-XX`, `Mx-Ax` ou `Dxx` quand c'est pertinent — la traçabilité avec les docs Project est précieuse. Exemples : `Ajout de IA-15 — modale de validation du check quotidien`, `Refonte de IA-30 selon D3 (conversion dès J3)`, `Correction du calcul de streak en cas de joker utilisé (M3-A4)`.

**Pas de push automatique vers une branche distante.** Tant que GitHub n'est pas configuré, tous les commits restent locaux. Quand GitHub sera connecté (en mode **privé**, voir D22 — Raw Adventure est un produit commercial, pas open source), Stéphane confirmera le passage au push manuel après validation.

### Patterns à éviter

State global tentaculaire pour des données qui n'en ont pas besoin. Libs lourdes pour des problèmes simples. Inline styles à répétition. Fichiers de plus de 300 lignes. Couplage d'un écran à une table Supabase précise — passer par un contexte ou un hook dédié. Calculs métier dans les composants — extraire dans `src/utils/`. Dépendance silencieuse aux globales (`process.env` non documenté, valeurs codées en dur).

---

## 7. Glossaire métier

Les mots qui apparaîtront dans le code et qu'il faut traduire correctement. À utiliser comme référence pour le naming des variables, types, fonctions et clés de copy. Définitions condensées — détail complet dans la Synthèse des décisions V6 et Métriques V1 V1.3.

**Phase 0** — 14 jours d'amorçage gratuit multi-piliers. 7 actions de base en parallèle. Toile masquée. Validation streak à 5/7 minimum/jour (D6). Quatre jours-charnière (J3, J7, J11, J14).

**S0** — Transition de 2 jours gratuits entre Phase 0 et Phase 1 (D1, D17). **S0.1** célèbre les 14 jours et révèle la toile (D5). **S0.2** présente la roadmap des 8 semaines et enchaîne sur l'évaluation initiale du pilier S1.

**Phase 1** — 8 semaines payantes, un pilier par semaine. Validation streak à 1 session/3 minimum/jour. Habitudes Phase 0 retirées en S1 (D9).

**Ordre canonique D39** — Ordre figé des 8 piliers en V1, transmis par Jacky le 9 mai 2026 : **S1 Respiration, S2 Activité physique, S3 Alimentation, S4 Connexion au vivant, S5 Repos et régénération, S6 Passion et chemin de vie, S7 Mindset, S8 Élimination et détox.** Cet ordre est **à ne pas changer en V1**. *Note historique : cet ordre succède à l'ordre D8 obsolète (S1 Respiration, S2 Alimentation, S3 Mindset, S4 Condition physique, S5 Repos, S6 Passion, S7 Connexion, S8 Élimination), qui figure encore dans certains docs anciens (fichiers V0, CLAUDE.md du Project antérieur au 9 mai 2026, fichiers piliers Jacky `V0_PILIER_*.docx` dont la numérotation ne suit ni D8 ni D39). En cas de doute, D39 fait foi.*

**Pilier** — Un des 8 axes de santé naturelle travaillés en Phase 1. Identifié par son `slug` métier dans le code (`respiration`, `activite_physique`, `alimentation`, `connexion_vivant`, `repos_regeneration`, `passion`, `mindset`, `elimination_detox`) plutôt que par son numéro de position (qui change avec l'ordre canonique).

**Toile d'araignée** — Score de vitalité à 8 branches, une par pilier. Lisible en 2 secondes. Révélée au S0.1, masquée pendant Phase 0 (D5).

**Trois états de branche** — Une branche évolue dans 3 états successifs en V1. **Neutre** (pilier non encore travaillé, branche grise très atténuée). **Initial grisé** (évaluation initiale du pilier passée, branche grisée avec sa valeur initiale). **Final couleur** (évaluation finale passée, branche colorée avec sa valeur finale). Voir Métriques V1 § 1.4 et § 1.5.

**Évaluation 12 questions** — Format-type d'évaluation par pilier en Phase 1. 12 questions, échelle Likert **1-5**, score brut **/60**. Passée en évaluation initiale (IA-40) et finale (IA-46) de chaque pilier. Décision Métriques V1 V1.0 (post-audit V0).

**5 niveaux de diagnostic** — Lecture qualitative du score brut /60 (très bas / bas / moyen / haut / très haut). Réservé à l'affichage utilisateur, pas pour piloter une mécanique.

**3 niveaux d'engagement** — **Essentiel** (E), **Progression** (P), **Immersion** (I). Pas **Débutant/Intermédiaire/Expert** (libellés V0 à harmoniser), pas **Accessible** (libellé Jacky V0 à remplacer par Essentiel). Détermine la lourdeur des sessions proposées.

**Paramètre principal** — Valeur calibrable des 3 niveaux pour un pilier. 7 piliers sur 8 validés en V1.1 : S1 cohérence cardiaque 3/5/8 min, S2 activité 15/30/45 min, S3 PDJ fruits/repousser/supprimer, S4 exposition extérieure 15/30/45 min, S5 [paramètre à confirmer Jacky], S6 journaling 5/15/30 min, S7 réflexion 5/10/15 min, S8 boissons + psyllium 0,5L+1 / 1L+2 / 1,5L+3.

**Profil archétype** — 9 archétypes (P1, P2, P3, P4, P5, P6, P7, P8, P0 par défaut). Calculé une seule fois en fin d'onboarding sur la base du questionnaire 4 dimensions. **Figé en V1**, ne change plus par la suite. Pilote le calibrage du niveau de départ par pilier en Phase 0 via la matrice 8×8 (Métriques V1 Annexe B, pré-remplie en attente validation Jacky).

**Profil consolidé** — Évolution V2+, hors scope V1. Photographie évolutive du parcours à S8, M6, M12. Ne pas implémenter en V1.

**Streak** — Compteur de jours consécutifs validés. Joker hebdomadaire (semaine **calendaire fixe** lundi-dimanche fuseau local, D6). Réinitialisé à la désinstallation (D28).

**Validation streak** — Phase 0 : **5 actions sur 7 minimum** par jour (D6). Phase 1 : **1 session sur 3 minimum** par jour (D6). En dessous du seuil : soft-rappel non-culpabilisant (D26).

**6 paliers** — Récompenses streak aux jalons **7j, 15j, 30j, 60j, 100j, 1 an** (D7). Premier franchissement : modale complète avec vidéo de 30 secondes (IA-50, D29). Redéclenchements après cassure : modale simplifiée sans vidéo.

**Niveau adaptatif manuel** — Choix utilisateur **moins / pareil / plus** en cours de session, manuel **uniquement** en V1 (D31). **Aucun changement automatique** du niveau d'entrée par l'app. Messages de suggestion contextuels autorisés, mais l'utilisateur tranche.

**Écrans de jour-charnière** — Quatre jours de Phase 0 affichent un écran narratif spécial superposé à l'accueil au premier lancement du jour : **J3** (introduction conversion abonnement), **J7** (célébration fin de phase narrative 1), **J11** (recadrage zone difficile J9-J11), **J14** (préparation transition S0). Décision D19.

**Effet miroir qualitatif** — 8 à 12 phrases qualitatives intégrées dans les écrans de jour-charnière J3, J4, J7, J11 (D37). **Pas de score chiffré** dynamique calculé sur le pourcentage de complétion en V1.

**Soft-rappel** — Message non-culpabilisant affiché si l'utilisateur n'a pas atteint le seuil de validation streak un jour donné (D26). Pas de pression par la perte, pas de "tu vas tout perdre".

**Plage de silence** — **22h-8h locales**, aucune notification quelle que soit la famille (D32).

**Joker** — Mécanisme d'absorption des écarts mineurs. Un joker hebdomadaire (semaine calendaire fixe) permet de manquer un jour sans casser le streak (D6).

---

## 8. Décisions tranchées qui impactent le code

Sélection des décisions de la **Synthèse V6** (+ D39 ajoutée en Métriques V1 V1.3) qui ont une conséquence directe sur le code. Format : identifiant — titre court — implication code. Le détail et le pourquoi de chaque arbitrage sont dans la Synthèse V6 (`raw-adventure-decisions-v5.md`, le nom de fichier reste `v5` pour stabilité, le contenu est en V6). Pour toute décision non listée ici (D1 à D5, D8 obsolète, D10, D11, D14 à D16, D17, D19, D26, D38), consulter la Synthèse directement.

**D3 — Conversion accessible dès J3.** L'écran de conversion abonnement (IA-30) est accessible dès le J3 de Phase 0, pas concentré sur J15. J15 = palier narratif S0.1, pas paywall. Le paywall terminal forcé à `streak >= 14` du V0 a été retiré (commit `207e573`) — ne pas le réintroduire.

**D6 — Streak avec joker hebdomadaire calendaire fixe.** Semaine **lundi-dimanche fuseau local** (pas glissante). Validation Phase 0 à **5 actions/7 minimum**, Phase 1 à **1 session/3 minimum**. Soft-rappel en dessous du seuil (D26).

**D7 — Six paliers de récompense streak.** 7j, 15j, 30j, 60j, 100j, 1 an. Chaque palier déclenche une vidéo de 30s + message personnalisé au **premier franchissement**. Coordination avec D29 et D30 (palier 15j cohabite avec S0.1, narratif prime).

**D9 — Habitudes Phase 0 retirées en Phase 1.** Principe pédagogique d'isolation des piliers (principe 8). Pas de mécanique de rappel automatique pour maintenir les habitudes Phase 0 en S1. Le retrait est délibéré, pas un bug.

**D18 — Navigation à 3 onglets.** Accueil, Toile, Profil. Pas de menu hamburger, pas de tiroir latéral. **Onglet Toile masqué pendant toute la Phase 0**, apparaît au S0.1 cohérent avec la dramaturgie de révélation.

**D20 — Pas de rattrapage automatique des jours manqués.** Le calendrier de l'app suit le calendrier **réel**, pas le rythme de connexion de l'utilisateur. Sauter 3 jours en S2 = reprendre à S2 J5, pas à S2 J2. Le joker absorbe les écarts mineurs.

**D22 — Repo privé.** Raw Adventure est un produit commercial, pas open source. GitHub en mode privé quand il sera connecté.

**D23 — Architecture multilingue dès V1, contenu FR-only.** Toute chaîne de texte passe par un slot de copy identifié (voir sections 4 et 6). Pas de sélecteur de langue en V1, pas de traduction effective.

**D24 — Démarrage différé optionnel à la création de compte.** Si la création intervient à moins de 4 heures du minuit local suivant, l'écran IA-10b propose à l'utilisateur de démarrer J1 maintenant ou le lendemain matin. IA-10c est l'écran d'attente pleine page si différé choisi (seul l'onglet Profil reste actif).

**D26 — Soft-rappel en dessous du seuil de validation streak.** Message non-culpabilisant, pas de pression par la perte.

**D27 — Pas de modification rétroactive d'un check validé.** Une fois un jour validé, l'utilisateur ne peut pas revenir le modifier. Pas d'écran "éditer mes actions d'hier".

**D28 — Storage local-only V1 (clarification post-audit).** Pas de backend cloud lourd, pas de synchronisation multi-appareil. Stratégie hybride conservée : AsyncStorage en anonyme + Supabase quand connecté pour résister aux réinstalls sur même téléphone. Désinstallation = streak perdu (signal volontaire de désengagement).

**D29 — Paliers : premier franchissement avec vidéo, redéclenchement allégé.** Modale IA-50 complète (vidéo + message) au premier franchissement. Modale simplifiée sans vidéo aux franchissements suivants après cassure. Compteur interne `tier{N}ReachedCount`.

**D30 — Coordination palier 15j et S0.1.** IA-20 prime, IA-50 du palier différé d'un cran. Logique généralisable : narratif structurant prime sur palier, palier décalé.

**D31 — Niveau adaptatif manuel uniquement en V1.** **Aucun changement automatique** du niveau d'entrée par l'app. Messages de suggestion contextuels autorisés (ex : plusieurs "Moins" successifs → suggestion de modifier le niveau d'entrée), mais le changement effectif reste manuel via IA-44 ou IA-41/IA-42.

**D32 — Plage de silence des notifications 22h-8h locales.** Aucune notification dans cette plage, quelle que soit la famille (rappel, observation, encouragement, message de fond).

**D33 — Une seule vidéo d'intro par pilier en V1.** Pas de variante par niveau d'entrée ni par profil dynamique. La vidéo s'adresse au niveau Progression par défaut. 8 vidéos au total.

**D34 — Pas de score quotidien V1.** Le ratio `doneCount/totalCount` (ex : 5/7) est affiché transitoirement dans la modale IA-15 comme information temps réel, **ni stocké ni agrégé** sur la durée. Table `daily_check_ins` créée vide en V1, réservée pour V2.

**D35 — Pas de badges par pilier V1.** Les libellés narratifs des fichiers piliers Jacky V0 (ex : "Cohérence cardiaque acquise") restent réutilisables comme **moments narratifs** en cours de semaine, mais pas de système de badges UI dédié. Système potentiel pour V2.

**D36 — Pas de questionnaire fin de journée V1.** La matière Jacky existante est conservée pour V2. Table `daily_check_ins` créée vide en V1.

**D37 — Effet miroir qualitatif V1, chiffré V2.** 8 à 12 phrases qualitatives intégrées dans J3/J4/J7/J11 (Brief contenu V1 à produire). Pas de système de score quantitatif dynamique en V1.

**D39 — Ordre canonique des 8 piliers (figé Jacky 9 mai 2026).** S1 Respiration, S2 Activité physique, S3 Alimentation, S4 Connexion au vivant, S5 Repos et régénération, S6 Passion et chemin de vie, S7 Mindset, S8 Élimination et détox. **Remplace D8 obsolète.** Toute référence à l'ancien ordre dans le code, les fichiers V0 ou les docs anciens doit être migrée. Le contenu interne de chaque pilier (paramètres principaux, calibrage E/P/I, matière clinique) reste identique — seuls les numéros de position changent.

---

## 9. Hors-scope V1 strict

Liste fermée. Si une feature ressemble à un point de cette liste, **c'est une alerte rouge** — soit le périmètre dérive, soit une décision a évolué (auquel cas il faut mettre à jour ce CLAUDE.md). Dans tous les cas, en parler à Stéphane avant de coder.

**Pas de Phase 2 ni Phase 3.** Mois d'intégration et 9 mois thématiques arrivent en V2/V3. Pas de structure de données ni de hook qui anticiperait ces phases.

**Pas de coaching personnalisé réel.** L'app simule une personnalisation via questionnaires, scores, feedback et niveau adaptatif manuel. Le vrai coaching personnalisé, c'est le mentorat externe.

**Pas de live, pas de masterclass temps-réel, pas de 1-to-1 dans l'app.** Tout est pré-enregistré. Pas d'intégration WebRTC, pas de socket temps-réel pour du contenu humain, pas de chat synchrone.

**Pas de contenu long.** Vidéos 1-2 min maximum, jamais de format formation. Si un asset vidéo dépasse 2 min, c'est une alerte.

**Pas de bibliothèque libre-service.** L'utilisateur ne navigue pas, il est guidé. Pas d'écran "Tous les contenus", pas de moteur de recherche interne, pas de catalogue.

**Pas de communauté intégrée.** Telegram externe uniquement. Pas de fil de discussion, pas de commentaires, pas de likes, pas de profils publics.

**Pas de hard-sell mentorat.** Présence visible et désirable de S1 à S7 (mention dans le menu, dans le profil utilisateur), proposition active à S8 sans pression commerciale. Pas de modale d'upsell qui interrompt le parcours.

**Pas d'intégrations tierces.** Pas d'Apple Health, pas de Garmin, pas de Google Fit, pas de Fitbit. On valide le cœur d'abord.

**Pas de multi-tier d'abonnement.** Un seul tier en V1, avec deux durées (mensuel + annuel) qui sont la même offre à durées différentes. Pas de trimestriel. Pas de tier "premium" ou "lite".

**Pas de personnalisation automatique de l'intensité.** Le niveau adaptatif est manuel : moins / pareil / plus, sans suggestion automatique en V1 (voir D31). L'app peut afficher des messages contextuels qui suggèrent à l'utilisateur d'ajuster son niveau, mais le changement effectif reste manuel.

**Pas de score de vitalité affiché en Phase 0.** La toile d'araignée est révélée au S0.1 comme moment narratif (D5). La Phase 0 reste centrée sur la pratique et la lecture du corps, sans surcharge cognitive d'un score à interpréter. L'onglet Toile est masqué pendant toute la Phase 0 (D18).

**Pas de modification rétroactive d'un check validé.** Une fois un jour validé, l'utilisateur ne peut pas revenir éditer ses actions (D27).

**Pas de backend cloud lourd, pas de synchronisation multi-appareil.** Storage local-only en V1, étendu en hybride local + Supabase pour résister aux réinstalls sur même téléphone (D28). Pas de notion de "compte qui suit l'utilisateur sur tous ses appareils" en V1.

**Pas de sélecteur de langue ni de traduction effective.** Contenu V1 français uniquement. L'architecture est compatible multilingue (D23) mais aucun écran ni mécanique de switch de langue ne doit apparaître en V1.

**Pas de score quotidien stocké ni agrégé.** Le ratio `doneCount/totalCount` est affiché transitoirement dans la modale de check, jamais stocké ni agrégé sur la durée (D34). Table `daily_check_ins` créée vide, réservée pour V2.

**Pas de badges par pilier V1.** Les libellés narratifs Jacky restent des moments narratifs en cours de semaine, sans système UI de badges dédié (D35).

**Pas de questionnaire de fin de journée V1.** La matière existante est conservée pour V2 (D36).

**Pas de système de score quantitatif dynamique pour l'effet miroir.** En V1, effet miroir qualitatif uniquement (8-12 phrases dans les jours-charnière, D37). Pas de calcul de taux de cohorte, pas d'affichage de pourcentage de complétion comparatif.

**Pas de gamification au sens "champion / guerrier / trophée doré clinquant".** La frustration positive et la progression visible (principe 5) sont la mécanique d'engagement. Tout ajout qui ressemblerait à de la gamification creuse contredit le principe 6 (pas de marketing bien-être creux) et doit être rejeté.

---

## 10. Sources de vérité (docs Project Claude.ai)

Ces documents vivent dans le Project Claude.ai de Stéphane, **pas dans le repo**. Quand un de ces docs est nécessaire pour une tâche, Claude Code le demande à Stéphane qui le partage. **Ne pas inventer le contenu** d'un doc qu'on n'a pas en main. Les versions ci-dessous sont à jour au 11 mai 2026.

**Product Vision v2.2** — `raw-adventure-product-vision-v2-2.md`. Vision produit complète, périmètre V1, principes directeurs non-négociables, anti-scope, points de vigilance. Doc-source.

**Synthèse des décisions V6** — `raw-adventure-decisions-v5.md` (le nom de fichier reste `v5` pour stabilité, contenu en V6). Registre des **38 décisions tranchées** (D1 à D11, D17 à D37) et 5 reportées (D12 à D16). D39 ajoutée en Métriques V1 V1.3 (9 mai 2026). Pourquoi de chaque arbitrage. Référence majeure pour comprendre l'historique des arbitrages produit.

**Information Architecture V1 V3** — `raw-adventure-information-architecture-v1.md`. Spec détaillée des **45 écrans**, navigation, flows utilisateur. **Source de vérité pour tout travail sur un écran `IA-XX`.**

**Feature Spec V1 Socle minimum V1.1** — `raw-adventure-feature-spec-v1-socle-minimum.md`. **Source de vérité technique** pour les écrans S0 (IA-20, IA-21), le format-type intro de pilier (IA-41), et le Socle transverse de mécaniques globales (états du parcours, transitions, file d'écrans narratifs, gestion du streak et des paliers, soft-rappel, niveau adaptatif manuel, plage de silence des notifications, migration local→distant, posture reset V1). À consulter dès qu'on touche un écran S0 ou une mécanique transverse.

**Métriques V1 V1.3** — `raw-adventure-metriques-v1-draft.md`. **Source de vérité pour la logique métier** : calcul du score de vitalité (toile d'araignée), évaluations 12 questions par pilier, profil archétype, seuils par pilier, mécanique du streak et des paliers, KPIs business. Contient l'ordre canonique D39, les 9 archétypes, l'échelle 1-5, les 3 états de branche, les paramètres principaux par pilier (7/8 figés). Annexe B = matrice 9 archétypes × 8 piliers pré-remplie, en attente validation Jacky. Annexe C = matière clinique brute Jacky branche haute / branche basse.

**Schéma de données V1** — `raw-adventure-schema-donnees-v1.md`. Documente l'état des tables Supabase actuelles (héritage V0 : `profiles`, `progress`) et liste les tables à créer pour la V1 : `streak_history`, `joker_consumptions`, `tier_reaches`, `pillar_evaluations`, `pillar_sessions`, `level_adaptive_choices`, plus la table vide `daily_check_ins` réservée pour V2. **Source de vérité pour toute migration ou création de table.**

**Brand Core** — `RAW_ADVENTURE___BRAND_CORE.md`. Positionnement, ton, vocabulaire, philosophie. Référence permanente pour le copy.

**Audit copy V1** — `raw-adventure-audit-copy-v1.md`. Réécriture des zones critiques du copy V0 et grille d'écriture pour Mimi & Jacky. À consulter pour toute production de copy en l'absence du Brief contenu V1 définitif.

**Charte graphique** — `__Charte_Graphique___Raw_Adventure_.md`. Palette de couleurs (noir #2D2B2E, violet #6F0FF0, doré #F0C45B-#F4CA5F, verts naturels #9DBA70-#B6C37F, tons chauds organiques, bleu profond #13022A), typographies (serif Playfair Display pour les titres, sans-serif Montserrat/Poppins pour le courant), univers visuel. **Les tokens du `src/theme/` doivent en dériver.**

**Cadrage stratégique** — `raw-adventure-cadrage-v2.md`. Vision long terme du parcours 12 mois (Phase 0 + Phase 1 + Phase 2 + Phase 3). Utile pour comprendre où va le produit, **même si seules les Phase 0 + Phase 1 sont en V1**.

**Customer Journey V1.2** — `raw-adventure-customer-journey-v1.md`. Dramaturgie du parcours, jours-charnière, arc narratif de la Phase 0 et de la Phase 1.

**User Personas v1** — `raw-adventure-user-personas-v1.md`. Isabelle (segment A, chaude marque / chaude santé) et Caroline (segment C, froide marque / chaude santé). Personas V1.

**Briefs contenu Sessions 1, 2, 3** — `raw-adventure-brief-contenu-session-1.md` (6 vidéos de palier streak pour IA-50), `-session-2.md` (vidéos S0.1 et S0.2 pour IA-20 et IA-21), `-session-3.md` (8 vidéos d'intro de pilier pour IA-41). Indiquent les médias vidéo à intégrer et leur structure en 5 segments.

**Audit V0 vs docs fondateurs** — `raw-adventure-audit-v0-vs-docs-fondateurs.md`. Récap des écarts identifiés entre le proto V0 et les docs fondateurs, base du Plan de patches en cascade du 7 mai 2026. À consulter pour comprendre le pourquoi des refontes V1 en cours.

**Fichiers V0 prototype** — `V0_*.tsx`, `V0_*.ts`, `V0_PILIER_*.docx`. **Pour comprendre l'état actuel du code prototype**, pas pour s'en servir comme référence de conventions (ils ne sont pas la référence). Les fichiers piliers Jacky utilisent une numérotation héritée qui ne suit ni D8 ni D39 — l'ordre canonique opérant est D39.

---

## 11. Posture sur les décisions non encore tranchées

Ces points ne sont pas figés au 11 mai 2026. Si une tâche les touche, **ne pas inventer** : utiliser un placeholder explicite, signaler à Stéphane, continuer sur autre chose.

### Posture générale

Trois moyens, dans l'ordre de préférence. **(a)** Commentaire `// TODO: décision Dxx reportée à <doc>` à l'endroit exact du code concerné, avec une valeur de fallback documentée si une valeur par défaut est techniquement nécessaire. **(b)** Placeholder neutre `[copy à valider]` ou `[contenu à fournir par Mimi & Jacky]` dans le copy. **(c)** Si la décision bloque entièrement la tâche, ne pas coder et signaler à Stéphane qui transmet à l'équipe.

### Décisions produit reportées (Synthèse V6)

**D12 — Fréquence et contenu précis des notifications Mimi & Jacky.** Reporté à la Feature Spec dédiée par pilier et au Brief contenu V1. Principes actés : max 1-2/jour en Phase 0, 1/jour en Phase 1, 4 types de notifications (rappel, observation, encouragement, message de fond), plage de silence 22h-8h locales (D32). Pour Claude Code : la mécanique de planification des notifications peut être codée avec des stubs ; le contenu textuel attend le Brief contenu V1.

**D13 — Détail des principes de sortie S8.** Reporté à la Feature Spec après discussion équipe. Principes actés : célébrer ce qui a été acquis, mode consolidation libre, activation de la proposition de mentorat, abonnement maintenu comme valeur. IA-30 et écran de sortie S8 restent en placeholder fonctionnel.

**D14 — Calcul détaillé de la toile d'araignée.** Largement traité dans Métriques V1 V1.3 (§ 1 complet). Le calcul du score de branche est défini. Reste à valider les **intitulés courts d'affichage** des 8 piliers dans IA-25/IA-26 (zone à blanc A1.1).

**D15 — Mapping profil onboarding → niveau de départ par pilier.** Largement traité dans Métriques V1 V1.3 (§ 3 + Annexe B). Matrice 9 archétypes × 8 piliers pré-remplie, en attente de validation Jacky en session live. Trois cases en arbitrage explicite (P4 sur S5, P7 sur S2, paramètre principal S5). En attendant : utiliser la matrice pré-remplie de l'Annexe B telle quelle.

**D16 — Calibrage du contenu bonus Phase 1 (conversion précoce).** Reporté à la Feature Spec et au Brief contenu V1. Pour Claude Code : la mécanique de déblocage progressif peut être codée ; le contenu attend.

### Zones à blanc Métriques V1 V1.3 (en attente session live Jacky)

**Paramètre principal S5 Repos.** Hypothèse V1.0 conservée par défaut : sieste courte / sieste longue / cycle complet de récupération. À confirmer ou ajuster en session live Jacky.

**16 libellés courts de branche.** Proposés par Claude sur la base de la matière clinique Jacky (Métriques V1 § 1.6, Annexe C). À valider ou reformuler par Jacky.

**40 cases de la table de correspondance pédagogique** (5 diagnostics × 8 piliers). Phrases courtes de diagnostic par pilier et niveau. À produire avec Jacky.

**Production des piliers atypiques.** S7 Mindset (section niveau d'intensité 3 niveaux à formaliser), S2 Activité physique (évaluation 12 questions, 5 niveaux de diagnostic, harmonisation libellés Débutant/Intermédiaire/Expert → Essentiel/Progression/Immersion), S5 Repos (section niveau d'intensité 3 niveaux).

**Harmonisation libellé niveau 1.** Les piliers qui utilisent "Accessible" (S4, S8 dans la matière Jacky V0) doivent être harmonisés sur "Essentiel".

### Choix d'implémentation à arbitrer en cours de dev

**Passerelle de paiement.** Stripe vs RevenueCat à arbitrer en Feature Spec abonnement dédiée. Tant que non tranché : IA-30 reste en placeholder fonctionnel, pas d'intégration.

**CDN vidéos.** À arbitrer en Feature Spec (options : Cloudflare Stream, Mux, Bunny.net, Supabase Storage). Tant que non tranché : URLs vidéo en variables d'environnement, lecture via `expo-av`.

**Lib i18n.** Démarrage avec un simple objet `copy` typé dans `src/data/copy.fr.ts` (D23). Basculement vers `i18next` ou équivalent à arbitrer si besoin V2.

**Convention de clés de copy.** Proposition `copy.<scope>.<element>` (ex : `copy.onboarding.slide1.title`). À acter par Stéphane au premier écran qui contient du texte.

---

## 12. Historique des versions de ce CLAUDE.md

**Version 1.0 — 11 mai 2026.** Création du fichier à la racine du futur repo Raw Adventure App. Reflète l'état des docs Project au 11 mai 2026 : Product Vision v2.2, Synthèse des décisions V6, Information Architecture V1 V3, Feature Spec V1 Socle minimum V1.1, Métriques V1 V1.3 (avec ordre canonique D39, 9 archétypes validés cliniquement, échelle 1-5, trois états de branche, 7 paramètres principaux figés sur 8), Schéma de données V1, Brand Core, Charte graphique, Cadrage stratégique, Customer Journey V1.2, User Personas v1, Audit copy V1, Briefs contenu Sessions 1/2/3. État du code : fichiers V0 prototypes non intégrés au repo, à reprendre sélectivement.

À mettre à jour à chaque décision structurelle nouvelle (D40+), à chaque évolution majeure de la stack ou du périmètre V1, à chaque nouveau livrable Project bloquant (validation Jacky de Métriques V1 V1.4, Feature Specs dédiées par pilier, Brief contenu V1 Phase 0 et Phase 1).

---

*Fin du fichier. Si tu lis ceci, tu es prêt à coder en accord avec Raw Adventure. Bon travail.*

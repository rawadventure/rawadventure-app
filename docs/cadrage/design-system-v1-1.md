# Raw Adventure App — Design System V1.1

**Document de référence consolidé pour le développement de l'app mobile Raw Adventure.**

Dérivé de la Charte graphique observationnelle, du Brand Core, du Product Vision v2.2, des inspirations visuelles validées (préférence MetaMask, fonds pastels saturés par pilier, illustrations à matière, zéro photo statique de Mimi & Jacky), et des 4 maquettes de référence produites en session design du 14 mai 2026.

**Version 1.1 — 14 mai 2026.**

**Changelog v1.0 → v1.1.** Patchs intégrés après la session des 4 maquettes : (1) palette Phase 0 redéfinie en pêche corail vivant `#FFB87A`, distincte du fond crème de marque désormais réservé à Toile/Profil. (2) Nouveau composant "Header pilier illustré" introduit dans tous les écrans courants (Phase 0 et Phase 1), avec logo Raw Adventure en filigrane. (3) Composant Toile remplacé par version hybride camembert + radar (couches superposées : parts colorées en pastel + zones saturées sous le polygone + polygone radar violet + points initiaux mémorisés + sommets finaux colorés). Marqué provisoire, ouvert à itération avec Mimi. (4) Section 8 ajustée : usage du logo Raw Adventure comme motif identitaire (distinct des motifs botaniques). (5) Pattern B Hub d'accueil quotidien mis à jour avec header pilier coloré + bulle streak intégrée + marqueur "Prochain palier".

---

## Section 1 — Principes visuels fondateurs

Sept principes orientent toute décision visuelle de l'app. Ils sont la couche d'arbitrage au-dessus des composants. Stables sur toute la V1.

**Principe 1 — Un seul message visuel par écran.** Chaque écran porte un message principal, et un seul. Le reste est subordonné. On accepte des écrans qui paraissent vides à l'œil non-formé — la densité d'information est dans le texte, pas dans l'accumulation d'éléments d'interface.

**Principe 2 — Le fond porte l'identité du contexte.** Le fond de l'écran porte une teinte qui dit où l'utilisateur se trouve dans son parcours. Phase 0 a sa teinte pêche corail. Chacun des 8 piliers Phase 1 a la sienne. La vue d'ensemble (Toile, Profil) a la sienne en crème. Cette mécanique est la signature visuelle de Raw Adventure App.

**Principe 3 — Le visuel porte la joie, le texte porte la densité.** La couleur, l'illustration, l'animation, le motif portent la vitalité. Le texte ne le porte pas — il est dense, calme, direct, sans emoji ni exclamation ni superlatif creux. Cette tension fond/texte distingue Raw Adventure d'une app coach Instagram ou d'une app médicale austère.

**Principe 4 — Densité visuelle faible, lisibilité maximale.** Économie d'éléments stricte. Onboarding type MetaMask : un titre, un sous-titre, une illustration, un bouton primaire. Marge blanche généreuse autour du contenu. Typographie de titre grande et grasse (display weight 700-800) pour s'imposer sans crier.

**Principe 5 — Pas de marketing wellness creux, ni dans le ton ni dans le visuel.** Pas de dégradés girly, pas d'icônes émotionnelles type cœur multiplié, pas de visuel "lifestyle" générique, pas de pictogrammes éthérés, pas de typographie cursive script, pas de gamification visuelle agressive type fitness app.

**Principe 6 — La progression se voit, sans crier.** Portée par des éléments visuels honnêtes (la branche qui pousse, le streak qui s'incrémente, la checklist qui se coche, le badge qui se révèle). Pas de bruit de récompense XP, pas de confetti, pas de jauge qui se remplit avec effet vidéo. Le palier est célébré par une vidéo de Mimi & Jacky.

**Principe 7 — Le naturel est suggéré, jamais figuré littéralement.** Pas d'icône feuille ni d'icône arbre dans l'iconographie système. Le naturel passe par trois mécanismes : la palette (tons organiques pastels saturés), les motifs en filigrane (logo Raw Adventure traité en arrière-plan léger), la rondeur des formes (rayons marqués, courbes plutôt qu'angles vifs).

**Points de vigilance.** Densité de l'écran jour Phase 0 (7 actions, exception structurelle). Cohabitation fond pastel saturé et lisibilité du texte (contrastes WCAG AA validés). Promesse implicite des inspirations MetaMask sur la qualité visuelle des illustrations (style reporté au test, à figer après V1).

---

## Section 2 — Système de couleurs

### 2.1 Palette de marque

Quatre couleurs identitaires stables sur tous les écrans, plus une couleur accent pour la flamme du streak.

| Token | Hex | Usage |
|---|---|---|
| `brand.deep` | `#1F1147` | Texte principal, signature de marque |
| `brand.sun` | `#F4C95D` | Accent énergique, badges chaleureux |
| `brand.alive` | `#7BA84A` | Succès, validation, check d'action |
| `brand.cream` | `#F5EEDF` | Fond Toile et Profil uniquement |
| `brand.flame` | `#E66B2E` | Icône flamme du streak counter |

### 2.2 Palette par pilier — le cœur du système

Dix contextes, chaque contexte a un fond, une couleur de texte et une couleur de header (pour le composant Header pilier illustré).

| Contexte | Fond | Texte | Header bg | Contraste |
|---|---|---|---|---|
| Phase 0 — Amorçage | `#FFB87A` | `#3D1A0F` | `#E65D3C` | 8.2:1 |
| S1 Respiration | `#C9DFEC` | `#1A2D4D` | `#4A7AB3` | 9.6:1 |
| S2 Activité physique | `#F4A87E` | `#3D1A0F` | `#D4734A` | 8.4:1 |
| S3 Alimentation | `#F5C896` | `#3D2810` | `#C99650` | 7.9:1 |
| S4 Connexion au vivant | `#D9F2B0` | `#1F3D14` | `#7AB04A` | 10.2:1 |
| S5 Repos et régénération | `#DCC5F0` | `#2D1B6B` | `#8E6FBC` | 11.4:1 |
| S6 Passion et chemin de vie | `#F2B5C2` | `#4D1A28` | `#C76680` | 8.7:1 |
| S7 Mindset | `#F7D670` | `#3D2A0A` | `#BA7517` | 10.6:1 |
| S8 Élimination et détox | `#B5DDD0` | `#0F3D32` | `#6CA48E` | 11.1:1 |
| Toile / Profil | `#F5EEDF` | `#1F1147` | `#1F1147` | 12.8:1 |

Tous les contrastes dépassent WCAG AA 4.5:1, majorité atteint AAA 7:1+.

### 2.3 Couleurs neutres

`neutral.textSecondary = #5A4B7A`, `neutral.textMuted = #8A7CA8`, `neutral.textInverse = #FFFFFF`, `neutral.surfaceElevated = #FFFFFF`, `neutral.borderSubtle = #E8DFC8`, `neutral.borderVisible = #C9B8A0`, `neutral.disabledBg = #E5DEC9`, `neutral.disabledText = #A89B7E`.

### 2.4 Couleurs sémantiques UI

`semantic.success = #5A8F2E`, `semantic.successBg = #D8E9C2`, `semantic.danger = #B83A2E`, `semantic.dangerBg = #F2D4CF`, `semantic.alert = #D4861F`, `semantic.alertBg = #F2E0C2`, `semantic.info = #3D6B9E`, `semantic.infoBg = #D4DCEA`, `semantic.focus = #7BA84A`.

### 2.5 Règles d'usage

Un fond pastel pilier ne se mélange pas à un autre fond pastel pilier dans le même écran. Le blanc pur n'est jamais une couleur de fond d'écran (uniquement surface élevée). Le jaune solaire de marque et le jaune pilier S7 sont distincts. Le violet profond de marque est la couleur de texte universelle pour les contextes neutres. Pas de dégradés en V1 (exception toile sur les zones saturées intérieures).

---

## Section 3 — Typographie

### 3.1 Trois familles à usages stricts

**Lulo Clean** — typo de signature du wordmark Raw Adventure et des badges palier streak. Bold uniquement, majuscules uniquement, contextes courts. Implémentation recommandée en SVG figé pour éviter la licence d'embedding.

**Inter** — typo système de l'app au quotidien. Open source, 9 poids embarqués (400, 500, 600, 700, 800). Porte 95% des caractères de l'app. Chargée via `@expo-google-fonts/inter`.

**Georgia Pro** — typo éditoriale pour les moments manifestes et citations marquantes. Quota strict de 6 écrans maximum en V1. Recommandation V1 : utiliser Georgia système (présente nativement sur iOS et Android) pour éviter la licence d'embedding.

### 3.2 Échelle typographique Inter (9 niveaux)

| Niveau | Taille | Poids | Line-height | Letter-spacing | Usage |
|---|---|---|---|---|---|
| Display | 36px | 800 | 40px | -0.02em | Écrans narratifs, titre d'impact |
| Display alt | 42px | 800 | 46px | -0.02em | Moments d'impact maximum |
| H1 | 28px | 700 | 34px | -0.01em | Titre principal d'écran |
| H2 | 22px | 700 | 28px | 0 | Titre de section ou card forte |
| H3 | 18px | 600 | 24px | 0 | Sous-titre, en-tête modale |
| Body large | 17px | 400 | 26px | 0 | Prose dense, messages M&J |
| Body | 15px | 400 | 22px | 0 | Texte standard |
| Body small | 13px | 400 | 19px | 0 | Texte secondaire |
| Caption | 12px | 500 | 16px | 0.02em | Microtexte, métadonnée |
| Button | 16px | 600 | 20px | 0 | Libellé de bouton |

### 3.3 Règles d'usage croisées

Une famille par fonction jamais deux. Maximum deux familles visibles simultanément sur un écran. Georgia Pro plafonnée à 6 écrans V1. Lulo Clean exclusivement wordmark et badges streak. Pas de poids inférieurs à 400. Pas de majuscules en libellé courant. Pas plus de 3 niveaux typographiques par écran. Les chiffres restent toujours en Inter avec tabular-nums.

---

## Section 4 — Espacements, grilles et rayons

### 4.1 Échelle d'espacement (grille 4px)

`space.0 = 0`, `space.1 = 4`, `space.2 = 8`, `space.3 = 12`, `space.4 = 16`, `space.5 = 24`, `space.6 = 32`, `space.7 = 48`, `space.8 = 64`, `space.9 = 96`.

### 4.2 Marges d'écran

Marge horizontale standard : `space.5` (24px). Marge serrée : `space.4` (16px) pour écran jour Phase 0. Marge large : `space.6` (32px) pour écrans narratifs. Padding vertical haut additionnel à la safe area : `space.4` pour courants, `space.6` pour narratifs.

### 4.3 Rayons de bordure

`radius.none = 0`, `radius.sm = 4`, `radius.md = 8`, `radius.lg = 12`, `radius.xl = 16`, `radius.2xl = 24`, `radius.pill = 9999`, `radius.full = 9999`. Boutons en `radius.pill`. Cards en `radius.lg` ou `radius.xl`. Modales en `radius.2xl`. Avatars en `radius.full`.

### 4.4 Élévations

Trois niveaux uniquement. **0** : pas d'ombre. **1** : ombre subtile `0 2px 8px rgba(31, 17, 71, 0.06)` pour cards. **2** : ombre marquée `0 8px 24px rgba(31, 17, 71, 0.12)` pour modales et bottom sheets. Ombres toujours en violet profond de marque, jamais en noir pur.

---

## Section 5 — Composants de base

### 5.1 Boutons

Quatre variantes : **primaire** (fond couleur de texte du pilier, libellé crème, `radius.pill`), **secondaire** (fond blanc avec bordure 1.5px couleur pilier, texte couleur pilier), **ghost** (pas de fond, texte coloré), **destructive** (rare, fond `semantic.danger`).

Trois tailles : **standard** (hauteur ~48px, texte 16px), **compacte** (hauteur ~36px, texte 14px), **large** (hauteur ~56px, texte 17px, pour écrans narratifs).

État pressed : opacité 0.85, transition 100ms. État disabled : fond `neutral.disabledBg`, texte `neutral.disabledText`.

Disposition en bas d'écran : empilés verticalement avec `space.3` (12px) entre boutons, primaire en haut.

### 5.2 Cards

Quatre variantes : **standard** (`radius.lg`, padding `space.4`, élévation 1), **forte** (`radius.xl`, padding `space.5`), **action** (cliquable avec chevron à droite), **pilier** (fond légèrement teinté de la couleur du pilier).

Règle d'imbrication : une card ne contient jamais une autre card.

### 5.3 Inputs et checkbox

**Input texte standard** : `radius.md`, bordure 1.5px `borderVisible`, padding `space.3`, hauteur ~48px. Focus : bordure 2px `brand.alive`.

**Checkbox grande Phase 0** : 28x28px, `radius.md`, bordure 2px couleur de texte du pilier quand non cochée, fond plein `brand.alive` + check blanc 18px centré quand cochée. Toute la ligne libellé inclus est tap-cible. Transition bouncy.

**Toggle** : forme pilule 48x28px, fond `disabledBg` off / `brand.alive` on.

### 5.4 Sélecteurs et choix

**Échelle 1-5** (composant signature évaluations) : 5 boutons cercles 56x56px, état sélectionné fond `brand.alive` blanc, transition scale 0.92 → 1.05 → 1.0 bouncy.

**Niveau adaptatif Moins/Pareil/Plus** : 3 boutons côte à côte, hauteur 56px, `radius.lg`.

**Radio list** et **checkbox list** : pour onboarding et paramètres.

### 5.5 Navigation

**Tab bar 3 onglets** (Accueil, Toile, Profil) hauteur 56px + safe area. Onglet Toile masqué en Phase 0 (D18). Item actif en couleur de texte du pilier courant.

**Header de retour standard** : hauteur 44px + safe area. Icône `<` 24x24, titre en h3, optionnel bouton action à droite. Pas de bordure sous le header.

**Indicateur de progression onboarding** : 10 segments horizontaux espacés de `space.1` (4px), 4px de haut. Segments non-atteints en `borderSubtle`, atteints en `brand.alive` à 60% opacité, segment courant en `brand.alive` plein.

### 5.6 Modales

**Plein écran narrative** : couvre 100% de l'écran, fond pastel pilier ou phase, marges narratives. Pour S0.1, S0.2, paliers, jours-charnière. Pas de swipe pour fermer.

**Standard overlay** : largeur 85% (max 360px), `radius.2xl`, padding `space.5`, élévation 2, overlay `#1F1147` à 40%.

**Bottom sheet** : monte de 0 à 60-90% selon contenu, coins supérieurs `radius.2xl`, handle gris en haut.

### 5.7 Indicateurs de progression et de statut

**Streak counter (bulle blanche).** Pastille `radius.pill`, fond blanc `#FFFFFF`, padding vertical `space.2` (8px) horizontal `space.3` (12px). Icône flamme `ti-flame` 14px en `brand.flame` `#E66B2E`. Chiffre en `text.body-small` weight 700 + libellé "jours" en caption weight 500. Box-shadow `0 2px 6px rgba(31, 17, 71, 0.12)` pour détachement subtil. **Intégré dans le header pilier illustré** (pas en haut à droite de l'écran).

**Badge de palier streak** : cercle 80x80px `radius.full`, fond plein de la couleur du palier, texte du palier en Lulo Clean centré. Atteint vs silhouette grisée selon état.

**Indicateur de check validé** : icône check 18x18 dans cercle 28x28 `brand.alive`. Animation scale 0 → 1.0 bouncy.

### 5.8 Composant Header pilier illustré (NOUVEAU V1.1)

Composant signature des écrans courants Phase 0 et Phase 1. Présent en haut de chaque écran de pilier et de Phase 0.

**Anatomie.** Bande horizontale collée au top de l'écran sous la status bar. Fond plein dans la couleur `pillar.{contexte}.headerBg`. Coins inférieurs gauche et droit en `radius.2xl` (24-32px). Padding top 18px, horizontal 24px, bottom 28px.

**Logo Raw Adventure en filigrane.** Asset SVG (ou PNG en V1) du logo positionné en haut à droite avec dépassement. Taille 280x280px, position right `-60px`, top `-40px`. Opacité variable selon contexte : 14% sur header pilier (S1-S8), 16% sur header Phase 0 corail, 8% sur header neutre (Toile, Profil).

**Cercle décoratif additionnel.** Petit cercle 90-100px de la couleur du fond pastel pilier (couche bg) en bas à gauche du header, opacité 35-55%, pour créer une continuité chromatique entre header et corps de l'écran.

**Contenu textuel.** Marqueur uppercase letter-spacing 0.6px en blanc 85% opacité ("Semaine X" ou "Phase 0 · Amorçage" ou "Raw Adventure"). Titre en Inter Display 32px weight 800 en blanc (ou couleur de texte du pilier sur header neutre). Ligne de métadonnées (jour + bulle streak intégrée + marqueur "Prochain palier" optionnel).

**Bulle streak intégrée.** Le streak counter n'est PAS en haut à droite de l'écran mais **dans la ligne de métadonnées du header**, à côté du libellé "Jour X sur 7" ou "Jour X sur 14". Format : pastille blanche `radius.pill` avec flamme orange + chiffre + libellé "jours".

**Constantes techniques (cf. `layout.pillarHeader` dans tokens.ts).**

### 5.9 Éléments de feedback

**Toast** : pilule horizontale, fond couleur de texte du pilier, texte blanc, 2-3 secondes. **Loading skeleton** : forme grise `disabledBg` avec animation shimmer. **Empty state** : illustration centrée 200x200px, titre h2, body explicatif, bouton primaire. **Error state global** : illustration différente, titre adapté, bouton "Réessayer".

---

## Section 6 — Composant Toile (V1 PROVISOIRE — à itérer avec Mimi)

**Statut.** Cette section décrit la version V1.1 hybride camembert + radar validée provisoirement en session du 14 mai 2026. Conçue à itérer après production de références visuelles complémentaires avec Mimi. La géométrie pourra être revue substantiellement (organique vs géométrique vs polygone) en patch ultérieur, sans impact sur les autres sections du design system.

### 6.1 Structure à 5 couches

**Couche 1 — Roue camembert pastel.** 8 parts de 45° chacune, fond pastel pilier (`pillar.{S}.bg`). Pleine opacité pour les piliers actifs (état 2 et 3), 45% opacité pour les piliers en attente (état 1). Séparateurs blancs 2.5px entre parts pour lisibilité maximale.

**Couche 2 — Zones saturées intérieures (sous le polygone).** Pour chaque pilier en état 2 ou 3, secteur triangulaire entre le centre et l'arc de la part, à distance = (score/100) × rayon. Couleur = version foncée `tree.{S}.stroke` à 70% opacité. Donne le signal visuel "ta progression occupe cet espace".

**Couche 3 — Anneaux de référence.** Trois cercles concentriques pointillés discrets aux paliers 33/66 (à 18% opacité), plus le cercle externe plein à 25%.

**Couche 4 — Contour du polygone radar.** Polygone violet profond `brand.deep` en contour uniquement (pas de remplissage), stroke 2.5px, stroke-linejoin round. Relie les sommets au centre de chaque part de camembert à la distance correspondant au score. Passe par le centre dans la zone des piliers en attente.

**Couche 5 — Points de données.** Points initiaux (mémorisés) en cercles blancs 5px cerclés de violet profond 2px, à la position du score initial. Sommets finaux en cercles pleins 7px couleur `tree.{S}.tip` bordés de blanc 2px. Pour la branche en cours, halo additionnel 12px à 40% opacité autour du sommet.

### 6.2 Positionnement des branches

Les 8 piliers occupent des secteurs de 45° dans l'ordre canonique D39 (S1 en haut, sens horaire).

| Part | Pilier | Centre angle | Secteur |
|---|---|---|---|
| 1 | S1 Respiration | -90° (haut) | -112.5° à -67.5° |
| 2 | S2 Activité physique | -45° | -67.5° à -22.5° |
| 3 | S3 Alimentation | 0° (droite) | -22.5° à 22.5° |
| 4 | S4 Connexion au vivant | 45° | 22.5° à 67.5° |
| 5 | S5 Repos et régénération | 90° (bas) | 67.5° à 112.5° |
| 6 | S6 Passion et chemin de vie | 135° | 112.5° à 157.5° |
| 7 | S7 Mindset | 180° (gauche) | 157.5° à 202.5° |
| 8 | S8 Élimination et détox | 225° | 202.5° à 247.5° |

### 6.3 Couleurs des branches (tree colors)

| Pilier | Stroke (saturé) | Tip (foncé) |
|---|---|---|
| S1 | `#4A7AB3` | `#2D5085` |
| S2 | `#D4734A` | `#A4502D` |
| S3 | `#C99650` | `#9A6E2E` |
| S4 | `#7AB04A` | `#558030` |
| S5 | `#8E6FBC` | `#5D448F` |
| S6 | `#C76680` | `#94405A` |
| S7 | `#D4A24A` | `#A47830` |
| S8 | `#6CA48E` | `#418068` |

### 6.4 Variantes et animations

**Variante plein écran** : 320x340px, pour IA-25 onglet Toile. **Variante détail focus** : 240x240px avec branche focalisée pour IA-26. **Variante mini** : 80-100px sur cards pilier et header de profil. **Variante comparaison avant/après** : deux instances 150x150px côte à côte pour IA-22 sortie de S8.

Animations principales : déploiement initial S0.1 (2-2.5s, séquence centre → 8 branches → labels → anneaux), mise à jour d'une branche fin de pilier (1.2-1.5s), tap interactif (250ms), comparaison avant/après (2.5-3s).

### 6.5 Règles d'usage

La toile est sacrée — pas de modification créative dans des écrans secondaires. Pas de toile en arrière-plan décoratif. Une seule toile par écran (sauf IA-22). Intitulés courts pour les labels piliers. Pas de chiffres affichés sur les branches en V1 (consultables uniquement dans IA-26).

### 6.6 Implémentation technique

Composant React Native via `react-native-svg` + `react-native-reanimated`. Calculs géométriques en coordonnées polaires. Réutilisable sur 5 contextes (IA-20, IA-25, IA-26, IA-47, IA-22) avec props pour variantes.

---

## Section 7 — Iconographie

### 7.1 Bibliothèque retenue

**Lucide Icons** via `lucide-react-native`. 1400+ icônes disponibles, trait 2px standard, dessin neutre-moderne. Open source, libre de droits.

### 7.2 Tailles standardisées

`icon.xs = 16`, `icon.sm = 20`, `icon.md = 24` (taille de base), `icon.lg = 32`, `icon.xl = 48`.

### 7.3 Couleur des icônes

Les icônes héritent de la couleur de texte du contexte courant. Exceptions : check validé en `brand.alive`, danger en `semantic.danger`, icône flamme du streak en `brand.flame` `#E66B2E`.

### 7.4 Mapping des icônes critiques V1

**Tab bar** : `Home`, `Network` ou mini-toile custom, `User`. **Header** : `ChevronLeft`, `X`, `Settings`, `Info`. **Actions Phase 0** : `Sun`, `Snowflake`, `Stretching`, `Droplet`, `ClockHour7`, `Apple`, `Moon`. **Piliers Phase 1** : à arbitrer en revue de maquette. **Streak** : `Flame`, `Sparkle`, `Award`. **Niveau adaptatif** : `Minus`, `Equal`, `Plus` ou `TrendingDown`, `Minus`, `TrendingUp`.

Total V1 estimé : 35-40 icônes Lucide identifiées.

### 7.5 Production custom V1

8 SVG custom : mini-toile (icône onglet Toile), wordmark Raw Adventure pour splash et profil, 6 badges paliers streak (7j/15j/30j/60j/100j/365j).

### 7.6 Règles d'usage

Une icône a un sens jamais deux. Pas d'icône décorative à côté d'un titre. Alignement précis (verticalAlign middle ou Flex alignItems center). Fallback `HelpCircle` en cas d'icône manquante. Pas d'animation sur les icônes statiques (exceptions : loader, check validé).

---

## Section 8 — Illustrations et motifs

### 8.1 Périmètre V1

**Catégorie 1** : illustrations d'écrans narratifs (4-6 unités) — S0.1, S0.2, sortie S8, paliers récompense, jours-charnière.

**Catégorie 2** : illustrations onboarding (3-4 unités) — slides marquantes.

**Catégorie 3** : illustrations contextuelles des piliers Phase 1 (8 unités) — pour la roadmap et les cards pilier.

**Catégorie 4** : empty states et illustrations d'attente (2-3 unités).

Total cible : 17-21 illustrations centrales en V1.

### 8.2 Style d'illustration — décision toujours reportée

Trois options en lice : (A) 3D rendu façon MetaMask, (B) 2D plat à matière, (C) illustrations minimales + motifs botaniques. À figer après production des premières illustrations test post-V1.1.

### 8.3 Logo Raw Adventure comme motif identitaire (NOUVEAU V1.1)

Le logo Raw Adventure (cercle + 8 pétales + rayons + bouton de fleur) est utilisé comme **motif identitaire de marque** dans plusieurs contextes :

**En filigrane dans les headers pilier illustrés.** Asset SVG positionné en haut à droite avec dépassement, opacité variable selon contexte (14% sur header pilier, 16% sur Phase 0, 8% sur Toile/Profil).

**En grand format coloré dans la slide onboarding 1 Welcome.** Cercle plein violet profond `#1F1147` 220x220px avec rayons et pétales en blanc, posé sur fond pêche corail. Format inversé par rapport au filigrane — ici le logo est le sujet central, pas un motif d'arrière-plan.

**En splash screen.** Wordmark "RAW ADVENTURE" en Lulo Clean (SVG) + logo coloré 160x160px centré.

**En header du profil utilisateur (IA-70).** Wordmark Lulo Clean discret en haut.

Pour l'implémentation, utiliser le fichier PNG fourni `Raw_Adventure_Center_-_Cercle-Fleur_-_Transparent_Blanc.png` (ou variantes colorées équivalentes) plutôt que de reproduire en SVG le motif à chaque usage.

### 8.4 Motifs botaniques en filigrane (réservés écrans narratifs)

Trois familles à produire : feuillage léger, branchage organique, motif répété fin. Couleur héritée du contexte à 10-15% opacité. Production SVG humaine recommandée (9-15 SVG total). Usage exclusif sur écrans narratifs (S0.1, S0.2, sortie S8, paliers, splash). **PAS d'usage sur écrans courants** (où c'est le logo Raw Adventure qui joue ce rôle, voir 8.3).

### 8.5 Principes d'usage

Une illustration est un visuel central pas une décoration. Porte une émotion ou une métaphore pas une information. S'inscrit dans la palette du contexte. Pas de personnages humains identifiables (Mimi & Jacky uniquement en vidéo). Cohérence de série absolue.

### 8.6 Règles strictes

Pas d'illustrations sur écrans fonctionnels courants (sauf le logo Raw Adventure en filigrane sur les headers, qui n'est pas une illustration mais un motif identitaire). Pas d'illustrations sur la toile. Pas d'animations sur les illustrations sauf fade-in d'entrée. Motifs botaniques toujours en filigrane jamais en sujet.

---

## Section 9 — Animations et transitions

### 9.1 Durées standardisées

`duration.instant = 100ms` (feedback de tap), `duration.fast = 200ms` (checkbox, toggle), `duration.standard = 300ms` (modale standard), `duration.slow = 500ms` (modale plein écran), `duration.narrative = 1000ms` (palier, transitions de phase), `duration.structural = 2500ms` (déploiement toile, comparaison S0/S8).

### 9.2 Courbes d'easing

`easing.standard = cubic-bezier(0.4, 0.0, 0.2, 1.0)` (par défaut), `easing.decelerate = cubic-bezier(0.0, 0.0, 0.2, 1.0)` (apparitions), `easing.accelerate = cubic-bezier(0.4, 0.0, 1.0, 1.0)` (disparitions), `easing.bouncy = cubic-bezier(0.5, 1.5, 0.5, 1.0)` (feedback positif marqué). Pas de courbe linéaire.

### 9.3 Animations standardisées

12-15 animations récurrentes spécifiées : tap bouton (opacity 1.0 → 0.85 sur 100ms), tap card action (opacity 0.92), toast (slide + fade 300ms), checkbox grande (scale bouncy 250ms), échelle 1-5 sélection (scale bouncy 250ms), modale standard (scale 0.92 → 1.0 + fade 300ms), bottom sheet (translateY 350ms), modale plein écran (fade + scale 500ms), transition d'écran native, validation d'action (fade-in + scale bouncy 300ms), streak qui s'incrémente (flip vertical 350ms).

### 9.4 Animations exceptionnelles (écrans narratifs)

Apparition séquentielle illustration → titre → sous-titre → bouton (1200-1500ms). Vidéo qui démarre (overlay fade 150ms). Pas de confettis ni particules (interdits V1).

### 9.5 Respect Reduce Motion

Toutes animations longues désactivées si l'utilisateur a activé Reduce Motion. Vérification via `AccessibilityInfo.isReduceMotionEnabled()`. Déploiement toile au S0.1 s'affiche directement sans séquence.

### 9.6 Règles d'usage

Une animation a toujours une fonction. Les durées s'additionnent peu. Pas d'animations en boucle infinie (sauf loader). Pas d'animation déclenchée par scroll. Test obligatoire sur device réel iPhone 11+ et Android Pixel 4+.

---

## Section 10 — Patterns d'écran récurrents

### 10.1 Pattern A — Écran Narratif Plein

Pour les moments structurants narratifs. Écrans : S0.1, S0.2, sortie S8, paliers de récompense, jours-charnière J3/J7/J11/J14, modale mentorat. Structure : safe area + marge `space.6`, illustration centrale 280-320px, titre Display, sous-titre body large, bouton primaire large. Fond pastel pilier ou phase ou neutre selon contexte.

### 10.2 Pattern B — Hub d'accueil quotidien (PATCHÉ V1.1)

Pour le pivot quotidien Phase 0 et Phase 1. Écran : IA-11 (4 états).

**Structure V1.1.** (1) Safe area + status bar transparent (texte adapté au contexte). (2) **Header pilier illustré** (cf. Section 5.8) avec fond `pillar.{contexte}.headerBg`, logo Raw Adventure en filigrane, marqueur uppercase, titre Display, ligne métadonnées avec **bulle streak intégrée** + marqueur "Prochain palier" optionnel. (3) Corps de l'écran sur fond `pillar.{contexte}.bg`. (4) Message du jour Mimi & Jacky en `body-large`. (5) Card forte "Sessions du jour" (Phase 1) ou "Actions du jour" (Phase 0) avec checklist et compteur "X / N". (6) Optionnel card secondaire "Pilier en cours" (Phase 1). (7) Bouton primaire "Valider ma journée" pleine largeur. (8) Tab bar 2 ou 3 onglets selon phase.

### 10.3 Pattern C — Écran de Session ou Détail pratique

Pour les pratiques avec vidéo. Écrans : IA-13 détail Phase 0, IA-43 session Phase 1. Structure : header retour, vignette vidéo 16:9, consigne body-large, niveau adaptatif optionnel, bouton "Pratique faite". Fond pastel pilier courant.

### 10.4 Pattern D — Écran de Saisie ou Évaluation

Une question à la fois. Écrans : IA-40, IA-46, slides onboarding 4-5. Structure : indicateur progression, question H1 ou H2, échelle 1-5 horizontale, bouton "Question suivante", optionnel "Précédente". Tab bar masquée pendant évaluation.

### 10.5 Pattern E — Hub de visualisation (Toile)

Centré sur la toile. Écrans : IA-25, IA-26. Structure IA-25 : header signature discret (titre "Ma toile" + bouton info), phrase contextuelle, **toile hybride camembert + radar** (Section 6) 320x320, card d'instruction tactile, tab bar. Fond crème de marque `#F5EEDF`.

### 10.6 Pattern F — Liste ou Galerie

Collection d'items. Écrans : IA-51 galerie paliers, IA-32 contenu bonus, IA-21 roadmap, IA-23 consolidation. Structure : header simple, optionnel sous-titre, grille ou liste verticale, empty state si vide.

### 10.7 Pattern G — Paramètres ou Profil

Configuration. Écrans : IA-70 à IA-75. Structure : header retour, sections H3 + items card action compacts, bouton destructive optionnel en bas. Fond crème de marque.

### 10.8 Couverture des 45 écrans V1

Les 7 patterns couvrent les 45 écrans V1. Chaque fiche Feature Spec d'écran mentionne explicitement son pattern de référence. Évolution par patch global, pas en cas par cas.

---

## Section 11 — Accessibilité

Standard cible : **WCAG 2.1 AA**.

### 11.1 Contraste et lisibilité

Toutes paires fond/texte de la palette pilier validées 4.5:1 minimum (cf. Section 2.2). Texte secondaire `neutral.textSecondary` : usage restreint aux fonds crème (ratio 6.8:1) ou couleur de texte du pilier à 70% opacité sur fonds colorés.

### 11.2 Taille de touche

Minimum 44pt sur tous les éléments tappables. `hitSlop` pour élargir les zones effectives des éléments visuellement plus petits (boutons compacts 36px, icônes 24x24 avec hitSlop 10px).

### 11.3 Typographie scalable

Dynamic Type iOS et Font Scaling Android respectés via hook `useScaledFontSize()`. Plafond max 1.6× pour préserver les layouts.

### 11.4 Lecteur d'écran

VoiceOver et TalkBack : libellés accessibles sur tous les éléments interactifs, incluant les 8 branches de la toile. Animations désactivées si lecteur actif via `AccessibilityInfo.isScreenReaderEnabled()`.

### 11.5 Reduce Motion

Désactivation automatique des animations >200ms si l'utilisateur a activé Reduce Motion système.

### 11.6 Daltonisme

L'information principale est portée par plusieurs canaux : position géométrique sur la toile, label textuel, forme, opacité. La couleur est secondaire.

### 11.7 Documentation par écran

Chaque fiche Feature Spec V1 inclura une section accessibilité : libellés accessibles, ordre de focus, comportements lecteur d'écran et Reduce Motion, éléments décoratifs marqués `accessibilityElementsHidden`.

---

## Section 12 — Tokens exportables

Fichier `theme-tokens.ts` (v1.1, ~280 lignes) consolidant toutes les valeurs en TypeScript avec `as const`. Structure en 12 groupes : `brandColors`, `pillarColors` (avec ratios contraste), `neutralColors`, `semanticColors`, `treeColors`, `typography`, `space`, `radius`, `elevation`, `motion`, `iconSize`, `layout` (incluant `pillarHeader`, `brandLogo`, `streakCounter`).

Convention de nommage : `groupe.sous-groupe.variante` en camelCase. Tous tokens typés strictement.

**Hooks à implémenter dans le repo.** `usePillarTheme()` dans `src/theme/usePillarTheme.ts` (retourne les couleurs du contexte courant selon état parcours). `useScaledFontSize()` dans `src/theme/useScaledFontSize.ts` (pour Dynamic Type / Font Scaling).

**Discipline d'usage non-négociable.** Toutes les valeurs visuelles passent par les tokens. Zéro hex en dur dans le code des composants.

---

## Maquettes de référence validées (session 14 mai 2026)

Quatre écrans de référence produits et validés en session. Servent de gabarit visuel pour Claude Code et l'équipe.

**1. Écran jour Phase 1 (S7 Mindset)** — Validé. Pattern B. Démontre la grammaire : header pilier illustré ocre profond `#BA7517` + logo en filigrane 14% + bulle streak intégrée + fond pastel saturé jaune `#FFD140` + bouton couleur de texte du pilier.

**2. Écran jour Phase 0 (Pêche corail)** — Validé. Pattern B. Démontre l'adaptation Phase 0 : header corail profond `#E65D3C` + logo en filigrane 16% + fond pêche `#FFB87A` + checklist 7 actions avec icônes Lucide neutres + tab bar 2 onglets.

**3. Écran toile (IA-25 hybride camembert + radar)** — Validé provisoirement, à itérer avec Mimi. Pattern E. Démontre le composant signature : 8 parts de camembert pastels colorées + zones saturées sous le polygone radar + polygone violet en contour + points initiaux mémorisés en cercles blancs + sommets finaux colorés.

**4. Slide onboarding 1 Welcome** — Validé. Pattern A. Démontre l'écran narratif : logo Raw Adventure en grand format coloré (cercle violet profond plein avec rayons blancs) sur fond pêche corail + cercles décoratifs + titre Display 26px weight 800 + bouton primaire avec icône flèche + bouton ghost "J'ai déjà un compte".

---

**Fin du document V1.1.**

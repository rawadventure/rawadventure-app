# Patchs post-session design — 14 mai 2026

**Ce document liste les décisions prises en session design du 14 mai 2026 qui invalident ou complètent des mentions des anciens docs de cadrage (information-architecture, feature-spec, brand-core, etc.).**

**Règle de priorité : en cas de contradiction entre ce document et un autre doc plus ancien, ce document prime.** Le design system V1.1 (`raw-adventure-design-system-v1-1.md`) intègre déjà ces décisions et constitue la source de vérité technique.

**À lire en début de session par Claude Code, avant de démarrer tout codage.**

---

## Patch 1 — Palette de la Phase 0

**Avant la session :** la Phase 0 utilisait le fond crème de marque `#F5EEDF` (`brand.cream`), conformément à la Section 2.2 du design system V1.0. Le rationnel était "Phase 0 = pas de pilier isolé, donc fond neutre de marque".

**Après la session :** la Phase 0 a sa propre palette identitaire **pêche corail vivant**, distincte du fond crème de marque.

| Élément | Token | Hex |
|---|---|---|
| Fond Phase 0 | `pillar.phase0.bg` | `#FFB87A` |
| Texte foncé Phase 0 | `pillar.phase0.text` | `#3D1A0F` |
| Header pilier Phase 0 | `pillar.phase0.headerBg` | `#E65D3C` |

**Rationnel.** Le fond crème + brun rendait l'écran trop sage et "wellness vieillot", incompatible avec la promesse "coloré, vivant, moderne" du design. La Phase 0 mérite sa propre identité chromatique forte car c'est l'écran le plus utilisé (14 jours d'amorçage où l'utilisateur décide s'il reste ou s'il part). Le pêche corail apporte le peps sans tomber dans les acides Headspace.

**Conséquence pratique.** Le fond crème `brand.cream = #F5EEDF` est désormais réservé à l'**onglet Toile** et au **Profil utilisateur** uniquement (`pillar.neutral`). Tous les anciens docs qui mentionnent "Phase 0 sur fond crème" sont à comprendre comme "Phase 0 sur fond pêche corail" en V1.1.

---

## Patch 2 — Nouveau composant Header pilier illustré

**Avant la session :** les écrans courants (jour Phase 0, jour Phase 1) avaient un header compact textuel — un simple bandeau d'informations en haut de l'écran avec marqueur de jour et streak counter à droite.

**Après la session :** tous les écrans courants Phase 0 et Phase 1 portent désormais un **composant Header pilier illustré** comme élément signature visuel.

**Anatomie du composant.** Bande horizontale collée au top de l'écran sous la status bar, fond plein dans la couleur `pillar.{contexte}.headerBg` (corail pour Phase 0, ocre pour S7 Mindset, etc.), coins inférieurs en `radius.2xl` (24-32px), padding intérieur `space.4` à `space.5`.

**Logo Raw Adventure en filigrane.** Asset SVG/PNG du logo positionné en haut à droite avec dépassement, opacité variable selon contexte (14% sur header pilier S1-S8, 16% sur header Phase 0, 8% sur header neutre Toile/Profil).

**Petit cercle décoratif additionnel.** Petit cercle de la couleur du fond pastel pilier en bas à gauche du header, opacité 35-55%, pour créer une continuité chromatique entre header et corps de l'écran.

**Contenu textuel.** Marqueur uppercase letter-spacing 0.6px en blanc 85% opacité (exemples : "SEMAINE 7", "PHASE 0 · AMORÇAGE", "RAW ADVENTURE"). Titre en Inter Display 32px weight 800 en blanc. Ligne de métadonnées avec jour + bulle streak intégrée.

**Bulle streak intégrée.** Important : le streak counter n'est PAS un composant flottant en haut à droite de l'écran. **Il est intégré dans la ligne de métadonnées du Header pilier illustré**, à côté du libellé "Jour X sur 7" ou "Jour X sur 14". Format : pastille blanche `radius.pill` avec icône flamme `ti-flame` en couleur orange `#E66B2E` + chiffre du streak en weight 700 + libellé "jours".

**Référence technique.** Voir Section 5.8 du design system V1.1 + constantes `layout.pillarHeader` dans `tokens.ts`.

**Conséquence pratique.** Tous les anciens docs qui décrivent les écrans courants (IA-11, IA-13, IA-43, etc.) sont à compléter mentalement avec ce header en haut. La Feature Spec ne mentionnait pas ce composant — il est nouveau et applicable à toutes les références d'écrans courants.

---

## Patch 3 — Composant Toile remplacé par version hybride camembert + radar

**Avant la session :** la Section 6 du design system V1.0 décrivait la Toile comme un graphe radial à 8 branches partant d'un centre, chaque branche étant un trait coloré dont la longueur représente le score du pilier. Trois états par branche (en attente / initiale grisée / finale couleur).

**Après la session :** la Toile a été retravaillée en **version hybride camembert + radar** à 5 couches superposées.

**Couche 1 — Roue camembert pastel.** 8 parts de 45° chacune dans les couleurs `pillar.{S}.bg` (pastels pleins pour piliers actifs, opacité 45% pour piliers en attente). Séparateurs blancs 2.5px entre parts.

**Couche 2 — Zones saturées intérieures.** Pour chaque pilier actif, secteur triangulaire entre le centre et l'arc de la part, à distance = (score/100) × rayon, en couleur `tree.{S}.stroke` à 70% opacité. Donne le signal visuel "ta progression occupe cet espace".

**Couche 3 — Anneaux de référence.** Trois cercles concentriques pointillés discrets aux paliers 33/66 (18% opacité) + cercle externe plein (25% opacité).

**Couche 4 — Contour du polygone radar.** Polygone violet profond `brand.deep` en contour seul (pas de remplissage), stroke 2.5px, qui relie les sommets au centre de chaque part de camembert à la distance correspondant au score. Passe par le centre dans la zone des piliers en attente.

**Couche 5 — Points de données.** Points initiaux (mémorisés) en cercles blancs 5px cerclés de violet profond. Sommets finaux en cercles pleins 7px couleur `tree.{S}.tip` bordés de blanc. Pour la branche en cours, halo additionnel à 40% opacité.

**Référence technique.** Voir Section 6 entièrement réécrite du design system V1.1.

**Statut.** Le composant Toile V1.1 est **validé provisoirement**. Stéphane prévoit de retravailler le design de la toile avec Mimi à partir de références visuelles complémentaires.

**Recommandation pour Claude Code.** Implémenter la Toile V1.1 telle que spécifiée Section 6, mais **designer le composant React paramétré avec des props clairs** (taille, état du parcours, branche focalisée, mode statique vs animé) pour permettre une refonte ultérieure du rendu visuel sans casser l'architecture du composant. La signature de l'API React doit pouvoir survivre à un changement de géométrie interne.

---

## Patch 4 — Logo Raw Adventure intégré comme motif identitaire

**Avant la session :** la Section 8 du design system V1.0 limitait l'usage du logo à 8 SVG production custom (mini-toile, wordmark, 6 badges paliers) et précisait "pas d'illustrations sur les écrans fonctionnels courants" (règle 8.7).

**Après la session :** le **logo Raw Adventure** (fichier `Raw_Adventure_Center_-_Cercle-Fleur_-_Transparent_Blanc.png` fourni) est devenu un **motif identitaire de marque** utilisable dans plusieurs contextes au-delà du wordmark et des badges.

**Usages validés du logo.**

— **En filigrane dans les headers pilier illustrés** (cf. Patch 2 ci-dessus). Asset positionné en haut à droite avec dépassement, opacité variable selon contexte.

— **En grand format coloré dans la slide onboarding 1 Welcome.** Cercle plein violet profond `#1F1147` 220x220px avec rayons et pétales en blanc, posé sur fond pêche corail. Format inversé par rapport au filigrane.

— **En splash screen.** Wordmark Lulo Clean (SVG) + logo coloré 160x160px centré.

— **En header du profil utilisateur (IA-70).** Wordmark Lulo Clean discret en haut.

**Distinction importante.** Le logo Raw Adventure **n'est pas considéré comme une illustration** au sens narratif de la Section 8 — c'est un **motif identitaire de marque**, distinct des illustrations narratives (S0.1, S0.2, sortie S8, paliers, onboarding) et distinct des motifs botaniques en filigrane.

**Conséquence pratique pour Claude Code.** Créer un composant `<LogoRawAdventure>` paramétré avec props (`size`, `variant`, `opacity`, `color`) qui rend l'asset PNG (ou SVG si tu en produis une version vectorielle) selon contexte. Ce composant est utilisé sur la quasi-totalité des écrans (tous les headers pilier + onboarding + splash + profil).

---

## Patch 5 — Pattern B Hub d'accueil quotidien mis à jour

**Avant la session :** la Section 10 du design system V1.0 décrivait le Pattern B comme une structure simple — safe area, header compact, message du jour, card sessions, bouton primaire, tab bar.

**Après la session :** le Pattern B intègre désormais le **Header pilier illustré** comme premier élément après la safe area.

**Structure V1.1 du Pattern B :**

1. Safe area du haut + status bar (texte adapté au contexte — blanc sur header coloré).
2. **Header pilier illustré** (cf. Patch 2) avec fond `pillar.{contexte}.headerBg`, logo Raw Adventure en filigrane, marqueur uppercase, titre Display, ligne métadonnées avec bulle streak intégrée + marqueur "Prochain palier" optionnel.
3. Corps de l'écran sur fond `pillar.{contexte}.bg`.
4. Message du jour Mimi & Jacky en `body-large`, couleur de texte du pilier.
5. Card forte "Sessions du jour" (Phase 1) ou "Actions du jour" (Phase 0) avec checklist et compteur "X / N".
6. Optionnel : card secondaire "Pilier en cours" (Phase 1) avec accès au niveau adaptatif.
7. Bouton primaire "Valider ma journée" pleine largeur.
8. Tab bar 2 onglets (Phase 0) ou 3 onglets (Phase 1+).

**Conséquence pratique.** Tous les écrans qui suivent le Pattern B (IA-11 dans ses 4 états) doivent être codés avec cette structure mise à jour, pas avec l'ancienne.

---

## Patch 6 — Le brief Claude Code consolide tout

Le document `raw-adventure-claude-code-brief-v1.md` consolide les conventions de code, la stack technique, l'ordre de priorité de développement en 5 sprints, et les points d'attention spécifiques.

**Si tu trouves une contradiction entre ce brief et un autre document plus ancien, le brief Claude Code prime sur les questions techniques de développement.** Le design system V1.1 prime sur les questions visuelles. Ce document de patchs prime sur les questions de décisions design tranchées en session.

---

## Synthèse des 4 maquettes de référence

Les 4 maquettes validées en session du 14 mai 2026 (visualisables dans `docs/maquettes/raw-adventure-4-maquettes-v1.html`) servent de gabarit visuel pour Claude Code :

1. **Écran jour Phase 1 (S7 Mindset)** — Pattern B. Référence pour les 8 écrans piliers Phase 1.
2. **Écran jour Phase 0 (Pêche corail)** — Pattern B adapté Phase 0. Référence pour IA-11 état Phase 0.
3. **Écran toile (IA-25 hybride camembert + radar)** — Pattern E. Référence pour Section 6, provisoire.
4. **Slide onboarding 1 Welcome** — Pattern A. Référence pour les écrans narratifs (Section 10.1).

**Quand Claude Code code un écran, il doit pouvoir le rapprocher d'une de ces 4 maquettes** (ou d'un Pattern de la Section 10 du design system pour les écrans non couverts par les maquettes).

---

**Fin du document de patchs post-session design.**

**Auteur :** Stéphane (avec assistance Claude).
**Date :** 14 mai 2026.
**Version :** 1.0 (à mettre à jour si nouvelles sessions design apportent des patchs supplémentaires).

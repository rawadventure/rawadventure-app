# Raw Adventure App — Information Architecture V1

*Document de référence — squelette de l'app V1. Définit la carte des écrans, l'architecture de navigation, les flows utilisateur clés et le détail écran par écran. Sert de base à la Feature Spec et au travail de développement. Daté du 5 mai 2026.*

---

## 1. Cadrage du document

### Ce que ce doc fait

L'Information Architecture V1 est le **squelette** de l'app. Elle répond à trois questions précises. Combien d'écrans dans la V1, et quels sont-ils. Comment ces écrans sont organisés les uns par rapport aux autres. Comment l'utilisateur navigue d'un écran à l'autre dans les moments clés du parcours.

C'est le doc qui dit **où sont les choses** dans l'app. Il ne dit pas comment elles sont implémentées techniquement (c'est le rôle de la Feature Spec), ni comment elles sont calculées (c'est le rôle de Métriques V1), ni quel contenu exact y figure (c'est le rôle du Brief contenu V1). Il pose la carte. Les autres docs poseront le mobilier, les murs et la déco.

### Périmètre couvert

Toute la V1 telle qu'actée dans le Product Vision v2.1 et la Synthèse des décisions V2. Onboarding, Phase 0 sur 14 jours, S0 sur 2 jours (durée actée dans cette session), Phase 1 sur 8 semaines, sortie de S8. Plus les mécaniques transverses : check quotidien, streak avec 6 paliers de récompense, toile d'araignée, niveau adaptatif manuel, conversion accessible dès J3, contenu bonus pour conversions précoces, mentorat visible passif puis actif à S8. Plus les écrans périphériques nécessaires au fonctionnement minimal de l'app : profil utilisateur, gestion d'abonnement, paramètres, mentions légales, support.

### Ce qui est hors-scope

Tout ce qui relève de la Phase 2 (intégration des piliers), de la Phase 3 (9 mois thématiques), du mentorat 1-to-1 dans l'app, des intégrations tierces, du multi-tier d'abonnement, d'une personnalisation automatique de l'intensité. Tout ça n'a pas d'écran à documenter en V1.

Sont aussi hors-scope les choix visuels (couleurs précises, typographie, composants graphiques) — la Charte graphique les couvre. Les calculs précis de la toile d'araignée — Métriques V1 les couvrira. Le mapping exact profil onboarding → niveau de départ par pilier — la Feature Spec le couvrira avec Mimi & Jacky.

### Conventions de lecture

Chaque écran a un **identifiant** sous la forme `IA-XX` où XX est un numéro à deux chiffres. Cet identifiant est stable dans tout le doc et servira de référence dans la Feature Spec et le code. Un écran a un **rôle** (la fonction qu'il porte dans le parcours), un **contenu principal** (ce qu'il affiche), des **états spéciaux** (variantes selon le moment du parcours ou la situation de l'utilisateur), des **transitions entrantes** (par où on arrive sur l'écran) et des **transitions sortantes** (où l'utilisateur peut aller depuis l'écran).

Les écrans existant déjà dans le proto (codé dans Claude Code) sont marqués `[proto: nom-actuel]`. Les écrans à créer en V1 sont marqués `[à créer]`. Les écrans existants à refondre sont marqués `[proto: nom-actuel — à refondre]`. La synthèse finale (section 7) consolide cette information sous forme de tableau.

### Lien avec les autres docs du Project

Ce doc dérive directement du Product Vision v2.1 (ce que l'app doit faire) et du Customer Journey V1 (comment l'utilisateur la traverse dans le temps). Il s'aligne sur la Synthèse des décisions V2 (les arbitrages structurels). Il alimentera la Feature Spec V1 (spec technique écran par écran) et servira de référence pour le CLAUDE.md du repo.

Il ajoute une décision **D17** à la Synthèse : durée du S0 actée à 2 jours (Jour S0.1 = célébration des 14 jours et révélation de la toile d'araignée, Jour S0.2 = roadmap des 8 semaines et évaluation initiale du pilier Respiration). Cette décision est tranchée dans le cadre de cette IA pour permettre la documentation des écrans S0.

---

## 2. Carte d'ensemble de l'app

L'app V1 se compose de **dix groupes fonctionnels**. Chaque groupe rassemble les écrans qui partagent un même rôle dans le parcours. La carte ci-dessous donne la vue panoramique. Le détail écran par écran arrive à la section 5.

**Groupe 1 — Onboarding et inscription.** Les 10 slides séquentielles qui posent l'avatar, le diagnostic, la promesse, la projection, le profil dynamique, l'engagement explicite. Plus l'écran de création de compte. C'est le tunnel d'entrée de l'app, traversé une fois.

**Groupe 2 — Accueil quotidien et navigation principale.** L'écran-pivot que l'utilisateur ouvre chaque jour, qui adapte son contenu selon le moment du parcours (J1-J14, S0, S1-S8, post-S8). Plus la barre de navigation qui donne accès aux autres groupes.

**Groupe 3 — Phase 0.** Les écrans de pratique des 14 jours gratuits multi-piliers. Détail d'un pilier, validation du check quotidien, écrans de jours-charnières (J3 introduction conversion, J7 wow corporel, J11 zone difficile, J14 fin de phase).

**Groupe 4 — S0 de transition.** Les deux écrans de S0.1 et S0.2 qui font le pont entre Phase 0 et Phase 1.

**Groupe 5 — Phase 1.** La structure-type d'une semaine de pilier (évaluation initiale, sessions quotidiennes, niveau adaptatif manuel, test avant/après session, évaluation finale, mise à jour de la branche). Plus les écrans transverses à la Phase 1 (vue d'ensemble du pilier en cours, semaines à venir, semaines passées).

**Groupe 6 — Toile d'araignée et progression.** L'écran dédié au score de vitalité, accessible hors S0 une fois la toile révélée. Affiche l'évolution des 8 branches au fil des semaines.

**Groupe 7 — Streak et paliers de récompense.** L'affichage permanent du streak (compteur visible sur l'accueil), l'écran modal de palier débloqué (7j, 15j, 30j, 60j, 100j, 1 an), la galerie des paliers atteints.

**Groupe 8 — Abonnement et conversion.** L'écran de présentation de l'offre (accessible dès J3 via bouton discret), l'écran de confirmation post-abonnement, l'écran de gestion d'abonnement dans le profil. Plus le contenu bonus déblocable progressivement pour les conversions précoces.

**Groupe 9 — Mentorat.** L'onglet Mentorat dans le menu (visible passif en Phase 1, actif à S8), l'écran de présentation du mentorat, le lien vers la prise de rendez-vous externe.

**Groupe 10 — Profil et paramètres.** Le profil utilisateur (informations personnelles, palier streak actuel, lien vers la toile d'araignée, lien vers le mentorat, accès à la gestion d'abonnement). Les paramètres techniques (notifications, langue). Les mentions légales et le support.

Chaque groupe a sa propre logique interne mais reste connecté aux autres via la navigation principale (groupe 2). Le parcours est conçu pour que **l'écran d'accueil quotidien** soit le hub permanent — l'utilisateur y revient toujours après une action, et c'est de là qu'il accède au reste.

### Schéma de navigation globale

Le schéma ci-dessous donne la vue d'ensemble de la structure de navigation. Il s'agit d'une représentation simplifiée — le détail des transitions est dans la section 4.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700" font-family="system-ui, -apple-system, sans-serif">
  <style>
    .group { fill: #fefcf5; stroke: #2d3a2d; stroke-width: 1.5; }
    .hub { fill: #e8d5a8; stroke: #2d3a2d; stroke-width: 2; }
    .entry { fill: #d4e0c4; stroke: #2d3a2d; stroke-width: 1.5; }
    .modal { fill: #f5e6d3; stroke: #6b4423; stroke-width: 1.2; stroke-dasharray: 4 3; }
    .label { font-size: 13px; fill: #2d3a2d; text-anchor: middle; font-weight: 500; }
    .sublabel { font-size: 10px; fill: #6b6b6b; text-anchor: middle; font-style: italic; }
    .arrow { fill: none; stroke: #6b6b6b; stroke-width: 1.2; }
    .title { font-size: 11px; fill: #6b4423; text-anchor: middle; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
  </style>

  <!-- Titre -->
  <text x="450" y="25" class="title">Navigation globale — Raw Adventure App V1</text>

  <!-- Bloc Entrée -->
  <rect x="40" y="60" width="200" height="80" rx="8" class="entry"/>
  <text x="140" y="90" class="label">Onboarding + Inscription</text>
  <text x="140" y="108" class="sublabel">10 slides séquentielles</text>
  <text x="140" y="124" class="sublabel">Traversé une fois</text>

  <!-- Flèche Onboarding → Accueil -->
  <path d="M 240 100 L 380 320" class="arrow" marker-end="url(#arrowhead)"/>

  <!-- Hub central : Accueil quotidien -->
  <rect x="340" y="280" width="220" height="100" rx="10" class="hub"/>
  <text x="450" y="312" class="label" font-weight="700">Accueil quotidien</text>
  <text x="450" y="332" class="sublabel">Hub central</text>
  <text x="450" y="350" class="sublabel">Adapte son contenu selon</text>
  <text x="450" y="365" class="sublabel">la phase (P0 / S0 / P1 / post-S8)</text>

  <!-- Tab bar (illustrée comme bandeau bas) -->
  <rect x="340" y="400" width="220" height="34" rx="4" fill="#2d3a2d" opacity="0.85"/>
  <text x="385" y="421" class="label" fill="#fefcf5" font-size="11">Accueil</text>
  <text x="450" y="421" class="label" fill="#fefcf5" font-size="11">Toile</text>
  <text x="515" y="421" class="label" fill="#fefcf5" font-size="11">Profil</text>

  <!-- Groupes accessibles depuis le Hub : disposés autour -->

  <!-- Phase 0 (haut gauche) -->
  <rect x="40" y="180" width="200" height="80" rx="8" class="group"/>
  <text x="140" y="210" class="label">Phase 0 — 14 jours</text>
  <text x="140" y="228" class="sublabel">Pratique multi-piliers</text>
  <text x="140" y="244" class="sublabel">Détail pilier · validation jour</text>

  <!-- S0 (haut droite) -->
  <rect x="660" y="180" width="200" height="80" rx="8" class="group"/>
  <text x="760" y="210" class="label">S0 — Transition</text>
  <text x="760" y="228" class="sublabel">2 jours, S0.1 + S0.2</text>
  <text x="760" y="244" class="sublabel">Révélation toile + roadmap</text>

  <!-- Phase 1 (centre gauche) -->
  <rect x="40" y="300" width="200" height="80" rx="8" class="group"/>
  <text x="140" y="330" class="label">Phase 1 — 8 semaines</text>
  <text x="140" y="348" class="sublabel">Évaluation · sessions · niveau</text>
  <text x="140" y="364" class="sublabel">Test avant/après · branche</text>

  <!-- Toile d'araignée (centre droite) -->
  <rect x="660" y="300" width="200" height="80" rx="8" class="group"/>
  <text x="760" y="330" class="label">Toile d'araignée</text>
  <text x="760" y="348" class="sublabel">8 branches</text>
  <text x="760" y="364" class="sublabel">Révélée au S0</text>

  <!-- Mentorat (bas gauche) -->
  <rect x="40" y="420" width="200" height="80" rx="8" class="group"/>
  <text x="140" y="450" class="label">Mentorat</text>
  <text x="140" y="468" class="sublabel">Visible passif S1-S7</text>
  <text x="140" y="484" class="sublabel">Actif à S8</text>

  <!-- Profil et paramètres (bas droite) -->
  <rect x="660" y="420" width="200" height="80" rx="8" class="group"/>
  <text x="760" y="450" class="label">Profil + Paramètres</text>
  <text x="760" y="468" class="sublabel">Abonnement · streak</text>
  <text x="760" y="484" class="sublabel">Notifications · légal</text>

  <!-- Modales (en bas, traversales) -->
  <rect x="180" y="560" width="200" height="60" rx="8" class="modal"/>
  <text x="280" y="585" class="label">Abonnement</text>
  <text x="280" y="601" class="sublabel">Modal · accessible dès J3</text>

  <rect x="520" y="560" width="200" height="60" rx="8" class="modal"/>
  <text x="620" y="585" class="label">Palier streak débloqué</text>
  <text x="620" y="601" class="sublabel">Modal · 7/15/30/60/100j · 1 an</text>

  <!-- Flèches du Hub vers les groupes -->
  <path d="M 340 305 L 240 230" class="arrow" marker-end="url(#arrowhead)"/>
  <path d="M 560 305 L 660 230" class="arrow" marker-end="url(#arrowhead)"/>
  <path d="M 340 340 L 240 340" class="arrow" marker-end="url(#arrowhead)"/>
  <path d="M 560 340 L 660 340" class="arrow" marker-end="url(#arrowhead)"/>
  <path d="M 340 380 L 240 450" class="arrow" marker-end="url(#arrowhead)"/>
  <path d="M 560 380 L 660 450" class="arrow" marker-end="url(#arrowhead)"/>

  <!-- Flèches Hub vers modales -->
  <path d="M 400 400 L 300 560" class="arrow" stroke-dasharray="4 3" marker-end="url(#arrowhead)"/>
  <path d="M 500 400 L 600 560" class="arrow" stroke-dasharray="4 3" marker-end="url(#arrowhead)"/>

  <!-- Légende -->
  <rect x="40" y="640" width="14" height="14" class="entry"/>
  <text x="62" y="652" font-size="11" fill="#2d3a2d">Entrée du parcours</text>

  <rect x="200" y="640" width="14" height="14" class="hub"/>
  <text x="222" y="652" font-size="11" fill="#2d3a2d">Hub central</text>

  <rect x="320" y="640" width="14" height="14" class="group"/>
  <text x="342" y="652" font-size="11" fill="#2d3a2d">Groupes fonctionnels</text>

  <rect x="490" y="640" width="14" height="14" class="modal"/>
  <text x="512" y="652" font-size="11" fill="#2d3a2d">Modales transverses</text>

  <line x1="640" y1="647" x2="680" y2="647" class="arrow" marker-end="url(#arrowhead)"/>
  <text x="690" y="652" font-size="11" fill="#2d3a2d">Navigation</text>

  <!-- Marker pour flèches -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M 0 0 L 9 3 L 0 6 Z" fill="#6b6b6b"/>
    </marker>
  </defs>
</svg>


---

## 3. Architecture de navigation

### Le modèle global

La navigation V1 repose sur un principe simple : un **hub central** — l'écran d'accueil quotidien — vers lequel l'utilisateur revient toujours, et trois zones secondaires accessibles via une **barre d'onglets** (tab bar) en bas d'écran. Tout le reste se déroule à partir du hub par push d'écran (navigation pleine) ou par modale.

Ce choix est délibéré. L'utilisateur Raw Adventure n'est pas censé "explorer" l'app comme on explore une plateforme de contenu. Il vient faire son check du jour, ressentir, repartir. La nav doit le ramener au geste central sans lui offrir mille options. C'est cohérent avec le principe directeur 1 du Product Vision : "L'utilisateur ne doit pas réfléchir, il est guidé, jamais livré à lui-même".

### La barre d'onglets

Trois onglets, pas plus. **Accueil**, **Toile**, **Profil**.

L'onglet **Accueil** est l'onglet par défaut. À chaque ouverture de l'app, l'utilisateur tombe dessus. C'est l'écran qui adapte son contenu selon le moment du parcours : J1-J14 affiche la checklist Phase 0, S0.1 et S0.2 affichent les écrans de transition, S1-S8 affichent l'écran de pratique du pilier en cours, post-S8 affiche le mode consolidation. C'est le point d'ancrage permanent.

L'onglet **Toile** est masqué tant que la toile d'araignée n'est pas révélée (donc pendant toute la Phase 0). Il apparaît au S0.1 quand la toile est révélée pour la première fois, et reste accessible ensuite tout au long de la Phase 1 et après. Il donne une vue agrégée du score de vitalité, l'évolution des branches, l'historique des évaluations.

L'onglet **Profil** rassemble les informations utilisateur, le palier streak actuel, l'accès au mentorat, la gestion d'abonnement, les paramètres techniques, les mentions légales. Il est accessible à tout moment, dès la fin de l'onboarding.

### Avant l'onboarding et l'inscription

Tant que l'utilisateur n'a pas terminé les 10 slides d'onboarding et créé son compte, la barre d'onglets n'apparaît pas. Le tunnel d'entrée est strictement linéaire : slide après slide, puis création de compte, puis arrivée sur l'accueil J1. Cette linéarité protège le sens de l'engagement explicite — on ne peut pas "regarder l'app avant de s'engager", on s'engage et on entre.

### Modales vs navigation pleine

Deux types d'écrans ne s'inscrivent pas dans le hub permanent. Les **modales** sont des écrans qui se superposent à l'écran courant et qui se referment pour ramener l'utilisateur exactement où il était. Les **navigations pleines** poussent un nouvel écran qui occupe tout l'espace, et le retour ramène à l'écran précédent.

Sont des modales en V1 :

L'**écran d'abonnement** (présentation de l'offre, paiement, confirmation). Il peut être déclenché depuis n'importe où dès J3 et doit pouvoir être fermé sans rupture du parcours en cours.

Les **paliers de récompense streak** (7j, 15j, 30j, 60j, 100j, 1 an). Ce sont des écrans modaux qui s'affichent au moment de la validation de la journée concernée, jouent la vidéo de 30 secondes Mimi & Jacky, et se referment pour ramener à l'accueil. Ils ne créent pas de nouvelle "page" à laquelle l'utilisateur peut revenir naturellement — c'est un événement, pas un lieu.

Le **bouton "moins / pareil / plus"** du niveau adaptatif manuel, en cours de session Phase 1. C'est une mini-modale d'ajustement qui se ferme dès le choix fait.

L'**écran de validation du check quotidien** est une modale courte qui s'affiche après que l'utilisateur a coché les piliers du jour (en Phase 0) ou validé sa session (en Phase 1). Elle joue le feedback motivant, montre le streak qui s'incrémente, et se ferme.

Sont des navigations pleines en V1 :

Le **détail d'un pilier** en Phase 0 (depuis l'accueil). C'est une page à part entière, l'utilisateur peut y rester, y naviguer, y revenir. Elle contient l'explication du pilier, la vidéo Mimi & Jacky, les consignes du jour.

Les **écrans de session de pratique** en Phase 1 (depuis l'accueil). Idem — l'utilisateur entre dans la session, la fait, en sort.

L'**évaluation initiale** et l'**évaluation finale** d'un pilier en Phase 1. Ce sont des séquences d'écrans à part entière (12 questions chacune), pas des modales.

L'**onglet Toile d'araignée** (depuis la tab bar). Il a sa propre navigation interne (vue globale, détail par branche).

L'**onglet Profil** (depuis la tab bar) et tous les sous-écrans qui en dépendent.

L'**onglet Mentorat** (accessible depuis le Profil) avec l'écran de présentation et le lien vers la prise de RDV externe.

Le **contenu bonus** débloqué par la conversion précoce. Il a son propre espace, accessible via une carte "Tes bonus" sur l'accueil (uniquement pour les utilisateurs abonnés en cours de Phase 0).

### La logique du retour

Sur chaque écran qui n'est pas l'accueil, un bouton retour permet de revenir à l'écran précédent. Sur l'accueil, le bouton retour du système (Android back, iOS swipe) ne quitte pas l'app — il ouvre un dialogue minimal de confirmation. C'est un détail d'UX qui évite les sorties accidentelles, surtout pour Caroline qui pourrait abandonner sur un mauvais geste.

Depuis n'importe quelle modale, un bouton de fermeture ramène à l'écran sous-jacent sans rupture de contexte.

### Ce que la navigation ne fait pas

Pas de menu hamburger. Pas de tiroir latéral. Pas de notifications dans l'app (les notifications Mimi & Jacky sont du push système, pas des éléments visuels permanents dans l'UI). Pas de recherche globale (l'app n'a pas assez de contenu pour le justifier en V1). Pas de feed (l'app n'est pas un réseau social).

Cette retenue volontaire est cohérente avec le principe directeur 3 : "Simplicité extrême. Toute feature qui demande plus de 30s d'explication est suspecte." Une nav à 3 onglets se comprend en 5 secondes.


---

## 4. Flows utilisateur clés

Les sept flows ci-dessous tracent le parcours de l'utilisateur dans les moments-charnières du Customer Journey. Ils ne couvrent pas tous les usages possibles de l'app, mais ils couvrent **les cheminements qui font ou défont la V1**. Lire ces flows permet de tester si l'architecture tient debout dans les moments où elle est sollicitée.

Chaque flow est décrit en prose dense, avec les écrans traversés mentionnés par leur nom (les identifiants `IA-XX` sont fixés dans la section 5).

### Flow 1 — Premier lancement et entrée dans la Phase 0

L'utilisateur télécharge l'app, l'ouvre pour la première fois. Il atterrit sur la slide 1 de l'onboarding (écran `IA-01`). Il avance slide après slide à son rythme — aucune ne peut être sautée. Aux slides 4 et 5, il répond au questionnaire 4 dimensions (énergie, corps, mental, motivation). À la slide 7, son profil dynamique s'affiche, calculé à partir de ses réponses, parmi les 8 profils possibles. À la slide 9, il prend l'engagement explicite "je joue le jeu pendant 14 jours". À la slide 10, il crée son compte (mail + mot de passe, ou SSO Apple/Google).

Une fois le compte créé, il bascule directement sur l'écran d'accueil `IA-11` en mode J1 de Phase 0. La tab bar apparaît pour la première fois. Une vidéo courte de Mimi & Jacky se joue ou s'affiche en encart : "Bienvenue, on commence". L'écran d'accueil affiche les 6 piliers du jour à cocher, un message Mimi & Jacky calibré sur son profil dynamique, et la mention "Jour 1 sur 14". Le streak est à 0. La toile d'araignée n'est nulle part — l'onglet Toile est masqué.

L'utilisateur peut taper sur un pilier pour ouvrir son détail (`IA-13`), où il trouve l'explication du pilier, la vidéo de Jacky, la consigne du jour. Il peut cocher la pratique faite. De retour à l'accueil, le pilier apparaît coché. Quand il a coché 4 piliers ou plus dans la journée, il peut valider sa journée, ce qui déclenche la modale `IA-15` de validation du check quotidien (feedback motivant, incrément du streak à 1).

### Flow 2 — Journée-type au cœur de la Phase 0 (jour 5)

L'utilisateur ouvre l'app le matin du J5. Il atterrit directement sur l'accueil `IA-11`, qui s'affiche en mode J5. Il voit en haut son streak (4 jours, joker disponible), le numéro du jour, un message Mimi & Jacky du matin (registre "le corps répond" — phase narrative 2 de la Phase 0). Il voit la liste des 6 piliers, certains déjà cochés s'il a démarré sa journée la veille au soir, d'autres à faire.

Il peut être interpellé par une notification push de la matinée : "Eau de mer ce matin. Observe ce que ça fait dans les 30 minutes qui suivent." Il revient dans l'app, ouvre le détail du pilier minéralisation (`IA-13`), regarde la vidéo de 90 secondes, fait le geste, coche.

Plus tard dans la journée, il fait son défi froid, sa fenêtre digestive, etc. Le soir, il valide sa journée via le bouton "Valider ma journée" sur l'accueil. La modale de validation `IA-15` s'affiche : "Tu as fait 5 piliers sur 6 aujourd'hui. C'est ta 5e journée d'affilée. La régularité installe les bases mieux que l'intensité." Le streak passe à 5. La modale se ferme, l'utilisateur revient à l'accueil. Si on est en fin de journée et qu'il a tapé sur "valider", l'écran l'invite à éteindre — la fenêtre du jour est close.

Si l'utilisateur a coché moins de 4 piliers, la validation lui dit "Tu as fait 3 piliers aujourd'hui. Le joker se déclenche pour préserver ton streak." Le joker est consommé. Le streak n'est pas cassé.

### Flow 3 — Conversion via le bouton discret à J3

L'utilisateur en est à J3. Il ouvre l'app le matin. Sur l'accueil `IA-11`, le bouton "S'abonner" apparaît pour la première fois — discret, en bas de l'écran ou dans un encart latéral, pas en plein milieu. Il a vu le message Mimi & Jacky d'introduction : "Si tu veux assurer la suite après les 14 jours, tu peux le faire dès maintenant. Pas de précipitation."

L'utilisateur tape sur le bouton. La modale d'abonnement `IA-30` s'ouvre. Elle présente l'offre (un seul tier, prix mensuel), explique ce que l'abonnement débloque (Phase 1, contenu bonus disponible immédiatement, accès au mentorat à S8), montre le rappel pédagogique : "Les 14 jours sont calibrés pour que ton corps installe les bases avant qu'on isole un pilier — tu ne perds pas de temps, tu construis." Il valide le paiement.

La modale `IA-31` de confirmation post-abonnement s'affiche : "Bienvenue dans la suite. Continue ta Phase 0 — c'est elle qui prépare le terrain. Pendant que tu pratiques, on te débloque progressivement les contenus de la Phase 1, à raison d'1 ou 2 par jour. Le pratique de Phase 1 démarrera après tes 14 jours et ton S0." Un encart spécifique apparaît désormais sur l'accueil : "Tes bonus du jour" (`IA-32`), qui débloque progressivement les vidéos d'intro Mimi & Jacky par pilier, podcasts, lectures.

L'utilisateur revient à l'accueil. Il continue sa journée comme prévu (il en est à J3, il a 11 jours de Phase 0 devant lui, plus 2 jours de S0). Le streak n'est pas affecté. La logique de check quotidien reste identique.

### Flow 4 — Transition J14 → S0 → S1

L'utilisateur arrive au soir du J14. Il valide sa dernière journée de Phase 0. La modale de validation `IA-15` est jouée en version "fin de Phase 0" : "Tu viens de boucler 14 jours. Repose-toi cette nuit, on se retrouve demain pour ouvrir la suite." Le streak est à 14 (ou un peu moins selon l'usage du joker). L'écran d'accueil bascule.

Le lendemain matin (J15 calendaire = J1 du S0), l'utilisateur ouvre l'app. Il atterrit sur l'écran `IA-20` du S0.1. C'est un écran spécial de transition, plein écran, scrollable. Il célèbre les 14 jours accomplis avec une vidéo Mimi & Jacky de 60-90 secondes ("Tu viens de faire ce que la majorité des gens ne fait pas : 14 jours d'affilée à observer ton corps"). Puis il révèle pour la première fois la **toile d'araignée** — vide ou à un état initial bas, avec les 8 branches nommées. Mimi & Jacky expliquent : "Voilà comment on va lire ton évolution. Aujourd'hui, ces 8 branches sont à leur point de départ. Les 8 prochaines semaines, tu vas en faire grandir une par une." L'utilisateur a un bouton "J'ai compris, on continue" qui le ramène à l'accueil.

À partir de là, l'**onglet Toile** apparaît dans la tab bar pour la première fois. L'utilisateur peut y aller s'il veut explorer la toile. L'accueil est en mode S0.1 — il n'y a pas de check à faire ce jour-là, juste l'invitation à laisser décanter.

Le lendemain matin (J2 du S0), l'utilisateur ouvre l'app et atterrit sur l'écran `IA-21` du S0.2. C'est le deuxième écran de transition. Il présente la **roadmap des 8 semaines** sous une forme visuelle (S1 Respiration, S2 Alimentation, jusqu'à S8 Élimination et détox). Mimi & Jacky expliquent le changement de mode pédagogique : "Pendant les 14 derniers jours, tu as touché à tout en parallèle. Maintenant, on va isoler. Une semaine = un pilier. Tu vas sentir mieux ce qu'apporte chaque chose." L'écran enchaîne sur la **mini-évaluation initiale du pilier S1 — Respiration** (12 questions courtes, écran `IA-40`), qui calibre le niveau de départ (Essentiel, Progression ou Immersion). À la fin de l'évaluation, l'utilisateur reçoit son niveau d'entrée et l'écran se referme sur l'accueil — désormais en mode S1 J1.

### Flow 5 — Journée-type Phase 1 (S2, J3, pilier Alimentation)

L'utilisateur est en S2, troisième jour de la semaine consacrée à l'alimentation. Il a déjà fait son évaluation initiale de S2 le lundi. Il ouvre l'app le matin. L'accueil `IA-11` est en mode S2 J3. Il affiche le pilier en cours (Alimentation, S2), les 3 sessions du jour (par exemple : "Petit-déjeuner protéiné", "Mastication consciente", "Soirée légère"), un message Mimi & Jacky du matin, et le streak en cours.

Les habitudes Phase 0 ne sont **pas affichées**, conformément à la décision D9. Pas de checklist multi-piliers. L'écran est centré sur Alimentation et rien d'autre.

L'utilisateur tape sur la première session, ce qui ouvre l'écran de session `IA-43`. Il y trouve la consigne, une courte vidéo Jacky qui guide la pratique, un test de ressenti **avant** la session (rapide, type "comment tu te sens là maintenant ? — 3 niveaux"), puis la pratique elle-même, puis un test **après** la session, puis un bouton de validation. À la sortie, retour à l'accueil avec la session cochée.

En milieu de journée, l'utilisateur sent qu'il flanche un peu. Il ouvre la deuxième session. Avant de la commencer, il tape sur le bouton **niveau adaptatif** (`IA-44`) qui propose "Moins / Pareil / Plus". Il choisit "Moins". La consigne s'adapte (pratique allégée), un message Mimi & Jacky valide le choix : "Bien. Mieux vaut faire moins que craquer. La régularité gagne." Il fait la session, valide.

Le soir, la troisième session est faite. L'utilisateur valide sa journée via le bouton de l'accueil. La modale `IA-15` s'affiche en version Phase 1 : "Tu as fait 3 sessions sur 3 aujourd'hui. Pilier Alimentation, jour 3. Streak : 17 jours." Le streak s'incrémente. Il a passé le palier 15j hier, donc pas de modale de palier ce soir.

### Flow 6 — Palier de récompense streak débloqué (palier 30j)

L'utilisateur en est à son 30e jour consécutif de validation (il est en S3, jour 2 — pilier Mindset). Il vient de valider sa journée. La modale standard `IA-15` se joue, elle dit "Streak : 30 jours". Mais juste après sa fermeture, **une seconde modale s'ouvre automatiquement** : `IA-50` palier de récompense.

Cette modale est différente. Elle prend tout l'écran, joue la **vidéo de 30 secondes** Mimi & Jacky dédiée au palier 30j (dans la série narrative des 6 vidéos progressives). Elle affiche le badge "30 jours" qui rejoint la galerie des paliers atteints. Un message personnalisé du palier accompagne : "30 jours, c'est le seuil où le corps commence à mémoriser. Continue, tu es au bon endroit." L'utilisateur peut fermer la modale (bouton de fermeture) ou taper sur un bouton "Voir mes paliers" qui ouvre la galerie `IA-51`. Dans les deux cas, retour à l'accueil ensuite.

L'utilisateur n'a rien eu à faire pour déclencher ce palier — il s'est ouvert tout seul à la validation de la journée. C'est un événement, pas un lieu qu'on visite.

### Flow 7 — Sortie de S8 et bascule du mentorat en proposition active

L'utilisateur termine la S8 (pilier Élimination et détox). Le dernier jour de S8, il fait son évaluation finale du pilier (`IA-46`), qui met à jour la 8e branche de la toile d'araignée. À la sortie de l'évaluation, l'écran `IA-22` de sortie de S8 prend la main. C'est l'équivalent narratif des écrans S0, en miroir.

Cet écran célèbre les 8 semaines accomplies. Il présente la toile d'araignée dans son état final (les 8 branches travaillées, l'évolution visible par rapport à l'état initial du S0). Une vidéo Mimi & Jacky de 90 secondes accompagne : "Tu viens de faire 10 semaines de pratique guidée. Regarde ta toile." Puis il présente le **mode consolidation libre** (`IA-23`) — ce que l'utilisateur peut faire dans l'app maintenant : revisiter les piliers, refaire des sessions, suivre son streak (qui continue), accéder à tout le contenu bonus.

L'écran termine par la **proposition active du mentorat** (`IA-60`). C'est ici que le ton change — pas avant. "Tu as posé les bases. Si tu veux aller plus loin, accompagné, on en parle. Pas de pression, juste une porte ouverte." Un bouton "Découvrir le mentorat" ouvre l'écran `IA-61` du mentorat (qui était passif jusque-là), avec un lien vers la prise de RDV externe (typeform, Calendly ou autre).

L'utilisateur peut choisir d'explorer le mentorat ou de fermer et revenir à l'accueil — qui est désormais en mode post-S8 (consolidation libre, pas de pilier en cours, mais accès à toute la matière passée). Le streak continue de tourner sur la régularité de connexion à l'app et de pratique libre.


---

## 5. Détail écran par écran

Cette section parcourt chaque écran de la V1, groupé par fonction. Chaque écran est documenté avec son rôle, son contenu principal, ses états spéciaux, ses transitions entrantes et sortantes, et son statut (proto existant, proto à refondre, à créer).

### Groupe 1 — Onboarding et inscription

**`IA-01` Slide 1 — Le diagnostic** `[proto: OnboardingScreen — slide 1, copy à mettre à jour selon Audit V1]`. Premier écran de l'app, ouvert au tout premier lancement. Affiche un texte court qui vise à faire reconnaître à l'utilisateur la situation qu'il vit (fatigue chronique, déconnexion du corps, etc.) — voir le copy proposé dans l'Audit copy V1. Pas d'interaction autre qu'un bouton "Continuer". Transition entrante : ouverture de l'app au premier lancement. Transition sortante : `IA-02`.

**`IA-02` Slide 2 — Le constat** `[proto: OnboardingScreen — slide 2]`. Élargit le diagnostic à un constat plus large (la dégradation moderne de la vitalité). Bouton "Continuer". Sortie : `IA-03`.

**`IA-03` Slide 3 — La promesse** `[proto: OnboardingScreen — slide 3]`. Présente la promesse Raw Adventure (faire ressentir la vitalité par l'expérimentation corporelle, parcours guidé). Bouton "Continuer". Sortie : `IA-04`.

**`IA-04` Slide 4 — Questionnaire 4 dimensions, partie 1** `[proto: OnboardingScreen — slide 4]`. Première partie du questionnaire (énergie, corps). Questions courtes à choix multiples. Sortie : `IA-05` une fois les réponses données.

**`IA-05` Slide 5 — Questionnaire 4 dimensions, partie 2** `[proto: OnboardingScreen — slide 5]`. Deuxième partie (mental, motivation). Sortie : `IA-06`.

**`IA-06` Slide 6 — La projection** `[proto: OnboardingScreen — slide 6]`. Projection du "qui tu peux devenir" basée sur le ton Brand Core, sans sur-promesse. Sortie : `IA-07`.

**`IA-07` Slide 7 — Profil dynamique** `[proto: OnboardingScreen — slide 7, copy à mettre à jour selon Audit V1]`. Affiche le profil calculé parmi les 8 possibles, avec une description courte adaptée à ce profil (voir Audit copy V1 pour les 8 textes). État spécial : 8 variantes selon le profil calculé. Sortie : `IA-08`.

**`IA-08` Slide 8 — Comment ça marche** `[proto: OnboardingScreen — slide 8]`. Présente la mécanique : 14 jours d'amorçage gratuit, puis 8 semaines de focus pilier par pilier avec abonnement. Préfigure la structure sans la détailler. Sortie : `IA-09`.

**`IA-09` Slide 9 — L'engagement** `[proto: OnboardingScreen — slide 9]`. Engagement explicite "je joue le jeu pendant 14 jours". L'utilisateur doit cocher activement la case ou taper sur un bouton qui matérialise l'engagement. Sortie : `IA-10`.

**`IA-10` Slide 10 — Création de compte** `[proto: RegisterScreen + slide finale]`. Création de compte par email + mot de passe, ou via SSO (Apple / Google). Sortie : `IA-10b` si moins de 4 heures avant minuit local et utilisateur n'a pas dépassé minuit (voir D24), sinon `IA-12` directement (puis `IA-11` en mode J1). État spécial : si l'utilisateur abandonne avant validation, le compte n'est pas créé, l'app le ramène à la slide 1 au prochain lancement. Pas de "reprise au milieu" en V1, l'onboarding se fait d'un trait.

**`IA-10b` Écran de choix de démarrage** `[à créer]`. Couche superposée qui s'affiche conditionnellement à la sortie d'`IA-10`, **uniquement si la création de compte intervient à moins de 4 heures du minuit local suivant et que l'utilisateur n'a pas encore dépassé minuit** (soit, en pratique, entre 20h et 23h59 locales). Si la création de compte intervient en dehors de ce créneau, `IA-10b` est sauté et l'app enchaîne directement sur `IA-12` comme dans le flow standard. L'écran présente un message court Mimi & Jacky qui pose le choix : démarrer le J1 maintenant ou le lendemain matin. Deux boutons : "On démarre maintenant" (pose `accountCreatedAt = now()`, enchaîne sur `IA-12`), "Je commence demain" (pose `accountCreatedAt = startOfNextLocalDay()`, bascule en état d'attente et enchaîne sur `IA-10c`). Pas de fermeture par retour Android — l'utilisateur doit choisir explicitement. Acte D24.

**`IA-10c` Écran d'attente pré-Phase 0** `[à créer]`. Écran plein affiché pendant la période d'attente entre la création de compte et le passage du minuit local choisi par l'utilisateur (cas du démarrage différé). Tab bar en mode dégradé : onglet Profil actif, onglets Accueil et Toile masqués ou inactifs (l'utilisateur n'a pas encore commencé son parcours). L'écran présente un message Mimi & Jacky d'attente bienveillant ("Repose-toi ce soir, on s'y met demain"), affiche le compte à rebours jusqu'au démarrage automatique au minuit local, et propose un bouton secondaire "En fait, on démarre maintenant" qui repose `accountCreatedAt = now()` et bascule l'app en `phase_0` avec déclenchement immédiat d'`IA-12`. Sortie automatique : à la première ouverture de l'app après le passage de minuit local, l'app détecte la transition, bascule en `phase_0` et déclenche `IA-12`. Pas d'écran narratif spécial pour cette bascule — c'est une transition silencieuse vers `IA-12` qui joue son rôle habituel de vidéo de bienvenue J1. Acte D24.

### Groupe 2 — Accueil quotidien et navigation principale

**`IA-11` Accueil quotidien** `[proto: HomeScreen — à enrichir]`. C'est l'écran-pivot de l'app. Il adapte son contenu selon le moment du parcours.

*États selon la phase :*

**État Phase 0 (J1 à J14).** Affiche en haut le numéro du jour (J1 sur 14, J5 sur 14, etc.), le streak avec son indicateur de joker disponible, un message Mimi & Jacky calibré sur la phase narrative (Mise en route J1-J4, Le corps répond J5-J8, La vraie transformation J9-J11, La maîtrise J12-J14). Au centre, la **checklist des 6 piliers du jour** (activation matinale, défi froid, mouvement, minéralisation, fenêtre digestive, soirée sans écrans), chacun cochable individuellement. En bas, le bouton "Valider ma journée" qui s'active dès qu'un seuil minimum est atteint (techniquement coché à toute heure, mais avec un rappel pédagogique du soir). Un bouton discret "S'abonner" apparaît à partir de J3, en bas de l'écran ou dans un encart latéral.

**État S0.1 (J15 calendaire).** Pas de checklist. Affiche un message d'invitation à ouvrir la transition (qui s'est déclenchée automatiquement au premier lancement de la journée — voir `IA-20`). Le streak est affiché. Pas de bouton "Valider ma journée" — la journée S0.1 ne fait pas l'objet d'un check classique.

**État S0.2 (J16 calendaire).** Idem mais pour le S0.2 (`IA-21`). À la sortie de l'évaluation initiale du pilier S1, l'accueil bascule en mode S1 J1.

**État Phase 1 (S1 à S8).** Affiche en haut le pilier en cours et le numéro du jour dans la semaine (S2 J3, par exemple), le streak. Au centre, les 3 sessions du jour, chacune cochable. Un message Mimi & Jacky du matin. Pas de checklist multi-piliers (D9). En bas, le bouton "Valider ma journée" qui s'active à partir de la première session validée. Le bouton "S'abonner" n'apparaît plus puisque l'utilisateur est forcément abonné en Phase 1. Un encart "Pilier en cours" donne accès au détail du pilier (`IA-42`).

**État post-S8 (mode consolidation libre).** Pas de pilier imposé. Affiche une invitation à la pratique libre, avec accès direct aux 8 piliers travaillés (l'utilisateur peut refaire une session de respiration, d'alimentation, etc.). Le streak continue. Le mentorat est mis en avant (proposition active depuis la sortie de S8).

*Transitions entrantes :* sortie de l'onboarding (première fois), ouverture de l'app (récurrent), retour depuis un autre écran (modal fermé, navigation pleine fermée), retour depuis l'onglet Toile ou l'onglet Profil.

*Transitions sortantes :* taper sur un pilier ouvre `IA-13` (Phase 0) ou `IA-43` (Phase 1, session). Taper sur "Valider ma journée" ouvre la modale `IA-15`. Taper sur "S'abonner" ouvre la modale `IA-30`. Taper sur l'onglet Toile ouvre `IA-25` ou `IA-26`. Taper sur l'onglet Profil ouvre `IA-70`. Taper sur "Tes bonus du jour" (si conversion précoce) ouvre `IA-32`.

**`IA-12` Vidéo de bienvenue J1** `[à créer]`. Vidéo courte (15-30 secondes, à préciser) de Mimi & Jacky qui s'affiche au tout premier lancement de l'accueil après l'onboarding. Pas un écran à part entière, plutôt une couche superposée à l'accueil J1 qui se ferme automatiquement après lecture, ou que l'utilisateur peut passer. Transition entrante : sortie de `IA-10`. Sortie : `IA-11` en mode J1.

### Groupe 3 — Phase 0

**`IA-13` Détail d'un pilier (Phase 0)** `[proto: DayDetailScreen + ExplicationDuDetailScreen — à fusionner ou clarifier]`. Écran plein qui présente un pilier de la Phase 0 pour le jour en cours. Contient : nom du pilier, vidéo de Jacky (60-90 secondes), consigne du jour (qui peut varier selon le jour — par exemple le défi froid évolue en intensité de J1 à J14), bouton de validation "Pratique faite". Six variantes selon le pilier. Sortie sur validation : retour à `IA-11` avec le pilier coché. Sortie sans validation : retour à `IA-11` sans rien cocher.

*État spécial niveau adaptatif manuel (Phase 0).* Bouton "Moins / Pareil / Plus" disponible sur chaque pilier qui le supporte (typiquement le défi froid et la fenêtre digestive). Affichage discret. Tap → mini-modale d'ajustement → consigne adaptée affichée. Voir `IA-44` pour la mécanique générale.

**`IA-14` Écran de jour-charnière** `[à créer pour J3, J7, J11, J14]`. Écrans narratifs spéciaux qui s'affichent une fois par jour-charnière, en plus de l'accueil normal. À J3, l'écran de jour-charnière introduit la possibilité de s'abonner ("Si tu veux assurer la suite, le bouton est là"). À J7, l'écran célèbre la fin de la phase narrative 1 ("Tu as touché les 6 piliers, ton corps a déjà commencé à parler"). À J11, l'écran prépare à la difficulté de la zone J9-J11 et donne du contexte ("C'est normal de sentir une fatigue ici, c'est le signe que tu changes"). À J14, l'écran prépare la transition vers le S0 ("Demain, on ouvre la suite"). Ces écrans s'affichent au premier lancement du jour concerné, peuvent être passés, et ne réapparaissent pas. Transition entrante : ouverture de l'app à J3 / J7 / J11 / J14. Sortie : `IA-11` en mode du jour.

**`IA-15` Modale de validation du check quotidien** `[à créer]`. Modale qui s'affiche après que l'utilisateur a tapé sur "Valider ma journée".

*États selon la situation :*

**État Phase 0, journée validée (4+ piliers cochés).** Affiche un feedback motivant Mimi & Jacky calibré sur le jour, le streak qui s'incrémente, parfois un encouragement spécifique sur le 5e ou 6e pilier non fait. Bouton de fermeture qui ramène à `IA-11`.

**État Phase 0, joker activé (moins de 4 piliers, joker disponible).** Message "Le joker se déclenche pour préserver ton streak". Streak maintenu. Voir Audit copy V1 pour les formulations.

**État Phase 0, streak cassé (moins de 4 piliers, joker déjà consommé cette semaine).** Message "Le streak repart de zéro demain. Continue, c'est la régularité qui compte, pas la performance."

**État Phase 1, journée validée (1+ session sur 3).** Feedback adapté au pilier en cours, streak incrémenté.

**État Phase 1, joker activé / streak cassé.** Mêmes mécaniques.

**État palier de récompense atteint.** La modale standard se ferme et ouvre automatiquement la modale `IA-50` du palier débloqué.

Transition entrante : depuis `IA-11` après validation. Transition sortante : retour à `IA-11`, ou ouverture automatique de `IA-50` si palier atteint.

### Groupe 4 — S0 de transition

**`IA-20` Écran S0.1 — Célébration et révélation de la toile** `[à créer]`. Écran plein scrollable, ouvert automatiquement au premier lancement de l'app le J15 calendaire (premier jour après J14). Trois sections successives : célébration des 14 jours avec vidéo Mimi & Jacky de 60-90 secondes, révélation visuelle de la toile d'araignée à 8 branches dans son état initial, explication courte du fonctionnement de la toile par Mimi & Jacky. Bouton "J'ai compris, on continue" qui ramène à `IA-11` en mode S0.1. État spécial : la toile s'affiche pour la première fois ici, l'onglet Toile devient visible dans la tab bar à partir de cet écran.

**`IA-21` Écran S0.2 — Roadmap des 8 semaines + évaluation S1** `[à créer]`. Écran plein scrollable, ouvert automatiquement au premier lancement de l'app le J16 calendaire. Trois sections : présentation de la roadmap des 8 semaines (S1 Respiration → S8 Élimination et détox) avec un visuel simple (timeline ou liste verticale), explication du changement de mode pédagogique (multi-piliers parallèle → mono-pilier focus), invitation à démarrer l'évaluation initiale du pilier S1 Respiration. Le bouton "Démarrer S1" enchaîne sur `IA-40` (évaluation initiale Respiration). Sortie de l'évaluation : `IA-11` en mode S1 J1.

### Groupe 5 — Phase 1

**`IA-22` Écran de sortie de S8** `[à créer]`. Équivalent narratif des écrans S0, en miroir. Ouvert automatiquement à la fin de l'évaluation finale du pilier S8. Trois sections : célébration des 8 semaines avec vidéo Mimi & Jacky, présentation de la toile d'araignée dans son état final (avec comparaison visuelle à l'état initial du S0), introduction du mode consolidation libre. Bouton "Continuer" qui mène à `IA-23`.

**`IA-23` Écran de présentation du mode consolidation libre** `[à créer]`. Présente ce que l'utilisateur peut faire après S8 : revisiter chacun des 8 piliers, refaire des sessions, suivre son streak, accéder au contenu bonus. Bouton "Continuer" qui mène à `IA-60` (proposition active du mentorat).

**`IA-40` Évaluation initiale d'un pilier (12 questions)** `[à créer]`. Séquence d'écrans, une question par écran, 12 écrans au total. À l'entrée de chaque pilier de Phase 1 (S1 à S8). Génère un score par dimension du pilier, calibre le niveau d'entrée (Essentiel / Progression / Immersion) selon une logique à préciser en Feature Spec et Métriques V1. Huit variantes selon le pilier (les questions diffèrent). Transition entrante : depuis `IA-21` pour le S1, depuis `IA-11` (bouton de démarrage du nouveau pilier) pour S2 à S8. Sortie : écran de récapitulatif de l'évaluation (`IA-41`) puis retour à `IA-11` en mode S J1 du nouveau pilier.

**`IA-41` Récapitulatif de l'évaluation initiale** `[à créer]`. Affiche le score initial du pilier (qui alimente la branche correspondante de la toile dans son état "avant S"), le niveau d'entrée recommandé (avec possibilité de modifier manuellement), un message d'introduction du pilier par Mimi & Jacky. Bouton "Démarrer cette semaine" qui mène à `IA-11` en mode S J1.

**`IA-42` Vue d'ensemble du pilier en cours** `[à créer]`. Écran accessible depuis l'accueil pendant une semaine de Phase 1. Présente le pilier de la semaine, ses 7 jours et 21 sessions, le niveau d'entrée actuel, l'état de progression dans la semaine. Permet de revoir la vidéo d'introduction du pilier. Sortie : retour à `IA-11`.

**`IA-43` Écran de session (Phase 1)** `[à créer]`. Écran plein de pratique, ouvert depuis l'accueil quand l'utilisateur tape sur une des 3 sessions du jour. Quatre sous-étapes : test de ressenti **avant** la session (rapide), pratique elle-même (vidéo guidée Jacky + consigne), test de ressenti **après** la session, validation et retour à l'accueil. Transition sortante : retour à `IA-11` avec la session cochée.

**`IA-44` Bouton niveau adaptatif (modale "Moins / Pareil / Plus")** `[à créer]`. Mini-modale accessible depuis l'écran de session (`IA-43`) ou depuis le détail d'un pilier en Phase 0 (`IA-13`) pour les piliers concernés. Trois options : "Moins" (consigne allégée), "Pareil" (consigne par défaut), "Plus" (consigne intensifiée). Tap → message Mimi & Jacky qui valide le choix → fermeture et retour à l'écran d'origine avec la consigne ajustée. Mécanique applicable Phase 0 et Phase 1.

**`IA-45` Vidéo de transition Phase 0 → S1** `[à créer]`. Vidéo Mimi & Jacky de 60-90 secondes qui explique le retrait des habitudes Phase 0 en S1. Visible au premier lancement de S1 J1, une seule fois, dans une couche superposée à l'accueil. "Tu peux les garder si tu veux, mais focus sur la respiration cette semaine — on évite la surcharge." Pas un écran navigable, plutôt un moment de transition.

**`IA-46` Évaluation finale d'un pilier (12 questions)** `[à créer]`. Identique à `IA-40` mais en sortie de semaine. Mise à jour de la branche de la toile correspondant au pilier. Transition entrante : depuis `IA-11` au matin du jour 7 de la semaine, ou depuis `IA-42`. Sortie : écran de récapitulatif d'évaluation finale (`IA-47`).

**`IA-47` Récapitulatif de l'évaluation finale + branche mise à jour** `[à créer]`. Affiche le score final du pilier, l'évolution par rapport à l'évaluation initiale, la branche mise à jour de la toile (animation visible de la branche qui pousse). Message Mimi & Jacky de clôture du pilier. Bouton "Continuer vers S+1" qui ramène à `IA-11` en mode du nouveau pilier (et lance l'évaluation initiale `IA-40` du pilier suivant). Pour la S8, le bouton mène à `IA-22` (sortie de S8).

### Groupe 6 — Toile d'araignée et progression

**`IA-25` Onglet Toile — Vue principale** `[à créer]`. Accessible depuis la tab bar dès qu'elle apparaît (au S0.1). Affiche la toile d'araignée à 8 branches dans son état actuel. Permet de toucher chaque branche pour ouvrir le détail (`IA-26`). Affiche un mini-historique : "Évolution depuis le début" avec un comparatif visuel.

**`IA-26` Détail d'une branche** `[à créer]`. Ouvert au tap sur une branche depuis `IA-25`. Affiche l'évolution chiffrée de la branche (score initial → score final si pilier déjà travaillé, ou état initial seul si pilier pas encore travaillé), les dates des évaluations, un résumé du pilier. Sortie : retour à `IA-25`.

### Groupe 7 — Streak et paliers de récompense

Le streak en lui-même n'est pas un écran à part — il est affiché en permanence en haut de `IA-11` et sur le profil utilisateur (`IA-70`). Mais les paliers déclenchent des écrans modaux dédiés.

**`IA-50` Modale de palier de récompense** `[à créer]`. Modale qui s'affiche automatiquement à la validation de la journée correspondant au palier (7j, 15j, 30j, 60j, 100j, 1 an). Six variantes, une par palier. Joue la **vidéo de 30 secondes** dédiée au palier (Mimi & Jacky), affiche le badge correspondant, affiche le message personnalisé du palier (différent à chaque palier — voir Audit copy V1). Deux boutons : "Voir mes paliers" qui mène à `IA-51`, "Continuer" qui ramène à `IA-11`.

**`IA-51` Galerie des paliers atteints** `[à créer]`. Accessible depuis `IA-50` ou depuis le profil (`IA-70`). Affiche les 6 badges (7j, 15j, 30j, 60j, 100j, 1 an). Les paliers atteints sont visibles avec date d'obtention. Les paliers non encore atteints sont visibles en grisé/silhouette pour entretenir la frustration positive. Sortie : retour selon l'écran d'origine.

### Groupe 8 — Abonnement et conversion

**`IA-30` Modale d'abonnement** `[proto: ConversionScreen — à refondre intégralement]`. Modale ouverte au tap sur le bouton "S'abonner" de l'accueil (depuis J3) ou sur un appel à action depuis le profil. Présente l'offre unique (un seul tier en V1, prix mensuel à confirmer en Feature Spec — pas le prix actuel du proto qui était structuré sur 3 tiers). Explique ce que l'abonnement débloque (Phase 1 complète, contenu bonus disponible immédiatement, accès au mentorat à S8). Affiche le rappel pédagogique pour les abonnés précoces : "Les 14 jours sont calibrés pour que ton corps installe les bases avant qu'on isole un pilier — tu ne perds pas de temps, tu construis." Bouton "S'abonner" qui ouvre le flow de paiement natif (Apple Pay / Google Pay / Stripe — à préciser en Feature Spec). Bouton "Pas maintenant" qui ferme la modale et ramène à l'écran d'origine.

**`IA-31` Modale de confirmation post-abonnement** `[à créer]`. S'affiche après validation du paiement. Affiche un message Mimi & Jacky de bienvenue dans la suite, explique ce qui change (rien sur la Phase 0 en cours, accès aux bonus immédiat, Phase 1 démarre après J14 + S0). Bouton "Continuer ma Phase 0" qui ramène à `IA-11` enrichi de l'encart "Tes bonus du jour". État spécial : si l'utilisateur s'abonne en Phase 1 (cas extrêmement rare puisque l'abonnement est requis pour y entrer, mais possible si on imagine un retour après churn — à clarifier en Feature Spec), le message s'adapte.

**`IA-32` Espace contenu bonus (conversion précoce)** `[à créer]`. Accessible depuis l'accueil via un encart "Tes bonus du jour" qui apparaît dès que l'utilisateur s'est abonné en Phase 0. Affiche la roadmap complète des 8 semaines (vue d'ensemble) et la liste du contenu bonus déjà débloqué. Le contenu se débloque progressivement à raison de 1 à 2 pièces par jour (rythme exact à caler en Feature Spec et Brief contenu V1). Trois types de contenu : vidéos d'intro Mimi & Jacky par pilier (8 vidéos), podcasts ou audios plus longs, lectures. Le contenu suit l'ordre des piliers (Respiration d'abord, etc.). Sortie : retour à `IA-11`.

**`IA-33` Lecture d'un contenu bonus** `[à créer]`. Écran plein de lecture (vidéo, audio, ou texte selon le type). Sortie : retour à `IA-32`.

### Groupe 9 — Mentorat

**`IA-60` Modale de proposition active du mentorat (à S8)** `[à créer]`. Ouverte automatiquement à la sortie de `IA-23` (présentation du mode consolidation libre). Présente la proposition de mentorat : "Tu as posé les bases. Si tu veux aller plus loin, accompagné, on en parle. Pas de pression, juste une porte ouverte." Bouton "Découvrir le mentorat" qui mène à `IA-61`. Bouton "Plus tard" qui ramène à `IA-11` en mode post-S8. Cette modale ne s'affiche qu'une fois — si l'utilisateur la passe, il pourra revenir au mentorat via l'onglet du profil.

**`IA-61` Onglet Mentorat — Présentation** `[à créer]`. Accessible depuis le profil (`IA-70`) à tout moment de S1 à S7 en mode passif (pas de notification, pas de push, juste un onglet visible) et de manière proéminente après S8. Présente le mentorat : ce que c'est, comment ça se passe, qui sont Mimi & Jacky en tant que mentors, les modalités (durée, format, prix indicatif éventuellement). Bouton "Prendre rendez-vous" qui ouvre un lien externe (Calendly, typeform ou autre — à préciser en Feature Spec) dans un navigateur in-app ou le navigateur système. Sortie : retour au profil.

### Groupe 10 — Profil et paramètres

**`IA-70` Profil utilisateur** `[à créer]`. Accessible depuis la tab bar via l'onglet Profil. Affiche : avatar et prénom de l'utilisateur, son profil dynamique (parmi les 8), son palier streak actuel et l'accès à la galerie (`IA-51`), l'état de la toile d'araignée (lien vers `IA-25`), la phase en cours (J5 sur 14, ou S2 J3, etc.). Sections : "Ma progression" (toile + streak + paliers), "Mon abonnement" (lien vers `IA-71`), "Mentorat" (lien vers `IA-61`), "Paramètres" (lien vers `IA-72`), "Aide et support" (lien vers `IA-73`).

**`IA-71` Gestion d'abonnement** `[à créer]`. État du tier (un seul en V1, donc mention simple), date de renouvellement, montant, bouton "Annuler mon abonnement" qui ouvre une modale de confirmation suivie d'un flow de churn (à préciser en Feature Spec — probablement court : "Es-tu sûr ? Voici ce que tu perds. Confirme."). État spécial post-annulation : l'utilisateur garde l'accès jusqu'à la fin de la période payée, puis bascule en mode "abonnement expiré" (à spécifier dans les ruptures de parcours en section 6).

**`IA-72` Paramètres techniques** `[à créer]`. Réglages des notifications push (activation, créneaux horaires de réception), langue, conditions générales (lien vers `IA-74`), politique de confidentialité (lien vers `IA-75`), bouton "Se déconnecter".

**`IA-73` Aide et support** `[à créer]`. FAQ courte (questions probables : comment marche le streak, qu'est-ce que le joker, comment annuler l'abonnement, etc.), lien de contact (email ou formulaire). Pas de chat en V1.

**`IA-74` Conditions générales** `[à créer]`. Texte légal. Pas d'interaction.

**`IA-75` Politique de confidentialité** `[à créer]`. Texte légal. Pas d'interaction.


---

## 6. Ruptures de parcours transverses

Cette section couvre les situations où l'utilisateur sort du parcours nominal et où l'app doit gérer des cas spéciaux. Ce sont des situations qu'on espère rares mais qu'il faut anticiper architecturalement.

**Premier lancement après désinstallation et réinstallation.** L'utilisateur ouvre l'app après avoir supprimé puis réinstallé. Si son compte existait, l'app propose une connexion. À la connexion, il retombe sur l'état où il en était (jour en cours, streak, abonnement). Si plus de 7 jours se sont écoulés sans connexion, le streak est réinitialisé (le joker hebdomadaire ne couvre qu'une semaine). À spécifier en Feature Spec : message d'accueil de retour pour amortir la cassure.

**Abonnement annulé en cours de Phase 1.** L'utilisateur annule son abonnement depuis `IA-71`. Il garde l'accès jusqu'à la fin de la période payée. À l'expiration, l'app bascule en mode "abonnement expiré" : l'accueil affiche un message explicatif et un bouton de réabonnement. Les écrans Phase 1 ne sont plus accessibles. La Phase 0 et le S0 ne sont pas re-jouables. Le profil reste accessible. Ce mode n'a pas d'écran dédié supplémentaire, c'est un état de `IA-11`.

**Hors connexion sur écran critique.** Pour la V1, l'app a besoin d'une connexion pour les vidéos (Mimi & Jacky), pour la sync du streak, pour l'évaluation et la mise à jour de la toile. Hors connexion, les écrans qui dépendent de contenus distants affichent un message court "Reconnecte-toi pour continuer" sans bloquer durement. Le check quotidien peut se faire offline et se synchronise au retour de connexion. Pas de mode offline complet en V1 (à reconsidérer en V1.5 si problème terrain).

**Joker épuisé et streak cassé.** L'utilisateur a manqué deux jours dans la même semaine, le joker est consommé et le streak repart à zéro. Le message de la modale `IA-15` est calibré (Audit copy V1) pour ne pas être punitif : "Le streak repart de zéro demain. Continue, c'est la régularité qui compte, pas la performance." Les paliers déjà atteints restent affichés dans la galerie `IA-51` même si le compteur courant est à 0. Une cassure de streak ne déclenche pas de notification push.

**Conversion précoce intervenant un jour-charnière (J3, J7, J11).** Si l'utilisateur s'abonne pile le jour de l'écran de jour-charnière `IA-14`, l'écran d'abonnement `IA-30` prend le pas, suivi de la confirmation `IA-31`, puis l'écran de jour-charnière s'affiche normalement. Pas de double prise de parole simultanée.

**Utilisateur qui ne s'engage pas en sortie d'onboarding.** Si l'utilisateur ferme l'app avant la création de compte (`IA-10`), aucun état n'est conservé. Au prochain lancement, il refait l'onboarding depuis la slide 1. C'est délibéré : on veut que l'engagement se prenne en une fois, pas par bribes.

**Utilisateur qui n'ouvre pas l'app pendant plusieurs jours en Phase 0.** Sans connexion pendant 2 jours en Phase 0, le streak est cassé via le mécanisme du joker épuisé. Au retour, l'app le ramène à `IA-11` mais en lui montrant le jour calendaire courant, pas le jour qu'il "aurait dû" vivre — la Phase 0 avance au rythme du calendrier réel, pas au rythme des connexions. C'est un choix volontaire pour éviter de récompenser l'absence par un "rattrapage" qui dénaturerait la dramaturgie des 14 jours. À reconsidérer si problème massif en V1.5.

**Utilisateur qui n'ouvre pas l'app pendant plusieurs jours en Phase 1.** Même logique. Si l'utilisateur saute trois jours d'une semaine de pilier, il revient à un état où il a "raté" 3 sessions × 3 = 9 sessions du pilier. Pas de rattrapage automatique. Mimi & Jacky portent un message de reprise sans culpabilisation. L'évaluation finale du pilier se fait quand même au jour 7 calendaire du pilier, avec les données partielles.

---

## 7. Synthèse — Inventaire complet des écrans V1

Le tableau ci-dessous consolide tous les écrans V1 avec leur identifiant, leur statut (proto existant, proto à refondre, à créer) et leur groupe fonctionnel. Il sert de référence pour la Feature Spec et pour estimer la charge de développement.

| ID | Nom | Groupe | Statut |
|---|---|---|---|
| IA-01 | Slide 1 — Le diagnostic | Onboarding | Proto à enrichir copy |
| IA-02 | Slide 2 — Le constat | Onboarding | Proto à enrichir copy |
| IA-03 | Slide 3 — La promesse | Onboarding | Proto à enrichir copy |
| IA-04 | Slide 4 — Questionnaire partie 1 | Onboarding | Proto existant |
| IA-05 | Slide 5 — Questionnaire partie 2 | Onboarding | Proto existant |
| IA-06 | Slide 6 — La projection | Onboarding | Proto à enrichir copy |
| IA-07 | Slide 7 — Profil dynamique | Onboarding | Proto à enrichir copy |
| IA-08 | Slide 8 — Comment ça marche | Onboarding | Proto à enrichir copy |
| IA-09 | Slide 9 — L'engagement | Onboarding | Proto à enrichir copy |
| IA-10 | Slide 10 — Création de compte | Onboarding | Proto existant (RegisterScreen) |
| IA-10b | Écran de choix de démarrage (différé optionnel) | Onboarding | À créer |
| IA-10c | Écran d'attente pré-Phase 0 | Onboarding | À créer |
| IA-11 | Accueil quotidien | Hub central | Proto à enrichir (HomeScreen) |
| IA-12 | Vidéo de bienvenue J1 | Hub central | À créer |
| IA-13 | Détail d'un pilier (Phase 0) | Phase 0 | Proto à clarifier (DayDetail + Explication) |
| IA-14 | Écrans de jour-charnière (J3, J7, J11, J14) | Phase 0 | À créer |
| IA-15 | Modale de validation du check quotidien | Phase 0 + 1 | À créer |
| IA-20 | Écran S0.1 — Célébration et toile révélée | S0 | À créer |
| IA-21 | Écran S0.2 — Roadmap et évaluation S1 | S0 | À créer |
| IA-22 | Écran de sortie de S8 | Phase 1 | À créer |
| IA-23 | Présentation du mode consolidation libre | Phase 1 | À créer |
| IA-25 | Onglet Toile — Vue principale | Toile | À créer |
| IA-26 | Détail d'une branche | Toile | À créer |
| IA-30 | Modale d'abonnement | Abonnement | Proto à refondre (ConversionScreen) |
| IA-31 | Modale de confirmation post-abonnement | Abonnement | À créer (ou rapprocher de Congratulation) |
| IA-32 | Espace contenu bonus | Abonnement | À créer |
| IA-33 | Lecture d'un contenu bonus | Abonnement | À créer |
| IA-40 | Évaluation initiale d'un pilier (12 questions) | Phase 1 | Proto partiel (Questionnaire de départ — à étendre) |
| IA-41 | Récapitulatif évaluation initiale | Phase 1 | À créer |
| IA-42 | Vue d'ensemble du pilier en cours | Phase 1 | À créer |
| IA-43 | Écran de session (Phase 1) | Phase 1 | À créer |
| IA-44 | Bouton niveau adaptatif (modale) | Phase 0 + 1 | À créer |
| IA-45 | Vidéo de transition Phase 0 → S1 | Phase 1 | À créer |
| IA-46 | Évaluation finale d'un pilier | Phase 1 | À créer |
| IA-47 | Récapitulatif évaluation finale + branche | Phase 1 | À créer |
| IA-50 | Modale de palier de récompense | Streak | À créer |
| IA-51 | Galerie des paliers atteints | Streak | À créer |
| IA-60 | Modale de proposition active du mentorat (S8) | Mentorat | À créer |
| IA-61 | Onglet Mentorat — Présentation | Mentorat | À créer |
| IA-70 | Profil utilisateur | Profil | À créer (partiel via Congratulation ?) |
| IA-71 | Gestion d'abonnement | Profil | À créer |
| IA-72 | Paramètres techniques | Profil | À créer |
| IA-73 | Aide et support | Profil | À créer |
| IA-74 | Conditions générales | Légal | À créer |
| IA-75 | Politique de confidentialité | Légal | À créer |

### Lecture du tableau pour la timeline dev

Sur 45 écrans V1, environ 9 existent déjà sous une forme ou une autre dans le proto (avec copy ou structure à mettre à jour) et 36 sont à créer. Le **gros du travail dev** est sur la Phase 1 (12 écrans à créer pour la structure-type et ses variantes), le S0 (2 écrans à créer), la sortie de S8 (3 écrans à créer), la toile d'araignée et le streak (4 écrans à créer), le contenu bonus (2 écrans à créer), le mentorat (2 écrans à créer), le profil et les périphériques (6 écrans à créer), plus 2 écrans liés au démarrage différé optionnel ajoutés en V2 du doc (IA-10b et IA-10c).

Le proto existant couvre l'onboarding et le squelette de la Phase 0, ce qui est cohérent avec ce qui était décrit dans la passation. Le ConversionScreen actuel doit être refondu intégralement pour devenir `IA-30` selon la décision D3.

Cette synthèse n'est **pas une estimation de jours de dev**. Un même "écran à créer" peut être trivial (mentions légales) ou complexe (toile d'araignée animée). L'estimation viendra dans la Feature Spec V1, écran par écran.

### Note sur le mapping proto actuel ↔ IA V1

Lors d'une session ultérieure, on confrontera précisément l'inventaire du proto codé (lancement de Claude Code dans le repo pour un audit structuré) à cet inventaire V1. Le delta exact entre les deux deviendra la to-do du dev. À ce stade, on dispose d'un mapping approximatif : `OnboardingScreen` couvre IA-01 à IA-09, `RegisterScreen` couvre IA-10, `HomeScreen` couvre IA-11 mais en mode Phase 0 uniquement, `DayDetailScreen` et `ExplicationDuDetailScreen` couvrent IA-13 (à clarifier si fusionner ou garder séparés), `Questionnaire de départ` est une base pour IA-40, `ConversionScreen` est à refondre en IA-30, `Congratulation screen` est à intégrer dans IA-31 ou IA-70 selon ce qu'il porte.

---

## Décisions prises dans le cadre de cette IA

**D17 — Durée du S0 actée à 2 jours.** Tranchée en début de session. S0.1 = célébration des 14 jours et révélation de la toile d'araignée. S0.2 = roadmap des 8 semaines et évaluation initiale du pilier S1 Respiration. Cette décision permet de documenter les écrans IA-20 et IA-21 sans flou. À ajouter à la Synthèse des décisions V2.

**D18 — Modèle de navigation à 3 onglets.** Tranchée en cours de rédaction. Tab bar à 3 onglets : Accueil, Toile, Profil. Pas de menu hamburger, pas de tiroir latéral. L'onglet Toile est masqué pendant toute la Phase 0 et apparaît au S0.1. Voir section 3.

**D19 — Écrans de jour-charnière en Phase 0.** Tranchée en cours de rédaction. Quatre jours-charnières affichent un écran narratif spécial qui se superpose à l'accueil au premier lancement du jour : J3 (introduction conversion), J7 (célébration phase narrative 1), J11 (préparation à la zone difficile), J14 (préparation S0). Voir IA-14.

**D20 — Pas de rattrapage automatique des jours manqués.** Tranchée en section 6. Le calendrier de l'app suit le calendrier réel, pas le rythme de connexion. Un utilisateur qui saute 3 jours en S2 reprend à S2 J5, pas à S2 J2. À reconsidérer en V1.5 si problème terrain.

---

## Documents à mettre à jour suite à cette IA

**Synthèse des décisions V2** — ajouter D17 (durée S0 à 2 jours), D18 (nav à 3 onglets), D19 (écrans de jour-charnière), D20 (pas de rattrapage). Passage en **Synthèse des décisions V3** ou enrichissement V2 selon ta préférence.

**Product Vision v2.1** — ajout mineur dans la section "Ce qui est dans la V1" pour mentionner explicitement le S0 en 2 jours et les écrans de jour-charnière. Passage potentiel en **v2.2**.

**CLAUDE.md du repo** (à créer) — pourra référencer cette IA comme source de vérité pour la liste des écrans V1.

**Feature Spec V1** (à venir) — alimente directement chaque écran IA-XX avec sa spec technique, ses props, ses états, ses transitions précises.

**Brief contenu V1** (à venir) — alimente les écrans qui portent du contenu (vidéos, textes Mimi & Jacky, scripts des 6 vidéos de palier streak).

**Métriques V1** (à venir) — alimente IA-25, IA-26, IA-40, IA-41, IA-46, IA-47 avec le calcul des branches et des scores.

---

## Historique des versions

**Version 2 — 5 mai 2026.** Ajout de deux nouveaux écrans `IA-10b` (écran de choix de démarrage) et `IA-10c` (écran d'attente pré-Phase 0) entre `IA-10` et `IA-11`, suite à l'acte de la décision D24 dans la Synthèse V5 (démarrage différé optionnel à la création de compte). Description d'`IA-10` mise à jour pour refléter la nouvelle transition sortante conditionnelle. Tableau récapitulatif des écrans enrichi des deux nouvelles lignes. Compteur passé de 43 à 45 écrans V1.

**Version 1 — 5 mai 2026.** Création du document. Décisions D17 à D20 ajoutées. Inventaire de 43 écrans V1 documentés. Mapping approximatif au proto existant.

---

*Document vivant, à mettre à jour quand un changement structurel intervient (nouvel écran, refonte de la nav, etc.). Les changements purement techniques ou de copy n'ont pas leur place ici — ils relèvent de la Feature Spec ou du Brief contenu.*

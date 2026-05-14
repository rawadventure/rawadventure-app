# Feature Spec — Pilier S1 Respiration

**Version :** V1.0 stable (clôture de la production itérative, fermeture des zones résiduelles Z1, Z3, Z6, validation Stéphane)
**Date :** 12 mai 2026 (production V0.1 draft itératif) / 13 mai 2026 (passage en V1.0 stable, fermeture Z1/Z3/Z6, patches groupés propagés)
**Statut :** **V1.0 stable.** Document de référence autoritaire pour l'implémentation du pilier S1 Respiration en V1 de l'app Raw Adventure. Sert également de **pilier-pattern Type A** : sa structure (12 sections + annexe) sera reproduite plug-and-play pour les Feature Specs S2 à S8 à venir.
**Auteur :** Claude.ai avec Stéphane, sur la base de la matière V0 Jacky et des docs de cadrage stables.
**Destinataires :** Claude Code (implémentation), Mimi & Jacky (Brief contenu V1), équipe produit.

**Nom de fichier stable :** `raw-adventure-feature-spec-pilier-s1-respiration.md` (convention Option A actée, nom stable, contenu versionné en interne).

**Historique des versions.**

**V0.1 — 12 mai 2026.** Production itérative section par section sur une session Claude (Sections 0 à 11 + Annexe). Trois écarts V0 → V1 explicités (durées 5/10/20 min, sessions matin/midi/soir, terminologie Essentiel). 13 zones résiduelles consolidées en Section 11. 6 patches groupés à propager identifiés. Document complet livré pour relecture Stéphane.

**V1.0 — 13 mai 2026.** Relecture Stéphane validée. Fermeture explicite des zones résiduelles Z1 (inversion sémantique Q6/Q7/Q8 actée — score utilisé = 6 - réponse, slots marqués `reversed: true`), Z6 (joker hebdomadaire confirmé en Phase 1 sur la même logique qu'en Phase 0, patch propagé à Feature Spec V1 Socle minimum V1.2), Z3 (déclassement Phase 0 → Phase 1 sur S1 traité par le message standard du diagnostic 1-2-3, slot dédié optionnel non retenu). Patches groupés propagés en parallèle vers Métriques V1.4 → V1.5 (recalibrage 5/10/20 min), Schéma de données V1.0 → V1.1 (ajout `notifications_sent`, vérification `duration_seconds`), Customer Journey V1.2 → V1.3 (migration ordre D8 → D39), Synthèse V8 → V8.1 (mention de la production), CLAUDE.md du repo V1.2 → V1.3 (référence à la Feature Spec S1 stable et son rôle de pilier-pattern). Document passé en V1.0 stable, autoritaire pour l'implémentation.

---

## Sommaire

- [Section 0 — Préambule](#section-0--préambule)
- [Section 1 — Vision pédagogique](#section-1--vision-pédagogique)
- [Section 2 — Évaluation initiale du pilier (IA-40)](#section-2--évaluation-initiale-du-pilier-ia-40)
- [Section 3 — Diagnostic et niveau d'engagement de départ (IA-41)](#section-3--diagnostic-et-niveau-dengagement-de-départ-ia-41)
- [Section 4 — Programme jour par jour (J1 à J7)](#section-4--programme-jour-par-jour-j1-à-j7)
- [Section 5 — Mécaniques transverses du pilier](#section-5--mécaniques-transverses-du-pilier)
- [Section 6 — Évaluation finale et progression visible (IA-46 et IA-47)](#section-6--évaluation-finale-et-progression-visible-ia-46-et-ia-47)
- [Section 7 — Slots de copy et de visuels à produire](#section-7--slots-de-copy-et-de-visuels-à-produire)
- [Section 8 — Notifications](#section-8--notifications)
- [Section 9 — Données à stocker](#section-9--données-à-stocker)
- [Section 10 — Edge cases spécifiques au pilier](#section-10--edge-cases-spécifiques-au-pilier)
- [Section 11 — Zones résiduelles et points reportés](#section-11--zones-résiduelles-et-points-reportés)
- [Annexe — Matière source](#annexe--matière-source)
- [Bilan de la production S1](#bilan-de-la-production-s1)

---

## Section 0 — Préambule

### 0.1 — Identité du pilier

**Numéro et nom.** S1 Respiration. Premier pilier de Phase 1, première semaine de la séquence narrative S1 à S8. Position 12h sur la toile d'araignée à 8 branches.

**Typologie.** Type A — pilier à intensité graduelle (voir Métriques V1.4 § 1.8 et Synthèse V8 D41). S1 suit la mécanique standard E/P/I : évaluation 12 questions → diagnostic 5 niveaux → règle D40 → engagement de départ Essentiel/Progression/Immersion → paramètre principal modulé → niveau adaptatif Moins/Pareil/Plus disponible. S1 est explicitement choisi comme **pilier-pattern Type A** parce que sa mécanique est la plus pure (mono-paramètre cohérence cardiaque, sans complexité multi-facteurs comme S3 ou S8). Le format de cette Feature Spec sera réutilisé en plug-and-play pour S2, S3, S4, S6, S8 (les 5 autres Type A). Les Feature Specs S5 et S7 (Type B) reprendront les sections 0, 1, 2 et 6, mais remplaceront 3, 4 et 5 par une structure narrative 7 jours alternative à formaliser séparément.

### 0.2 — Rôle dans le parcours

**Position narrative.** S1 ouvre la Phase 1. C'est la première fois que l'utilisateur quitte le mode multi-piliers de la Phase 0 (7 actions du quotidien cochées chaque jour pendant 14 jours) pour entrer dans le mode mono-pilier (un seul levier travaillé en profondeur sur une semaine). Ce changement d'allure est explicitement assumé par la marque — voir Brief contenu Session 3 et IA-21. La S1 n'est pas un défi, c'est une orientation : on commence là parce que la respiration est la base, c'est ce qui régule tout le reste (formulation Jacky validée).

**Articulation Phase 0 → S1 spécifique à ce pilier.** En Phase 0, l'utilisateur a déjà coché la respiration nasale comme une des 7 actions quotidiennes — il a donc déjà été exposé au pilier sous forme d'action légère. En S1, on change d'échelle : on passe d'une case à cocher à une pratique structurée (cohérence cardiaque, durée mesurée, validation de session). La vidéo IA-45 (transition Phase 0 → S1) porte le message du retrait des autres habitudes Phase 0 pendant cette semaine : *"Tu peux les garder si tu veux, mais focus sur la respiration cette semaine — on évite la surcharge."* Cette vidéo est invariante de pilier en pilier dans son rôle (il y aura un équivalent IA-45 entre chaque pilier), mais son contenu est spécifique à la transition Phase 0 → S1.

**Enchaînement S1 → S2.** À la sortie d'IA-47 (récapitulatif évaluation finale S1), le bouton "Continuer vers S+1" enchaîne sur IA-40 du pilier suivant, c'est-à-dire **S2 Activité physique** dans l'ordre canonique D39 (voir Synthèse V8 D39 et Métriques V1.4 § 1.2). À noter : l'ordre canonique D39 a remplacé l'ordre D8 obsolète qui plaçait S2 = Alimentation en deuxième position. Si une mention "S2 Alimentation" est croisée en cours de production, c'est un vestige D8 à patcher.

### 0.3 — Écarts V0 → V1 documentés

Le fichier V0 Jacky `V0_PILIER_1___RESPIRATION.docx` est la matière source de cette Feature Spec. Trois écarts entre ce que le V0 décrit et ce que la V1 implémente sont actés explicitement ci-dessous. Ces écarts ne sont pas négociables — ils résultent du cadrage Métriques V1.4 stable et de la cohérence avec les décisions Synthèse V8.

**Écart 1 — Durées du paramètre principal.** Le V0 proposait des durées de session longues (Niveau 1 = 5/10/15 min, Niveau 2 = 20/25/30 min, Niveau 3 = 40/50/60 min). Métriques V1.4 § 4.3 cadrait 3/5/8 min. La V1 de la Feature Spec S1 retient **5 / 10 / 20 minutes** pour les niveaux Essentiel / Progression / Immersion. Calibrage aligné sur la posture Sadhguru (durées pivots des pratiques respiratoires guidées, Inner Engineering). Justification : 5 min est la dose standard de cohérence cardiaque et la durée minimale d'efficacité physiologique sur la variabilité cardiaque, 10 min double la dose pour les profils engagés, 20 min installe une vraie pratique pour les profils en Immersion. La règle D40 plafonnant l'engagement de départ automatique à Progression, personne ne se retrouve à 20 min sans avoir choisi explicitement Immersion via "Modifier mon niveau" en IA-41. Patch à propager à Métriques V1.4 § 4.3 — consigné en liste de patches groupés (Section 11.3).

**Écart 2 — Nombre de sessions par jour.** Le V0 propose 3 sessions par jour (matin / midi / soir) avec validation indépendante de chaque session. La V1 conserve **3 sessions/jour pour S1 spécifiquement** parce qu'elles structurent la journée et donnent du rythme. Cette structure 3 sessions/jour n'est pas systématique sur les 8 piliers — chaque pilier décidera de son rythme propre en cours de production de sa Feature Spec dédiée.

**Écart 3 — Diagnostic 5 niveaux, terminologie.** Le V0 utilise dans certaines parties le mot "Accessible" pour le niveau d'engagement de base. La V1 a tranché sur **"Essentiel"** (voir Métriques V1.4 et Note session V6.0, instruction de production à appliquer dans toutes les Feature Specs piliers). Toute occurrence de "Accessible" dans la matière V0 est à lire comme "Essentiel" dans la V1.

D'autres écarts secondaires émergent en cours de production des sections suivantes — ils sont documentés au fil de l'eau dans la section correspondante et récapitulés en Section 11 (zones résiduelles).

### 0.4 — Statut et conventions

**Statut du document.** V0.1 désigne le draft itératif courant. Chaque livraison de section incrémente la version interne (V0.2, V0.3, etc.). Une fois les 11 sections + annexe livrées et validées par Stéphane, le document passe en V1.0 stable. Le nom de fichier est `raw-adventure-feature-spec-pilier-s1-respiration.md` (convention Option A actée, nom stable, contenu versionné en interne).

**Sources autoritaires.** En cas de conflit entre le V0 Jacky et un document de cadrage stable, le cadrage prime. Hiérarchie : Synthèse V8 (décisions D1 à D41) > Métriques V1.4 > Information Architecture V1 > Feature Spec V1 Socle minimum > Schéma de données V1 > matière V0 Jacky (matière source, pas spec finale).

**Format pour Claude Code.** Tout ce qui est mécanique (12 questions, mapping diagnostic, paramètre principal, durées de session, conditions de validation streak, structure des écrans IA-40 à IA-47) est codable sans interprétation. Tout ce qui est copy reste en placeholder `copy.IA-XX.nom-du-slot` jusqu'à livraison du Brief contenu V1. Tout ce qui est média reste en placeholder `media.IA-XX.nom-de-l-asset` jusqu'à tournage Mimi & Jacky.

**Renvois aux docs de cadrage.** Quand une mécanique est déjà tranchée ailleurs, renvoi court plutôt que duplication (par exemple : "voir Métriques V1.4 § 2.5 pour la règle D40"). L'objectif est d'éviter que la Feature Spec dérive si un doc de cadrage évolue.

---

## Section 1 — Vision pédagogique

### 1.1 — Ce que travaille ce pilier

S1 Respiration ouvre la Phase 1 sur le levier physiologique le plus universel et le plus immédiatement modifiable du corps humain. Tout le monde respire, en permanence, sans y penser. C'est précisément ce caractère automatique qui en fait un terrain d'expérimentation idéal pour entrer dans le travail de la vitalité : la respiration est à la fois entièrement involontaire (elle continue pendant le sommeil) et entièrement modifiable à la conscience (en quelques secondes, on peut la ralentir, la diriger, la stabiliser). Cette double propriété — automatique et modifiable — est ce qui fait que le ressenti d'un changement arrive vite, en 3 à 5 jours selon la matière Jacky, et que la pédagogie peut faire vivre le pilier avant de l'expliquer (principe directeur 2 du Product Vision : le ressenti prime sur la théorie).

L'objectif de la semaine n'est pas d'apprendre une technique compliquée. C'est de revenir à une respiration plus simple, plus basse, plus nasale, plus consciente. Le travail porte sur quatre axes physiologiques imbriqués : ralentir le rythme respiratoire au repos, restaurer la respiration nasale comme voie par défaut, mobiliser le diaphragme pour respirer ventre plutôt que poitrine, calmer le système nerveux par la régulation du rythme. Ces quatre axes ne sont pas découpés en quatre journées thématiques — ils s'entrelacent dans le programme jour par jour qui sera détaillé en Section 4.

### 1.2 — Pourquoi commencer par la respiration

Position narrative déjà actée dans la Section 0 et reformulée ici pour la vision pédagogique. La respiration est la base parce qu'elle régule tout le reste — formulation Jacky validée dans la matière V0 et dans le Brief contenu Session 3. Trois leviers concrets justifient l'ouverture par S1 plutôt que par un autre pilier. Premièrement, la respiration produit un effet ressenti rapide : un utilisateur qui pratique 5 minutes de cohérence cardiaque sent une différence dans son état nerveux quasi-immédiatement. Cela installe la mécanique "j'expérimente, je ressens, je continue" dès la première semaine. Deuxièmement, la respiration est neutre identitairement : elle ne demande pas de changer d'alimentation, de bouger plus, de se confronter à ses pensées. C'est le pilier le moins clivant pour ouvrir, ce qui maximise le taux de complétion de la première semaine de Phase 1 (KPI critique pour la suite du parcours). Troisièmement, la respiration prépare le terrain pour les piliers suivants : un système nerveux mieux régulé rend l'activité physique (S2), l'alimentation consciente (S3) et la connexion au vivant (S4) plus accessibles.

### 1.3 — Posture pédagogique de la semaine

La semaine S1 ne fonctionne pas comme un cours sur la respiration. Pas de théorie déposée en bloc, pas d'exposé physiologique exhaustif. La posture est l'expérimentation dirigée : à chaque session, l'utilisateur reçoit une consigne courte, la pratique, observe son état avant et après. La pédagogie de fond (pourquoi le nez plutôt que la bouche, pourquoi le ventre plutôt que les épaules, qu'est-ce que le système nerveux autonome) est distillée en micro-doses dans le copy quotidien, dans les vidéos courtes, dans les messages de fin de session — jamais en bloc. Cette posture est cohérente avec le principe directeur 1 (l'utilisateur ne doit pas réfléchir, il est guidé) et le principe directeur 4 (moins d'une minute par jour en routine — la lecture pédagogique tient en quelques lignes, la session occupe le temps majeur).

### 1.4 — Sources de matière pédagogique

Pour la rédaction du copy et des scripts vidéo en Brief contenu V1, Mimi & Jacky disposent de trois sources. Annexe C.1 de Métriques V1.4 (matière clinique brute sur la respiration). Fichier V0 `V0_PILIER_1___RESPIRATION.docx` (940 lignes : programme jour par jour, notifications-types, messages de session, fin de semaine). Annexe D de Métriques V1.4 (matière copy brute : phrase régression, citations pédagogiques transversales). La Feature Spec S1 ne reproduit pas cette matière — elle s'y réfère et balise les slots de copy à produire dans la Section 7.

---

## Section 2 — Évaluation initiale du pilier (IA-40)

### 2.1 — Cadre commun de l'évaluation

L'évaluation initiale du pilier est portée par l'écran **IA-40** (voir Information Architecture V1 § Phase 1). Format invariant pour les 8 piliers : séquence de **12 écrans**, une question par écran, échelle de réponse **1 à 5** où 1 = "jamais / très loin de moi" et 5 = "toujours / très proche de moi". Calcul d'un **score brut sur 60** par addition simple des 12 réponses. Normalisation sur l'échelle 0-100 par la formule `score_branche_0_100 = (score_brut - 12) × (100 / 48)` pour alimenter la branche correspondante de la toile dans son état "avant S" (un score brut de 12 correspond à 0 sur la toile, un score brut de 60 à 100). Toute la mécanique transverse est cadrée dans Métriques V1.4 § 2.1 à 2.3 et dans IA V1 sur IA-40 — non redocumentée ici.

Une particularité non-négociable de la mécanique : les 12 questions de l'évaluation **initiale** sont **strictement les mêmes** que celles de l'évaluation **finale** (IA-46) du même pilier. Cela permet le calcul direct d'un différentiel honnête en sortie de semaine (Métriques V1.4 § 2.6 et § 2.7). Conséquence pratique : les 12 questions livrées ci-dessous sont à coder une seule fois et réutilisées à l'identique en IA-46.

### 2.2 — Les 12 questions de l'évaluation S1 Respiration

Questions reprises intégralement de la matière V0 Jacky (`V0_PILIER_1___RESPIRATION.docx` § 3), validées implicitement par la stabilité de Métriques V1.4 sur ce pilier. Numérotation Q1 à Q12 dans l'ordre d'apparition à l'écran.

| # | Énoncé de la question | Slot copy |
|---|---|---|
| Q1 | Ma respiration est calme et lente au repos. | `copy.IA-40.s1.q1` |
| Q2 | Je respire principalement par le nez dans la journée. | `copy.IA-40.s1.q2` |
| Q3 | Je respire par le nez pendant la nuit. | `copy.IA-40.s1.q3` |
| Q4 | Ma respiration se fait naturellement dans le ventre. | `copy.IA-40.s1.q4` |
| Q5 | Mes épaules restent détendues quand je respire. | `copy.IA-40.s1.q5` |
| Q6 | Je ressens parfois le besoin de respirer fort ou profondément. | `copy.IA-40.s1.q6` |
| Q7 | Je soupire ou bâille souvent sans raison claire. | `copy.IA-40.s1.q7` |
| Q8 | Je me sens parfois à court d'air ou oppressé. | `copy.IA-40.s1.q8` |
| Q9 | Je récupère rapidement mon souffle après un effort léger. | `copy.IA-40.s1.q9` |
| Q10 | Ma respiration m'aide à me calmer quand je suis stressé. | `copy.IA-40.s1.q10` |
| Q11 | Je suis conscient de ma respiration dans la journée. | `copy.IA-40.s1.q11` |
| Q12 | Je peux ralentir volontairement ma respiration sans inconfort. | `copy.IA-40.s1.q12` |

**Point d'attention sémantique à signaler.** Les questions Q6, Q7 et Q8 sont formulées en sens **inverse** des autres (un score 5 signifie une respiration *moins* fonctionnelle, pas plus). Q6 : ressentir le besoin de respirer fort/profondément est un signe de respiration superficielle. Q7 : soupirs et bâillements fréquents sont des signes d'hypoventilation chronique. Q8 : sensation d'oppression est un signe direct. Pour que le score brut sur 60 ait du sens (plus on est haut, plus la respiration est fonctionnelle), il faut **inverser ces trois réponses au calcul** : réponse réelle de l'utilisateur → score utilisé = 6 - réponse. Exemple : si l'utilisateur répond 4 à Q6, le score utilisé pour cette question est 2. À implémenter explicitement en code. Slots à marquer `reversed: true` dans la structure de données. À acter en Section 9.

*Note méthodologique.* Ce point n'apparaît pas explicitement dans la matière V0 ni dans Métriques V1.4 § 2 — c'est un point de cohérence interne identifié à la lecture des 12 questions S1. Si l'équipe Jacky valide l'inversion, on l'applique. Si elle préfère garder les questions telles quelles sans inversion, il faudra reformuler Q6/Q7/Q8 dans le sens positif (par exemple Q6 → "Ma respiration au repos est suffisamment ample sans que j'aie à forcer"). À acter au moment de la relecture S1 ou de la production Brief contenu V1. Inscrit en zone résiduelle Section 11.

### 2.3 — Mapping vers le diagnostic 5 niveaux S1

Le score brut sur 60 est mappé vers un **diagnostic à 5 niveaux** avec libellés narratifs spécifiques au pilier. Source autoritaire : Métriques V1.4 § 2.4 (ligne S1, version finale validée par Jacky le 12 mai 2026).

**Libellés narratifs S1 (Métriques V1.4).**

| Niveau diagnostic | Libellé narratif S1 | Slot copy |
|---|---|---|
| 1 | Coûteuse | `copy.IA-41.s1.diagnostic-1-libelle` |
| 2 | Instable | `copy.IA-41.s1.diagnostic-2-libelle` |
| 3 | Respi en mode adaptation | `copy.IA-41.s1.diagnostic-3-libelle` |
| 4 | Fonctionnelle | `copy.IA-41.s1.diagnostic-4-libelle` |
| 5 | Régulatrice | `copy.IA-41.s1.diagnostic-5-libelle` |

**Note d'écart V0 → V1 sur l'ordre.** Le V0 plaçait "respiration en mode adaptation" en niveau 1 (Très faible). Métriques V1.4 a permuté : le niveau 3 (médian) est "respi en mode adaptation". L'idée pédagogique sous-jacente : une respiration qui s'adapte est un état intermédiaire — ni catastrophique ("Coûteuse" en niveau 1, le corps lutte) ni stable ("Fonctionnelle" en niveau 4). La V1.4 affine la gradation et est la version retenue.

**Seuils de score brut /60 → diagnostic 5 niveaux.** Les bornes ne sont pas explicitement gravées dans Métriques V1.4 — la pratique standard pour un score brut sur 60 avec 5 niveaux est un découpage en quintiles équilibrés. Application proposée :

| Plage score brut /60 | Diagnostic | Plage score normalisé 0-100 |
|---|---|---|
| 12 à 21 | Niveau 1 — Coûteuse | 0 à 19 |
| 22 à 30 | Niveau 2 — Instable | 20 à 39 |
| 31 à 40 | Niveau 3 — Respi en mode adaptation | 40 à 59 |
| 41 à 50 | Niveau 4 — Fonctionnelle | 60 à 79 |
| 51 à 60 | Niveau 5 — Régulatrice | 80 à 100 |

Ces seuils sont symétriques (5 plages de 9 à 10 points chacune), simples à coder et reproductibles à l'identique sur les 8 piliers. À valider en relecture comme convention transverse — si Jacky veut un découpage différent (par exemple pondérer plus fortement les niveaux bas pour ne pas surestimer les utilisateurs), il pourra patcher pilier par pilier en Brief contenu V1.

### 2.4 — Affichage du diagnostic en IA-41

L'écran de récapitulatif d'évaluation initiale **IA-41** affiche le **libellé narratif du diagnostic** (par exemple "Ta respiration est actuellement en mode adaptation"), **pas le score brut chiffré**. C'est cadré par Métriques V1.4 § 2.4 : le diagnostic est l'objet pédagogique perçu par l'utilisateur, le score brut reste un calcul interne utile uniquement pour alimenter la branche de la toile et appliquer la règle D40.

Le libellé narratif est complété par un **message d'accueil pédagogique** propre au niveau de diagnostic, à produire en Brief contenu V1. Slots `copy.IA-41.s1.diagnostic-{1..5}-message`. Posture : direct, sans dramatisation pour les niveaux bas, sans flagornerie pour les niveaux hauts (cohérent avec D38 — honnêteté pédagogique radicale, Synthèse V8).

### 2.5 — Données persistées

À la fin de l'évaluation initiale IA-40, écriture dans la table `pillar_evaluations` selon Schéma de données V1 § 4.2 et § 5.3. Champs : `user_id`, `pillar_id = 1`, `evaluation_type = 'initial'`, `responses` (array des 12 réponses brutes 1-5), `raw_score` (score brut /60), `normalized_score` (score normalisé 0-100), `diagnostic_level` (1 à 5), plus les champs `engagement_level_recommended` et `engagement_level_chosen` produits à la sortie d'IA-41 (voir Section 3). Pas d'écriture spécifique au pilier S1 au-delà de cette structure standard.

---

## Section 3 — Diagnostic et niveau d'engagement de départ (IA-41)

### 3.1 — Application de la règle D40

À la sortie de l'évaluation 12 questions (IA-40), l'app calcule le diagnostic 5 niveaux selon Section 2.3 puis applique la **règle D40** (Synthèse V8, Métriques V1.4 § 2.5) pour proposer un engagement de départ automatique. Règle invariante sur les 6 piliers Type A, donc applicable à S1 sans particularité.

| Diagnostic S1 | Engagement de départ recommandé |
|---|---|
| 1 — Coûteuse | Essentiel |
| 2 — Instable | Essentiel |
| 3 — Respi en mode adaptation | Essentiel |
| 4 — Fonctionnelle | Progression |
| 5 — Régulatrice | Progression |

**Plafond Immersion.** Personne ne démarre automatiquement en Immersion en Phase 1, jamais. L'utilisateur doit choisir explicitement Immersion via le bouton "Modifier mon niveau" en IA-41 (modale `IA-41.modale-niveau`). Cette règle est cohérente avec l'intention pédagogique de Jacky : éviter que les utilisateurs qui se surestiment au questionnaire (Annexe D.3 de Métriques V1.4 — citation "les gens se surévaluent") soient propulsés dans une intensité qu'ils n'auront pas la capacité d'absorber. Le passage en Immersion reste possible mais c'est un acte délibéré de l'utilisateur.

**Posture sur le déclassement potentiel Phase 0 → Phase 1.** Un utilisateur qui s'était positionné à un niveau élevé en Phase 0 (via le profil onboarding ou la matrice 8×8) peut se retrouver déclassé en Essentiel en S1 si son diagnostic 12 questions est dans les niveaux 1-2-3. C'est une intention pédagogique assumée (Métriques V1.4 § 2.6, D38 honnêteté pédagogique radicale). Le copy du diagnostic doit accompagner ce déclassement sans dramatiser ni minimiser — slot `copy.IA-41.s1.message-declassement-phase0` à produire en Brief contenu V1 si on veut un message dédié, sinon le message standard du diagnostic 1-2-3 suffit.

### 3.2 — Modification manuelle du niveau d'engagement

L'utilisateur peut modifier manuellement son niveau d'engagement avant de démarrer la semaine, depuis l'écran IA-41 (bouton "Modifier mon niveau" qui ouvre une mini-modale `IA-41.modale-niveau`). Trois choix proposés : Essentiel, Progression, Immersion. Le choix final est persisté dans `pillar_evaluations.engagement_level_chosen` (Schéma de données V1 § 5.4).

Le niveau peut également être modifié plus tard depuis l'écran de vue d'ensemble du pilier (IA-42, voir Section 5). C'est-à-dire que l'utilisateur n'est pas figé sur son choix initial — il peut monter ou descendre en cours de semaine. Cette flexibilité est distincte du bouton niveau adaptatif IA-44 qui module une session ponctuelle sans changer le niveau d'entrée (voir Section 5.2).

**Affichage IA-41.** Quand le niveau d'engagement affiché est le niveau recommandé par défaut, libellé "Niveau Essentiel — recommandé" (ou Progression). Quand l'utilisateur a modifié manuellement, libellé "Niveau Progression — choisi" (ou Essentiel / Immersion). Détail de l'affichage cadré dans Feature Spec V1 Socle minimum § 4.1.

### 3.3 — Paramètre principal du pilier S1

Le paramètre principal du pilier S1 est la **durée d'une session de cohérence cardiaque** (voir Section 0 — Écart 1 patché, à propager à Métriques V1.4 § 4.3 dans les patches groupés en fin de production).

| Niveau d'engagement | Durée d'une session |
|---|---|
| Essentiel | 5 minutes |
| Progression | 10 minutes |
| Immersion | 20 minutes |

Calibrage aligné posture Sadhguru et durées pivots des pratiques respiratoires guidées. 5 minutes est la dose standard de cohérence cardiaque (durée minimale d'efficacité physiologique sur la variabilité cardiaque). 10 minutes double la dose pour les profils engagés. 20 minutes installe une vraie pratique respiratoire pour les profils en Immersion.

**Mécanique de session.** Une session de cohérence cardiaque suit le rythme respiratoire standard 6 cycles par minute (5 secondes d'inspiration / 5 secondes d'expiration). C'est le rythme reconnu cliniquement comme entrant en résonance avec le système cardiaque et activant le système parasympathique. À 6 cycles par minute :

| Niveau | Durée | Nombre de cycles respiratoires |
|---|---|---|
| Essentiel | 5 min | 30 cycles |
| Progression | 10 min | 60 cycles |
| Immersion | 20 min | 120 cycles |

Le rythme 6 cycles/minute est invariant — c'est la durée qui module. Pas d'autres paramètres respiratoires modifiables en V1 (rythme alternatif, rétention, etc.). Si Jacky veut introduire des variations rythmiques en V2, ce sera un patch dédié.

**Note d'implémentation.** Le timer de session doit être visible à l'écran (compte à rebours ou progression circulaire) avec une indication visuelle ou sonore du rythme inspiration/expiration. Détail visuel à cadrer en Charte graphique et Brief contenu V1, mais le principe est que l'utilisateur n'a **pas à compter mentalement** — l'app guide le rythme. Cohérent avec le principe directeur 1 (l'utilisateur ne doit pas réfléchir).

### 3.4 — Cumul journalier selon le niveau d'engagement

Le programme S1 prévoit **3 sessions par jour** (matin / midi / soir — détaillé en Section 4). Cumul journalier selon le niveau d'engagement :

| Niveau | Durée d'une session | Sessions/jour | Cumul journalier | Cumul hebdomadaire |
|---|---|---|---|---|
| Essentiel | 5 min | 3 | 15 min/jour | 1h45/semaine |
| Progression | 10 min | 3 | 30 min/jour | 3h30/semaine |
| Immersion | 20 min | 3 | 1h/jour | 7h/semaine |

Le cumul Immersion est ambitieux (1h/jour de respiration dirigée). C'est cohérent avec l'intention : Immersion est un choix délibéré de l'utilisateur qui veut s'engager pleinement. La règle D40 plafonnant l'engagement de départ automatique à Progression garantit que personne n'arrive à 1h/jour sans l'avoir explicitement voulu.

### 3.5 — Affichage IA-41 du paramètre principal

IA-41 affiche le paramètre principal de manière concrète et lisible, pas en jargon technique. Format proposé pour le slot principal du récapitulatif :

> "Cette semaine, tu pratiqueras 3 sessions de cohérence cardiaque par jour, de 5 minutes chacune."

Le chiffre 5 (ou 10, ou 20) est dynamique selon le niveau d'engagement choisi. Slot `copy.IA-41.s1.parametre-principal-message` à produire en Brief contenu V1 avec variables `{nombre_sessions}` et `{duree_session}`.

### 3.6 — Données persistées à la sortie d'IA-41

Mise à jour de la ligne `pillar_evaluations` (Schéma de données V1 § 5.3 et § 5.4) avec deux champs supplémentaires : `engagement_level_recommended` (issu de la règle D40, valeurs `'essentiel'` ou `'progression'`) et `engagement_level_chosen` (valeur effective après modification éventuelle de l'utilisateur, valeurs `'essentiel'`, `'progression'`, `'immersion'`). Au tap sur "Démarrer cette semaine" en IA-41, l'app passe en état `phase_1` avec `currentPilar = 1` et pose `pilarStartedAt = now()` (Feature Spec V1 Socle minimum § 2.1).

---

## Section 4 — Programme jour par jour (J1 à J7)

### 4.1 — Structure quotidienne invariante

Chaque jour de la semaine S1 suit la même structure utilisateur. Cette structure quotidienne est un pattern réutilisable pour les 5 autres piliers Type A (S2, S3, S4, S6, S8 — la structure peut différer sur S5 et S7 Type B). Elle est portée par l'écran IA-43 (Écran de session Phase 1, voir IA V1).

À l'ouverture de l'app sur un jour de S1, l'utilisateur arrive sur l'accueil IA-11 en mode Phase 1, qui affiche pour la journée : le titre du jour (par exemple "Jour 3 — Ouvrir les côtes"), l'objectif du jour en une phrase, l'état d'avancement des 3 sessions (matin / midi / soir, validées ou non), un bouton "Lancer ma session" qui ouvre IA-43. Le détail visuel de IA-11 en mode Phase 1 sera cadré en Feature Spec V1 Socle minimum si pas déjà fait, sinon en patch de production S1.

**Écran de session (IA-43).** Affiche le titre et l'objectif du jour, une courte explication pédagogique (le pourquoi de la consigne du jour, 1 à 3 phrases max), le timer paramétré à la durée du niveau d'engagement courant (5/10/20 min), le rythme respiratoire visualisé (6 cycles/minute, 5 secondes inspiration / 5 secondes expiration). Pendant la session, l'utilisateur n'a rien à faire d'autre que suivre le rythme. À la fin du timer, message de fin de session court (slot `copy.IA-43.s1.fin-session`), validation automatique de la session, retour à IA-11 mis à jour (X/3 sessions validées).

**Trois sessions par jour : matin / midi / soir.** L'utilisateur est libre de l'horaire effectif de chacune des sessions. Les libellés matin/midi/soir sont indicatifs et structurent la journée — ils ne déclenchent pas de notification d'horaire précis (les notifications sont cadrées en Section 8). Validation d'une session : soit lancée avec le timer in-app et arrivée à terme, soit cochée manuellement si la pratique a été faite hors-app. Le mode "coché manuellement" est conservé pour respecter le principe directeur "l'utilisateur ne doit pas être empêché" — quelqu'un qui pratique 5 min de cohérence cardiaque sans avoir besoin de l'app valide quand même sa session.

### 4.2 — Écarts V0 → V1 sur la structure quotidienne

Trois éléments du V0 sont **écartés** dans la V1 conformément aux décisions Synthèse V8.

**Score quotidien (V0 § 11) écarté.** Le V0 propose un "Score de présence respiratoire" calculé quotidiennement avec pondération sessions/minutes/ressenti. **D34 (Synthèse V8) : pas de score quotidien V1.** Donc pas de score quotidien S1. Le seul score qui compte en V1 est le score brut /60 de l'évaluation initiale et finale (Section 2). À reconsidérer pour V2 si la mécanique d'évaluation continue est ajoutée.

**Ressenti du jour (V0 § 10) écarté.** Le V0 propose 3 micro-questions de fin de journée (calme/énergie/respiration). **D36 (Synthèse V8) : pas de questionnaire fin de journée V1.** Donc pas de micro-questions de fin de journée en S1. Le ressenti est observé par l'utilisateur sans capture structurée par l'app. À reconsidérer V2 si on veut introduire un journal d'auto-observation.

**Checklist quotidienne 6 cases (V0 § 9) partiellement écartée.** Le V0 propose 6 cases à cocher (3 sessions + respiration nasale + observation calme + observation énergie). En V1, seules les **3 cases de session** (matin/midi/soir) sont tracées. Les 3 cases d'observation tombent par la conséquence de D36 (pas de questionnaire fin de journée). Cohérent aussi avec le principe directeur 4 (moins d'une minute par jour en routine — alourdir la checklist serait contre-productif).

### 4.3 — Programme des 7 jours

Le programme suit une progression pédagogique cohérente : J1-J2 fondations (le nez, le ventre), J3-J4 expansion (côtes puis respiration complète), J5-J6 affinement (douceur puis sensation), J7 intégration (trouver son optimum). Cette progression est **invariante quel que soit le niveau d'engagement** — c'est la durée des sessions qui varie selon Essentiel/Progression/Immersion, pas le contenu pédagogique des journées.

| Jour | Titre | Objectif | Pédagogie de fond | Slot copy explication |
|---|---|---|---|---|
| J1 | Respirer par le nez | Inspirer et expirer uniquement par le nez. | Le nez filtre, humidifie et régule l'air. On commence par retrouver la voie naturelle de la respiration. | `copy.IA-43.s1.j1-explication` |
| J2 | Sentir le ventre | Respirer dans le ventre. | Quand le ventre bouge doucement, le diaphragme travaille. C'est une base essentielle pour sortir d'une respiration haute et tendue. | `copy.IA-43.s1.j2-explication` |
| J3 | Ouvrir les côtes | Ventre + ouverture latérale des côtes. | Les côtes doivent pouvoir s'ouvrir. Plus l'espace respiratoire est disponible, moins le corps a besoin de forcer. | `copy.IA-43.s1.j3-explication` |
| J4 | Respiration complète | Ventre + côtes + clavicules. | Aujourd'hui, exploration de toute la capacité respiratoire : la respiration descend, s'ouvre sur les côtés, puis monte légèrement vers les clavicules. | `copy.IA-43.s1.j4-explication` |
| J5 | Respiration douce | Ralentir, adoucir, rendre la respiration silencieuse. | Respirer plus fort n'est pas toujours mieux. Une respiration douce permet souvent au système nerveux de se réguler plus profondément. | `copy.IA-43.s1.j5-explication` |
| J6 | Sentir le passage de l'air | Sentir le trajet de l'air. | Observer le passage de l'air : nez, gorge, cage thoracique, ventre. On ne contrôle pas, on ressent. | `copy.IA-43.s1.j6-explication` |
| J7 | Trouver ton optimum | Trouver la respiration la plus ample possible, tout en restant confortable. | La respiration optimale n'est pas la plus grande. C'est celle qui reste ample, fluide, stable et confortable. | `copy.IA-43.s1.j7-explication` |

**Note sur le J7.** Le jour 7 est aussi le jour de l'évaluation finale (IA-46). Hypothèse de séquence : matin = session, midi = session, soir = évaluation finale (en remplacement de la 3e session) ou session puis évaluation. À acter en Section 6.

**Note sur la cohérence cardiaque pratiquée.** La pratique quotidienne reste **la cohérence cardiaque au rythme 6 cycles/minute** (Section 3.3), quelle que soit la consigne pédagogique du jour. La consigne du jour est une **focale d'attention** posée sur la pratique (le nez en J1, le ventre en J2, les côtes en J3, etc.), pas une technique respiratoire alternative. C'est un point important pour Claude Code : le timer et le rythme respiratoire ne changent pas d'un jour à l'autre. Seul le titre, l'objectif et la phrase d'explication changent.

### 4.4 — Validation d'une session

À la fin du timer de session ou au tap sur "Marquer comme faite" (mode manuel), écriture dans la table `pillar_sessions` selon Schéma de données V1 § 4.3 et § 5.5 : `user_id`, `pillar_id = 1`, `day_in_week` (1 à 7), `session_index` (1 = matin, 2 = midi, 3 = soir), `local_date`, `completed_at`, `duration_seconds` (durée effective de la session — utile si l'utilisateur change de niveau en cours de semaine et que les sessions ont des durées variables).

Message de fin de session court affiché à l'utilisateur (slot `copy.IA-43.s1.fin-session` — proposition V0 conservée : "Session validée. Ton système vient de recevoir un signal de calme."). Pas de dramatisation, pas de pression vers la session suivante.

### 4.5 — Validation de la journée et streak

**Règle de validation de la journée pour S1 en Phase 1 : au moins 1 session sur 3 valide la journée.** C'est cohérent avec la règle générale Phase 1 (Schéma de données V1 § 5.2 — "Cas Phase 1 — au moins 1 session sur 3"). Conséquence : un utilisateur qui ne fait qu'une seule de ses 3 sessions garde son streak. Un utilisateur qui fait 0 session sur 3 casse son streak (sauf joker, mais le joker est cadré en Phase 0 uniquement — à clarifier en Section 11 si le joker s'applique aussi en Phase 1).

L'utilisateur n'a **pas besoin de valider explicitement sa journée** comme en Phase 0 — la validation est implicite à la première session validée. Pas de modale de validation de journée IA-15 en Phase 1, contrairement à la Phase 0. Cette simplification est cohérente avec D34 (pas de score quotidien V1) et avec le principe directeur 4 (moins d'une minute par jour en routine).

**Cas absence d'activité sur une journée complète.** Si l'utilisateur n'a validé aucune session avant minuit local, le streak est cassé au prochain lancement de l'app (mécanique standard Phase 1, à recroiser avec Feature Spec V1 Socle minimum sur la mécanique streak Phase 1).

### 4.6 — Progression visible en cours de semaine

L'accueil IA-11 en mode Phase 1 affiche en permanence : le jour courant (J1 à J7 du pilier), le titre du jour, l'état d'avancement des sessions du jour (par exemple "2/3 sessions"), le streak global, le niveau d'engagement courant. Pas d'autre indicateur de progression — pas de score cumulé semaine, pas de moyenne, pas de classement. La progression visible est binaire au niveau session (faite / pas faite) et journalière au niveau jour (1/7 à 7/7).

**Compteurs internes utiles pour IA-47 (récapitulatif évaluation finale).** Le code persiste les sessions individuelles dans `pillar_sessions` — il pourra dériver à la sortie de S1 : nombre total de sessions réalisées sur la semaine, total de minutes respirées (somme des durées). Ces dérivés sont calculés à la lecture pour l'affichage du récap final, pas stockés en compteur dédié. Cohérent avec Schéma de données V1.

### 4.7 — Cas spécifiques au pilier

**Cas — utilisateur ressent un inconfort pendant la session (vertiges, hyperventilation).** Le V0 propose un message dédié ("Ralentis. La respiration ne doit jamais créer de tension, d'étourdissement ou de besoin de forcer. Reviens à une respiration douce et confortable."). En V1, ce message peut être déclenché : soit au tap sur le bouton niveau adaptatif IA-44 avec choix "Moins" (le message accompagne le passage à durée plus courte), soit via un bouton dédié "Je ressens un inconfort" pendant la session (à arbitrer en Section 7 sur les slots de copy). Hypothèse de travail : le bouton IA-44 suffit en V1, le message dédié inconfort accompagne le choix "Moins" lorsqu'il survient pendant une session.

**Cas — utilisateur change de niveau en cours de semaine.** Permis via IA-41 (re-accessible) ou IA-42. Le changement s'applique aux sessions suivantes uniquement, les sessions déjà validées gardent leur durée d'origine dans `pillar_sessions.duration_seconds`. Le récap IA-47 affichera donc un total de minutes respirées qui reflète les variations effectives, pas une durée théorique.

**Cas — utilisateur reste sur S1 plus de 7 jours sans déclencher l'évaluation finale.** Cadré dans Feature Spec V1 Socle minimum § 2.1 : "L'app reste sur ce pilier. L'accueil affiche un encart de relance à partir du 7e jour (slot `copy.global.relance-evaluation-finale`)." Pas de mécanique spécifique S1.

---

## Section 5 — Mécaniques transverses du pilier

### 5.1 — Niveau adaptatif (modale IA-44)

Le bouton niveau adaptatif IA-44 est une mécanique transverse Phase 0 et Phase 1, cadrée dans IA V1 et Feature Spec V1 Socle minimum. Elle est accessible depuis IA-43 (écran de session) avant le lancement du timer. L'utilisateur peut moduler une session ponctuelle en "Moins / Pareil / Plus" sans changer son niveau d'entrée du pilier (D31 : niveau adaptatif manuel, pas de changement automatique du niveau d'entrée).

**Application sur S1 — durées modulées par "Moins / Pareil / Plus".** Le paramètre modulé est la durée de session. "Pareil" = durée standard du niveau d'engagement courant. "Moins" et "Plus" modulent autour de cette durée standard. Hypothèse de calibrage proposée :

| Niveau d'engagement courant | Moins | Pareil | Plus |
|---|---|---|---|
| Essentiel | 3 min | 5 min | 7 min |
| Progression | 7 min | 10 min | 15 min |
| Immersion | 15 min | 20 min | 25 min |

Calibrage : "Moins" propose une durée intermédiaire entre le niveau courant et le niveau immédiatement inférieur, "Plus" propose une durée intermédiaire entre le niveau courant et le niveau immédiatement supérieur. Sur Essentiel, "Moins" descend à 3 min (la durée Métriques V1.4 initialement prévue, qui sert désormais de plancher pour les utilisateurs en difficulté). Sur Immersion, "Plus" monte à 25 min (la limite haute du calibrage Sadhguru pour les pratiques quotidiennes).

**Posture pédagogique sur l'usage répété de "Moins".** D31 enrichi (IA V1) prévoit la possibilité de messages de suggestion d'adaptation si l'utilisateur enchaîne plusieurs "Moins". Application S1 : si 4 choix "Moins" consécutifs sont enregistrés sur le pilier (lecture des N derniers `level_adaptive_choices` selon Schéma de données V1 § 5.6), un message proposera explicitement à l'utilisateur de revoir son niveau d'engagement en bas. Slot `copy.IA-44.s1.message-suggestion-niveau-bas` à produire en Brief contenu V1. Le changement effectif du niveau reste manuel (D31).

**Posture pédagogique sur l'usage répété de "Plus".** Le V0 (§ 12) propose un message équivalent "Tu peux monter d'un niveau si tu veux approfondir l'expérience" après 3 sessions validées 3 jours d'affilée. Application V1 : si 4 choix "Plus" consécutifs sont enregistrés, message équivalent invitant à monter le niveau d'engagement. Slot `copy.IA-44.s1.message-suggestion-niveau-haut`. À acter avec Mimi & Jacky en Brief contenu V1 ou en relecture S1.

**Données persistées.** Chaque choix dans la modale IA-44 écrit dans `level_adaptive_choices` (Schéma de données V1 § 5.6) : `user_id`, `pillar_id = 1`, `session_id` (référence à la session qui s'apprête à être lancée), `choice` (`'less'` / `'same'` / `'more'`), `chosen_at`. Lecture des N derniers choix pour déclencher les messages de suggestion.

### 5.2 — Modification du niveau d'engagement en cours de semaine

L'utilisateur peut modifier son niveau d'engagement à tout moment pendant la semaine S1, depuis IA-41 (re-accessible) ou IA-42 (vue d'ensemble du pilier en cours). Le changement s'applique aux sessions suivantes uniquement — les sessions déjà validées gardent leur durée d'origine.

**Différence fondamentale avec IA-44.** IA-44 module une session ponctuelle sans changer le niveau d'entrée. IA-41/IA-42 change le niveau d'entrée pour toutes les sessions à venir. Conséquence pratique : l'utilisateur qui prend "Moins" trois fois de suite via IA-44 reste officiellement en Progression, ses sessions Phase 1 sont 7 min mais son niveau d'entrée affiché reste Progression. Pour passer durablement à Essentiel, il faut un changement via IA-41/IA-42.

**Cas — modification du niveau le J6 ou J7.** Permis sans restriction. Le récap final IA-47 reflète l'historique réel des sessions (avec leurs durées effectives), pas une durée théorique. L'évaluation finale 12 questions n'est pas affectée par les changements de niveau — elle porte sur le ressenti de l'utilisateur sur sa respiration, pas sur sa pratique.

### 5.3 — Validation de la journée et règle streak Phase 1

Règle invariante Phase 1 rappelée pour mémoire (cadrée dans Schéma de données V1 § 5.2 et Feature Spec V1 Socle minimum, non redocumentée ici). **Au moins 1 session sur 3 valide la journée.** Validation implicite à la première session faite, pas de modale de validation explicite IA-15 en Phase 1.

**Question du joker en Phase 1.** Le joker hebdomadaire (1 jour raté rattrapé par semaine, sans casser le streak) est cadré explicitement en Phase 0. Son application en Phase 1 est ambiguë dans la matière de cadrage actuelle. Hypothèse de travail pour S1 : le joker continue de s'appliquer en Phase 1 selon la même logique (1 par semaine calendaire, voir Schéma de données V1 § 5.1 et § 5.2). À acter explicitement en Section 11 (zones résiduelles) pour confirmation avec Stéphane et patch éventuel de Feature Spec V1 Socle minimum.

### 5.4 — Récompenses intermédiaires et badges (gamification S1)

Le V0 (§ 13) propose des récompenses intermédiaires aux J3, J5, J7 et des badges spécifiques au pilier ("Respiration nasale", "Diaphragme activé", "Calme installé", "Respiration reconnectée"). **Statut V1 à arbitrer.**

**Position de fond.** La V1 Socle minimum a posé un système de paliers de streak globaux (7j, 15j, 30j, 60j, 100j, 1 an) avec vidéo Mimi & Jacky de 30 secondes au premier franchissement (D29, D30). C'est la gamification principale, transverse à tous les piliers. Ajouter des **badges spécifiques par pilier** est une couche supplémentaire qui n'est pas dans la V1 Socle minimum actuelle. Deux options :

**Option A — V1 minimale : pas de badges spécifiques S1.** On s'en tient au système de paliers de streak globaux. Les "récompenses intermédiaires" J3/J5/J7 du V0 deviennent des **messages pédagogiques** affichés dans IA-43 ou IA-11 ces jours-là, sans badge ni notification spéciale. Cohérent avec le principe directeur 3 (simplicité extrême). Recommandation : retenir cette option pour la V1.

**Option B — Badges spécifiques par pilier dès la V1.** Système de badges par pilier en plus des paliers de streak globaux. Implique de spécifier la mécanique d'attribution (par exemple "Respiration nasale" = 3 jours avec sessions validées), le stockage des badges, l'écran de galerie des badges par pilier. Reportable en V2 sans bloquer la V1.

**Décision proposée par défaut : Option A.** S1 retient les **messages pédagogiques J3, J5, J7** du V0 comme micro-événements narratifs dans IA-43, pas comme badges. Slots :
- `copy.IA-43.s1.message-j3` — "Premier calme respiratoire débloqué."
- `copy.IA-43.s1.message-j5` — "Système nerveux apaisé."
- `copy.IA-43.s1.message-j7` — "Pilier respiration complété."

Ces messages s'affichent en sortie de session le jour correspondant, pas en notification push. Reformulation possible par Mimi & Jacky en Brief contenu V1 si le ton ne convient pas.

Pas de système de badges spécifiques par pilier en V1. À reconsidérer en V2 si l'observation utilisateur révèle une attente forte de gamification par pilier.

### 5.5 — Récap des mécaniques transverses S1

Table de synthèse pour Claude Code et pour la relecture.

| Mécanique | Écran | Source autoritaire | Statut V1 |
|---|---|---|---|
| Niveau adaptatif Moins/Pareil/Plus | IA-44 | IA V1 + D31 + Schéma de données V1 § 5.6 | Calibrage S1 acté Section 5.1 |
| Suggestion adaptation après N "Moins" | IA-44 | D31 enrichi | Hypothèse N=4, à confirmer en Brief contenu V1 |
| Modification du niveau d'engagement | IA-41 / IA-42 | Schéma de données V1 § 5.4 | Acté |
| Validation journée (1 session sur 3) | IA-43 | Schéma de données V1 § 5.2 | Acté |
| Joker Phase 1 | — | Schéma de données V1 § 5.2 | **À clarifier — zone résiduelle Section 11** |
| Paliers de streak globaux | IA-50 / IA-51 | Feature Spec V1 Socle minimum + D29 D30 | Transverse, non spécifique S1 |
| Badges par pilier | — | Non cadré | **Reporté V2** (Option A retenue) |

---

## Section 6 — Évaluation finale et progression visible (IA-46 et IA-47)

### 6.1 — Déclenchement de l'évaluation finale

L'évaluation finale IA-46 est proposée à l'utilisateur au **matin du jour 7 du pilier** (Information Architecture V1, transition entrante IA-11 → IA-46 ou IA-42 → IA-46). Le déclenchement repose sur le compteur `currentDayInPilar` calculé à partir de `pilarStartedAt` (Feature Spec V1 Socle minimum § 2.1). Concrètement, dès l'ouverture de l'app le 7e jour calendaire après le démarrage du pilier, l'accueil IA-11 affiche un encart "Faire mon évaluation finale Respiration" qui mène à IA-46.

**Articulation avec la 3e session du J7.** Le J7 est aussi un jour de pratique selon la Section 4.3 — l'utilisateur a 3 sessions à faire dans la journée. L'évaluation finale ne **bloque pas** les sessions du J7 et n'est pas conditionnée à leur validation. Hypothèse de séquence souple : l'utilisateur peut faire ses sessions et son évaluation finale dans n'importe quel ordre dans la journée. L'évaluation finale prend environ 2-3 minutes (12 questions sur écran).

**Cas — utilisateur n'a pas fait toutes ses sessions sur la semaine.** L'évaluation finale est proposée quand même. Pas de blocage, pas de rattrapage. Cohérent avec D38 (honnêteté pédagogique radicale) : l'utilisateur affronte son ressenti réel après une semaine partielle, sans que l'app le culpabilise ni masque la réalité.

**Cas — utilisateur reste sur S1 au-delà du J7 sans faire son évaluation finale.** L'accueil affiche un encart de relance à partir du 7e jour (slot `copy.global.relance-evaluation-finale` cadré dans Feature Spec V1 Socle minimum § 2.1). L'app reste sur le pilier S1, pas de transition automatique vers S2. L'utilisateur est libre de faire son évaluation finale au J7, J8, J10 ou plus tard — sa progression vers S2 dépend de l'évaluation finale.

### 6.2 — Format de l'évaluation finale (IA-46)

Format **strictement identique à l'évaluation initiale IA-40** : 12 écrans, une question par écran, échelle 1 à 5, score brut sur 60, normalisation 0-100. Les 12 questions sont **les mêmes** que celles de IA-40 (voir Section 2.2) — c'est non-négociable pour permettre le calcul direct d'un différentiel honnête (Métriques V1.4 § 2.6).

Conséquence d'implémentation : Claude Code peut **réutiliser le composant écran de question** d'IA-40 pour IA-46. Seul le contexte d'appel change (initial vs final). Cohérent avec Feature Spec V1 Socle minimum (composant unique paramétré).

Les 12 questions sont à coder en référence à une **constante unique** (par exemple `S1_EVALUATION_QUESTIONS` dans le code) chargée par IA-40 et IA-46 indifféremment. Pas de duplication.

### 6.3 — Calcul du différentiel

À la fin de l'évaluation finale, l'app calcule le score brut final, le score normalisé final et le diagnostic final 5 niveaux selon les mêmes règles que l'évaluation initiale (Section 2.3). Trois objets sont alors disponibles pour l'affichage en IA-47 :

**Score normalisé initial** (lu depuis `pillar_evaluations.normalized_score` ligne `evaluation_type='initial'` du pilier 1).
**Score normalisé final** (calculé à la sortie d'IA-46).
**Différentiel** = score final - score initial, exprimé en points (par exemple "+12 points" ou "-3 points").

**Mapping du différentiel vers une lecture qualitative** (Métriques V1.4 § 2.6 et § 2.7). Trois cas avec seuil à ±3 points (acté V1.3 en relecture solo Stéphane).

| Cas | Condition | Lecture qualitative |
|---|---|---|
| Progression positive | différentiel > +3 points | Progression réelle ressentie. La branche pousse visuellement. |
| Progression nulle | différentiel entre -3 et +3 points | Stabilité. La branche reste stable. Pas d'invention de progression. |
| Régression | différentiel < -3 points | Retour pédagogique honnête. La branche peut visuellement reculer ou rester stable selon choix visuel à arbitrer en Charte graphique. |

**Saut de diagnostic éventuel.** Indépendamment du différentiel chiffré, si le diagnostic final tombe dans un niveau différent du diagnostic initial (par exemple passage de niveau 2 "Instable" à niveau 3 "Respi en mode adaptation"), l'app affiche un message dédié signalant le saut. Slot `copy.IA-47.s1.saut-diagnostic`.

### 6.4 — Posture pédagogique en cas de régression (D38)

Cas particulier traité explicitement par D38 (Synthèse V8 — honnêteté pédagogique radicale en cas de régression). Si le différentiel est < -3 points, le message affiché en IA-47 doit **reconnaître la régression sans la dramatiser ni la masquer**. Posture acquise : la régression peut signifier soit une dégradation réelle (rare sur une semaine de pratique), soit un effet d'éveil de conscience (l'utilisateur s'est mieux observé qu'au début, donc il s'évalue plus sévèrement). Ce second cas est fréquent et pédagogiquement précieux.

Phrase pédagogique brute Jacky conservée en Annexe D.1 de Métriques V1.4, à reformuler par Mimi & Jacky en Brief contenu V1. Slot `copy.IA-47.s1.message-regression`. Cohérent avec le principe directeur 6 (pas de marketing bien-être creux).

### 6.5 — Affichage de l'évaluation finale (IA-47)

L'écran IA-47 récapitule l'évaluation finale et porte le moment narratif de clôture du pilier. Contenu affiché :

**Score chiffré et différentiel.** Affichage chiffré du différentiel (par exemple "+12 points") et libellé du diagnostic final (par exemple "Ta respiration est maintenant fonctionnelle"). Pas de score brut /60 affiché à l'utilisateur — comme en IA-41, le score brut reste calcul interne.

**Animation de la branche de la toile.** Moment fort de l'écran. La branche S1 de la toile bascule de l'état "avant S" (issu de l'évaluation initiale, en grisé) vers l'état "après S" (issu de l'évaluation finale, en couleur). Animation visible de la branche qui pousse, durée 1-1.5s, easing marqué. Maintien visuel de l'état initial en superposition grisée pour rendre le différentiel lisible (Métriques V1.4 § 1.5 état 3). Cohérent avec l'animation de IA-41 sur la valorisation initiale de la branche (Feature Spec V1 Socle minimum § 4.1).

**Dérivés affichés.** Nombre total de sessions réalisées sur la semaine (compteur dérivé de `pillar_sessions`). Total de minutes respirées (somme des `duration_seconds`). Ces deux dérivés contextualisent le différentiel sans le résumer. Slot `copy.IA-47.s1.dérivés-message` pour formuler ces chiffres dans un message Mimi & Jacky (par exemple "Cette semaine, tu as réalisé 18 sessions et respiré 210 minutes en conscience.").

**Message de clôture Mimi & Jacky.** Slot `copy.IA-47.s1.message-cloture`. Message dense et incarné qui reconnaît le travail fait sur la semaine et pose la portée du levier respiratoire. Posture V0 conservée comme matière source : "Tu as travaillé un levier que la majorité des personnes laisse en automatique toute leur vie. Pendant 7 jours, tu as ralenti, senti, observé et réorganisé ta respiration."

**Bouton de transition vers le pilier suivant.** "Continuer vers S2 Activité physique" — formule exacte à arbitrer en Brief contenu V1, slot `copy.IA-47.s1.bouton-continuer`. Tap sur ce bouton enchaîne sur IA-40 du pilier suivant (évaluation initiale S2) et incrémente `currentPilar` à 2. Pose `pilarStartedAt` pour S2 au moment du tap sur "Démarrer cette semaine" dans IA-41 S2 (pas au tap de transition).

### 6.6 — Écarts V0 → V1 sur l'évaluation finale

**Observation finale 8 questions (V0 § 14) écartée.** Le V0 propose 8 questions narratives en fin de semaine ("Te sens-tu plus calme qu'avant ?", "Ton énergie est-elle plus stable ?", etc.) en plus de l'évaluation finale. Ces 8 questions sont du registre du **journal d'auto-observation**, distinctes des 12 questions auto-déclaratives de l'évaluation finale. **Écartées en V1** par cohérence avec D36 (pas de questionnaire fin de journée V1) et avec le principe directeur 4 (moins d'une minute par jour en routine). En V1, l'évaluation finale 12 questions est le seul instrument de capture en fin de semaine.

Statut V2 : ces 8 questions pourraient devenir un journal d'auto-observation optionnel à la sortie du pilier. À reconsidérer après observation utilisateur V1.

**Comparaison avant/après détaillée (V0 § 15) partiellement intégrée.** Le V0 propose un récap avec 6 indicateurs (score initial, total minutes, nombre de sessions, moyenne calme quotidien, évolution respi haute/basse, énergie avant/après). En V1, 3 indicateurs sont retenus : différentiel chiffré, total de sessions, total de minutes respirées. Les 3 autres (moyenne calme quotidien, évolution haute/basse, énergie avant/après) sont écartés parce qu'ils nécessitent un journal d'auto-observation quotidien non implémenté en V1 (cohérent avec D34 et D36).

**Récompense finale "Respiration reconnectée" (V0 § 16) écartée comme badge.** Le V0 prévoit un badge dédié à la sortie de S1. En cohérence avec la décision Option A (Section 5.4) — pas de badges spécifiques par pilier en V1 — le badge "Respiration reconnectée" n'est pas implémenté. Le message de clôture (Section 6.5) reprend la posture du V0 sans matérialiser un badge. À reconsidérer V2.

### 6.7 — Données persistées à la sortie d'IA-46 et IA-47

Écriture en `pillar_evaluations` selon Schéma de données V1 § 5.7 : `user_id`, `pillar_id = 1`, `evaluation_type = 'final'`, `responses` (array 12 réponses), `raw_score`, `normalized_score`, `diagnostic_level`. Pas d'écriture spécifique à IA-47 — c'est un écran d'affichage qui dérive ses données des deux lignes `pillar_evaluations` (initiale et finale) du pilier S1.

**Mise à jour de la branche de la toile.** La branche S1 dans la toile (IA-25) bascule de manière persistante de l'état "avant S" à l'état "après S" à la sortie d'IA-46. Pas de champ dédié à stocker en base — la lecture se fait à chaque affichage de la toile par requête sur les deux lignes `pillar_evaluations` du pilier (initiale et finale) pour reconstruire les deux états et l'animation différentielle.

### 6.8 — Cas particuliers

**Cas — utilisateur ferme l'app en cours d'évaluation finale.** Reprise au début à la prochaine ouverture (cohérent avec IA-40, Feature Spec V1 Socle minimum). Pas de reprise au milieu.

**Cas — utilisateur tape "Continuer vers S2" puis ferme l'app avant de démarrer S2.** IA-47 ne se rejoue pas. L'accueil IA-11 affiche un encart "Démarrer l'évaluation S2 Activité physique" tant que l'évaluation initiale S2 n'a pas été déclenchée. `currentPilar` est passé à 2, mais `pilarStartedAt` n'est pas encore posé. Cohérent avec le pattern de Feature Spec V1 Socle minimum sur IA-21 et IA-41.

**Cas — utilisateur veut refaire l'évaluation finale.** Non permis en V1. Une seule évaluation finale par pilier. Si l'utilisateur regrette ses réponses, ses choix restent. Cohérent avec D38 (honnêteté pédagogique radicale — pas de bidouille rétrospective).

---

## Section 7 — Slots de copy et de visuels à produire

### 7.1 — Posture éditoriale S1

Cadre transverse rappelé pour les rédacteurs Mimi & Jacky qui produiront le Brief contenu V1. Voix Mimi & Jacky, "on" et "nous" renvoient au duo. Ton dense, direct, crédible, sans marketing bien-être creux, sans emojis dans le copy produit, sans exclamations gratuites. Sur S1 spécifiquement, ton de la matière V0 Jacky bien calibré — beaucoup de slots peuvent être repris quasi tels quels avec un passage de relecture Mimi pour ajustement de ton si nécessaire. Vocabulaire de référence : système nerveux, diaphragme, voie nasale, rythme respiratoire, calme, régulation. À éviter : "respirer mieux" (creux), "magie" (clivant), "secret" (anti-marque), "détox" (réservé à S8).

### 7.2 — Slots de copy à produire pour S1

Liste exhaustive des slots de copy spécifiques au pilier S1. Slots invariants (mêmes mots sur les 8 piliers) non listés ici — ils sont cadrés dans Feature Spec V1 Socle minimum.

| Slot | Section Feature Spec | Posture | Longueur |
|---|---|---|---|
| `copy.IA-40.s1.q1` à `copy.IA-40.s1.q12` | 2.2 | 12 questions auto-déclaratives, déjà rédigées | 1 phrase chacune |
| `copy.IA-41.s1.diagnostic-1-libelle` à `copy.IA-41.s1.diagnostic-5-libelle` | 2.3 | Libellés narratifs courts, déjà cadrés (Coûteuse / Instable / Respi en mode adaptation / Fonctionnelle / Régulatrice) | 2-3 mots chacun |
| `copy.IA-41.s1.diagnostic-1-message` à `copy.IA-41.s1.diagnostic-5-message` | 2.4 | Message pédagogique d'accueil par niveau de diagnostic | 2-3 phrases denses |
| `copy.IA-41.s1.message-declassement-phase0` (optionnel) | 3.1 | Message dédié pour le cas où l'utilisateur arrive d'un niveau élevé Phase 0 et est déclassé en Essentiel | 2 phrases |
| `copy.IA-41.s1.parametre-principal-message` | 3.5 | Annonce du paramètre principal avec variables `{nombre_sessions}` et `{duree_session}` | 1 phrase concrète |
| `copy.IA-41.s1.bouton-demarrer` | — | Libellé bouton "Démarrer cette semaine" — possible reprise du slot invariant Socle minimum | 2-3 mots |
| `copy.IA-43.s1.j1-explication` à `copy.IA-43.s1.j7-explication` | 4.3 | Phrase d'explication pédagogique du jour | 1-3 phrases |
| `copy.IA-43.s1.j1-objectif` à `copy.IA-43.s1.j7-objectif` | 4.3 | Phrase d'objectif du jour | 1 phrase courte |
| `copy.IA-43.s1.fin-session` | 4.4 | Message court affiché en fin de timer de session | 1 phrase |
| `copy.IA-43.s1.message-j3` / `j5` / `j7` | 5.4 | Micro-événements pédagogiques aux jours-clés (Option A retenue) | 1 phrase chacun |
| `copy.IA-44.s1.message-suggestion-niveau-bas` | 5.1 | Suggestion après 4 "Moins" consécutifs | 2 phrases |
| `copy.IA-44.s1.message-suggestion-niveau-haut` | 5.1 | Suggestion après 4 "Plus" consécutifs | 2 phrases |
| `copy.IA-44.s1.message-inconfort` (optionnel) | 4.7 | Message dédié au cas inconfort respiratoire | 2-3 phrases |
| `copy.IA-47.s1.message-cloture` | 6.5 | Message Mimi & Jacky de clôture de S1 | 3-5 phrases denses |
| `copy.IA-47.s1.dérivés-message` | 6.5 | Reformulation des chiffres dérivés (sessions et minutes totales) | 1-2 phrases avec variables |
| `copy.IA-47.s1.saut-diagnostic` | 6.3 | Message dédié au saut de niveau de diagnostic | 1 phrase |
| `copy.IA-47.s1.message-regression` | 6.4 | Message en cas de régression (D38 honnêteté radicale) | 3-4 phrases |
| `copy.IA-47.s1.bouton-continuer` | 6.5 | Libellé bouton vers S2 Activité physique | 2-4 mots |

**Total : environ 45 slots de copy spécifiques à S1.** Une partie significative (12 questions + 5 libellés diagnostic) est déjà rédigée dans la matière V0 et stabilisée par Métriques V1.4 — Mimi & Jacky pourront les reprendre tels quels ou les ajuster à la marge. Le travail rédactionnel net se concentre sur les messages pédagogiques (diagnostic, jours, clôture, régression).

### 7.3 — Slots de visuels et médias à produire pour S1

| Slot | Écran | Type | Référence Design système |
|---|---|---|---|
| `media.IA-41.s1.video-intro-pilar` | IA-41 | Vidéo 60-90s Mimi & Jacky d'introduction au pilier S1 | Patron cadré Feature Spec V1 Socle minimum § 4.2 et Brief contenu Session 3 |
| `visual.IA-41.s1.branche-toile-initial` | IA-41 | Animation de la branche S1 valorisée au score initial | Pattern toile d'araignée — Design système V1 |
| `visual.IA-43.s1.timer-coherence-cardiaque` | IA-43 | Visualisation du timer + rythme respiratoire 6 cycles/min | À cadrer en Design système V1 — pattern écran de session |
| `visual.IA-43.s1.j1` à `visual.IA-43.s1.j7` | IA-43 | Illustration ou repère visuel par jour (optionnel — peut être un simple titre stylisé) | À arbitrer avec Mimi en Design système |
| `media.IA-45.video-transition-phase0-s1` | IA-45 | Vidéo 60-90s Mimi & Jacky de transition Phase 0 → S1 | Spécifique à S1 dans la séquence narrative, non duplicable |
| `visual.IA-47.s1.branche-toile-final` | IA-47 | Animation différentielle de la branche S1 (avant grisé / après couleur) | Pattern toile d'araignée — Design système V1 |

**Note sur le patron visuel des écrans S1.** Le chat "Design système et maquettes Raw Adventure App" a démarré la production d'un Design système V1 (12 sections, en cours) et de maquettes d'écran de pilier en Phase 1 (déclinaisons S7 jaune solaire et S5 lavande produites pour valider la grammaire). La Feature Spec S1 ne re-spécifie pas ces choix visuels — elle pointe vers le Design système comme source autoritaire. Conséquence opérationnelle : Claude Code consommera le Design système V1 (une fois figé) pour l'implémentation visuelle de tous les écrans S1.

**Couleur du pilier S1.** Pas figée dans les docs de cadrage actuels — c'est un choix qui appartient au Design système V1. Hypothèse à confirmer côté Design (si pas déjà tranché) : couleur cohérente avec la sémantique respiration (bleus clairs, gris-bleu doux, ou tonalité air/ciel). À acter quand le Design système sera figé. Zone résiduelle Section 11.

### 7.4 — Dépendances de production externes

**Production Mimi & Jacky.** Vidéo `media.IA-41.s1.video-intro-pilar` (60-90s) et vidéo `media.IA-45.video-transition-phase0-s1` (60-90s) à tourner. Scripts à rédiger en Brief contenu V1. Sans ces deux vidéos, S1 n'est pas livrable utilisateur (les écrans peuvent être codés avec des placeholders, mais l'expérience utilisateur est incomplète).

**Production Design système V1.** Le document Design système V1 doit être figé pour que les écrans S1 (IA-40, IA-41, IA-43, IA-46, IA-47) puissent être codés avec des choix visuels stables. État actuel : en cours dans le chat dédié, plusieurs sections rédigées, validation finale par Stéphane non encore actée. À acter en Section 11 comme dépendance bloquante côté implémentation visuelle.

**Production Brief contenu V1.** Les 45 slots de copy listés en 7.2 sont à produire dans le Brief contenu V1 par Mimi & Jacky. Sans ces slots, le code peut compiler avec des placeholders mais l'app n'est pas livrable. Dépendance non bloquante pour démarrer le code, bloquante pour livrer S1.

---

## Section 8 — Notifications

### 8.1 — Cadre transverse rappelé

Les notifications push de l'app sont cadrées dans Feature Spec V1 Socle minimum et dans la Synthèse V8. Règles invariantes qui s'appliquent à S1 sans particularité et qui ne sont pas redocumentées ici. **Maximum 1 notification par jour en Phase 1** (Métriques V1.4 et IA V1). **Plage de silence de 22h à 8h locales** (D32 — pas de notification envoyée dans cette plage, peu importe le déclencheur). Ton aligné Brand Core — pas d'emojis, pas de sur-promesses, pas d'exclamations gratuites, registre dense et incarné, voix Mimi & Jacky. Les notifications ne sont pas un canal commercial — pas de relance abonnement, pas de promotion mentorat, pas de référence externe.

**Posture S1 sur la fréquence.** S1 ouvre la Phase 1 et porte le risque de décrochage après l'effet nouveauté de la Phase 0. Néanmoins le quota 1 notification/jour reste un plafond, pas un objectif. La V1 vise une fréquence effective moyenne de 4 à 5 notifications par semaine sur S1, pas 7 — pour ne pas saturer et préserver la valeur perçue de chaque message. Calibrage à observer en V1 et ajuster en V2 si nécessaire.

### 8.2 — Familles de notifications applicables à S1

Les cinq familles candidates posées dans Feature Spec V1 Socle minimum sont rappelées ci-dessous avec leur application S1.

**Rappel quotidien de session.** Notification matin pour amorcer la première session du jour. Active sur S1. Slot `notification.s1.rappel-quotidien-matin`. Déclenchée à 9h locale par défaut (heure personnalisable en V2, pas en V1). Pas envoyée si l'utilisateur a déjà fait au moins une session le jour courant.

**Rappel de session intermédiaire (midi / soir).** Notification de relance entre sessions. **Écartée en V1** par cohérence avec le plafond 1 notification/jour. Si l'utilisateur a fait sa session matin mais pas celle du midi, l'app ne notifie pas — la responsabilité reste à l'utilisateur. Cohérent avec le principe directeur "moins d'une minute par jour en routine" : si on notifie 3 fois par jour pour 3 sessions, on devient envahissant. À reconsidérer en V2.

**Célébration de palier de streak.** Familles déclenchées par les paliers globaux 7j/15j/30j/60j/100j/1 an. Non spécifique à S1 — transverse Phase 0 et Phase 1. Cadrée dans Feature Spec V1 Socle minimum (D29, D30).

**Alerte joker.** Notification quand l'utilisateur n'a fait aucune session sur la journée et risque de casser son streak. **Statut en Phase 1 à clarifier en Section 11** — dépend de la décision sur le joker Phase 1 (Section 5.3). Si le joker s'applique en Phase 1, slot `notification.s1.alerte-joker` à produire en Brief contenu V1.

**Retour après absence.** Notification dédiée à un utilisateur qui n'a pas ouvert l'app depuis 3 jours ou plus. Pas spécifique à S1 — transverse. Cadrée dans Feature Spec V1 Socle minimum. Mention ici pour mémoire, slot invariant.

**Messages de fond pédagogiques.** Notification non liée à un déclencheur d'action, qui transmet un message pédagogique court sur le pilier (par exemple en milieu de semaine S1 : "Ta respiration peut redevenir un automatisme calme — pas en forçant, en observant."). Active sur S1. Slot `notification.s1.message-fond-1` à `notification.s1.message-fond-3`. Trois messages possibles dans la semaine, déclenchés aux J2, J4, J6 par défaut. À calibrer en Brief contenu V1.

### 8.3 — Programme indicatif S1 sur 7 jours

Programme proposé à valider/ajuster en Brief contenu V1. Total : 6 notifications maximum sur la semaine, soit moins que le plafond 1/jour. Les rappels quotidiens sont conditionnels (envoyés seulement si l'utilisateur n'a pas pratiqué), les messages de fond sont inconditionnels.

| Jour | Notification | Type | Conditionnelle | Slot |
|---|---|---|---|---|
| J1 | Rappel matin | Rappel quotidien | Oui (skip si déjà pratiqué) | `notification.s1.rappel-quotidien-matin` |
| J2 | Message pédagogique sur la respiration nasale | Message de fond | Non | `notification.s1.message-fond-1` |
| J3 | Rappel matin | Rappel quotidien | Oui | `notification.s1.rappel-quotidien-matin` |
| J4 | Message pédagogique sur le diaphragme et le ventre | Message de fond | Non | `notification.s1.message-fond-2` |
| J5 | Rappel matin | Rappel quotidien | Oui | `notification.s1.rappel-quotidien-matin` |
| J6 | Message pédagogique sur la douceur respiratoire | Message de fond | Non | `notification.s1.message-fond-3` |
| J7 | Invitation à l'évaluation finale | Système | Oui (skip si déjà faite) | `notification.s1.invitation-eval-finale` |

**Notes sur ce programme.** Les rappels quotidiens sont espacés (J1, J3, J5) pour ne pas systématiser le canal matin. Les messages de fond alternent avec les rappels pour varier le rythme. Le J7 a une notification dédiée invitation évaluation finale, courte et claire. Pas de notification J2/J4/J6 supplémentaire pour les sessions — la responsabilité utilisateur tient.

**Posture en cas d'inactivité prolongée.** Si l'utilisateur n'a pas ouvert l'app depuis 3 jours en cours de S1, la famille "Retour après absence" se déclenche (slot transverse cadré dans Feature Spec V1 Socle minimum), avec un message Mimi & Jacky qui invite à reprendre sans culpabilisation. Cette notification remplace celle prévue au calendrier pour ne pas empiler. Logique : un canal à la fois, le plus pertinent.

### 8.4 — Données et déclencheurs

**Stockage des notifications envoyées.** Hypothèse de structure (à confirmer avec Schéma de données V1 si pas déjà cadré) : table `notifications_sent` avec `user_id`, `notification_slot`, `sent_at`, `pilar_id`, `dismissed` ou `opened` selon retour utilisateur. Utile pour ne pas renvoyer la même notification deux fois et pour ajuster le calibrage V2.

**Déclencheurs côté serveur ou côté client.** En V1, hypothèse : déclencheurs côté serveur via tâche programmée quotidienne, qui calcule pour chaque utilisateur actif les notifications à envoyer dans la journée. Implémentation côté Expo Notifications + service back-end (Supabase Functions ou équivalent, à acter en spec technique). Pas spécifique à S1 — mécanique transverse à cadrer dans Technical Spec en aval.

**Plage de silence et fuseau horaire.** Le serveur respecte la plage 22h-8h **dans le fuseau horaire local de l'utilisateur**, pas dans le fuseau du serveur. Implémentation : stockage du fuseau utilisateur en base au moment de la création de compte (déduit du device au premier lancement), recalculé périodiquement. À spécifier en Technical Spec.

### 8.5 — Posture en cas de désactivation des notifications

Si l'utilisateur a désactivé les notifications de l'app (au niveau OS), aucune notification n'arrive — l'app fonctionne normalement et la mécanique des paliers de streak, des messages pédagogiques et des rappels reste cohérente, mais sans le canal push. L'app ne réclame pas l'autorisation notifications de manière insistante. Demande à un moment opportun seulement (après la première validation de session par exemple), avec message clair sur la valeur des notifications. Cadrage exact à acter en Feature Spec V1 Socle minimum si pas déjà fait — non spécifique à S1.

---

## Section 9 — Données à stocker

### 9.1 — Posture transverse

Toute la structure de données pour S1 est cadrée dans Schéma de données V1 (`raw-adventure-schema-donnees-v1.md`). La Feature Spec S1 ne re-spécifie pas les tables ni les colonnes — elle pointe vers les sections autoritaires et signale les écarts ou compléments éventuels. Trois tables sont impliquées sur S1 : `pillar_evaluations`, `pillar_sessions`, `level_adaptive_choices`. Plus les tables transverses streak et progress dont les écritures S1 sont des cas standard.

### 9.2 — Tables impliquées sur S1

**`pillar_evaluations`** (Schéma de données V1 § 4.2). Stocke les évaluations initiale et finale du pilier. Deux lignes par utilisateur sur S1 : une avec `evaluation_type='initial'` à la sortie d'IA-40, une avec `evaluation_type='final'` à la sortie d'IA-46. Champs : `user_id`, `pillar_id = 1`, `evaluation_type`, `responses` (array JSON des 12 réponses brutes), `raw_score` (score brut /60), `normalized_score` (score normalisé 0-100), `diagnostic_level` (1 à 5), `engagement_level_recommended` (`'essentiel'` / `'progression'`), `engagement_level_chosen` (`'essentiel'` / `'progression'` / `'immersion'`), `created_at`, `updated_at`. Le champ `engagement_level_chosen` est modifiable en cours de semaine via IA-41 ou IA-42 — mise à jour de la ligne `evaluation_type='initial'` du pilier courant (Schéma de données V1 § 5.4). Spécifique S1 : rien.

**`pillar_sessions`** (Schéma de données V1 § 4.3 et § 5.5). Stocke une ligne par session pratiquée. Sur S1 en Phase 1 avec 3 sessions/jour sur 7 jours, jusqu'à 21 lignes par utilisateur. Champs : `user_id`, `pillar_id = 1`, `day_in_week` (1 à 7), `session_index` (1 = matin, 2 = midi, 3 = soir), `local_date`, `completed_at`, `duration_seconds` (durée effective de la session). Spécifique S1 : à vérifier que le champ `duration_seconds` est bien présent dans la table — utile pour le récap IA-47 (somme des durées) et pour gérer les changements de niveau en cours de semaine. **Patch à propager** si absent (consigné en patches groupés Section 10).

**`level_adaptive_choices`** (Schéma de données V1 § 4.4 et § 5.6). Stocke une ligne par tap sur la modale IA-44. Champs : `user_id`, `pillar_id = 1`, `session_id` (référence à la session qui s'apprête à être lancée, peut être null si la session n'est pas encore créée), `choice` (`'less'` / `'same'` / `'more'`), `chosen_at`. Lecture des N derniers choix pour déclencher les messages de suggestion (Section 5.1). Spécifique S1 : rien.

**`streak_history`** (Schéma de données V1 § 5.2). Stocke une ligne par jour validé en Phase 1. Champs invariants — `user_id`, `phase = 'phase_1'`, `local_date`, `validation_status` (`'valid'` / `'valid_with_joker'` / `'broken_streak'`), `streak_value_after`, `joker_used`. Spécifique S1 : rien. Cas particulier joker en Phase 1 à clarifier en Section 11 (Section 5.3).

**`tier_reaches`** (Schéma de données V1 § 5.2). Stocke l'historique des paliers de streak globaux franchis. Mise à jour transverse Phase 0 et Phase 1. Spécifique S1 : rien.

### 9.3 — Tables potentiellement nécessaires non encore cadrées

**Table `notifications_sent`** (hypothèse Section 8.4). Pas explicitement cadrée dans Schéma de données V1 au moment de la production de cette Feature Spec. Champs proposés : `user_id`, `notification_slot`, `sent_at`, `pilar_id`, `dismissed_at` ou `opened_at`. Utile pour ne pas renvoyer la même notification deux fois et pour analytics. **Patch à propager** dans Schéma de données V1 si la table n'existe pas (consigné en patches groupés).

**Table `pilar_event_messages_shown`** (hypothèse). Pour traquer l'affichage unique des messages pédagogiques J3, J5, J7 par utilisateur sur le pilier S1 (Section 5.4). Alternative : reconstruire la lecture à la volée à partir de `pillar_sessions` (si le user a une session validée le jour 3, le message J3 a été montré). À acter en arbitrage côté Schéma de données et Technical Spec. Pas un blocage pour S1, hypothèse "calcul à la lecture" suffisante en V1.

### 9.4 — Champs spécifiques à S1 — synthèse

Aucun champ de table spécifique au pilier S1 au-delà de la structure transverse Phase 1. Toutes les écritures suivent la structure standard cadrée dans Schéma de données V1. Cette absence de spécificité est un signe positif : S1 valide la portabilité du modèle de données vers les 5 autres piliers Type A (S2, S3, S4, S6, S8) sans patch ad hoc. Les piliers Type B (S5, S7) demanderont probablement une adaptation dédiée à formaliser dans leurs Feature Specs respectives.

### 9.5 — Lectures fréquentes côté code

Pour Claude Code, les lectures fréquentes du back-end sur S1 :

**À l'ouverture de l'app en cours de S1.** Lecture de l'état du parcours (`currentPhase`, `currentPilar`, `pilarStartedAt`) depuis le store de parcours (Feature Spec V1 Socle minimum § 2.1). Lecture des sessions du jour courant pour afficher l'état de progression : `SELECT * FROM pillar_sessions WHERE user_id = $uid AND pillar_id = 1 AND local_date = $today`. Lecture du niveau d'engagement courant : `SELECT engagement_level_chosen FROM pillar_evaluations WHERE user_id = $uid AND pillar_id = 1 AND evaluation_type = 'initial'`.

**À l'ouverture de la modale IA-44.** Lecture des N derniers choix : `SELECT choice FROM level_adaptive_choices WHERE user_id = $uid AND pillar_id = 1 ORDER BY chosen_at DESC LIMIT N` (N=4 selon hypothèse Section 5.1).

**À l'ouverture de IA-47.** Lecture des deux lignes `pillar_evaluations` (initiale et finale) pour calculer le différentiel. Agrégat sur `pillar_sessions` pour les dérivés : `SELECT COUNT(*), SUM(duration_seconds) FROM pillar_sessions WHERE user_id = $uid AND pillar_id = 1`.

**À l'ouverture de la toile IA-25.** Lecture des `pillar_evaluations` de tous les piliers travaillés pour reconstruire l'état initial + final de chaque branche. Pour S1 spécifiquement : les deux lignes si S1 est terminé, une seule ligne si S1 est en cours, aucune ligne si S1 n'a pas démarré.

Ces lectures sont rapides et standard — pas de pré-calcul ni de table dérivée nécessaire en V1.

---

## Section 10 — Edge cases spécifiques au pilier

### 10.1 — Posture sur les edge cases

La plupart des edge cases sont couverts par Feature Spec V1 Socle minimum (fermeture de l'app en cours d'écran, reprise au lancement suivant, perte de réseau, mécanique d'absence prolongée traversant un changement de phase D25, etc.) et par les sections précédentes de la Feature Spec S1. Cette Section 10 traite uniquement les cas **spécifiques au pilier S1** qui méritent une mention parce qu'ils touchent la physiologie respiratoire, la sécurité de l'utilisateur ou des situations propres à la pratique de la cohérence cardiaque. Pour les edge cases transverses, renvoi à Feature Spec V1 Socle minimum.

### 10.2 — Cas physiologiques liés à la pratique respiratoire

**Cas — utilisateur ressent des vertiges, étourdissements ou hyperventilation en cours de session.** Le rythme 6 cycles/minute (5s inspiration / 5s expiration) est sans risque pour la grande majorité des utilisateurs. Néanmoins, un utilisateur qui n'a jamais pratiqué de respiration consciente peut ressentir un inconfort dans les premières sessions : sensation de tête qui tourne, fourmillements dans les doigts, oppression. Trois causes possibles : ventilation excessive (l'utilisateur force au-delà du rythme naturel), apnée involontaire (l'utilisateur retient son souffle entre les cycles), position physique tendue.

Posture V1 : l'app **ne traite pas médicalement** ces sensations. Elle donne à l'utilisateur un message clair pour ralentir, normaliser sa respiration et reprendre une respiration spontanée. Slot `copy.IA-44.s1.message-inconfort` (Section 7.2) — matière V0 conservée : "Ralentis. La respiration ne doit jamais créer de tension, d'étourdissement ou de besoin de forcer. Reviens à une respiration douce et confortable." Le déclencheur du message est le tap "Moins" en IA-44, hypothèse retenue Section 4.7. Pas de bouton dédié "Je ressens un inconfort" en V1 pour ne pas alourdir IA-43.

**Cas — utilisateur avec une condition médicale (BPCO, asthme, troubles anxieux sévères, etc.).** Hors-scope médical en V1. L'app n'est pas un dispositif médical et le copy doit éviter toute formulation qui pourrait être interprétée comme un conseil thérapeutique. Les CGU ou la page d'accueil onboarding doivent porter une mention claire que l'app n'est pas un substitut à un suivi médical et que les utilisateurs avec des conditions particulières doivent consulter avant de pratiquer. À acter en Section 11 — c'est un sujet transverse à toutes les piliers santé naturelle, à cadrer au niveau Product Vision ou CGU, pas dans la Feature Spec S1.

**Cas — utilisateur enceinte.** La cohérence cardiaque à 6 cycles/minute est généralement compatible avec la grossesse, mais certaines pratiques respiratoires plus avancées ne le sont pas. En V1, aucune adaptation spécifique au pilier S1 pour les utilisatrices enceintes — la durée Essentiel (5 min) reste applicable. Si un message dédié est jugé nécessaire en relecture, il s'ajoutera en patch. Pas un blocage V1.

### 10.3 — Cas liés à la mécanique de session

**Cas — utilisateur lance une session, met l'app en arrière-plan, revient après le temps de session.** Hypothèse : le timer continue à courir en arrière-plan. Si la durée prévue est écoulée au retour, la session est marquée comme complétée. Si la durée n'est pas écoulée, l'utilisateur reprend le timer là où il en était. À acter en Technical Spec — comportement standard timer mobile.

**Cas — utilisateur lance une session, ferme l'app brutalement (force kill ou crash) avant la fin.** La session n'est pas validée. Au prochain lancement, l'utilisateur retrouve l'état "X/3 sessions" inchangé. Pas de récupération automatique d'une session interrompue. Cohérent avec D38 (honnêteté pédagogique radicale) : pas de bidouille rétrospective.

**Cas — utilisateur reçoit un appel ou une notification système en cours de session.** Le timer est mis en pause pendant l'interruption (comportement OS standard), puis reprend. La session reste valide si la durée totale est atteinte malgré l'interruption.

**Cas — utilisateur veut faire une session de plus que les 3 prévues.** Permis. La 4e session peut être lancée et tracée dans `pillar_sessions` avec `session_index = 4`. Pas de plafond dur en V1 sur le nombre de sessions par jour. Cohérent avec la posture "on n'empêche pas l'utilisateur engagé". Le récap IA-47 affichera le total réel.

**Cas — utilisateur a coché manuellement une session (sans lancer le timer) puis veut la "défaire".** Permis en V1 via un tap répété sur la case (toggle). Pas de confirmation, pas d'historique d'undo conservé en base — la ligne `pillar_sessions` est supprimée. Cohérent avec le principe directeur 3 (simplicité extrême).

### 10.4 — Cas liés à la temporalité du pilier

**Cas — utilisateur démarre S1 puis ne revient que 3 semaines plus tard.** Mécanique d'absence prolongée cadrée dans Feature Spec V1 Socle minimum (D25 : un écran narratif par session pour rattraper les transitions accumulées). Sur S1 spécifiquement : si l'utilisateur revient au J20 après le démarrage S1, l'app applique le compteur `currentDayInPilar = 7` (borné) et propose l'évaluation finale au prochain lancement. Le streak est cassé. Pas de jugement, message Mimi & Jacky qui invite à reprendre.

**Cas — utilisateur fait son évaluation finale au J6 (un jour trop tôt).** Non permis en V1. L'évaluation finale n'est proposée qu'à partir du J7 (Section 6.1). Le bouton d'évaluation finale n'apparaît pas avant le J7 calendaire. Pas de raccourci pour les utilisateurs pressés.

**Cas — utilisateur fait son évaluation finale au J15 (très tard).** Permis. La logique reste la même — l'évaluation finale est calculée et le différentiel est affiché. Le streak peut avoir été cassé entre temps si l'utilisateur n'a pas validé de session sur la période, mais l'évaluation finale reste indépendante du streak.

### 10.5 — Cas liés au changement de niveau

**Cas — utilisateur change 4 fois de niveau d'engagement sur la même semaine.** Permis. Chaque changement met à jour `engagement_level_chosen`. Les sessions déjà validées gardent leur durée d'origine dans `pillar_sessions.duration_seconds`. Cohérent avec Section 5.2.

**Cas — utilisateur passe en Immersion via IA-41/IA-42 mais utilise IA-44 "Moins" à chaque session.** Permis. La durée effective sera de 15 min par session (Moins en Immersion, Section 5.1) au lieu de 20 min. Si 4 "Moins" consécutifs sont enregistrés, le message de suggestion s'affiche et invite à reconsidérer le niveau d'entrée. Comportement attendu et documenté.

### 10.6 — Cas liés à la transition Phase 0 → S1 et S1 → S2

**Cas — utilisateur démarre S1 puis veut "revenir" en Phase 0.** Non permis en V1. La sortie de Phase 0 est définitive. Si l'utilisateur en S1 regrette ses 7 actions Phase 0, il peut continuer à les pratiquer dans sa vie quotidienne mais l'app reste en mode Phase 1. C'est une posture assumée — l'app conduit l'utilisateur en avant.

**Cas — utilisateur termine S1 mais veut "rester" en S1 au lieu de passer à S2.** Permis temporairement. Tant que l'utilisateur ne tape pas "Continuer vers S2" en IA-47, il reste en S1. L'app peut être ouverte à nouveau, l'IA-47 reste accessible. Mais aucune nouvelle session S1 n'est trackée — le pilier est fermé. Pas de mécanique de "consolidation libre S1" en V1.

**Cas — utilisateur tape "Continuer vers S2" puis veut revenir en S1.** Non permis. Le passage à S2 est définitif. `currentPilar = 2` ne se redécrémente pas.

### 10.7 — Cas de sécurité et abus

**Cas — utilisateur veut "tricher" en validant 21 sessions S1 sur 1 journée.** Permis techniquement (cf. Section 10.3 cas "4e session"). Aucune mécanique de plafond ou de validation de bonne foi en V1. Cohérent avec D38 (honnêteté pédagogique radicale, mais dans le sens : l'app ne ment pas à l'utilisateur sur sa progression, pas dans le sens : l'app empêche les bidouilles). Si l'utilisateur falsifie ses sessions, c'est son problème — le différentiel d'évaluation finale ne mentira pas, lui.

**Cas — utilisateur ouvre l'app sur un nouvel appareil pendant S1.** Sync via Supabase (à acter en Technical Spec). L'état du parcours, les sessions, les évaluations doivent être disponibles. Pas spécifique à S1.

---

## Section 11 — Zones résiduelles et points reportés

### 11.1 — Posture

Cette section consolide tous les points soulevés en cours de production de la Feature Spec S1 qui n'ont pas été tranchés et qui restent à clarifier, soit en Brief contenu V1, soit en relecture S1 avec Stéphane, Mimi ou Jacky, soit en patch d'un doc de cadrage stable. Aucune zone résiduelle n'est bloquante pour démarrer le code S1 — Claude Code peut commencer sur la base de cette Feature Spec en mettant des placeholders ou en suivant les hypothèses de travail acquises. Les zones résiduelles sont bloquantes pour **livrer S1 en production**, pas pour démarrer le code.

### 11.2 — Tableau récapitulatif

*Note V1.0 du 13 mai 2026 — fermetures.* Trois zones résiduelles fermées en sortie de relecture Stéphane le 13 mai 2026 et listées ici en italique : **Z1** (inversion Q6/Q7/Q8 actée), **Z3** (message dédié déclassement Phase 0 → Phase 1 jugé optionnel, message standard suffit), **Z6** (joker confirmé en Phase 1 sur logique Phase 0, patch propagé à Feature Spec V1 Socle minimum V1.2). Les 10 zones restantes (Z2, Z4, Z5, Z7 à Z13) sont toutes non-bloquantes pour démarrer le code S1.

| ID | Sujet | Section source | Cible de résolution | Statut |
|---|---|---|---|---|
| ~~Z1~~ | ~~Inversion sémantique des questions Q6, Q7, Q8 de l'évaluation S1~~ | 2.2 | Relecture Stéphane 13 mai 2026 | **FERMÉE — inversion actée, score utilisé = 6 - réponse** |
| Z2 | Seuils de score brut /60 → diagnostic 5 niveaux (quintiles symétriques) | 2.3 | Relecture S1 ou Brief contenu V1 (Jacky) | Hypothèse de travail : quintiles symétriques 12-21 / 22-30 / 31-40 / 41-50 / 51-60 |
| ~~Z3~~ | ~~Message dédié au cas de déclassement Phase 0 → Phase 1 sur S1~~ | 3.1 | Relecture Stéphane 13 mai 2026 | **FERMÉE — slot dédié non retenu, message standard du diagnostic 1-2-3 suffit en V1** |
| Z4 | Calibrage des durées "Moins" et "Plus" en IA-44 sur S1 (3/7/15 et 25 min) | 5.1 | Relecture S1 ou Brief contenu V1 (Jacky) | Hypothèse de travail : 3 / 7 / 15 / 25 min selon niveau d'engagement |
| Z5 | Seuil N pour le message de suggestion d'adaptation après "Moins" ou "Plus" | 5.1 | Brief contenu V1 (Jacky) | Hypothèse de travail : N = 4 choix consécutifs |
| ~~Z6~~ | ~~Status du joker hebdomadaire en Phase 1~~ | 5.3 | Patch Feature Spec V1 Socle minimum V1.2 | **FERMÉE — joker s'applique en Phase 1 sur même logique Phase 0, patch propagé** |
| Z7 | Couleur du pilier S1 dans le Design système V1 | 7.3 | Design système V1 (chat dédié) | Pas figé — à confirmer côté Design |
| Z8 | Mention médicale / non-substitut suivi médical / conditions particulières | 10.2 | Patch CGU ou Product Vision (transverse, pas spécifique S1) | À acter au niveau Product Vision ou page d'accueil onboarding |
| Z9 | Patron visuel d'écran de session (timer + rythme respiratoire) | 7.3 | Design système V1 (chat dédié) | À cadrer dans le Design système |
| Z10 | Validation finale du Design système V1 par Stéphane | 7.4 | Chat Design système V1 | En cours, validation non encore actée |
| Z11 | Scripts vidéo `media.IA-41.s1.video-intro-pilar` et `media.IA-45.video-transition-phase0-s1` | 7.3, 7.4 | Brief contenu V1 (Mimi + Jacky) puis tournage | Dépendance bloquante pour livraison utilisateur |
| Z12 | Rédaction des 45 slots de copy spécifiques S1 | 7.2 | Brief contenu V1 (Mimi + Jacky) | Dépendance bloquante pour livraison utilisateur |
| Z13 | Confirmation que la 3e session du J7 est compatible avec l'évaluation finale dans la journée | 6.1 | Hypothèse souple — pas un blocage | Confirmer en relecture |

### 11.3 — Patches groupés à propager en sortie de production S1

Liste consolidée de tous les patches identifiés en cours de production. À traiter en une seule passe après validation de la Feature Spec S1, pour éviter de fragmenter le travail de patching et de créer des incohérences entre docs.

**Patch 1 — Métriques V1.4 → V1.5.** § 4.3 ligne S1 : paramètre principal cohérence cardiaque modifié de 3 / 5 / 8 min à **5 / 10 / 20 min**. Justification : décision tranchée le 12 mai 2026 lors de la production de la Feature Spec S1, calibrage aligné posture Sadhguru. Mise à jour de l'historique des versions et glossaire si nécessaire. Pas d'autre modification du contenu V1.4.

**Patch 2 — Schéma de données V1.** Vérifier la présence du champ `duration_seconds` dans la table `pillar_sessions` (Schéma de données V1 § 4.3). Ajouter si absent. Justification : permet de tracer la durée effective d'une session pour le récap IA-47 et pour gérer les changements de niveau en cours de semaine.

**Patch 3 — Schéma de données V1.** Cadrer la table `notifications_sent` si non encore présente (Section 8.4). Champs proposés : `user_id`, `notification_slot`, `sent_at`, `pilar_id`, `dismissed_at` ou `opened_at`. Justification : tracer les notifications envoyées, éviter les doublons, alimenter analytics V1.

**Patch 4 — Customer Journey V1.2.** Mentions de l'ordre canonique D8 obsolète à patcher vers D39. Notamment table comparative Phase 0 / Phase 1 qui mentionne implicitement un ordre des piliers. Justification : cohérence transverse avec l'ordre canonique figé par D39 le 9 mai 2026.

**Patch 5 — Synthèse V8.** Ajouter une mention courte que la Feature Spec S1 a été produite le 12 mai 2026, sert de pilier-pattern Type A, et que les patches ci-dessus en découlent. Pas de nouvelle décision D42+ à acter à ce stade — les choix faits sur S1 (5/10/20 min, 3 sessions/jour, joker en Phase 1 par défaut, pas de badges spécifiques par pilier, Option A retenue) sont des spécifications de pilier, pas des décisions produit structurelles.

**Patch 6 — CLAUDE.md du repo.** Mettre à jour pour mentionner l'existence de la Feature Spec S1 stable et son rôle de pilier-pattern. Précision opérationnelle pour Claude Code en démarrage de session.

### 11.4 — Dépendances externes pour livrer S1

Trois dépendances bloquantes pour livrer S1 utilisateur. La Feature Spec S1 elle-même ne peut pas les résoudre — elles sont externes.

**Dépendance 1 — Brief contenu V1 produit par Mimi & Jacky.** 45 slots de copy à rédiger (Section 7.2). Plus les scripts vidéo IA-41 et IA-45. Sans Brief contenu V1, l'app S1 peut compiler avec des placeholders mais l'expérience utilisateur est incomplète.

**Dépendance 2 — Tournage des deux vidéos S1.** Vidéo intro pilier (IA-41) et vidéo transition Phase 0 → S1 (IA-45). 60-90 secondes chacune. À tourner par Mimi & Jacky sur la base des scripts du Brief contenu V1. Sans ces vidéos, les écrans peuvent être codés avec des placeholders vidéo, mais S1 n'est pas livrable utilisateur.

**Dépendance 3 — Design système V1 figé.** Le document Design système V1 est en cours de production dans un chat dédié. Validation finale par Stéphane non encore actée (Z10). Sans Design système figé, Claude Code peut commencer mais les choix visuels seront approximatifs et probablement à refaire. **Recommandation forte : figer le Design système V1 avant de démarrer le code des écrans S1.**

### 11.5 — Ce qui reste hors-scope V1 et est explicitement reporté V2

Pour mémoire, points écartés en cours de production S1 et reportés à V2 ou ultérieur. Aucun n'est une omission — tous sont des choix assumés.

- Score quotidien par pilier (D34 : pas de score quotidien V1).
- Questionnaire de fin de journée (D36 : pas de questionnaire fin de journée V1).
- Observation finale 8 questions narratives (V0 § 14 — registre journal d'auto-observation, à reconsidérer V2).
- Comparaison avant/après détaillée avec 6 indicateurs (V0 § 15 — nécessite un journal d'auto-observation V2).
- Badges spécifiques par pilier (V0 § 13 et § 16 — Option A retenue, paliers de streak globaux suffisent en V1).
- Rappels de session intermédiaires (midi / soir) — écartés en V1 pour rester sous le plafond 1 notification/jour.
- Suggestion d'adaptation automatique du niveau d'entrée (D31 : niveau adaptatif manuel uniquement, pas de changement automatique).
- Refaire l'évaluation finale (Section 6.8 — une seule évaluation finale par pilier en V1).

---

## Annexe — Matière source

### A.1 — Posture

Cette annexe consolide les renvois aux fichiers consultés ou cités en cours de production de la Feature Spec S1. Elle sert à deux usages. Premièrement, traçabilité — savoir précisément quelle matière a alimenté quelle section, pour faciliter les patches ultérieurs et les relectures. Deuxièmement, plug-and-play pour les Feature Specs S2 à S8 — l'auteur des prochaines Feature Specs (Claude ou autre) saura quels fichiers consulter en priorité.

Aucun contenu n'est dupliqué ici. C'est une liste de pointeurs.

### A.2 — Fichiers du Project utilisés en source

**`raw-adventure-metriques-v1-draft.md` (Métriques V1 V1.4 — point stable final).** Document de cadrage métier autoritaire. Sections utilisées en S1 : § 1.2 (mapping toile / ordre canonique D39), § 1.5 (état trois branches), § 1.6 (libellés courts S1 "Respiration"), § 1.8 (typologie Type A / Type B, S1 est Type A), § 2.1 à § 2.3 (format évaluation 12 questions × échelle 1-5, formule de normalisation), § 2.4 (ligne S1 — libellés narratifs Coûteuse / Instable / Respi en mode adaptation / Fonctionnelle / Régulatrice), § 2.5 (règle D40), § 2.6 et § 2.7 (mapping différentiel et seuil ±3 points), § 4.3 (paramètre principal S1 — à patcher à 5/10/20 min en sortie de production), Annexe C.1 (matière clinique brute Jacky pour S1), Annexe D (phrase régression, citations pédagogiques). À patcher V1.4 → V1.5 (Section 11.3 Patch 1).

**`V0_PILIER_1___RESPIRATION.docx` (Fichier pilier V0 Jacky).** Matière source brute pour S1. Fichier texte UTF-8 malgré l'extension .docx, à lire directement avec `view` ou `cat`. 940 lignes. Sections utilisées : § 0 (rôle du pilier), § 1 (objectif produit), § 2 (flow utilisateur), § 3 (12 questions et 5 niveaux de diagnostic), § 4 (3 niveaux d'intensité, durées V0 obsolètes), § 5 (structure quotidienne), § 6 (tracking journalier), § 7 (timer et durées), § 8 (progression sur 7 jours J1 à J7), § 9 (checklist quotidienne, partiellement écartée V1), § 10 (ressenti du jour, écarté V1), § 11 (score quotidien, écarté V1), § 12 (adaptation automatique, reformulée en suggestion messagée), § 13 (gamification, badges écartés Option A), § 14 (observation finale, écartée V1), § 15 (comparaison avant/après, partiellement intégrée), § 16 (récompense finale, badge écarté).

**`raw-adventure-decisions-v5.md` (Synthèse V8).** Document de cadrage des décisions produit. Décisions utilisées en S1 : D8 (obsolète, remplacée par D39), D14 et D15 (tranchées par Métriques V1.4), D25 (mécanique d'absence prolongée), D29 et D30 (paliers de streak globaux et coordination), D31 (niveau adaptatif manuel uniquement, enrichi sur la suggestion messagée), D32 (plage de silence 22h-8h), D33 (une vidéo par pilier), D34 (pas de score quotidien V1), D36 (pas de questionnaire fin de journée V1), D38 (honnêteté pédagogique radicale), D39 (ordre canonique des 8 piliers), D40 (règle simplifiée diagnostic → engagement), D41 (typologie Type A / Type B).

**`raw-adventure-information-architecture-v1.md` (IA V1).** Document de cadrage des écrans. Écrans utilisés en S1 : IA-11 (accueil quotidien en mode Phase 1), IA-15 (modale de validation, écartée en Phase 1), IA-25 (toile d'araignée — mise à jour de la branche S1), IA-26 (détail branche S1), IA-40 (évaluation initiale 12 questions S1), IA-41 (récapitulatif évaluation initiale, niveau d'engagement, paramètre principal, modale de modification de niveau), IA-42 (vue d'ensemble du pilier en cours), IA-43 (écran de session), IA-44 (modale niveau adaptatif Moins/Pareil/Plus), IA-45 (vidéo de transition Phase 0 → S1), IA-46 (évaluation finale 12 questions S1), IA-47 (récapitulatif évaluation finale + branche), IA-50 et IA-51 (paliers de streak globaux, transverses).

**`raw-adventure-feature-spec-v1-socle-minimum.md` (Feature Spec V1 Socle minimum).** Cadrage transverse des mécaniques et formats-types. Sections utilisées en S1 : § 1 (conventions de nommage, types d'écran, identifiants), § 2.1 (états du parcours et transitions), § 2.2 (architecture de navigation et tab bar), § 4.1 (patron de fiche IA-41 — la Feature Spec S1 est la première instanciation de ce patron), § 4.2 (structure-type vidéo intro de pilier).

**`raw-adventure-schema-donnees-v1.md` (Schéma de données V1).** Cadrage des tables et écritures. Sections utilisées en S1 : § 4.2 (table `pillar_evaluations`), § 4.3 (table `pillar_sessions` — à vérifier sur le champ `duration_seconds`, Patch 2), § 4.4 (table `level_adaptive_choices`), § 5.2 (mécanique de validation streak Phase 1), § 5.3 et § 5.4 (écritures évaluation initiale et modification de niveau), § 5.5 (écriture session pratiquée), § 5.6 (écriture choix niveau adaptatif), § 5.7 (écriture évaluation finale). Patches à propager (Section 11.3 Patch 2 et Patch 3).

**`raw-adventure-product-vision-v2-2.md` (Product Vision v2.2).** Vision, périmètre V1, principes directeurs. Tous les principes directeurs ont été référencés en cours de production S1 : principe 1 (l'utilisateur ne doit pas réfléchir), principe 2 (le ressenti prime sur la théorie), principe 3 (simplicité extrême), principe 4 (moins d'une minute par jour en routine), principe 5 (progression visible et frustration positive), principe 6 (pas de marketing bien-être creux), principe 7 (Mimi & Jacky en différé).

**`RAW_ADVENTURE___BRAND_CORE.md` (Brand Core).** Voix, ton, vocabulaire à utiliser et à éviter. Référencé pour la posture éditoriale Section 7.1.

**`__Charte_Graphique___Raw_Adventure_.md` (Charte graphique).** Palette, typographies, univers visuel. Référencé pour la posture visuelle, mais l'autorité visuelle est désormais le **Design système V1 en cours de production** dans un chat dédié (qui consolide et dépasse la Charte graphique).

**`raw-adventure-customer-journey-v1.md` (Customer Journey V1.2).** Parcours utilisateur Phase 0 → Phase 1, structure-type d'une semaine de Phase 1 documentée pour S1. À patcher (Section 11.3 Patch 4) pour migrer les mentions d'ordre canonique D8 obsolète vers D39.

**`raw-adventure-brief-contenu-session-3.md` (Brief contenu Session 3 — vidéos d'intro de pilier).** Format-type des 8 vidéos d'intro de pilier (60-90s). Référencé en Section 0.2 et Section 7.3 pour la posture de production de la vidéo intro S1.

**`raw-adventure-brief-contenu-session-2.md` (Brief contenu Session 2 — S0.1 et S0.2).** Référencé en Section 0.2 pour l'articulation Phase 0 → S1 portée par les vidéos S0.1 et S0.2 (en amont de S1 dans le parcours).

### A.3 — Fichiers du Project non utilisés en source pour S1 mais à connaître

Fichiers du Project consultables pour les Feature Specs ultérieures. Pas exhaustif, juste les pointeurs utiles.

`raw-adventure-user-personas-v1.md` (Personas V1 — Isabelle segment A, Caroline segment C). Utile pour calibrer le ton du copy à différents profils utilisateurs en Brief contenu V1.

`raw-adventure-audit-copy-v1.md` (Audit copy V1). Utile pour la production de copy spécifique aux écrans S1 — référence sur le ton et les pièges à éviter.

`raw-adventure-brief-contenu-session-1.md` (Brief contenu Session 1 — paliers streak). Référence pour la posture des vidéos de palier de streak globaux (non spécifique S1).

`raw-adventure-passation-feature-spec-s1.md` (Note de passation Feature Spec S1). Document de passation utilisé pour cette session. Reste utile pour les Feature Specs S2 à S8 en mode "comment a-t-on cadré S1".

`raw-adventure-metriques-v1-note-session-jacky.md` (Note session Jacky V6.0). Référence pour les arbitrages pédagogiques Jacky, notamment sur la règle D40 et la typologie D41.

`raw-adventure-passation-matrice-8x8.md` (Note de passation matrice 8×8). Référence pour la matrice 8 archétypes × 8 piliers (Annexe B de Métriques V1.4), utile principalement pour la Phase 0 mais consultable.

Les fichiers V0 des 7 autres piliers (`V0_PILIER_2_*.docx` à `V0_PILIER_8_*.docx`) seront les matières sources des Feature Specs S2 à S8 selon la même logique que `V0_PILIER_1___RESPIRATION.docx` pour S1.

### A.4 — Fichiers à produire en aval (pour mémoire)

Pas dans le Project actuellement, à produire en aval de la Feature Spec S1 stable.

**Brief contenu V1.** Document de production des slots de copy et des scripts vidéo. 45 slots S1 à rédiger (Section 7.2). Sera étendu aux 45 × 8 piliers = environ 360 slots de copy spécifiques piliers en V1.

**Technical Spec.** Document de cadrage technique pour Claude Code et l'équipe dev. Architecture, choix de bibliothèques, intégration Expo Notifications, sync Supabase, déploiements iOS et Android. Pas spécifique S1 — transverse V1.

**Feature Specs S2 à S8.** Les 7 autres piliers. S2 (Activité physique) prochain à produire selon l'ordre canonique D39 et selon la séquence narrative.

---

## Bilan de la production S1

Document produit en 12 sections + annexe (0 à 11 + A), en mode itératif sur cette session. Couvre l'intégralité de la matière nécessaire pour démarrer le code S1 (mécanique pure : sections 2 à 6 et 9 à 10) et pour produire le Brief contenu V1 (slots de copy et de médias : section 7) ainsi que les notifications (section 8).

**État.** V0.1 draft complet. À relire par Stéphane avant passage en V1.0 stable.

**Patches à propager en sortie de production S1.** Consolidés en Section 11.3 (6 patches identifiés, dont 5 sur des docs de cadrage stables et 1 sur le CLAUDE.md du repo). À traiter en une passe groupée après ta relecture.

**Dépendances bloquantes pour livraison utilisateur S1.** Brief contenu V1 (45 slots), tournage de 2 vidéos Mimi & Jacky, Design système V1 figé.

**Zones résiduelles non-bloquantes.** 13 zones identifiées en Section 11.2, toutes adressables en aval (Brief contenu, relecture, Design système, ou hypothèses de travail acquises).

**Réutilisabilité pour S2 à S8.** Le sommaire 12 sections + annexe est plug-and-play. Pour les piliers Type A (S2, S3, S4, S6, S8), la mécanique des sections 2-3-4-5-6 se reproduit avec les variables propres au pilier. Pour les piliers Type B (S5, S7), les sections 3-4-5 sont à adapter sur la mécanique narrative 7 jours sans engagement E/P/I.

---

*Fin de la Feature Spec S1 Respiration V0.1 draft itératif complet — 12 mai 2026.*

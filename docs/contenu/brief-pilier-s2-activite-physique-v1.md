# Brief contenu — Pilier S2 Activité physique V1

**Statut** (mis à jour 16 sept 2026, salve C2) : réaligné sur la **matière Jacky enrichie** (`docs/matiere-jacky/V0_PILIER 2 — ACTIVITÉ PHYSIQUE.docx`, version du 16 sept avec section « ÉVALUATION DE DÉPART »). 12 questions et labels des 5 niveaux = **Jacky, actés**. Restent à valider Jacky : les 5 messages de diagnostic (drafts Claude), le sens de Q7 (transpiration), le calibrage des durées 30/45/60.
**Cible code** :
- `src/data/s2-evaluation.ts` (12 questions + diagnostic 5 niveaux)
- `src/data/s2-program.ts` (programme 7 jours)
- `src/data/pillar-registry.ts` (meta pillar S2)

**Cadrage** : Feature Spec S1 Respiration V1.0 (pattern référence) + Métriques V1.5 + matière Jacky brute

## Type pilier

- **Type** : A — paramètre principal modulé par niveau d'engagement
- **Session type** : `chrono_libre` — timer durée simple sans rythme respiratoire
- **Paramètre principal** : durée séance (minutes)
- **Durées par engagement** (simplification V1 des 9 paliers Jacky) :
  - Essentiel : 30 min
  - Progression : 45 min
  - Immersion : 60 min

## 12 questions évaluation (Jacky, verbatim — doc du 16 sept 2026)

Échelle 1-5 (`1 = jamais / très loin de moi` à `5 = toujours / très proche de moi`).

| # | Question | Inversion |
|---|---|---|
| Q1 | Je bouge physiquement presque tous les jours. | Non |
| Q2 | Je me sens en forme physiquement dans ma journée. | Non |
| Q3 | J'ai de l'énergie pour marcher, monter des escaliers ou porter des charges. | Non |
| Q4 | Mon corps récupère bien après un effort. | Non |
| Q5 | Je me sens souvent raide ou bloqué physiquement. | Oui |
| Q6 | Je manque régulièrement d'énergie pour faire du sport ou bouger. | Oui |
| Q7 | Je transpire facilement quand je fais un effort. | **Non — sens à trancher Jacky** |
| Q8 | Je sens que mon souffle est bon quand je marche ou cours. | Non |
| Q9 | Je me sens solide physiquement. | Non |
| Q10 | Je prends plaisir à bouger mon corps. | Non |
| Q11 | J'ai l'impression que mon corps devient plus fort ou plus endurant. | Non |
| Q12 | Je me sens vivant et dynamique physiquement. | Non |

## Diagnostic 5 niveaux (labels Jacky actés — messages drafts Claude à valider)

### Niveau 1 — Corps déconditionné
- **Label** : `Corps déconditionné`
- **Message** : `Ton corps a peu bougé ces derniers temps. Pas de jugement — c'est exactement le terrain où une semaine de mouvement doux change le plus de choses.`

### Niveau 2 — Remise en mouvement nécessaire
- **Label** : `Remise en mouvement nécessaire`
- **Message** : `Tu bouges, mais sans régularité. Cette semaine va te donner une base stable et un rythme reproductible.`

### Niveau 3 — Base physique présente
- **Label** : `Base physique présente`
- **Message** : `Tu maintiens un niveau d'activité correct. La semaine va t'aider à ajouter de la qualité au mouvement, pas juste de la quantité.`

### Niveau 4 — Condition physique fonctionnelle
- **Label** : `Condition physique fonctionnelle`
- **Message** : `Tu as une base solide. Cette semaine va t'aider à affiner — chercher la finesse plutôt que l'intensité.`

### Niveau 5 — Corps dynamique et adaptable
- **Label** : `Corps dynamique et adaptable`
- **Message** : `Ton corps est entraîné, ton mouvement est intégré. La semaine consolide en jouant sur la variété et la récupération.`

## Programme 7 jours (rotation Jacky)

| Jour | Type séance | Titre | Objectif |
|---|---|---|---|
| J1 | Endurance | Remise en mouvement | Réveiller le système cardio-vasculaire à effort modéré. |
| J2 | Mobilité | Libérer les articulations | Lubrifier ce qui s'est figé. Pas d'effort, de l'attention. |
| J3 | Renforcement | Construire la structure | Circuit léger : squats, pompes, fentes, gainage. |
| J4 | Endurance | Tenir le rythme | Marche ou footing. Respiration nasale. Pouvoir parler. |
| J5 | Relâchement | Laisser le corps redescendre | Jambes contre le mur. Récupération active. |
| J6 | Renforcement | Ancrer la structure | Reprise du circuit J3, un peu plus long. |
| J7 | OFF | Repos complet | L'équilibre crée le progrès. Pas de séance. |

## Vidéo intro pilier (Brief Session 3)

- **Asset** : `media.s2.video-intro`
- **Format** : 9:16, 60-90s
- **Script intention** : Présenter S2 Activité physique. "Tu n'as rien à réfléchir. Tu fais la séance. Ton corps fait le reste."
- **Script texte** : [à produire Brief Session 3]

## Effet miroir fin de pilier (IA-47 récap)

- **Delta positif (> +5)** : `Tu as bougé plus en sept jours qu'en plusieurs mois. Le corps répond très vite au mouvement.`
- **Delta léger (1 à 5)** : `Le corps a reçu un signal, même si le score bouge peu. La régularité fait son travail.`
- **Delta stable (-1 à +1)** : `Le score n'a pas bougé. Le ressenti, lui, a souvent déjà commencé.`
- **Delta négatif (< -1)** : `Le score a baissé — ça arrive. Les 12 questions captent un instantané, ton ressenti compte plus que ce chiffre.`

## Mapping profil onboarding → niveau de départ (D15)

Drafts Claude — à valider Jacky.

| Profil | Niveau de départ S2 |
|---|---|
| P0 (terrain équilibré) | Progression |
| P1 (reboot complet) | Essentiel |
| P2 (remontée énergétique) | Essentiel |
| P3 (corps+mental à relancer) | Essentiel |
| P4 (lancé) | Immersion |
| P5 (base solide) | Progression |
| P6 (corps veut se relancer) | Essentiel |
| P7 (mental mène tout) | Progression |
| P8 (petit pas) | Essentiel |

## Notes voix

- Pas de "champion", pas de "warrior"
- "Tu fais la séance" — formule Jacky directe
- Le mouvement = signal, pas dette
- Récupération = travail, pas absence

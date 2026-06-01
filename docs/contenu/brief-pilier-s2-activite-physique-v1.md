# Brief contenu — Pilier S2 Activité physique V1

**Statut** : Drafts Claude basés sur matière Jacky V0 (`docs/matiere-jacky/V0_PILIER 2 — ACTIVITÉ PHYSIQUE.docx`). 12 questions évaluation + diagnostics inférés — à valider Jacky en session dédiée.
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

## 12 questions évaluation (drafts Claude)

Échelle 1-5 (`1 = jamais / très loin de moi` à `5 = presque toujours`).

| # | Question | Inversion |
|---|---|---|
| Q1 | Je bouge mon corps tous les jours, ne serait-ce qu'un peu. | Non |
| Q2 | Je marche au moins 30 minutes par jour. | Non |
| Q3 | Je me sens à l'aise dans mon corps en mouvement. | Non |
| Q4 | J'ai une activité physique structurée au moins 2 fois par semaine. | Non |
| Q5 | Je récupère rapidement après un effort modéré. | Non |
| Q6 | Je m'essouffle facilement à l'effort. | Oui |
| Q7 | Je ressens des tensions ou raideurs corporelles régulières. | Oui |
| Q8 | J'évite les escaliers ou les efforts physiques quotidiens. | Oui |
| Q9 | J'ai assez de force pour porter mes affaires sans gêne. | Non |
| Q10 | Mon équilibre est stable, je ne trébuche pas facilement. | Non |
| Q11 | Je connais mes limites physiques et je les respecte. | Non |
| Q12 | Mon corps me semble fluide quand je bouge. | Non |

## Diagnostic 5 niveaux (drafts Claude — voix Mimi/Jacky)

### Niveau 1 — Sédentaire
- **Label** : `Sédentaire`
- **Message** : `Ton corps a peu bougé ces derniers temps. Pas de jugement — c'est exactement le terrain où une semaine de mouvement doux change le plus de choses.`

### Niveau 2 — Mouvement irrégulier
- **Label** : `Mouvement irrégulier`
- **Message** : `Tu bouges, mais sans régularité. Cette semaine va te donner une base stable et un rythme reproductible.`

### Niveau 3 — Activité d'entretien
- **Label** : `Activité d'entretien`
- **Message** : `Tu maintiens un niveau d'activité correct. La semaine va t'aider à ajouter de la qualité au mouvement, pas juste de la quantité.`

### Niveau 4 — Bonne base active
- **Label** : `Bonne base active`
- **Message** : `Tu as une base solide. Cette semaine va t'aider à affiner — chercher la finesse plutôt que l'intensité.`

### Niveau 5 — Corps acquis
- **Label** : `Corps acquis`
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

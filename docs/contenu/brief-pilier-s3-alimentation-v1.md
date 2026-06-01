# Brief contenu — Pilier S3 Alimentation V1

**Statut** : Drafts Claude basés sur matière Jacky V0 (`docs/matiere-jacky/V0_PILIER 3 — ALIMENTATION.docx`). Questions + diagnostics + programme **livrés intégralement** par Jacky dans le doc V0 — intégration directe.
**Cible code** :
- `src/data/s3-evaluation.ts` (12 questions + diagnostic 5 niveaux)
- `src/data/s3-program.ts` (programme 7 jours)
- `src/data/pillar-registry.ts` (meta pillar S3)

**Cadrage** : Feature Spec S1 Respiration V1.0 (pattern référence) + Métriques V1.5 + matière Jacky brute

## Type pilier

- **Type** : A — paramètre principal modulé par niveau d'engagement
- **Session type** : `acte_libre` — pas de timer, validation manuelle de l'acte (moment alimentaire fait)
- **Paramètre principal** : intensité du protocole alimentaire (jeûne intermittent + repas fruits + repas vitalité)
- **3 niveaux Jacky** :
  - **Essentiel** : repousser le 1er repas si possible / fruits midi + salade possible / repas vitalité simple soir
  - **Progression** : jeûne intermittent partiel matin / gros repas fruits midi / repas vitalité structuré soir
  - **Immersion** : jeûne intermittent complet matin / repas fruits dominant (60-70% calories) midi / repas vitalité très simple soir

## 12 questions évaluation (matière Jacky V0)

Échelle 1-5 (`1 = jamais / très loin de moi` à `5 = presque toujours`).

| # | Question | Inversion |
|---|---|---|
| Q1 | Mon alimentation est composée principalement d'aliments frais et peu transformés. | Non |
| Q2 | Je consomme régulièrement des fruits dans la journée. | Non |
| Q3 | Mon énergie reste stable après les repas. | Non |
| Q4 | Je ressens souvent de la fatigue après avoir mangé. | Oui |
| Q5 | Je me sens léger après mes repas. | Non |
| Q6 | Je ressens des ballonnements, lourdeurs ou inconfort digestif. | Oui |
| Q7 | Je bois de l'eau régulièrement dans la journée. | Non |
| Q8 | Je consomme souvent des produits industriels ou transformés. | Oui |
| Q9 | Je ressens clairement la vraie faim, différente d'une envie ou d'un automatisme. | Non |
| Q10 | Je mange souvent devant un écran ou en étant distrait. | Oui |
| Q11 | Mon alimentation est simple, lisible et facile à digérer. | Non |
| Q12 | Certains aliments me fatiguent, me ralentissent ou me donnent une sensation de lourdeur. | Oui |

**Note** : 5 questions inversées (au lieu de 3 pour S1) — formulations négatives explicites Jacky.

## Diagnostic 5 niveaux (matière Jacky V0)

### Niveau 1 — Alimentation contraignante
- **Label** : `Alimentation contraignante`
- **Message** : `Ton alimentation demande probablement beaucoup d'énergie à ton corps. La digestion peut devenir une charge importante. Cette semaine, on va simplement alléger ce qui surcharge et observer comment ton corps répond.`

### Niveau 2 — Alimentation coûteuse
- **Label** : `Alimentation coûteuse`
- **Message** : `Certaines bases sont présentes, mais ton corps compense encore beaucoup après les repas. Cette semaine va t'aider à voir ce qui se libère quand la charge digestive baisse.`

### Niveau 3 — Alimentation instable
- **Label** : `Alimentation instable`
- **Message** : `Ton alimentation peut parfois soutenir ton énergie, mais elle reste irrégulière selon les repas, les horaires ou les choix. Cette semaine va t'aider à créer un cadre simple et reproductible.`

### Niveau 4 — Alimentation soutenante
- **Label** : `Alimentation soutenante`
- **Message** : `Ton alimentation commence à soutenir ton énergie, ta digestion et ta stabilité. La semaine va t'aider à affiner — chercher la simplicité qui libère encore plus.`

### Niveau 5 — Alimentation régénérante
- **Label** : `Alimentation régénérante`
- **Message** : `Ton alimentation est déjà très proche d'un fonctionnement simple, vivant et cohérent avec ton corps. La semaine consolide en jouant sur la finesse plutôt que sur le changement.`

## Programme 7 jours (matière Jacky V0)

| Jour | Titre | Objectif |
|---|---|---|
| J1 | Découvrir | Tester sans chercher la perfection. |
| J2 | Décaler | Repousser un peu le premier repas. |
| J3 | Ressentir | Créer le premier contraste. |
| J4 | Stabiliser | Stabiliser l'énergie. |
| J5 | Alléger | Réduire clairement la charge digestive. |
| J6 | Fluidifier | Rendre l'expérience plus naturelle. |
| J7 | Comprendre | Faire le lien entre alimentation, digestion et énergie. |

## 3 moments par jour

Chaque jour, l'utilisateur valide 3 actes alimentaires :

- **Matin — Activation naturelle** : note l'heure du 1er repas
- **Midi — Recharge vivante** : repas fruits selon niveau d'engagement
- **Soir — Repas vitalité** : repas végétal selon niveau d'engagement

Validation streak Phase 1 : 1 acte sur 3 minimum (D6).

## Ressenti après repas (V2 potentiel)

Le doc Jacky V0 propose 3 micro-questions après repas midi + soir (énergie, ventre, clarté mentale). **Hors-scope V1** — à reporter Sprint Phase 2 (questionnaire fin de journée différé D36).

## Vidéo intro pilier (Brief Session 3)

- **Asset** : `media.s3.video-intro`
- **Format** : 9:16, 60-90s
- **Script intention** : *"Cette semaine, on isole un seul levier : l'alimentation. Pas parce que le reste n'est pas important, mais parce que c'est la seule façon de ressentir clairement ce que ce pilier change dans ton énergie, ta digestion et ta clarté mentale. L'objectif n'est pas de devenir parfait. C'est de faire une expérience simple pendant 7 jours et d'observer la réponse du corps."* (Mimi/Jacky V0 brut).
- **Script texte** : [à produire Brief Session 3]

## Effet miroir fin de pilier (IA-47 récap)

Inspiré de la section observation finale Jacky V0.

- **Delta positif (> +5)** : `Sept jours de pratique ont déplacé ton score de manière nette. Ton corps a libéré une énergie qui était mobilisée par la digestion.`
- **Delta léger (1 à 5)** : `Tu as commencé à alléger ce qui surchargeait. Ce que tu ressens n'est pas une impression — c'est une réponse du corps.`
- **Delta stable (-1 à +1)** : `Le score n'a pas bougé. Mais la lecture du corps, elle, a souvent déjà commencé.`
- **Delta négatif (< -1)** : `Le score a baissé — ça arrive. Les 12 questions captent un instantané, ton ressenti compte plus que ce chiffre.`

## Phrase de positionnement clé (Jacky)

> "Simple ne veut pas dire faible. Simple veut dire lisible pour le corps."

À utiliser dans la vidéo intro ou en moment narratif clé J3 ou J5.

## Mapping profil onboarding → niveau de départ (D15)

Drafts Claude — à valider Jacky.

| Profil | Niveau de départ S3 |
|---|---|
| P0 (terrain équilibré) | Progression |
| P1 (reboot complet) | Essentiel |
| P2 (remontée énergétique) | Essentiel |
| P3 (corps+mental à relancer) | Essentiel |
| P4 (lancé) | Progression |
| P5 (base solide) | Progression |
| P6 (corps veut se relancer) | Progression |
| P7 (mental mène tout) | Essentiel |
| P8 (petit pas) | Essentiel |

## Notes voix

- "Simple ne veut pas dire faible" — formule clé Jacky
- Pas de "régime", pas de "diète", pas de "détox" (réservé S8)
- Le mot-clé : **alléger** (charge digestive)
- Reconnaissance posée du corps qui répond, pas mérite du user

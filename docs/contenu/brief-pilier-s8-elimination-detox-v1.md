# Brief contenu — Pilier S8 Élimination et détox V1

**Statut** : Drafts Claude basés sur matière Jacky V0 (`docs/matiere-jacky/V0_PILIER 8 — ÉLIMINATION & DÉTOX.docx`). 12 questions + 5 diagnostics + 3 niveaux + protocole **livrés explicitement** par Jacky.
**Cible code** :
- `src/data/s8-evaluation.ts` (12 questions + 5 diagnostics)
- `src/data/s8-program.ts` (programme 7 jours)
- `src/data/pillar-registry.ts` (meta pillar S8)

**Cadrage** : Feature Spec S1 Respiration V1.0 (pattern référence) + Métriques V1.5 + matière Jacky brute

## Type pilier

- **Type** : A — paramètre principal modulé par niveau d'engagement (volumes)
- **Session type** : `acte_libre` — validation manuelle des actions quotidiennes
- **Paramètre principal** : quantité de jus/isotonique + dose psyllium
- **3 niveaux Jacky** :
  - **Essentiel** : 500 ml-1 L jus + psyllium 1 c.c. matin et soir
  - **Progression** : 1-1,5 L jus + psyllium 1 c.c. matin/midi/soir
  - **Immersion** : 1,5-2 L jus + psyllium 1 c.s. matin et soir

## Message central Jacky V0

> "Tu ne vas pas faire une détox extrême. Tu vas simplement apporter plus d'eau, plus de minéraux et plus de fluidité pour aider ton corps à mieux éliminer."

## 2 actions quotidiennes (Jacky V0)

**Action 1** : Jus frais ou alternative eau de mer isotonique
- Option A : jus frais (60-70% légumes/feuilles, 30-40% fruits), pris le matin ou 30 min avant repas
- Option B (sans juicer) : eau de mer isotonique = 250 ml eau de mer + 750 ml eau douce pour 1 L

**Action 2** : Psyllium
- 1 cuillère à café matin / midi / soir avec beaucoup de liquide
- Option selles très liquides : 1 cuillère à soupe matin et soir

## 12 questions évaluation (matière Jacky V0)

Échelle 1-5.

| # | Question | Inversion |
|---|---|---|
| Q1 | Mon transit est régulier. | Non |
| Q2 | Je vais à la selle facilement. | Non |
| Q3 | Mon ventre est confortable. | Non |
| Q4 | Je me sens souvent lourd ou chargé. | Oui |
| Q5 | J'ai des ballonnements. | Oui |
| Q6 | J'ai parfois des selles sèches ou difficiles à évacuer. | Oui |
| Q7 | Je me sens bien hydraté. | Non |
| Q8 | Je consomme régulièrement des jus, fruits ou légumes riches en eau. | Non |
| Q9 | Mon énergie est stable. | Non |
| Q10 | Ma digestion est fluide. | Non |
| Q11 | Je ressens que mon corps élimine correctement. | Non |
| Q12 | Je me sens léger dans mon ventre. | Non |

3 questions inversées (Q4, Q5, Q6) — formulations négatives directement Jacky.

## Diagnostic 5 niveaux (matière Jacky V0)

| Niveau | Label |
|---|---|
| 1 | Élimination ralentie |
| 2 | Système chargé |
| 3 | Élimination irrégulière |
| 4 | Élimination fonctionnelle |
| 5 | Élimination fluide |

Messages d'accueil : cf. `src/data/s8-evaluation.ts` constante `S8_DIAGNOSTICS`.

## Programme 7 jours (adaptation V1)

Le doc Jacky V0 propose un programme **identique chaque jour** (l'élimination a besoin de régularité). Adaptation V1 : 7 jours avec focus narratif progressif.

| Jour | Titre | Focus |
|---|---|---|
| J1 | Démarrer simple | Première prise + psyllium |
| J2 | Maintenir le signal | Routine + observer transit |
| J3 | Affiner les quantités | Augmenter si confort |
| J4 | Observer le transit | Selles/ventre/énergie/clarté |
| J5 | Approfondir si confort | Niveau supérieur |
| J6 | Consolider | Maintenir rythme |
| J7 | Intégrer le rythme | Sans consigne + cumul |

## Réactions normales (Jacky V0)

À afficher dans l'app :
- Transit plus fréquent
- Selles plus molles
- Ventre qui gargouille
- Sensation de nettoyage
- Besoin d'aller aux toilettes plus souvent
- Énergie qui bouge

> "Quand tu ajoutes jus, minéraux et fluidité, le corps peut en profiter pour évacuer. C'est une réponse normale tant que tu te sens globalement bien, plus léger et plus clair."

## Message sécurité (Jacky V0)

> "Si tu ressens un malaise important, une douleur forte, une fatigue excessive ou une réaction inhabituelle, arrête le protocole et adapte. Ce programme ne remplace pas un avis médical."

À afficher en intro pilier (IA-41).

## Vidéo intro pilier (Brief Session 3)

- **Asset** : `media.s8.video-intro`
- **Format** : 9:16, 60-90s
- **Phrase clé Jacky** : *"Tu ne vas pas faire une détox extrême. Tu vas simplement apporter plus d'eau, plus de minéraux et plus de fluidité."*
- **Phrase fin Jacky** : *"Tu n'as pas forcé ton corps : tu lui as donné les conditions pour mieux évacuer."*
- **Script texte** : [à produire Brief Session 3]

## Effet miroir fin de pilier (IA-47 récap)

Inspiré observation finale Jacky V0.

- **Delta positif (> +5)** : `Sept jours de fluidité ont déjà transformé ton transit, ton ventre et ton énergie. Le corps répond très vite quand on lui donne les bonnes conditions.`
- **Delta léger (1 à 5)** : `Tu as ouvert un circuit. Ton ventre, ton transit, ta clarté — ces signaux sont une vraie réponse, pas une impression.`
- **Delta stable (-1 à +1)** : `Le score n'a pas bougé. Mais le ressenti de légèreté, lui, a souvent déjà commencé.`
- **Delta négatif (< -1)** : `Le score a baissé — ça arrive. Les 12 questions captent un instantané, ton ressenti compte plus que ce chiffre.`

## Mapping profil onboarding → niveau de départ (D15)

Drafts Claude — à valider Jacky.

| Profil | Niveau de départ S8 |
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

- "Fluidité" — mot-clé Jacky
- Pas de "détox" extrême (V0 doc utilise le mot mais positionne contre)
- Pas de "purification", pas de "purge"
- Le mot-clé : **circulation**, **évacuation**, **soutien**
- Phrase clé : *"Tu n'as pas forcé ton corps : tu lui as donné les conditions."*

## Projection fin de Phase 1 (Jacky V0)

> "Ce pilier est une porte d'entrée. Dans un accompagnement plus profond, l'élimination peut être travaillée avec beaucoup plus de précision, selon ton terrain, ton énergie et ta capacité de récupération."

Lien vers le mentorat IA-60 (Sprint 18 — déjà câblé en sortie S8).

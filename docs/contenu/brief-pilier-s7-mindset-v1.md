# Brief contenu — Pilier S7 Mindset V1

**Statut** : Drafts Claude basés sur matière Jacky V0 (`docs/matiere-jacky/V0_PILIER 7 — MINDSET.docx`). 12 questions + 5 diagnostics + programme progressif 3 phases **livrés explicitement** par Jacky. Type **B atypique** (D41).
**Cible code** :
- `src/data/s7-evaluation.ts` (12 questions + 5 diagnostics)
- `src/data/s7-program.ts` (programme 7 jours 3 phases Observer/Transformer/Impact)
- `src/data/pillar-registry.ts` (meta pillar S7 type B)

**Cadrage** : Feature Spec S1 Respiration V1.0 (pattern référence) + Métriques V1.5 + matière Jacky brute

## Type pilier — B atypique (D41)

- **Type** : B — pas de mapping diagnostic → engagement de départ
- **Session type** : `acte_libre` — validation manuelle des observations/transformations comptées
- **Pas de paramètre principal modulé** par niveau d'engagement (pas de durations en minutes)
- **Tout le monde démarre au même endroit**

## Spécificité S7 — programme progressif 3 phases (Jacky V0)

Logique de transformation Jacky : **Voir → Agir → Ressentir**.

| Phase | Jours | Objectif |
|---|---|---|
| Observer | J1-J2 | Voir les pensées négatives |
| Transformer | J3-J4 | Changer l'angle |
| Impact | J5-J6-J7 | Ressentir l'effet réel |

## Positionnement Jacky

> "Ce n'est pas ce qui t'arrive qui te fatigue. C'est la manière dont ton mental le traite."

## 12 questions évaluation (matière Jacky V0)

Échelle 1-5.

| # | Question | Inversion |
|---|---|---|
| Q1 | Je remarque facilement mes pensées. | Non |
| Q2 | Mes pensées sont souvent négatives. | Oui |
| Q3 | Je rumine souvent. | Oui |
| Q4 | Je me laisse emporter par mes émotions. | Oui |
| Q5 | J'arrive à prendre du recul. | Non |
| Q6 | Je vois facilement du positif. | Non |
| Q7 | Je ressens du stress régulièrement. | Oui |
| Q8 | Mon mental tourne beaucoup. | Oui |
| Q9 | Je me sens stable émotionnellement. | Non |
| Q10 | Je peux changer mon état rapidement. | Non |
| Q11 | Je reste longtemps dans le négatif. | Oui |
| Q12 | Je me sens maître de mes réactions. | Non |

**Note** : 6 questions inversées — cohérent avec densité matière Jacky brute (formulations négatives directes).

## Diagnostic 5 niveaux (matière Jacky V0)

| Niveau | Label |
|---|---|
| 1 | Mental subi |
| 2 | Mental réactif |
| 3 | Mental instable |
| 4 | Mental en évolution |
| 5 | Mental orienté |

Messages d'accueil : cf. `src/data/s7-evaluation.ts` constante `S7_DIAGNOSTICS`.

## Programme 7 jours (3 phases Jacky)

| Jour | Titre | Phase |
|---|---|---|
| J1 | Voir | Observer |
| J2 | Continuer à voir | Observer |
| J3 | Transformer | Transformer |
| J4 | Pratiquer la transformation | Transformer |
| J5 | Ressentir l'impact | Impact |
| J6 | Intégrer l'impact | Impact |
| J7 | Consolider | Impact |

Cf. `src/data/s7-program.ts` constante `S7_PROGRAM`.

## Mécanique tracking (Jacky V0)

**Hors-scope V1 simple** — V1 garde validation binaire fait/pas fait.

Jacky V0 propose un tracking détaillé :
- **J1-J2** : compteur Observation (0-5 bas / 5-10 moyen / 10-15+ élevé)
- **J3-J4** : compteur Observation + Transformation
- **J5-J7** : compteur Observation + Transformation + Impact (aucun/modéré/fort)

À considérer Sprint code S7 livraison pour UX riche.

## Vidéo intro pilier (Brief Session 3)

- **Asset** : `media.s7.video-intro`
- **Format** : 9:16, 60-90s
- **Phrase clé Jacky** : *"Ce n'est pas ce qui t'arrive qui te fatigue. C'est la manière dont ton mental le traite."*
- **Phrase fin Jacky** : *"Tu n'as pas changé les situations. Tu as changé leur impact."*
- **Script texte** : [à produire Brief Session 3]

## Effet miroir fin de pilier (IA-47 récap)

Inspiré observation finale Jacky V0.

- **Delta positif (> +5)** : `Sept jours t'ont suffi à reprendre la main sur ton mental. Tu vois plus, tu interviens plus, tu ressens l'impact direct.`
- **Delta léger (1 à 5)** : `Tu as commencé à influencer ton état. Même une seule intervention change déjà ton fonctionnement.`
- **Delta stable (-1 à +1)** : `Le score n'a pas bougé. Mais la capacité à voir ce qui se passe en toi, elle, a souvent déjà changé.`
- **Delta négatif (< -1)** : `Le score a baissé — ça arrive. Les 12 questions captent un instantané, ton ressenti compte plus que ce chiffre.`

## Mapping profil onboarding → niveau de départ

**Non applicable Type B** (D41). Tout le monde démarre avec le même programme.

## Notes voix

- "Voir / Agir / Ressentir" — formule clé Jacky (3 étapes)
- "Observer une pensée" — pas "méditer", pas "mindfulness" (jargon)
- "Mental subi → mental orienté" — direction du parcours
- Phrase clé : *"Ce n'était pas la réalité. C'était ton interprétation."*

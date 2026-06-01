# Brief contenu — Pilier S5 Repos et régénération V1

**Statut** : Drafts Claude basés sur matière Jacky V0 (`docs/matiere-jacky/V0_PILIER 5 — REPOS & RÉGÉNÉRATION.docx`). 12 questions + 5 diagnostics **livrés explicitement** par Jacky. Type **B atypique** (D41).
**Cible code** :
- `src/data/s5-evaluation.ts` (12 questions + 5 diagnostics)
- `src/data/s5-program.ts` (programme 7 jours, principe répétition)
- `src/data/pillar-registry.ts` (meta pillar S5 type B)

**Cadrage** : Feature Spec S1 Respiration V1.0 (pattern référence) + Métriques V1.5 + matière Jacky brute

## Type pilier — B atypique (D41)

- **Type** : B — pas de mapping diagnostic → engagement de départ
- **Session type** : `acte_libre` — validation binaire fait/pas fait des 3 actions quotidiennes
- **Pas de paramètre principal modulé** par niveau d'engagement
- **Tout le monde démarre au même endroit** (pas de niveau Essentiel/Progression/Immersion)

## Spécificité S5 — répétition (Jacky V0)

> "Contrairement aux autres piliers : le programme est identique chaque jour pendant 7 jours. La transformation vient de la régularité."

Adaptation V1 : 7 jours avec focus différent par jour mais structure identique (lumière matin + écrans soir + obscurité nuit). Permet une narration pédagogique progressive sans trahir le principe.

## 3 moments / jour (Jacky V0)

- **Matin** : signal de jour (lumière naturelle dans les 10 min du réveil)
- **Soir** : descente nerveuse (écrans coupés 1h+ avant coucher)
- **Nuit** : régénération (obscurité totale + téléphone hors chambre)

Validation streak Phase 1 : 1 action sur 3 minimum (D6).

## 12 questions évaluation (matière Jacky V0)

Échelle 1-5.

| # | Question | Inversion |
|---|---|---|
| Q1 | Je m'endors facilement. | Non |
| Q2 | Je me réveille reposé. | Non |
| Q3 | Je me réveille la nuit. | Oui |
| Q4 | Je me couche tard. | Oui |
| Q5 | J'utilise des écrans le soir. | Oui |
| Q6 | Je me lève avec difficulté. | Oui |
| Q7 | Mon énergie est stable dans la journée. | Non |
| Q8 | Je dors dans l'obscurité totale. | Non |
| Q9 | Mon sommeil est profond. | Non |
| Q10 | Je ressens du stress en soirée. | Oui |
| Q11 | Je respecte des horaires de coucher réguliers. | Non |
| Q12 | Je me sens récupéré physiquement au réveil. | Non |

**Note** : 5 questions inversées — cohérent avec formulations explicites Jacky V0.

## Diagnostic 5 niveaux (matière Jacky V0)

| Niveau | Label |
|---|---|
| 1 | Rythme très désorganisé |
| 2 | Récupération instable |
| 3 | Base correcte mais irrégulière |
| 4 | Rythme soutenant |
| 5 | Rythme régénérateur |

Messages d'accueil : cf. `src/data/s5-evaluation.ts` constante `S5_DIAGNOSTICS`.

## Programme 7 jours (drafts Claude)

Structure identique (3 actions matin/soir/nuit) avec focus narratif progressif.

| Jour | Titre | Focus |
|---|---|---|
| J1 | Démarrer le rythme | Trois actions : lumière matin, écrans soir, obscurité nuit |
| J2 | Lumière du matin | Focus exposition lumière 10 min du réveil |
| J3 | Écrans du soir | Focus arrêt écrans 1h+ avant coucher |
| J4 | Obscurité totale | Focus pièce noir complet, téléphone hors chambre |
| J5 | Tout ensemble | Les trois actions sans rappel |
| J6 | Affiner | Heure exacte coucher par rapport coucher de soleil |
| J7 | Intégrer le rythme | Reproduire sans suivre de consigne |

## Critères de réussite (Jacky V0)

### Matin — Exposition lumière naturelle
- ≤ 10 min après réveil → excellent
- ≤ 30 min → très bien
- ≤ 1h → correct
- > 1h → à améliorer

### Soir — Arrêt écrans
- 2h avant coucher → excellent
- 1h avant → très bien
- 30 min avant → correct
- Écran jusqu'au coucher → à améliorer

### Nuit — Coucher après coucher du soleil
- 0-30 min après → excellent
- 30-60 min → très bien
- 1-2h → correct
- > 2h → à améliorer

### Nuit — Obscurité
- Totale → excellent
- Faible lumière → correct
- Lumière visible → à améliorer

**Note** : ces critères pourraient enrichir le tracking V1.1+ avec scoring détaillé. V1 reste simple validation 3 actions fait/pas fait.

## Vidéo intro pilier (Brief Session 3)

- **Asset** : `media.s5.video-intro`
- **Format** : 9:16, 60-90s
- **Phrase clé Jacky** : *"Ton sommeil ne dépend pas seulement du nombre d'heures. Il dépend du rythme, de la lumière et de l'environnement que tu crées."*
- **Phrase fin Jacky** : *"Tu viens de recréer les conditions naturelles de la régénération."*
- **Script texte** : [à produire Brief Session 3]

## Effet miroir fin de pilier (IA-47 récap)

Inspiré observation finale Jacky V0.

- **Delta positif (> +5)** : `Sept jours ont suffi à recaler ton rythme circadien. Ton sommeil est plus profond, ton énergie plus stable — pas par hasard.`
- **Delta léger (1 à 5)** : `Tu commences à structurer un rythme. Le corps reçoit des signaux clairs et il s'adapte.`
- **Delta stable (-1 à +1)** : `Le score n'a pas bougé. Mais le ressenti de récupération, lui, a souvent déjà commencé.`
- **Delta négatif (< -1)** : `Le score a baissé — ça arrive. Les 12 questions captent un instantané, ton ressenti compte plus que ce chiffre.`

## Mapping profil onboarding → niveau de départ

**Non applicable Type B** (D41). Tout le monde démarre avec le même programme.

## Notes voix

- "Rythme" — mot-clé Jacky
- "Régénération" — pas "récupération" (mécanique distincte)
- Pas de "sommeil réparateur", pas de "hygiène de sommeil" (jargon)
- Trois conditions, pas de niveaux d'intensité
- Phrase clé : *"Ton corps se régénère dans l'obscurité."*

# Feature Spec — Pilier S5 Repos et régénération V1.0

**Date** : 29 mai 2026
**Statut** : V1.0 stable — intégration matière Jacky V0. Type **B atypique** (D41) — pas de mapping diagnostic → engagement.
**Source matière** : `docs/matiere-jacky/V0_PILIER 5 — REPOS & RÉGÉNÉRATION.docx`
**Cadrage** : Feature Spec S1 V1.0 (pattern référence) + Métriques V1.5 + Brief contenu Session 3

---

## 1. Rôle du pilier

S5 est la cinquième semaine de Phase 1. Premier pilier **Type B** (atypique).

Principe Jacky : *"Le programme est identique chaque jour pendant 7 jours. La transformation vient de la régularité."*

Objectif produit :
- Réaligner le rythme circadien
- Améliorer la qualité du sommeil
- Augmenter l'énergie diurne
- Activer la régénération nocturne

---

## 2. Évaluation initiale (12 questions)

### 2.1 Format

- 12 questions auto-déclaratives
- Échelle 1-5
- 5 questions inversées (Q3/Q4/Q5/Q6/Q10) — formulations négatives sommeil/écrans/stress

### 2.2 Questions

Cf. `src/data/s5-evaluation.ts` constante `S5_EVALUATION_QUESTIONS`.

### 2.3 Diagnostic 5 niveaux

| Niveau | Label |
|---|---|
| 1 | Rythme très désorganisé |
| 2 | Récupération instable |
| 3 | Base correcte mais irrégulière |
| 4 | Rythme soutenant |
| 5 | Rythme régénérateur |

Messages d'accueil : cf. `src/data/s5-evaluation.ts` constante `S5_DIAGNOSTICS`.

---

## 3. Spécificité Type B — pas de paramètre principal modulé

### 3.1 D41 Type B atypique

- Pas de niveau Essentiel/Progression/Immersion
- Pas de durations modulées
- Tout le monde démarre au même endroit
- La modulation se fait par la **régularité** d'application (combien de jours sur 7 les 3 actions sont validées)

### 3.2 SessionType — `acte_libre`

3 actions binaires fait/pas fait par jour :
1. Matin — exposition lumière naturelle (10 min mini)
2. Soir — écrans coupés 1h+ avant coucher
3. Nuit — obscurité totale + téléphone hors chambre

### 3.3 Pas de mapping diagnostic → engagement

L'engagement Essentiel/Progression/Immersion **ne s'applique pas à S5** (Type B). L'évaluation initiale sert uniquement à mesurer un point de départ et à comparer avec l'évaluation finale.

---

## 4. Programme 7 jours (Jacky : identique chaque jour)

Adaptation V1 : 7 jours avec focus narratif progressif mais structure identique.

| Jour | Titre | Focus |
|---|---|---|
| J1 | Démarrer le rythme | Trois actions |
| J2 | Lumière du matin | Focus exposition lumière |
| J3 | Écrans du soir | Focus arrêt écrans |
| J4 | Obscurité totale | Focus pièce noir |
| J5 | Tout ensemble | Les trois actions sans rappel |
| J6 | Affiner | Heure coucher / coucher de soleil |
| J7 | Intégrer le rythme | Reproduire sans consigne |

Cf. `src/data/s5-program.ts` constante `S5_PROGRAM`.

---

## 5. Sessions / jour

3 sessions = 3 moments :
- Matin (signal de jour)
- Soir (descente nerveuse)
- Nuit (régénération)

Validation streak Phase 1 : 1 action sur 3 minimum (D6).

---

## 6. Niveau adaptatif (IA-44)

**Non applicable Type B** — pas de modulation Moins/Pareil/Plus. L'IA-44 sera masquée pour S5 (déjà géré par `showAdaptiveBtn = meta.sessionType !== 'acte_libre'`).

---

## 7. Évaluation finale

Identique S1 — mêmes 12 questions, recalcule score, compare delta, met à jour branche Toile.

---

## 8. Slots de copy

| Slot | Description |
|---|---|
| `copy.IA-40.s5.q1` à `q12` | 12 questions évaluation |
| `copy.IA-40.s5.diag1` à `diag5` | 5 messages diagnostic |
| `copy.IA-41.s5.intro-pilier` | Texte accompagnement vidéo intro |
| `copy.IA-43.s5.j1-explication` à `j7` | 7 pédagogies jour |
| `copy.IA-47.s5.recap-final` | Texte récap fin de pilier |

---

## 9. Médias

### 9.1 Vidéo intro pilier

- **Asset** : `media.s5.video-intro`
- **Format** : 9:16, 60-90s
- **Phrase clé Jacky** : *"Ton sommeil ne dépend pas du nombre d'heures. Il dépend du rythme, de la lumière et de l'environnement."*

### 9.2 Visuels in-app

Pictogramme S5 : Moon (lucide-react-native) — déjà câblé S02Screen roadmap.

---

## 10. Notifications S5 (D12 reporté)

Draft Claude :
- S5 message fond : *"Le sommeil n'est pas une absence — c'est un travail. Donne-lui ses conditions."*

---

## 11. Edge cases

- **Travail de nuit** : adapter principes (lumière artificielle au "réveil", obscurité diurne). Cas particulier non couvert V1 — disclaimer onboarding pilier.
- **Insomnie chronique** : recommander consultation pro. Pas de blocage UX.
- **Enfants en bas âge** : impossibilité de respecter rythme — accepter le compromis sans culpabiliser.

---

## 12. Validation Jacky requise

1. **Adaptation 7 jours** (Jacky propose identique, V1 introduit focus narratif progressif)
2. **Pédagogies par jour** (7 messages narratifs)
3. **Type B sans niveau** : confirmer pas de mapping profil → niveau
4. **Tracking détaillé** : décider si on intègre critères de réussite (≤10min, ≤1h…) V1.1+ ou simple validation V1
5. **Score régénération** quotidien : reporté V2 (D34)

---

## Annexe — Référence matière Jacky V0

Matière brute : `docs/matiere-jacky/V0_PILIER 5 — REPOS & RÉGÉNÉRATION.docx`

Format Jacky V0 :
- 12 questions évaluation explicites
- 5 diagnostics (Très faible → Optimal)
- Programme identique chaque jour 7 jours
- 3 moments structurés (matin/soir/nuit)
- Critères de réussite par tranches horaires
- Score quotidien "régénération" (hors-scope V1, D34)
- Micro-messages engagement J2/J4/J6
- Phrase clé : "Ton corps se régénère dans l'obscurité."

Adaptation V1 :
- Intégration directe questions + diagnostics
- Programme 7 jours adapté (focus progressif vs identique Jacky)
- Type B confirmé (D41 — pas de niveau Essentiel/Progression/Immersion)
- Tracking détaillé reporté ou décision UX Sprint code S5
- Score quotidien hors-scope V1

---

*Fin du Feature Spec S5 V1.0.*

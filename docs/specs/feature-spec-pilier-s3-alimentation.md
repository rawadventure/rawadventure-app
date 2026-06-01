# Feature Spec — Pilier S3 Alimentation V1.0

**Date** : 29 mai 2026
**Statut** : V1.0 stable — intégration directe matière Jacky V0 (12 questions + 5 diagnostics + 7 jours fournis explicitement par Jacky).
**Source matière** : `docs/matiere-jacky/V0_PILIER 3 — ALIMENTATION.docx`
**Cadrage** : Feature Spec S1 V1.0 (pattern Type A) + Métriques V1.5 + Brief contenu Session 3 (vidéo intro)

---

## 1. Rôle du pilier

S3 est la troisième semaine de Phase 1. L'utilisateur a travaillé la respiration (S1) puis le mouvement (S2). Il entre maintenant dans **l'alimentation**.

Principe Jacky : *"Cette semaine, on isole un seul levier. Pas parce que le reste n'est pas important, mais parce que c'est la seule façon de ressentir clairement ce que ce pilier change."*

Phrase de positionnement clé :
> "Simple ne veut pas dire faible. Simple veut dire lisible pour le corps."

Objectif produit :
- Alléger la digestion
- Faire ressentir le contraste énergétique post-repas
- Découvrir jeûne intermittent sans pression
- Expérimenter le repas fruits midi
- Simplifier le repas du soir

---

## 2. Évaluation initiale (12 questions)

### 2.1 Format

- 12 questions auto-déclaratives
- Échelle 1-5 (`1 = jamais / très loin de moi` à `5 = presque toujours`)
- 1 question par écran (IA-40)
- Score brut /60 → normalisé /100

### 2.2 Questions

Cf. `src/data/s3-evaluation.ts` constante `S3_EVALUATION_QUESTIONS`.

5 questions inversées (Q4, Q6, Q8, Q10, Q12) — formulations négatives Jacky V0.

### 2.3 Diagnostic 5 niveaux

| Niveau | Label | Tonalité |
|---|---|---|
| 1 | Alimentation contraignante | Charge digestive importante |
| 2 | Alimentation coûteuse | Bases présentes, compensation forte |
| 3 | Alimentation instable | Irrégulière, à structurer |
| 4 | Alimentation soutenante | Soutient déjà, à affiner |
| 5 | Alimentation régénérante | Simple et cohérente |

Messages d'accueil : matière Jacky V0 intégrée intégralement, cf. `src/data/s3-evaluation.ts` constante `S3_DIAGNOSTICS`.

---

## 3. Paramètre principal — intensité protocole

### 3.1 Type A modulé par niveau d'engagement

Pas de durée minutée (acte_libre). Intensité protocole alimentaire mod par niveau :

- **Essentiel** : repousser 1er repas si possible / fruits midi + salade possible / repas vitalité simple soir
- **Progression** : jeûne intermittent partiel matin / gros repas fruits midi / repas vitalité structuré soir
- **Immersion** : jeûne intermittent complet matin / repas fruits dominant (60-70% calories) midi / repas vitalité très simple soir

### 3.2 SessionType — `acte_libre`

Pas de timer. Validation manuelle "C'est fait" après chaque moment alimentaire.

3 sessions = 3 moments alimentaires par jour :
1. Matin (activation naturelle)
2. Midi (recharge vivante)
3. Soir (repas vitalité)

### 3.3 Mapping diagnostic → engagement recommandé (D40)

Règle simplifiée appliquée sur S3 :
- Diag 1-2 → Essentiel recommandé
- Diag 3 → Progression
- Diag 4-5 → Immersion

L'utilisateur peut toujours modifier manuellement (D31, D4).

---

## 4. Programme 7 jours

Matière Jacky V0 intégrée explicitement :

| Jour | Titre | Focus |
|---|---|---|
| J1 | Découvrir | Tester sans perfection |
| J2 | Décaler | Repousser 1er repas |
| J3 | Ressentir | Premier contraste |
| J4 | Stabiliser | Énergie stabilisée |
| J5 | Alléger | Charge digestive réduite |
| J6 | Fluidifier | Plus naturel |
| J7 | Comprendre | Lien alimentation-digestion-énergie |

Cf. `src/data/s3-program.ts` constante `S3_PROGRAM` pour titres + objectifs + pédagogie.

---

## 5. Sessions / jour

3 moments alimentaires par jour (matin/midi/soir). Validation streak Phase 1 : 1 acte sur 3 minimum (D6).

---

## 6. Niveau adaptatif (IA-44)

Identique S1 — manuel uniquement (D31). Modulation Moins / Pareil / Plus par session.

---

## 7. Évaluation finale (J7 ou fin de pilier)

Identique S1 — mêmes 12 questions, recalcule score, compare delta, met à jour branche Toile.

Effet miroir (IA-47 récap) : voir brief-pilier-s3-alimentation-v1.md section "Effet miroir fin de pilier".

---

## 8. Slots de copy

| Slot | Description |
|---|---|
| `copy.IA-40.s3.q1` à `q12` | 12 questions évaluation |
| `copy.IA-40.s3.diag1` à `diag5` | 5 messages diagnostic |
| `copy.IA-41.s3.intro-pilier` | Texte accompagnement vidéo intro |
| `copy.IA-43.s3.j1-explication` à `j7` | 7 pédagogies jour |
| `copy.IA-47.s3.recap-final` | Texte récap fin de pilier |

---

## 9. Médias

### 9.1 Vidéo intro pilier (Brief Session 3)

- **Asset** : `media.s3.video-intro`
- **Format** : 9:16, 60-90s
- **Phrase clé Jacky** : *"Simple ne veut pas dire faible. Simple veut dire lisible pour le corps."*

### 9.2 Visuels in-app

Pictogramme S3 : Apple (lucide-react-native) — déjà câblé S02Screen roadmap (couleur palette `tree.s3`).

---

## 10. Notifications S3 (D12 reporté)

Draft Claude in `docs/contenu/brief-notifications-v1.md` famille fond pédagogique :
- S3 message fond : *"Manger moins souvent libère plus d'énergie que manger mieux. Commence par là."*

Programme indicatif : 1 rappel quotidien matin + 1 message fond/semaine.

---

## 11. Edge cases physiologiques

- **Hypoglycémie / diabète** : recommander Niveau Essentiel uniquement. Pas de jeûne intermittent strict.
- **Grossesse / allaitement** : pas couvert V1. Disclaimer à afficher si déclaré profil (mécanique V2).
- **Trouble alimentaire** : recommander consultation pro avant de démarrer. Mention onboarding pilier.

---

## 12. Validation Jacky requise

Matière V0 intégrée — validation Jacky surtout sur :

1. **Formulations exactes** des 12 questions (vérification voix Mimi/Jacky)
2. **Messages d'accueil** des 5 diagnostics (densité, ton)
3. **Pédagogies par jour** (7 messages narratifs)
4. **Mapping profil → niveau** (9 cases du brief)

---

## Annexe — Référence matière Jacky V0

Matière brute : `docs/matiere-jacky/V0_PILIER 3 — ALIMENTATION.docx`

Format Jacky V0 :
- 12 questions évaluation explicites
- 5 diagnostics avec labels narratifs
- 3 niveaux d'intensité (Essentiel/Progression/Immersion)
- Programme 7 jours nommé (Découvrir/Décaler/Ressentir/Stabiliser/Alléger/Fluidifier/Comprendre)
- Ressenti après repas micro-questions (reporté V2)
- Score quotidien "cohérence du jour" (hors-scope V1, D34)
- Adaptation automatique si décroche / réussite (hors-scope V1, D31)
- Phrase de positionnement : "Simple ne veut pas dire faible"

Adaptation V1 :
- Intégration directe questions + diagnostics + programme
- Ressenti après repas reporté Phase 2 (D36)
- Score quotidien non implémenté V1 (D34)
- Adaptation automatique manuelle V1 (D31)

---

*Fin du Feature Spec S3 V1.0.*

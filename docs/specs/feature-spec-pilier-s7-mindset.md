# Feature Spec — Pilier S7 Mindset V1.0

**Date** : 29 mai 2026
**Statut** : V1.0 stable — intégration matière Jacky V0 complète. Type **B atypique** (D41).
**Source matière** : `docs/matiere-jacky/V0_PILIER 7 — MINDSET.docx`
**Cadrage** : Feature Spec S1 V1.0 (pattern référence) + Métriques V1.5 + Brief contenu Session 3

---

## 1. Rôle du pilier

S7 est la septième semaine de Phase 1. Deuxième pilier **Type B** (atypique).

Positionnement Jacky : *"Ce n'est pas ce qui t'arrive qui te fatigue. C'est la manière dont ton mental le traite."*

Logique de transformation : **Voir → Agir → Ressentir**.

Objectif produit :
- Prendre conscience des pensées négatives
- Apprendre à intervenir dessus
- Ressentir concrètement l'impact sur son état

---

## 2. Évaluation initiale (12 questions)

### 2.1 Format

- 12 questions auto-déclaratives
- Échelle 1-5
- 6 questions inversées (Q2/Q3/Q4/Q7/Q8/Q11) — formulations négatives mental/stress

### 2.2 Questions

Cf. `src/data/s7-evaluation.ts` constante `S7_EVALUATION_QUESTIONS`.

### 2.3 Diagnostic 5 niveaux

| Niveau | Label |
|---|---|
| 1 | Mental subi |
| 2 | Mental réactif |
| 3 | Mental instable |
| 4 | Mental en évolution |
| 5 | Mental orienté |

Messages d'accueil : cf. `src/data/s7-evaluation.ts` constante `S7_DIAGNOSTICS`.

---

## 3. Type B — pas de paramètre principal modulé

### 3.1 D41 Type B atypique

- Pas de niveau Essentiel/Progression/Immersion
- Pas de durations modulées
- Tout le monde démarre au même endroit
- La modulation se fait par la **fréquence** d'application (combien d'observations/transformations par jour)

### 3.2 SessionType — `acte_libre`

Validation manuelle des observations/transformations comptées. Pas de timer.

### 3.3 Pas de mapping diagnostic → engagement

L'engagement Essentiel/Progression/Immersion **ne s'applique pas à S7**.

---

## 4. Programme 7 jours — 3 phases (Jacky V0)

| Phase | Jours | Objectif |
|---|---|---|
| Observer | J1-J2 | Voir les pensées négatives |
| Transformer | J3-J4 | Changer l'angle |
| Impact | J5-J6-J7 | Ressentir l'effet |

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

---

## 5. Sessions / jour

Mécanique uniforme Phase 1 : 3 sessions disponibles par jour. Validation streak Phase 1 : 1 session sur 3 minimum (D6).

Note : pour S7 la "session" = un moment de la journée où l'utilisateur valide qu'il a fait l'exercice du jour (observer / transformer / ressentir selon phase).

---

## 6. Mécanique tracking détaillé (Jacky V0 — hors-scope V1 simple)

Jacky V0 propose un tracking riche par phase :

**J1-J2 — Observer** :
- Compteur Observation : 0-5 bas / 5-10 moyen / 10-15+ élevé

**J3-J4 — Transformer** :
- Compteur Observation
- Compteur Transformation : 0-3 bas / 3-6 moyen / 6+ élevé

**J5-J7 — Impact** :
- Compteur Observation
- Compteur Transformation
- Compteur Impact : Aucun / Modéré / Fort

**Statut V1** : V1 simplifié = validation binaire fait/pas fait. Tracking détaillé V1.1+ Sprint code S7 livraison.

---

## 7. Niveau adaptatif (IA-44)

**Non applicable Type B** — pas de modulation Moins/Pareil/Plus. L'IA-44 sera masquée pour S7 (déjà géré par `showAdaptiveBtn = meta.sessionType !== 'acte_libre'`).

---

## 8. Évaluation finale

Identique S1 — mêmes 12 questions, recalcule score, compare delta, met à jour branche Toile.

---

## 9. Slots de copy

| Slot | Description |
|---|---|
| `copy.IA-40.s7.q1` à `q12` | 12 questions évaluation |
| `copy.IA-40.s7.diag1` à `diag5` | 5 messages diagnostic |
| `copy.IA-41.s7.intro-pilier` | Texte accompagnement vidéo intro |
| `copy.IA-43.s7.j1-explication` à `j7` | 7 pédagogies jour |
| `copy.IA-47.s7.recap-final` | Texte récap fin de pilier |

---

## 10. Médias

### 10.1 Vidéo intro pilier

- **Asset** : `media.s7.video-intro`
- **Format** : 9:16, 60-90s
- **Phrase clé Jacky** : *"Ce n'est pas ce qui t'arrive qui te fatigue. C'est la manière dont ton mental le traite."*

### 10.2 Visuels in-app

Pictogramme S7 : Lightbulb (lucide-react-native) — déjà câblé S02Screen roadmap.

---

## 11. Notifications S7 (D12 reporté)

Draft Claude :
- S7 message fond : *"Ce que tu te racontes le matin oriente la journée. Observe."*

---

## 12. Edge cases

- **Pensées intrusives sévères** : recommander accompagnement pro (psy, thérapie). Pas un pilier de traitement clinique.
- **Difficulté à observer** : suggérer démarrer petit — une seule observation par jour vaut mieux que dix forcées.
- **Frustration de ne pas pouvoir transformer** : message d'aide narratif "Même voir une pensée sans pouvoir la transformer est déjà un acte de mental orienté."

---

## 13. Validation Jacky requise

1. **Adaptation pédagogique 7 jours** (Jacky propose phases, V1 garde même structure)
2. **Pédagogies par jour** (7 messages narratifs)
3. **Tracking détaillé** : décider V1.1+ (compteurs Observer/Transformer/Impact) vs V1 simple
4. **Type B sans niveau** : confirmer pas de mapping profil → niveau

---

## Annexe — Référence matière Jacky V0

Matière brute : `docs/matiere-jacky/V0_PILIER 7 — MINDSET.docx`

Format Jacky V0 :
- 12 questions évaluation explicites
- 5 diagnostics (Mental subi → Mental orienté)
- Programme progressif 3 phases (Observer/Transformer/Impact)
- Tracking détaillé par compteurs
- Score quotidien (hors-scope V1, D34)
- Micro-messages J2/J4/J6/J7
- Phrase clé : "Tu n'as pas changé les situations. Tu as changé leur impact."

Adaptation V1 :
- Intégration directe questions + diagnostics + structure 3 phases
- Tracking détaillé reporté V1.1+ Sprint code S7 livraison
- Score quotidien hors-scope V1

---

*Fin du Feature Spec S7 V1.0.*

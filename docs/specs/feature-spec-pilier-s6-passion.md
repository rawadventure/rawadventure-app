# Feature Spec — Pilier S6 Passion et chemin de vie V1.0

**Date** : 29 mai 2026
**Statut** : V1.0 stable — intégration matière Jacky V0 complète.
**Source matière** : `docs/matiere-jacky/V0_PILIER 6 — PASSION.docx`
**Cadrage** : Feature Spec S1 V1.0 (pattern référence) + Métriques V1.5 + Brief contenu Session 3

---

## 1. Rôle du pilier

S6 est la sixième semaine de Phase 1. L'utilisateur a travaillé respiration, mouvement, alimentation, connexion vivant, repos. Il aborde maintenant la **passion et le chemin de vie**.

Message central Jacky : *"Tu ne manques pas forcément de passion. Tu manques peut-être simplement de temps réellement consacré à ce qui t'anime."*

Objectif produit :
- Identifier ce qui anime l'utilisateur
- Remettre une passion en action
- Consacrer du temps concret à ce qui donne de l'énergie
- Observer l'impact sur la motivation et la vitalité globale

---

## 2. Évaluation initiale (12 questions)

### 2.1 Format

- 12 questions auto-déclaratives
- Échelle 1-5
- 4 questions inversées (Q4 repousse, Q7 coupé, Q8 priorise obligations, Q10 manque de sens)

### 2.2 Questions

Cf. `src/data/s6-evaluation.ts` constante `S6_EVALUATION_QUESTIONS`.

### 2.3 Diagnostic 5 niveaux

| Niveau | Label |
|---|---|
| 1 | Passion déconnectée |
| 2 | Passion mise de côté |
| 3 | Passion irrégulière |
| 4 | Passion active |
| 5 | Passion intégrée |

Messages d'accueil : cf. `src/data/s6-evaluation.ts` constante `S6_DIAGNOSTICS`.

---

## 3. Paramètre principal — durée consacrée à la passion

### 3.1 Type A modulé par niveau d'engagement

- **Essentiel** : 15 min / session (fourchette Jacky 5-15)
- **Progression** : 30 min / session (fourchette Jacky 20-40)
- **Immersion** : 60 min / session (fourchette Jacky 45+)

### 3.2 SessionType — `chrono_libre`

Timer simple pour temps consacré à la passion choisie. L'utilisateur démarre le timer, pratique, valide à la fin.

### 3.3 Mapping diagnostic → engagement recommandé (D40)

- Diag 1-2 → Essentiel recommandé
- Diag 3 → Progression
- Diag 4-5 → Immersion

---

## 4. Phase préparatoire — identifier les passions

Jacky V0 prévoit une phase préparatoire avant J1 :
- L'utilisateur liste 3 à 5 passions réelles
- Choisit celle qu'il veut remettre en action

**Statut V1** : phase préparatoire **hors-scope V1** (UX riche à implémenter Sprint code S6 livraison si voulu). V1 simplifié : l'utilisateur garde sa passion en tête sans liste app.

---

## 5. Programme 7 jours (adaptation V1)

Le doc Jacky V0 propose programme identique chaque jour. Adaptation V1 : 7 jours avec focus narratif progressif.

| Jour | Titre | Focus |
|---|---|---|
| J1 | Identifier | Lister passions, choisir celle de la semaine |
| J2 | Petite porte d'entrée | Démarrer petit |
| J3 | Installer | Reprendre la pratique |
| J4 | Approfondir | Augmenter le temps |
| J5 | Persévérer | Le rythme s'installe |
| J6 | Observer l'impact | Attention au reste de la journée |
| J7 | Intégrer | Cumul de la semaine |

Cf. `src/data/s6-program.ts` constante `S6_PROGRAM`.

---

## 6. Sessions / jour

Mécanique uniforme Phase 1 : 3 sessions disponibles par jour. Validation streak Phase 1 : 1 session sur 3 minimum (D6).

**Note matière Jacky** : Jacky V0 parle de "1 pratique par jour". V1 garde 3 sessions transverses pour cohérence Phase 1 — la pratique peut se faire en 1 ou plusieurs sessions selon le choix de l'utilisateur.

---

## 7. Cumul hebdomadaire (Jacky V0)

Affichable en fin de pilier (IA-47 récap) :
- Temps total consacré aux passions
- Passion la plus pratiquée (V1.1+, nécessite phase préparatoire)
- Nombre de jours validés
- Moyenne quotidienne

Niveaux hebdomadaires :
- 0-60 min : faible engagement
- 60-150 min : engagement en route
- 150-300 min : bon engagement
- 300+ min : passion réellement activée

**Statut V1** : cumul détaillé hors-scope V1 simple. À considérer pour S6 livraison Sprint code.

---

## 8. Niveau adaptatif (IA-44)

Identique S1 — manuel uniquement (D31). Modulation Moins/Pareil/Plus par session.

---

## 9. Évaluation finale

Identique S1 — mêmes 12 questions, recalcule score, compare delta, met à jour branche Toile.

---

## 10. Slots de copy

| Slot | Description |
|---|---|
| `copy.IA-40.s6.q1` à `q12` | 12 questions évaluation |
| `copy.IA-40.s6.diag1` à `diag5` | 5 messages diagnostic |
| `copy.IA-41.s6.intro-pilier` | Texte accompagnement vidéo intro |
| `copy.IA-43.s6.j1-explication` à `j7` | 7 pédagogies jour |
| `copy.IA-47.s6.recap-final` | Texte récap fin de pilier |

---

## 11. Médias

### 11.1 Vidéo intro pilier

- **Asset** : `media.s6.video-intro`
- **Format** : 9:16, 60-90s
- **Phrase clé Jacky** : *"Tu ne manques pas forcément de passion. Tu manques peut-être simplement de temps réellement consacré à ce qui t'anime."*

### 11.2 Visuels in-app

Pictogramme S6 : Compass (lucide-react-native) — déjà câblé S02Screen roadmap (couleur palette `tree.s6`).

---

## 12. Notifications S6 (D12 reporté)

Draft Claude :
- S6 message fond : *"Ce qui te tire dans l'action te donne plus d'énergie qu'il n'en prend."*

---

## 13. Edge cases

- **Aucune passion identifiée** : message d'aide narratif "Pas besoin d'identifier sa vraie vocation — choisis simplement une activité que tu repousses depuis longtemps."
- **Plusieurs passions concurrentes** : encourager à choisir une seule pour cette semaine — l'app peut accueillir plusieurs piliers à venir Phase 2.
- **Passion impossible cette semaine** (matériel manquant, contraintes externes) : suggérer version dégradée — l'objectif n'est pas la perfection mais la pratique.

---

## 14. Validation Jacky requise

1. **Adaptation 7 jours** (Jacky propose identique, V1 introduit focus narratif progressif)
2. **Phase préparatoire** : décider V1 (hors-scope simple) ou V1.1+ (liste app riche)
3. **Cumul hebdomadaire** : décider V1 (simple total) ou V1.1+ (cumul détaillé Jacky)
4. **Pédagogies par jour** (7 messages narratifs)
5. **Mapping profil → niveau** (9 cases du brief)

---

## Annexe — Référence matière Jacky V0

Matière brute : `docs/matiere-jacky/V0_PILIER 6 — PASSION.docx`

Format Jacky V0 :
- 12 questions évaluation explicites
- 5 diagnostics (Passion déconnectée → Passion intégrée)
- 3 niveaux durées 5-15 / 20-40 / 45+ min
- Phase préparatoire (liste 3-5 passions)
- Programme identique chaque jour 7 jours
- Cumul hebdomadaire détaillé
- Score quotidien "passion" (hors-scope V1, D34)
- Adaptation automatique (D31 manuelle V1)
- Phrase clé : "Ce que tu nourris prend de la place dans ta vie."

Adaptation V1 :
- Intégration directe questions + diagnostics
- Programme 7 jours adapté (focus progressif vs identique Jacky)
- Phase préparatoire reportée V1.1+ (UX riche)
- Cumul simple V1, détaillé V1.1+
- Score quotidien hors-scope V1

---

*Fin du Feature Spec S6 V1.0.*

# Feature Spec — Pilier S4 Connexion au vivant V1.0

**Date** : 29 mai 2026
**Statut** : V1.0 stable — intégration matière Jacky V0 (12 questions + 5 niveaux fournis). Programme 7 jours adapté (Jacky propose programme identique chaque jour).
**Source matière** : `docs/matiere-jacky/V0_PILIER 4 — CONNEXION AU VIVANT.docx`
**Cadrage** : Feature Spec S1 V1.0 (pattern Type A) + Métriques V1.5 + Brief contenu Session 3

---

## 1. Rôle du pilier

S4 est la quatrième semaine de Phase 1. L'utilisateur a travaillé respiration (S1), mouvement (S2), alimentation (S3). Il entre maintenant dans la **connexion au vivant**.

Principe Jacky : *"Tu ne vas rien apprendre. Tu vas simplement remettre ton corps en contact avec le réel."*

Objectif produit :
- Sortir de l'environnement artificiel
- Réexposer le corps aux éléments naturels (lumière, air, eau, terre)
- Réguler le système nerveux
- Retrouver des sensations réelles

---

## 2. Évaluation initiale (12 questions)

### 2.1 Format

- 12 questions auto-déclaratives
- Échelle 1-5
- 2 questions inversées (Q4 environnements fermés, Q9 stimulation mentale)

### 2.2 Questions

Cf. `src/data/s4-evaluation.ts` constante `S4_EVALUATION_QUESTIONS`.

### 2.3 Diagnostic 5 niveaux

| Niveau | Label |
|---|---|
| 1 | Très déconnecté |
| 2 | Déconnecté |
| 3 | Variable |
| 4 | Connecté |
| 5 | Très connecté |

Messages d'accueil : cf. `src/data/s4-evaluation.ts` constante `S4_DIAGNOSTICS`.

---

## 3. Paramètre principal — durée par session

### 3.1 Type A modulé par niveau d'engagement

- **Essentiel** : 5 min / session (fourchette Jacky 5-15)
- **Progression** : 20 min / session (fourchette Jacky 15-30)
- **Immersion** : 45 min / session (fourchette Jacky 30-60)

### 3.2 SessionType — `chrono_libre`

Timer simple. L'utilisateur sort, démarre timer, valide à la fin.

### 3.3 Mapping diagnostic → engagement recommandé (D40)

- Diag 1-2 → Essentiel recommandé
- Diag 3 → Progression
- Diag 4-5 → Immersion

---

## 4. Programme 7 jours (adaptation V1)

Le doc Jacky V0 propose un programme **identique chaque jour** (régulation nerveuse = répétition). Adaptation V1 : 7 jours avec progression légère sur les éléments naturels mis en avant.

| Jour | Titre | Focus |
|---|---|---|
| J1 | Démarrer le contact | Sortir 5 min mini, matin et soir |
| J2 | Lumière du matin | Exposition lumière naturelle au réveil |
| J3 | Sentir l'air | Respiration naturelle dehors |
| J4 | Contact direct | Pieds nus, écorce, sol naturel |
| J5 | Apaisement du soir | Coucher de soleil ou lumière déclinante |
| J6 | Présence pleine | Observation prolongée d'un élément naturel |
| J7 | Intégrer le rythme | Reproduire les 2 moments sans réfléchir |

Cf. `src/data/s4-program.ts` constante `S4_PROGRAM`.

---

## 5. Sessions / jour

Jacky propose **2 sessions/jour** (matin + soir). Adaptation V1 : 3 sessions transverses Phase 1 :
- Matin (session 1) : activation biologique (lumière, air)
- Midi (session 2) : pause connexion courte (5 min mini)
- Soir (session 3) : apaisement nerveux (lumière déclinante, présence)

Validation streak Phase 1 : 1 session sur 3 minimum (D6).

---

## 6. Règle fondamentale (Jacky V0)

> "Pendant ces moments : aucun téléphone, aucun écran, aucune distraction. Sans ça, la connexion n'existe pas."

À afficher en intro pilier (IA-41) et en rappel quotidien.

---

## 7. Niveau adaptatif (IA-44)

Identique S1 — manuel uniquement (D31).

---

## 8. Évaluation finale

Identique S1 — mêmes 12 questions, recalcule score, compare delta, met à jour branche Toile.

---

## 9. Slots de copy

| Slot | Description |
|---|---|
| `copy.IA-40.s4.q1` à `q12` | 12 questions évaluation |
| `copy.IA-40.s4.diag1` à `diag5` | 5 messages diagnostic |
| `copy.IA-41.s4.intro-pilier` | Texte accompagnement vidéo intro |
| `copy.IA-43.s4.j1-explication` à `j7` | 7 pédagogies jour |
| `copy.IA-43.s4.regle-fondamentale` | Rappel "aucun téléphone, aucun écran" |
| `copy.IA-47.s4.recap-final` | Texte récap fin de pilier |

---

## 10. Médias

### 10.1 Vidéo intro pilier (Brief Session 3)

- **Asset** : `media.s4.video-intro`
- **Format** : 9:16, 60-90s
- **Phrase clé Jacky** : *"Tu ne vas rien apprendre. Tu vas simplement remettre ton corps en contact avec le réel."*

### 10.2 Visuels in-app

Pictogramme S4 : Trees (lucide-react-native) — déjà câblé S02Screen roadmap (couleur palette `tree.s4`).

---

## 11. Notifications S4 (D12 reporté)

Draft Claude in `docs/contenu/brief-notifications-v1.md` famille fond pédagogique :
- S4 message fond : *"Vingt minutes dehors par jour suffisent. Sans téléphone."*

---

## 12. Edge cases

- **Climat hostile** : adapter — 5 min mini possible même en pluie/froid. Pas de blocage UX.
- **Vie urbaine dense** : balcon, fenêtre ouverte, parc à proximité comptent. Pas besoin de forêt.
- **Mobilité réduite** : adapter — observation par fenêtre ouverte, contact air. Mention onboarding.

---

## 13. Validation Jacky requise

1. **Adaptation 7 jours** (Jacky propose identique chaque jour, V1 introduit progression)
2. **Sessions transverses** : confirmer ajout midi (Jacky propose 2 sessions seulement)
3. **Tracking éléments** : décider si on intègre cases Lumière/Air/Eau/Terre (V1.1+) ou simple validation V1
4. **Pédagogies par jour** (7 messages narratifs)
5. **Mapping profil → niveau** (9 cases du brief)

---

## Annexe — Référence matière Jacky V0

Matière brute : `docs/matiere-jacky/V0_PILIER 4 — CONNEXION AU VIVANT.docx`

Format Jacky V0 :
- 12 questions évaluation explicites
- 5 diagnostics (Très déconnecté → Très connecté)
- 3 niveaux durées 5-15 / 15-30 / 30-60 min
- Structure 2 sessions/jour identique chaque jour
- 4 éléments naturels tracking (Lumière/Air/Eau/Terre)
- Règle fondamentale : aucun téléphone
- Score quotidien "connexion" (hors-scope V1, D34)
- Adaptation automatique (D31 manuelle V1)

Adaptation V1 :
- Intégration directe questions + diagnostics
- Programme 7 jours adapté (progression légère vs identique Jacky)
- 3 sessions/jour (cohérence mécanique transverse Phase 1)
- Tracking éléments reporté ou décision UX
- Score quotidien hors-scope V1

---

*Fin du Feature Spec S4 V1.0.*

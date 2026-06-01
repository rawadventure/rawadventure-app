# Feature Spec — Pilier S2 Activité physique V1.0

**Date** : 29 mai 2026
**Statut** : V1.0 stable — drafts Claude basés sur matière Jacky V0 brute, à valider Jacky en session dédiée.
**Source matière** : `docs/matiere-jacky/V0_PILIER 2 — ACTIVITÉ PHYSIQUE.docx`
**Cadrage** : Feature Spec S1 V1.0 (pattern Type A) + Métriques V1.5 + Brief contenu Session 3 (vidéo intro)

---

## 1. Rôle du pilier

S2 est la deuxième semaine de Phase 1. L'utilisateur a travaillé la respiration (S1), il entre maintenant dans le **mouvement**.

Principe Jacky : *"Tu n'as rien à réfléchir. Tu fais la séance. Ton corps fait le reste."*

Objectif produit :
- Créer un mouvement quotidien sans friction
- Donner une progression visible
- Faire ressentir l'énergie qui revient au mouvement
- Préparer la transition vers la suite (S3 Alimentation)

---

## 2. Évaluation initiale (12 questions)

### 2.1 Format

- 12 questions auto-déclaratives
- Échelle 1-5 (`1 = jamais / très loin de moi` à `5 = presque toujours`)
- 1 question par écran (IA-40)
- Score brut /60 → normalisé /100

### 2.2 Questions

Cf. `src/data/s2-evaluation.ts` constante `S2_EVALUATION_QUESTIONS`.

Q6/Q7/Q8 sont **inversés** (formulations négatives — score = 6 - réponse au calcul).

### 2.3 Diagnostic 5 niveaux

| Niveau | Label | Tonalité |
|---|---|---|
| 1 | Sédentaire | Le terrain le plus marquant |
| 2 | Mouvement irrégulier | Sans régularité |
| 3 | Activité d'entretien | Correct, à raffiner |
| 4 | Bonne base active | Solide, à affiner |
| 5 | Corps acquis | Intégré, à consolider |

Messages d'accueil : cf. `src/data/s2-evaluation.ts` constante `S2_DIAGNOSTICS`.

---

## 3. Paramètre principal — durée séance

### 3.1 Type A modulé par niveau d'engagement

- Essentiel : **30 min** / séance
- Progression : **45 min** / séance
- Immersion : **60 min** / séance

(Simplification V1 des 9 paliers Jacky : 20-30-40 / 40-50-60 / 70-80-90 min.)

### 3.2 SessionType — `chrono_libre`

Pas de rythme respiratoire imposé. Timer durée simple. L'utilisateur fait sa séance librement.

UI IA-43 chrono libre :
- Compte à rebours visuel
- Bouton "Pause" + "Stop"
- Validation à la fin

### 3.3 Mapping diagnostic → engagement recommandé (D40)

Règle simplifiée appliquée sur S2 :
- Diag 1-2 → Essentiel recommandé
- Diag 3 → Progression
- Diag 4-5 → Immersion

L'utilisateur peut toujours modifier manuellement (D31, D4).

---

## 4. Programme 7 jours

### 4.1 Rotation Jacky

| Jour | Type | Titre |
|---|---|---|
| J1 | Endurance | Remise en mouvement |
| J2 | Mobilité | Libérer les articulations |
| J3 | Renforcement | Construire la structure |
| J4 | Endurance | Tenir le rythme |
| J5 | Relâchement | Laisser le corps redescendre |
| J6 | Renforcement | Ancrer la structure |
| J7 | OFF | Repos complet |

Cf. `src/data/s2-program.ts` constante `S2_PROGRAM` pour titres + objectifs + pédagogie complets.

### 4.2 Jour OFF (J7)

Pas de session J7. Pas de validation requise. Le repos fait partie du programme.

**Note implémentation** : à arbitrer Sprint code S2 — soit J7 = session optionnelle, soit J7 fermé (pas de bouton "Démarrer session"). Recommandation : option 1 (cohérent avec mécanique streak).

---

## 5. Sessions / jour

Identique S1 : **3 sessions** par jour possibles (matin/midi/soir). Validation streak Phase 1 : 1 session/3 minimum (D6).

Note matière Jacky : la matière brute n'évoque pas explicitement 3 sessions/jour pour S2 (orientée vers 1 séance quotidienne). En V1 on garde la mécanique uniforme 3 sessions pour cohérence transverse Phase 1. À reconsidérer Sprint S2 livraison si UX confirme.

---

## 6. Niveau adaptatif (IA-44)

Identique à S1 — manuel uniquement (D31). Modulation Moins / Pareil / Plus par session, sans changer le niveau d'entrée.

---

## 7. Évaluation finale (J7 ou fin de pilier)

Identique S1 — mêmes 12 questions, recalcule score, compare delta, met à jour branche Toile.

### Effet miroir (IA-47 récap)

Cf. brief-pilier-s2-activite-physique-v1.md section "Effet miroir fin de pilier".

---

## 8. Slots de copy

| Slot | Description |
|---|---|
| `copy.IA-40.s2.q1` à `q12` | 12 questions évaluation |
| `copy.IA-40.s2.diag1` à `diag5` | 5 messages diagnostic |
| `copy.IA-41.s2.intro-pilier` | Texte accompagnement vidéo intro |
| `copy.IA-43.s2.j1-explication` à `j7` | 7 pédagogies jour |
| `copy.IA-47.s2.recap-final` | Texte récap fin de pilier |

Slots à produire intégralement en Brief contenu V1 — drafts Claude présents en attendant.

---

## 9. Médias

### 9.1 Vidéo intro pilier (Brief Session 3)

- **Asset** : `media.s2.video-intro`
- **Format** : 9:16, 60-90s
- **À produire** : Mimi & Jacky (Brief contenu Session 3 — 8 intros piliers)

### 9.2 Visuels in-app

Pictogramme S2 : Activity (lucide-react-native) — déjà câblé S02Screen roadmap (couleur palette `tree.s2`).

---

## 10. Notifications S2 (D12 reporté)

À calibrer Brief contenu V1 + D12. Drafts Claude in `docs/contenu/brief-notifications-v1.md` famille fond pédagogique :
- S2 message fond : *"Le mouvement n'est pas une dette. C'est un signal."*

Programme indicatif : 1 rappel quotidien matin + 1 message fond/semaine.

---

## 11. Edge cases physiologiques

- **Blessure récente** : recommander Niveau Essentiel + mobilité (J2) en priorité. Mention dans intro pilier vidéo.
- **Grossesse** : pas couvert V1. Disclaimer à afficher si l'utilisateur déclare une grossesse dans le profil (mécanique à venir V2).
- **Pathologie cardiaque** : recommander consultation médicale avant Niveau Immersion. Mention dans onboarding pilier.

---

## 12. Validation Jacky requise

Avant production code/copy finalisé :

1. **12 questions** : Jacky valide formulations + Q6/Q7/Q8 inversés
2. **5 diagnostics labels + messages** : Jacky valide voix Mimi/Jacky
3. **Programme 7 jours** : Jacky valide rotation + pédagogies
4. **Durées 30/45/60** : Jacky valide simplification 9 paliers → 3
5. **Mapping profil → niveau** : Jacky valide les 9 cases du brief

---

## Annexe — Référence matière Jacky V0

Matière brute : `docs/matiere-jacky/V0_PILIER 2 — ACTIVITÉ PHYSIQUE.docx`

Format Jacky V0 :
- Pas de 12 questions évaluation produites
- 3 niveaux × 3 types séances (endurance/renforcement/mobilité) avec durées progressives
- Rotation hebdo 7 jours
- Messages micro-événements jours 2/4/6

Adaptation V1 :
- 12 questions évaluation **inférées** Claude — à valider Jacky
- 5 diagnostics narratifs **inférés** Claude — à valider Jacky
- Durées simplifiées 30/45/60 min — à valider Jacky
- Rotation hebdo préservée (J1-J7)

---

*Fin du Feature Spec S2 V1.0.*

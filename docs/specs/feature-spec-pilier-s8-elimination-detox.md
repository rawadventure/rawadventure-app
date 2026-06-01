# Feature Spec — Pilier S8 Élimination et détox V1.0

**Date** : 29 mai 2026
**Statut** : V1.0 stable — intégration matière Jacky V0 complète. Dernier pilier Phase 1.
**Source matière** : `docs/matiere-jacky/V0_PILIER 8 — ÉLIMINATION & DÉTOX.docx`
**Cadrage** : Feature Spec S1 V1.0 (pattern référence) + Métriques V1.5 + Brief contenu Session 3

---

## 1. Rôle du pilier

S8 est la huitième et dernière semaine de Phase 1. L'utilisateur ferme le cycle des 8 piliers.

Message central Jacky : *"Tu ne vas pas faire une détox extrême. Tu vas simplement apporter plus d'eau, plus de minéraux et plus de fluidité pour aider ton corps à mieux éliminer."*

Objectif produit :
- Relancer l'élimination
- Fluidifier le transit
- Soutenir la reminéralisation
- Préparer la transition vers le mode consolidation libre (IA-23)

---

## 2. Évaluation initiale (12 questions)

### 2.1 Format

- 12 questions auto-déclaratives
- Échelle 1-5
- 3 questions inversées (Q4 lourd/chargé, Q5 ballonnements, Q6 selles sèches)

### 2.2 Questions

Cf. `src/data/s8-evaluation.ts` constante `S8_EVALUATION_QUESTIONS`.

### 2.3 Diagnostic 5 niveaux

| Niveau | Label |
|---|---|
| 1 | Élimination ralentie |
| 2 | Système chargé |
| 3 | Élimination irrégulière |
| 4 | Élimination fonctionnelle |
| 5 | Élimination fluide |

Messages d'accueil : cf. `src/data/s8-evaluation.ts` constante `S8_DIAGNOSTICS`.

---

## 3. Paramètre principal — volumes hydratation + dose psyllium

### 3.1 Type A modulé par niveau d'engagement

- **Essentiel** : 500 ml-1 L jus + psyllium 1 c.c. matin et soir
- **Progression** : 1-1,5 L jus + psyllium 1 c.c. matin/midi/soir
- **Immersion** : 1,5-2 L jus + psyllium 1 c.s. matin et soir

### 3.2 SessionType — `acte_libre`

Pas de timer. Validation manuelle des 2 actions :
1. Prise de jus/isotonique
2. Prise de psyllium

### 3.3 Mapping diagnostic → engagement recommandé (D40)

- Diag 1-2 → Essentiel recommandé
- Diag 3 → Progression
- Diag 4-5 → Immersion

---

## 4. Programme 7 jours (adaptation V1)

Le doc Jacky V0 propose programme identique chaque jour. Adaptation V1 : 7 jours avec focus narratif progressif.

| Jour | Titre | Focus |
|---|---|---|
| J1 | Démarrer simple | Première prise + premier psyllium |
| J2 | Maintenir le signal | Routine + observer transit |
| J3 | Affiner les quantités | Augmenter si confort |
| J4 | Observer le transit | Selles/ventre/énergie/clarté |
| J5 | Approfondir si confort | Niveau supérieur |
| J6 | Consolider | Maintenir rythme |
| J7 | Intégrer le rythme | Sans consigne + observer cumul |

Cf. `src/data/s8-program.ts` constante `S8_PROGRAM`.

---

## 5. 2 options jus (Jacky V0)

### Option A — Jus frais (avec juicer)

- Composition : 60-70% légumes/feuilles + 30-40% fruits
- Prises : matin ou 30 min avant repas
- Volume : 500 ml/1 L/1,5 L/2 L selon niveau

### Option B — Eau de mer isotonique (sans juicer)

Pour 1 litre d'isotonique :
- 250 ml d'eau de mer
- 750 ml d'eau douce
- Ratio simple : 1/4 eau de mer + 3/4 eau douce

L'isotonique est plus douce à boire et mieux tolérée que l'eau de mer pure.

---

## 6. Sessions / jour

Mécanique uniforme Phase 1 : 3 sessions disponibles par jour. Validation streak Phase 1 : 1 session sur 3 minimum (D6).

Note : pour S8 la "session" = un moment de la journée où l'utilisateur valide qu'il a pris jus + psyllium.

---

## 7. Niveau adaptatif (IA-44)

**Non applicable** car sessionType acte_libre. L'IA-44 sera masquée pour S8.

---

## 8. Évaluation finale

Identique S1 — mêmes 12 questions, recalcule score, compare delta, met à jour branche Toile.

À l'issue de l'évaluation finale → déclenche **IA-22 sortie de S8** (Sprint 17 G câblé).

---

## 9. Slots de copy

| Slot | Description |
|---|---|
| `copy.IA-40.s8.q1` à `q12` | 12 questions évaluation |
| `copy.IA-40.s8.diag1` à `diag5` | 5 messages diagnostic |
| `copy.IA-41.s8.intro-pilier` | Texte accompagnement vidéo intro |
| `copy.IA-43.s8.j1-explication` à `j7` | 7 pédagogies jour |
| `copy.IA-43.s8.reactions-normales` | Liste réactions normales |
| `copy.IA-43.s8.message-securite` | Message sécurité médicale |
| `copy.IA-47.s8.recap-final` | Texte récap fin de pilier |

---

## 10. Médias

### 10.1 Vidéo intro pilier

- **Asset** : `media.s8.video-intro`
- **Format** : 9:16, 60-90s
- **Phrase clé Jacky** : *"Tu ne vas pas faire une détox extrême. Tu vas simplement apporter plus d'eau, plus de minéraux et plus de fluidité."*

### 10.2 Visuels in-app

Pictogramme S8 : Recycle (lucide-react-native) — déjà câblé S02Screen roadmap.

---

## 11. Notifications S8 (D12 reporté)

Draft Claude :
- S8 message fond : *"Le corps n'accumule pas par choix — il accumule par manque de signal."*

---

## 12. Réactions normales (Jacky V0)

À afficher dans l'app dès J3-J4 :

- Transit plus fréquent
- Selles plus molles
- Ventre qui gargouille
- Sensation de nettoyage
- Besoin d'aller aux toilettes plus souvent
- Énergie qui bouge

> "C'est une réponse normale tant que tu te sens globalement bien, plus léger et plus clair."

## 13. Message sécurité (Jacky V0)

> "Si tu ressens un malaise important, une douleur forte, une fatigue excessive ou une réaction inhabituelle, arrête le protocole et adapte. Ce programme ne remplace pas un avis médical."

À afficher en intro pilier (IA-41) et accessible dans l'écran session.

---

## 14. Edge cases

- **Grossesse / allaitement** : recommander consultation médicale avant démarrage protocole psyllium.
- **Pathologie digestive sévère** : recommander avis médical. Pas de blocage UX.
- **Allergie eau de mer** : option A jus uniquement.
- **Pas de juicer ni eau de mer** : niveau minimum = augmenter hydratation simple (1 L eau supplémentaire/jour) + adapter psyllium. Mention dans intro pilier.

---

## 15. Validation Jacky requise

1. **Adaptation 7 jours** (Jacky propose identique, V1 introduit focus narratif progressif)
2. **Pédagogies par jour** (7 messages narratifs)
3. **Mapping profil → niveau** (9 cases du brief)
4. **Message sécurité** : Jacky valide formulation finale

---

## Annexe — Référence matière Jacky V0

Matière brute : `docs/matiere-jacky/V0_PILIER 8 — ÉLIMINATION & DÉTOX.docx`

Format Jacky V0 :
- 12 questions évaluation explicites
- 5 diagnostics (Élimination ralentie → Élimination fluide)
- 3 niveaux volumes jus + psyllium
- 2 options protocole (jus frais ou eau de mer isotonique)
- Programme identique chaque jour 7 jours
- Réactions normales + message sécurité
- Score quotidien "fluidité" (hors-scope V1, D34)
- Adaptation automatique (D31 manuelle V1)
- Projection mentorat fin de pilier

Adaptation V1 :
- Intégration directe questions + diagnostics + protocole
- Programme 7 jours adapté (focus progressif vs identique Jacky)
- Score quotidien hors-scope V1
- Lien projection mentorat → déjà câblé IA-22 sortie S8 (Sprint 17 G)

---

*Fin du Feature Spec S8 V1.0.*

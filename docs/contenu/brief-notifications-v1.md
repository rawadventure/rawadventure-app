# Brief contenu — Notifications V1

**Statut** : À remplir + acte D12
**Cible code** : `src/lib/notifications.ts` (cadre technique en place) + futur module scheduling
**Cadrage** : Feature Spec V1 §2.9 + D12 (reporté) + D32 (plage silence 22h-8h)

## D12 à trancher

### Q1 — Heure exacte par famille de notif

Pour chaque famille, fixer l'heure de planification locale par défaut :

| Famille | Heure cible | Justification |
|---|---|---|
| Rappel quotidien Phase 0 | [à compléter] | Idéal avant routine matinale ? |
| Rappel quotidien Phase 1 | [à compléter] | Avant session matin ? |
| Observation (effet miroir) | [à compléter] | Soir ? |
| Encouragement | [à compléter] | Variable selon contexte |
| Message de fond pédagogique | [à compléter] | 1x/semaine, jour précis ? |
| Palier streak | [à compléter] | Immédiat à franchissement |

### Q2 — Plafond 1/jour Phase 1

Confirmer : max 1 notif/jour en Phase 1 (déjà acté Feature Spec V1)
- Oui / Non : [à compléter]

### Q3 — Plage silence 22h-8h — décalage ou annulation par famille ?

Si déclencheur tombe dans 22h-8h locales (D32) :

| Famille | Décale à 8h le lendemain | Annule | Décale au prochain créneau hors silence |
|---|---|---|---|
| Rappel quotidien | [choix] | | |
| Observation | [choix] | | |
| Encouragement | [choix] | | |
| Message de fond | [choix] | | |
| Palier | [choix] | | |

### Q4 — Désactivation granulaire

Confirmer : pas de switch global "toutes les notifications" dans l'app V1 — utilisateur passe par paramètres système iOS/Android (Feature Spec §2.9 contrainte 3).
- Oui / Non : [à compléter]

## Copy notifications — 5 familles

Toujours format `title` + `body` (court — limite système iOS ~80 caractères body lisible).

### Famille 1 — Rappel quotidien

**Slot** : `notification.global.rappel-quotidien`

- **Title** : [à compléter — ex : "Raw Adventure"]
- **Body** : [à compléter — ex : "C'est ton créneau du jour."]

Variantes possibles (1 par jour de la semaine pour éviter répétition) :
- Lundi : [à compléter]
- Mardi : [à compléter]
- ...

### Famille 2 — Observation (effet miroir)

**Slot** : `notification.global.observation`

Notifications déclenchées à J3/J4/J7/J11 (effet miroir qualitatif D37).

- **J3** : [à compléter]
- **J4** : [à compléter]
- **J7** : [à compléter]
- **J11** : [à compléter]

### Famille 3 — Encouragement

**Slot** : `notification.global.encouragement.{situation}`

Déclenchées sur signaux comportementaux (joker consommé, streak en baisse, etc.).

- Joker consommé : [à compléter]
- Streak menacé (1 jour manqué) : [à compléter]
- Retour après absence : [à compléter]

### Famille 4 — Message de fond pédagogique

**Slot** : `notification.global.fond.{theme}` ou `notification.s{N}.fond.{N}`

1x/semaine. Voix Mimi & Jacky, ton "leçon courte".

- Message Phase 0 semaine 1 : [à compléter]
- Message Phase 0 semaine 2 : [à compléter]
- Message Phase 1 semaine 1 (S1 Respiration) : [à compléter]
- Message Phase 1 semaine 2 (S2) : [à compléter]
- ... (8 piliers × 1 message)

### Famille 5 — Palier streak

**Slot** : `notification.tier.{N}j`

Notif déclenchée immédiatement à franchissement palier.

- Palier 7j : [à compléter]
- Palier 15j : [à compléter]
- Palier 30j : [à compléter]
- Palier 60j : [à compléter]
- Palier 100j : [à compléter]
- Palier 1 an : [à compléter]

## Copy slot global

### Permission notification (prompt initial)

**Slot** : `copy.global.permission-notifications`

À afficher AVANT le prompt système (rationale screen recommandé) :

- **Titre** : [à compléter — ex : "Les rappels Mimi & Jacky"]
- **Body** : [à compléter — tonalité non-commerciale, focus bénéfice utilisateur]
- **CTA1** : `Activer les rappels`
- **CTA2** : `Plus tard`

## Notes voix

- Notifs = très courtes, voix Mimi & Jacky compatible
- Pas d'emoji
- Pas de "Bonjour !" "Salut !"
- Pas d'urgence simulée ("Vite, ton streak !")
- Préférer observation que ordre

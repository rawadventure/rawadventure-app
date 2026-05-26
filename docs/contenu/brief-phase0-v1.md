# Brief contenu — Phase 0 (J1-J14) V1

**Statut** : À remplir
**Cible code** :
- `src/data/phase0-actions.ts` (7 actions)
- `src/screens/v1/HomeScreenV1.tsx` (messages du jour)
- `src/screens/v1/JourCharniereScreen.tsx` (4 écrans J3/J7/J11/J14)

**Cadrage** : IA V3 §IA-11 + Feature Spec V1 §2.4 + D6 (5/7) + D26 (soft-rappel) + D37 (effet miroir qualitatif)

## 1 — Les 7 actions Phase 0

Chaque action a 4 niveaux de copy à produire :
- `title` court (visible dans la checklist)
- `subtitle` court (hint sous le titre)
- `description` longue (écran détail Phase0ActionDetailScreen)
- `bénéfice` (pourquoi cette action — physiologique, pas marketing)

### 1.1 — `activation_matinale`

- **Title** : `Activation matinale`
- **Subtitle** : `5 min de respiration nasale au réveil`
- **Description** : [à compléter]
- **Bénéfice** : [à compléter]

### 1.2 — `defi_froid`

- **Title** : `Défi froid`
- **Subtitle** : `30 secondes d'eau froide (douche, jet)`
- **Description** : [à compléter]
- **Bénéfice** : [à compléter]

### 1.3 — `mouvement_recuperation`

- **Title** : `Mouvement ou récupération`
- **Subtitle** : `Selon ton ressenti du jour`
- **Description** : [à compléter]
- **Bénéfice** : [à compléter]
- **Note** : alterne mouvement (J1/3/5/...) vs récupération (J2/4/6/...) selon programme — à préciser

### 1.4 — `mineralisation`

- **Title** : `Minéralisation`
- **Subtitle** : `250 ml d'eau de mer ou 500 ml de jus...`
- **Description** : [à compléter]
- **Bénéfice** : [à compléter]

### 1.5 — `fenetre_digestive`

- **Title** : `Fenêtre digestive`
- **Subtitle** : `Pas d'aliment solide avant 10h30-11h`
- **Description** : [à compléter]
- **Bénéfice** : [à compléter]

### 1.6 — `fruits`

- **Title** : `Fruits`
- **Subtitle** : [à compléter]
- **Description** : [à compléter]
- **Bénéfice** : [à compléter]

### 1.7 — `soiree_sans_ecrans`

- **Title** : `Soirée sans écrans`
- **Subtitle** : [à compléter]
- **Description** : [à compléter]
- **Bénéfice** : [à compléter]

## 2 — Messages du jour (J1 à J14)

1 message court (1-3 phrases) affiché en haut d'HomeScreenV1 chaque jour avant validation. Voix Mimi & Jacky.

| Jour | Message | Note narrative |
|---|---|---|
| J1 | [à compléter] | Démarrage — pas trop d'enthousiasme |
| J2 | [à compléter] | Premier vrai test |
| J3 | [à compléter] | Avant jour-charnière |
| J4 | [à compléter] | Effet miroir possible (D37) |
| J5 | [à compléter] | |
| J6 | [à compléter] | |
| J7 | [à compléter] | Avant jour-charnière |
| J8 | [à compléter] | |
| J9 | [à compléter] | |
| J10 | [à compléter] | |
| J11 | [à compléter] | Avant jour-charnière |
| J12 | [à compléter] | |
| J13 | [à compléter] | |
| J14 | [à compléter] | Dernier jour Phase 0 |

## 3 — Jours-charnière (IA-14)

4 écrans narratifs superposés au premier lancement du jour concerné (D19).

### J3 — Premier seuil

- **Marker** : `Jour 3 · Trois jours derrière toi`
- **Titre** : [à compléter]
- **Body** : [à compléter — phrase d'effet miroir qualitatif D37 attendue]
- **CTA fermeture** : `Continuer`

### J7 — Cap de la semaine

- **Marker** : `Jour 7 · Une semaine complète`
- **Titre** : [à compléter]
- **Body** : [à compléter — effet miroir qualitatif]
- **CTA** : `Continuer`

### J11 — Avant-dernière ligne droite

- **Marker** : `Jour 11 · Bientôt deux semaines`
- **Titre** : [à compléter]
- **Body** : [à compléter — effet miroir qualitatif]
- **CTA** : `Continuer`

### J14 — Fin Phase 0

- **Marker** : `Jour 14 · Tu as bouclé l'amorçage`
- **Titre** : [à compléter]
- **Body** : [à compléter — annonce S0.1 le lendemain]
- **CTA** : `Continuer`

## 4 — Soft-rappel D26 (sous 5/7)

Affiché en modale IA-15 quand `actionsCount < 5`.

- **Titre** : [à compléter — bienveillant, pas culpabilisant]
- **Body** : [à compléter]
- **CTA1** : `Cocher d'autres actions` (ferme modale, retour à la coche)
- **CTA2** : `Valider quand même` (consume joker si dispo)

## 5 — Notes voix

- Pas de "Bravo !" "Super !" etc.
- Pas de chiffres décoratifs
- Privilégier observation physiologique sur émotion
- Quand effet miroir : énumérer 1-2 signaux concrets que l'utilisateur peut avoir ressentis

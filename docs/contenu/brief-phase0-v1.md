# Brief contenu — Phase 0 (J1-J14) V1

**Statut** : 7 actions validées Mimi & Jacky 2026-05-26 (Sprint 28). Messages du jour + jours-charnière à compléter.
**Cible code** :
- `src/data/phase0-actions.ts` (7 actions)
- `src/screens/v1/HomeScreenV1.tsx` (messages du jour + header validation)
- `src/screens/v1/Phase0ActionDetailScreen.tsx` (bouton + détail action)
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
- **Pourquoi** : `Au réveil, ton corps est encore en mode survie — le cortisol est à son pic. 5 minutes de respiration nasale suffisent à calmer le système nerveux et préparer ton énergie pour la journée.`
- **Astuce** : `Avant le téléphone. Avant tout. C'est là que ça change tout.`

### 1.2 — `defi_froid`

- **Title** : `Défi froid`
- **Subtitle** : `30 secondes d'eau froide (douche, poignets ou visage)`
- **Pourquoi** : `Le froid active le nerf vague et déclenche une réponse d'adaptation dans tout le corps. Résultat : meilleure régulation du stress, énergie plus stable, système immunitaire renforcé. 30 secondes suffisent.`
- **Astuce** : `Expire lentement par la bouche dès que l'eau froide touche ton corps. C'est ce souffle qui transforme l'inconfort en signal positif.`

### 1.3 — `mouvement_recuperation`

- **Title** : `Mouvement ou récupération`
- **Subtitle** : `Selon ton ressenti du jour`
- **Pourquoi** : `En Phase 0, l'objectif n'est pas de performer — c'est d'écouter. Ton corps envoie des signaux chaque jour. Apprendre à les lire, c'est la base de toute vraie vitalité.`
- **Astuce** : `Pas de culpabilité si tu choisis récupération. Les champions récupèrent autant qu'ils s'entraînent — c'est ça la vraie performance.`

### 1.4 — `mineralisation`

- **Title** : `Minéralisation`
- **Subtitle** : `250 ml d'eau de mer ou 500 ml de jus de légumes`
- **Pourquoi** : `Sans minéraux, ton corps tourne au ralenti — même si tu dors bien et manges correctement. Une minéralisation matinale recharge les bases : énergie, nerfs, récupération. C'est le fondement du terrain.`
- **Astuce** : `L'eau de mer est l'option la plus puissante et la plus rapide. Si tu n'en as pas encore, commence par le jus de légumes — l'essentiel c'est de démarrer.`

### 1.5 — `fenetre_digestive`

- **Title** : `Fenêtre digestive`
- **Subtitle** : `Pas d'aliment solide avant 10h30–11h`
- **Pourquoi** : `La nuit, ton corps ne dort pas vraiment — il nettoie, répare, régule. Manger trop tôt le matin interrompt ce processus. Laisser cette fenêtre digestive, c'est laisser ton corps finir son travail. Énergie plus stable. Digestion plus légère. Dès les premiers jours.`
- **Astuce** : `La faim du matin est souvent une habitude, pas un vrai besoin. Attends 15 minutes — elle disparaît presque toujours. Ton corps s'adapte en 3 à 5 jours.`

### 1.6 — `fruits`

- **Title** : `Fruits dans la journée`
- **Subtitle** : `2 à 3 fruits frais`
- **Pourquoi** : `Le fruit frais est l'un des aliments les plus complets qui existe — eau, sucres naturels, minéraux, fibres, enzymes vivantes. Il se digère vite, libère de l'énergie propre et nourrit le terrain en profondeur. Simple. Puissant. Sous-estimé.`
- **Astuce** : `Mange-les seuls ou avant le repas — jamais après. Le fruit sur un estomac plein fermente et fatigue la digestion. Ce petit détail change tout.`

### 1.7 — `soiree_sans_ecrans`

- **Title** : `Soirée sans écrans`
- **Subtitle** : `1h avant le coucher, écrans coupés`
- **Pourquoi** : `Chaque soir, ton cerveau attend un signal pour déclencher le sommeil — la baisse de lumière. Les écrans envoient le signal inverse. Résultat : mélatonine bloquée, endormissement retardé, sommeil moins profond. Une heure sans écran, c'est redonner à ton cerveau le signal qu'il attend.`
- **Astuce** : `Mets ton téléphone hors de la chambre — pas en mode avion, hors de la chambre. Tant qu'il est là, ton cerveau reste en alerte. C'est physiologique, pas une question de volonté.`

## Bouton détail action (Phase0ActionDetailScreen)

- **Label** : `C'est fait, on continue` (remplace ancien `C'est pris, je rentre`)

## Message HomeScreenV1 (header avant validation)

- **Texte** : `Coche ce que tu as fait aujourd'hui. 5 sur 7 suffisent pour valider ta journée. Chaque action compte.`

## 2 — Messages du jour (J1 à J14)

1 message court (1-3 phrases) affiché en haut d'HomeScreenV1 chaque jour avant validation. Voix Mimi & Jacky.

**Statut** : drafts Claude — à valider/réécrire Mimi & Jacky.

### J1 — Démarrage sans hype
> Premier jour. Pas de pression — on pose juste le terrain. Tu coches ce que tu fais. Demain on continue.

### J2 — Premier vrai test
> Deuxième jour. C'est là que le rythme commence à s'installer. Pas hier, pas dans une semaine. Aujourd'hui.

### J3 — Avant jour-charnière
> Tu approches du premier seuil. Les trois premiers jours, le corps observe. Demain, tu vas sentir ce qui a déjà bougé.

### J4 — Effet miroir possible (D37)
> Quatre jours. Si ton sommeil a changé, même légèrement, ce n'est pas un hasard. Le corps répond à ce qu'on lui donne.

### J5
> Mi-parcours de la première semaine. Continue d'écouter ce que ton corps signale — la fatigue qui baisse, la digestion qui s'allège.

### J6
> Six jours. Le rythme est posé. Pas spectaculaire — physiologique. C'est ce qui dure.

### J7 — Avant jour-charnière
> Une semaine. Demain, on regarde le chemin parcouru. Aujourd'hui, on coche encore.

### J8
> Deuxième semaine. Le corps a digéré les premiers signaux. Maintenant il intègre.

### J9
> Neuf jours. La régularité fait le travail à ta place. Les actions de base demandent moins d'effort qu'au début.

### J10
> Dix jours. Cap des deux tiers. Ce qui était nouveau il y a une semaine devient automatique.

### J11 — Avant jour-charnière
> Onze jours. Avant-dernière ligne droite. Trois jours encore avant la fin de cette phase.

### J12
> Douze jours. La marge est là — tu peux ralentir un peu sans casser le rythme. Continue d'observer.

### J13
> Treize jours. Demain, dernier jour d'amorçage. Profite de cette journée pour sentir ce qui a changé.

### J14 — Dernier jour Phase 0
> Quatorze jours. Tu as bouclé l'amorçage. Demain, on entre dans la suite — la toile se révèle.

## 3 — Jours-charnière (IA-14)

4 écrans narratifs superposés au premier lancement du jour concerné (D19).

**Statut** : Validé Mimi 2026-05-26 (intégration code Sprint 30).

**Cascade option A** : si palier streak coïncide avec charnière (J7 = palier 7j), la modale palier s'affiche d'abord, puis la charnière s'enchaîne à la fermeture de la modale palier.

### J3 — Premier seuil

- **Marker** : `Jour 3 · cap symbolique`
- **Titre** : `Le corps commence à répondre.`
- **Body** :
  > Trois jours, c'est court — mais ton corps a déjà reçu les premiers signaux. Une digestion qui change, un sommeil un peu différent, une énergie légèrement autre. Tu commences à sentir. Continue — c'est exactement là que ça commence.
- **CTA** : `Je continue`

### J7 — Cap de la semaine (séquence après palier 7j)

- **Marker** : `Jour 7 · une semaine`
- **Titre** : `Sept jours.`
- **Body** :
  > Ton corps a enregistré le rythme — il commence à l'attendre. Ce que tu ressens maintenant, note-le. C'est ton point de départ réel.
- **CTA** : `Je continue`

### J11 — Ligne droite finale

- **Marker** : `Jour 11 · ligne droite finale`
- **Titre** : `Le plus dur est derrière toi.`
- **Body** :
  > Onze jours. Tu es dans la dernière ligne droite. Ce que tu ressens maintenant — cette légèreté, cette clarté qui s'installe — c'est ton corps qui a intégré les signaux. Trois jours pour terminer ce que tu as commencé. Tu ne lâches pas maintenant.
- **CTA** : `Je continue`

### J14 — Fin Phase 0

- **Marker** : `Jour 14 · fin de Phase 0`
- **Titre** : `Tu as tenu. 14 jours.`
- **Body** :
  > Quatorze jours. Tu as tenu. Ton corps n'est plus le même qu'au Jour 1 — même si tu ne vois pas encore tout. La Phase 0 est complète. La suite commence maintenant.
- **CTA** : `Voir la suite`

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

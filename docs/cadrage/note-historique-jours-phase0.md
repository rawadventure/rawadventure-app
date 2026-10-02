# Historique des jours précédents — note de réflexion

*Document de travail du 1er octobre 2026.*

> **Décision de Stéphane (2 octobre 2026)** : options A et B faites (B = décision D45, CLAUDE.md § 10) ; option C gardée pour après la beta. Choix retenus pour B : un seul jour en arrière, détail gardé sur le téléphone uniquement, lecture seule. Les questions de fin de note restent ouvertes pour C.

## La demande

Retour testeuse (30 septembre) : « Peut-on revoir les cases cochées de la veille ? »
Précision de Stéphane : on parle d'un historique, de la journée précédente et éventuellement des autres jours.

## Ce que l'app fait aujourd'hui

- **Pendant la journée** : les 7 cases cochées sont gardées sur le téléphone, sous la date du jour.
- **À la validation** (manuelle ou automatique, D44) : le détail des cases est **effacé**. L'app ne garde que deux choses : le statut de la journée (validée, joker, manquée) et le **nombre** d'actions cochées (par exemple 5), pour les comptes connectés.
- **Conséquence 1** : après validation, les cases s'affichent vides et grisées. On ne voit même plus ce qu'on a coché le jour même.
- **Conséquence 2** : il est impossible aujourd'hui d'afficher « hier tu avais fait froid, fruits et écrans ». L'information n'existe plus nulle part.

Pour les journées déjà passées des testeuses, le détail est donc perdu. Un historique ne pourra montrer le détail qu'**à partir du jour où on commence à le garder**. Pour les jours d'avant, seul le nombre (« 5 sur 7 ») est disponible.

## Ce que disent les décisions déjà prises

- **D34 — pas de score quotidien en V1.** Le ratio « 5/7 » ne doit être ni stocké ni agrégé sur la durée. Une table `daily_check_ins` existe, vide, réservée à la V2.
- **D36 — pas de questionnaire de fin de journée en V1.**
- **D27 — une journée validée ne se modifie pas.** Un historique est donc forcément en lecture seule.
- **D28 — pas de synchronisation entre appareils** pour les données locales.
- **Principe 1 — l'utilisateur ne doit pas réfléchir** et **principe 3 — simplicité extrême.**
- **Principe 8 — ne pas mettre toujours plus.** La progression passe par la finesse d'observation, pas par l'accumulation.
- **Ton — pas de pression par la perte.** Un historique qui montre des cases vides en rouge irait contre cette règle.

**Point de friction :** un historique détaillé touche directement D34. Garder la liste des actions cochées par jour, c'est stocker plus que le ratio. Ce n'est pas un « score » au sens d'une note, mais c'est la même famille de données. Si on fait un historique, il faut réviser D34 en connaissance de cause.

## À quoi sert un historique, concrètement

Trois besoins possibles derrière la demande, qui n'appellent pas la même réponse :

1. **Se rassurer** : « est-ce que ma journée d'hier a bien été prise en compte ? » Besoin de confirmation.
2. **Se repérer** : « qu'est-ce que je fais régulièrement, qu'est-ce que je saute ? » Besoin d'observation, cohérent avec le principe 2 (le ressenti, la lecture de soi).
3. **Corriger** : « j'ai oublié de cocher une case hier. » Besoin de modification, interdit par D27.

Le besoin 1 est en partie couvert depuis ce matin : la validation automatique affiche « Hier, tu avais coché 5 actions sur 7 : ta journée est validée. » Il faudrait demander à la testeuse lequel des trois elle avait en tête.

## Les options

### Option A — Garder les cases visibles après validation (le jour même)

Après validation, les cases cochées restent affichées, grisées, jusqu'à minuit.

- **Pour** : corrige un vrai défaut d'aujourd'hui, très simple, aucune décision à réviser, aucun stockage nouveau au-delà de la journée.
- **Contre** : ne répond pas à « la veille ».
- **Charge** : environ 1 heure.

### Option B — « Hier » en lecture seule

En plus de A : sur l'accueil, une ligne discrète « Hier : 5 actions sur 7 », qui s'ouvre sur la liste des 7 actions avec celles qui étaient cochées. Un seul jour en arrière.

- **Pour** : répond mot pour mot à la demande, reste léger, pas de navigation nouvelle.
- **Contre** : demande de garder le détail d'une journée passée (une seule, sur le téléphone). Touche D34 à la marge.
- **Charge** : environ 3 heures.

### Option C — Historique complet de la Phase 0

Un écran « Mon parcours » : les 14 jours en ligne ou en grille, chaque jour avec son statut (validé, joker, manqué) et, au toucher, le détail des actions.

- **Pour** : répond au besoin d'observation (repérer ses régularités), rend la progression visible (principe 5).
- **Contre** :
  - révise franchement D34 ;
  - ajoute un écran qui n'est pas dans la carte des 45 écrans V1 ;
  - risque de tourner au tableau de bord chiffré, loin du « ressenti avant la théorie » ;
  - les jours manqués deviennent visibles : à dessiner avec soin pour ne pas culpabiliser ;
  - pour être fiable, le détail devrait être enregistré dans le compte (table `daily_check_ins`), pas seulement sur le téléphone, sinon il disparaît à la réinstallation de la PWA ;
  - que devient cet écran en Phase 1, où les actions de Phase 0 sont retirées ?
- **Charge** : 1 à 2 jours, plus un passage design et copy.

### Option D — Ne rien ajouter, répondre par le narratif

Les écrans de jour-charnière (J3, J7, J11, J14) portent déjà un « effet miroir » qualitatif (D37) : ils renvoient à l'utilisateur ce qu'il a pu ressentir. On considère que c'est la réponse du produit au besoin d'observation, et on ne fait que l'option A.

- **Pour** : cohérent avec la vision, zéro dette.
- **Contre** : la testeuse n'a pas ce qu'elle a demandé.

## Recommandation

**Faire A maintenant, proposer B aux testeuses, garder C pour après la beta.**

- A est une correction, pas une nouveauté : on la fait sans débat.
- B est la plus petite réponse honnête à la demande. Elle peut se tester pendant la beta : si les testeuses l'ouvrent, on saura que le besoin est réel.
- C est une vraie fonctionnalité produit. Elle mérite une décision de Mimi & Jacky sur le fond (est-ce qu'un historique chiffré sert la pédagogie ou la contredit ?) et une révision assumée de D34. À ne pas décider sur un seul retour.

## Questions à trancher par Stéphane

1. Quel besoin veut-on servir : se rassurer, se repérer, ou les deux ?
2. Accepte-t-on de garder le détail des actions cochées d'une journée passée ? Si oui, D34 doit être précisée (« pas de score agrégé » plutôt que « rien de stocké »).
3. Un jour en arrière (option B) ou tout le parcours (option C) ?
4. Si historique : sur le téléphone seulement (perdu à la réinstallation) ou dans le compte ?
5. Faut-il demander l'avis de Mimi & Jacky avant, sur l'intérêt pédagogique d'un historique ?

## Si on décide d'avancer

- Option A seule : petit lot, test de flow, commit.
- Option B : nouvelle décision à consigner (D45), stockage du détail de la veille, écran de lecture, copy à valider pour la ligne « Hier ».
- Option C : passage par une spec d'écran (nouvel identifiant IA), maquette, puis lots.

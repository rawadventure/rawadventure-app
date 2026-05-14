# Raw Adventure App — Feature Spec V1 — Socle minimum

**Version :** 1.2
**Date :** 5 mai 2026 (V1.0 initiale) — patché le 7 mai 2026 (V1.1 post-audit V0) — patché le 13 mai 2026 (V1.2 — acte du joker en Phase 1)
**Auteur :** Stéphane (avec assistance Claude)
**Statut :** Validé — prêt à être versé au Project et au repo

---

## Préambule

Ce document est le premier livrable de la Feature Spec V1 de Raw Adventure App. Il documente le **socle minimum** nécessaire pour démarrer le Brief contenu V1 et préparer la Feature Spec détaillée des 8 piliers.

Le Socle minimum couvre quatre sections : les conventions d'écriture de la Feature Spec, les mécaniques transverses globales de l'app, les deux fiches d'écran du S0 (semaine de transition), et le format-type d'intro de pilier qui sera dupliqué pour chacun des 8 piliers de Phase 1.

**Ce qui n'est pas dans ce document :** les fiches détaillées des 8 piliers de Phase 1 (S1 Respiration et suivants), les écrans périphériques (profil, mentorat, paramètres, mentions légales), le mapping détaillé profil onboarding → niveau de départ (D15), le calibrage du contenu bonus (D16), le calcul détaillé des scores et de la toile (Métriques V1), la stratégie de notifications (D12 reportée).

**Lecteurs cibles :** Stéphane (validation produit) et Claude Code (exécution dev), à égalité. Le doc est lisible par un humain non-développeur et exécutable par un assistant codeur sans intervention de traduction technique.

**Niveau de prescription :** léger. Description fonctionnelle, calculs en plain language. Pas de code TypeScript figé, pas de noms de composants imposés. Le dev tranche les choix techniques au moment de l'implémentation.

**Note de patch V1.1 (7 mai 2026).** Patches appliqués suite à la livraison de l'audit V0 vs docs fondateurs et à l'étape 3 du Plan de patches en cascade. Trois sections existantes patchées : 2.4 (seuil Phase 0 passe de 4/6 à 5/7), 2.5 (joker en semaine calendaire fixe au lieu de glissante, plus alignement seuil), 2.7 (sémantique adaptation messagée vs changement automatique). Deux sections nouvelles ajoutées : 2.10 (Migration des données local → distant à la création de compte) et 2.11 (Posture du reset utilisateur en V1). Annexe B refondue avec le contexte post-audit.

**Note de patch V1.2 (13 mai 2026).** Patch en sortie de production de la Feature Spec S1 Respiration. Une section patchée : **2.5** (acte explicite que le joker hebdomadaire continue de s'appliquer en Phase 1 sur la même logique qu'en Phase 0 — 1 joker par semaine calendaire fixe, réinitialisation lundi 00:00 local, consommation à la prochaine ouverture après minuit si la journée précédente n'a pas été validée). Cette précision résout la zone résiduelle Z6 de la Feature Spec S1. Conséquence : les Feature Specs piliers (S1 à S8) renvoient à cette section pour la mécanique joker, pas de redocumentation locale. Aucune autre modification de V1.1.

---

## 1. Conventions Feature Spec

*Cette section pose la grille d'écriture de toutes les fiches d'écran de la V1. Elle ne contient pas de spec produit, juste des règles de rédaction et un mini-glossaire.*

### 1.1 — Règle d'or : pas de duplication avec l'Information Architecture

L'IA V1 documente déjà, pour chaque écran, son rôle, son contenu principal, ses états spéciaux, ses transitions entrantes et sortantes. La Feature Spec **ne réécrit pas** ces informations. Elle les **complète** par ce qui manque pour coder. Toute fiche d'écran commence par une mention "Référence IA : IA-XX — voir Information Architecture V1" et enchaîne directement sur ce qui n'y figure pas.

Dans la pratique, ça veut dire qu'une fiche d'écran ne contient ni description du rôle, ni résumé du contenu principal, ni narration des transitions. Ces trois choses sont dans l'IA, on s'y réfère. Ce que la Feature Spec ajoute : le comportement précis, les données affichées avec leur source, les interactions détaillées, les états techniques, les edge cases, les liens vers le copy et vers les médias.

Si une fiche reproduit du contenu déjà présent dans l'IA, c'est qu'elle est mal écrite ou que l'IA est incomplète. Dans ce dernier cas, on met à jour l'IA, pas la Feature Spec.

### 1.2 — Structure-type d'une fiche d'écran

Toute fiche d'écran de la V1 suit la même structure en huit rubriques. Certaines rubriques peuvent être vides ou réduites à une ligne quand l'écran est simple, mais l'ordre est invariant.

**Référence IA.** Une ligne de la forme "IA-XX — Nom de l'écran — voir Information Architecture V1 §X". Sert de pointeur, pas de résumé.

**Données affichées et leur source.** Liste plate des éléments visibles à l'écran avec, pour chacun, sa source (state local, store global, props, contenu statique du Brief, asset média). Permet à l'assistant codeur de savoir où il va chercher chaque donnée.

**Interactions utilisateur.** Tous les éléments tappables ou activables, avec leur effet. Format "Tap sur X → Y". Une interaction par ligne. Inclut les balayages, les pull-to-refresh, les longs appuis, les boutons système (retour Android).

**États visuels.** Les variantes d'affichage de l'écran selon le contexte. Loading, vide, erreur, succès, plus les états spécifiques au parcours (Phase 0 vs S0 vs Phase 1 vs post-S8) quand l'écran est multi-état.

**Animations et transitions.** Animations propres à l'écran (apparition, validation, succès), transitions vers d'autres écrans (slide, fade, modale). Léger : on dit "fade-in 300ms" plutôt que de spécifier les easings et frames.

**Edge cases.** Tout ce qui peut foirer ou sortir du cas nominal. Données manquantes, perte de connexion, validation déjà faite dans la journée, retour sur l'écran après l'avoir quitté en cours de route, désinstallation/réinstallation. C'est la rubrique qu'on néglige toujours et qui prend 40% du temps de dev quand on l'oublie.

**Copy et médias.** Pointeur vers les emplacements de copy (Audit copy V1, Brief contenu V1) et vers les assets vidéo / image. Si le copy est déjà figé, on l'inclut entre guillemets. Sinon on indique "à produire dans Brief contenu V1, slot `nom-du-slot`".

**Notes pour le dev.** Tout ce qui n'entre dans aucune rubrique précédente et qui mérite d'être mentionné pour celui qui code. Choix d'implémentation suggérés mais non imposés, points de vigilance, dépendances vers d'autres écrans, performance, accessibilité. Section facultative.

### 1.3 — Conventions de nommage

**Identifiants d'écran.** Toujours sous la forme `IA-XX` avec `XX` à deux chiffres. Stable sur toute la V1, sert de référence dans toute la doc et dans le code.

**Identifiants de modale et de couche superposée.** Mêmes identifiants `IA-XX` que les écrans pleins. La distinction modale / pleine page / couche superposée est portée par la rubrique "Type d'écran" en tête de fiche.

**Identifiants de slots de copy.** `copy.IA-XX.nom-du-slot`. Ces identifiants serviront d'ancre dans le Brief contenu V1 et de clés de traduction quand l'app deviendra multilingue (voir 1.6).

**Identifiants d'assets média.** `media.IA-XX.nom-de-l-asset`. Servent à mapper la production de contenu Mimi & Jacky à des emplacements précis dans l'app.

**Variables et données.** Quand on cite une donnée du modèle, on la met en `code` (par exemple `userProgress.currentStreak`). Le nommage exact des variables est à arbitrer en dev, les noms cités sont des **suggestions**, pas des contrats.

### 1.4 — Type d'écran : pleine page, modale, couche superposée

Trois types d'écran coexistent dans la V1. Chaque fiche d'écran indique son type en première ligne après l'identifiant.

**Pleine page.** Occupe tout l'écran, remplace l'écran précédent dans le stack de navigation. Le bouton retour ramène à l'écran précédent. C'est le type par défaut.

**Modale.** Apparaît par-dessus l'écran courant, sans le quitter. Fond légèrement assombri. Se ferme avec un bouton explicite ou en tapant en dehors. Le retour à l'écran d'origine se fait sans recharger.

**Couche superposée.** Recouvre l'écran courant pour un moment narratif, avec une dramaturgie plus forte qu'une modale. Pas de fond grisé, prend tout l'écran. Se ferme automatiquement à la fin du moment ou via un bouton "Continuer".

La différence entre modale et couche superposée tient en une intention : la modale **demande quelque chose** à l'utilisateur (validation, choix, info ponctuelle), la couche superposée **lui fait vivre quelque chose** (un moment narratif, une transition, une célébration). Quand le doute existe, la fiche d'écran tranche explicitement.

### 1.5 — Mini-glossaire produit

**Pilier.** Une dimension de santé travaillée dans l'app. La Phase 0 en pratique 6 (respiration nasale, hydratation, fenêtre digestive, mouvement quotidien, sommeil, défi froid). La Phase 1 en travaille 8 sur 8 semaines (Respiration, Alimentation, Mindset, Condition physique, Repos et régénération, Passion et chemin de vie, Connexion au vivant, Élimination et détox). Les piliers de Phase 0 et de Phase 1 ne se confondent pas.

**Phase.** Période du parcours utilisateur. Phase 0 = 14 jours gratuits multi-piliers. S0 = transition de 2 jours. Phase 1 = 8 semaines payantes mono-pilier. Post-S8 = mode consolidation libre.

**Semaine.** Unité de Phase 1, dédiée à un pilier. Référencée par S1 à S8. Une semaine de Phase 1 fait 7 jours, mais le démarrage dépend du jour où l'utilisateur active la phase.

**Session.** Pratique unitaire en Phase 1. Trois sessions par jour, soit 21 sessions par semaine de pilier. Une session inclut un test de ressenti avant, la pratique guidée, un test de ressenti après, et une validation.

**Check quotidien.** Acte de validation de la journée par l'utilisateur. Dure moins d'une minute. En Phase 0, valide les actions cochées du jour (seuil 5/7, D6 modifié 7 mai 2026). En Phase 1, valide les sessions du jour (seuil 1/3).

**Streak.** Compteur de jours consécutifs validés. Cassé si un jour n'est pas validé et que le joker hebdomadaire est déjà consommé.

**Joker hebdomadaire.** Permet à un jour non validé de ne pas casser le streak, dans la limite d'un par semaine calendaire fixe (lundi 00:00 au dimanche 23:59 fuseau local).

**Palier de récompense.** Étape symbolique du streak qui déclenche un moment narratif spécial : modale dédiée, vidéo de 30 secondes Mimi & Jacky, badge ajouté à la galerie. Six paliers en V1 : 7, 15, 30, 60, 100 jours et 1 an.

**Toile d'araignée.** Représentation visuelle du score de vitalité de l'utilisateur sur les 8 piliers de Phase 1. Huit branches, une par pilier. Masquée en Phase 0, révélée au S0.1.

**Branche.** Une des 8 dimensions de la toile, correspondant à un pilier de Phase 1.

**Score local.** Indicateur d'engagement sur la semaine de pilier en cours. Différent du score global de la branche correspondante.

**Niveau adaptatif manuel.** Mécanique qui permet à l'utilisateur d'ajuster l'intensité d'une session via un bouton "Moins / Pareil / Plus".

**Niveau d'entrée.** Niveau d'intensité de départ d'un pilier de Phase 1. Trois valeurs : Essentiel, Progression, Immersion. Calibré par l'évaluation initiale (IA-40).

**Profil dynamique.** Catégorie attribuée à l'utilisateur en sortie d'onboarding parmi 8 profils possibles. Sert à personnaliser le ton.

**Conversion précoce.** Cas d'un utilisateur qui s'abonne avant la fin de la Phase 0 (avant le J15).

**Jour-charnière.** Jour de Phase 0 qui déclenche un écran narratif spécial. Quatre jours-charnières en V1 : J3, J7, J11, J14.

**Premier lancement du jour.** Première ouverture de l'app après un changement de date calendaire. Voir 2.3.

### 1.6 — Conventions multilingues

L'app sera traduite à terme. Le périmètre V1 est exclusivement français — pas de traduction à la sortie, pas de sélecteur de langue dans le profil — mais l'architecture doit être compatible avec une traduction ultérieure sans refactor lourd.

**Tout texte affiché à l'utilisateur passe par un slot de copy identifié.** Pas de chaîne en dur dans le code des écrans. Chaque texte visible — bouton, titre, message, notification, label de formulaire, message d'erreur — est référencé par son identifiant de slot et résolu au moment du rendu via une fonction de traduction.

**Les identifiants de slot de copy sont indépendants de la langue.** L'identifiant `copy.IA-15.message-validation-phase-0` est stable quel que soit le contenu français, anglais ou autre.

**Les contenus média sont traités comme des assets dédiés à une langue.** L'identifiant d'asset (`media.IA-XX.nom-de-l-asset`) ne préjuge pas de la langue. Quand l'app sera traduite, chaque média aura sa version par langue.

**Hors scope V1.** Sélecteur de langue dans le profil utilisateur, traduction effective des contenus, gestion des fallbacks de langue, formats régionaux.

**Note pour le dev.** Le choix de la bibliothèque de traduction (i18next, react-intl, expo-localization, ou solution maison) relève de l'assistant codeur. La seule exigence côté Feature Spec : tout texte utilisateur doit être référençable par identifiant et chargeable depuis un fichier de traduction externe.

### 1.7 — Niveau de prescription technique

La Feature Spec décrit **ce que l'écran doit faire**, pas **comment c'est implémenté**. On ne nomme pas de composants React Native, on ne définit pas de structures TypeScript, on ne pose pas de patterns d'architecture.

Quand un comportement implique un calcul, on l'écrit en plain language. Pas de pseudocode, pas de formule mathématique sauf si elle clarifie. Si une formule est nécessaire, elle reste haut niveau et renvoie à Métriques V1 pour le détail.

Quand une donnée doit être persistée, on le mentionne, mais on ne dit pas où ni comment. Le choix du store (AsyncStorage, SQLite, backend) relève du dev.

Quand un comportement dépend d'un timer ou d'une animation, on donne une indication grossière (court, moyen, long, ou en millisecondes pour les seuils critiques) mais on ne ferme pas la valeur précise.

### 1.8 — Articulation avec les autres docs

**Information Architecture V1** — la carte des écrans. La Feature Spec en dérive. Quand l'IA et la Feature Spec se contredisent, l'IA prime.

**Audit copy V1** — le copy validé pour les 10 slides d'onboarding, les 8 profils dynamiques, les jours-charnières J4/J11/J14, les notifications et messages de récompense streak.

**Brief contenu V1** (à produire) — la production de contenu pilotée par Mimi & Jacky. Le Brief contenu V1 produit le contenu français de la V1. La stratégie de production multilingue sera traitée le moment venu, hors scope V1.

**Métriques V1** (à produire) — le calcul du score de vitalité, des branches de la toile, du score local de présence, des seuils.

**Synthèse des décisions V5 (et suivantes)** — registre vivant des arbitrages produits.

### 1.9 — Conventions de mise à jour

La Feature Spec V1 est un document vivant tant que la V1 n'est pas livrée.

**Toute modification de comportement validée doit être reportée dans la Feature Spec avant le prochain commit Claude Code.** Sinon le code et la spec divergent.

**Toute mise à jour est faite à deux endroits : dans le Project Claude.ai et dans le repo (à côté du CLAUDE.md).** La synchro est manuelle.

**Toute décision tranchée pendant la rédaction de la Feature Spec est ajoutée à la Synthèse des décisions avec un identifiant Dn.**

---

## 2. Socle transverse

*Cette section documente les mécaniques globales qui s'appliquent partout dans l'app, indépendamment des écrans spécifiques.*

### 2.1 — États globaux de l'app et règles de transition

**Les six états du parcours**

L'utilisateur est toujours dans exactement un de ces six états à tout moment.

**État `onboarding`.** L'utilisateur traverse les 10 slides d'onboarding et la création de compte. Pas de tab bar visible, pas d'accueil. Sortie : passage en `pre_phase_0_waiting` ou directement en `phase_0` selon le choix de démarrage différé (D24).

**État `pre_phase_0_waiting`.** État court qui couvre la période entre la création de compte et le minuit local du jour de démarrage choisi (D24). Tab bar Profil active, autres onglets masqués ou inactifs, écran d'attente affiché à la place de l'accueil. Sortie automatique : à la première ouverture après le passage de minuit local.

**État `phase_0`.** L'utilisateur est en Phase 0, entre J1 et J14. Multi-actions parallèle, 7 actions cochables par jour (activation matin, froid, mouvement ou récup, minéralisation, fenêtre digestive, fruits, soirée), toile masquée, onglet Toile invisible dans la tab bar. Cet état dure 14 jours calendaires.

**État `s0`.** L'utilisateur est en S0 de transition, deux jours, sous-divisé en `s0_1` et `s0_2`. À J15 calendaire, l'app passe automatiquement en `s0_1` au premier lancement du jour. À J16, passage automatique en `s0_2`. L'état se termine à la validation de l'évaluation initiale de S1 (sortie d'IA-41).

**État `phase_1`.** L'utilisateur est en Phase 1, dans une semaine de pilier (S1 à S8). Cet état porte une variable interne `currentPilar` (1 à 8) et `currentDayInPilar` (1 à 7). Mono-pilier focus, 3 sessions par jour.

**État `post_s8`.** L'utilisateur a fini la Phase 1, mode consolidation libre. Pas de pilier imposé, accès libre, streak qui continue, mentorat en proposition active.

**Les variables qui déterminent l'état**

`accountCreatedAt` — timestamp ISO de la création de compte (ou du minuit local suivant si démarrage différé).

`currentPhase` — chaîne parmi `onboarding`, `pre_phase_0_waiting`, `phase_0`, `s0_1`, `s0_2`, `phase_1`, `post_s8`.

`currentPilar` — entier de 1 à 8, valable uniquement en `phase_1`.

`pilarStartedAt` — timestamp ISO du démarrage du pilier courant en Phase 1, posé à la sortie de l'évaluation initiale (IA-41).

À l'ouverture de l'app, l'app vérifie la cohérence de ces variables avec le calendrier réel et met à jour `currentPhase` si une transition est due.

**Les règles de transition entre états**

Toute transition est déclenchée soit par une action utilisateur explicite, soit par le passage du temps détecté à l'ouverture de l'app. Pas de transition silencieuse en arrière-plan en V1.

`onboarding` → `pre_phase_0_waiting` ou `phase_0` selon D24.

`pre_phase_0_waiting` → `phase_0` au premier lancement après minuit local du jour choisi.

`phase_0` → `s0_1` au premier lancement du J15 calendaire. Déclenche apparition de l'onglet Toile et ouverture automatique d'IA-20.

`s0_1` → `s0_2` au premier lancement du J16. Déclenche IA-21.

`s0_2` → `phase_1` (S1) à la validation de l'évaluation initiale du pilier 1 (sortie d'IA-41 par "Démarrer cette semaine"). Pose `currentPilar = 1`, `pilarStartedAt = now`.

`phase_1` (Sn) → `phase_1` (Sn+1) à la validation de l'évaluation finale du pilier n. Pas de transition automatique au calendrier.

`phase_1` (S8) → `post_s8` à la validation de l'évaluation finale du pilier 8.

**Cas particulier — abandon et retour longtemps après.** L'app applique les transitions accumulées en jouant les écrans narratifs correspondants une seule fois au prochain lancement, dans l'ordre, à raison d'un par session (D25).

**Cas particulier — utilisateur reste sur le même pilier indéfiniment.** L'app reste sur ce pilier. L'accueil affiche un encart de relance à partir du 7e jour (slot `copy.global.relance-evaluation-finale`).

**Calcul du jour courant**

`currentDayInPhase0` — entier de 1 à 14, calculé en jours calendaires complets entre `accountCreatedAt` et `now`, +1, borné.

`currentDayInPilar` — entier de 1 à 7, calculé de la même façon avec `pilarStartedAt`. Au-delà de 7, le calcul reste à 7 et l'évaluation finale est proposée chaque jour.

**Notes pour le dev**

Le store qui porte les variables d'état est la source de vérité du parcours. Tout écran qui dépend du parcours en lit l'état, ne le calcule pas localement. Les transitions sont effectuées par une fonction unique appelée à chaque ouverture de l'app et après chaque action utilisateur structurante.

### 2.2 — Architecture de navigation et tab bar

L'app utilise une tab bar à trois onglets, sans menu hamburger ni tiroir latéral.

**Les trois onglets**

**Onglet Accueil.** Toujours visible (sauf en `onboarding` et `pre_phase_0_waiting`), toujours actif par défaut au lancement. Mène à IA-11.

**Onglet Toile.** Apparaît dans la tab bar à partir de la transition `phase_0` → `s0_1`. Avant ce moment, l'onglet n'existe pas. Mène à IA-25. L'apparition est instantanée au déclenchement d'IA-20 — l'onglet est techniquement présent dès le déclenchement, l'utilisateur ne le voit qu'à la fermeture d'IA-20 quand la tab bar redevient visible.

**Onglet Profil.** Toujours visible. Mène à IA-70.

**Comportement de la tab bar selon le contexte**

**Tab bar visible.** Sur tous les écrans pleine page accessibles depuis la navigation principale.

**Tab bar masquée.** Slides d'onboarding (IA-01 à IA-10), IA-10b et IA-10c (démarrage différé), écran de session Phase 1 (IA-43), écrans de jour-charnière (IA-14), écrans S0 (IA-20 et IA-21), sortie de S8 (IA-22), évaluations 12 questions (IA-40, IA-46). Et toutes les couches superposées et modales.

**Tab bar grisée.** Écrans intermédiaires d'évaluation (IA-41, IA-47). Tap sur un onglet sort du flow et abandonne l'évaluation en cours.

**Comportement du retour Android**

Sur écran principal de tab bar : ferme l'app.

Sur écran de second niveau accessible depuis un onglet : ramène à l'écran d'origine de l'onglet.

Sur modale : ferme la modale et ramène à l'écran sous-jacent.

Sur couche superposée à but narratif : désactivé pendant la lecture vidéo, activé après. Une fois activé, ferme la couche.

Sur séquences en mode tunnel : ramène à l'étape précédente, désactivé sur la première étape.

**Comportement de la transition entre onglets**

Pas de tunnel narratif imbriqué entre onglets. Quand l'utilisateur change d'onglet, le contexte de l'onglet précédent est préservé. Les évaluations 12 questions ne sont jamais interrompues par un tap d'onglet (la tab bar est masquée).

**Cas particulier — IA-30 modale d'abonnement**

Tab bar visible mais inaccessible. Seule exception V1. L'utilisateur peut voir les onglets pour avoir un repère psychologique mais ne peut pas naviguer dessus tant que la modale n'est pas fermée. Cohérent avec D3.

**Notes pour le dev**

Implémentation suggérée : React Navigation avec un Bottom Tab Navigator pour les trois onglets et des Stack Navigators imbriqués pour chaque onglet.

L'apparition de l'onglet Toile au S0.1 est conditionnée à `currentPhase` qui n'est ni `phase_0`, ni `onboarding`, ni `pre_phase_0_waiting`. Il faut s'assurer que la mise à jour de `currentPhase` déclenche un re-render de la tab bar.

### 2.3 — Gestion temporelle

**Date de référence : le fuseau horaire local de l'utilisateur**

L'app raisonne en temps local de l'appareil. Toutes les dates qui définissent un "jour" du parcours sont calculées dans le fuseau horaire local courant. Pas de conversion en UTC pour les calculs de jour.

Un utilisateur qui voyage et change de fuseau horaire peut voir son calendrier de parcours "sauter" ou "régresser" d'un jour. Acceptable en V1. À reverra en V1.5 si retours utilisateurs.

**Date de création de compte et minuit local**

`accountCreatedAt` est un timestamp ISO complet (date + heure + fuseau). Posé soit au moment de la création effective, soit au minuit local suivant si l'utilisateur a choisi le démarrage différé (D24).

Pour calculer le jour J du parcours, on extrait la date locale d'`accountCreatedAt` et on compare à la date locale courante. Le J1 est le jour calendaire d'`accountCreatedAt`. Le J2 commence au minuit local suivant.

Conséquence assumée : un utilisateur peut vivre un J1 court si son `accountCreatedAt` est tardif. La mécanique de démarrage différé limite ce cas.

**Démarrage différé (D24)**

À la sortie d'IA-10 (création de compte validée), l'app calcule combien d'heures il reste avant minuit local.

Si plus de 4 heures avant minuit, ou si l'utilisateur a déjà passé minuit (heure courante locale entre 0h et 4h du matin), l'app pose `accountCreatedAt = now()` et enchaîne directement sur IA-12.

Si moins ou égal à 4 heures avant minuit (et toujours avant minuit), l'app insère IA-10b (écran de choix). Deux options.

Option 1 — "On démarre maintenant". `accountCreatedAt = now()`, vers IA-12.

Option 2 — "Je commence demain". `accountCreatedAt = startOfNextLocalDay()`, transition vers `pre_phase_0_waiting`, IA-10c.

Sur IA-10c, un bouton "En fait, on démarre maintenant" permet de revenir sur la décision : pose `accountCreatedAt = now()`, transition vers `phase_0`, déclenche IA-12.

Au premier lancement après le minuit local, la fonction de cohérence détecte que `now() >= accountCreatedAt`, bascule l'app en `phase_0` et déclenche IA-12.

**Premier lancement du jour**

Le premier lancement du jour est la première ouverture de l'app dont la date locale est strictement supérieure à la date locale du dernier lancement enregistré. À chaque ouverture, l'app stocke `lastAppOpenAt`. À l'ouverture suivante, on compare la date locale courante à la date locale de `lastAppOpenAt`. Si elles diffèrent, c'est un premier lancement du jour.

Conséquence : si l'utilisateur ouvre à 23h45, ferme, rouvre à 00h05, il déclenche un premier lancement du jour. Comportement attendu.

**Détection des transitions automatiques**

À chaque ouverture, une fonction de cohérence est appelée. Elle vérifie le premier lancement du jour, calcule l'état théorique, déclenche les transitions accumulées dans l'ordre, joue les écrans narratifs prévus une seule fois chacun (D25), à raison d'un par session.

Mécanique techniquement non-triviale — file d'attente d'écrans narratifs à implémenter, avec un seul écran joué par session.

**Marquage des écrans narratifs déjà joués**

Chaque écran narratif déclenché stocke un flag dans le profil de parcours.

Inventaire V1 : `seenJ3CharniereAt`, `seenJ7CharniereAt`, `seenJ11CharniereAt`, `seenJ14CharniereAt`, `seenWelcomeVideoAt`, `seenS0_1ScreenAt`, `seenS0_2ScreenAt`, `seenPhase0ToS1TransitionAt`, `seenS8ExitScreenAt`, plus les flags de paliers (`unlockedTier{N}At` et `tier{N}DisplayedAt`).

Les flags sont posés au déclenchement de l'écran, pas à sa fermeture. Si l'utilisateur ferme pendant la vidéo, l'écran ne se rejoue pas automatiquement. Mais reste accessible volontairement depuis le profil ou un raccourci dédié.

**Comportement en cas d'absence prolongée**

Cas 1 — absence quelques jours en Phase 0. Au retour, message d'accueil de retour Mimi & Jacky non-culpabilisant (`copy.global.message-retour-absence`). Streak peut être cassé selon le joker.

Cas 2 — absence longue traversant un changement de phase. App rejoue les écrans narratifs traversés dans l'ordre, un par session.

Cas 3 — absence très longue. Idem. Si Phase 1, app reste sur le pilier abandonné. Slot `copy.global.message-retour-absence-longue`.

**Notes pour le dev**

Fonction de cohérence pure, idempotente, déterministe.

Stockage des dates en ISO 8601 complet avec fuseau. Suggestion : `date-fns-tz` ou `luxon` plutôt que `Date` natif.

Le déclenchement des écrans narratifs ne doit jamais bloquer le rendu de l'accueil.

### 2.4 — Check quotidien et seuils de validation

Le check quotidien est l'acte central de l'utilisateur. Volontairement court — moins d'une minute. Deux variantes selon la phase.

**Le check quotidien en Phase 0**

L'utilisateur a **7 actions à pratiquer en parallèle** (activation du matin, défi froid, mouvement ou récupération selon le jour, minéralisation, fenêtre digestive, fruits, soirée sans écrans). Bouton "Valider ma journée" sur l'accueil, qui s'active à partir de la première pratique cochée.

Tap sur ce bouton → ouvre IA-15 (modale de validation).

**Soft-rappel avant validation sous le seuil (D26).** Si l'utilisateur tape "Valider ma journée" en Phase 0 avec strictement moins de **5 actions** cochées, IA-15 ne déclenche pas immédiatement la validation. La modale affiche un soft-rappel non-culpabilisant : "Tu as coché [N] actions aujourd'hui. Tu peux encore en cocher d'autres avant de valider, ou valider tout de suite." Deux boutons : "Cocher d'autres actions" qui ferme la modale et ramène à l'accueil, et "Valider quand même" qui enclenche le Cas 2. Slot `copy.IA-15.soft-rappel-sous-seuil`.

**Cas 1 — 5, 6 ou 7 actions cochées.** Journée validée pour le streak. Streak +1. Copy différent selon le nombre exact (variantes Audit copy V1). Si validation déclenche un palier, IA-15 se ferme et IA-50 s'ouvre dans la foulée. Le score `doneCount/totalCount` (par exemple "5/7" ou "7/7") est affiché transitoirement dans la modale comme information utile en temps réel mais n'est ni stocké ni agrégé sur la durée (D34 — pas de score quotidien V1).

**Cas 2 — 1, 2, 3 ou 4 actions cochées (après soft-rappel).** Journée n'atteint pas le seuil. Joker hebdomadaire consommé si dispo. Si dispo, streak conservé. Si déjà consommé, streak cassé. Message non-culpabilisant.

**Cas 3 — aucune action cochée.** Bouton inactif. Pas de check possible. À minuit local, journée non validée et le mécanisme de joker / cassure s'applique automatiquement à la prochaine ouverture.

*Note de patch (7 mai 2026, audit V0 vs docs fondateurs).* Le seuil Phase 0 est passé de "4 piliers sur 6 minimum" à "5 actions sur 7 minimum" suite à la modification de D6 dans la Synthèse V6. Le V0 implémente déjà 7 actions distinctes dans la checklist quotidienne, conformes aux briefs Phase 0 jour-par-jour de Jacky. Conséquence directe de la décision N1 du Bonus de l'audit. Cette section reflète désormais cette réalité.

**Le check quotidien en Phase 1**

3 sessions par jour. Bouton "Valider ma journée" qui ouvre IA-15 en variante Phase 1.

**Cas 1 — 1, 2 ou 3 sessions validées.** Journée validée. Seuil 1/3 (D6). Trois variantes de copy par pilier (24 messages au total à produire dans le Brief).

**Cas 2 — aucune session validée.** Bouton inactif. Même logique qu'en Phase 0.

Pas de soft-rappel en Phase 1. La mécanique 1/3 est déjà très permissive.

**Persistance et idempotence**

Variables suggérées : `dailyCheck.{date}.validated`, `dailyCheck.{date}.checkedItems`, `dailyCheck.{date}.streakValueAfter`. Format `date` : date locale ISO court.

L'utilisateur ne peut pas valider deux fois dans le même jour calendaire local. Bouton inactif si déjà validé, message contextuel (`copy.IA-15.deja-valide`).

**Pas de modification rétroactive (D27).** Une journée validée reste validée. Une journée non validée reste non validée.

**Comportement à minuit local**

Au passage de minuit, traitements de fin de jour précédent déclenchés à la prochaine ouverture. Pas d'exécution en arrière-plan.

Cas particulier — utilisateur valide à 23h59 et l'app reste ouverte au passage de minuit. L'app détecte le changement de jour et bascule l'accueil en mode J(n+1). Détection via listener sur le focus ou vérification au remontage de l'accueil.

**Cas particulier — modification du fuseau horaire**

Comportement V1 : l'app fait confiance au fuseau courant sans tentative de correction. À reverra en V1.5 si plaintes utilisateurs.

**Notes pour le dev**

IA-15 a deux variantes (Phase 0 et Phase 1) qui partagent la structure. Suggestion de mutualisation via composant unique paramétré.

Le calcul du nombre d'actions cochées ou de sessions validées se fait à partir du store de parcours (source unique de vérité).

L'historique `dailyCheck.{date}` est consultable pour le streak mais non affiché à l'utilisateur en V1.

### 2.5 — Streak et joker hebdomadaire

**Définition du streak**

Le streak est le nombre de jours consécutifs validés. Chaque journée validée incrémente le streak de 1. Une cassure ramène à 0. Affiché en permanence en haut de l'accueil, dans IA-15, et sur le profil.

Le streak ne distingue pas Phase 0 et Phase 1 — il est continu sur tout le parcours.

**Mécanique du joker hebdomadaire (D6)**

Le joker permet à un jour non validé de ne pas casser le streak, dans la limite d'un par **semaine calendaire fixe**.

**Définition de la semaine calendaire fixe.** Une semaine débute le **lundi 00:00 fuseau local** de l'utilisateur et se termine le **dimanche 23:59 fuseau local**. À chaque passage du dimanche soir au lundi matin, le joker est automatiquement réinitialisé à "disponible" pour la semaine qui débute.

Le joker est disponible si, dans la semaine calendaire fixe en cours, aucun joker n'a déjà été consommé. Consommé lorsqu'un jour non validé est traité par la fonction de cohérence à la prochaine ouverture après minuit. Si dispo, consommé et streak conservé. Si déjà consommé, streak cassé.

*Note de patch (7 mai 2026, audit V0 vs docs fondateurs).* La sémantique du joker est passée de **semaine glissante 7 jours** (qui était la formulation initiale de cette section) à **semaine calendaire fixe lundi-dimanche** suite à une décision Stéphane du 6 mai 2026 documentée dans Métriques V1 V0.2 § 5.5. La semaine calendaire fixe est plus simple à comprendre pour l'utilisateur ("j'ai un joker pour cette semaine, il se réinitialise lundi") et plus simple à coder (pas de calcul de fenêtre glissante au runtime).

**Calcul de la disponibilité du joker**

À chaque ouverture, fonction de cohérence calcule l'état du joker. Récupère l'historique des journées non validées de la **semaine calendaire en cours** (du dernier lundi 00:00 local jusqu'à maintenant), filtre celles traitées avec joker (`jokerUsed === true`), si non vide, joker consommé pour la semaine en cours.

Affichage discret sur l'accueil et dans IA-15 (`copy.IA-11.joker-disponible`, `copy.IA-11.joker-consomme`).

Quand consommé, message à l'utilisateur en couche superposée au prochain lancement (`copy.global.message-joker-consomme`).

**Cassure du streak — trois cas par jour**

**Cas A** — journée validée au-dessus du seuil. Streak +1, joker non consommé. En Phase 0, "au-dessus du seuil" signifie 5 actions ou plus sur 7 (D6 modifié 7 mai 2026). En Phase 1, "au-dessus du seuil" signifie au moins 1 session sur 3 du pilier en cours (cf. Schéma de données V1 § 5.2).

**Cas B** — journée validée sous le seuil (Phase 0 uniquement, après soft-rappel). Streak inchangé, joker consommé si dispo, sinon streak cassé. Journée enregistrée comme `validated = false, jokerUsed = true`. En Phase 0, "sous le seuil" signifie strictement moins de 5 actions sur 7. *Note V1.2 — Pas de cas B équivalent en Phase 1.* En Phase 1, soit l'utilisateur a fait au moins 1 session (Cas A), soit aucune (Cas C). Pas de validation intermédiaire "sous le seuil" en Phase 1.

**Cas C** — journée non validée du tout. Traitement à la prochaine ouverture après minuit. Si joker dispo, consommé, journée marquée `validated = false, jokerUsed = true`, streak conservé. Si déjà consommé, streak passe à 0.

Conséquence : une validation sous le seuil consomme le joker mais n'incrémente pas le streak.

*Note V1.2 du 13 mai 2026 — Joker en Phase 1.* Le joker hebdomadaire continue de s'appliquer en Phase 1 selon la même logique qu'en Phase 0 : 1 joker par semaine calendaire fixe (lundi 00:00 → dimanche 23:59 fuseau local), réinitialisation automatique à chaque passage dimanche soir → lundi matin, consommation à la prochaine ouverture après minuit si la journée précédente n'a pas été validée. **Décision actée en sortie de production de la Feature Spec S1** (zone résiduelle Z6 fermée). Conséquence sur les Feature Specs piliers : aucune Feature Spec pilier n'a besoin de redocumenter le joker — c'est une mécanique transverse Phase 0 et Phase 1 cadrée ici. La Feature Spec S1 et les suivantes (S2 à S8) renvoient à cette section pour la mécanique joker.

**Persistance**

Variables : `currentStreak`, `longestStreak` (calculé en interne mais non affiché en V1), historique `dailyCheck.{date}`. Plus `weekJokerConsumed.{weekKey}` où `weekKey` est l'identifiant de la semaine calendaire (par exemple `2026-W19` au format ISO 8601 semaine).

**Storage local-only V1 (D28).** Le store est local. Une désinstallation perd le streak. Choix volontaire : la désinstallation est un signal fort de désengagement.

**Affichage du streak**

Quatre variantes : streak en cours, joker activé cette semaine, streak cassé hier, premier jour. Copy précis dans le Brief contenu V1.

**Reprise après cassure**

Le streak redémarre à 0 et la première validation suivante le passe à 1. Le joker hebdomadaire repart sur sa logique de semaine calendaire normalement. Copy de reprise non-culpabilisant Mimi & Jacky (`copy.global.streak-reprise`).

**Notes pour le dev**

Fonction de calcul du joker pure et idempotente. Récupère l'identifiant de la semaine calendaire courante depuis l'historique `dailyCheck`.

Le passage de minuit local pendant que l'app est ouverte doit déclencher un re-calcul du jour courant et du streak. Le passage du dimanche soir au lundi matin doit également déclencher la réinitialisation automatique du joker pour la nouvelle semaine.

L'historique reste raisonnable sur les premières années. Pas d'archivage en V1.

*Note importante M2 + M3 (audit V0 vs docs fondateurs).* La mécanique de streak documentée ci-dessus contredit frontalement l'implémentation actuelle du V0 (`completedDays.length` sans notion calendaire ni joker). Le code V0 doit être refondu intégralement sur cette section comme chantier code Bloc 1 — Mécaniques M2 (calendaire) + M3 (streak/joker) en bloc, charge estimée 7 à 11 heures Claude Code.

### 2.6 — Paliers de récompense

Six paliers en V1, à 7, 15, 30, 60, 100 jours et 1 an (D10).

**Les six paliers**

Identifiants stables : `tier_7`, `tier_15`, `tier_30`, `tier_60`, `tier_100`, `tier_365`.

**Mécanique de déclenchement**

Le palier est franchi à la validation d'une journée qui amène le streak au seuil. Le franchissement déclenche : pose du flag `unlockedTier{N}At` (premier franchissement uniquement), incrément du compteur `tier{N}ReachedCount`, mise à jour de la galerie IA-51, mise en file d'attente de IA-50.

L'affichage de IA-50 se fait juste après la fermeture de IA-15, en cascade narrative voulue. Si l'utilisateur ferme l'app avant de voir IA-50, mise en attente via le flag `tier{N}DisplayedAt`.

**Coordination entre palier 15j et S0.1 (D30)**

Si l'utilisateur a validé tous ses jours et atteint 15j au moment de la transition `phase_0` → `s0_1`, IA-20 prime. La modale IA-50 du palier 15j est différée à la prochaine validation de jour, après que les écrans narratifs structurants (IA-20, IA-21) aient été joués.

Logique généralisable : narratif structurant prime, palier différé d'un cran.

**Comportement de la modale IA-50**

Couche superposée plein écran, masque la tab bar, lecture automatique de la vidéo de 30s, badge, message.

Bouton "Passer" visible mais discret en haut à droite.

Deux boutons en bas : "Voir mes paliers" (vers IA-51) et "Continuer" (ferme la modale).

Le flag `tier{N}DisplayedAt` est posé à l'ouverture, pas à la fermeture.

**Galerie des paliers (IA-51)**

Accessible depuis IA-50 ou IA-70. Affiche les 6 paliers avec deux états visuels.

État "atteint" — badge en couleur, date d'obtention, accès vidéo en re-lecture, message personnalisé.

État "non atteint" — badge grisé, seuil cible affiché, pas d'accès vidéo, message masqué ou teaser.

**Cas particulier — palier déjà franchi puis streak cassé puis reconstruit (D29)**

Si l'utilisateur reconstruit son streak et atteint à nouveau le seuil d'un palier déjà acquis, **redéclenchement allégé**. Pas de vidéo de 30s rejouée. Modale IA-50 simplifiée : badge en plus petit, message court de reconnaissance Mimi & Jacky (`copy.global.palier-reprise`), un seul bouton "Continuer".

`unlockedTier{N}At` reste le timestamp du premier franchissement. Le compteur `tier{N}ReachedCount` s'incrémente à chaque franchissement (tracé en interne mais non affiché en V1).

**Notes pour le dev**

Le calcul du palier franchi se fait à l'instant de la validation, dans la même fonction qui incrémente le streak. Un compteur `unlockedTiers` (set d'identifiants) suffit.

La file d'attente des modales IA-50 différées passe par le même système unifié que les autres écrans narratifs.

L'animation d'apparition de IA-50 doit être marquée — fade-in, agrandissement progressif du badge, déclenchement vidéo.

### 2.7 — Niveau adaptatif manuel

Mécanique qui permet à l'utilisateur d'ajuster l'intensité d'une session sans abandonner sa routine (D4). Version manuelle uniquement en V1.

**Périmètre d'application**

Phase 0 — uniquement sur les piliers à intensité progressive (typiquement froid et fenêtre digestive). Le bouton n'est affiché que sur les piliers concernés. Liste précise dans la fiche IA-13 à produire ultérieurement.

Phase 1 — sur toutes les sessions de tous les piliers. Chaque session a une consigne par défaut au niveau d'entrée déterminé par l'évaluation initiale.

**Niveau d'entrée vs niveau adaptatif**

**Niveau d'entrée** — posé une fois en début de pilier de Phase 1. Trois valeurs : Essentiel, Progression, Immersion. Modifiable manuellement depuis IA-41 ou IA-42.

**Niveau adaptatif** — ponctuel, à l'échelle de la session. Trois valeurs : Moins, Pareil, Plus. Module la consigne par défaut pour cette occurrence uniquement. Ne se persiste pas comme niveau d'entrée.

**Modale IA-44 — déclenchement et contenu**

Accessible depuis IA-13 (Phase 0) ou IA-43 (Phase 1) via un bouton dédié. Tap → ouvre IA-44, modale légère avec trois options en boutons clairs : Moins, Pareil, Plus. Sous-titre par option avec l'effet sur la consigne courante.

À la sélection : consigne mise à jour, message court Mimi & Jacky validant le choix sans le juger (`copy.IA-44.feedback-moins`, `copy.IA-44.feedback-plus`).

Modale fermée automatiquement après le feedback (1-2s) ou via bouton "OK".

**Persistance et historique**

`session.{sessionId}.adaptiveChoice = 'less' | 'same' | 'more'` pour la session courante.

L'historique des choix est conservé pour analyse de patterns (V2). En V1, non affiché à l'utilisateur.

**Cas particulier — modification multiple en cours de session**

Pas de limite. Chaque tap rouvre IA-44 avec le choix courant pré-sélectionné.

**Pas de changement automatique en V1, messages de suggestion autorisés (D31 enrichi 7 mai 2026)**

L'app ne **change jamais automatiquement** le niveau d'entrée du pilier, même après N choix "Moins" consécutifs. Le changement effectif du niveau d'entrée passe **toujours par une action explicite** de l'utilisateur via IA-44 (qui ne change que le niveau adaptatif de la session, pas le niveau d'entrée du pilier) ou via une modification manuelle du niveau d'entrée dans IA-41 ou IA-42.

L'app peut en revanche afficher des **messages contextuels qui suggèrent** à l'utilisateur de reconsidérer son niveau d'entrée. Par exemple : message après 4 choix "Moins" successifs ("Tu as ajusté à la baisse plusieurs fois — tu peux aussi modifier ton niveau d'entrée pour la semaine si tu veux"), message après plusieurs signaux d'inconfort, message après une cassure de streak suivie d'une reprise. Ces messages de suggestion sont compatibles avec D31 enrichi : ils invitent, ils ne décident pas. La calibration précise des seuils de déclenchement et des copies est à produire dans le Brief contenu V1.

*Précision sur les déclencheurs disponibles en V1.* Le déclencheur principal qu'on aurait pu imaginer — un score quotidien par pilier qui descend sous un seuil sur plusieurs jours — n'existe pas en V1 (D34 — pas de score quotidien V1). Les déclencheurs disponibles en V1 sont donc plus simples : compteur de choix "Moins" successifs sur le bouton niveau adaptatif, signaux de cassure de streak, signaux explicites de l'utilisateur (à voir s'ils sont collectés ou non). À calibrer en Feature Spec dédiée.

**Cas particulier — pilier Phase 0 non concerné**

Bouton non affiché. Pas de message d'erreur.

**Notes pour le dev**

Modale IA-44 = composant unique paramétré par contexte. Contenu textuel chargé depuis le Brief contenu V1.

Le mapping consigne par défaut → consigne ajustée est une donnée de contenu. Pour chaque session de chaque pilier, trois variantes pré-produites.

Le calcul de l'impact du niveau adaptatif sur le score local de présence est entièrement traité dans Métriques V1.

### 2.8 — Conventions modales / pleines pages / couches superposées

**Empilement et préservation de l'écran sous-jacent**

Une modale ou couche superposée ne remplace pas l'écran sous-jacent — elle s'affiche par-dessus. L'écran sous-jacent est préservé en l'état (scroll, données, focus). À la fermeture, l'utilisateur retrouve l'écran identique.

L'écran sous-jacent ne doit pas être démonté quand une modale s'ouvre, ni continuer à recevoir des inputs pendant qu'une modale est ouverte.

L'accueil ne doit pas se rafraîchir à la fermeture d'une modale. Si une modale a déclenché un changement d'état (validation de jour qui incrémente le streak), l'accueil se met à jour de façon transparente.

**Empilement multiple — non**

Une seule modale ou couche superposée affichée à la fois.

**Cas A** — suite logique (cascade voulue, par exemple IA-15 → IA-50). Ferme la première, ouvre la seconde.

**Cas B** — interruption hypothétique. Pas d'affichage, mise en file d'attente, affichage à la fermeture de la première.

**Fermeture des modales — trois mécanismes**

Bouton explicite — toujours disponible.

Tap en dehors — autorisée par défaut, sauf modales qui exigent une décision explicite (IA-30, IA-50).

Retour Android — toujours disponible sur modales. Sur couches narratives, désactivée pendant la vidéo, activée après.

**Couches superposées narratives — règles spécifiques**

Règle 1 — masquage complet de la tab bar.

Règle 2 — fermeture par bouton "Continuer" uniquement, après lecture du contenu principal. Pas de fermeture par tap en dehors. Le bouton "Continuer" peut être tapé pendant la vidéo pour accélérer.

Règle 3 — bouton retour Android désactivé pendant la lecture vidéo.

**Modales transactionnelles — règles spécifiques**

Règle 1 — toujours fermable sans transaction.

Règle 2 — transaction déclenchée à la confirmation explicite uniquement.

Règle 3 — feedback visible après transaction avant fermeture.

**Ordre des animations**

À l'ouverture : fond ou couche en premier (fade-in 200-300ms), puis contenu (slide-up, fade-in, 300-500ms). Pas d'animation simultanée.

À la fermeture : ordre inverse, légère superposition possible.

Valeurs précises arbitrées en Charte graphique et en dev.

**Cas particulier — IA-30 modale d'abonnement**

Tab bar visible mais inactive. Seule exception V1. Cohérent avec D3.

**Notes pour le dev**

Implémentation suggérée : React Navigation avec `presentation: 'modal'` ou `'transparentModal'` pour modales, `'fullScreenModal'` avec `headerShown: false` pour couches narratives.

La file d'attente des modales et couches narratives doit passer par un système unifié — un store ou service qui gère la file et déclenche les ouvertures dans l'ordre.

### 2.9 — Notifications

D12 (calibrage produit des notifications) est reportée. Cette sous-section pose le **cadre technique** sans figer le copy ni la fréquence.

**Demande de permission**

Pas au lancement de l'app. À la fin de l'onboarding, après IA-09 et avant ou immédiatement après IA-10.

Copy à produire dans le Brief contenu V1 (`copy.global.permission-notifications`). Tonalité non-commerciale, focus bénéfice utilisateur.

Si refus, l'app continue normalement sans notifications. Pas de re-demande forcée. Activation possible plus tard depuis IA-71.

**Cinq familles de notifications candidates V1**

Calibrage final tranché en D12.

Famille 1 — rappel quotidien de check (heure fixe à calibrer).

Famille 2 — rappel de session en Phase 1 (matin, midi, soir, fréquence à calibrer).

Famille 3 — célébration de palier de récompense.

Famille 4 — alerte de joker bientôt consommé (fin de journée locale).

Famille 5 — rappel de retour après absence (cas sensible).

Toutes désactivables individuellement.

**Quatre contraintes techniques V1**

Contrainte 1 — **planification locale, pas de serveur push en V1**. Cohérent avec local-only acté en 2.5. Limite : changement de téléphone ou réinstallation perd les notifications planifiées.

Contrainte 2 — **plage de silence entre 22h et 8h locales (D32)**. Aucune notification dans cette plage. Si déclencheur dans cette plage, soit avancé soit annulé selon le type. Décision par famille en D12.

Contrainte 3 — **désactivation granulaire par famille**. Pas de switch global "toutes les notifications" dans l'app — sauf via paramètres système iOS/Android.

Contrainte 4 — **idempotence des notifications planifiées**. Pas de doublons si la fonction est appelée plusieurs fois. Suggestion : fonction unique qui efface tout et replanifie à partir de l'état courant.

**Notes pour le dev**

`expo-notifications` est la bibliothèque candidate par défaut. Limite iOS : ~64 notifications planifiées max, suffisant pour la V1.

Le timing exact n'est pas figé. Calibré en D12.

La langue suit la convention multilingue (1.6).

### 2.10 — Migration des données local → distant à la création de compte

*Section ajoutée le 7 mai 2026 suite à la décision A3 du Bloc 1 de l'audit V0 vs docs fondateurs.*

L'onboarding (10 slides IA-01 à IA-09) est accessible **en mode anonyme** : aucun compte n'est requis pour faire le questionnaire 4 dimensions, voir son profil dynamique, prendre l'engagement explicite (cf. IA-10 dans IA V1 V3). Les 4 réponses du questionnaire et l'état d'avancement de l'onboarding sont stockés localement (AsyncStorage) jusqu'à la création de compte. La création de compte intervient uniquement à IA-10 (slide 10), au moment du lancement vers le J1.

**Mécanique de migration**

Au moment où la création de compte aboutit (callback `onAuthStateChange` qui passe de `null` à `user`), une fonction de migration s'exécute automatiquement.

**Étape 1 — Lecture locale.** Lire les 4 clés AsyncStorage du mode anonyme : `onboarding_done` (booléen), `onboarding_data` (Record sérialisé des 4 réponses), `completed_days` (tableau des numéros de jours validés, généralement vide à la création de compte), `minimum_days` (tableau des numéros de jours validés en mode minimum, généralement vide).

**Étape 2 — Écriture distante.** Écrire ces données dans les tables Supabase du nouvel utilisateur. `profiles` reçoit `onboarding_done = true` et `onboarding_data = {...}`. `progress` reçoit une ligne par jour validé `(user_id, day_id, is_minimum)`.

**Étape 3 — Effacement local.** Une fois l'écriture distante confirmée (réponse Supabase OK), effacer les 4 clés AsyncStorage du mode anonyme.

**Étape 4 — Bascule de l'app en mode connecté.** L'app passe en mode connecté avec les données désormais persistées sur Supabase. Le `ProgressContext` continue de fonctionner normalement.

**Cas d'erreur — Échec de l'écriture distante**

Si l'écriture Supabase échoue (réseau, timeout, erreur serveur), la fonction de migration ne supprime pas les clés locales. L'app reste en mode anonyme avec compte créé en attente. Au prochain lancement, la migration est ré-tentée. Pas de perte de données.

**Cas d'erreur — Utilisateur déjà existant qui se reconnecte**

Si l'utilisateur revient avec un compte existant (re-login), la fonction de migration ne s'exécute pas. Le `ProgressContext` charge directement les données distantes Supabase, comme aujourd'hui. Pas de fusion entre données locales et distantes en V1.

**Notes pour le dev**

La fonction de migration est idempotente : si elle est appelée plusieurs fois (par exemple à cause d'un retry), les données ne sont pas dupliquées. Utiliser `upsert` avec `onConflict: 'user_id,day_id'` pour `progress` (déjà en place dans le V0) et `onConflict: 'id'` pour `profiles`.

Le comportement actuel du V0 (auth avant onboarding) est inversé. La refonte du flow d'entrée est planifiée comme chantier code Bloc 1 — Mécanique M7. Charge code estimée 4 à 6 heures Claude Code, dont 1 à 2 heures pour la fonction de migration elle-même.

### 2.11 — Posture du reset utilisateur en V1

*Section ajoutée le 7 mai 2026 suite à la décision A2 du Bloc 1 de l'audit V0 vs docs fondateurs.*

**En build production V1, aucun reset utilisateur n'est exposé.** Un utilisateur lambda ne peut pas remettre son parcours à zéro par accident ou par exploration de l'interface. C'est délibéré.

Si un utilisateur souhaite recommencer à zéro (cas d'usage légitime mais rare), il doit utiliser une action **"supprimer mon compte"** explicite, à exposer dans IA-70 (Profil) avec confirmation et délai de grâce conforme RGPD. Cette action n'est pas un reset au sens technique (effacer les données mais garder le compte) — elle supprime intégralement le compte et toutes ses données.

**Posture en mode développement**

Pour permettre à Stéphane et Claude Code de tester l'app rapidement sans devoir refaire le parcours à chaque test, les **raccourcis de reset hérités du V0** sont conservés mais conditionnés au flag `__DEV__` d'Expo.

**Détail technique du flag `__DEV__`.** La variable globale `__DEV__` est mise à `true` automatiquement par Expo en mode développement (lancement via `npx expo start` ou via Expo Go), et à `false` en build production téléchargé via App Store / Play Store. Aucune action manuelle n'est nécessaire pour faire la bascule — c'est le système de build d'Expo qui s'en charge.

**Raccourcis V0 à conserver derrière `__DEV__`.** Appui long de 1.5 seconde sur l'emoji ⚡ du HomeScreen (déclenche `Alert` de confirmation puis `resetAll()` du ProgressContext). Appui long de 1.5 seconde sur l'emoji 🏆 du ConversionScreen (idem). Le code des deux raccourcis est conservé tel quel mais entouré de `if (__DEV__) { ... }`.

**Conséquence en build production.** En build production, les emojis ⚡ et 🏆 restent affichés (parce qu'ils ont une fonction décorative et signalétique dans l'UI) mais leurs handlers d'appui long ne font plus rien — ils sont inertes.

**Notes pour le dev**

L'évolution future possible (si Stéphane fait un jour des démos depuis un téléphone qui tourne en build production) serait d'ajouter une zone "Mode développeur" planquée derrière une combinaison cachée (par exemple 5 taps rapides sur le numéro de version dans Settings/Profil), qui débloque le reset. Pas urgent en V1 — Stéphane teste en mode développement, donc le flag `__DEV__` suffit.

---

## 3. Fiches d'écran S0

*Cette section contient les fiches détaillées des deux écrans qui composent le S0. Le format suit la grille définie en Section 1.*

### IA-20 — Célébration et révélation de la toile (S0.1)

**Référence IA :** IA-20 — voir Information Architecture V1 §S0.1.

**Type d'écran :** couche superposée narrative. Plein écran, masque la tab bar, déclenchée automatiquement au premier lancement du jour J15 calendaire.

**Données affichées et leur source.**

Compteur de jours validés en Phase 0 — calcul sur `dailyCheck.{date}` des 14 derniers jours.

Streak en cours — `currentStreak`. Affiché si > 0, masqué sinon.

Vidéo de célébration Mimi & Jacky — `media.IA-20.video-celebration-14j`. Durée cible 60-90s.

Toile d'araignée à l'état initial — composant graphique généré dynamiquement. 8 branches partant du centre, valeur 0 partout. Apparaît animée après la vidéo.

Message Mimi & Jacky de transition — `copy.IA-20.message-transition`, à produire dans le Brief contenu V1.

Bouton "Continuer" — apparaît à la fin de la vidéo.

**Interactions utilisateur.**

Tap sur la zone vidéo → pause / relance.

Tap sur "Passer" (haut à droite, discret) → arrête la vidéo, affiche directement la toile, le message et le bouton "Continuer".

Tap sur "Continuer" → ferme la couche, ramène à l'accueil S0.1. La transition `phase_0` → `s0_1` est déjà appliquée.

Tap sur retour Android pendant vidéo → désactivé. Après vidéo → équivalent "Continuer".

Aucun tap interactif sur la toile — elle est visuelle, non-interactive à ce stade.

**États visuels.**

État 1 — pendant lecture vidéo. Vidéo en avant-plan, bouton "Passer" en haut à droite, pas de toile, pas de bouton "Continuer".

État 2 — après vidéo. Vidéo réduite ou disparue, toile animée au centre, message Mimi & Jacky en dessous, bouton "Continuer" en bas.

État 3 — pause vidéo. Contrôles de lecture visibles.

**Animations et transitions.**

Ouverture : fade-in de la couche (200-300ms), lecture vidéo automatique.

Apparition de la toile (état 2) : animation marquée. 8 branches qui se déploient depuis le centre vers leurs positions finales en 1.5-2s. Easing qui suggère "construction". C'est le moment narratif central de l'écran.

Apparition du message : fade-in 500ms après animation de la toile.

Apparition du bouton "Continuer" : fade-in 300ms après le message.

Fermeture (tap "Continuer") : fade-out de la couche en 300ms.

**Edge cases.**

Cas — score de présence Phase 0 contrasté. Le copy doit pouvoir s'adapter au score. La Feature Spec prévoit un slot unique `copy.IA-20.message-celebration` avec possibilité de variantes selon un score numérique. Le nombre de variantes, leurs seuils et leurs contenus relèvent du Brief contenu V1, qui décidera avec Mimi & Jacky.

Cas — utilisateur arrive en S0.1 après absence prolongée. Comportement V1 (D25) : la couche se déclenche au prochain lancement. Si message d'accueil de retour d'absence dû, il passe avant IA-20 en file d'attente.

Cas — utilisateur ferme l'app pendant la vidéo. Le flag `seenS0_1ScreenAt` est posé au déclenchement. IA-20 ne se rejoue pas. Reste accessible volontairement depuis le profil ou IA-25.

Cas — palier 15j atteint en même temps que S0.1. IA-20 prime, IA-50 du palier différé à la prochaine validation (D30).

Cas — connexion réseau interrompue. Écran d'erreur léger, passage automatique à l'état 2 au bout de 5s. Flag posé. Vidéo accessible plus tard via la galerie.

**Copy et médias.**

Copy : `copy.IA-20.message-transition`, `copy.IA-20.message-celebration` (avec variantes potentielles à définir en Brief), `copy.IA-20.bouton-continuer`. Tous dans le Brief contenu V1.

Média : `media.IA-20.video-celebration-14j` (60-90s). Structure-type suggérée : 0-15s accueil et reconnaissance du parcours fait, 15-45s annonce de la suite, 45-60s introduction de la toile comme outil de carte. À valider avec Mimi & Jacky.

**Notes pour le dev.**

L'animation de déploiement de la toile est le moment visuel le plus important de l'app à ce stade. Suggestion : SVG animé ou Reanimated pour gérer le déploiement des 8 branches avec un easing perceptible. Pas de Lottie pré-rendu.

Le composant de toile doit être réutilisable. Affiché au moins trois fois : ici en IA-20 état initial, dans IA-25, et potentiellement dans des écrans de récap.

La file d'attente des écrans narratifs doit ordonner correctement : message d'accueil retour absence en couche → IA-20 → suite normale.

### IA-21 — Roadmap et démarrage de l'évaluation S1 (S0.2)

**Référence IA :** IA-21 — voir Information Architecture V1 §S0.2.

**Type d'écran :** couche superposée narrative. Plein écran, masque la tab bar, déclenchée automatiquement au premier lancement du jour J16 calendaire.

**Données affichées et leur source.**

Vidéo Mimi & Jacky d'introduction à la Phase 1 — `media.IA-21.video-introduction-phase-1`. Durée cible 60-90s.

Roadmap visuelle des 8 piliers de Phase 1 — composant graphique statique en V1, listant les 8 piliers dans leur ordre fixe. Format visuel à arbitrer en Charte graphique.

État de progression sur la roadmap — aucune progression à ce stade. S1 mis en avant comme "le pilier qui démarre", les 7 autres visibles mais en retrait. Pas de notion de "verrouillé".

Message Mimi & Jacky de transition vers S1 — `copy.IA-21.message-introduction-s1`, à produire dans le Brief contenu V1.

Bouton "Démarrer l'évaluation Respiration" — apparaît à la fin de la vidéo et de la roadmap. Mène à IA-40.

**Interactions utilisateur.**

Tap sur la zone vidéo → pause / relance.

Tap sur "Passer" → affiche directement la roadmap, le message et le bouton.

Tap sur "Démarrer l'évaluation Respiration" → ferme la couche, lance la séquence évaluation initiale du pilier 1 (IA-40 puis IA-41). Pose `seenS0_2ScreenAt`. Pas de retour possible vers IA-21 après ce tap.

Aucune interaction sur les piliers de la roadmap. La roadmap est un visuel-promesse, pas un menu. Le focus est sur le bouton de démarrage.

Tap sur retour Android pendant vidéo → désactivé. Après vidéo → ferme la couche, ramène à l'accueil S0.2 (qui propose un encart "Reprendre l'évaluation Respiration").

**États visuels.**

État 1 — pendant lecture vidéo. Vidéo en avant-plan, bouton "Passer" en haut à droite.

État 2 — après vidéo. Vidéo réduite ou disparue, roadmap, message, bouton de démarrage.

État 3 — pause vidéo. Identique à IA-20.

**Animations et transitions.**

Ouverture : fade-in 200-300ms, lecture vidéo automatique.

Apparition de la roadmap : animation marquée mais plus légère que la toile en IA-20. Les 8 piliers apparaissent en cascade gauche-vers-droite ou de haut en bas, fade-in décalé de 100-150ms par pilier, total 1-1.5s. S1 mis en valeur visuellement à la fin.

Apparition du message : fade-in 500ms après roadmap.

Apparition du bouton de démarrage : fade-in 300ms après le message.

Fermeture par tap sur le bouton : fade-out rapide (200ms), enchaînement direct vers IA-40.

Fermeture par retour Android : fade-out plus long (400ms), retour vers l'accueil S0.2.

**Edge cases.**

Cas — utilisateur ferme l'app pendant la vidéo ou avant tap. Flag `seenS0_2ScreenAt` posé au déclenchement. IA-21 ne se rejoue pas. L'accueil S0.2 doit proposer un encart explicite "Démarrer l'évaluation Respiration" (`copy.IA-11.encart-demarrage-eval-s1`). Tant que pas de tap, app reste en `s0_2`.

Cas — utilisateur reste plusieurs jours en S0.2 sans démarrer. App reste en `s0_2`, encart à chaque ouverture. Pas de pression. L'utilisateur démarre quand prêt.

Cas — utilisateur démarre l'évaluation, abandonne en cours (ferme l'app pendant IA-40). À la prochaine ouverture, reprise au début (pas de reprise au milieu).

Cas — réseau interrompu. Mêmes comportements qu'IA-20.

Cas — utilisateur revient longtemps après en S0.2. IA-21 se déclenche au lancement courant (un par session selon D25).

**Copy et médias.**

Copy : `copy.IA-21.message-introduction-s1`, `copy.IA-21.bouton-demarrer-eval`, `copy.IA-21.label-roadmap`. Tous dans le Brief contenu V1.

Média : `media.IA-21.video-introduction-phase-1` (60-90s). Structure-type suggérée : 0-15s reconnaissance du passage de la Phase 0, 15-45s explication de la méthodologie Phase 1, 45-60s introduction du premier pilier et de l'évaluation. À valider avec Mimi & Jacky.

**Notes pour le dev.**

La roadmap est statique en V1 mais devra évoluer en composant dynamique en V2. Penser dès maintenant à un composant paramétré par un état de progression.

L'ordre des 8 piliers est codé en dur comme constante. Pas configurable utilisateur en V1.

L'enchaînement IA-21 → IA-40 doit être fluide — pas d'écran d'attente, pas de message intermédiaire.

---

## 4. Formats-types vidéos narratives — fiches-modèles IA-20, IA-21, IA-41

*Cette section pose le patron de la fiche d'écran IA-41 qui sera dupliqué pour chacun des 8 piliers de la V1. Elle distingue les invariants des variables. Elle ne contient pas le contenu d'un pilier en particulier — ce contenu sera produit dans le Brief contenu V1 et dans les Feature Specs dédiées par pilier.*

### 4.1 — Patron de fiche IA-41

**Référence IA :** IA-41 — voir Information Architecture V1 §Phase 1 Intro de pilier.

**Type d'écran :** pleine page accessible juste après IA-40 (récapitulatif d'évaluation initiale), tab bar grisée.

**Position dans le parcours.**

IA-41 apparaît une fois par pilier de Phase 1, soit 8 occurrences dans le parcours complet. Séquence : IA-40 (12 questions d'évaluation initiale du pilier) → IA-41 (récap initial + introduction du pilier + démarrage). À la sortie d'IA-41 par "Démarrer cette semaine", l'app passe en `phase_1` avec `currentPilar = N` et `pilarStartedAt = now`.

**Données affichées et leur source.**

Score initial du pilier — calcul issu des 12 réponses à IA-40. Algorithme dans Métriques V1. Affiché visuellement comme une valeur sur la branche correspondante de la toile, plus un libellé qualitatif court.

Niveau d'entrée recommandé — déduit du score initial. Trois valeurs : Essentiel, Progression, Immersion. Mapping dans Métriques V1. Appliqué par défaut, modifiable manuellement par l'utilisateur.

Branche du pilier sur la toile — composant graphique partagé. Cette occurrence montre uniquement la branche du pilier en cours, mise à jour avec le score initial. Les autres branches visibles en arrière-plan dans leur état courant.

Vidéo d'intro de pilier — `media.IA-41.video-intro-pilar-{N}`. Durée cible 60-90s. Voir 4.2 pour la structure-type.

Message Mimi & Jacky d'introduction au pilier — `copy.IA-41.message-intro-pilar-{N}` à produire dans le Brief contenu V1.

Bouton "Démarrer cette semaine" — apparaît à la fin de la vidéo et de la lecture du message. Mène à l'accueil du pilier en mode J1.

Bouton "Modifier mon niveau" (secondaire) — accessible en option, ouvre une modale de choix entre Essentiel / Progression / Immersion.

**Interactions utilisateur.**

Tap sur la zone vidéo → pause / relance.

Tap sur "Passer" → affiche directement l'ensemble (toile + score + niveau + message + boutons).

Tap sur "Démarrer cette semaine" → ferme IA-41, passe en `phase_1` avec `currentPilar = N` et `pilarStartedAt = now()`, navigue vers l'accueil du pilier en mode J1. Mécanisme transactionnel important : c'est ce tap qui pose `pilarStartedAt`, donc le J1 démarre à ce moment-là, pas à l'ouverture d'IA-40.

Tap sur "Modifier mon niveau" → ouvre modale de choix de niveau. Choix utilisateur écrase le niveau recommandé. Niveau effectif appliqué = niveau choisi.

Tap sur la branche du pilier sur la toile (en arrière-plan) → inactif en V1.

Tap sur retour Android → ramène à IA-40 en gardant les réponses. Permet de revoir avant engagement.

**États visuels.**

État 1 — pendant lecture vidéo. Vidéo en avant-plan, autres éléments masqués ou en bas.

État 2 — après vidéo. Tous les éléments visibles : toile en arrière-plan, score, niveau recommandé, message, boutons.

État 3 — niveau modifié manuellement. Affichage qui reflète le niveau choisi ("Niveau Progression — choisi" plutôt que "Niveau Essentiel — recommandé").

**Animations et transitions.**

Ouverture (depuis IA-40) : transition fluide, slide horizontal ou fade-in (Charte graphique).

Apparition de la valorisation de la branche : animation marquée. La branche se "remplit" du centre vers l'extérieur jusqu'à la valeur du score initial. Durée 1-1.5s, easing visible. Second moment fort de la révélation toile (le premier était IA-20). À chaque pilier, l'utilisateur voit une nouvelle branche prendre forme.

Apparition du score, niveau, message : fade-in cascadé après animation de la branche.

Apparition des boutons : fade-in final.

Fermeture par "Démarrer cette semaine" : transition vers l'accueil du pilier, fluide.

**Edge cases.**

Cas — utilisateur ferme l'app pendant IA-41 sans taper "Démarrer cette semaine". Évaluation initiale persistée (12 réponses enregistrées en sortie d'IA-40), mais `pilarStartedAt` non posé. À la prochaine ouverture, IA-41 re-déclenchée ou encart de reprise depuis l'accueil. Score initial déjà calculé, branche déjà valorisée. Le tap sur "Démarrer cette semaine" pose `pilarStartedAt = now()` à ce moment-là.

Cas — modifications multiples du niveau avant de démarrer. Le niveau effectif est celui sélectionné au moment du tap "Démarrer". Pas d'historique, pas de blocage.

Cas — collision avec un palier de récompense. Très peu probable mais possible. Le palier est différé selon D30.

Cas — utilisateur en `phase_1` revient en IA-41 d'un pilier déjà démarré. Pas de re-démarrage. Affiche les données du pilier en cours. Bouton "Continuer ma semaine" plutôt que "Démarrer cette semaine". `pilarStartedAt` non re-posé.

Cas — réseau interrompu au chargement vidéo. Même comportement qu'IA-20 et IA-21.

**Copy et médias.**

Copy invariants (mêmes pour les 8 piliers) : `copy.IA-41.bouton-demarrer-semaine`, `copy.IA-41.bouton-modifier-niveau`, `copy.IA-41.label-niveau-recommande`, `copy.IA-41.label-niveau-choisi`, `copy.IA-41.modale-niveau-titre`, `copy.IA-41.modale-niveau-essentiel`, `copy.IA-41.modale-niveau-progression`, `copy.IA-41.modale-niveau-immersion`. Brief contenu V1.

Copy variables (différents par pilier) : `copy.IA-41.message-intro-pilar-1` à `copy.IA-41.message-intro-pilar-8`. 8 messages à produire dans le Brief contenu V1.

Médias variables : `media.IA-41.video-intro-pilar-1` à `media.IA-41.video-intro-pilar-8`. 8 vidéos 60-90s à produire avec Mimi & Jacky. Voir 4.2.

**Notes pour le dev.**

Composant unique paramétré par numéro de pilier : `PilarIntroScreen` qui prend `pilarId` en prop et charge dynamiquement copy, vidéo, score initial. Pas 8 composants distincts.

Le calcul du score initial à partir des 12 réponses est dans Métriques V1.

Le mapping score initial → niveau d'entrée recommandé est dans Métriques V1. Trois seuils par pilier.

L'animation de valorisation de la branche doit être cohérente entre IA-41 et IA-47 (mise à jour à l'évaluation finale). Même composant, même easing, même intention narrative.

### 4.2 — Spec vidéo d'intro de pilier

Cette sous-section pose la structure-type des 8 vidéos d'intro de pilier. La rédaction des scripts précis est du ressort de Mimi & Jacky dans le Brief contenu Session 3.

**Durée cible.** 75 à 80 secondes par vidéo, plage acceptable 60-90 secondes. Cohérent avec les autres vidéos narratives V1. Le format court est volontaire : on prépare l'utilisateur à la semaine, on ne fait pas un cours magistral.

**Fonction narrative.** Trois fonctions intriquées.

Premièrement, **poser le pilier** — pourquoi c'est ce pilier-là, qu'est-ce qu'il représente dans l'approche Raw Adventure.

Deuxièmement, **annoncer la semaine** — qu'est-ce que l'utilisateur va expérimenter, quelle est la promesse de ressenti à la fin.

Troisièmement, **adresser une invitation** — la posture Mimi & Jacky face au pilier, ce qu'ils proposent à l'utilisateur de tenter. Pas de cours, pas de théorie. Une orientation.

**Structure-type 5 segments.** Cinq segments pour 75-80s total. Cette structure est commune aux 8 vidéos d'intro de pilier. Les angles propres à chaque pilier sont posés dans le Brief contenu Session 3.

Segment 1 — accueil et reconnaissance (0-10s). Mimi ou Jacky s'adresse à l'utilisateur, accuse réception du fait qu'une nouvelle semaine commence. Optionnellement, fait référence au score initial sans le commenter trop. À éviter : "Bienvenue sur la semaine X", "félicitations d'avoir tenu jusque-là", toute formule qui sonne automatique ou qui transforme l'arrivée en performance.

Segment 2 — pose du pilier (10-30s). Pourquoi ce pilier, qu'est-ce qu'il représente. Niveau de profondeur : haut, pas un cours mais une orientation. Vocabulaire incarné. C'est le segment qui distingue chaque vidéo des 7 autres. À éviter : cours magistral, vocabulaire scientifique non justifié, comparaisons avec d'autres approches de santé, généralités sur l'importance du pilier.

Segment 3 — annonce de la semaine (30-50s). Qu'est-ce qu'on va faire ensemble cette semaine, à quel rythme, quel ressenti attendre. Mention rapide des trois niveaux d'entrée (Essentiel, Progression, Immersion) — la vidéo confirme que les sessions sont calibrées pour l'utilisateur personnellement. C'est aussi le segment qui pose la promesse de ressenti propre au pilier. À éviter : vocabulaire de challenge ou de défi, promesses chiffrées de résultat, mentions de comparaison entre niveaux d'entrée.

Segment 4 — adresse personnelle (50-70s). Mimi & Jacky parlent à l'utilisateur en tant que personne. Posture : on est avec toi sur ce pilier, on l'a expérimenté nous-mêmes. À éviter : argumentaire vendeur, "nous t'invitons à découvrir", toute formulation qui ressemble à une promesse marketing.

Segment 5 — appel au démarrage (70-80s). Invitation à entrer dans la semaine. Pas une injonction, une ouverture. La vidéo se termine et l'utilisateur enchaîne sur les 12 questions d'évaluation initiale qui calibreront son niveau d'entrée du pilier (sauf pour S1 où l'évaluation a déjà été lancée par S0.2). À éviter : "Prêt ?", "C'est parti pour 7 jours intenses", toute formule qui sur-dramatise le démarrage.

**Format de production suggéré.** Vidéo statique cadrée sur Mimi et/ou Jacky, plan moyen ou rapproché, fond sobre cohérent avec la Charte graphique. Pas d'effet visuel complexe, pas de B-roll. La parole et la présence sont les outils principaux.

**Variantes par niveau d'entrée — aucune en V1 (D33).** Une seule vidéo par pilier. La vidéo s'adresse au niveau Progression par défaut. Le segment 3 mentionne les trois niveaux brièvement.

**Variantes par profil dynamique — aucune en V1.** Le profil dynamique influence le ton dans certains messages texte (Audit copy V1), pas les vidéos.

**Notes pour la production.** Les 8 vidéos d'intro sont parmi les contenus les plus structurants de la V1. Tournage groupé recommandé en une seule journée pour garantir la cohérence visuelle absolue de la série. Voir Brief contenu Session 3 pour le détail des arbitrages de tournage et les angles pédagogiques pilier par pilier.

### 4.3 — Spec vidéos S0.1 et S0.2

Cette sous-section pose la structure-type des 2 vidéos narratives S0 qui jouent dans IA-20 et IA-21. Elles partagent la même structure 5 segments que les vidéos d'intro de pilier (4.2), mais adaptée à leur fonction narrative spécifique de transition entre Phase 0 et Phase 1. La rédaction des scripts précis est du ressort de Mimi & Jacky dans le Brief contenu Session 2.

**Durée cible.** 75 à 80 secondes par vidéo, plage acceptable 60-90 secondes. Cohérent avec les vidéos d'intro de pilier.

**Fonction narrative S0.1 — célébration et révélation.** Trois fonctions intriquées. Premièrement, accuser réception du parcours fait pendant les 14 jours de Phase 0. Deuxièmement, nommer ce qui s'est passé en termes de lecture du corps, sans surinterpréter. Troisièmement, introduire la toile d'araignée comme outil de carte personnelle (pas comme score, pas comme diagnostic). À la fin de la vidéo, la toile s'affiche à l'écran — l'animation de déploiement est le moment visuel le plus important de l'app à ce stade, la vidéo doit la préparer sans la voler.

**Structure-type 5 segments S0.1.** 75-80s total.

Segment 1 — accueil et reconnaissance (0-10s). Accuser réception des 14 jours, sans félicitation creuse. Ton : "voilà, tu y es", pas "bravo".

Segment 2 — nommer ce qui s'est passé (10-30s). Décrire qualitativement la lecture du corps qui s'est faite, sans surinterpréter. Validation de la profondeur du travail sans en rajouter.

Segment 3 — annoncer la révélation de la toile (30-55s). Faire le lien entre les 14 jours et l'outil qui matérialise. Toile = représentation, pas score.

Segment 4 — adresse personnelle Mimi & Jacky (55-70s). Posture : voilà ce qu'on voit dans cette toile, voilà ce qu'on te propose ensuite. Sans nommer encore Phase 1 ou les 8 semaines explicitement.

Segment 5 — ouverture et préfiguration du lendemain (70-80s). Court, presque suspendu. Invite à regarder la toile qui va s'afficher. Préfigure explicitement que le lendemain on continue.

**Fonction narrative S0.2 — roadmap et lancement.** Trois fonctions intriquées. Premièrement, assumer la bascule de mode entre Phase 0 libre et Phase 1 dirigée. Deuxièmement, poser la roadmap des 8 piliers dans leur ordre fixe, listés à l'oral en appui de la roadmap visuelle. Troisièmement, lancer l'évaluation Respiration : à la fin de la vidéo, l'utilisateur arrive sur l'écran d'évaluation initiale du pilier 1 (IA-40 puis IA-41).

**Structure-type 5 segments S0.2.** 75-80s total.

Segment 1 — accueil et bascule de mode (0-10s). Reconnaître le nouveau jour, nommer le changement d'allure. La bascule s'entend dès la première phrase.

Segment 2 — poser le cadre de la Phase 1 (10-30s). Pourquoi 8 semaines, pourquoi un pilier à la fois, qu'est-ce qui change. Orientation, pas cours.

Segment 3 — annoncer la roadmap et lister les 8 piliers (30-55s). Listing à l'oral des 8 piliers en appui de la roadmap visuelle, avec verbalisation de la logique de l'ordre (pourquoi la Respiration en premier).

Segment 4 — adresse personnelle Mimi & Jacky (55-70s). Posture : on l'a fait nous-mêmes, voilà ce qu'on t'invite à faire.

Segment 5 — appel au démarrage de l'évaluation (70-80s). Pose le geste qui suit immédiatement la vidéo : passage à l'évaluation initiale Respiration.

**Format de production suggéré.** Identique à 4.2. Vidéo statique cadrée sur Mimi et/ou Jacky, plan moyen ou rapproché, fond sobre cohérent avec la Charte graphique.

**Notes pour la production.** Tournage groupé recommandé sur une demi-journée, S0.1 et S0.2 dans la même session pour cohérence visuelle absolue (les deux vidéos s'enchaînent à une nuit d'intervalle dans le parcours utilisateur). Voir Brief contenu Session 2 pour le détail des arbitrages de tournage et les amorces par segment.

---

## Annexe A — Décisions tranchées au cours de la rédaction du Socle minimum

À intégrer dans la Synthèse des décisions V5 (qui remplace la V4).

**D23 — Architecture multilingue prévue dès la V1, contenu V1 français uniquement.** L'architecture supporte la traduction (slots de copy identifiés, pas de chaînes en dur, médias référençables par asset stable). Le contenu V1 reste exclusivement français — pas de sélecteur de langue, pas de traduction effective.

**D24 — Démarrage différé optionnel à la création de compte.** Si la création de compte intervient à moins de 4 heures du minuit local suivant (et avant minuit), l'app propose explicitement à l'utilisateur de démarrer son J1 maintenant ou le lendemain matin. Décision révocable depuis l'écran d'attente. Choix proposé après IA-10, avant IA-12. Implique deux nouveaux écrans dans l'IA : IA-10b et IA-10c.

**D25 — En cas d'absence prolongée traversant un changement de phase, l'app joue les écrans narratifs de transition dans l'ordre, à raison d'un par lancement.** Pas de saut direct à l'état théorique, pas d'enchaînement multiple dans la même session.

**D26 — Soft-rappel non-culpabilisant en Phase 0 quand l'utilisateur valide sa journée sous le seuil de 4 piliers.** Modale IA-15 affiche un message bienveillant avec deux options : "Cocher d'autres piliers" ou "Valider quand même". Pas de soft-rappel en Phase 1.

**D27 — Pas de modification rétroactive d'un check journalier validé.** Une journée validée reste validée. Une journée non validée reste non validée. Pas de fenêtre de modification.

**D28 — Storage local-only pour la V1.** Pas de backend cloud. Désinstallation = streak perdu. Choix volontaire : la désinstallation est un signal fort de désengagement.

**D29 — Paliers de récompense — premier franchissement avec vidéo dédiée, redéclenchement allégé sans vidéo aux franchissements suivants après cassure.** Premier : modale IA-50 complète avec vidéo de 30s, badge, message, accès galerie. Suivants après cassure : modale simplifiée, pas de vidéo, badge en plus petit, message court de reconnaissance, un seul bouton "Continuer".

**D30 — Sur la collision palier 15j et S0.1, IA-20 prime, IA-50 du palier est différé à la prochaine validation.** Logique généralisable : narratif structurant prime, palier différé d'un cran.

**D31 — Niveau adaptatif manuel uniquement en V1.** Pas de suggestion automatique de réajustement du niveau d'entrée. Choix manuel uniquement, modifiable depuis IA-41 ou IA-42.

**D32 — Plage de silence des notifications entre 22h et 8h locales.** Aucune notification dans cette plage, quelle que soit la famille.

**D33 — Une seule vidéo d'intro par pilier en V1, pas de variante par niveau d'entrée ni par profil dynamique.** La vidéo s'adresse au niveau Progression par défaut. Production simplifiée : 8 vidéos au lieu de 24.

---

## Annexe B — Mises à jour à propager dans les autres docs

*Annexe refondue le 7 mai 2026 suite à la livraison de l'audit V0 vs docs fondateurs et aux étapes 1, 2, 3 du Plan de patches en cascade.*

**Synthèse des décisions V5 → V6 (étape 1 du Plan, livrée le 7 mai 2026).** Intégration des décisions issues de l'audit. Modification de D6 (seuil Phase 0 passe de 4/6 à 5/7). Enrichissement de D31 (sémantique adaptation messagée vs changement automatique). Ajout de D34 (pas de score quotidien V1), D35 (pas de badges par pilier V1), D36 (pas de questionnaire fin de journée V1), D37 (effet miroir qualitatif V1, chiffré V2).

**Information Architecture V1 V2 → V3 (étape 2 du Plan, livrée le 7 mai 2026).** Sept écrans patchés. IA-15 (seuil 5/7), IA-30 (entry points multiples, pas de paywall terminal après J14), IA-40 et IA-46 (format évaluation 12 questions × 1-5 / score /60), IA-41 (refonte deux objets distincts diagnostic 5 niveaux + engagement 3 niveaux), IA-44 (sémantique adaptation messagée), IA-10 (flow nominal explicité avec migration local→distant), IA-14 (note état V0 partiel sur les jours-charnière). Plus 4 patches éditoriaux dans les Flows et la description IA-11 pour aligner les mentions "6 piliers" sur "7 actions".

**Métriques V1 V0.3 → V1.0 (étape 4 du Plan, à venir).** Refonte profonde des § 1.2 (ordre des branches déjà patché en V0.3 le 7 mai), § 2 (refonte intégrale en deux sous-sections diagnostic 5 niveaux et engagement 3 niveaux selon décisions B1 et B2), § 4.1 et 4.5 (sémantique adaptation messagée), Annexe A (retrait des zones à blanc résolues, reformulation de A2.5 en table de correspondance pédagogique 40 cases). Charge estimée 60 à 90 minutes Claude.

**Note de session avec Jacky (étape 5 du Plan, à venir).** Élagage des questions résolues (A2.1 4 dimensions, A3.1 confirmation 8 profils). Ajout des nouvelles demandes : table de correspondance pédagogique 5 niveaux × 8 piliers, libellés narratifs des piliers atypiques, compléments P3 / P4 / P7-Mental, harmonisation libellé Essentiel.

**CLAUDE.md du repo (étape 6 du Plan, à venir).** Sections nouvelles à ajouter sur l'état proto V0 et la dette identifiée, posture reset V1 (flag `__DEV__`), posture paywall V0 patché (commit `207e573` du 7 mai 2026), plan de refonte V1, convention de numérotation des fichiers Jacky selon D8.

**Nouveau document Schéma de données V1 (étape 7 du Plan, à venir).** Création complète. Tables Supabase actuelles (`profiles`, `progress`) et tables à créer pour V1 (`streak_history`, `joker_consumptions`, `tier_reaches`, `pillar_evaluations`, `pillar_sessions`, `level_adaptive_choices`). Plus une table vide `daily_check_ins` réservée pour V2 (questionnaire fin de journée différé par D36).

**Brief contenu V1 (à produire ultérieurement par Mimi & Jacky).** Liste des slots de copy identifiés dans le Socle minimum (consolidation à faire dans une session dédiée). Plus les enrichissements issus de l'audit : harmonisation "5 piliers" → "7 actions" dans tous les briefs Phase 0, harmonisation "Accessible" → "Essentiel" sur les piliers concernés (S7 Connexion vivant, S8 Élim/détox), 8 à 12 phrases d'effet miroir qualitatives à intégrer aux jours-charnière J3/J4/J7/J11 selon D37, libellés Jacky de badges réutilisables comme titres de moments narratifs en cours de semaine.

---

*Fin du document Feature Spec V1 — Socle minimum.*

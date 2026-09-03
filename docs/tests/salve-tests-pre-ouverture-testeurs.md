# Salve de tests manuels — avant ouverture aux testeurs externes

*Version 2.0 — 3 septembre 2026. À dérouler sur iPhone, Safari + PWA installée, sur https://app.rawadventure.world (prod). V1.1 (8 juillet) : attendus corrigés selon D38. V2.0 (3 septembre) : état d'avancement consolidé (blocs A→F validés), échelle de refresh du cache par test, regroupement de tout ce qui touche Stripe dans un bloc final S (contrainte : double validation Stripe, Mimi requise), reprise à G3 sur le compte +demo3.*

## État d'avancement (au 3 septembre 2026)

**Validé les 2-3 septembre (ne pas re-tester)** : blocs **A** (sauf A5/D24), **B**, **C**, **D** (modèle position D38 prouvé), **E** (charnières J3/J7/J11/J14), **F1-F2** (S0.1/S0.2, toile, palier différé D30), **F4** (position OK ; l'anomalie streak relevée est un vrai bug, **corrigé et mergé le 3 septembre** — commit `12fd2e4`, test de régression dans la suite Jest). Lecteur vidéo corrigé et validé (plein écran, pause, miniatures).

**G1 constaté** (paywall J17 bloquant, +demo3 y est resté coincé). **G2 contourné** : le « Mock active subscription » ne survit pas au reload pour un compte connecté (bug DEV n°2, consigné) — +demo3 a été débloqué en posant l'abonnement directement en base Supabase. Le **vrai** franchissement du paywall (paiement carte test Stripe) est déplacé au bloc S.

**Reste à faire, dans l'ordre** : **G3 → G6** puis **H, I, J, A5, K1/K3/K4/K5** (compte **+demo3**, hub Phase 1 ouvert), et en clôture le **bloc S — Stripe avec Mimi** (compte neuf **+demo4**, carte test) suivi de **K2** (nettoyage comptes).

**Comptes** : +demo3 = salve en cours (Stéphane). +demo2 = réservé aux tests Claude. **+test1 = GELÉ au paywall pour la vérif Stripe — ne pas toucher.** +demo4 = à créer au bloc S uniquement.

## Refresh du cache — échelle R0-R4 (à lire avant de commencer)

Chaque test ci-dessous porte un champ **Refresh** qui dit dans quel état de cache le démarrer. Appliquer le niveau AVANT les étapes du test.

| Niveau | Geste | Ce que ça recharge | Ce que ça garde |
|---|---|---|---|
| **R0** | Rien — on continue dans la session ouverte | — | Tout |
| **R1** | Recharger la page (Safari : bouton ↻ ou tirer vers le bas ; PWA : pas de geste natif → passer par R2) | Le contexte JavaScript (states en mémoire) | AsyncStorage (flags narratifs, compte anonyme), session |
| **R2** | Fermer COMPLÈTEMENT l'app (app switcher, balayer la PWA/l'onglet vers le haut) puis rouvrir | Contexte JS + relance du boot complet (cohérence calendaire, load Supabase) | AsyncStorage, session |
| **R3** | **Après chaque déploiement** : R2, puis vérifier qu'un changement attendu du déploiement est visible ; sinon re-fermer/rouvrir une 2e fois (le cache HTTP se met à jour au lancement suivant) | Le bundle JS lui-même (nouvelle version de l'app) | AsyncStorage, session |
| **R4** | Réinstaller la PWA ou vider les données du site (Réglages → Safari → Avancé → Données de site) | TOUT — état vierge | Rien : **détruit AsyncStorage** (flags narratifs, pilier en cours, compte anonyme). Réservé aux tests « compte neuf » |

Trois règles pratiques. **Un.** Quand Claude déploie un correctif pendant la salve, il l'annonce explicitement : « déploiement fait → R3 avant le prochain test » — ne jamais enchaîner un test après déploiement sans R3. **Deux.** Safari et la PWA installée sont deux stockages séparés : un R4 dans Safari ne vide pas la PWA, et inversement. **Trois.** Dans le doute (comportement bizarre, état incohérent), faire R2 avant de conclure à un bug — si le symptôme survit à R2, c'est un vrai signal.

## Rappel du modèle (D38 — à lire avant les blocs C à I)

L'app a **deux compteurs indépendants** :

- **La position** (« Jour X sur 14 ») = nombre de jours **validés** + 1. Elle n'avance que quand l'utilisateur valide sa journée (au plus un jour de parcours par jour réel). Une absence ne la fait PAS avancer : on reprend là où on s'était arrêté. Les jours-charnière, S0.1/S0.2 et le paywall sont indexés sur cette position.
- **Le streak** = jours consécutifs en calendrier **réel**. Une absence le casse (le joker en couvre une par semaine calendaire). Les paliers (15/30/60/100/365) sont indexés sur le streak.

Une charnière se joue **à la validation** du jour concerné (pas à l'ouverture du hub). Un seul écran narratif à la fois, priorité : palier > charnière > message joker.

**Stripe / paiement réel : regroupé dans le bloc S, en clôture de salve, avec Mimi** (double validation Stripe — Stéphane n'a pas l'accès seul). D'ici là, +demo3 est déjà abonné en base ; ne pas utiliser « Mock active subscription » sur un compte connecté (bug DEV n°2 : le mock ne survit pas au reload).

---

## 0. Avant de commencer

### 0.1 Matériel et comptes

- iPhone avec Safari, connexion normale (le test « vidéo en panne » utilisera le mode Avion).
- Plusieurs adresses email jetables pour créer des comptes de test. Astuce Gmail : `stephanetossens+test1@gmail.com`, `+test2`, etc. — chaque alias compte comme une adresse distincte pour Supabase, tout arrive dans ta boîte.
- Accès au dashboard Supabase (projet `aknvitrtfxqjdwiyxryt`) → SQL Editor, pour le nettoyage entre les tests.
- Accès au dashboard Resend (suivi des emails envoyés) en cas de doute sur un OTP non reçu.

### 0.2 Quota emails — à respecter

Le SMTP Resend est configuré (50 emails/h côté Supabase, 100/jour côté Resend gratuit). MAIS Supabase applique aussi une limite **par adresse** : demandes trop rapprochées → erreur 429 « Trop de tentatives. Réessaie dans une minute. ». Règle pratique : **pas plus d'un OTP par adresse par minute, et espacer les créations de compte**. Si un test échoue à cause du quota, changer d'alias plutôt que d'insister.

### 0.3 Les outils DEV (rappel)

Le panneau DEV apparaît dans l'onglet **Profil** si le build a `EXPO_PUBLIC_ENABLE_DEV_PANEL=true` (variable Vercel) — vérifier qu'il est visible avant de commencer (sinon aucun test « avance dans le temps » n'est possible).

| Outil | Où | Effet |
|---|---|---|
| **Clock offset « +1j » / « +7j » / « Reset »** | Profil → DEV Timeline | Décale l'horloge vue par l'app, sans toucher aux données. Affiche « Clock offset : +X.Xj ». Effet : simule le passage de jours réels → le **streak** est traité (joker/cassure) mais la **position ne bouge pas** si rien n'a été validé (D38). **Attention** : la cohérence calendaire ÉCRIT en base des entrées pour les jours « manqués » (à des dates réelles futures) → d'où le nettoyage SQL après (§ 0.4). |
| **Snapshots « Aller »** | Profil → DEV Timeline | 14 états pré-construits (P0 J1 fresh, P0 J3/J7/J14 avant validation, S0.1 J15, S0.2 J16, S1 J1/J3/J7, S2 J1, S4 J1, post-S8, joker burn, etc.). Écrase TOUTES les données du compte (Supabase + local) puis pose l'état choisi. |
| **« (DEV) Reset complet »** | Profil | Remet le compte à zéro. |
| **« Mock active subscription »** | Profil | Simule un abonnement actif — indispensable pour passer J17 sans Stripe. |

### 0.4 Nettoyage SQL entre les tests

Après tout test qui a utilisé le clock offset ou un snapshot, dans le SQL Editor Supabase (remplacer `$uid` par l'id du compte de test, visible dans Auth → Users) :

```sql
DELETE FROM streak_history      WHERE user_id = '$uid' AND local_date > CURRENT_DATE;
DELETE FROM joker_consumptions  WHERE user_id = '$uid' AND consumed_for_local_date > CURRENT_DATE;
DELETE FROM pillar_sessions     WHERE user_id = '$uid' AND local_date > CURRENT_DATE;
```

Puis dans l'app : DEV Timeline → « Reset » (clock offset à 0). Pour repartir d'une feuille blanche : « (DEV) Reset complet » ou snapshot « P0 J1 fresh ».

**Rappel important** : les flags narratifs (vidéo J1 vue, charnières vues, S0.1/S0.2 vus) et le pilier en cours sont stockés **dans le navigateur, pas en base**. Un « Reset complet » les efface ; un nettoyage SQL seul ne les efface pas. Et Safari et la PWA installée sont **deux stockages séparés** : un écran narratif « vu » dans Safari se rejouera dans la PWA — c'est normal, pas un bug (accepté V1).

### 0.5 Ordre recommandé (V2 — reprise du 3 septembre)

1. **G3 → G6** sur +demo3 (hub Phase 1 déjà ouvert, abonnement posé en base).
2. **H, I, J** (vidéo en panne, PWA, notifications) à intercaler librement.
3. **A5** (D24) un soir après 20h, sur un alias jetable.
4. **K1, K3, K4, K5** (checks finaux hors nettoyage comptes).
5. **Bloc S — Stripe avec Mimi** (paywall réel +demo4, Dashboard, bouton retour), puis **K2** (nettoyage de TOUS les comptes de test).

---

## Bloc A — Onboarding et création de compte (OTP) — ✅ VALIDÉ 2 sept (sauf A5)

### A1 — Parcours des 10 étapes d'onboarding

- **Départ** : Safari iPhone, navigation privée (aucun état local), https://app.rawadventure.world.
- **Étapes** : dérouler les 9 slides : Bienvenue → Le constat → La promesse → Questionnaire 1 (énergie 1-15 + corps Léger/Neutre/Lourd) → Questionnaire 2 (mental + motivation) → La projection → Profil dynamique → Comment ça marche → Engagement (case « Je joue le jeu. 14 jours. »).
- **Attendu** : indicateur de progression sur 10 segments ; slide 7 affiche un profil personnalisé cohérent avec les réponses ; slide 9 exige de cocher l'engagement avant « Créer mon compte » ; aucun emoji, pas de ton « coach Insta » ; slide 1 propose « J'ai déjà un compte ».
- **Variante** : refaire avec des réponses opposées (énergie basse/haute) → le profil dynamique change.
- **Nettoyage** : rien (pas encore de compte).

### A2 — Création de compte + OTP 6 chiffres

- **Départ** : sortie du test A1, écran Créer mon compte (IA-10).
- **Étapes** : saisir un alias email + mot de passe (6 caractères minimum) → valider → écran « email en attente » → relever l'email (expéditeur noreply@rawadventure.world) → saisir le code à 6 chiffres.
- **Attendu** : email reçu en moins de ~1 minute ; code correct → session ouverte, arrivée sur l'accueil J1 (ou écran de choix D24 si moins de 4h avant minuit, voir A5) ; les réponses d'onboarding ont bien suivi (profil visible dans Profil).
- **Cas d'erreur à tester** :
  - Code faux → message « Code invalide ou expiré », pas de crash, re-saisie possible.
  - Spam du renvoi → 429 « Trop de tentatives. Réessaie dans une minute. ».
  - Cliquer le **lien** de l'email dans un autre navigateur au lieu de saisir le code → l'app propose « J'ai déjà confirmé via le lien » et la connexion aboutit.
- **Nettoyage** : garder ce compte pour le Bloc B.

### A3 — « J'ai déjà un compte » (connexion retour)

- **Départ** : navigation privée fraîche (ou PWA vierge).
- **Étapes** : slide 1 → « J'ai déjà un compte » → connexion avec le compte du A2.
- **Attendu** : bypass de l'onboarding, arrivée directe sur l'accueil au bon jour, streak et progression intacts (données Supabase). **Attendu aussi** : la vidéo J1 et les écrans narratifs déjà vus **se rejouent** (flags locaux perdus sur ce nouveau navigateur) — accepté V1, à constater sans le compter comme bug.
- **Nettoyage** : rien.

### A4 — Déconnexion / session expirée

- **Étapes** : Profil → « Se déconnecter » → l'app revient à l'entrée → se reconnecter.
- **Attendu** : retour propre à l'écran d'auth ; à la reconnexion, parcours intact. Si un jour un bandeau « Ta session a expiré. Reconnecte-toi pour reprendre ton parcours. » apparaît spontanément, c'est le comportement prévu de session expirée.

### A5 — Démarrage différé D24 (si testable ce soir-là) — RESTE À FAIRE

- **Refresh** : R4 (compte neuf, navigation privée ou données de site vidées).

- **Départ** : créer un compte **à moins de 4h du minuit local** (donc après 20h).
- **Étapes** : finir l'onboarding + OTP après 20h.
- **Attendu** : écran « On démarre maintenant ou demain matin ? » (IA-10b). Choix « Je commence demain » → écran d'attente (IA-10c) ; après minuit (ou au matin), l'app démarre seule sur J1. Choix « On démarre maintenant » → J1 immédiat.
- **Nettoyage** : compte jetable, à supprimer dans Supabase Auth si non réutilisé.
- *Si le créneau horaire ne convient pas : marquer « non testé » plutôt que forcer.*

---

## Bloc B — J1 : vidéo de bienvenue et premier check — ✅ VALIDÉ 2 sept

### B1 — Vidéo de bienvenue (IA-12)

- **Départ** : compte neuf, premier passage sur l'accueil J1.
- **Attendu** : l'écran « JOUR 1 · BIENVENUE / C'est parti. » s'affiche **une seule fois**, avec la vidéo Mimi & Jacky et le bouton « Continuer ». Après « Continuer », arrivée sur le hub J1 avec les 7 actions.
- **Contre-tests** : fermer l'onglet PENDANT la vidéo puis rouvrir → la vidéo ne se rejoue pas (flag posé à l'ouverture, c'est voulu). Recharger la page après fermeture → ne se rejoue pas non plus.

### B2 — Check quotidien nominal (≥ 5/7)

- **Étapes** : cocher 5, 6 ou 7 actions → « Valider ma journée ».
- **Attendu** : modale avec « Journée validée. » (5-6/7) ou « Journée complète. » (7/7), ratio « X actions sur 7 » affiché, streak passe à 1 sur le hub. Pas de soft-rappel.

### B3 — Pas de modification rétroactive (D27)

- **Départ** : journée validée (B2).
- **Étapes** : tenter de recocher/décocher des actions, recharger la page.
- **Attendu** : la journée reste validée, aucune re-validation possible, le état est figé jusqu'au lendemain.

---

## Bloc C — Check sous le seuil, soft-rappel, joker manuel — ✅ VALIDÉ 2 sept

### C1 — Soft-rappel D26 (< 5/7)

- **Départ** : jour non validé (si la veille est validée, DEV « +1j » puis rouvrir le hub fait passer au jour suivant — la position n'avance au clock offset QUE si le jour courant était validé).
- **Étapes** : cocher 1 à 4 actions → « Valider ma journée ».
- **Attendu** : modale titre « Tu peux faire mieux. », texte expliquant le seuil et le joker, deux boutons : « Cocher d'autres actions » (referme la modale, retour aux coches) et « Valider quand même ».
- **Vérifier** : « Cocher d'autres actions » referme sans rien valider ; compléter à 5 puis valider → cas B2 normal.

### C2 — « Valider quand même » avec joker disponible

- **Départ** : streak > 0, aucun joker consommé cette semaine calendaire (lundi-dimanche), jour courant avec < 5 actions cochées.
- **Étapes** : « Valider quand même ».
- **Attendu** : le streak ne baisse PAS mais n'augmente pas non plus ; la journée compte dans la progression (la position avancera au jour suivant). Message « Joker consommé — Streak conservé à N. Réinitialisation lundi. » — SAUF si un écran narratif se déclenche à cette validation (charnière, palier) : priorité à l'écran, le message joker est tu. Vérification en base possible : ligne dans `joker_consumptions` (semaine courante).
- **Nettoyage** : noter que le joker de la semaine est grillé pour la suite des tests (ou changer de semaine via +7j, ou nettoyer `joker_consumptions` en SQL).

### C3 — « Valider quand même » sans joker (cassure)

- **Départ** : joker déjà consommé cette même semaine calendaire (enchaîner après C2 en avançant de +1j, en restant dans la même semaine lundi-dimanche).
- **Étapes** : cocher < 5 actions → « Valider quand même ».
- **Attendu** : le streak retombe à 0. Message de cassure sobre, non culpabilisant (mention `[copy à valider]` possible — accepté V1).
- **Nettoyage** : SQL § 0.4 + Reset clock.

---

## Bloc D — Jours manqués : joker automatique et cassure (audit B1 + D38) — ✅ VALIDÉ 2 sept

Ces tests vérifient la « cohérence calendaire » qui tourne à l'ouverture de l'app : les jours réels passés sans validation sont résolus automatiquement **côté streak** (joker/cassure). La **position, elle, ne bouge pas** : on reprend au jour où on s'était arrêté, et le message le dit.

### D1 — Un jour manqué → joker automatique, position inchangée

- **Départ** : le plus simple : snapshot **« P0 J5 + skip J4 (joker dispo) »** (DEV Timeline → Aller) — il pose J1-J3 validés puis un jour réel sauté. Sinon manuellement : valider un jour, « +2j », rouvrir.
- **Attendu à l'ouverture** : dialogue navigateur « Joker utilisé — Ton joker de la semaine a couvert une journée manquée. Streak conservé. Tu reprends au jour 4, là où tu t'étais arrêté. [copy à valider] ».
- **Vérifier** : le hub affiche « **Jour 4 sur 14** » (3 jours validés + 1 — PAS jour 5 : le jour manqué n'a pas fait avancer la position, D38). Streak conservé à 3.
- **Nettoyage** : SQL § 0.4 + Reset clock.

### D2 — Deux jours manqués même semaine → cassure, position toujours inchangée

- **Départ** : suite du D1 (joker grillé), ou état avec joker déjà consommé.
- **Étapes** : « +2j » sans valider, rouvrir le hub.
- **Attendu** : dialogue « Streak remis à zéro — Des journées sont passées sans validation. Ton streak repart de zéro — la prochaine validation le relance. Tu reprends au jour 4, là où tu t'étais arrêté. [copy à valider] ». Streak à 0, position toujours « Jour 4 sur 14 ».
- **Vérifier ensuite** : valider la journée courante à ≥ 5/7 → streak repart à 1 ; le lendemain (+1j), la position passe à « Jour 5 sur 14 ».

### D3 — Joker non consommé quand le streak est déjà à 0

- **Départ** : streak à 0 (sortie du D2), joker de la nouvelle semaine disponible.
- **Étapes** : « +1j » sans valider, rouvrir.
- **Attendu** : PAS de message « Joker utilisé » — le joker n'est pas gaspillé pour protéger un streak déjà nul (décision du 7 juillet). Position inchangée.
- **Nettoyage** : SQL § 0.4, Reset clock, puis « (DEV) Reset complet » pour aborder le Bloc E propre.

### D4 — Changement de semaine → joker recrédité

- **Départ** : joker consommé en semaine N.
- **Étapes** : avancer au lundi suivant (+Xj), manquer un jour de la semaine N+1.
- **Attendu** : nouveau joker disponible → message « Joker utilisé » à nouveau. (Le joker est bien 1/semaine calendaire lundi-dimanche, pas 1/7 jours glissants.)
- **Nettoyage** : SQL § 0.4 + Reset clock.

---

## Bloc E — Jours-charnière J3 / J7 / J11 / J14 — ✅ VALIDÉ 2 sept

Utiliser les snapshots « P0 J3 avant validation », « P0 J7 avant validation », « P0 J14 avant validation » (J11 : y aller en validant les jours intermédiaires avec +1j entre chaque). **Rappel D38 : la charnière se joue à la VALIDATION du jour concerné**, pas à l'ouverture du hub. Un jour charnière jamais validé = charnière jamais jouée (assumé).

### E1 — J3 (texte seul)

- **Étapes** : sur le hub J3, valider la journée (≥ 5/7).
- **Attendu après validation** : modale plein écran « Jour 3 · cap symbolique / Le corps commence à répondre. », texte, bouton « Je continue ». Pas de badge, pas de vidéo.
- **Contre-test** : fermer/rouvrir l'app le même jour → la charnière ne se rejoue pas.
- *Déjà validé le 8 juillet (passe 1, via C2) — à repasser seulement si le temps le permet.*

### E2 — J7 (riche : badge + vidéo)

- **Étapes** : valider la journée du J7.
- **Attendu après validation** : modale « Jour 7 · une semaine / Sept jours. », badge circulaire « 7 JOURS », vidéo, bouton « Je continue ». (Le raccourci « Voir mes paliers » a été retiré — la galerie s'ouvre depuis Profil uniquement.)
- **Point de vigilance** : il ne doit PAS y avoir de modale « palier 7 jours » en plus — le palier 7j n'existe plus (paliers actuels : 15, 30, 60, 100, 365). La description du preset DEV mentionne encore « palier 7j » : elle est obsolète, ne pas s'y fier. Si une modale palier apparaît à J7 → bug à signaler.
- **Vérifier aussi** : Profil → « Voir mes paliers » → la galerie s'ouvre.

### E3 — J11 (texte seul)

- **Étapes** : valider la journée du J11.
- **Attendu après validation** : « Jour 11 · ligne droite finale / Le plus dur est derrière toi. », bouton « Je continue ».

### E4 — J14 (riche, fin de Phase 0)

- **Étapes** : valider la journée du J14.
- **Attendu après validation** : « Jour 14 · fin de Phase 0 / Quatorze jours. Un premier ressenti. », badge « 14 JOURS », vidéo, CTA « Voir la suite », streak affiché en pied. Mention `[copy à valider]` dans le texte — accepté V1.
- **« Voir la suite »** ferme la charnière et **ouvre l'écran d'abonnement** (paywall soft, avec retour possible) — voulu, conversion accessible en fin de Phase 0.
- **Vérifier aussi** : aux jours 14-16 non abonné, le hub affiche un CTA doux vers l'écran d'abonnement (pas bloquant — on peut revenir en arrière).
- **Nettoyage bloc E** : les charnières « vues » sont des flags locaux ; un « Reset complet » les efface pour rejouer.

---

## Bloc F — Transition S0.1 / S0.2, onglet Toile, palier 15j différé (D30) — ✅ VALIDÉ 2-3 sept (F4 : bug streak corrigé, commit 12fd2e4)

### F1 — S0.1 au jour 15 : célébration + toile révélée + palier différé (D30)

- **Départ** : snapshot **« S0.1 J15 »** (14 jours validés, streak 14 — conçu pour la coordination D30 : le palier 15j tombera à la validation du jour).
- **Étapes et attendus, dans l'ordre** :
  1. **À l'ouverture du hub** (contrairement aux charnières, S0.1 se joue à l'ouverture, pas à la validation) : écran S0.1 plein écran : « Quatorze jours derrière toi. », vidéo célébration, **révélation animée de la toile d'araignée** (8 branches, « Ta toile de vitalité »), streak, bouton « Continuer ».
  2. L'onglet **« Toile »** apparaît dans la barre du bas (absent avant le jour 15).
  3. **Valider la journée du jour 15** (≥ 5/7) → le streak passe à 15 → le palier 15 jours est atteint MAIS **rien ne s'affiche** : il est différé (D30, S0.1 prime le même jour). Si une modale palier apparaît ici → bug.
- **Contre-test** : rouvrir l'app → S0.1 ne se rejoue pas.

### F2 — S0.2 au jour 16 : roadmap 8 piliers + palier 15j repêché

- **Départ** : lendemain du F1 (« +1j »), ou snapshot « S0.2 J16 » (mais le snapshot ne porte pas le palier différé du F1 — pour tester D30 de bout en bout, enchaîner depuis F1).
- **Étapes et attendus** :
  1. **À l'ouverture du hub** : écran S0.2 « Huit semaines. Huit piliers. », vidéo roadmap, liste des 8 piliers dans l'ordre (S1 Respiration en tête, badge « ON DÉMARRE »). Boutons : non abonné → « Découvrir l'abonnement » + « Continuer » ; abonné (mock) → « Continuer » seul.
  2. **Valider la journée du jour 16** → la modale **palier 15 jours** différée s'affiche enfin (« Quinze jours. », badge, vidéo, « Continuer ») — différée d'un cran, pas perdue (D30).

### F3 — Onglet Toile

- **Étapes** : ouvrir l'onglet Toile après le jour 15.
- **Attendu** : toile 8 branches visible, tap sur une branche → détail. En Phase 0+S0, les branches reflètent l'état initial (pas encore d'évaluations).

### F4 — Absence prolongée autour de la transition (D38 + D25)

- **Départ** : état jour 14 validé, puis « +4j » d'un coup sans rien valider (absence de 4 jours réels).
- **Attendu au retour** :
  1. La position n'a PAS bougé : on est au **jour 15** (14 validés + 1) — pas au « jour 19 ». S0.1 se joue à l'ouverture, comme en F1.
  2. Côté streak : message de cassure (« Streak remis à zéro… Tu reprends… ») — 4 jours réels manqués, le joker n'en couvre qu'un. Le palier 15j ne sera donc PAS atteint à la validation (streak reparti de 0) — pas de test D30 possible sur cette route.
  3. S0.2 arrivera naturellement le lendemain (après validation du jour 15 + nouveau jour réel) : les écrans narratifs s'espacent d'eux-mêmes, pas d'enchaînement dans la même session (esprit D25).
- **Nettoyage** : SQL § 0.4 + Reset clock.

---

## Bloc G — J17 : paywall et Phase 1 (S1 Respiration) — EN COURS, reprise à G3 (compte +demo3)

### G1 — Paywall au jour 17 sans abonnement — ✅ CONSTATÉ 2 sept

- **Départ** : compte non abonné, arrivé au jour 17 — c'est-à-dire **jour 16 validé** puis « +1j » (17e jour = 17e jour VALIDÉ, pas 17e jour réel — D38).
- **Attendu** : l'app est **bloquée** sur l'écran paywall (plein écran, pas d'accès aux onglets). CTA « Continuer mon parcours » (ouvre la page d'abonnement web — **ne pas aller au bout du paiement**, c'est le test de demain) et « Plus tard ». Pas de prix affiché dans l'app, pas des mots « payer/abonnement » sur les CTA (règles Apple).
- **Vérifier** : « Plus tard » — observer où il mène (l'utilisateur reste bloqué hors Phase 1, c'est le comportement attendu tant que non abonné).

### G2 — Déblocage par abonnement — ⚠️ CONTOURNÉ 2 sept

- **État réel** : le mock DEV ne survit pas au reload pour un compte connecté (bug DEV n°2). +demo3 a été débloqué en posant l'abonnement en base Supabase. Le déblocage par le VRAI chemin (paiement) = bloc S.

- **Étapes** : activer « Mock active subscription » dans Profil (il faut y accéder AVANT J17, ou via l'état où le paywall permet le retour — sinon poser le mock avant d'avancer le temps).
- **Attendu** : à J17 abonné, plus de paywall ; le hub Phase 1 s'affiche et le pilier **S1 Respiration démarre automatiquement**.

### G3 — Évaluation initiale S1 (12 questions) — ▶ POINT DE REPRISE

- **Compte** : +demo3. **Refresh** : R2 (fermeture complète + réouverture — on repart d'un boot propre sur le hub Phase 1).
- **Départ** : hub Phase 1 S1 ; s'il propose la vue d'ensemble du pilier (vidéo intro + programme 7 jours) puis « Continuer », c'est l'ordre voulu (décision 18 juin : PillarOverview AVANT le questionnaire).

- **Attendu** : parcours de 12 questions, échelle 1 à 5, indicateur de progression 12 segments. À la fin : écran récap avec score, niveau diagnostic, proposition de niveau d'engagement (durée cohérence cardiaque 5/10/20 min), vidéo d'intro pilier. On peut choisir son niveau puis démarrer la semaine.

### G4 — Sessions quotidiennes (3/jour) + niveau adaptatif

- **Compte** : +demo3. **Refresh** : R0 (enchaîner après G3).

- **Attendu** : hub Phase 1 avec 3 sessions (matin/midi/soir) ; ouvrir une session → cercle de respiration animé (durée selon le niveau choisi) ; à la fin, modale « Moins / Pareil / Plus » (le choix ne change PAS le niveau d'entrée, il s'applique à la pratique — D31). Le check quotidien Phase 1 se valide à **1 session sur 3 minimum**, sans soft-rappel.
- **Vérifier** : valider un jour Phase 1 avec 1 session → streak +1.

### G5 — Éval finale S1 (J7 du pilier)

- **Compte** : +demo3. **Refresh** : R2 après le snapshot (le snapshot écrase l'état → boot propre nécessaire). ⚠️ Le snapshot DEV « S1 J7 » réinitialise aussi l'abonnement mocké : si le paywall réapparaît, reposer l'abonnement en base (bug DEV n°2), pas le mock.

- **Départ** : snapshot **« S1 J7 avant éval finale »**.
- **Attendu** : carte/CTA éval finale visible ; refaire les 12 questions → récap final avec comparaison avant/après et mise à jour de la branche Respiration sur la toile (onglet Toile : la branche a bougé).

### G6 — (Bonus si le temps) Transition S1 → S2 et toile multi-branches

- **Compte** : +demo3. **Refresh** : R2 après chaque snapshot.

- Snapshots « S2 J1 (S1 prefilled) » et « S4 J1 (S1-S3 prefilled) » : vérifier la transition de pilier et la toile avec plusieurs branches peuplées.
- **Nettoyage bloc G** : « (DEV) Reset complet » + désactiver le mock subscription + SQL § 0.4.

---

## Bloc H — Vidéos en panne (audit M4)

### H1 — Vidéo indisponible + re-tentative

- **Refresh** : R0 (état courant, peu importe l'écran).

- **Départ** : n'importe quel écran avec vidéo (charnière J7, S0.1, paywall…). Activer le **mode Avion** AVANT de lancer la vidéo.
- **Étapes** : taper play.
- **Attendu** : spinner blanc, puis au plus tard après 12 secondes : overlay « **Vidéo indisponible** / Vérifie ta connexion, puis touche pour réessayer. ». Pas de plein écran figé, pas de spinner infini.
- **Étapes suite** : couper le mode Avion, toucher la zone vidéo.
- **Attendu** : la vidéo repart normalement (re-tentative par remount).
- **Variante** : couper le réseau PENDANT la lecture → pas de blocage définitif de l'app.

---

## Bloc I — PWA, retour premier plan, multi-contexte

### I1 — Installation PWA sur l'écran d'accueil

- **Refresh** : R0 côté Safari ; la PWA installée démarre avec SON stockage vierge (équivalent R4 pour elle — narratifs rejoués + re-login, accepté V1).

- **Étapes** : Safari → partager → « Sur l'écran d'accueil » → ouvrir depuis l'icône.
- **Attendu** : icône Raw Adventure correcte, app en plein écran sans barre Safari (mode standalone), fond/thème aux couleurs de la marque, orientation portrait. Le login fonctionne dans la PWA.
- **Rappel** : la PWA a son propre stockage → écrans narratifs revus + re-login nécessaire la première fois. Accepté V1.

### I2 — Recalcul au retour au premier plan après minuit (audit M1)

- **Refresh** : R0 STRICT — tout l'intérêt du test est de NE PAS recharger : laisser la PWA en arrière-plan et revenir après minuit sans la tuer.

- **Test réaliste** (à programmer un soir) : valider sa journée avant minuit, laisser la PWA ouverte en arrière-plan ; après minuit, revenir sur l'app SANS la tuer.
- **Attendu** : le hub bascule seul sur le jour suivant du parcours (position +1 car la veille était validée, coches vierges) sans recharger la page.
- **Variante jour non validé** : si la veille n'était PAS validée, la position ne bouge pas (D38) — le hub reste sur le même jour, et la cohérence traite le streak (joker/cassure + message « Tu reprends au jour X », cf. Bloc D).
- **Variante rapide** : changer la date du téléphone est déconseillé (fausse Supabase) — préférer le vrai passage de minuit ou le clock offset DEV.

### I3 — Rafraîchissement / perte réseau générale

- **Refresh** : le test EST le refresh (R1 puis R2 en plein parcours).

- **Étapes** : recharger la PWA en plein parcours ; couper le réseau puis naviguer entre les onglets.
- **Attendu** : pas d'écran blanc définitif ; au retour du réseau, l'app se resynchronise. Noter tout état bizarre.

---

## Bloc J — Notifications

### J1 — Permission et planification

- **Refresh** : R2 (boot propre pour observer le prompt de permission).

- **Étapes** : observer si/quand l'app demande la permission de notifications (au premier lancement du hub).
- **Attendu théorique** : notifications locales Phase 0 = 2/jour (matin 7h, rappel soir 20h annulé si au moins une action cochée), silence 22h-7h.
- **⚠️ Zone grise connue** : les notifications sont implémentées avec expo-notifications, pensé pour iOS/Android natif. Sur **PWA iOS**, le support des notifications web est limité (iOS 16.4+, et la planification locale peut ne pas fonctionner du tout). **Le but de ce test est de CONSTATER le comportement réel** : permission demandée ou pas, notification reçue le lendemain matin ou pas. Documenter le résultat — si rien n'arrive sur PWA, c'est une limite technique à acter (pas un bug de logique), et il faudra décider quoi dire aux testeurs.

---

## Bloc K — Checks finaux AVANT d'ouvrir aux testeurs

- [ ] **K1 — Désactiver le panneau DEV en prod.** Si `EXPO_PUBLIC_ENABLE_DEV_PANEL=true` est posé sur Vercel pour cette salve, le **retirer et redéployer** avant d'envoyer le lien aux testeurs — sinon ils auront accès au Reset complet, aux snapshots et au mock d'abonnement. Vérifier ensuite sur l'app : Profil sans panneau DEV.
- [ ] **K2 — Re-nettoyage SQL** de tous les comptes de test (jours futurs, § 0.4) et suppression des comptes jetables (Supabase Auth → Users). **À faire APRÈS le bloc S** (il consomme +demo4 et libère +test1). Mettre ensuite à jour la note d'attribution des comptes.
- [ ] **K3 — Quota emails** : estimer le nombre de testeurs × 1-2 OTP chacun vs 50/h et 100/jour (Resend gratuit). Au-delà de ~30 testeurs le même jour, risque de plafond — étaler les invitations.
- [ ] **K4 — Passer une dernière fois le flow compte neuf** (A1→B2) sur la prod re-déployée, sans outils DEV.
- [ ] **K5 — Brief testeurs** : leur dire que la Phase 1 nécessite un abonnement (bloqué à J17), que certains textes portent la mention `[copy à valider]`, et comment remonter un bug (capture + heure + ce qu'ils faisaient).

---

## Bloc S — Stripe, avec Mimi (clôture de salve)

*Contrainte : la double validation Stripe requiert la présence de Mimi. Tout ce bloc se fait en une seule séance. Prérequis : blocs G→K4 terminés. Référence croisée : vérifs R2/R3/R5 de l'audit Stripe (session du 9 juillet).*

### S1 — Franchissement du paywall par le vrai chemin (compte +demo4)

- **Compte** : créer **+demo4** (compte neuf, onboarding complet). **Refresh** : R4 au départ (contexte vierge).
- **Départ** : amener +demo4 à J17 via les outils DEV (valider les jours avec +1j entre chaque, ou snapshot « S0.2 J16 » puis valider + « +1j ») → paywall.
- **Étapes** : « Continuer mon parcours » → page d'abonnement web → **payer avec la carte de test Stripe `4242 4242 4242 4242`** (date d'expiration future quelconque, CVC quelconque, mode test).
- **Attendu** : paiement accepté ; au retour dans l'app (voir S3 pour le bouton retour), après R2 au besoin, le paywall a disparu et la Phase 1 s'ouvre par le flux nominal. En base : ligne d'abonnement active créée par le webhook.

### S2 — Vérifications Dashboard Stripe (R2, R3)

- **Avec Mimi sur le Dashboard** : vérifier la configuration relevée par l'audit Stripe (points R2 et R3 de la note de vérification — emails de reçu/facture, paramètres du portail client, mode test vs live). Confirmer que le paiement S1 apparaît côté Dashboard avec le bon produit/prix (mensuel ou annuel selon le choix fait).
- **Vérifier aussi** : Profil → « Gérer mon abonnement » ouvre le portail client Stripe pour +demo4.

### S3 — Bouton « Retour à l'app » (R5)

- **Contexte** : bug connu — le bouton « Retour à l'app » de la page d'abonnement (site vitrine) ne fonctionne pas dans l'in-app browser iOS (fermeture par glissement manuel nécessaire).
- **Étapes** : au retour de paiement S1, observer le comportement réel du bouton ; noter précisément (rien ne se passe / erreur / autre).
- **Attendu V1** : si le bouton reste inopérant, le glissement manuel doit ramener dans l'app SANS perte d'état, et le reload au retour doit détecter l'abonnement (pas de boucle paywall).

### S4 — Compte +test1 (gelé)

- **Après S1-S3 validés** : dérouler la vérification prévue sur **+test1** (état gelé « jour 17, non abonné, bloqué au paywall ») si la note de vérif Stripe le prévoit encore, PUIS le libérer. Ensuite seulement : K2 (nettoyage global des comptes).


---

## Zones connues — ne pas les compter comme bugs

1. **Flags narratifs liés à l'appareil/navigateur** : vidéo J1, charnières, S0.1/S0.2 « vus » sont stockés localement. Changement d'appareil, bascule Safari↔PWA, ou nettoyage du site → ces écrans se rejouent. Accepté V1.
2. **`[copy à valider]`** visibles en prod sur ~7 écrans (charnières J7/J14, S0.1, S0.2, messages joker/cassure, paliers, écrans S8/consolidation/mentorat). En attente du Brief contenu Mimi & Jacky. Les testeurs les verront.
3. **Récupération de compte en Phase 1** : le pilier en cours est stocké localement. Un utilisateur Phase 1 qui change d'appareil retombe au début de S1 (ses évaluations/sessions passées restent en base). Chantier séparé documenté, hors V1.
4. **Titre du soft-rappel « Tu peux faire mieux. »** : à faire relire par Mimi & Jacky sous l'angle « non-culpabilisant » (D26) — observation copy, pas un bug fonctionnel.
5. **Plage de silence notifications 22h-7h dans le code** (D32 dit 22h-8h) : écart assumé dans le code (« attraper les français qui se lèvent 6h-7h ») — à confirmer comme choix ou à réaligner, mais pas bloquant pour la salve.
6. **Description du preset DEV « P0 J7 » mentionnant un palier 7j** : obsolète (paliers = 15/30/60/100/365). Cosmétique DEV uniquement.
7. **Stripe/paiement réel** : regroupé dans le bloc S (avec Mimi), en clôture de salve.
8. **Design des charnières** (relevé Stéphane, 8 juillet) : l'écran charnière utilise le même design que les paliers streak — différenciation visuelle charnière/palier à faire plus tard, pas bloquant V1.
9. **Ton de la charnière après une journée « au rabais »** (relevé Stéphane, 8 juillet) : une journée validée à 2/7 avec joker déclenche quand même le texte enthousiaste de la charnière (« Le corps commence à répondre ») — mécaniquement voulu (D38), variante de copy à envisager avec Mimi & Jacky.
10. **CLAUDE.md était en retard sur D38** : la section D20 décrivait encore la position calendaire — patché le 8 juillet (v1.4). Si un doc Project mentionne encore « le calendrier de l'app suit le calendrier réel » pour la position, c'est l'ancien modèle : D38 fait foi (position par validation).

---

## Modèle de compte-rendu par test

| ID | OK / KO / Non testé | Notes (ce qui s'est passé, capture) |
|---|---|---|
| A1 | | |
| A2 | | |
| … | | |

*Fin du document. Estimation : 1 grosse demi-journée pour les blocs A-G, plus les tests « passage de minuit » (I2) et « notification du lendemain » (J1) qui s'étalent sur 24h.*

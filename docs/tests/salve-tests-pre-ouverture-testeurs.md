# Salve de tests manuels — avant ouverture aux testeurs externes

*Version 1.0 — 7 juillet 2026. À dérouler sur iPhone, Safari + PWA installée, sur https://app.rawadventure.world (prod). Rédigé d'après le code réellement en prod (post-audit narratif du 6-7 juillet 2026).*

**Hors périmètre de cette salve : Stripe / paiement réel** (vérification séparée prévue demain). Ici on utilise uniquement le bouton DEV « Mock active subscription » pour simuler un abonné.

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
| **Clock offset « +1j » / « +7j » / « Reset »** | Profil → DEV Timeline | Décale l'horloge vue par l'app, sans toucher aux données. Affiche « Clock offset : +X.Xj ». **Attention** : à l'ouverture du hub avec offset, la cohérence calendaire ÉCRIT en base des entrées pour les jours « manqués » (à des dates réelles futures) → d'où le nettoyage SQL après (§ 0.4). |
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

### 0.5 Ordre recommandé

1. Blocs A-B avec un **compte neuf, sans triche** (flow réel J1).
2. Blocs C-D-E-F-G en avançant le temps (clock offset + snapshots) sur ce même compte ou un deuxième.
3. Blocs H-I-J (vidéo en panne, PWA, divers) à intercaler librement.
4. Bloc K (checks finaux avant ouverture) en dernier — il inclut la désactivation du panneau DEV.

---

## Bloc A — Onboarding et création de compte (OTP)

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

### A5 — Démarrage différé D24 (si testable ce soir-là)

- **Départ** : créer un compte **à moins de 4h du minuit local** (donc après 20h).
- **Étapes** : finir l'onboarding + OTP après 20h.
- **Attendu** : écran « On démarre maintenant ou demain matin ? » (IA-10b). Choix « Je commence demain » → écran d'attente (IA-10c) ; après minuit (ou au matin), l'app démarre seule sur J1. Choix « On démarre maintenant » → J1 immédiat.
- **Nettoyage** : compte jetable, à supprimer dans Supabase Auth si non réutilisé.
- *Si le créneau horaire ne convient pas : marquer « non testé » plutôt que forcer.*

---

## Bloc B — J1 : vidéo de bienvenue et premier check

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

## Bloc C — Check sous le seuil, soft-rappel, joker manuel

### C1 — Soft-rappel D26 (< 5/7)

- **Départ** : jour non validé (avancer d'un jour avec DEV « +1j » si besoin, puis rouvrir le hub).
- **Étapes** : cocher 1 à 4 actions → « Valider ma journée ».
- **Attendu** : modale titre « Tu peux faire mieux. », texte expliquant le seuil et le joker, deux boutons : « Cocher d'autres actions » (referme la modale, retour aux coches) et « Valider quand même ».
- **Vérifier** : « Cocher d'autres actions » referme sans rien valider ; compléter à 5 puis valider → cas B2 normal.

### C2 — « Valider quand même » avec joker disponible

- **Départ** : streak > 0, aucun joker consommé cette semaine calendaire (lundi-dimanche), jour courant avec < 5 actions cochées.
- **Étapes** : « Valider quand même ».
- **Attendu** : dialogue navigateur « Joker consommé — Streak conservé à N. Réinitialisation lundi. » ; le streak ne baisse PAS mais n'augmente pas non plus ; la journée compte dans la progression.
- **Nettoyage** : noter que le joker de la semaine est grillé pour la suite des tests (ou changer de semaine via +7j, ou nettoyer `joker_consumptions` en SQL).

### C3 — « Valider quand même » sans joker (cassure)

- **Départ** : joker déjà consommé cette même semaine calendaire (enchaîner après C2 en avançant de +1j, en restant dans la même semaine lundi-dimanche).
- **Étapes** : cocher < 5 actions → « Valider quand même ».
- **Attendu** : le streak retombe à 0. Message de cassure sobre, non culpabilisant (mention `[copy à valider]` possible — accepté V1).
- **Nettoyage** : SQL § 0.4 + Reset clock.

---

## Bloc D — Jours manqués : joker automatique et cassure (audit B1)

Ces tests vérifient la « cohérence calendaire » qui tourne à l'ouverture de l'app : les jours passés sans validation sont résolus automatiquement.

### D1 — Un jour manqué → joker automatique

- **Départ** : le plus simple : snapshot **« P0 J5 + skip J4 (joker dispo) »** (DEV Timeline → Aller). Sinon manuellement : valider un jour, « +2j », rouvrir.
- **Attendu à l'ouverture** : dialogue navigateur « Joker utilisé — Ton joker de la semaine a couvert une journée manquée. Streak conservé. [copy à valider] ». Streak conservé, le jour manqué ne compte pas dans la progression.
- **Nettoyage** : SQL § 0.4 + Reset clock.

### D2 — Deux jours manqués même semaine → cassure

- **Départ** : suite du D1 (joker grillé), ou état avec joker déjà consommé.
- **Étapes** : « +2j » sans valider, rouvrir le hub.
- **Attendu** : dialogue « Streak remis à zéro — Des journées sont passées sans validation. Ton streak repart de zéro — la prochaine validation le relance. [copy à valider] ». Streak à 0.
- **Vérifier ensuite** : valider la journée courante à ≥ 5/7 → streak repart à 1.

### D3 — Joker non consommé quand le streak est déjà à 0

- **Départ** : streak à 0 (sortie du D2), joker de la nouvelle semaine disponible.
- **Étapes** : « +1j » sans valider, rouvrir.
- **Attendu** : PAS de message « Joker utilisé » — le joker n'est pas gaspillé pour protéger un streak déjà nul (décision du 7 juillet). Le jour est marqué manqué, silencieusement ou avec le message de streak à zéro.
- **Nettoyage** : SQL § 0.4, Reset clock, puis « (DEV) Reset complet » pour aborder le Bloc E propre.

### D4 — Changement de semaine → joker recrédité

- **Départ** : joker consommé en semaine N.
- **Étapes** : avancer au lundi suivant (+Xj), manquer un jour de la semaine N+1.
- **Attendu** : nouveau joker disponible → message « Joker utilisé » à nouveau. (Le joker est bien 1/semaine calendaire lundi-dimanche, pas 1/7 jours glissants.)
- **Nettoyage** : SQL § 0.4 + Reset clock.

---

## Bloc E — Jours-charnière J3 / J7 / J11 / J14

Utiliser les snapshots « P0 J3 avant validation », « P0 J7 avant validation », « P0 J14 avant validation » (J11 : y aller au clock offset depuis J7, ou valider les jours intermédiaires).

### E1 — J3 (texte seul)

- **Attendu au premier affichage du hub le J3** : modale plein écran « Jour 3 · cap symbolique / Le corps commence à répondre. », texte, bouton « Je continue ». Pas de badge, pas de vidéo.
- **Contre-test** : fermer/rouvrir l'app le même jour → la charnière ne se rejoue pas.

### E2 — J7 (riche : badge + vidéo)

- **Attendu** : modale « Jour 7 · une semaine / Sept jours. », badge circulaire « 7 JOURS », vidéo, boutons « Je continue » et « Voir mes paliers ».
- **Point de vigilance** : il ne doit PAS y avoir de modale « palier 7 jours » en plus — le palier 7j n'existe plus (paliers actuels : 15, 30, 60, 100, 365). La description du preset DEV mentionne encore « palier 7j » : elle est obsolète, ne pas s'y fier. Si une modale palier apparaît à J7 → bug à signaler.
- **« Voir mes paliers »** → galerie des paliers s'ouvre.

### E3 — J11 (texte seul)

- **Attendu** : « Jour 11 · ligne droite finale / Le plus dur est derrière toi. », bouton « Je continue ».

### E4 — J14 (riche, fin de Phase 0)

- **Attendu** : « Jour 14 · fin de Phase 0 / Quatorze jours. Un premier ressenti. », badge « 14 JOURS », vidéo, CTA « Voir la suite », streak affiché en pied. Mention `[copy à valider]` dans le texte — accepté V1.
- **Vérifier aussi** : à J14-J16 non abonné, le hub affiche un CTA doux vers l'écran d'abonnement (pas bloquant — on peut revenir en arrière).
- **Nettoyage bloc E** : les charnières « vues » sont des flags locaux ; un « Reset complet » les efface pour rejouer.

---

## Bloc F — Transition S0.1 / S0.2, onglet Toile, palier 15j différé (D30)

### F1 — S0.1 à J15 : célébration + toile révélée + palier différé

- **Départ** : snapshot **« S0.1 J15 »** (conçu pour tester la coordination D30 : le palier 15j tombe le même jour).
- **Étapes** : valider la journée du J15 (ou ouvrir le hub selon l'état du snapshot).
- **Attendu, dans cet ordre** :
  1. Écran S0.1 plein écran : « Quatorze jours derrière toi. », vidéo célébration, **révélation animée de la toile d'araignée** (8 branches, « Ta toile de vitalité »), streak, bouton « Continuer ».
  2. **Après** fermeture de S0.1 : la modale **palier 15 jours** s'affiche (« Quinze jours. », badge, vidéo) — elle a été différée, pas perdue (D30).
  3. L'onglet **« Toile »** apparaît dans la barre du bas (il était absent avant J15).
- **Contre-test** : rouvrir l'app → ni S0.1 ni le palier ne se rejouent.

### F2 — S0.2 à J16 : roadmap 8 piliers

- **Départ** : lendemain du F1 (+1j), ou snapshot « S0.2 J16 ».
- **Attendu** : écran « Huit semaines. Huit piliers. », vidéo roadmap, liste des 8 piliers dans l'ordre (S1 Respiration en tête, badge « ON DÉMARRE »). Boutons : non abonné → « Découvrir l'abonnement » + « Continuer » ; abonné (mock) → « Continuer » seul.

### F3 — Onglet Toile

- **Étapes** : ouvrir l'onglet Toile après J15.
- **Attendu** : toile 8 branches visible, tap sur une branche → détail. En Phase 0+S0, les branches reflètent l'état initial (pas encore d'évaluations).

### F4 — Absence prolongée traversant la transition (D25)

- **Départ** : état J14 validé, puis « +4j » d'un coup (on « revient » à J19 sans avoir ouvert l'app).
- **Attendu** : les écrans narratifs se jouent **un par lancement**, dans l'ordre : 1ère ouverture → S0.1 ; fermer/rouvrir → S0.2 ; rouvrir → suite normale (paywall à J17+ si non abonné). Pas d'enchaînement de 3 modales dans la même session.
- **Nettoyage** : SQL § 0.4 + Reset clock.

---

## Bloc G — J17 : paywall et Phase 1 (S1 Respiration)

### G1 — Paywall à J17 sans abonnement

- **Départ** : compte non abonné, arrivé à J17 (suite du F2 avec +1j).
- **Attendu** : l'app est **bloquée** sur l'écran paywall (plein écran, pas d'accès aux onglets). CTA « Continuer mon parcours » (ouvre la page d'abonnement web — **ne pas aller au bout du paiement**, c'est le test de demain) et « Plus tard ». Pas de prix affiché dans l'app, pas des mots « payer/abonnement » sur les CTA (règles Apple).
- **Vérifier** : « Plus tard » — observer où il mène (l'utilisateur reste bloqué hors Phase 1, c'est le comportement attendu tant que non abonné).

### G2 — Déblocage par abonnement simulé

- **Étapes** : activer « Mock active subscription » dans Profil (il faut y accéder AVANT J17, ou via l'état où le paywall permet le retour — sinon poser le mock avant d'avancer le temps).
- **Attendu** : à J17 abonné, plus de paywall ; le hub Phase 1 s'affiche et le pilier **S1 Respiration démarre automatiquement**.

### G3 — Évaluation initiale S1 (12 questions)

- **Attendu** : parcours de 12 questions, échelle 1 à 5, indicateur de progression 12 segments. À la fin : écran récap avec score, niveau diagnostic, proposition de niveau d'engagement (durée cohérence cardiaque 5/10/20 min), vidéo d'intro pilier. On peut choisir son niveau puis démarrer la semaine.

### G4 — Sessions quotidiennes (3/jour) + niveau adaptatif

- **Attendu** : hub Phase 1 avec 3 sessions (matin/midi/soir) ; ouvrir une session → cercle de respiration animé (durée selon le niveau choisi) ; à la fin, modale « Moins / Pareil / Plus » (le choix ne change PAS le niveau d'entrée, il s'applique à la pratique — D31). Le check quotidien Phase 1 se valide à **1 session sur 3 minimum**, sans soft-rappel.
- **Vérifier** : valider un jour Phase 1 avec 1 session → streak +1.

### G5 — Éval finale S1 (J7 du pilier)

- **Départ** : snapshot **« S1 J7 avant éval finale »**.
- **Attendu** : carte/CTA éval finale visible ; refaire les 12 questions → récap final avec comparaison avant/après et mise à jour de la branche Respiration sur la toile (onglet Toile : la branche a bougé).

### G6 — (Bonus si le temps) Transition S1 → S2 et toile multi-branches

- Snapshots « S2 J1 (S1 prefilled) » et « S4 J1 (S1-S3 prefilled) » : vérifier la transition de pilier et la toile avec plusieurs branches peuplées.
- **Nettoyage bloc G** : « (DEV) Reset complet » + désactiver le mock subscription + SQL § 0.4.

---

## Bloc H — Vidéos en panne (audit M4)

### H1 — Vidéo indisponible + re-tentative

- **Départ** : n'importe quel écran avec vidéo (charnière J7, S0.1, paywall…). Activer le **mode Avion** AVANT de lancer la vidéo.
- **Étapes** : taper play.
- **Attendu** : spinner blanc, puis au plus tard après 12 secondes : overlay « **Vidéo indisponible** / Vérifie ta connexion, puis touche pour réessayer. ». Pas de plein écran figé, pas de spinner infini.
- **Étapes suite** : couper le mode Avion, toucher la zone vidéo.
- **Attendu** : la vidéo repart normalement (re-tentative par remount).
- **Variante** : couper le réseau PENDANT la lecture → pas de blocage définitif de l'app.

---

## Bloc I — PWA, retour premier plan, multi-contexte

### I1 — Installation PWA sur l'écran d'accueil

- **Étapes** : Safari → partager → « Sur l'écran d'accueil » → ouvrir depuis l'icône.
- **Attendu** : icône Raw Adventure correcte, app en plein écran sans barre Safari (mode standalone), fond/thème aux couleurs de la marque, orientation portrait. Le login fonctionne dans la PWA.
- **Rappel** : la PWA a son propre stockage → écrans narratifs revus + re-login nécessaire la première fois. Accepté V1.

### I2 — Recalcul du jour au retour au premier plan (audit M1)

- **Test réaliste** (à programmer un soir) : laisser la PWA ouverte en arrière-plan avant minuit ; après minuit, revenir sur l'app SANS la tuer.
- **Attendu** : le hub bascule seul sur le nouveau jour (JN+1, coches vierges) sans recharger la page. La cohérence calendaire traite le jour d'avant s'il n'était pas validé (joker/cassure, cf. Bloc D).
- **Variante rapide** : changer la date du téléphone est déconseillé (fausse Supabase) — préférer le vrai passage de minuit ou le clock offset DEV.

### I3 — Rafraîchissement / perte réseau générale

- **Étapes** : recharger la PWA en plein parcours ; couper le réseau puis naviguer entre les onglets.
- **Attendu** : pas d'écran blanc définitif ; au retour du réseau, l'app se resynchronise. Noter tout état bizarre.

---

## Bloc J — Notifications

### J1 — Permission et planification

- **Étapes** : observer si/quand l'app demande la permission de notifications (au premier lancement du hub).
- **Attendu théorique** : notifications locales Phase 0 = 2/jour (matin 7h, rappel soir 20h annulé si au moins une action cochée), silence 22h-7h.
- **⚠️ Zone grise connue** : les notifications sont implémentées avec expo-notifications, pensé pour iOS/Android natif. Sur **PWA iOS**, le support des notifications web est limité (iOS 16.4+, et la planification locale peut ne pas fonctionner du tout). **Le but de ce test est de CONSTATER le comportement réel** : permission demandée ou pas, notification reçue le lendemain matin ou pas. Documenter le résultat — si rien n'arrive sur PWA, c'est une limite technique à acter (pas un bug de logique), et il faudra décider quoi dire aux testeurs.

---

## Bloc K — Checks finaux AVANT d'ouvrir aux testeurs

- [ ] **K1 — Désactiver le panneau DEV en prod.** Si `EXPO_PUBLIC_ENABLE_DEV_PANEL=true` est posé sur Vercel pour cette salve, le **retirer et redéployer** avant d'envoyer le lien aux testeurs — sinon ils auront accès au Reset complet, aux snapshots et au mock d'abonnement. Vérifier ensuite sur l'app : Profil sans panneau DEV.
- [ ] **K2 — Re-nettoyage SQL** de tous les comptes de test (jours futurs, § 0.4) et suppression des comptes jetables (Supabase Auth → Users).
- [ ] **K3 — Quota emails** : estimer le nombre de testeurs × 1-2 OTP chacun vs 50/h et 100/jour (Resend gratuit). Au-delà de ~30 testeurs le même jour, risque de plafond — étaler les invitations.
- [ ] **K4 — Passer une dernière fois le flow compte neuf** (A1→B2) sur la prod re-déployée, sans outils DEV.
- [ ] **K5 — Brief testeurs** : leur dire que la Phase 1 nécessite un abonnement (bloqué à J17), que certains textes portent la mention `[copy à valider]`, et comment remonter un bug (capture + heure + ce qu'ils faisaient).

---

## Zones connues — ne pas les compter comme bugs

1. **Flags narratifs liés à l'appareil/navigateur** : vidéo J1, charnières, S0.1/S0.2 « vus » sont stockés localement. Changement d'appareil, bascule Safari↔PWA, ou nettoyage du site → ces écrans se rejouent. Accepté V1.
2. **`[copy à valider]`** visibles en prod sur ~7 écrans (charnières J7/J14, S0.1, S0.2, messages joker/cassure, paliers, écrans S8/consolidation/mentorat). En attente du Brief contenu Mimi & Jacky. Les testeurs les verront.
3. **Récupération de compte en Phase 1** : le pilier en cours est stocké localement. Un utilisateur Phase 1 qui change d'appareil retombe au début de S1 (ses évaluations/sessions passées restent en base). Chantier séparé documenté, hors V1.
4. **Titre du soft-rappel « Tu peux faire mieux. »** : à faire relire par Mimi & Jacky sous l'angle « non-culpabilisant » (D26) — observation copy, pas un bug fonctionnel.
5. **Plage de silence notifications 22h-7h dans le code** (D32 dit 22h-8h) : écart assumé dans le code (« attraper les français qui se lèvent 6h-7h ») — à confirmer comme choix ou à réaligner, mais pas bloquant pour la salve.
6. **Description du preset DEV « P0 J7 » mentionnant un palier 7j** : obsolète (paliers = 15/30/60/100/365). Cosmétique DEV uniquement.
7. **Stripe/paiement réel** : volontairement hors salve — vérification dédiée demain.

---

## Modèle de compte-rendu par test

| ID | OK / KO / Non testé | Notes (ce qui s'est passé, capture) |
|---|---|---|
| A1 | | |
| A2 | | |
| … | | |

*Fin du document. Estimation : 1 grosse demi-journée pour les blocs A-G, plus les tests « passage de minuit » (I2) et « notification du lendemain » (J1) qui s'étalent sur 24h.*

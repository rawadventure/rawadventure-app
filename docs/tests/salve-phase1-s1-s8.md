# Salve de tests — Phase 1, contenu des semaines S1 → S8

*Version 1.0 — 8 septembre 2026. À dérouler sur iPhone, Safari + PWA installée, sur https://app.rawadventure.world (prod), compte **+demo3**. Objectif : vérifier que le contenu des 8 semaines est bon pour l'utilisateur (questions, diagnostics, programme des 7 jours, vidéos, ton), en plus de finir la mécanique Phase 1. Principe acté avec Stéphane : la **mécanique** est testée à fond une seule fois, sur S1 (bloc M) ; le **contenu** est testé huit fois, un bloc par pilier (C1 → C8), en parcours allégé. Document jumeau : `docs/contenu/arbitrages-et-demandes-phase1.md` (où consigner ce qui doit être tranché ou envoyé à Jacky & Mimi).*

## État de départ (au 8 septembre 2026)

**Déjà validé par la salve pré-testeurs (ne pas re-tester)** : blocs A→F (Phase 0 complète, S0.1/S0.2, D30, D38), G1-G3 (paywall J17, déblocage, éval initiale S1 — G3 validé le 4 sept), H (vidéos en panne), bloc S (Stripe avec Mimi, 7-8 sept). Le lecteur vidéo est validé.

**Reste hérité de l'autre salve** : G4 (sessions + adaptatif — entamé le 4 sept), G5 (éval finale S1), G6 (transition S1→S2). Ils sont repris et approfondis ici dans le bloc M — la salve pré-testeurs peut marquer G4-G6 « repris par salve Phase 1 ».

**Comptes** : **+demo3** = cette salve (abonnement déjà posé en base). +demo2 = réservé Claude. +demo4 = a servi au bloc S, ne pas réutiliser avant le nettoyage K2. +test1 = libéré, à supprimer en K2.

**Prérequis technique** : les 5 nouveaux presets DEV (S3, S5, S6, S7, S8 « J1 fresh ») doivent être **déployés** avant de commencer — vérifier dans Profil → DEV Timeline que la liste montre bien un « Aller » par pilier de S1 à S8 (faire **R3** après le déploiement annoncé par Claude).

## Refresh du cache — échelle R0-R4

Identique à la salve pré-testeurs. Chaque test porte un champ **Refresh** à appliquer AVANT les étapes.

| Niveau | Geste | Ce que ça recharge | Ce que ça garde |
|---|---|---|---|
| **R0** | Rien — on continue dans la session ouverte | — | Tout |
| **R1** | Recharger la page (Safari : ↻ ; PWA : passer par R2) | Contexte JavaScript | AsyncStorage, session |
| **R2** | Fermer COMPLÈTEMENT l'app puis rouvrir | Contexte JS + boot complet (cohérence calendaire, load Supabase) | AsyncStorage, session |
| **R3** | Après chaque déploiement : R2, vérifier qu'un changement attendu est visible, sinon re-fermer/rouvrir une 2e fois | Le bundle JS lui-même | AsyncStorage, session |
| **R4** | Réinstaller la PWA / vider les données de site | TOUT — état vierge | Rien : détruit AsyncStorage. Réservé « compte neuf » |

Règles : R3 obligatoire après déploiement ; Safari et PWA = deux stockages séparés ; dans le doute, R2 avant de conclure à un bug.

## Rappels du modèle et pièges DEV (à lire avant le bloc M)

- **D38** : position = jours validés + 1, n'avance qu'à la validation ; streak = calendaire réel. En Phase 1, même logique par pilier : `dayInPillarWeek` = jours validés du pilier + 1. Validation Phase 1 = **1 session sur 3 minimum**, pas de soft-rappel. Le joker hebdomadaire (lundi-dimanche) continue de s'appliquer en Phase 1.
- **D31** : le choix « Moins / Pareil / Plus » en fin de session ne change PAS le niveau d'entrée — adaptation de la pratique seulement.
- **Piège DEV n°1** : chaque snapshot « Aller » écrase TOUTES les données du compte et **réinitialise l'abonnement mocké**. Si le paywall réapparaît après un snapshot : reposer l'abonnement de +demo3 **directement en base Supabase** (le « Mock active subscription » ne survit pas au reload sur un compte connecté — bug DEV n°2).
- **Piège DEV n°2** : le clock offset écrit en base des entrées à dates futures → nettoyage SQL § 0.3 après chaque usage.
- **Piège DEV n°3** : le pilier en cours et les flags narratifs sont **locaux** (AsyncStorage). Ne pas changer de navigateur (Safari ↔ PWA) au milieu d'un pilier : retour au début de S1 garanti. Toute la salve dans le MÊME contexte.

---

## 0. Avant de commencer

### 0.1 Matériel et accès

- iPhone, PWA installée (ou Safari — mais un seul des deux pour toute la salve).
- Dashboard Supabase (projet `aknvitrtfxqjdwiyxryt`) → SQL Editor.
- Ce document + le doc jumeau d'arbitrages ouverts côte à côte : la salve produit surtout des **annotations de contenu**.

### 0.2 Les presets DEV de cette salve

| Preset | Pose quoi |
|---|---|
| S1 J1 fresh / S1 J3 mid / S1 J7 avant éval finale | Points d'entrée mécanique S1 (bloc M) |
| S2 J1 (S1 prefilled) | Bloc C2 |
| **S3 J1 (S1-S2 prefilled)** — nouveau | Bloc C3 |
| S4 J1 (S1-S3 prefilled) | Bloc C4 |
| **S5 J1 (S1-S4 prefilled)** — nouveau | Bloc C5 |
| **S6 J1 (S1-S5 prefilled)** — nouveau | Bloc C6 |
| **S7 J1 (S1-S6 prefilled)** — nouveau | Bloc C7 |
| **S8 J1 (S1-S7 prefilled)** — nouveau | Bloc C8 |
| S8 J7 avant éval finale / Post-S8 consolidation | Bloc P |

Chaque « SN J1 » préremplit les piliers précédents (évals + sessions placeholder) : la toile montre N−1 branches peuplées, le hub démarre le pilier N au jour 1, éval initiale non faite.

### 0.3 Nettoyage SQL

Après tout test ayant utilisé le clock offset ou un snapshot (remplacer `$uid` par l'id de +demo3, Auth → Users) :

```sql
DELETE FROM streak_history      WHERE user_id = '$uid' AND local_date > CURRENT_DATE;
DELETE FROM joker_consumptions  WHERE user_id = '$uid' AND consumed_for_local_date > CURRENT_DATE;
DELETE FROM pillar_sessions     WHERE user_id = '$uid' AND local_date > CURRENT_DATE;
```

Puis DEV Timeline → « Reset » (clock offset à 0).

### 0.4 Ordre recommandé

1. **Bloc M** (mécanique S1, reprend G4-G6) en menant le **C1** (contenu S1) en même temps — même parcours, deux regards.
2. **C2** (S2 Activité physique) en premier des contenus : c'est le pilier le plus fragile (100 % inféré par Claude, jamais validé Jacky).
3. **C3 → C8** dans l'ordre, une à deux sessions de ~30-45 min chacune.
4. **Bloc P** (éval finale S8, sortie, consolidation, mentorat).
5. Report des annotations dans le doc d'arbitrages, puis session Jacky.

---

## Grille de lecture contenu (commune aux blocs C1 → C8)

Pour chaque pilier, noter chaque rubrique **OK / à retoucher / à réécrire**, avec le détail en notes. Les questions à se poser :

- **Vidéo d'intro** (sur la vue d'ensemble du pilier) : c'est la bonne vidéo ? Elle parle bien de CE pilier ? *(Contrôle spécifique : le brief de tournage utilisait un ancien ordre des piliers — un doute existe sur le mapping des vidéos S2/S3/S4/S7 notamment. Regarder les 20 premières secondes de chacune.)*
- **Les 12 questions** : compréhensibles seul, sans réfléchir (principe 1) ? Discriminantes (est-ce qu'un utilisateur moyen répondrait autre chose que 3 partout) ? Ton Mimi & Jacky (tutoiement, pas de jargon, pas de wellness creux) ? *(Attention particulière S4/S5/S7/S8 : formulations courtes reprises de la matière Jacky brute.)*
- **Les 5 diagnostics** : répondre une première fois « profil bas » (1-2 partout, en tenant compte des questions inversées), noter le diagnostic obtenu (label + message) ; refaire l'éval en « profil haut » (4-5 partout) et noter l'autre extrême. Les deux textes sont-ils justes, incarnés, non culpabilisants ? *(S1 : les 5 messages portent `[copy à valider]` — c'est connu, juger le fond quand même.)*
- **Le programme des 7 jours** : parcourir les 7 cartes (titre / objectif / pédagogie). Progression logique ? Chaque jour apporte quelque chose ? Style mini-livre ?
- **Une session jouée** : le type de session est-il le bon (timer de cohérence cardiaque S1 ; chrono libre S2/S4/S6 ; acte libre S3/S5/S7/S8) ? La durée proposée est-elle crédible pour ce pilier ? *(S3/S5/S7/S8 affichent les durées héritées de S1 (5/10/20 min) faute de calibrage propre — noter si ça choque.)*
- **Le niveau d'engagement** (Essentiel / Progression / Immersion) : le libellé et la recommandation sont-ils clairs ?

---

## Bloc M — Mécanique Phase 1, à fond sur S1 (reprend G4-G6)

### M1 — Éval initiale S1 — ✅ déjà validé (G3, 4 sept)

Ne pas rejouer pour la mécanique. La partie CONTENU de l'éval S1 se fait au C1.

### M2 — Sessions quotidiennes 3/jour + niveau adaptatif (ex-G4)

- **Refresh** : R2. **Départ** : snapshot « S1 J3 mid » (session du matin déjà validée) ; reposer l'abonnement en base si paywall (piège DEV n°1).
- **Étapes** : ouvrir les sessions midi et soir l'une après l'autre. Dans une session : suivre le cercle de respiration jusqu'au bout ; dans l'autre : tester la modale « Moins / Pareil / Plus ».
- **Attendu** : 3 cartes matin/midi/soir, état « fait/à faire » correct ; timer conforme au niveau choisi (5/10/20 min) ; fin de session silencieuse (retour hub, carte cochée) ; le choix adaptatif ne change PAS le niveau d'entrée (D31) — vérifier que le badge niveau de la vue d'ensemble n'a pas bougé.
- **Vérifier aussi** : jour validé dès 1 session (streak +1 au lendemain), pas de soft-rappel Phase 1.

### M3 — Streak et joker en Phase 1

- **Refresh** : R0 (enchaîner). **Départ** : sortie M2, jour validé.
- **Étapes** : « +1j », rouvrir, ne rien valider, « +1j », rouvrir.
- **Attendu** : message joker (« Streak conservé… Tu reprends au jour X ») à la première ouverture ; position du pilier inchangée (D38 : `dayInPillarWeek` ne bouge pas sans validation). Deuxième jour manqué même semaine → cassure, streak 0, position toujours inchangée.
- **Nettoyage** : SQL § 0.3 + Reset clock.

### M4 — Éval finale J7 + mise à jour de la branche (ex-G5)

- **Refresh** : R2 après snapshot. **Départ** : snapshot « S1 J7 avant éval finale » (+ abonnement en base si besoin).
- **Étapes** : carte/CTA éval finale → refaire les 12 questions avec des réponses meilleures qu'à l'initiale → récap final.
- **Attendu** : récap avec comparaison avant/après ; onglet Toile → la branche Respiration a bougé. Contre-test : des réponses PIRES qu'à l'initiale → le récap doit rester juste et non culpabilisant (noter le texte obtenu — c'est un des messages `[copy à valider]`).

### M5 — Transition S1 → S2 (ex-G6)

- **Refresh** : R0. **Départ** : sortie M4, éval finale S1 faite.
- **Étapes** : « +1j », rouvrir le hub.
- **Attendu** : le pilier S2 démarre (vue d'ensemble S2 → éval initiale S2 proposée) ; la toile garde la branche S1 peuplée ; streak continu.
- **Nettoyage** : SQL § 0.3 + Reset clock.

---

## Blocs C1 → C8 — Contenu, un bloc par pilier

*Chaque bloc suit le même déroulé (~30-45 min). Compte +demo3, **Refresh R2 après le snapshot**, abonnement à reposer en base si le paywall réapparaît. Nettoyage en fin de bloc : SQL § 0.3 si clock utilisé. Annoter la grille de notation en fin de document au fur et à mesure.*

**Déroulé-type** : snapshot « SN J1 » → vue d'ensemble du pilier : regarder la **vidéo d'intro** (bon sujet ?) et lire le **programme 7 jours** → lancer l'**éval initiale** en « profil bas » → noter le diagnostic + message → lire la proposition de **niveau d'engagement** → jouer **une session** → refaire le snapshot → éval en « profil haut » → noter l'autre diagnostic. Remplir la grille.

### C1 — S1 Respiration (à mener avec le bloc M)

- Spécifique : les 5 messages diagnostic sont en `[copy à valider]` — juger le fond, la version propre passera par Jacky. Timer cohérence cardiaque 5/10/20 : vérifier le confort réel du cercle animé sur la durée choisie.

### C2 — S2 Activité physique — LE PLUS FRAGILE, à faire en premier

- Spécifique : 12 questions et 5 diagnostics **entièrement inférés par Claude** depuis la matière Jacky brute, jamais validés. Lecture ligne à ligne. Chrono libre 30/45/60 min : durées crédibles ?
- Toute question douteuse part directement dans la liste Jacky (doc jumeau, priorité 1).

### C3 — S3 Alimentation

- Spécifique : questions inversées Q4/6/8/10/12 (conforme à la matière Jacky — vérifier que le « profil bas » donne bien un diagnostic bas malgré les inversions). Acte libre : durées héritées de S1 affichées ? Gênant ou invisible ?

### C4 — S4 Connexion au vivant

- Spécifique : formulations de questions courtes/génériques — discriminantes ou pas ? Chrono libre 5/20/45 min.
- Vidéo d'intro : point de contrôle mapping (l'ancien ordre appelait « S4 Condition physique »).

### C5 — S5 Repos & régénération (type B)

- Spécifique : pilier atypique (D41). Questions inversées Q3/4/5/6/10. Formulations courtes. Acte libre + durées S1 héritées.

### C6 — S6 Passion et chemin de vie

- Spécifique : sujet le plus « intérieur » — les questions tiennent-elles sans tomber dans le développement personnel creux (principe 6) ? Chrono libre 15/30/60 min.

### C7 — S7 Mindset (type B)

- Spécifique : programme progressif en 3 phases — la progression des 7 jours est-elle lisible ? 6 questions inversées (Q2/3/4/7/8/11) : vérifier profil bas/haut avec soin. Formulations courtes.
- Vidéo d'intro : point de contrôle mapping (l'ancien ordre appelait « S7 Connexion au vivant »).

### C8 — S8 Élimination & détox

- Spécifique : sujet délicat côté ton (pas de promesse détox marketing — principe 6). Toile à 7 branches au démarrage : lisibilité du graphique quasi complet.

---

## Bloc P — Sortie de S8 et consolidation

### P1 — Éval finale S8 + sortie (IA-22)

- **Refresh** : R2 après snapshot. **Départ** : snapshot « S8 J7 avant éval finale ».
- **Étapes** : éval finale S8 → récap → écran de sortie S8.
- **Attendu** : célébration sobre de la traversée (8 semaines), toile 8 branches complète, pas de hard-sell. Mentions `[copy à valider]` attendues — noter le fond.

### P2 — Consolidation libre + proposition mentorat (IA-23, IA-60)

- **Refresh** : R2 après snapshot. **Départ** : snapshot « Post-S8 consolidation libre ».
- **Étapes** : parcourir l'intro consolidation, le hub en mode libre (re-parcourir un pilier au choix), la proposition de mentorat.
- **Attendu** : mode libre navigable (choix d'un pilier, sessions rejouables), proposition mentorat présente sans pression (D9), abonnement présenté comme valeur maintenue.
- **Nettoyage fin de salve** : SQL § 0.3, Reset clock, et remettre +demo3 dans un état connu (noter lequel dans le compte-rendu).

---

## Zones connues — ne pas les compter comme bugs

1. `[copy à valider]` visibles sur les écrans Phase 1 (récap final, S8/consolidation/mentorat, diagnostics S1) — c'est précisément ce que cette salve consolide pour Jacky & Mimi.
2. Les snapshots réinitialisent l'abonnement mocké → reposer en base (bug DEV n°2, consigné).
3. Pilier en cours et flags narratifs locaux : changement de navigateur = retour début S1. Rester dans un seul contexte.
4. Blocage ponctuel du récap d'éval (une occurrence le 7 sept, non reproduit) : si ça se reproduit, noter l'enchaînement exact avant le R2.
5. Niveau non modifiable depuis la vue d'ensemble (IA-42) : passage par le récap ou la session — accroche UX connue.
6. Durées 5/10/20 affichées sur S3/S5/S7/S8 : défaut hérité de S1, pas un bug — c'est un point d'arbitrage (doc jumeau).
7. Évaluations préremplies par les snapshots : les piliers antérieurs montrent des scores placeholder (36/60 initial, 48/60 final, niveau 3→4 partout) — normal en test, pas représentatif.

---

## Compte-rendu

### Tests mécanique

| ID | OK / KO / Non testé | Notes |
|---|---|---|
| M2 | | |
| M3 | | |
| M4 | | |
| M5 | | |
| P1 | | |
| P2 | | |

### Grille contenu (OK / à retoucher / à réécrire)

| Pilier | Vidéo intro (bon sujet ?) | 12 questions | Diagnostics (bas / haut) | Programme 7 jours | Session (type + durées) | Notes |
|---|---|---|---|---|---|---|
| C1 S1 Respiration | | | | | | |
| C2 S2 Activité physique | | | | | | |
| C3 S3 Alimentation | | | | | | |
| C4 S4 Connexion au vivant | | | | | | |
| C5 S5 Repos & régénération | | | | | | |
| C6 S6 Passion | | | | | | |
| C7 S7 Mindset | | | | | | |
| C8 S8 Élimination & détox | | | | | | |

*Fin du document. Estimation : bloc M + C1 = une demi-journée ; C2 = 1h (lecture fine) ; C3-C8 = 30-45 min chacun ; bloc P = 45 min. Total réaliste : 2 à 3 demi-journées, séquençables librement (chaque bloc C est autonome grâce à son snapshot).*

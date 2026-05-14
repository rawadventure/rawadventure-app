# Raw Adventure App — Synthèse des décisions V8.1

*Document de référence — registre des décisions produit prises pour la V1 de l'app. À lire avant toute nouvelle session de travail. Mis à jour à chaque arbitrage.*

*Note V8.1 du 13 mai 2026 — patch en sortie de production de la Feature Spec S1 Respiration.* Aucune nouvelle décision structurelle D42+. Six patches groupés ont été propagés en sortie de production : Métriques V1.4 → V1.5 (recalibrage paramètre principal S1 à 5/10/20 min), Schéma de données V1.0 → V1.1 (ajout table `notifications_sent`, vérification du champ `duration_seconds`), Customer Journey V1.2 → V1.3 (migration ordre D8 obsolète → D39), Feature Spec V1 Socle minimum V1.1 → V1.2 (acte le statut du joker hebdomadaire en Phase 1 sur la même logique qu'en Phase 0), CLAUDE.md du repo (référence à la Feature Spec S1 stable comme pilier-pattern Type A), et la Feature Spec S1 elle-même qui passe en V1.0 stable. Les choix spécifiques au pilier S1 (5/10/20 min, 3 sessions/jour, Option A retenue pour la gamification, inversion sémantique Q6/Q7/Q8) sont des spécifications de pilier, pas des décisions produit transverses, et restent dans la Feature Spec S1.

---

## Comment lire ce document

Ce doc liste les décisions tranchées et reportées pour la V1 de Raw Adventure App. Chaque entrée précise la date, l'auteur de la décision, le contexte qui l'a motivée, et l'impact sur les autres documents du Project.

Deux statuts possibles :

- **Tranché** : la décision est prise, elle s'applique, elle est reflétée dans les docs concernés (Product Vision v2.2, Customer Journey V1.2, Information Architecture V1, Feature Spec V1 Socle minimum, Métriques V1 V1.4, CLAUDE.md du repo).
- **Reporté** : la décision n'est pas urgente, sera traitée à un livrable ultérieur (Feature Spec dédiée par pilier, Brief contenu V1, V2 sur la base de l'analyse des cohortes V1).

Le périmètre couvert : V1 de l'app (Phase 0 = 14 jours gratuits, S0 = transition de 2 jours gratuits, Phase 1 = 8 semaines payantes, sortie de S8). Les phases 2 et 3 sont hors scope.

**État au 12 mai 2026 (V8) : toutes les décisions structurelles sont tranchées et Métriques V1.4 est publiée comme point stable final.** Les décisions transverses du Socle minimum (D23 à D33) sont actées. Les décisions issues de l'audit V0 vs docs fondateurs (D34 à D37, plus modifications de D6 et D31) sont actées. Les décisions issues des sessions Jacky du 8 mai et de la relecture solo du 9 mai (D38, D39) sont actées. Les décisions issues de la session Jacky du 12 mai (D40, D41) sont actées et intégrées dans Métriques V1.4. Les décisions reportées concernent l'exécution fine (calcul de score, formulations exactes, timing de notifications) et seront traitées dans les livrables techniques à venir (Feature Specs piliers, Brief contenu V1).

**Note sur la nomenclature D39.** La D39 succède à la D8 du 3 mai 2026 (ordre canonique des piliers) qui devient obsolète. La numérotation reste cumulative — D8 reste référencée dans les versions historiques mais l'ordre canonique opérant en V1 est désormais D39.

---

## Décisions tranchées

### D1 — S0 de transition entre Phase 0 et Phase 1
**Date :** 2 mai 2026 — **Auteur :** Stéphane

**Décision :** Insertion d'un bloc S0 de transition, durée 2 jours (actée par D17), dans le périmètre gratuit, entre J14 et S1. Il fait le pont narratif entre la Phase 0 (multi-piliers parallèle) et la Phase 1 (mono-pilier focus). Il introduit la roadmap des 8 semaines et présente la toile d'araignée du score de vitalité.

**Contexte :** Le saut sec J14 → S1 changeait radicalement l'UX (de checklist 6 piliers à 3 sessions ciblées + évaluation 12 questions) sans transition. Cliff cognitif identifié comme risque produit majeur dans le Customer Journey V1.

**Impact docs :** Product Vision v2.2 mis à jour. Customer Journey V1.2 acte le S0 (sections 4 et 5). Information Architecture V1 documente les écrans S0.1 et S0.2.

---

### D2 — Toile d'araignée comme score de vitalité V1
**Date :** 2 mai 2026 — **Auteur :** Stéphane

**Décision :** Le score de vitalité V1 est implémenté sous forme de graphique en toile d'araignée à 8 branches, une par pilier de Phase 1. Chaque branche évolue en fonction des évaluations initiale et finale du pilier correspondant.

**Contexte :** Le Product Vision parlait de "score de vitalité simple et lisible" sans préciser la forme. La toile d'araignée réconcilie la vue agrégée demandée par la vision avec la logique d'isolation des piliers du Cadrage. Elle donne aussi une raison narrative à la Phase 1 (l'utilisateur voit la branche travaillée grandir pendant que les autres restent stables).

**Impact docs :** Product Vision v2.2 mis à jour. Métriques V1 (doc à venir) — détail du calcul de chaque branche, pondérations, mise à jour.

**Point d'attention :** le calcul précis (entrée, mise à jour hebdomadaire, pondération du ressenti vs pratique) sera traité dans le doc Métriques V1.

---

### D3 — Conversion non-concentrée sur J15
**Date :** 2 mai 2026 — **Auteur :** Stéphane

**Décision :** L'abonnement est accessible à tout moment dans l'app via un bouton discret, visible dès J3. Le J15 conserve sa fonction d'écran narratif de palier (célébration des 14 jours + révélation du S0 et de la roadmap), pas de paywall.

**Contexte :** La concentration de la conversion sur J15 ratait Isabelle (qui veut s'abonner plus tôt) et stressait Caroline (qui n'est pas prête à décider sous pression).

**Impact docs :** Product Vision v2.2 mis à jour. Customer Journey V1.2 acté (section 4). Feature Spec — refonte du ConversionScreen actuel.

---

### D4 — Personnalisation Option B + Niveau adaptatif manuel
**Date :** 2 mai 2026 (Option B) + 3 mai 2026 (niveau adaptatif) — **Auteur :** Stéphane + Jacky

**Décision :** Deux mécaniques coexistantes.

**Option B — calibrage du niveau de départ.** Le profil dynamique calculé en sortie d'onboarding (8 profils possibles) sert à personnaliser le niveau de départ par pilier en Phase 0. En Phase 1, une mini-évaluation à l'entrée de chaque pilier calibre aussi le niveau de départ. Le contenu pédagogique reste identique pour tous, seul varie le niveau d'intensité d'entrée.

**Niveau adaptatif manuel.** En cours de pratique (Phase 0 et Phase 1), l'utilisateur peut moduler manuellement l'intensité de ses sessions via un bouton simple "moins / pareil / plus" sans abandonner sa routine. L'Option B fixe le point de départ, le niveau adaptatif permet l'ajustement en cours. Principe pédagogique porté par Jacky : "mieux vaut faire moins que craquer".

**Contexte :** Sans niveau adaptatif, les utilisateurs qui ont une baisse de régime craquent et abandonnent. Sans Option B, les profils avancés s'ennuient en J1. Les deux mécaniques sont nécessaires et complémentaires. La version automatique (l'app détecte des signaux et propose) est trop coûteuse pour la V1.

**Impact docs :** Product Vision v2.2 mis à jour. Feature Spec — logique de mapping profil → niveau d'entrée + UI du bouton moins/pareil/plus. Brief contenu V1 — modulation du niveau de départ et copy des messages d'ajustement.

**Point d'attention :** le mapping précis (quel profil → quel niveau d'entrée par pilier) sera défini en Feature Spec avec Mimi & Jacky.

---

### D5 — Toile d'araignée masquée en Phase 0, révélée au S0
**Date :** 2 mai 2026 — **Auteur :** Stéphane

**Décision :** La toile d'araignée n'est pas affichée pendant la Phase 0. Elle est révélée au moment du S0, comme moment narratif fort. La Phase 0 reste centrée sur la pratique des 6 piliers et la lecture du corps, sans surcharge cognitive d'un score à interpréter.

**Contexte :** Argument de Stéphane : "si les utilisateurs n'arrivent pas au bout des 14 jours, il vaut mieux retravailler la conversion des 14 jours plutôt que de donner de la confiture aux cochons." Réserver la révélation au S0 en fait un palier narratif fort, déclencheur potentiel de conversion.

**Impact docs :** Product Vision v2.2 mis à jour. Customer Journey V1.2 acté (section 7). Feature Spec — l'introduction de la toile d'araignée fait partie du flow S0.

---

### D6 — Streak avec joker hebdomadaire et seuils de validation
**Date :** 2 mai 2026 (joker) + 3 mai 2026 (seuils initiaux) + 7 mai 2026 (modification du seuil Phase 0) — **Auteur :** Stéphane + Jacky

**Décision :** Trois règles articulées.

**Joker hebdomadaire.** 1 jour "raté" par semaine ne casse pas le streak. Au-delà, le streak est cassé et redémarre.

**Seuil de validation Phase 0.** La journée est validée pour le streak si l'utilisateur a coché **au moins 5 actions sur 7**. Sous le seuil, le joker est consommé. Pas de joker dispo = cassure. Le principe pédagogique "on veut qu'ils fassent l'expérience complète des 7 actions" reste porté par le copy et les notifications, pas par la sanction de streak. Mimi & Jacky encouragent les 7 actions sans casser le streak en cas de 5 ou 6.

**Seuil de validation Phase 1.** La journée est validée pour le streak si l'utilisateur a fait **au moins 1 session sur les 3 prévues** dans la journée. Rappel pédagogique porté par Jacky : "mieux vaut 3 petites sessions que 1 grosse" — la fréquence prime sur la durée. En cas de baisse de régime, le niveau adaptatif manuel (D4) permet de réduire l'intensité plutôt que d'abandonner.

**Contexte :** Un système de streak punitif (cassure à la première journée incomplète) précipite l'abandon, surtout pour Caroline. La logique du joker + seuil bas mais réel permet une régularité réaliste sans détruire la mécanique d'engagement.

**Modification du 7 mai 2026 (audit V0 vs docs fondateurs).** Le seuil Phase 0 initial de 4/6 a été modifié en **5/7** suite à la décision N1 du Bonus de l'audit. Le V0 implémente 7 actions distinctes dans la checklist quotidienne (activation du matin, froid, mouvement ou récupération, minéralisation, fenêtre digestive, fruits, soirée sans écrans) — cohérent avec les briefs Phase 0 jour-par-jour de Jacky. Le décompte 5/7 (~71 %) reste cohérent avec la philosophie de tolérance "tu peux louper deux items et valider quand même". Les briefs Jacky parlant de "5 piliers" sont à harmoniser en "7 actions" ou "7 missions du jour" lors du Brief contenu V1.

**Impact docs :** Product Vision v2.2 mis à jour. Feature Spec — mécanique du streak à coder avec seuil Phase 0 5/7. IA-15 (modale validation jour) à mettre à jour pour acter le seuil 5/7. Brief contenu V1 — formulations des messages "tu as utilisé ton joker", "streak maintenu", "essaie d'ajouter une action de plus demain" + harmonisation copy "5 piliers" → "7 actions".

---

### D7 — Conversion précoce avec contenu bonus en déblocage progressif
**Date :** 3 mai 2026 — **Auteur :** Stéphane + Jacky

**Décision :** Quand un utilisateur s'abonne avant la fin de la Phase 0, il continue la Phase 0 normalement jusqu'à J14, puis fait le S0, puis attaque la S1. Pas de saut de la Phase 0.

Pendant la période d'attente entre l'abonnement et le S0, l'utilisateur a accès à un **contenu bonus Phase 1 en déblocage progressif**. Roadmap complète disponible immédiatement. Puis 1 à 2 pièces de contenu par jour : vidéos d'intro Mimi & Jacky par pilier (8 vidéos), podcasts ou audios plus longs, lectures complémentaires. Ordre du déblocage : suit l'ordre des piliers de Phase 1 (Respiration d'abord, Alimentation ensuite, etc.). Le contenu pratique de Phase 1 (sessions, évaluations, tracking) ne s'ouvre qu'au S0.

**Message porté à l'abonnement précoce :** "les 14 jours sont calibrés pour que ton corps installe les bases avant qu'on isole un pilier — tu ne perds pas de temps, tu construis."

**Contexte :** Trois options étaient en débat — saut sec en S1, conversion sans saut, conversion avec contenu bonus. Décision retenue après réunion équipe : Option 2 (avec contenu bonus). Argument pédagogique fort : la Phase 0 est une phase d'amorçage physiologique nécessaire, sauter cette phase prive l'utilisateur du bénéfice physique de l'installation des 6 piliers. Argument UX : l'utilisateur précoce a besoin de matière pour calmer son envie d'avancer.

**Impact docs :** Product Vision v2.2 mis à jour. Customer Journey V1.2 acté (section 4). Brief contenu V1 — production des vidéos d'intro Mimi & Jacky, podcasts et lectures par pilier. Feature Spec — logique de déblocage progressif et UI de la roadmap.

**Point d'attention :** le calibrage exact du rythme de déblocage (1, 1.5 ou 2 pièces par jour) et le total de contenu bonus à produire seront affinés en Feature Spec et Brief contenu.

---

### D8 — Ordre des 8 piliers de Phase 1
**Date :** 3 mai 2026 — **Auteur :** Mimi & Jacky

**Décision :** Ordre validé après réunion équipe : **Respiration → Alimentation → Mindset → Condition physique → Repos et régénération → Passion et chemin de vie → Connexion au vivant → Élimination et détox.**

**Précisions sur les choix forts :**

- **S8 sur Élimination et détox** est délibéré. C'est une détox douce (jus + psyllium), pas une cure dure. La S8 démontre que les nettoyages sont accessibles — "c'est pas si pire que ça, c'est faisable". Pas de détox hardcore en V1.
- **S6 Passion et chemin de vie** est positionné en pause réflexive entre les piliers plus hardcore. C'est un pilier soft et identitairement fort qui appartient au périmètre Brand Core (santé globale = bien-être mental inclus), pas à du développement personnel hors-scope.
- **Connexion au vivant en S7** s'incarne concrètement comme grounding et contact à la nature (arbres, potager, mer, montagne, éléments, reconnaissance des êtres vivants). Pas de registre new age années 70.
- **Le froid n'est pas un pilier autonome** de Phase 1. Il est intégré au pilier Repos et régénération (S5) principalement, et touche aussi au pilier Mindset (S3).
- **Continuité Phase 0 → Phase 1** : la pratique Phase 1 approfondit la pratique Phase 0 quand le pilier correspond (la respiration de la Phase 0 → S1 Respiration, etc.), mais les checks des habitudes Phase 0 sont retirés en Phase 1 (voir D9).

**Impact docs :** Product Vision v2.2 mis à jour. Customer Journey V1.2 mis à jour. Brief contenu V1 — planning des 8 semaines.

---

### D9 — Habitudes Phase 0 optionnelles en Phase 1
**Date :** 3 mai 2026 — **Auteur :** Stéphane + Jacky

**Décision :** Quand l'utilisateur entre en S1, on lui retire les checks des habitudes Phase 0 (eau de mer, fenêtre digestive, défi froid, soirée sans écrans). Pas de check, pas de tracking, pas d'encart "tes acquis" en arrière-plan. Posture pédagogique assumée portée par les vidéos de transition entre Phase 0 et S1 : "si tu veux les garder c'est OK, mais focus sur le pilier de la semaine, on évite la surcharge."

**Argument pédagogique de Jacky :** "14 premiers jours = challenge, 2e phase = apprentissage, nouvelles règles à suivre. Le but est d'arriver à sentir quelque chose sur un seul pilier. Ne pas mettre toujours +++. Rééduquer, aiguiser nos sens, nos sensations." C'est un principe directeur fort qui justifie le retrait — on ne désinstalle pas par négligence, on enlève par choix pédagogique pour que l'utilisateur ressente le pilier en cours sans bruit de fond.

**Contexte :** Trois options étaient en débat — disparition assumée, pilier d'arrière-plan léger, intégration au pilier en cours. Décision retenue : disparition assumée avec cadrage pédagogique. Le risque (perte du bénéfice physiologique du froid entre S1 et S5) est documenté comme point de vigilance au lancement, à monitorer.

**Impact docs :** Product Vision v2.2 mis à jour (principe directeur 8 "Ne pas mettre toujours +++" ajouté). Brief contenu V1 — vidéos de transition Phase 0 → S1 doivent porter ce message explicitement.

**Point de vigilance au lancement :** maintien spontané ou abandon massif des habitudes Phase 0 pendant la Phase 1, à observer en test utilisateur. Si abandon massif et reprise difficile en S5 (pilier Repos qui inclut le froid), ajuster en V1.5 par un mécanisme léger de rappel.

---

### D10 — Récompenses streak à 6 paliers
**Date :** 3 mai 2026 — **Auteur :** Stéphane + Jacky

**Décision :** Le streak est valorisé par 6 paliers de récompense : **7j, 15j, 30j, 60j, 100j, 1 an.** Chaque palier déclenche deux choses : un message Mimi & Jacky personnalisé par palier (pas par utilisateur — le message du 30j est le même pour tous, mais différent du message du 7j), et une **vidéo de récompense d'environ 30 secondes** par palier. Les 6 vidéos forment un chemin narratif progressif (la vidéo 30j ne ressemble pas à la 7j, chacune approfondit le propos pour ne pas être redondante).

**Statut V1 :** les 6 vidéos sont à produire avant lancement. Livrable concret pour Mimi & Jacky : 6 vidéos courtes de 30 secondes, environ une demi-journée de tournage si bien préparées.

**Contexte :** Inspiré de l'app Sadhguru "Miracle of Mind" mentionnée par Stéphane. Principe directeur : gamification légère, sans exagérer, qui valorise la régularité sans tomber dans le jeu vidéo. Pas de levels, pas d'étoiles multipliées, pas de leaderboard. Juste des paliers de streak avec récompense vidéo.

**Impact docs :** Product Vision v2.2 mis à jour. Feature Spec — UI des badges et déclenchement des vidéos. Brief contenu V1 — script et tournage des 6 vidéos par Mimi & Jacky avant lancement.

---

### D11 — Mentorat visible passif en Phase 1, actif à S8
**Date :** 3 mai 2026 — **Auteur :** Stéphane

**Décision :** Le mentorat est **visible mais passif** dans l'app de la S1 à la S7. Concrètement : un onglet "Mentorat" dans le menu, une mention dans le profil utilisateur, sans push commercial, sans notification. L'utilisateur peut s'y intéresser de lui-même.

À la fin de S8, le mentorat passe à **proposition active** avec ouverture libre vers la prise de RDV. C'est le design du tunnel de vente Raw Adventure : on prépare en V1, on convertit à la sortie de la V1.

**Contexte :** Stéphane voulait introduire le mentorat plus tôt qu'à S8. Risque identifié par Claude : si on parle du mentorat trop tôt en Phase 1, on dit implicitement "l'app ne suffit pas, prends un mentor", ce qui sape la promesse V1. Compromis retenu : présence visible mais passive (pas d'invasion) + proposition active à S8.

**Impact docs :** Product Vision v2.2 mis à jour. Customer Journey V1.2 acté (section 6). Feature Spec — UI de l'onglet Mentorat et logique d'activation à S8. Information Architecture V1 documente les écrans IA-60 et IA-61.

---

### D17 — Durée du S0 actée à 2 jours
**Date :** 5 mai 2026 — **Auteur :** Stéphane

**Décision :** Le S0 dure exactement **2 jours**. Le J1 du S0 (S0.1) célèbre les 14 jours de Phase 0 accomplis et révèle pour la première fois la toile d'araignée à 8 branches dans son état initial. Le J2 du S0 (S0.2) présente la roadmap des 8 semaines, explique le changement de mode pédagogique (multi-piliers parallèle → mono-pilier focus), et enchaîne sur l'évaluation initiale du pilier S1 Respiration. Au sortir de l'évaluation, l'utilisateur bascule sur l'accueil en mode S1 J1.

**Contexte :** La D1 laissait la durée à arbitrer entre 1, 2 ou 3 jours. Argument retenu pour le 2 jours : 1 jour est trop court pour digérer J14 + révéler la toile + introduire la roadmap des 8 semaines + faire l'évaluation initiale du pilier S1 (trop dans un seul écran), 3 jours dilue le palier narratif et risque de créer du décrochage avant l'engagement payant. 2 jours donne un rythme respirable avec deux moments narratifs distincts.

**Impact docs :** Product Vision v2.2 mis à jour. Information Architecture V1 documente les écrans IA-20 (S0.1) et IA-21 (S0.2). Brief contenu V1 — scripts vidéo Mimi & Jacky pour S0.1 et S0.2.

---

### D18 — Modèle de navigation à 3 onglets
**Date :** 5 mai 2026 — **Auteur :** Stéphane

**Décision :** L'app V1 utilise une barre d'onglets (tab bar) à **3 onglets** : Accueil, Toile, Profil. Pas de menu hamburger, pas de tiroir latéral, pas d'autre forme de navigation principale. L'onglet Accueil est le hub central, ouvert par défaut à chaque lancement. L'onglet Toile est **masqué** pendant toute la Phase 0 et apparaît au moment du S0.1 (cohérent avec D5 qui réserve la révélation de la toile au S0). L'onglet Profil est accessible dès la fin de l'onboarding.

**Contexte :** Le choix d'une nav simple à 3 onglets est cohérent avec le principe directeur 3 du Product Vision ("Simplicité extrême — toute feature qui demande plus de 30s d'explication est suspecte"). La logique de masquage de l'onglet Toile en Phase 0 sert la dramaturgie de révélation au S0 sans encombrer l'écran d'un onglet inutile pendant 14 jours.

**Impact docs :** Product Vision v2.2 mis à jour. Information Architecture V1 documente la nav globale (section 3) avec schéma SVG inline. CLAUDE.md du repo référence cette nav.

---

### D19 — Écrans de jour-charnière en Phase 0
**Date :** 5 mai 2026 — **Auteur :** Stéphane

**Décision :** Quatre jours de la Phase 0 affichent un **écran narratif spécial** qui se superpose à l'accueil au premier lancement du jour : J3, J7, J11 et J14. Ces écrans portent un message Mimi & Jacky calibré sur le moment narratif. À J3, introduction de la possibilité de s'abonner ("le bouton est là si tu veux assurer la suite"). À J7, célébration de la fin de la phase narrative 1 ("ton corps a déjà commencé à parler"). À J11, préparation à la zone difficile J9-J11 ("c'est normal de sentir une fatigue ici, c'est le signe que tu changes"). À J14, préparation de la transition vers le S0 ("demain, on ouvre la suite"). Chacun de ces écrans s'affiche une seule fois, peut être passé, ne réapparaît pas.

**Contexte :** Sans ces écrans, les jours-charnières du Customer Journey passent inaperçus et la dramaturgie de la Phase 0 s'aplatit. L'écran spécial donne un statut narratif au jour, signale le passage d'une phase à l'autre, soutient la rétention par la frustration positive (J3 = bouton conversion qui apparaît, J7 = palier célébré, J11 = recadrage, J14 = teasing du S0).

**Impact docs :** Product Vision v2.2 mis à jour. Information Architecture V1 documente l'écran IA-14 (avec ses 4 variantes). Brief contenu V1 — scripts vidéo des 4 écrans de jour-charnière.

---

### D20 — Pas de rattrapage automatique des jours manqués
**Date :** 5 mai 2026 — **Auteur :** Stéphane

**Décision :** Le calendrier de l'app **suit le calendrier réel**, pas le rythme de connexion de l'utilisateur. Un utilisateur qui saute 3 jours en S2 reprend à S2 J5 quand il revient, pas à S2 J2. Pas de rattrapage automatique des sessions manquées. Pas de "rallongement" de la semaine de pilier ou de la Phase 0 en cas d'absence. L'évaluation finale d'un pilier se fait au jour 7 calendaire de la semaine, avec les données partielles si l'utilisateur a manqué des sessions.

**Contexte :** Récompenser l'absence par un rattrapage automatique dénaturerait la dramaturgie des 14 jours de Phase 0 (qui sont calibrés en 4 phases narratives) et de chaque semaine de Phase 1 (qui est calibrée comme un arc en 7 jours). C'est aussi un choix d'honnêteté pédagogique aligné sur le principe directeur 1 du Brand Core : faire ressentir la régularité réelle, pas la simuler. Le mécanisme du joker hebdomadaire (D6) absorbe les écarts mineurs ; au-delà, la cassure de streak signale qu'il y a eu rupture.

**Point de vigilance au lancement :** à monitorer en test utilisateur. Si un nombre significatif d'utilisateurs décrochent au retour parce qu'ils ressentent qu'ils "ont raté" la semaine, ajuster en V1.5 par un mécanisme léger (ex. "tu reviens, voici un raccourci pour reprendre où tu étais"), sans pour autant rallonger artificiellement les phases. Le copy des messages de retour Mimi & Jacky doit être travaillé pour ne pas culpabiliser (Audit copy V1, à enrichir).

**Impact docs :** Product Vision v2.2 mis à jour. Information Architecture V1 documente cette logique en section 6 (Ruptures de parcours transverses). Brief contenu V1 — messages de retour Mimi & Jacky pour utilisateurs absents.

---

### D21 — Workflow git Claude Code
**Date :** 5 mai 2026 — **Auteur :** Stéphane

**Décision :** Le workflow git avec Claude Code (assistant codeur dans le terminal) repose sur des **commits directs sur la branche `main` avec validation explicite de Stéphane avant chaque commit**. Pas de branches feature en V1. Pas de push vers une branche distante tant que GitHub n'est pas configuré (voir D22).

Concrètement : à chaque modification significative (un écran codé, une feature ajoutée, un bug corrigé), Claude Code montre les changements proposés en plain language, explique le pourquoi en une phrase, et demande "OK je commit ?". Stéphane valide ou corrige. Pas de commit sans validation explicite.

Convention de message de commit : format court, en français, à la première personne du pluriel ou à l'infinitif. Inclure l'identifiant `IA-XX` quand c'est pertinent pour la traçabilité avec l'Information Architecture V1.

**Contexte :** Stéphane n'est pas développeur de formation et travaille seul sur le code (Mimi & Jacky sont sur le contenu). L'option branches feature ajoutait une charge cognitive (gymnastique git, basculement entre branches, fusions) sans bénéfice immédiat en travail solo. À reconsidérer si Mimi, Jacky ou un freelance rejoignent le code en V2.

**Impact docs :** CLAUDE.md créé à la racine du repo, qui documente ce workflow en section 7. À ne pas dupliquer ailleurs.

---

### D22 — Repo GitHub privé à connecter
**Date :** 5 mai 2026 — **Auteur :** Stéphane

**Décision :** Le repo local `/Users/ASUS/Documents/RawAdventureRN` sera connecté à un repo GitHub **privé** (pas open source, pas public). Raw Adventure est un produit commercial : le code reste propriété de Stéphane, accessible uniquement par lui et les personnes qu'il invite explicitement.

**Contexte :** Aujourd'hui, le code n'existe qu'à un seul endroit (le disque dur du MacBook de Stéphane). Sans GitHub, une panne matérielle ou un vol entraîne la perte totale du travail. La connexion à GitHub privé apporte trois bénéfices : sauvegarde hors machine, possibilité d'inviter un collaborateur le moment venu, historique de commits sécurisé. Confusion levée en conversation : GitHub n'est pas open source par défaut — le mode "privé" est l'option choisie par la majorité des startups commerciales.

Pas urgent pour la rédaction de la Feature Spec V1, mais à activer dans les semaines qui viennent, idéalement avant que le volume de code à perdre ne devienne significatif.

**Impact docs :** CLAUDE.md mentionne le sujet en section 7 (workflow git) et 5 (structure du repo). À mettre à jour quand la connexion sera effective.

---

### D23 — Architecture multilingue prévue dès la V1
**Date :** 5 mai 2026 — **Auteur :** Stéphane

**Décision :** L'app est conçue pour pouvoir être traduite à terme. Le périmètre V1 reste exclusivement français — pas de sélecteur de langue dans le profil, pas de traduction effective produite, pas de fallback inter-langue — mais l'architecture technique doit être compatible avec une traduction ultérieure sans refactor lourd.

Trois règles s'appliquent dès la V1. Premièrement, tout texte affiché à l'utilisateur passe par un slot de copy identifié (pas de chaîne en dur dans le code). Chaque texte visible — bouton, titre, message, notification, label de formulaire, message d'erreur — est référencé par son identifiant de slot (`copy.IA-XX.nom-du-slot`) et résolu au moment du rendu via une fonction de traduction. Deuxièmement, les identifiants de slot de copy sont indépendants de la langue : `copy.IA-15.message-validation-phase-0` est stable quel que soit le contenu produit derrière. Troisièmement, les contenus média (vidéos Mimi & Jacky, voix off) sont traités comme des assets dédiés à une langue, mais leur identifiant (`media.IA-XX.nom-de-l-asset`) ne préjuge pas de la langue.

**Contexte :** La cible commerciale long terme de Raw Adventure dépasse le francophone. Implémenter cette discipline dès la V1 coûte peu (juste une convention de nommage et un passage par une fonction de traduction au lieu de chaînes en dur), implémenter la traduction après coup sur du code écrit "en dur" coûte un refactor pénible. Choix structurant pris à coût quasi nul maintenant.

**Impact docs :** Feature Spec V1 Socle minimum documente les conventions multilingues (section 1.6) et les conventions de nommage de slots et d'assets (section 1.3). Le Brief contenu V1 (à produire) se conforme à ces conventions en référencant les slots à produire en français pour la V1. Stratégie de production multilingue pour les langues additionnelles : hors scope V1, traitée le moment venu.

**Point d'attention :** le choix de la bibliothèque de traduction (i18next, react-intl, expo-localization, ou solution maison) relève de l'assistant codeur au moment de l'implémentation. La seule exigence côté Feature Spec : tout texte utilisateur doit être référençable par identifiant et chargeable depuis un fichier de traduction externe.

---

### D24 — Démarrage différé optionnel à la création de compte
**Date :** 5 mai 2026 — **Auteur :** Stéphane

**Décision :** À la création de compte (sortie d'IA-10), si l'utilisateur se trouve à moins de 4 heures du minuit local suivant et qu'il n'a pas encore dépassé minuit, l'app affiche un écran de choix lui proposant explicitement de démarrer son J1 maintenant ou le lendemain matin. Si l'utilisateur choisit le démarrage différé, l'app le bascule en état d'attente jusqu'au passage de minuit local. Décision révocable à tout moment depuis l'écran d'attente via un bouton "En fait, on démarre maintenant".

Concrètement, deux nouveaux écrans s'insèrent entre IA-10 (création de compte) et IA-12 (vidéo de bienvenue J1) : `IA-10b` (écran de choix de démarrage, conditionnel) et `IA-10c` (écran d'attente pré-Phase 0, affiché pendant la période d'attente choisie).

Si plus de 4 heures avant minuit, ou si l'utilisateur a déjà passé minuit (heure courante locale entre 0h et 4h du matin), pas de choix proposé : l'app pose `accountCreatedAt = now()` et enchaîne directement sur IA-12 comme avant.

**Contexte :** Sans cette mécanique, un utilisateur qui crée son compte à 22h vit un J1 de seulement 2 heures avant que minuit ne le bascule en J2, ce qui dénature la dramaturgie de la Phase 0 et crée un sentiment d'avoir "raté" le premier jour. Le seuil de 4 heures est un compromis raisonnable entre "donner suffisamment de marge pour vivre un J1 complet" et "ne pas proposer le différé à un utilisateur qui s'inscrit en pleine journée et est prêt à démarrer". La décision est révocable depuis l'écran d'attente pour ne pas piéger un utilisateur qui aurait changé d'avis. Choix aligné sur le principe directeur "L'utilisateur ne doit pas réfléchir" — c'est l'app qui détecte le cas et propose, l'utilisateur valide d'un tap.

**Impact docs :** Information Architecture V1 mise à jour avec ajout d'IA-10b et IA-10c entre IA-10 et IA-12. Feature Spec V1 Socle minimum documente la logique complète en section 2.3 (Gestion temporelle, sous-section "Démarrage différé"). Brief contenu V1 — copy de l'écran de choix et de l'écran d'attente, message Mimi & Jacky calibré pour le différé.

---

### D25 — Absence prolongée traversant un changement de phase
**Date :** 5 mai 2026 — **Auteur :** Stéphane

**Décision :** Quand un utilisateur revient sur l'app après une absence prolongée qui couvre un ou plusieurs changements de phase théoriques (par exemple : utilisateur qui était en J10 de Phase 0 et qui revient 25 jours plus tard, traversant en théorie le S0 et plusieurs jours de S1), l'app **joue les écrans narratifs de transition dans l'ordre**, à raison d'un par lancement. Pas de saut direct à l'état théorique courant, pas d'enchaînement multiple dans la même session.

Concrètement : à la première ouverture après l'absence, l'app détecte les transitions accumulées, met l'état à jour et joue le premier écran narratif dû dans la file d'attente (par exemple IA-14 du jour-charnière manqué). À la session suivante, l'écran narratif suivant est joué (par exemple IA-20 du S0.1). Et ainsi de suite jusqu'à ce que la file soit vidée.

**Contexte :** Trois options ont été comparées. Option A : sauter tous les écrans narratifs intermédiaires et atterrir directement au jour théorique courant (efficacité maximum, perte narrative totale). Option B : enchaîner tous les écrans narratifs en cascade dans la même session (cohérence narrative, mais surcharge cognitive et risque de zapping). Option C retenue : un par session, dans l'ordre. Préserve la dramaturgie sans la rendre indigeste, et donne au retour un caractère progressif qui peut motiver à revenir le lendemain pour voir la suite.

**Impact docs :** Feature Spec V1 Socle minimum documente la mécanique en section 2.3 (Gestion temporelle, sous-section "Comportement en cas d'absence prolongée"). La file d'attente d'écrans narratifs est mentionnée dans les notes pour le dev. Brief contenu V1 — message d'accueil de retour Mimi & Jacky non-culpabilisant qui se joue avant le premier écran narratif différé (`copy.global.message-retour-absence`).

**Point d'attention :** la file d'attente d'écrans narratifs est techniquement non-triviale à implémenter (ordre, idempotence, persistance des flags). Suggestion technique posée dans la Feature Spec : système unifié géré par un store ou service dédié.

---

### D26 — Soft-rappel non-culpabilisant en Phase 0 sous le seuil de validation
**Date :** 5 mai 2026 — **Auteur :** Stéphane

**Décision :** Quand l'utilisateur tape "Valider ma journée" en Phase 0 avec strictement moins de 4 piliers cochés, la modale IA-15 ne déclenche pas immédiatement la validation. Elle affiche d'abord un soft-rappel non-culpabilisant : "Tu as coché [N] piliers aujourd'hui. Tu peux encore en cocher d'autres avant de valider, ou valider tout de suite." Deux boutons : "Cocher d'autres piliers" (ferme la modale, ramène à l'accueil pour permettre à l'utilisateur d'aller cocher) et "Valider quand même" (enclenche la validation sous le seuil avec consommation du joker hebdomadaire si dispo, sinon cassure de streak — voir D6).

**Pas de soft-rappel en Phase 1.** La mécanique de validation 1 session sur 3 est déjà très permissive. Ajouter un soft-rappel à 0/3 serait redondant (le bouton est déjà inactif), ajouter un soft-rappel à 1/3 ou 2/3 contredirait la posture pédagogique de Jacky "mieux vaut 3 petites sessions que 1 grosse" qui valorise déjà 1/3.

**Contexte :** Trois options ont été comparées pour le cas Phase 0 sous seuil. Option A : laisser l'utilisateur valider sans rappel, simple et permissif (mais rate l'opportunité pédagogique). Option B retenue : soft-rappel avec choix explicite (équilibre entre nudge pédagogique et respect du choix utilisateur). Option C : bloquer la validation sous seuil (trop punitif, contradictoire avec la posture non-culpabilisante).

**Impact docs :** Feature Spec V1 Socle minimum documente le comportement en section 2.4 (Check quotidien). Brief contenu V1 — copy du soft-rappel `copy.IA-15.soft-rappel-sous-seuil` à formuler dans le ton Mimi & Jacky (bienveillant, factuel, sans pression).

---

### D27 — Pas de modification rétroactive d'un check journalier
**Date :** 5 mai 2026 — **Auteur :** Stéphane

**Décision :** Une journée validée par check quotidien reste validée. Une journée non validée reste non validée. Pas de fenêtre de modification rétroactive en V1, ni dans la journée du lendemain ni au-delà. L'utilisateur ne peut pas revenir le mardi soir sur le lundi pour cocher un pilier oublié et modifier le streak.

**Contexte :** Permettre la modification rétroactive crée trois problèmes. Premièrement, elle ouvre la porte à un comportement de "réécriture d'historique" qui dénature la mécanique de streak (le streak doit refléter la réalité vécue, pas une réalité reconstruite). Deuxièmement, elle complique la logique métier (chaque action utilisateur peut potentiellement déclencher une mise à jour de tous les jours antérieurs et donc des paliers franchis). Troisièmement, elle nourrit une posture de perfectionnisme contraire à l'esprit Mimi & Jacky ("ce qui compte c'est le jour qu'on a, pas le jour qu'on a manqué"). À reconsidérer en V1.5 si retours utilisateurs réguliers et argumentés.

**Impact docs :** Feature Spec V1 Socle minimum documente la règle en section 2.4 (Check quotidien, sous-section "Persistance et idempotence"). Pas d'impact sur Brief contenu V1 — pas de copy à produire pour une mécanique qui n'existe pas.

---

### D28 — Storage local-only V1
**Date :** 5 mai 2026 — **Auteur :** Stéphane

**Décision :** En V1, toutes les données de parcours utilisateur (réponses d'onboarding, profil dynamique, état du parcours, validations journalières, streak, joker, paliers franchis, choix de niveau adaptatif) sont stockées **localement sur l'appareil**, sans backend cloud. Une désinstallation de l'app ou un changement de téléphone entraîne la perte définitive de ces données. Une réinstallation re-démarre le parcours depuis l'onboarding.

**Contexte :** Le choix d'un backend cloud aurait apporté trois bénéfices (synchronisation multi-appareil, survie à la désinstallation, télémétrie utilisateur), mais pour un coût technique et opérationnel non négligeable en V1 (infrastructure, sécurité, RGPD, gestion des comptes). Le local-only est cohérent avec la posture V1 du produit : on prouve la valeur d'abord, on industrialise ensuite. La désinstallation est interprétée comme un signal fort de désengagement, pas comme une perte accidentelle qu'on cherche à protéger. Le streak perdu à la désinstallation est volontaire — il signale la rupture du parcours, ce qui est l'effet voulu.

**Impact docs :** Feature Spec V1 Socle minimum documente le choix en section 2.5 (Streak et joker hebdomadaire) et en section 2.9 (Notifications, où le local-only contraint la planification des notifications à local-only également, sans serveur push). Choix technique côté dev : AsyncStorage ou SQLite sur l'appareil, à arbitrer en implémentation.

**Point d'attention :** à reconsidérer dès la V2 si la cohorte d'utilisateurs payants est significative — la perte de streak après changement de téléphone deviendra un irritant utilisateur réel à ce volume. La V2 portera probablement la migration vers un backend de synchronisation.

---

### D29 — Paliers de récompense — premier franchissement avec vidéo, redéclenchement allégé
**Date :** 5 mai 2026 — **Auteur :** Stéphane

**Décision :** La mécanique des 6 paliers de récompense (D10) est précisée pour le cas d'un palier déjà franchi puis re-franchi après cassure de streak.

**Premier franchissement.** Modale IA-50 complète avec vidéo Mimi & Jacky de 30 secondes, badge ajouté à la galerie IA-51, message personnalisé du palier, deux boutons ("Voir mes paliers" et "Continuer"). C'est le comportement déjà acté en D10.

**Franchissements suivants après cassure.** Si l'utilisateur reconstruit son streak après une cassure et atteint à nouveau un palier qu'il avait déjà acquis, redéclenchement allégé. Pas de vidéo de 30s rejouée. Modale IA-50 simplifiée : badge en plus petit, message court de reconnaissance Mimi & Jacky (`copy.global.palier-reprise`), un seul bouton "Continuer". Le flag `unlockedTier{N}At` reste le timestamp du premier franchissement (la galerie ne change pas), un compteur interne `tier{N}ReachedCount` s'incrémente à chaque franchissement (tracé en interne mais non affiché en V1).

**Contexte :** Trois options ont été comparées. Option A : redéclenchement complet avec vidéo (cohérent avec le premier franchissement, mais redondant et risque de saturer l'utilisateur qui a déjà vu la vidéo). Option B retenue : redéclenchement allégé (reconnait le passage sans le surinvestir, garde le moment fort réservé à la première fois). Option C : marque unique (premier franchissement seulement, rien aux suivants — trop sec, l'utilisateur qui reconstruit un streak après une cassure mérite un signal de reconnaissance).

**Impact docs :** Feature Spec V1 Socle minimum documente la mécanique en section 2.6 (Paliers de récompense, sous-section "Cas particulier — palier déjà franchi puis streak cassé puis reconstruit"). Brief contenu V1 — slot `copy.global.palier-reprise` à produire (un message court, ton bienveillant, qui ne fait pas la leçon sur la cassure précédente).

---

### D30 — Coordination palier 15j et S0.1 — IA-20 prime
**Date :** 5 mai 2026 — **Auteur :** Stéphane

**Décision :** Si l'utilisateur a validé tous ses jours de Phase 0 et atteint le palier de streak de 15j au moment précis de la transition `phase_0` → `s0_1` (premier lancement du J15 calendaire), **IA-20 prime sur IA-50**. La couche superposée IA-20 (célébration des 14 jours et révélation de la toile) se déclenche normalement. La modale IA-50 du palier 15j est **différée** : le badge `tier_15` est posé au J15 dans la galerie, mais la modale dédiée est jouée à la prochaine validation de jour (J16 ou ultérieure), après que les écrans narratifs structurants (IA-20, IA-21) aient été joués.

**Logique généralisable :** narratif structurant prime, palier différé d'un cran. Cette logique vaut pour toute collision future entre un palier de récompense et un écran narratif structurant (transition de phase, fin de pilier, sortie de S8).

**Contexte :** Le J15 cumule plusieurs moments narratifs forts : palier 15j de streak (D10), célébration des 14 jours de Phase 0 et révélation de la toile (D17). Empiler IA-20 et IA-50 dans la même session étoufferait l'expérience. Privilégier l'écran narratif structurant (IA-20 marque le passage de phase) et différer le palier (IA-50) d'un cran préserve les deux moments en les espaçant. La règle est claire et facile à implémenter (test de priorité dans la file d'attente d'écrans narratifs).

**Impact docs :** Feature Spec V1 Socle minimum documente la coordination en section 2.6 (Paliers de récompense, sous-section "Coordination entre palier 15j et S0.1"). Notes pour le dev : la file d'attente d'écrans narratifs gère cette priorité de façon unifiée.

---

### D31 — Niveau adaptatif manuel uniquement en V1
**Date :** 5 mai 2026 (décision initiale) + 7 mai 2026 (précision sémantique) — **Auteur :** Stéphane

**Décision :** Le niveau adaptatif (D4) reste **strictement manuel** en V1. L'app n'analyse pas l'historique des choix de niveau adaptatif de l'utilisateur (Moins / Pareil / Plus) et **ne change pas automatiquement** le niveau d'entrée du pilier. Si un utilisateur choisit "Moins" sur N sessions consécutives, l'app **ne modifie pas son niveau toute seule** — c'est à l'utilisateur de décider, manuellement, depuis IA-41 ou IA-42, de modifier son niveau d'entrée.

**Précision sémantique du 7 mai 2026 (audit V0 vs docs fondateurs).** L'interdiction porte sur le **changement automatique** du niveau, pas sur les **messages contextuels**. L'app peut afficher des messages qui suggèrent à l'utilisateur d'ajuster son niveau (par exemple si plusieurs choix "Moins" successifs sont enregistrés, ou si l'utilisateur signale plusieurs fois l'inconfort) — mais le changement effectif du niveau d'entrée reste **toujours manuel** via IA-44 ou via la modification du niveau dans IA-41/IA-42. Cette précision résout l'apparente contradiction entre D31 et les sections "Adaptation automatique" présentes dans les fichiers piliers Jacky de Phase 1 (P1, P2, P5, P8) — elles décrivent en réalité des messages de suggestion compatibles avec D31, pas des changements automatiques. Conséquence M11 du Bloc 2 de l'audit.

**Contexte :** Une logique de suggestion automatique apporterait du confort utilisateur mais demande trois choses non triviales en V1 : un seuil de déclenchement à calibrer, un copy bienveillant à produire, et une gestion des cas particuliers (ce qui se passe si l'utilisateur refuse, persistance de l'historique). Cohérent avec la posture V1 "manuel d'abord, automatique ensuite si signal fort". L'historique des choix de niveau adaptatif est conservé en interne pour analyse de patterns (donnée potentielle pour V2), mais non exposé à l'utilisateur en V1.

**Impact docs :** Feature Spec V1 Socle minimum documente la règle en section 2.7 (Niveau adaptatif manuel, sous-section "Pas de changement automatique en V1, messages de suggestion autorisés"). Pas d'impact sur Brief contenu V1 (pas de copy de suggestion à produire en V1 puisque le déclencheur principal — score quotidien par pilier — est différé V2 par D34, voir ci-dessous). Logique de suggestion automatique de changement de niveau à voir en V2 si retours utilisateurs et données suffisantes.

---

### D32 — Plage de silence des notifications entre 22h et 8h locales
**Date :** 5 mai 2026 — **Auteur :** Stéphane

**Décision :** Aucune notification émise par l'app n'est envoyée à l'utilisateur entre **22h et 8h locales** (heure du fuseau horaire courant de l'appareil), quelle que soit la famille de notification (rappel quotidien, rappel de session, célébration de palier, alerte joker, retour absence). Si un déclencheur tombe dans cette plage, deux comportements possibles selon la famille (à arbitrer en D12) : soit la notification est avancée à 21h59, soit elle est annulée et reportée à 8h le lendemain.

**Contexte :** Cohérent avec le principe directeur 4 du Brand Core ("Moins d'une minute par jour en routine") qui suppose une intégration discrète et respectueuse dans la vie de l'utilisateur. Les notifications nocturnes sont à la fois inefficaces (utilisateur ne les voit pas, ou les voit en se réveillant et les associe à un parasite) et risquées sur le plan UX (perception d'intrusion). Le créneau 22h-8h est large mais raisonnable pour une cible francophone adulte. À calibrer en V1.5 si retours utilisateurs montrent que 22h est trop tôt ou 8h trop tard.

**Impact docs :** Feature Spec V1 Socle minimum documente la contrainte en section 2.9 (Notifications, sous-section "Quatre contraintes techniques V1"). D12 (calibrage produit des notifications) tranche, par famille, entre les comportements "avance à 21h59" ou "annule et reporte à 8h".

---

### D33 — Une seule vidéo d'intro par pilier en V1
**Date :** 5 mai 2026 — **Auteur :** Stéphane

**Décision :** En V1, chaque pilier de Phase 1 a **une seule vidéo d'intro de pilier** (jouée sur l'écran IA-41 au démarrage du pilier, durée cible 60-90s). Pas de variante par niveau d'entrée (Essentiel / Progression / Immersion), pas de variante par profil dynamique (les 8 profils calculés en sortie d'onboarding). La vidéo s'adresse au niveau Progression par défaut (le niveau "moyen", supposé représenter la majorité des cas). Le segment 3 de la vidéo (annonce de la semaine) peut mentionner les trois niveaux brièvement, mais sans personnalisation.

Production V1 : **8 vidéos d'intro de pilier au total** (une par pilier S1 à S8), au lieu de 24 (8 piliers × 3 niveaux) si on avait choisi des variantes par niveau.

**Contexte :** Produire 24 vidéos pour les seules intros de pilier serait disproportionné en V1 — le tournage avec Mimi & Jacky doit rester réaliste en charge de production. La personnalisation par niveau est portée ailleurs : le niveau d'entrée recommandé est affiché à l'écran (libellé), modifiable manuellement (D4), et les consignes de session sont déjà déclinées en 3 variantes par niveau. La vidéo d'intro joue un rôle d'orientation et de mise en posture, pas de transmission de consignes — elle peut rester unique par pilier sans perte fonctionnelle. Si les retours V1 montrent que la personnalisation vidéo par niveau apporte une valeur significative, on reverra en V2.

**Impact docs :** Feature Spec V1 Socle minimum documente la règle en section 4.2 (Spec vidéo d'intro de pilier, sous-section "Variantes par niveau d'entrée — aucune en V1"). Brief contenu V1 — production de 8 vidéos d'intro de pilier (et non 24), structure-type 5 segments documentée dans le Socle minimum.

---

### D34 — Pas de score quotidien par pilier en V1
**Date :** 7 mai 2026 — **Auteur :** Stéphane

**Décision :** Pas de score quotidien par pilier en V1. La validation d'un jour est binaire (validé / non validé selon le seuil D6 sur 1 session sur 3 minimum en Phase 1, 5 actions sur 7 minimum en Phase 0). Le score `nombre d'actions validées / total d'actions` du jour Phase 0 reste affiché transitoirement dans la modale IA-15 de validation (information utile en temps réel, par exemple "5/7" ou "6/7"), mais il n'est ni stocké en base, ni agrégé sur la durée, ni exposé ailleurs dans l'app.

La matière proposée par Jacky dans les fichiers piliers de Phase 1 (P1 Score de présence respiratoire, P2 Score de cohérence, P4 Score de régénération, P5 Score de fluidité, P7 Score de connexion, P8 Score passion — soit 6 scores quotidiens définis sur 8 piliers) est **conservée comme matière préfigurant V2**. Le niveau de discipline 4 paliers proposé dans le brief Phase0_2 de Jacky (Explorateur 50 % / Engagé 70 % / Aligné 85 % / Inarrêtable 100 %) est également différé V2.

**Contexte :** Trois raisons motivent cette posture. Premièrement, la V1 a déjà beaucoup d'objets de progression (streak + 6 paliers + 8 branches de toile + validation jour binaire) — ajouter 8 scores quotidiens pilier-spécifiques charge cognitivement l'utilisateur sans bénéfice clair. Deuxièmement, calculer un score quotidien fiable demande de définir un agrégat par pilier (P4 a 4 critères pondérés, P1 en a d'autres) — c'est une charge produit qui pèse sur Jacky et le dev pour un bénéfice non encore prouvé. Troisièmement, l'absence de score quotidien rend l'adaptation messagée de D31 enrichi essentiellement inopérante en V1 (le déclencheur principal n'existe pas) — ce qui est cohérent avec la posture "manuel d'abord, automatique ensuite". Conséquence B3 du Bloc 2 et N3 du Bonus de l'audit V0 vs docs fondateurs.

**Impact docs :** Métriques V1 § 5.8 confirme la posture (déjà tranché en V0.2, formalisé en V1.0). Feature Spec V1 Socle minimum mentionne le score transitoire `doneCount/totalCount` dans la modale IA-15 sans persistance. Briefs Phase0_2 et fichiers piliers Jacky : marquer les sections "Score quotidien" et "Niveau de discipline" comme préfigurant V2 (Production N3 du Bonus). Activation envisageable en V2 si l'analyse des cohortes V1 le justifie.

---

### D35 — Pas de badges par pilier en V1
**Date :** 7 mai 2026 — **Auteur :** Stéphane

**Décision :** Pas de badges par pilier en V1. Les seules récompenses formelles en V1 sont les **6 paliers de streak** (D29, modale IA-50) et la **valorisation de la branche de la toile** à chaque évaluation finale de pilier de Phase 1.

Les 4 badges par pilier proposés par Jacky dans plusieurs fichiers piliers (P1 Respiration nasale / Diaphragme activé / Calme installé / Respiration reconnectée, P2-P3-P5-P8 avec leurs propres badges) sont **conservés comme matière préfigurant V2**. Soit environ 20 badges potentiels actuellement définis (4 × 5 piliers couverts), avec un total cible de 32 (4 × 8) si V2 active la mécanique.

**Précision importante.** Les libellés Jacky restent **réutilisables dès V1** comme **titres de moments narratifs** au sein de la semaine d'un pilier (typiquement J3, J5, J7 selon la structure des fichiers piliers). Sous forme de copy enrichi sur l'écran de session ou de petite modale narrative non-gamifiée, sans tracking de badge ni stockage de récompense. Par exemple, à J5 du pilier Respiration, un bandeau ou un message Mimi & Jacky peut afficher *« Calme installé — tu sens probablement déjà la différence »* sans que ce libellé soit un badge collectionnable. C'est une mécanique différente d'un système de badges : ni collection persistante ni icône à débloquer, juste un enrichissement du copy pédagogique au bon moment.

**Contexte :** Implémenter 32 badges potentiels demande de définir pour chaque badge sa condition de déclenchement précise (exemple : "ressenti de respiration basse" = quel input utilisateur ?), son visuel (chaque badge a son emoji ou son icône), son moment d'apparition (modale ? bandeau ? notification ?), son emplacement de stockage et d'affichage dans le profil utilisateur. Ce n'est pas trivial à coder et à designer — plusieurs jours de travail produit + dev pour un sujet qui n'est pas dans la promesse cœur de Raw Adventure. Ajouter 32 badges démultiplie la surface de gamification et risque de faire ressembler la V1 à une app fitness américaine plutôt qu'à un produit Raw Adventure. Conséquence B4 du Bloc 2 de l'audit V0 vs docs fondateurs.

**Impact docs :** Métriques V1 V1.0 mentionne explicitement l'absence de badges en V1. Feature Spec V1 Socle minimum reste inchangée (D29 paliers + toile, pas de badges). Brief contenu V1 peut réutiliser les libellés Jacky comme titres de moments narratifs sur l'écran de session (à intégrer aux fiches contenu par pilier). Système de badges complet à voir en V2.

---

### D36 — Pas de questionnaire de fin de journée Phase 0 en V1
**Date :** 7 mai 2026 — **Auteur :** Stéphane

**Décision :** Pas de questionnaire de fin de journée Phase 0 en V1. La V1 ne déploie pas le mini-questionnaire à 4 questions (Énergie 1-10 / Corps léger-neutre-lourd / Mental calme-stable-agité / Fierté oui-moyen-non) proposé par Jacky dans les briefs Phase0_2 et Phase0_jour_1.

La V1 capture les signaux subjectifs par d'autres moyens : profil dynamique de l'onboarding initial (qui couvre déjà 3 des 4 dimensions Énergie / Corps / Mental), évaluations 12 questions de Phase 1 (8 fois sur 8 semaines), NPS skippable à S0.2 + fin S4 + sortie S8 (Métriques V1 § 6.4). La matière proposée par Jacky est **conservée comme préfiguration V2**, à activer si l'analyse des cohortes V1 montre que l'enrichissement du signal subjectif quotidien apporte une valeur produit suffisante pour justifier la friction d'un écran post-validation supplémentaire.

**Contexte :** La V1 a déjà beaucoup d'écrans de validation et de feedback (modale IA-15 validation jour, écrans narratifs des jours-charnières J3/J7/J11/J14, S0.1, S0.2, modales IA-50 paliers de streak). Ajouter un questionnaire quotidien densifie davantage la chaîne de friction quotidienne — tension réelle avec le principe directeur 3 (simplicité extrême) et le principe directeur 4 (moins d'une minute par jour en routine). La matière collectée par le questionnaire (énergie / corps / mental) est par ailleurs déjà capturée en moins fin par le profil dynamique d'onboarding et par les évaluations 12 questions de Phase 1 — la duplication apporterait surtout de la granularité, pas un signal radicalement nouveau. Conséquence N4 du Bonus de l'audit V0 vs docs fondateurs.

**Impact docs :** Feature Spec V1 Socle minimum ne mentionne pas le questionnaire (cohérent avec la V0.2 actuelle). IA-15 reste cadrée par D26 (soft-rappel) sans ajout de questions de ressenti. Briefs Phase0_2 et Phase0_jour_1 (slides 13-18) : marquer les sections "Questions de suivi" comme préfigurant V2 (Production N3 du Bonus). Charge dev V1 économisée : 3 à 5 heures Claude Code (création écran IA-15 bis, stockage daily_check_ins en base, exposition dans IA-70).

---

### D37 — Effet miroir qualitatif en V1, chiffres de cohorte différés V2
**Date :** 7 mai 2026 — **Auteur :** Stéphane

**Décision :** Le levier d'effet miroir / normalisation sociale (levier 4 du brief Phase0_3 de Jacky) est intégré en V1 sous forme de **phrases qualitatives sans données chiffrées**, à produire avec Mimi & Jacky dans le Brief contenu V1. Bons candidats d'intégration : les 4 jours-charnières J3 (cap critique), J4 (identité), J7 (mi-parcours), J11 (plus que 3 jours). Format : 2 à 3 phrases par jour-charnière, formulations cliniques type *« La majorité des gens trouvent le froid difficile au début — c'est normal »*, calibrées par Jacky depuis son expérience clinique (donc factuelles, pas inventées).

L'**activation des chiffres de cohorte** ("80 % des participants ont validé leur jour 3 aujourd'hui", "9 utilisateurs sur 10 ont franchi le J7 cette semaine") est différée V2, à activer quand le seuil statistique sera atteint (par exemple 100 utilisateurs ayant complété la Phase 0). En V1 démarrant à zéro utilisateur, le levier ne peut pas s'activer immédiatement avec des chiffres réels et l'absence de chiffres ne doit pas devenir une fausse promesse type "des milliers d'utilisateurs comme toi" alors que la base est encore vide.

**Contexte :** Le levier d'effet miroir est un classique de la psychologie sociale (effet de conformisme, normalisation des difficultés) qui a fait ses preuves dans les apps de comportement — il rassure, motive, réduit l'abandon. Le V0 a déjà partiellement intégré le levier dans le sous-titre du J8 (*« La majorité des personnes qui arrivent au Jour 8 finissent le challenge »*) sans chiffres, ce qui est exactement la posture V1 souhaitée. La version chiffrée demande des données réelles de cohorte, qu'on n'a pas en V1 mais qu'on aura en V2. Conséquence N5 du Bonus de l'audit V0 vs docs fondateurs.

**Impact docs :** Brief contenu V1 enrichi de 8 à 12 phrases d'effet miroir qualitatives (à produire avec Mimi & Jacky lors de la session contenu Phase 0). IA V1 reste inchangée (l'intégration est dans le copy des jours-charnière, pas dans une nouvelle mécanique d'écran). Feature Spec V1 Socle minimum reste inchangée. Activation chiffrée à voir en V2 avec mécanique de stockage et calcul des taux de cohorte.

---

### D38 — Honnêteté pédagogique radicale en cas de régression à l'évaluation finale d'un pilier
**Date :** 9 mai 2026 — **Auteur :** Stéphane (sur réponse Jacky du 8 mai 2026)

**Décision :** En fin de semaine d'un pilier, si l'évaluation finale (IA-46) donne un score inférieur à l'évaluation initiale (IA-40) au-delà du seuil de tolérance ±3 points, l'app affiche **honnêtement la régression**. La branche de la toile peut visuellement rétrécir — la couleur finale est positionnée en deçà du grisé initial. Le copy associé pose la régression comme **signal de lecture du corps** (sonnette d'alarme au sens clinique, pas échec), invite l'utilisateur à se relire (3-4 hypothèses contextuelles type stress, sollicitation forte, manque de sommeil) et repositionne le moment dans la posture raw adventure scientifique-expérimentale.

**Contexte :** Trois options ont été envisagées en V1.0 de Métriques V1 : afficher le score réel y compris en régression (Option A), bloquer visuellement à la valeur initiale (Option B), afficher la régression mais sans la matérialiser dans la toile (Option C). Jacky a tranché pour l'Option A sur la base d'un principe pédagogique fort : la posture scientifique-expérimentale du Brand Core ne tolère pas le faux-positif visuel. Si la branche resterait à un niveau qu'elle n'a plus dans la réalité, on déshonore le travail de lecture du corps que l'app demande à l'utilisateur. Le copy de régression existe pour absorber émotionnellement le moment sans le nier. Cohérent avec le principe directeur 6 (pas de marketing bien-être creux).

**Impact docs :** Métriques V1 V1.1 § 1.5 état 3 cas particulier + § 2.7 mapping différentiel. Brief contenu V1 à enrichir avec le copy spécifique du cas régression (en ton Mimi & Jacky, dense, direct, sans dramatisation ni minimisation). Phrase pédagogique brute Jacky du 12 mai 2026 conservée en Annexe D.1 de Métriques V1.4 comme base de production. Schéma de données V1 : persistance de la valeur initiale **et** de la valeur finale par branche (déjà prévu).

---

### D39 — Ordre canonique des 8 piliers de Phase 1
**Date :** 9 mai 2026 — **Auteur :** Jacky (transmise par Stéphane lors de la session de relecture solo du 9 mai 2026)

**Décision :** L'ordre canonique des 8 piliers de Phase 1, figé en V1 et non modifiable, est : **S1 Respiration, S2 Activité physique, S3 Alimentation, S4 Connexion au vivant, S5 Repos et régénération, S6 Passion et chemin de vie, S7 Mindset, S8 Élimination et détox.** Cet ordre détermine la séquence narrative des 8 semaines (semaine 1 = S1, semaine 8 = S8), la position des 8 branches sur la toile (S1 à 12h, puis dans le sens horaire), et la numérotation utilisée dans tous les documents de cadrage à partir de la V1.3 de Métriques V1.

**Contexte :** La D8 du 3 mai 2026 avait posé un ordre initial qui plaçait les piliers S2 Alimentation, S3 Mindset, S4 Condition physique en positions 2-3-4. Lors de la session de cadrage des paramètres principaux (8 mai 2026), Jacky a indiqué vouloir réorganiser cet ordre selon une logique pédagogique plus cohérente : commencer par la respiration (porte d'entrée fondamentale et accessible à tous), puis activer le corps (S2 Activité physique renommée depuis "Condition physique" pour être plus inclusif), puis alimentation, connexion vivant, repos, passion, mindset, élimination en sortie. Le renommage de "Condition physique" en "Activité physique" vise à éviter l'image d'un pilier sportif réservé aux gens en forme — "Activité physique" inclut la marche, le mouvement doux, la mobilité quotidienne.

**Impact docs :** Métriques V1 V1.3 entièrement migré vers l'ordre D39 (§ 1.2, § 1.6, § 2.4, § 2.6, § 3.4, § 4.3, Annexes A, B, C). Annexe B (matrice 8×8) recomptée en quotas suite à la migration. Information Architecture V1 : ordre des écrans IA-40 à IA-47 à aligner par pilier en sortie de S0.2. Customer Journey V1.2 : narration des 8 semaines à réordonner. CLAUDE.md du repo : la D8 reste référencée dans les versions historiques mais l'ordre canonique opérant en V1 est désormais D39 (mention explicite à ajouter au CLAUDE.md). Tous les fichiers piliers V0 de Jacky restent en place — c'est la position dans l'ordre qui change, pas le contenu.

---

### D40 — Règle simplifiée diagnostic → engagement de départ (remplace la table 5×8 = 40 cases)
**Date :** 12 mai 2026 — **Auteur :** Jacky (avec simplification Stéphane sur le cas niveau 3 le 12 mai 2026)

**Décision :** Le mapping entre le diagnostic 5 niveaux (résultat de l'évaluation 12 questions initiale d'un pilier, cf. Métriques V1.4 § 2.4) et le niveau d'engagement de départ recommandé (Essentiel / Progression / Immersion) se résume à une **règle simple à 3 cas + 1 plafond**, identique pour les 6 piliers Type A (cf. D41) :

- Diagnostic niveau 1 (très faible) → **Essentiel** automatique
- Diagnostic niveau 2 (faible) → **Essentiel** automatique
- Diagnostic niveau 3 (moyen) → **Essentiel** automatique (pas de modale, pas d'override)
- Diagnostic niveau 4 (bon) → **Progression** automatique
- Diagnostic niveau 5 (optimal) → **Progression** automatique
- **Plafond Immersion :** personne ne démarre une semaine de pilier Type A en Immersion en Phase 1. Jamais. L'Immersion se débloque uniquement par escalade manuelle de l'utilisateur via "Modifier mon niveau" dans IA-41 ou via le niveau adaptatif Plus dans IA-44 après expérimentation de la pratique.

**Intention pédagogique Jacky.** Le questionnaire 12 questions sert à **confronter les utilisateurs à leur surévaluation**. Beaucoup arrivent en se sur-cotant — le diagnostic chiffré vient poser une réalité. Si le diagnostic Phase 1 amène à un engagement plus bas que celui calibré par le profil archétype en Phase 0 sur le même pilier, c'est un **message de réalité, pas un bug**. Citation Jacky brute : *« Les gens doivent se rendre compte que leur niveau n'est pas celui qu'ils disent qu'il est, ils se surévaluent. »* Conservée en Annexe D.3 de Métriques V1.4.

**Exception Type B (cf. D41).** La règle D40 ne s'applique pas aux 2 piliers Type B (S5 Repos et régénération, S7 Mindset). Sur ces deux piliers, tout le monde démarre au même endroit en Phase 1, l'évaluation 12 questions reste présente pour alimenter la toile et afficher un diagnostic à l'utilisateur, mais aucun mapping vers un engagement de départ n'a lieu.

**Contexte :** Jusqu'en V1.3 de Métriques V1, le mapping diagnostic → engagement était envisagé comme une **table de correspondance pédagogique 5 diagnostics × 8 piliers = 40 cases**, où Jacky devait calibrer case par case selon sa lecture pédagogique du pilier. Lors de la session du 12 mai 2026, Jacky a apporté une **objection de fond** : l'évaluation 12 questions de début de semaine ne porte que sur **un seul pilier** à la fois (le pilier en cours), donc on n'a pas 8 diagnostics à croiser en simultané, on n'en a qu'un seul. La mécanique se réduit donc à une règle simple appliquée uniformément. Sur le cas niveau 3 (médian), Jacky proposait initialement une modale "Tu es au milieu, décide toi-même" — Stéphane a simplifié en imposant Essentiel par défaut sans modale, cohérent avec le principe directeur 1 ("L'utilisateur ne doit pas réfléchir").

**Impact docs :** Métriques V1 V1.4 § 2.5 entièrement refondu pour acter la règle simplifiée. La table 5×8 = 40 cases est supprimée du document. § 2.6 patché pour expliciter la posture sur le déclassement Phase 0 → Phase 1 (intention pédagogique assumée). Annexe A V1.4 A2.4 résolue par simplification radicale. Feature Spec V1 Socle minimum à patcher pour cadrer le format de l'écran IA-41 (récapitulatif évaluation initiale + niveau d'engagement automatique) sans branche "modale niveau 3". Brief contenu V1 à enrichir avec le copy IA-41 incarnant l'intention pédagogique (ton direct, déculpabilisant, sans concession sur la réalité).

---

### D41 — Distinction Type A / Type B des piliers (mécanique alternative pour S5 Repos et S7 Mindset)
**Date :** 12 mai 2026 — **Auteur :** Jacky

**Décision :** Les 8 piliers de Phase 1 se répartissent désormais en deux types selon la nature de leur mécanique de progression :

**Type A — Pilier à intensité graduelle (6 piliers).** S1 Respiration, S2 Activité physique, S3 Alimentation, S4 Connexion au vivant, S6 Passion et chemin de vie, S8 Élimination et détox. Mécanique standard : évaluation 12 questions → diagnostic 5 niveaux → mapping D40 → engagement de départ E/P/I → paramètre principal modulé sur 3 niveaux → niveau adaptatif Moins/Pareil/Plus disponible.

**Type B — Pilier à travail personnel non-graduable (2 piliers).** S5 Repos et régénération, S7 Mindset. Mécanique alternative : évaluation 12 questions **conservée** (elle alimente la toile d'araignée et affiche un diagnostic 5 niveaux à l'utilisateur en IA-41 pour donner une lecture du terrain), **mais le mapping D40 n'a pas lieu** et il n'y a pas de paramètre principal modulé. Tout le monde démarre au même endroit et progresse via une **structure narrative sur les 7 jours**, calibrée par Jacky dans la Feature Spec dédiée.

**Structures narratives Type B (V1.4).**

*S7 Mindset (validée Jacky 12 mai 2026).* Jours 1-2 → OBSERVER (voir les pensées négatives). Jours 3-4 → TRANSFORMER (changer l'angle). Jours 5-6-7 → IMPACTER (ressentir les effets). Message global : *« Tu vas voir ton mental. Puis tu vas le changer. Puis tu vas comprendre son impact. »* Détail des consignes quotidiennes à formaliser dans la Feature Spec S7 dédiée.

*S5 Repos et régénération.* Structure narrative à formaliser dans la Feature Spec S5 dédiée, sur la base du fichier pilier V0 qui annonçait un programme "identique sur 7 jours".

**Contexte :** Lors de la session du 12 mai 2026, Jacky a tranché que S5 Repos et S7 Mindset relèvent d'un travail personnel qui ne se gradue pas en intensité quantitative. Citations Jacky brutes : sur S7, *« Je dirais qu'il n'y a pas de niveau, tout le monde démarre du début et progresse, on va dire que c'est plus un travail personnel qu'un truc à faire en intensité graduelle »* ; sur S5, *« Idem que pour S3 [lapsus pour S7] Mindset. Oui un seul niveau d'engagement. »* Justification clinique : le Mindset ne se travaille pas en faisant "plus de Mindset" mais en traversant un processus narratif (observer → transformer → impacter). Le Repos ne se gradue pas en augmentant la durée de sieste mais en restaurant globalement la régénération nerveuse, ce qui passe par une posture qualitative plutôt que par une quantification. La rupture avec la mécanique E/P/I est cohérente avec la nature de ces piliers.

**Conséquences structurelles.**

*Sur l'axe 2 de Métriques V1 (évaluations).* La règle D40 ne s'applique qu'aux 6 piliers Type A. Sur S5 et S7, l'évaluation 12 questions reste présente mais le mapping vers engagement de départ saute. Les libellés narratifs des 5 niveaux de diagnostic S5 et S7 restent affichés à l'utilisateur en IA-41 comme lecture du terrain.

*Sur l'axe 3 (matrice 8×8 Annexe B).* Les colonnes S5 et S7 de la matrice 8×8 restent calibrées E/P/I mais leur statut change : **indicatives pour la Phase 0 multi-piliers parallèle** (où l'intensité peut moduler selon l'archétype) et **non-opérantes en Phase 1** (où S5 et S7 ne suivent pas la mécanique E/P/I). Pas de modification du contenu des cases — seul le statut opérationnel l'est. La 3e case d'arbitrage soft (paramètre principal S5) devient automatiquement résolue par D41 (plus de paramètre principal sur S5).

*Sur l'axe 4 (niveau adaptatif et paramètre principal).* Le tableau § 4.3 des paramètres principaux par pilier ne contient plus que les 6 piliers Type A en V1.4. S5 et S7 retirés du tableau. Le niveau adaptatif (Moins / Pareil / Plus de IA-44) n'a pas de sémantique opérante sur S5 et S7 en V1, faute de paramètre principal à moduler.

*Sur le statut V2+.* La typologie Type A / Type B est posée pour la V1. Elle pourra être révisée en V2 si l'observation en production révèle d'autres piliers qui mériteraient le statut Type B, ou inversement si S5 ou S7 trouvent une mécanique gradable pertinente. Pas un sujet à rouvrir en V1.

**Impact docs :** Métriques V1 V1.4 § 1.8 nouvelle sous-section formalisant la typologie. § 2.5 patché pour mentionner l'exception Type B. § 3.4 patché pour clarifier l'articulation Phase 0 / Phase 1 sur S5 et S7. § 4.3 refondu pour retirer S5 et S7 du tableau des paramètres principaux. § 4.4 patché. Annexe B note V1.4 sur les colonnes S5 et S7 indicatives Phase 0. Glossaire enrichi (Type A, Type B). Feature Specs S5 et S7 dédiées : à structurer en mode "structure narrative 7 jours" plutôt que "3 niveaux d'engagement". Brief contenu V1 : copy IA-41 sur S5 et S7 à adapter (pas de mention d'engagement E/P/I sur ces deux piliers, accent sur la posture personnelle). Information Architecture V1 : pas de modification d'écrans (les mêmes écrans IA-40 à IA-47 servent, le mapping interne change). Schéma de données V1 : pas de modification (la persistance d'un `currentEngagementLevel.{pilarId}` reste utile pour les piliers Type A, optionnelle ou fixée à une valeur sentinelle pour S5/S7).

---

## Décisions reportées

### D12 — Fréquence et contenu précis des notifications Mimi & Jacky
**Statut :** reporté — sera traité dans la Feature Spec et le Brief contenu V1.

**Principes directeurs actés :** maximum 1-2 notifications/jour en Phase 0, 1/jour en Phase 1. Ton aligné Brand Core (sans emojis, sans sur-promesses, registre dense et incarné). Variété : rappels d'action / invitations à l'observation / encouragements / messages de fond. Plage de silence 22h-8h locales (D32). Cinq familles candidates posées dans le Socle minimum (rappel quotidien, rappel de session, célébration de palier, alerte joker, retour absence). Pour chaque famille, déterminer en D12 : fréquence par défaut, comportement si déclencheur dans la plage de silence (avancer ou annuler), texte précis.

---

### D13 — Détail des principes de sortie S8
**Statut :** reporté — sera traité dans la Feature Spec après discussion équipe.

**Principes directeurs actés (Customer Journey V1.2, section 6) :** célébrer ce qui a été acquis, proposer un mode "consolidation libre", activer la proposition de mentorat à ce moment, maintenir l'abonnement comme valeur même sans nouveau contenu.

---

### D14 — Calcul détaillé de la toile d'araignée
**Statut :** **TRANCHÉ V1.4 (12 mai 2026) — résolu dans Métriques V1 V1.4.**

**Décision actée :** 8 branches alimentées par évaluation initiale (IA-40) et finale (IA-46) de chaque pilier de Phase 1. Calcul : 12 questions × échelle 1-5 → score brut /60 → normalisation 0-100 par la formule `(score_brut - 12) × (100 / 48)`. Trois états visuels par branche (en attente / initiale grisée / finale couleur, cf. § 1.5 Métriques V1.4). Mise à jour à chaque évaluation. Honnêteté pédagogique radicale en cas de régression (D38). Détail complet dans Métriques V1.4 § 1 (axe 1) et § 2 (axe 2).

---

### D15 — Mapping profil onboarding → niveau de départ par pilier
**Statut :** **TRANCHÉ V1.4 (12 mai 2026) — résolu dans Métriques V1 V1.4.**

**Décision actée :** Deux mécaniques articulées. (1) En **Phase 0**, le profil archétype calculé à l'onboarding (9 archétypes dont 1 défaut, cf. Métriques V1.4 § 3.2) calibre le niveau de départ par pilier via la **matrice 9 × 8 = 72 cases** (Annexe B de Métriques V1.4, validée Jacky 12 mai en cadrage général + 3 cases en validation soft). (2) En **Phase 1**, l'évaluation 12 questions du pilier en cours pose un diagnostic 5 niveaux qui mappe automatiquement vers un engagement de départ E/P/I via la **règle simplifiée D40** sur les 6 piliers Type A. Sur les 2 piliers Type B (S5, S7), pas de mapping — tout le monde démarre au même endroit (cf. D41). En cas de divergence Phase 0 / Phase 1, l'évaluation initiale prime — le déclassement éventuel est une intention pédagogique assumée (cf. D40 et Annexe D.3 de Métriques V1.4).

---

### D16 — Calibrage du contenu bonus Phase 1 (conversion précoce)
**Statut :** reporté — sera traité dans la Feature Spec et le Brief contenu V1.

**Principes directeurs actés :** déblocage progressif, 1-2 pièces de contenu par jour, ordre suivant les piliers de Phase 1, types de contenu = vidéos d'intro Mimi & Jacky + podcasts + lectures. Total à dimensionner pour couvrir 9-12 jours d'attente max (cas d'un abonnement à J3).

---

## Périmètre V1 acté (état au 5 mai 2026)

L'app V1 couvre :

1. **Onboarding** : 10 slides séquentielles avec questionnaire 4 dimensions, profil dynamique parmi 8, engagement explicite. Le profil calibre le niveau de départ par pilier en Phase 0 (Option B de personnalisation). Démarrage différé optionnel à la création de compte si moins de 4h avant minuit local (D24).
2. **Phase 0** : 14 jours gratuits, multi-piliers en parallèle (7 actions quotidiennes : activation matin, froid, mouvement ou récupération, minéralisation, fenêtre digestive, fruits, soirée), 4 phases narratives (J1-J4 Mise en route, J5-J8 Le corps répond, J9-J11 La vraie transformation, J12-J14 La maîtrise). Niveau adaptatif manuel disponible. Validation streak à **5 actions sur 7 minimum** (D6 modifié 7 mai 2026), soft-rappel non-culpabilisant sous le seuil (D26). Quatre écrans de jour-charnière (J3, J7, J11, J14) qui se superposent à l'accueil au premier lancement du jour.
3. **S0** : transition de **2 jours** gratuits. S0.1 célèbre les 14 jours et révèle la toile d'araignée. S0.2 présente la roadmap des 8 semaines et enchaîne sur l'évaluation initiale du pilier S1 Respiration.
4. **Phase 1** : 8 semaines payantes, ordre acté par **D39** (Respiration → Activité physique → Alimentation → Connexion au vivant → Repos et régénération → Passion et chemin de vie → Mindset → Élimination et détox). Structure-type par semaine : évaluation initiale 12 questions, mapping automatique vers engagement de départ via la règle D40 (Type A : 6 piliers) ou structure narrative 7 jours sans mapping E/P/I (Type B : S5 et S7, cf. D41), 3 sessions/jour, niveau adaptatif manuel sur Type A, test avant/après session, évaluation finale, mise à jour de la branche correspondante de la toile d'araignée (D38 : honnêteté pédagogique radicale en cas de régression). Validation streak à 1 session sur 3 minimum. Habitudes Phase 0 retirées (optionnelles, sans check). Une seule vidéo d'intro par pilier (D33).
5. **Sortie S8** : célébration, mode consolidation libre, mentorat passe en proposition active.
6. **Mécaniques transverses** : check quotidien sans modification rétroactive (D27), streak avec joker hebdomadaire et 6 paliers de récompense (7/15/30/60/100j et 1 an) avec vidéo de 30s au premier franchissement et redéclenchement allégé après cassure (D29). Coordination palier 15j et S0.1 : IA-20 prime, IA-50 différé d'un cran (D30). Notifications Mimi & Jacky en différé avec plage de silence 22h-8h locales (D32). Score de vitalité en toile d'araignée. Niveau adaptatif manuel sans changement automatique mais messages de suggestion autorisés (D31 enrichi 7 mai 2026). Pas de score quotidien par pilier (D34). Pas de badges par pilier (D35) — les libellés Jacky restent réutilisables comme titres de moments narratifs en cours de semaine. Pas de questionnaire de fin de journée Phase 0 (D36). Effet miroir qualitatif sans chiffres en V1, chiffres de cohorte différés V2 (D37). Conversion accessible dès J3, contenu bonus en déblocage progressif pour les conversions précoces. Storage local-only (D28). Architecture multilingue prévue dès V1, contenu V1 français uniquement (D23). Absence prolongée traversant un changement de phase : écrans narratifs joués un par session (D25).
7. **Architecture de navigation** : tab bar à 3 onglets (Accueil, Toile, Profil). L'onglet Toile est masqué pendant la Phase 0 et apparaît au S0.1. Pas de rattrapage automatique des jours manqués — le calendrier de l'app suit le calendrier réel.
8. **Workflow technique** : repo local `RawAdventureRN` (React Native + Expo), commits directs sur `main` avec validation Stéphane, GitHub privé à connecter. CLAUDE.md à la racine du repo comme contexte projet pour Claude Code.

Hors scope V1 : Phase 2 (intégration des piliers), Phase 3 (9 mois thématiques), live, masterclass temps réel, coaching 1-to-1 dans l'app, intégrations tierces, multi-tier d'abonnement, personnalisation automatique de l'intensité, score de vitalité affiché en Phase 0, détox hardcore, sélecteur de langue dans l'app, traduction effective des contenus, modification rétroactive des checks journaliers, suggestion automatique de réajustement du niveau d'entrée, synchronisation multi-appareil ou backend cloud, score quotidien par pilier (D34, différé V2), niveau de discipline 4 paliers (D34, différé V2), badges par pilier (D35, différé V2), questionnaire de fin de journée Phase 0 (D36, différé V2), chiffres de cohorte sur l'effet miroir (D37, différé V2).

---

## Points de vigilance au lancement

À monitorer activement sur les premiers utilisateurs.

- **Le "wow" corporel avant J7.** Hypothèse à valider en test utilisateur (5 à 10 testeurs) avant le lancement public.
- **La sortie S8 sur Élimination et détox.** Sortir sur fierté ouverte au mentorat ou sur effort soutenu ?
- **Le placement de Passion et chemin de vie en S6.** Pause réflexive efficace ou rupture trop forte ?
- **Le maintien des habitudes Phase 0 pendant la Phase 1.** Abandon spontané ou maintien partiel ? Si abandon massif et reprise difficile en S5, ajuster en V1.5.
- **Le pas de rattrapage en cas d'absence prolongée.** Si décrochage massif au retour parce que les utilisateurs ressentent qu'ils "ont raté" la semaine, ajuster en V1.5 par un mécanisme léger sans rallonger les phases.
- **La perte du streak après désinstallation ou changement de téléphone (D28).** Acceptable en V1, mais à monitorer dès qu'on a une cohorte d'utilisateurs payants. Sera un irritant utilisateur réel à volume, et déclencheur probable de la migration backend en V2.
- **Le seuil de 4h avant minuit pour le démarrage différé (D24).** Calibrage à valider — trop tôt et on prive l'utilisateur d'un démarrage immédiat ; trop tard et on lui propose un J1 trop court.
- **Le redéclenchement allégé des paliers après cassure (D29).** Bien reçu pédagogiquement ou frustrant ? Le compteur interne `tier{N}ReachedCount` permettra une analyse sur cohorte.

---

## Documents à jour suite à ces décisions

- **Product Vision v2.2** : intègre toutes les décisions tranchées D1 à D11 et D17 à D20, plus les points de vigilance.
- **Customer Journey V1.2** : acte D1 à D11 et D17 à D20.
- **Information Architecture V1** : documente la structure de l'app, les 43 écrans V1 plus IA-10b et IA-10c (ajoutés en V5), la nav globale, les 7 flows utilisateur clés. Acte D17 à D20 et D24.
- **Audit copy V1** : couvre les 10 slides d'onboarding, les 8 profils dynamiques, les jours-charnières J4 / J11 / J14, les notifications et messages de récompense streak.
- **Feature Spec V1 Socle minimum** : documente les conventions d'écriture, les mécaniques transverses globales, les fiches d'écran S0, le format-type intro de pilier. Acte D23 à D33.
- **Métriques V1 V1.4 (12 mai 2026)** : **point stable final** de la logique métier de l'app (toile d'araignée, évaluations 12 questions, profils archétype + consolidé, niveau adaptatif, streak, KPIs business). Acte D14, D15, D38, D39, D40, D41. Tranche D34 et D36 par mise en cohérence.
- **CLAUDE.md du repo** : contexte projet pour Claude Code. Acte D21 et D22. À patcher en V2 pour intégrer D38-D41 et l'ordre canonique D39.

Documents à venir alimentés par ces décisions :

- **Feature Spec dédiée par pilier** — fiches détaillées des 8 piliers de Phase 1, à dériver du format-type IA-41 posé dans le Socle minimum. Distinction Type A (6 piliers : S1, S2, S3, S4, S6, S8 — format-type standard avec mécanique D40) / Type B (2 piliers : S5, S7 — format alternatif avec structure narrative 7 jours, cf. D41). Commencer par S1 Respiration comme pilier-pattern Type A.
- **Brief contenu V1** — détail des 14 jours de Phase 0 et des 8 semaines de Phase 1, scripts vidéo et notifications par jour, scripts des 6 vidéos de récompense streak, scripts vidéo S0.1 + S0.2 et écrans de jour-charnière, scripts des 8 vidéos d'intro de pilier, copy des slots identifiés dans le Socle minimum. Inputs spécifiques V1.4 : matière clinique brute Annexe C de Métriques V1.4, matière copy brute Annexe D de Métriques V1.4 (phrase régression, citation diagnostic 5 niveaux / engagement 3 niveaux, citation déclassement Phase 0 → Phase 1).

---

## Historique des versions

**Version 8 — 12 mai 2026.** Patch suite à la livraison de **Métriques V1 V1.4 stable** (12 mai 2026) intégrant les réponses Jacky à la Note session V5.0. Ajout de quatre nouvelles décisions structurelles : **D38** (honnêteté pédagogique radicale en cas de régression à l'évaluation finale d'un pilier — formalisation a posteriori de la décision actée le 9 mai sur réponse Jacky du 8 mai, manquait dans la Synthèse), **D39** (ordre canonique des 8 piliers de Phase 1 figé par Jacky le 9 mai 2026, succède à D8 du 3 mai désormais obsolète), **D40** (règle simplifiée diagnostic → engagement de départ, remplace la table 5×8 = 40 cases envisagée jusqu'en V1.3 de Métriques), **D41** (typologie Type A / Type B des piliers — 6 piliers à intensité graduelle suivant la mécanique standard, 2 piliers S5 et S7 à travail personnel non-graduable avec structure narrative 7 jours). Patches associés : **D14** (calcul détaillé toile d'araignée) et **D15** (mapping profil onboarding → niveau de départ par pilier) passent du statut "reporté" à "tranché par Métriques V1.4". Ordre des piliers Phase 1 dans la section périmètre V1 migré de D8 vers D39. Liste des docs à jour enrichie de Métriques V1.4. CLAUDE.md du repo identifié comme à patcher en V2 (mention de D38-D41 et de l'ordre canonique D39 à intégrer).

**Version 7 — 9 mai 2026 (mention rétrospective dans V8).** Cette version interne intermédiaire correspond à la mention "D31 à D38" trouvée dans Métriques V1 V1.1. Elle n'a pas fait l'objet d'un patch dédié de la Synthèse à l'époque — les décisions D31 à D37 étaient déjà actées en V6, et D38 (honnêteté pédagogique radicale) n'a été formalisée dans la Synthèse qu'en V8 le 12 mai. La V7 reste donc une étiquette de cohérence interne plutôt qu'une version distincte du registre des décisions.

**Version 6 — 7 mai 2026.** Patch suite à la livraison de l'audit V0 vs docs fondateurs (`raw-adventure-audit-v0-vs-docs-fondateurs.md`). Modification en place de **D6** (seuil de validation Phase 0 passe de 4/6 à 5/7, conséquence N1 du Bonus de l'audit) et **D31** (précision sémantique : aucun changement automatique de niveau par l'app, mais messages de suggestion autorisés, conséquence M11 du Bloc 2). Ajout de quatre nouvelles décisions : **D34** (pas de score quotidien par pilier en V1, conséquences B3 et N3), **D35** (pas de badges par pilier en V1 — libellés Jacky réutilisables comme titres de moments narratifs, conséquence B4), **D36** (pas de questionnaire de fin de journée Phase 0 en V1, conséquence N4), **D37** (effet miroir qualitatif en V1, chiffres de cohorte différés V2, conséquence N5). Périmètre V1 mis à jour pour refléter les 7 actions quotidiennes Phase 0, le seuil 5/7, les 4 phases narratives 4-4-3-3, et les nouveaux reports V2. Hors scope V1 enrichi des reports issus de D34-D37. Cette V6 ouvre la sous-séquence cadrage du Plan de patches en cascade — les autres docs fondateurs (IA V1, Feature Spec V1, Métriques V1 V0.3 → V1.0, CLAUDE.md du repo, nouveau Schéma de données V1) seront patchés dans les étapes 2 à 7 en aval.

**Version 5 — 5 mai 2026.** Ajout des décisions D23 à D33 actées dans le cadre de la production de la Feature Spec V1 Socle minimum. D23 acte l'architecture multilingue prévue dès la V1 avec contenu français uniquement. D24 acte le démarrage différé optionnel à la création de compte (seuil de 4h avant minuit local), avec ajout de deux nouveaux écrans IA-10b et IA-10c. D25 acte la mécanique d'absence prolongée traversant un changement de phase (écrans narratifs joués un par session). D26 acte le soft-rappel non-culpabilisant en Phase 0 sous le seuil. D27 acte l'absence de modification rétroactive des checks journaliers. D28 acte le storage local-only V1. D29 précise la mécanique des paliers (premier franchissement avec vidéo, redéclenchement allégé après cassure). D30 acte la coordination palier 15j et S0.1 (IA-20 prime, IA-50 différé). D31 acte le niveau adaptatif manuel uniquement (pas de suggestion automatique). D32 acte la plage de silence des notifications 22h-8h locales. D33 acte une seule vidéo d'intro par pilier (8 vidéos au lieu de 24). Périmètre V1 mis à jour avec ces décisions transverses. Points de vigilance enrichis. Liste des docs à jour enrichie de la Feature Spec V1 Socle minimum.

**Version 4 — 5 mai 2026.** Ajout des décisions D21 (workflow git Claude Code : commits directs sur main avec validation, pas de branches feature en V1) et D22 (repo GitHub privé à connecter, pas open source). Ces décisions accompagnent la création du CLAUDE.md à la racine du repo. Périmètre V1 acté enrichi d'un point 8 sur le workflow technique. Liste des docs à jour enrichie du CLAUDE.md.

**Version 3 — 5 mai 2026.** Ajout des décisions D17 à D20 actées dans le cadre de la production de l'Information Architecture V1. D17 tranche la durée du S0 à 2 jours (S0.1 + S0.2), ce qui clôt le point d'attention de D1. D18 acte le modèle de navigation à 3 onglets (Accueil, Toile, Profil) avec onglet Toile masqué en Phase 0. D19 acte les 4 écrans de jour-charnière en Phase 0 (J3, J7, J11, J14). D20 acte le principe "pas de rattrapage automatique des jours manqués". Périmètre V1 mis à jour avec ces décisions. Liste des docs à jour enrichie de l'Information Architecture V1. Référence Product Vision passée de v2.1 à v2.2.

**Version 2 — 3 mai 2026.** Mise à jour majeure suite à la réunion équipe avec Mimi & Jacky. D7 (conversion précoce) et D8 (ordre des piliers) tranchées. Ajout des décisions D9 (habitudes Phase 0 optionnelles), D10 (récompenses streak à 6 paliers), D11 (mentorat visible passif en Phase 1). Décision D4 enrichie du niveau adaptatif manuel. Décision D6 enrichie des seuils de validation Phase 0 (4/6) et Phase 1 (1/3). Périmètre V1 mis à jour. Points de vigilance au lancement consolidés.

**Version 1 — 2 mai 2026.** Création du document. D1 à D6 tranchées. D7 (conversion précoce) et D8 (ordre des piliers) en discussion équipe. D9 à D11 reportées.

---

*Document vivant, à mettre à jour à chaque arbitrage produit.*

# Raw Adventure App — Customer Journey V1.3

*Document de référence — parcours utilisateur de la V1 (Phase 0 + S0 + Phase 1, soit environ 10 semaines d'expérience). Dérivé du Product Vision v2.2, du Brand Core, des User Personas v1, et confronté au proto Phase 0 codé dans Claude Code (avril 2026) ainsi qu'au spec Pilier 1 Respiration. Mis à jour le 5 mai 2026 pour intégrer les décisions D6 à D20 actées entre-temps (voir Synthèse des décisions V3) et l'Information Architecture V1. **Patch V1.3 du 13 mai 2026** : migration ordre canonique D8 obsolète → D39 dans toutes les mentions du document (§ "L'arc narratif des 8 semaines", récapitulatif des principes, liste des décisions actées). Aucune modification des principes pédagogiques ni des moments-charnières.*

---

## Cadrage du document

Ce Customer Journey décrit l'expérience que la V1 doit produire chez Isabelle et Caroline, semaine par semaine et aux moments-charnières. Il n'est pas la spec exhaustive du produit. Il fixe la dramaturgie, identifie les points de bascule, signale les écarts entre ce qui est codé aujourd'hui et ce que la vision exige, et acte les principes de conversion entre l'essai et l'abonnement.

Il alimentera la Feature Spec, l'Information Architecture, et le brief contenu. Trois zones sont délibérément renvoyées à des documents dédiés : le calcul précis du score de vitalité, la réécriture du copy, et la séquence de conversion détaillée. On en fixe les principes ici, on laisse l'exécution ailleurs.

Le parcours est documenté comme un récit principal unique. Là où Isabelle et Caroline divergent, on l'indique en encart. Là où elles convergent, on ne dédouble pas.

---

## 1. Pre-app — Avant que l'utilisateur télécharge

### Ce qui se passe pour Isabelle

Isabelle suit Mimi & Jacky depuis dix-huit mois. Elle a vu passer l'annonce de l'app sur Instagram, en a entendu parler dans plusieurs stories, a peut-être vu une story-récap après une réunion de l'équipe. Sa décision de tester est prise avant le lancement. Elle télécharge le jour de l'ouverture publique, motivée par la confiance accumulée. Elle n'a pas besoin d'être convaincue par la landing — elle est convaincue par la marque. Elle s'attend à un produit dense, crédible, à la hauteur du ton qu'elle connaît sur Insta.

Risque pre-app : si le screenshot de l'app sur le store ressemble à une app wellness générique avec dégradés violets et émojis cœur, elle hésite. Le visuel store doit refléter le Brand Core, pas un template Figma.

### Ce qui se passe pour Caroline

Caroline ne connaît pas Raw Adventure. Elle découvre via une publicité froide ou via une recommandation indirecte (une amie, un podcast, une recherche "fatigue chronique solutions naturelles"). Elle clique sur la landing avec scepticisme. Elle lit attentivement, cherche les témoignages, vérifie qu'on ne lui promet pas la lune. Elle a une dette de confiance que Raw Adventure devra rembourser.

Si elle s'inscrit, c'est en mode "je teste les 14 jours gratuits, on verra bien". Elle arrive sur l'app prête à juger. Le pre-app est moins un moment d'enthousiasme qu'un test produit qu'on doit gagner dès l'ouverture.

Risque pre-app : si la landing utilise les codes du wellness creux ("transforme ta vie", "réveille ton plein potentiel"), Caroline ne télécharge même pas. La cohérence ton landing → app est non-négociable.

### Implication pour le produit

Les deux personas convergent sur une exigence : **ce qu'on promet sur la landing doit être tenu littéralement dès l'ouverture de l'app**. Pas de gap entre la promesse et le ton du premier écran. C'est plus stratégique qu'esthétique.

---

## 2. Onboarding — Les 10 slides du jour 0

L'onboarding actuel est codé en 10 slides séquentielles : accroche, promesse, positionnement, quatre questions (énergie, corps, mental, motivation), profil dynamique synthétisé, engagement, lancement.

### Ce qui fonctionne

La structure en 10 slides courtes est juste. La ritualisation — accroche / promesse / questions / profil / engagement / lancement — crée une dramaturgie d'entrée qui évite l'effet "questionnaire administratif". Les quatre dimensions interrogées (énergie, corps, mental, motivation) sont les bonnes : elles couvrent le ressenti subjectif sans demander de données médicales ou biométriques.

La case "Je joue le jeu pendant 14 jours" en slide 8 est un excellent ressort psychologique. Elle transforme le passage à l'app en engagement actif, pas en clic passif. C'est exactement la posture scientifique-expérimentale du Brand Core : "tu acceptes de tester, on observe, on ajuste."

### Ce qui pose problème — écarts avec le Brand Core

Trois écarts à signaler, par ordre de gravité.

Premier écart, le plus critique : **les emojis dans le copy produit**. Le Product Vision les interdit explicitement. L'onboarding actuel en est saturé : ⚡️ 🪶 🧠 🎯 😴 😐 💪 🌱 🔥 🧘 🌀 🚀 🌅 🧹 🪶. Sur les 10 slides, presque aucune n'est sans émoji. Pour Isabelle, c'est un signal "encore une app coach Insta". Pour Caroline, c'est un déclencheur de scepticisme immédiat. Recommandation : retirer tous les emojis du copy, garder éventuellement des pictogrammes graphiques (différents des emojis émotionnels) si la charte graphique le justifie. Les emojis qui restent doivent être une décision design assumée, pas un automatisme de copy.

Deuxième écart : **les sur-promesses**. Slide 1 : "plus d'énergie / corps plus léger / esprit plus clair". Slide 7 (profil reboot complet) : "Dans 14 jours, tu ne te reconnaîtras plus." Slide 7 (profil reboot ≤3) : "La remontée commence dès demain." Ce sont des promesses qu'aucune app sérieuse ne peut tenir avec certitude. Le Brand Core demande "rationnel mais incarné, inspirant sans naïveté". Recommandation : remplacer par des formulations qui décrivent ce qu'on propose, pas ce qui est garanti. "On va explorer ce qui change quand tu modifies certaines bases" plutôt que "tu ne te reconnaîtras plus".

Troisième écart : **le slogan de positionnement slide 2**. "Pas de théorie inutile. Juste du concret à faire chaque jour." C'est juste sur le fond, mais le ton glisse vers le registre coach Insta direct. Le Brand Core demande "dense, direct, crédible, structuré". Une formulation comme "On ne t'explique pas la physiologie. On te la fait sentir. Pendant 14 jours, tu testes, tu observes, ton corps répond" reste directe sans tomber dans le slogan publicitaire.

### Le profil dynamique — fausse personnalisation visible

Les 8 profils dynamiques affichés en slide 7 sont une mécanique intelligente : ils donnent à l'utilisateur le sentiment qu'on l'a vraiment écouté. Mais comme le profil est sauvegardé en base sans modifier le contenu des 14 jours, il y a un écart entre la promesse et la réalité du J1. Isabelle, qui lit attentivement, s'en apercevra dès le J3 ou J4. Caroline, qui est sur la défensive, repérera le pattern "on me met dans une case mais le programme est le même pour tout le monde".

Trois options pour traiter cet écart en V1, par ordre d'ambition.

Option A, conservatrice : on assume la fausse personnalisation et on l'utilise uniquement pour adapter le ton et l'angle des messages quotidiens, pas le contenu. Le profil "reboot complet" reçoit des notifications avec un cadrage différent du profil "Tu es déjà lancé", même si l'action proposée est identique. Faible coût technique, gain perçu réel.

Option B, médiane : on garde les 14 jours identiques mais on personnalise le **niveau de départ** sur certains piliers (par exemple le froid : profil reboot commence à 2s, profil "déjà lancé" commence à 5s). Coût technique modéré, gain perçu fort.

Option C, ambitieuse : on adapte vraiment certains jours selon le profil. Trop coûteux pour la V1.

Recommandation : Option A pour la V1, avec étude de l'Option B en parallèle si le contenu écrit est suffisamment modulaire pour le supporter sans effort.

### Implication pour le produit

L'onboarding tient debout structurellement. Le travail à faire est un travail de copy et de cohérence de ton, pas un travail de refonte. Signaler ces écarts dans un futur "Audit copy V1" et les traiter avant le lancement public.

---

## 3. Phase 0 — Les 14 jours gratuits

Le proto code la Phase 0 en quatre phases narratives bien identifiées : J1-J4 "Mise en route", J5-J8 "Le corps répond", J9-J11 "La vraie transformation", J12-J14 "La maîtrise". On documente le parcours bloc par bloc en évaluant à chaque fois la dramaturgie face à Isabelle et Caroline. Les jours-charnières (J1, J3, J7, J11, J14) sont traités individuellement.

### Le format d'expérience quotidien

Chaque jour propose une **checklist de 6 piliers** : activation matinale (5min respiration nasale), défi froid, mouvement, minéralisation (eau de mer ou jus de légumes), fenêtre digestive, premier repas (fruits), soirée sans écrans. Ces six items évoluent en intensité à travers les phases mais restent les mêmes. La fenêtre digestive glisse de 10h30 à midi, le défi froid passe de 2 secondes à un protocole complet 5s/15-20s, les écrans passent de 1h à 1h-2h.

C'est une UX **multi-piliers parallèle** qui contraste volontairement avec la Phase 1 mono-pilier. Cette logique est cohérente avec le Cadrage : la Phase 0 fait découvrir le panorama, la Phase 1 isole. Mais elle pose une question de charge cognitive qu'on traite plus loin.

### Les écrans de jour-charnière

Quatre jours de la Phase 0 affichent un **écran narratif spécial** qui se superpose à l'accueil au premier lancement du jour : **J3, J7, J11 et J14** (D19). Ces écrans matérialisent la dramaturgie décrite dans les blocs ci-dessous — sans eux, les jours-charnières passent inaperçus et l'arc narratif s'aplatit. À J3, l'écran introduit la possibilité de s'abonner ("le bouton est là si tu veux assurer la suite"). À J7, il célèbre la fin de la phase narrative 1 ("ton corps a déjà commencé à parler"). À J11, il prépare à la zone difficile et donne du contexte ("c'est normal de sentir une fatigue ici, c'est le signe que tu changes"). À J14, il prépare la transition vers le S0 ("demain, on ouvre la suite"). Chacun de ces écrans s'affiche une seule fois, peut être passé, ne réapparaît pas. Le détail de chaque écran est documenté dans l'Information Architecture V1 (IA-14, avec ses 4 variantes).

### Bloc J1-J4 — Mise en route

L'intention narrative est juste : on installe l'habitude d'ouvrir l'app, on fait découvrir les six piliers sans les expliquer en profondeur, on calibre l'intensité au plus bas pour ne perdre personne. Les sous-titres sont calibrés émotionnellement avec une vraie pensée derrière : J3 "Le cap critique" est positionné exactement au moment statistique où la majorité des apps habit-tracker perdent leurs utilisateurs. C'est de la dramaturgie comportementale, pas du remplissage.

**Le J1 est le moment où Caroline se fait son opinion**. Elle a téléchargé en mode test. Elle ouvre l'app, découvre la checklist 6 piliers. Premier risque : elle trouve ça trop. Six trucs à faire en J1, c'est beaucoup pour quelqu'un qui n'avait pas signé pour ça. Le sous-titre "Pas de perfection — juste commencer" est essentiel pour désamorcer. À vérifier : est-ce que l'app permet de cocher seulement 1 ou 2 piliers le J1 sans casser le ressenti de progression ? Si elle n'a coché que la respiration et l'eau de mer, est-ce qu'elle reçoit "tu as commencé" ou "tu as échoué 4 piliers sur 6" ? Cette différence fait Caroline ou la perd.

**Le J3 — moment-charnière critique.** Le sous-titre "C'est ici que la plupart des gens lâchent" est un excellent levier psychologique de loss aversion. Il transforme un moment de risque en moment d'opportunité d'identité ("je passe ce cap, je suis du bon côté"). Mais il a une condition d'efficacité : Caroline n'a pas encore senti grand-chose à J3. La fenêtre digestive est passée de 10h30 à 10h30, le froid de 2s à 3s, le mouvement reste équivalent. Si elle ne ressent pas un signal corporel au J3 ou J4 maximum, elle ne passe pas le cap quel que soit le sous-titre. Recommandation : vérifier que dans la rédaction des notifications du J3-J4, on **invite explicitement à observer un signal précis** (par exemple : "ce matin, en sortant de la douche froide, prends 30 secondes pour observer ta peau, ta respiration, ta température. Note ce que tu sens"). Sans cette invitation à la lecture du corps, le ressenti reste flou et Caroline conclut "je sens rien".

**J4 "L'identité"**, sous-titre "Tu es en train de devenir quelqu'un de discipliné." Pour Isabelle, c'est efficace — elle se reconnaît dans ce cadre. Pour Caroline, c'est ambivalent — elle ne s'est pas inscrite pour devenir disciplinée, elle s'est inscrite pour ressentir un changement. Recommandation : envisager une variante de copy qui parle ressenti plutôt que discipline pour les profils "Caroline-like" si l'Option A de personnalisation est retenue.

### Bloc J5-J8 — Le corps répond

L'intention narrative monte : intensité légèrement augmentée (froid 5s, accélérations cardio, fenêtre 11h), et surtout les sous-titres travaillent l'engagement long terme ("La majorité des personnes qui arrivent au Jour 8 finissent le challenge"). C'est solide.

**Le J7 — moment-charnière "La moitié".** C'est le point de bascule. À ce stade, Isabelle a déjà décidé si elle s'abonne (elle est probablement en train de réserver son abonnement annuel). Caroline est dans la phase de jugement actif : a-t-elle ressenti quelque chose ? La promesse implicite des 14 jours doit être à moitié tenue à J7. Si Caroline n'a pas eu **au moins un signal corporel marquant** entre J1 et J7, elle décroche silencieusement entre J7 et J9. Le persona Caroline est explicite là-dessus : "Caroline arrive avec une dette de confiance — Raw Adventure doit la rembourser en sensations corporelles dans la première semaine."

Risque produit majeur : la dramaturgie de la Phase 0 est belle, mais elle repose sur l'hypothèse que les six piliers réunis vont **forcément** produire un wow corporel avant J7. Cette hypothèse est-elle vérifiée ? On n'a pas de test utilisateur. Il faut, avant le lancement, valider sur 5 à 10 testeurs externes que le wow arrive bien avant J7. Si non, il faut renforcer un des piliers à dose-réponse rapide (typiquement le froid ou la fenêtre digestive) sur les jours 3-5.

### Bloc J9-J11 — La vraie transformation

Phase d'ancrage identitaire. Le froid franchit un palier (10-15s en fin de cycle), le mouvement intègre 5 accélérations 30s, la fenêtre digestive passe à 11h30. Les sous-titres "La base" (J10) et "Plus que 3 jours" (J11) construisent l'engagement vers la fin.

**Le J11 "Tu n'as plus le droit d'arrêter."** Formulation forte, à double tranchant. Pour Isabelle, ça fonctionne — elle aime le cadre et la posture engagée. Pour Caroline, ça peut être perçu comme manipulatoire si la confiance n'est pas encore acquise. Recommandation : si l'Option A de personnalisation est retenue, envisager une variante "Tu y es presque. Tiens jusqu'au bout, même imparfaitement."

### Bloc J12-J14 — La maîtrise

Consolidation. Le froid devient un protocole complet (5s d'emblée + 15-20s en fin), le mouvement passe à 30-45min intensité libre, la fenêtre digestive atteint midi. Les sous-titres construisent la fierté ("Tu n'as pas juste suivi un programme. Tu as repris le contrôle."). Cohérent.

**Le J14 — moment-charnière "La fin et le début".** Voir partie 4 pour la conversion. Mais d'un point de vue dramaturgique pur, le sous-titre est juste : il prépare l'utilisateur à comprendre que ce n'est pas la fin. Cette charnière émotionnelle est exploitable pour la conversion si elle est traitée avec finesse.

### Risques transverses Phase 0

Trois risques que la dramaturgie actuelle ne résout pas complètement.

**Risque 1 — La charge des 6 piliers en parallèle.** Six items à cocher chaque jour, c'est plus que ce que demande la "moins d'une minute par jour en routine" du Product Vision. Si on compte la respiration nasale 5min + douche froide 2-15s + mouvement 20-45min + jus/eau de mer + fenêtre digestive (qui n'est pas une action mais une contrainte) + repas fruits + soirée sans écrans (45min-2h), on est sur 1h-2h d'engagement quotidien réel, pas une minute. La "moins d'une minute" du Product Vision parle du **check** dans l'app, pas du temps de pratique. Mais cette distinction n'est probablement pas claire pour l'utilisateur, qui voit 6 cases à cocher et anticipe une charge. Recommandation : retravailler le copy d'introduction du J1 pour clarifier "ces 6 piliers prennent X minutes au total par jour, mais tu coches en 30 secondes". Faire de la transparence sur la charge plutôt que la cacher.

**Risque 2 — Isabelle et le syndrome "je connais déjà".** Le persona prévient : Isabelle peut décrocher cognitivement si elle voit "respiration nasale 5min" et pense "je fais ça en yoga". La parade côté contenu, c'est de proposer une **lecture du corps** qu'elle n'a pas eu en yoga. Pas un nouvel exercice, mais un nouveau cadre d'observation. Recommandation : dans les notifications J1-J3, proposer systématiquement une question d'observation post-action ("Après ta respiration de ce matin, est-ce que tu ressens [signal X] que tu n'avais peut-être jamais identifié ?"). C'est moins une feature qu'un parti-pris d'écriture.

**Risque 3 — Le décalage Phase 0 / Phase 1 dans l'UX.** Voir partie 4.

### Synthèse Phase 0

La dramaturgie codée est solide et structurellement prête pour la V1. Les ajustements à faire sont de l'ordre du copy, du calibrage de ton, et de la validation utilisateur du wow J7. Pas de refonte. Le travail principal d'écriture porte sur les notifications et messages quotidiens, qui doivent s'aligner sur le Brand Core (sans emojis, sans sur-promesses, registre dense et incarné).

---

## 4. Le passage J14 → S1 — Conversion et bascule UX

C'est le moment le plus risqué de la V1. Deux problèmes superposés : la conversion essai → payant, et le changement de mode de l'app entre Phase 0 (multi-piliers parallèle) et Phase 1 (mono-pilier focus). L'écran de conversion actuel (ConversionScreen avec abonnement direct Mensuel 19€ / Trim 49€ / Annuel 149€) traite le premier problème. Le second n'est pas traité du tout.

### Principes de conversion

**Principe 1 — La conversion ne se fait pas au même moment pour Isabelle et Caroline.** Isabelle convertira **avant J14**, possiblement dès J3 ou J5. Elle est déjà engagée dans la marque, elle ne veut pas subir un écran de conversion à J15 — elle veut pouvoir s'abonner quand elle décide, ce qui peut être très tôt. Caroline, elle, ne décidera **qu'à J14**, voire après une période de réflexion post-J14. Si la conversion est concentrée sur le seul écran J15, on rate Isabelle (qui voulait s'abonner plus tôt sans frottement) et on stresse Caroline (qui n'est pas prête à décider tout de suite).

Recommandation : **rendre l'abonnement accessible à tout moment dans l'app**, sans intrusion. Concrètement, un bouton discret apparaît sur l'écran d'accueil **dès J3**, en bas ou dans un encart latéral, jamais en plein milieu. Cette décision est actée par D3 et complétée par D7 (conversion précoce avec contenu bonus). Quand l'utilisateur s'abonne avant la fin de la Phase 0, il continue la Phase 0 normalement jusqu'à J14, puis fait le S0, puis attaque la S1 — pas de saut de phase. Pendant cette période d'attente, il a accès à un **contenu bonus Phase 1 en déblocage progressif** (vidéos d'intro Mimi & Jacky par pilier, podcasts, lectures), à raison de 1 à 2 pièces par jour. Le message porté à l'abonné précoce est explicite : "les 14 jours sont calibrés pour que ton corps installe les bases avant qu'on isole un pilier — tu ne perds pas de temps, tu construis."

Le J15 conserve sa fonction d'écran narratif de palier (célébration des 14 jours + révélation du S0 et de la roadmap), pas de paywall. C'est le S0.1 dans l'Information Architecture V1.

**Principe 2 — Le J15 n'est pas un paywall, c'est un palier narratif.** Si on présente J15 comme "tu as fini, paie maintenant ou tu perds tout", on casse la confiance. Caroline lira ça comme un funnel marketing classique. Recommandation : J15 doit être un écran qui **célèbre les 14 jours**, montre ce qui a été installé (le score de vitalité, les habitudes acquises, les premiers ressentis observés), et **propose la suite** de manière calme. La suite, c'est la Phase 1, et c'est désirable parce que c'est la promesse "maintenant on isole, tu vas vraiment comprendre". L'abonnement est le moyen d'accéder à cette suite, pas une demande de paiement abstraite.

**Principe 3 — Pour qui ne convertit pas avant ou au moment de la fin de Phase 0, l'app reste accessible en lecture mémoire mais la progression s'arrête.** C'est un compromis entre le hard paywall (qui braque Caroline) et l'accès gratuit illimité (qui tue le modèle économique). L'utilisateur garde accès à son historique, son score de vitalité actuel, ses habitudes installées, mais il ne reçoit plus de nouveaux contenus, plus de notifications nouvelles, plus de progression débloquée. Recommandation : prévoir un système de **relance non-intrusive** sur 7 à 14 jours après le J15 pour les non-convertis (1 mail de Mimi & Jacky, pas de notif push agressive, pas de séquence de pression). Avec la conversion accessible dès J3, le cas du "non-converti à J15" devient plus rare — mais il existe encore et doit être géré sans agressivité, particulièrement pour Caroline qui peut avoir besoin de quelques jours supplémentaires de réflexion après J14.

**Principe 4 — Pas de tier multiple, pas de A/B sur le pricing en V1.** Le Product Vision est explicite : un seul niveau d'abonnement. Décision finale actée dans le Product Vision v2.2 : **deux durées d'engagement** (mensuel et annuel), pas de trimestriel. Le proto actuel propose trois durées (Mensuel 19€ / Trim 49€ / Annuel 149€) et doit être refondu pour ne garder que mensuel et annuel. Recommandation : afficher les deux options côte-à-côte avec annuel mis en avant (best value) et mensuel comme entrée. Laisser le choix sans pousser. La grille de prix précise sera arrêtée en Feature Spec.

### Le pont narratif Phase 0 → Phase 1

C'est le trou produit le plus grave aujourd'hui. L'utilisateur qui s'abonne à J15 va découvrir la S1 sans préparation. Or l'UX change de mode :

| Dimension | Phase 0 | Phase 1 |
|-----------|---------|---------|
| Nombre de piliers travaillés | 6 en parallèle | 1 isolé |
| Durée d'engagement | 1h-2h diffus | 3 sessions ciblées |
| Type d'évaluation | Onboarding initial unique | Évaluation 12 questions par pilier |
| Choix utilisateur | Niveau global | Niveau d'intensité par pilier |
| Score | (à concevoir) Score de vitalité global | Score de présence respiratoire dédié |
| Tracking | Checklist 6 piliers | Sessions matin/midi/soir + ressenti |

Sans transition narrative, l'utilisateur perd ses repères. Il a passé 14 jours à cocher 6 piliers, et soudain on lui dit "maintenant tu fais 3 sessions de respiration par jour". C'est un cliff cognitif.

Recommandation : **insérer un "S0" de transition de 2 jours entre J14 et S1 réelle** (durée actée par D17). Cette transition se découpe en deux temps. Le **S0.1 célèbre les 14 jours accomplis et révèle pour la première fois la toile d'araignée à 8 branches** dans son état initial — c'est un moment de pause, sans check, où l'utilisateur digère ce qu'il vient de faire et découvre comment on va lire son évolution. Le **S0.2 présente la roadmap des 8 semaines, explique la logique d'isolation** (pourquoi on passe de 6 piliers en parallèle à 1 pilier isolé), **et enchaîne sur l'évaluation initiale du pilier S1 Respiration**. Cette mise en perspective transforme le passage en moment de désir, pas en moment de confusion.

Le S0 est dans le périmètre **gratuit**, parce qu'il fait partie de la pédagogie d'entrée et qu'il participe à la conversion. Caroline qui voit la roadmap des 8 semaines comprend mieux pour quoi elle paye. Cette décision est actée par D1 et D17 dans la Synthèse des décisions V3.

---

## 5. Phase 1 — Les 8 semaines d'isolation des piliers

Le spec du Pilier 1 Respiration sert de modèle pour structurer l'arc des 8 semaines. Il définit la **mécanique-type d'une semaine de Phase 1**, qu'on documente comme squelette. Les autres piliers reprendront cette structure avec leurs spécificités.

### La structure-type d'une semaine

Chaque semaine de Phase 1 reprend le même flow utilisateur en 9 étapes : introduction du pilier, évaluation initiale (12 questions, 5 niveaux de résultat), choix du niveau d'intensité, 7 jours de pratique, observation finale, comparaison avant/après, récompense, projection vers le pilier suivant.

Cette structure est intelligente parce qu'elle crée un **rythme prévisible** d'une semaine à l'autre. L'utilisateur sait à quoi s'attendre : début de semaine, je suis évalué et je choisis mon niveau ; pendant 7 jours, je pratique avec un focus quotidien progressif ; fin de semaine, je mesure ce qui a changé. Ce rythme protège contre la fatigue cognitive et contre la lassitude des 8 semaines.

Trois mécaniques transversales du Pilier 1 méritent d'être généralisées à tous les piliers de la Phase 1.

**Le test avant/après session.** "Ton calme maintenant ? 1 à 5" avant la session, idem après, et l'app affiche "cette session a modifié ton état de +2 points". Le spec le qualifie d'"un des effets wow les plus puissants". C'est juste. Cette mécanique transforme l'expérimentation en démonstration personnelle, ce qui est exactement la posture scientifique du Brand Core. Elle est indispensable pour Caroline qui a besoin de preuves de ressenti, et appréciée par Isabelle qui aime objectiver. À répliquer sur chaque pilier.

**L'évaluation initiale en 12 questions.** Elle remplit deux fonctions : elle calibre le niveau d'entrée (lien avec l'Option B de personnalisation), et elle donne à l'utilisateur un point de départ mesurable. Sans elle, le "tu progresses" est subjectif. Avec elle, l'utilisateur peut comparer son score initial à son score final de semaine. À répliquer sur chaque pilier, avec 12 questions adaptées à la dimension travaillée.

**Les 3 niveaux d'intensité (Essentiel / Progression / Immersion).** Cette mécanique répond directement au risque persona "Isabelle décroche par scepticisme si c'est trop basique". Elle peut choisir Niveau 2 ou 3, ressentir un vrai challenge, et garder son intérêt. À répliquer sur chaque pilier. Mais attention : le contenu pédagogique reste le même, seule l'intensité change. C'est une décision produit forte (cohérente avec "le contenu respiration reste le même, seul change : intensité, durée, engagement"). Elle évite le piège de devoir produire 3 contenus différents par pilier.

### L'arc narratif des 8 semaines

L'ordre des 8 piliers a été tranché par Mimi & Jacky. L'ordre canonique en vigueur est **D39** (figé par Jacky le 9 mai 2026, succède à D8 du 3 mai 2026 désormais obsolète) : **Respiration → Activité physique → Alimentation → Connexion au vivant → Repos et régénération → Passion et chemin de vie → Mindset → Élimination et détox.**

*Note migration D8 → D39.* La V1.2 de ce document raisonnait sur l'ordre D8 (Respiration → Alimentation → Mindset → Condition physique → Repos → Passion → Connexion → Élim.). La V1.3 (13 mai 2026, patch en sortie de production Feature Spec S1) migre vers l'ordre D39. Le contenu interne de chaque pilier reste identique — paramètres principaux, calibrage E/P/I, matière clinique brute. Seuls les numéros de position changent. Les 4 principes d'ordonnancement narratif ci-dessous (effet rapide en S1, alternance physique/subtil, identitaires en milieu et fin, S8 prépare la sortie) restent valides — ils sont reformulés avec les positions D39 dans les paragraphes suivants.

Les principes d'ordonnancement qui ont guidé ce choix.

**Principe 1 — Commencer par un pilier à effet rapide et tangible.** Le pilier 1 doit produire un wow corporel net dès la première semaine, sinon Caroline ne renouvelle pas son abonnement au M2. La **Respiration** est un excellent choix de pilier 1 : effet sur le calme et le système nerveux mesurable en quelques jours, technique simple, accessible à tous les niveaux. C'est aussi un pilier qui reprend la respiration nasale de la Phase 0 mais l'approfondit, ce qui crée un fil de continuité narratif.

**Principe 2 — Alterner piliers physiques et piliers plus subtils.** L'ordre validé alterne ce rythme : Respiration (subtil) → Activité physique (concret) → Alimentation (concret) → Connexion au vivant (subtil et grounding) → Repos et régénération (mixte avec retour du froid) → Passion et chemin de vie (identitaire et soft) → Mindset (subtil) → Élimination et détox (concret). L'utilisateur n'est jamais épuisé sur 2 semaines de file de hardcore physique ni 2 semaines de file d'introspection. *Note V1.3 — Avec l'ordre D39, S2-S3 enchaîne deux piliers concrets (Activité physique puis Alimentation) avant le retour au subtil en S4 ; ce regroupement de 2 piliers physiologiques est assumé comme phase d'ancrage corporel après l'ouverture par S1 Respiration.*

**Principe 3 — Placer les piliers identitaires en milieu et fin de parcours.** Passion et chemin de vie en S6 et Mindset en S7 demandent une certaine maturité dans le parcours. À monitorer : est-ce que S6 fait pause réflexive efficace ou crée une rupture trop forte avec les piliers physiologiques précédents et suivants ? C'est un point de vigilance au lancement.

**Principe 4 — Le pilier 8 prépare la sortie.** **Élimination et détox** en S8 est un choix délibéré (D39 conserve la position S8 d'origine). C'est une détox douce (jus + psyllium), pas une cure dure. La S8 démontre que les nettoyages sont accessibles — "c'est pas si pire que ça, c'est faisable". Pas de détox hardcore en V1. À monitorer : est-ce que l'utilisateur sort de S8 sur fierté ouverte au mentorat ou sur effort soutenu ? L'arc narratif de fin de S8 doit produire le premier ressenti.

**Précisions sur les choix forts.** Le froid n'est pas un pilier autonome de Phase 1 — il est intégré au pilier Repos et régénération (S5) principalement, et touche aussi au pilier Mindset (S7 dans l'ordre D39). La Connexion au vivant en S4 (D39) s'incarne concrètement comme grounding et contact à la nature (arbres, potager, mer, montagne, éléments, reconnaissance des êtres vivants), pas dans un registre new age années 70. La pratique de Phase 1 approfondit la pratique Phase 0 quand le pilier correspond (la respiration nasale de la Phase 0 trouve son extension en S1 Respiration), mais les checks des habitudes Phase 0 sont **retirés** en Phase 1 (D9). Posture pédagogique de Jacky : "ne pas mettre toujours +++, rééduquer, aiguiser nos sens".

### Les semaines-charnières

**S1 — Le pilier de la preuve.** Tout se joue ici pour la rétention M1 → M2. Si l'utilisateur ne voit pas son score de présence respiratoire monter sur 7 jours, et s'il ne ressent pas un changement subjectif, il ne renouvellera pas. Le moment-clé est probablement J3-J4 de la S1, quand le test avant/après session commence à produire des deltas significatifs.

**S4 — Le mi-parcours.** Statistiquement, c'est là que la motivation chute. L'effet de nouveauté est passé, la fin n'est pas en vue. Avec l'ordre acté, S4 = **Condition physique**, qui est un pilier à effet ressenti fort (mouvement, accélérations, intensité physique) — bon choix pour relancer la motivation au mi-parcours. Le palier streak des **30 jours** tombe naturellement vers le milieu de S4 ou début S5 selon le rythme de connexion, ce qui apporte une récompense intermédiaire intégrée (D10) : message Mimi & Jacky personnalisé du palier 30j + vidéo de récompense de 30 secondes. La gamification streak prend le relais quand l'effet de nouveauté retombe.

**S8 — La fin de Phase 1.** Voir partie 6.

### Le score de présence par pilier

Chaque pilier a son score local (le spec Respiration parle de "score de présence respiratoire" calculé sur sessions / minutes / ressenti). Ce score est différent du score de vitalité global (toile d'araignée) traité en partie 7. La distinction doit être claire pour l'utilisateur :

- Le score local mesure la pratique de la semaine en cours (engagement + qualité)
- Le score global de vitalité mesure l'état du pilier dans la vie de l'utilisateur (lecture du corps)

L'évaluation initiale en 12 questions de chaque pilier alimente le score global (la branche correspondante de la toile d'araignée). La pratique quotidienne alimente le score local. À la fin de la semaine, l'évaluation finale met à jour le score global de la branche.

---

## 6. Sortie de Phase 1 — Le risque "et après ?"

Fin de S8. L'utilisateur a passé 8 semaines à isoler des piliers, il a vu sa toile d'araignée évoluer, il a installé des habitudes. La Phase 2 (mois d'intégration) et la Phase 3 (9 mois thématiques) ne sont pas codées. Que voit-il ?

### Le risque

Si l'utilisateur arrive en fin de S8 et que l'app lui dit "bravo, c'est fini", on perd : le M3 de l'abonnement, l'opportunité de conversion mentorat, et une partie de la promesse Brand Core ("tu fonctionnes mais tu n'es pas en vitalité — on t'accompagne").

Si on lui dit "la Phase 2 arrive bientôt", on crée de la frustration sans valeur tangible. Pire, on l'invite à se désabonner en attendant.

### Les principes de sortie

**Principe 1 — La fin de S8 doit célébrer ce qui a été acquis, pas annoncer ce qui manque.** L'écran post-S8 affiche la toile d'araignée avant/après, l'évolution sur les 8 dimensions, les scores locaux par pilier. C'est un moment de fierté objectivée.

**Principe 2 — Proposer un mode "consolidation libre" pendant le développement de la Phase 2.** L'utilisateur peut rejouer un pilier qui l'a marqué, ou pratiquer plusieurs piliers en parallèle de manière auto-pilotée (sans guidance jour-par-jour). C'est cohérent avec la promesse "à terme on intègre les piliers", même si la Phase 2 formalisée n'est pas là.

**Principe 3 — Introduire le mentorat à ce moment précis.** Décision actée par D11 : le mentorat est **visible mais passif** dans l'app de la S1 à la S7 (un onglet dans le menu, mention dans le profil utilisateur, sans push commercial, sans notification). À la fin de S8, il **passe à proposition active** avec ouverture libre vers la prise de RDV. C'est le design du tunnel de vente Raw Adventure : on prépare en V1, on convertit à la sortie de la V1. Argument structurant : si on parle du mentorat trop tôt en Phase 1, on dit implicitement "l'app ne suffit pas, prends un mentor", ce qui sape la promesse V1. Compromis retenu : présence visible mais passive (pas d'invasion) + proposition active à S8. C'est le moment d'ouverture maximale — l'utilisateur a 8 semaines de pratique derrière lui, il sait que le système marche, il sent ses limites en autonomie. Le Cadrage stratégique liste explicitement "à la fin des 8 piliers" comme l'un des trois moments de conversion vers le mentorat. Pas de hard-sell, juste une porte ouverte.

**Principe 4 — Maintenir l'abonnement comme valeur même sans nouveau contenu.** Tant que la Phase 2 n'est pas livrée, l'abonnement donne accès à : l'historique complet, le mode consolidation, le score de vitalité dynamique, les notifications de Mimi & Jacky en différé. Il faut que ces éléments aient une valeur perçue suffisante pour ne pas justifier un désabonnement.

### Implication pour le produit

La sortie de S8 est une zone à concevoir explicitement, pas un état par défaut. Elle conditionne la rétention M3+ et la conversion mentorat. À traiter dans la Feature Spec avec autant de soin que l'onboarding J1.

---

## 7. Mécaniques transverses

Quatre mécaniques traversent toute l'expérience V1 et ne peuvent pas être documentées jour par jour. Elles sont l'ossature engagement de l'app.

### Le check quotidien

Le geste-clé du produit. Moins d'une minute en routine, conformément au Product Vision. En Phase 0, c'est la checklist 6 piliers. En Phase 1, c'est la validation des 3 sessions du pilier de la semaine + le ressenti du jour. Dans les deux cas, l'objectif est le même : marquer la journée, donner un signal de progression, alimenter le streak.

Principe directeur : le check ne doit jamais demander à l'utilisateur de réfléchir. Pas de question ouverte, pas de saisie longue. Trois clics maximum pour marquer une journée comme faite. Le ressenti subjectif (1-5 ou bas/moyen/bon) est optionnel, pas bloquant.

### Le streak

Mécanique éprouvée (Duolingo, Strava). Affiche les jours consécutifs, encourage la régularité. Implémentation actée par D6 et D10.

**Joker hebdomadaire (D6).** 1 jour "raté" par semaine ne casse pas le streak, en Phase 0 comme en Phase 1. Au-delà, le streak est cassé et redémarre. Le seuil de validation Phase 0 : la journée est validée si l'utilisateur a coché **au moins 4 piliers sur 6**. Sous le seuil, le joker est consommé. Le seuil de validation Phase 1 : la journée est validée si l'utilisateur a fait **au moins 1 session sur les 3 prévues**. Rappel pédagogique de Jacky : "mieux vaut 3 petites sessions que 1 grosse" — la fréquence prime sur la durée. La cassure du streak est un moment de relance positive ("le streak repart de zéro demain, continue, c'est la régularité qui compte"), pas un coup de bâton. Le copy précis est traité dans l'Audit copy V1.

**Six paliers de récompense (D10).** Le streak est valorisé par 6 paliers : **7j, 15j, 30j, 60j, 100j, 1 an**. Chaque palier déclenche un message Mimi & Jacky personnalisé par palier (le message du 30j est le même pour tous, mais différent du message du 7j) et une **vidéo de récompense de 30 secondes** par palier. Les 6 vidéos forment un chemin narratif progressif (la vidéo 30j ne ressemble pas à la 7j, chacune approfondit le propos). Ces 6 vidéos sont un livrable concret pour Mimi & Jacky avant lancement (environ une demi-journée de tournage si bien préparées). Cette gamification reste légère, sans levels, sans étoiles multipliées, sans leaderboard — juste des paliers de streak avec récompense vidéo, dans l'esprit de l'app Sadhguru "Miracle of Mind".

### Les notifications Mimi & Jacky

Conformément au Product Vision, voix de l'app en différé. Les notifications signées Mimi & Jacky alimentent la présence quotidienne sans nécessiter leur disponibilité réelle.

Principe de fréquence : 1 à 2 notifications par jour maximum en Phase 0, 1 par jour en Phase 1. Trop de notifications cassent la sensation d'incarnation et glissent vers le harcèlement push. Le Brand Core est explicite : ton dense, direct, sans emojis, sans exclamations, sans sur-promesses. Une notification doit ressembler à un message qu'un mentor aurait écrit, pas à un push d'app fitness.

Principe de variété : les notifications alternent rappels d'action ("ta session de respiration t'attend"), invitations à l'observation ("ce matin, après ton froid, prends 30 secondes pour observer"), encouragements ("tu as passé le J3, c'était le cap critique"), et messages de fond ("voilà ce qu'on fait là, et pourquoi"). C'est cette variété qui fait la voix incarnée.

### Le score de vitalité — toile d'araignée

Principe directeur fort, à acter ici comme orientation V1.

**Le score de vitalité est un graphe en toile d'araignée à 8 branches, une par pilier de Phase 1**. Chaque branche évolue en fonction de l'évaluation initiale et finale du pilier correspondant. À l'entrée dans l'app (post-onboarding ou post-J14), l'utilisateur voit une toile d'araignée plus ou moins déformée — c'est sa "lecture du corps" globale. Au fil des semaines de Phase 1, les branches travaillées s'agrandissent visiblement.

Cette visualisation réconcilie deux exigences en tension :

- "Score de vitalité simple et lisible" du Product Vision (une vue agrégée immédiatement compréhensible)
- Logique d'isolation des piliers du Cadrage (chaque pilier a sa réalité propre, pas une moyenne plate)

Elle donne aussi une **raison narrative supplémentaire à la Phase 1**. L'utilisateur comprend pourquoi on travaille une branche à la fois : "tu vois la branche Respiration grandir en S1 pendant que les autres restent stables. C'est la preuve visuelle que ce pilier isolé t'a vraiment changé. Imagine ce que donneront les 8 branches travaillées." C'est de la dramaturgie produit.

Principes de design à respecter :

- La toile d'araignée doit être lisible en 2 secondes. Pas un graphique technique avec axes numérotés, mais une forme.
- Les 8 branches sont nommées par mots simples (Respiration, Sommeil, Mouvement, etc.), pas par jargon.
- L'évolution est visible (animation, mémoire avant/après), pas juste un état figé.
- Le calcul précis de chaque branche (entrée, mise à jour hebdomadaire, pondération du ressenti vs pratique) est traité dans le doc dédié "Métriques V1".

À noter : en Phase 0, la toile d'araignée n'a pas de branches alimentées par les évaluations (qui n'existent qu'en Phase 1). **Décision actée par D5 : la toile est masquée pendant toute la Phase 0 et révélée au moment du S0.1**, comme moment narratif fort. Argument retenu : si les utilisateurs n'arrivent pas au bout des 14 jours, mieux vaut retravailler la conversion des 14 jours plutôt que de donner de la confiture aux cochons. Réserver la révélation au S0.1 en fait un palier narratif fort, déclencheur potentiel de conversion. Le détail des écrans S0.1 et S0.2 est documenté dans l'Information Architecture V1 (IA-20 et IA-21).

---

## 8. Synthèse — Risques V1 et points d'attention

Les zones où la V1 peut casser, classées par criticité. Plusieurs risques identifiés dans la version initiale de ce doc ont été tranchés depuis (S0, conversion non-concentrée sur J15, ordre des piliers, gestion du streak) ; cette synthèse reflète l'état au 5 mai 2026.

**Critique — Le wow corporel avant J7.** Si Caroline ne ressent rien de marquant avant J7, elle décroche silencieusement. À valider en test utilisateur (5-10 testeurs) avant le lancement. Si négatif, renforcer un pilier dose-réponse rapide.

**Critique — Le ton de l'onboarding.** Les emojis, les sur-promesses, et le registre coach Insta du copy initial contredisent le Brand Core et activent le radar à bullshit de Caroline. Traité dans l'Audit copy V1 (livré, à valider par Mimi & Jacky avant intégration).

**Critique — Le pont J14 → S1.** Risque résolu structurellement par l'insertion du S0 de transition à 2 jours (D1, D17). À monitorer en test utilisateur que le rythme S0.1 + S0.2 est bien digéré, sans cliff.

**Important — La sortie de S8 sur Élimination et détox.** Choix délibéré justifié par le caractère doux de la détox (jus + psyllium). À monitorer : sortir sur fierté ouverte au mentorat ou sur effort soutenu ? L'arc narratif de fin de S8 doit produire le premier ressenti.

**Important — Le placement de Passion et chemin de vie en S6.** Pause réflexive délibérée entre les piliers plus hardcore. À monitorer : maintien du rythme ou rupture trop forte ?

**Important — Le maintien des habitudes Phase 0 pendant la Phase 1.** Décision assumée de retirer les checks (D9). À monitorer : maintien spontané ou abandon massif, particulièrement avant la S5 (Repos et régénération qui réintègre le froid). Si abandon massif et reprise difficile en S5, ajuster en V1.5 par un mécanisme léger de rappel.

**Important — Le pas de rattrapage en cas d'absence prolongée.** Décision actée que le calendrier app suit le calendrier réel (D20). À monitorer : si décrochage massif au retour parce que les utilisateurs ressentent qu'ils "ont raté" la semaine, ajuster en V1.5 par un mécanisme léger sans rallonger artificiellement les phases.

**Surveillance — La charge des 6 piliers en Phase 0.** Risque de perception "trop demandé". À surveiller en test utilisateur, ajuster le copy d'introduction si besoin.

**Surveillance — La fausse personnalisation.** Le profil dynamique de l'onboarding promet une adaptation. Décision actée : Option B (le profil calibre le niveau de départ par pilier, pas seulement le ton) + niveau adaptatif manuel (D4). Le mapping précis profil → niveau de départ par pilier sera défini en Feature Spec avec Mimi & Jacky.

---

## 9. Décisions tranchées dans ce document

Les décisions actées au moment de la rédaction initiale de ce Customer Journey, complétées par les décisions tranchées depuis (voir Synthèse des décisions V3 pour le détail et la référence Dn).

**Décisions actées dans la V1 du Customer Journey :**

1. Le Customer Journey couvre Phase 0 (14 jours) + S0 de transition + Phase 1 (8 semaines). Le S0 est une nouveauté à intégrer dans le proto. *(Tranché par D1 et D17 — durée actée à 2 jours.)*
2. L'abonnement est accessible à tout moment dans l'app, pas concentré sur J15. J15 devient un palier narratif, pas un paywall. *(Tranché par D3.)*
3. Le ConversionScreen actuel doit être refondu autour du palier narratif fin de Phase 0 + perspective Phase 1 (présentation de la toile d'araignée et de la roadmap des 8 semaines). *(Tranché par D3, refonte documentée dans l'Information Architecture V1 — IA-30.)*
4. Le score de vitalité V1 est une toile d'araignée à 8 branches (une par pilier de Phase 1), introduite au passage S0. *(Tranché par D2 et D5 — masquée en Phase 0, révélée au S0.1.)*
5. Chaque pilier de Phase 1 reprend la structure-type du Pilier 1 Respiration : évaluation 12 questions, 3 niveaux d'intensité (Essentiel/Progression/Immersion), 7 jours de pratique, test avant/après session, évaluation finale.
6. L'ordre des 8 piliers est fixé selon 4 principes (effet rapide en S1, alternance physique/subtil, identitaires en milieu et fin, S8 prépare la sortie). *(Tranché par D39, succède à D8 obsolète : Respiration → Activité physique → Alimentation → Connexion au vivant → Repos et régénération → Passion et chemin de vie → Mindset → Élimination et détox.)*
7. La fausse personnalisation est traitée en V1 via deux mécaniques coexistantes. *(Tranché par D4 : Option B — le profil dynamique calibre le niveau de départ par pilier, pas seulement le ton — + niveau adaptatif manuel via bouton moins/pareil/plus en cours de pratique.)*
8. La sortie de S8 est un livrable produit à part entière, traité dans la Feature Spec avec un mode consolidation + ouverture mentorat. *(Principes actés. Mentorat passe en proposition active à S8 — D11. Détail des principes de sortie reporté en D13.)*
9. Les écarts de ton de l'onboarding avec le Brand Core sont signalés dans ce doc et traités dans l'Audit copy V1. *(Audit copy V1 livré, à valider par Mimi & Jacky.)*
10. Le streak intègre une logique de joker hebdomadaire pour éviter la cassure punitive. *(Tranché par D6 : 1 joker/semaine en Phase 0 et Phase 1, seuils de validation 4/6 piliers en Phase 0 et 1/3 sessions en Phase 1.)*

**Décisions actées depuis la V1 du Customer Journey, intégrées dans cette V1.2 :**

11. Conversion précoce avec contenu bonus en déblocage progressif (D7) — l'utilisateur qui s'abonne avant la fin de Phase 0 continue la Phase 0 normalement et accède à du contenu bonus Phase 1 entre l'abonnement et le S0.
12. Habitudes Phase 0 retirées en Phase 1 (D9) — pas de check, pas de tracking, posture pédagogique de Jacky "ne pas mettre toujours +++".
13. Streak valorisé par 6 paliers de récompense (D10) — 7j, 15j, 30j, 60j, 100j, 1 an — chaque palier déclenche un message Mimi & Jacky personnalisé et une vidéo de 30 secondes. 6 vidéos à produire avant lancement.
14. Mentorat visible passif de S1 à S7, actif à S8 (D11) — onglet visible mais sans push commercial pendant Phase 1, proposition active à la sortie de S8.
15. Architecture de navigation à 3 onglets (D18) — Accueil, Toile, Profil. L'onglet Toile est masqué pendant la Phase 0 et apparaît au S0.1.
16. Quatre écrans de jour-charnière en Phase 0 (D19) — J3, J7, J11, J14, qui se superposent à l'accueil au premier lancement du jour.
17. Pas de rattrapage automatique des jours manqués (D20) — le calendrier de l'app suit le calendrier réel.
18. Système d'abonnement à un seul tier en V1, deux durées d'engagement (mensuel et annuel), pas de trimestriel — décision actée dans le Product Vision v2.2.

---

## 10. Ce qui reste à produire

État au 5 mai 2026.

**Documents livrés depuis la V1 du Customer Journey, intégrés dans cette V1.2 :**

- **Audit copy V1** — réécriture des 10 slides d'onboarding, 8 profils dynamiques, sous-titres des jours problématiques (J4, J11, J14), grilles d'écriture des notifications et messages de récompense streak. À valider par Mimi & Jacky avant intégration.
- **Information Architecture V1** — carte de l'app, 43 écrans documentés, nav globale à 3 onglets, 7 flows utilisateur clés. Sert de squelette à la Feature Spec et au CLAUDE.md du repo.

**Documents à produire dans les sessions à venir :**

- **CLAUDE.md du repo** — contexte projet pour l'assistant codeur. Court, structurant, autorise Claude Code à travailler sereinement dans le repo. Recommandé avant d'attaquer la Feature Spec.
- **Feature Spec V1** — spec technique des écrans et fonctionnalités, dérivée de l'Information Architecture V1. Gros morceau, probablement 2 à 4 sessions de travail.
- **Métriques V1** — calcul du score de vitalité (toile d'araignée), pondérations, mise à jour, ainsi que les KPIs business (conversion, rétention, NPS).
- **Brief contenu V1** — détail des 14 jours de Phase 0 et des 8 semaines de Phase 1, scripts vidéo et notifications par jour, scripts des 6 vidéos de récompense streak, scripts vidéo S0.1 + S0.2 et écrans de jour-charnière. Peut être attaqué en parallèle de la Feature Spec si Mimi & Jacky sont disponibles pour les tournages.

---

## Historique des versions

**Version 1.2 — 5 mai 2026.** Mise à jour pour intégrer les décisions D6 à D20 actées entre-temps. Évolutions principales :

- Durée du S0 actée à 2 jours, avec détail S0.1 (célébration + révélation toile) et S0.2 (roadmap + évaluation S1) (D17)
- Ordre des 8 piliers de Phase 1 acté par Mimi & Jacky : Respiration → Activité physique → Alimentation → Connexion au vivant → Repos et régénération → Passion et chemin de vie → Mindset → Élimination et détox (D39, succède à D8 désormais obsolète)
- Streak avec joker hebdomadaire et seuils de validation (D6), plus 6 paliers de récompense avec vidéos de 30 secondes (D10)
- Personnalisation actée en Option B + niveau adaptatif manuel (D4)
- Toile d'araignée masquée en Phase 0, révélée au S0 (D5)
- Conversion précoce avec contenu bonus en déblocage progressif (D7)
- Habitudes Phase 0 retirées en Phase 1 (D9)
- Mentorat visible passif S1-S7, actif à S8 (D11)
- Architecture de navigation à 3 onglets actée (D18)
- Quatre écrans de jour-charnière en Phase 0 (D19)
- Pas de rattrapage automatique des jours manqués (D20)
- Système d'abonnement à un seul tier, deux durées (mensuel + annuel)
- Synthèse des risques actualisée pour refléter les arbitrages tranchés
- Section 9 enrichie de 8 décisions actées depuis la V1
- Référence Product Vision passée de v2 à v2.2

**Version 1 — 30 avril 2026.** Création du document. Dérivé du Product Vision v2, du Brand Core, des User Personas v1, du proto Phase 0 codé dans Claude Code, et du spec Pilier 1 Respiration.

---

*Document vivant, à mettre à jour à chaque évolution structurelle de la dramaturgie du parcours.*

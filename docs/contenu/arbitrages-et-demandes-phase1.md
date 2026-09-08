# Arbitrages et demandes de contenu — Phase 1 (S1 → S8)

*Version 1.0 — 8 septembre 2026. Document jumeau de la salve `docs/tests/salve-phase1-s1-s8.md`. Deux parties : les **arbitrages** (Partie A — Stéphane tranche ce qu'il peut pendant la salve ; ce qui reste part chez Jacky) et le **contenu à demander à Jacky & Mimi** (Partie B — consolidé depuis le code, les briefs et le kanban, sans redemander ce qui est déjà validé). Avancement à reporter dans `kanban/roadmap.json` (source de vérité).*

---

## Partie A — Arbitrages (Stéphane d'abord, reste → Jacky)

Pour chaque point : contexte, avis Claude, et deux cases à remplir pendant ou après la salve.

### A1 — Test de ressenti avant/après session (IA-43)

**Contexte.** L'Information Architecture, la structure-type Phase 1 et le Customer Journey décrivent la session en quatre temps : test de ressenti *avant* → pratique → test de ressenti *après* → validation. Le Customer Journey en fait « un des effets wow les plus puissants » du produit. Or l'écran de session codé ne l'implémente pas du tout (consigne → timer → validation) — omission jamais actée par une décision Dxx.

**Avis Claude.** C'est le principe 2 incarné (« le ressenti prime sur la théorie ») et la promesse différenciante de la Phase 1. Mais c'est un vrai chantier (mécanique + copy des échelles de ressenti + stockage) et D34/D36 montrent une prudence assumée sur tout ce qui alourdit le quotidien. Recommandation : trancher le **principe** maintenant (V1 ou V2), et si V1, cadrer le format minimal avec Jacky (une seule question de ressenti, pas un questionnaire).

- **Tranché par Stéphane :** _______________
- **→ Jacky (si non tranché) :** faut-il le test avant/après en V1, et sous quelle forme minimale ?

### A2 — Placement de la vidéo d'intro de pilier

**Contexte.** Le brief de tournage (Session 3) prévoyait la vidéo d'intro sur le chemin obligé : vidéo → 12 questions → diagnostic. En code, elle vit sur la vue d'ensemble du pilier (IA-42), que l'utilisateur peut ne jamais regarder attentivement. La charnière narrative hebdomadaire n'est donc pas garantie vue.

**Avis Claude.** L'ordre actuel (vue d'ensemble AVANT le questionnaire, décision du 18 juin) met déjà la vidéo en début de semaine — le vrai sujet est de savoir si elle est assez mise en avant (autoplay proposé ? étape à part entière ?). À vérifier pendant la salve : est-ce qu'on la regarde naturellement ?

- **Tranché par Stéphane :** _______________
- **→ Jacky/Mimi (si non tranché) :** la vidéo d'intro doit-elle être une étape bloquante du début de semaine ?

### A3 — Message de fin de session

**Contexte.** La Feature Spec S1 prévoit un message de fin de session (`copy.IA-43.s1.fin-session`) et des micro-messages J3/J5/J7. En salve du 4 septembre, l'Alert « Session validée » (no-op en PWA) a été retirée : la fin de session est aujourd'hui silencieuse (retour au hub, carte cochée).

**Avis Claude.** Le silence est défendable (sobriété, principe 4 : moins d'une minute), mais un mot sobre de Mimi & Jacky après l'effort est un moment de lien peu coûteux. Recommandation : réintroduire un message court non bloquant (bandeau, pas de modale), copy à produire par Jacky.

- **Tranché par Stéphane :** _______________
- **→ Jacky (si copy nécessaire) :** 1 message de fin de session par pilier (ou un générique), + micro-messages J3/J5/J7 de S1.

### A4 — Questions inversées S3 → S8 : simple confirmation

**Contexte.** Chaque pilier a sa propre distribution de questions inversées au calcul (S3 : Q4/6/8/10/12 ; S4 : Q4/9 ; S5 : Q3/4/5/6/10 ; S6 : Q4/7/8/10 ; S7 : Q2/3/4/7/8/11 ; S8 : Q4/5/6). Vérification faite le 8 septembre : **le code correspond exactement aux Feature Specs par pilier**, elles-mêmes issues de la matière Jacky. Ce n'est pas un bug — le point levé le 3 septembre est résolu côté cohérence code/spec.

**Avis Claude.** Il ne reste qu'une confirmation de fond à Jacky : ces distributions sont-elles voulues (ou des artefacts de sa matière V0) ? Une question de 5 minutes en session, avec la liste ci-dessus sous les yeux.

- **Tranché par Stéphane :** _______________
- **→ Jacky :** confirmer les distributions ci-dessus, pilier par pilier.

### A5 — Durées de session par défaut sur S3, S5, S7, S8

**Contexte.** Quatre piliers affichent les durées héritées de S1 (5/10/20 min) faute de calibrage propre. Cohérent avec leur type « acte libre » (pas de timer), mais c'est un défaut technique, pas une décision produit. S2 (30/45/60), S4 (5/20/45) et S6 (15/30/60) ont leurs durées propres.

**Avis Claude.** Pour un acte libre, la durée affichée sert surtout de cadre indicatif — soit on l'assume, soit on la masque pour ces piliers, soit Jacky donne un calibrage. À juger pendant la salve (grille « Session » des blocs C3/C5/C7/C8) : si l'affichage ne choque pas, assumer.

- **Tranché par Stéphane :** _______________
- **→ Jacky (si calibrage voulu) :** durées Essentiel/Progression/Immersion pour S3, S5, S7, S8.

---

## Partie B — Contenu à demander à Jacky & Mimi

*Consolidé au 8 septembre. Ce qui est déjà validé (onboarding, 7 actions Phase 0, charnières, paliers vidéos, 28 notifications Phase 0…) n'est PAS relisté. Référence kanban entre parenthèses.*

### B1 — Session de travail avec Jacky (validations texte, par priorité)

1. **S2 Activité physique — validation intégrale.** Les 12 questions, les 5 diagnostics et le programme 7 jours sont des drafts Claude inférés de sa matière brute, jamais validés. C'est le seul pilier dans ce cas. Lui soumettre le brief `brief-pilier-s2-activite-physique-v1.md` annoté par la salve (bloc C2). *(Nouvelle tâche kanban R4.)*
2. **S1 Respiration — les 5 messages de diagnostic.** Seuls textes de données pilier encore en `[copy à valider]` (Coûteuse / Instable / Adaptation / Fonctionnelle / Régulatrice). *(Nouvelle tâche kanban R4.)*
3. **Questions courtes S4, S5, S7, S8.** Formulations reprises telles quelles de sa matière V0, peu discriminantes (« Je me sens calme naturellement. »). Lui proposer de les densifier — avec les annotations de la salve (blocs C4/C5/C7/C8) comme matière. *(Nouvelle tâche kanban R4.)*
4. **Mapping 112 cases diagnostic × pilier** — déjà en cours avec lui (R4-12), à poursuivre.
5. **Confirmation des questions inversées** (Partie A4) et, selon les arbitrages A1/A3/A5 : format du test avant/après, messages de fin de session, durées S3/S5/S7/S8.
6. **Textes des paliers 15/30/60/100/365** — encore à valider (brief paliers, seuls les textes du 7j fusionné l'ont été).
7. **Copy des écrans de fin de parcours** : messages de différentiel du récap final (4 variantes), écran de sortie S8, intro consolidation, proposition mentorat — une dizaine de `[copy à valider]` visibles en prod sur ces écrans. *(Nouvelle tâche kanban R4.)*

### B2 — Tournages restants (Mimi & Jacky)

**Bonne nouvelle vérifiée le 8 septembre : les 8 vidéos d'intro de pilier sont en ligne** (bucket Supabase, 13-20 Mo chacune) — le kanban (R5-2/R5-6) était périmé, à corriger. Reste un contrôle visuel : le brief de tournage utilisait l'ancien ordre des piliers (avant D39) ; la salve vérifie que chaque vidéo parle du bon sujet (points de contrôle C4 et C7 en particulier). Si une vidéo est sur le mauvais slot, c'est un simple renommage de fichier côté Storage.

À tourner, dans l'ordre d'impact utilisateur :

1. **Vidéos S0.1 et S0.2** (célébration + roadmap — brief Session 2, scripts prêts) : moment charnière vu par 100 % des utilisateurs qui convertissent. *(R5-5.)*
2. **Vidéo de bienvenue J1 (IA-12)** : 20-25 s, textes validés, script draft prêt. Premier contact vidéo de tous les utilisateurs. *(R5-4.)*
3. **Vidéo de sortie S8 (IA-22)** : vue tard, mais moment fort. *(R5-7.)*

**Note de production** : corriger le mapping du brief Session 3 (`docs/brief-contenu/session-3-intro-piliers.md`) vers l'ordre canonique D39 avant tout re-tournage éventuel — l'ordre qui y figure (S3 Mindset, S4 Condition physique…) est l'ancien.

### B3 — Relectures Mimi (ton)

- Titre du soft-rappel « Tu peux faire mieux. » sous l'angle non-culpabilisant (D26) — déjà consigné en zone connue de la salve précédente.
- Variante de copy de charnière après une journée validée « au rabais » (2/7 + joker) — relevé du 8 juillet.
- Les annotations de ton issues de la grille contenu de la salve (colonne Notes), une fois la salve faite.

---

*Prochaine étape : dérouler la salve (`docs/tests/salve-phase1-s1-s8.md`), remplir les cases de la Partie A et annoter la Partie B, puis planifier la session Jacky avec ce document comme ordre du jour.*

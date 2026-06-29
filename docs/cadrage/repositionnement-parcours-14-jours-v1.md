# Repositionnement du parcours 14 premiers jours — Cadrage v1

*Doc de cadrage produit. Statut : draft à valider par Stéphane avant tout code. Daté du 18 juin 2026.*

*Objet : repenser le parcours client des 14 premiers jours (Phase 0). Trois chantiers liés : (1) minimiser le streak et maximiser les paliers, (2) mieux expliquer le parcours / qui on est / pour qui / les bénéfices, (3) redéfinir et affiner le narratif streak vs palier. Le chantier paywall est traité séparément, plus tard.*

---

## 1. Décisions prises en session (18 juin 2026)

Quatre arbitrages Stéphane qui cadrent ce doc :

| # | Décision | Choix retenu |
|---|---|---|
| A | Base de déclenchement des paliers | **Sur la progression (jours parcourus)**, plus sur le streak |
| B | Place du streak en Phase 0 | **Secondaire discret** — affiché petit, en retrait ; le palier/la progression dominent l'accueil |
| C | Densité des paliers sur 14 jours | **Garder 2** (J7, J15) — la rareté préserve la valeur ; l'importance vient de la proéminence, pas du nombre |
| D | Livrable de cette session | **Doc de cadrage d'abord** — pas de code maintenant |

Conséquence directe : ce doc ne touche aucun fichier code. Il décrit la cible. Les chantiers code (`streak.ts`, `ProgressContext.tsx`, écrans charnière) viendront après validation.

---

## 2. État actuel (ce qui existe dans le code aujourd'hui)

Trois mécaniques distinctes, souvent confondues :

**Écrans jour-charnière** — J3, J7, J11, J14. Overlays narratifs qui se superposent à l'accueil au premier lancement du jour (D19). Ce sont les moments *pédagogiques*. Gérés via `narrativeFlags` dans `ProgressContext.tsx`.

**Paliers de récompense** — seuils `TIER_THRESHOLDS = [7, 15, 30, 60, 100, 365]` dans `streak.ts`. Modale IA-50 + vidéo M&J de 30s au premier franchissement (D29), modale allégée aux suivants. Sur 14 jours, seuls 2 paliers tombent : **J7** et **J15** (et J15 est masqué par S0.1 via D30).

**Streak** — compteur continu de jours validés. Seuil 5/7 actions en Phase 0 (D6), 1 joker par semaine calendaire (D6). Affiché en permanence en haut de l'accueil. **Couplage actuel : les paliers se déclenchent à partir de la valeur du streak.**

Découplage déjà acquis (D38, 17 juin 2026) : `currentDay` (progression réelle dans le programme) est déjà calculé séparément du `streak`. C'est le levier technique qui rend la décision A applicable sans refonte profonde.

---

## 3. Streak vs palier — définitions affinées

### 3.1 Le problème actuel

Le streak, tel qu'il est, mesure la **continuité** et porte une **pression par la perte** implicite ("ne casse pas ta série"). Cette pression contredit frontalement la grille de copy (§4 CLAUDE.md : *« Pas de pression par la perte — ne perds pas ton streak »* est explicitement interdit) et le principe directeur 5 (*frustration positive*, pas anxiété). Le joker (D6) et le seuil 5/7 sont déjà des amortisseurs de cette pression, mais ils traitent le symptôme, pas la cause : tant que la récompense est branchée sur la continuité, la perte d'un jour fait perdre la récompense.

### 3.2 Les deux objets, redéfinis

**Le palier = accomplissement.** Il récompense le fait d'**avoir avancé** dans le parcours. Il se branche sur la progression (`currentDay`), pas sur le streak. Conséquence : un utilisateur qui rate un jour mais reprend ne perd jamais un palier déjà acquis ni la perspective du suivant — il avance vers lui dès qu'il refait une journée. C'est un objet **purement positif, événementiel, incarné** (M&J parlent, célèbrent), rare et donc précieux. C'est lui qu'on met en avant.

**Le streak = régularité, indicatif.** Il devient un indicateur secondaire de constance, affiché discrètement (décision B). Il n'ouvre plus de récompense. Il n'est jamais formulé comme une chose à *ne pas perdre*. Au mieux, il se formule comme une observation neutre de constance ("X jours de constance"), jamais comme un enjeu. En Phase 0, il reste visible mais en retrait ; la toile et les paliers sont les vrais marqueurs de sens.

### 3.3 Tableau de synthèse cible

| | Streak (après) | Palier (après) |
|---|---|---|
| Mesure | régularité, constance | progression franchie |
| Se branche sur | jours consécutifs validés | `currentDay` (jours parcourus) |
| Perdu si on rate un jour ? | oui (se remet à 0) | **non, jamais** |
| Récompense associée | aucune | vidéo / célébration M&J |
| Place à l'écran | secondaire, discret | dominant, mis en scène |
| Émotion visée | repère tranquille | fierté, cap franchi |

### 3.4 Narratif à tenir (voix M&J)

- Le palier se raconte comme un **cap de terrain** franchi, pas comme une médaille de performance. Vocabulaire : *cap, marge, observation, terrain, rythme installé*. Jamais *champion, série, record, ne lâche pas*.
- Le streak, quand il est nommé, est un **constat de régularité**, formulé sans enjeu de perte. Si la série casse, aucun message culpabilisant : on reprend, c'est tout (cohérent D26 soft-rappel).
- Slots de copy à produire/réviser : les écrans charnière, la modale palier (IA-50), le bandeau accueil (IA-11). Tout texte passe par un slot identifié (D23), pas de chaîne en dur.

---

## 4. Topics à couvrir sur les 14 jours

Constat de départ (Stéphane) : *on n'explique pas assez le parcours, qui on est, pour qui c'est, les bénéfices.* L'app fait *faire* sans assez *cadrer le sens*. Voici les blocs à transmettre sur la fenêtre, regroupés par intention.

### 4.1 Qui parle (crédibilité)
- Qui sont Mimi & Jacky : leur histoire, leur légitimité, pourquoi les écouter. Différenciation nette du coach Instagram (principe 6).
- Pourquoi ils parlent **en différé** et pas en live (principe 7) — c'est un choix, pas un manque.

### 4.2 Pour qui c'est (miroir)
- Aider l'utilisateur à **se reconnaître** : son terrain, sa fatigue, ses compensations. C'est l'effet miroir qualitatif (D37 — 8 à 12 phrases qualitatives à placer sur J3/J7/J11).
- Déculpabiliser le ressenti : *« c'est normal de ne pas tout ressentir tout de suite »* (principe 2, principe 8).

### 4.3 Quoi / la philosophie
- La vitalité = **terrain**, pas performance. Le ressenti avant la théorie (principe 2).
- **« Pas toujours +++ »** : rééduquer les sens en isolant, finesse d'observation plutôt qu'accumulation (principe 8). C'est contre-intuitif et mérite d'être posé explicitement.
- **Moins d'une minute par jour** : la régularité tranquille prime sur l'intensité (principe 4). Cadre les attentes et déculpabilise.

### 4.4 Les 7 actions — le pourquoi de chacune
Activation matinale, défi froid, mouvement/récupération, minéralisation, fenêtre digestive, fruits, soirée sans écrans. Chaque action mérite une phrase de *pourquoi physiologique* — pas une consigne sèche. À étaler sur la fenêtre, pas tout J1.

### 4.5 Où ça va (projection / bénéfices)
- La roadmap des 8 semaines + les 8 piliers, teasés (révélés pleinement en S0.2).
- La toile d'araignée, teasée comme promesse (révélée en S0.1 — D5).
- Le mentorat à l'horizon, présence passive (D9), sans hard-sell.
- Les bénéfices attendus, formulés en **ressenti** et non en promesse chiffrée (effet miroir qualitatif D37, pas de sur-promesse §4).

### 4.6 La mécanique elle-même
- Expliquer brièvement **streak vs palier** à l'utilisateur, pour qu'il comprenne ce qu'il vit au lieu de le subir.
- Le joker et le seuil 5/7, présentés comme des filets déculpabilisants (D6, D26).

---

## 5. Répartition proposée sur la fenêtre

Mapping des topics sur les slots existants (J1 bienvenue + 4 charnières J3/J7/J11/J14 + bascule S0). À ajuster.

| Slot | Type | Topics dominants | Palier ? |
|---|---|---|---|
| **J1** | Vidéo bienvenue (IA-12) | Qui sont M&J · quoi (vitalité = terrain) · la promesse · cadre « moins d'1 min/jour » | — |
| **J3** | Charnière (IA-14) | Miroir #1 (se reconnaître) · pourquoi de 2-3 actions · « pas tout de suite » | — |
| **J7** | Charnière + **Palier** | **Célébration cap J7** (vidéo M&J) · philosophie « pas toujours +++ » · miroir #2 | **Oui (J7)** |
| **J11** | Charnière (IA-14) | Projection : roadmap 8 semaines + piliers teasés · miroir #3 · mentorat évoqué | — |
| **J14** | Charnière (IA-14) | Bilan de la fenêtre · préparation bascule S0 · explication mécanique (toile à venir) | — |
| **J15** | S0.1 (IA-20) | Toile révélée · **Palier J15 différé géré par D30** (S0.1 prime) | **Oui (J15, géré)** |

Note : les 2 paliers retenus (J7, J15) coïncident avec des moments narratifs forts. J7 est la première vraie célébration ; J15 est absorbé par S0.1 (D30 déjà codé). La densité reste basse (décision C) — la valeur vient de la mise en scène, pas du nombre.

---

## 6. Implications code (à chiffrer, pas à exécuter maintenant)

Pour mémoire, ce que la cible impliquera quand on passera au code :

1. **`streak.ts` — `tierJustReached` sur progression.** Brancher la détection de palier sur `currentDay` (progression) au lieu de la valeur de streak. `TIER_THRESHOLDS` peut rester `[7, 15, 30, 60, 100, 365]` mais interprétés comme *jours parcourus* et non *jours consécutifs*. À valider : les seuils > 14j (30/60/100/365) restent-ils sur progression ou repassent-ils sur autre chose en Phase 1 ?
2. **`ProgressContext.tsx` — `validateDay`.** Découpler la détection de palier de `newStreak` ; la calculer depuis `currentDay`. Le streak continue d'être calculé et stocké mais ne pilote plus les paliers.
3. **Accueil (IA-11 / `HomeScreenV1`).** Hiérarchie visuelle inversée : palier/progression dominant, streak discret. Maquette à produire si on prend l'option B+ plus tard.
4. **Copy.** Réécriture des slots charnière + modale palier + bandeau streak selon §3.4. À faire valider M&J (placeholders `[copy à valider]` en attendant).

Charge à estimer une fois ce cadrage validé. Aucune de ces modifs n'est engagée tant que Stéphane n'a pas validé le présent doc.

---

## 7. Questions ouvertes à trancher

1. **Seuils > 14 jours.** Les paliers 30/60/100/365 restent-ils sur progression (jours parcourus, donc atteints même avec des trous) ou faut-il un traitement différent en Phase 1 ? (Hors scope fenêtre 14j mais impacte la mécanique.)
2. **Streak visible dès J1 ou plus tard ?** Décision B dit « secondaire discret ». À confirmer : visible dès J1 en petit, ou n'apparaît qu'après un premier palier ?
3. **Explication mécanique à l'utilisateur** — un mini-écran dédié, ou intégré dans une charnière existante ?
4. **Effet miroir D37** — les 8-12 phrases qualitatives sont-elles déjà rédigées (Brief contenu) ou à produire ?

---

*Fin du doc. Prochain pas : validation Stéphane, puis soit (a) production des slots de copy charnière avec M&J, soit (b) maquette accueil repositionné, soit (c) chantier code streak/palier.*

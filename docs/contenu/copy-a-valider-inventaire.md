# Inventaire des copy à valider — pour Mimi & Jacky

*Généré le 22 septembre 2026 (F-13, audit Lou Grenier). 20 textes affichés à l'utilisateur portent encore le marqueur `[copy à valider]` : ce sont des placeholders écrits par Claude Code en respectant la grille de ton (CLAUDE.md § 4), jamais validés par Mimi & Jacky. Ce document les liste tous, écran par écran, avec le texte actuel tel quel — pour valider, réécrire ou trancher. Une fois un texte validé, on retire le marqueur dans le code (le texte, lui, est déjà en place : valider = souvent ne rien changer d'autre que le marqueur).*

*Ne fait pas partie de cet inventaire : les slides d'onboarding IA-01→09 (chantier séparé déjà tracé, révision Mimi) et le copy Minéralisation (déjà tracé aussi).*

---

## Écrans de transition S0 (moments narratifs forts — priorité haute)

### IA-20 — S0.1 Célébration (S01Screen)

**1.** Sous-titre sous « Quatorze jours derrière toi. » :
> Tu n'as pas tout fait parfaitement — personne ne le fait. Ce qui compte, c'est que tu es revenu. Peut-être que tu t'endors plus vite, que le froid te fait moins peur, que tu repères mieux ta faim réelle. Ce sont tes premiers signaux.

### IA-21 — S0.2 Roadmap (S02Screen)

**2.** Sous-titre sous « Huit semaines. Huit piliers. » :
> Phase 1 démarre demain. Un seul pilier par semaine — parce qu'on travaille en profondeur, pas en surface. Chaque semaine : une évaluation au départ, des sessions courtes chaque jour, une évaluation à la fin pour mesurer le chemin. Tu sentiras la différence sur ton terrain.

**3.** Transition vers l'évaluation S1 :
> Le premier pilier est **Respiration**. On commence par une évaluation rapide — 12 questions, deux minutes — pour calibrer ta semaine.

---

## Jours-charnière Phase 0 (IA-14, JourCharniereScreen)

*Les corps J3 et J11 sont déjà sans marqueur ; restent J7 et J14.*

**4.** Corps du Jour 7 (« Sept jours. ») :
> Une semaine. Pense à ça comme à un entraînement, pas à une pilule. Les effets ne sont pas immédiats, et chacun avance à son rythme — c'est normal, ça se construit dans le temps. Ce qui compte, c'est que tu pratiques, jour après jour. Le corps répond dans la durée, pas dans l'instant.

**5.** Corps du Jour 14 (« Quatorze jours. Un premier ressenti. ») :
> Tu as expérimenté pendant deux semaines. Pas pour la performance — pour sentir. Ce ressenti, il est à toi : c'est le vrai acquis. Et ce n'est que le début. Si tu veux continuer avec nous, c'est pour construire des bases solides, profondes, sur le long terme.

---

## Paywall (IA-30, PaywallScreen — priorité haute, moment de conversion)

**6.** Variante « conversion précoce » (dès J3, D3), paragraphe avant le CTA :
> Tu peux t'abonner dès maintenant pour préparer la suite. Tes jours de préparation restent gratuits ; le paiement démarre à l'abonnement.

**7.** Variante fin Phase 0, paragraphe avant le CTA (renvoi navigateur, pattern Reader App) :
> Pour continuer, termine ton inscription depuis ton navigateur. Tu seras ramené dans l'app à la fin.

**8.** Variante « abonnement expiré en Phase 1 », sous-titre :
> Ton abonnement a pris fin. Rien de perdu — tu reprends exactement où tu en étais dès que tu réactives.

**9.** Variante « abonnement expiré après S8 », sous-titre :
> Ton abonnement a pris fin. Tout ton parcours guidé reste acquis côté toile et progression.

---

## Phase 1

### IA-11 — Accueil Phase 1 (Phase1HomeScreen)

**10.** Intro de la carte « Évaluation finale de la semaine » :
> Tu arrives en fin de semaine S1. Refais les mêmes 12 questions qu'au début pour mesurer le différentiel sur ta toile.

**11.** Rappel sous les sessions du jour (D6 : validation 1/3) :
> 1 session sur 3 suffit pour valider ta journée. Les 3 sessions renforcent davantage la pratique.

### IA-41 — Récap évaluation initiale (PillarRecapScreen)

**12.** Bloc « Comment se déroule la semaine » des piliers Type B (sans niveau d'intensité, D41) :
> Pour ce pilier, pas de niveau d'intensité — tout le monde démarre au même endroit. La progression se joue dans la structure narrative des 7 jours, pas dans la dose.

### IA-43 — Écran de session (SessionScreen)

**13.** Modale niveau adaptatif session (D31) :
> Tu peux moduler cette session sans changer ton niveau d'entrée. Le changement vaut pour cette session uniquement.

### IA-26 — Détail d'une branche (PillarBranchDetailScreen)

**14.** Carte « Branche non encore évaluée » :
> Cette branche se renforcera après l'évaluation initiale du pilier {nom du pilier}.

---

## Sortie de S8 / consolidation (ConsolidationHomeScreen)

**15.** Intro du mode libre :
> Tu as bouclé les 8 piliers. Plus de programme imposé — tu choisis ce que tu pratiques et à quel rythme.

**16.** Carte Mentorat (D9 : proposition sans hard-sell) :
> Si tu veux un accompagnement personnalisé avec Mimi & Jacky, la porte est ouverte.

**17.** Alerte au tap sur Mentorat (espace pas encore ouvert) :
> L'espace mentorat sera ouvert dans une prochaine version. En attendant, contacte Mimi & Jacky par les canaux habituels.

---

## Messages transverses (affichés par la mécanique streak/joker)

*Depuis F-13, ces textes vivent dans `src/data/global-copy.ts` (slots `copy.global.*`) — un seul endroit à modifier.*

**18.** Streak cassé après absence (D26, titre « Streak remis à zéro ») :
> Des journées sont passées sans validation. Ton streak repart de zéro — la prochaine validation le relance. Tu reprends au jour {X}, là où tu t'étais arrêté.

**19.** Joker consommé (D6, titre « Joker utilisé ») :
> Ton joker de la semaine a couvert une journée manquée. Streak conservé. Tu reprends au jour {X}, là où tu t'étais arrêté.

---

## Technique (basse priorité)

**20.** Notification de test du panneau DEV (ProfilTabScreen, visible uniquement comptes flaggés) :
> Test notification — Sprint 25 cadre technique.

*Peut rester telle quelle — jamais vue par un utilisateur normal.*

---

## Comment valider

Pour chaque numéro : « OK tel quel », ou la réécriture. Stéphane transmet à Claude Code qui applique et retire les marqueurs. Priorité suggérée : paywall (6-9), transitions S0 (1-3), charnières (4-5), puis le reste.

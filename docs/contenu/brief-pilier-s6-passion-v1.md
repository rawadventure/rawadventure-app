# Brief contenu — Pilier S6 Passion et chemin de vie V1

**Statut** : Drafts Claude basés sur matière Jacky V0 (`docs/matiere-jacky/V0_PILIER 6 — PASSION.docx`). 12 questions + 5 diagnostics + 3 niveaux **livrés explicitement** par Jacky.
**Cible code** :
- `src/data/s6-evaluation.ts` (12 questions + 5 diagnostics)
- `src/data/s6-program.ts` (programme 7 jours + durées 15/30/60 min)
- `src/data/pillar-registry.ts` (meta pillar S6 chrono_libre)

**Cadrage** : Feature Spec S1 Respiration V1.0 (pattern référence) + Métriques V1.5 + matière Jacky brute

## Type pilier

- **Type** : A — paramètre principal modulé par niveau d'engagement
- **Session type** : `chrono_libre` — timer pour temps consacré à passion choisie
- **Paramètre principal** : durée par session (minutes consacrées)
- **3 niveaux Jacky** :
  - **Essentiel** (15 min, fourchette 5-15) : démarrer simple
  - **Progression** (30 min, fourchette 20-40) : créer espace
  - **Immersion** (60 min, fourchette 45+) : donner vraie place

## Message central Jacky V0

> "Tu ne manques pas forcément de passion. Tu manques peut-être simplement de temps réellement consacré à ce qui t'anime."

## Phase préparatoire (Jacky V0)

Avant les 7 jours, l'utilisateur identifie **3 à 5 passions réelles**. Consigne :
- Activités que tu aimes faire
- Choses qui te donnent de l'énergie
- Activités que tu repousses souvent
- Choses que tu ferais même sans obligation extérieure

**Note V1** : la phase préparatoire avec liste de passions est **hors-scope V1** (UX riche à implémenter Sprint code S6 livraison). V1 simplifié : l'utilisateur garde sa passion en tête sans liste app.

## 12 questions évaluation (matière Jacky V0)

Échelle 1-5.

| # | Question | Inversion |
|---|---|---|
| Q1 | Je sais clairement ce qui me passionne. | Non |
| Q2 | Je prends régulièrement du temps pour mes passions. | Non |
| Q3 | Mes passions me donnent de l'énergie. | Non |
| Q4 | Je repousse souvent ce que j'aime vraiment faire. | Oui |
| Q5 | Je me sens vivant quand je pratique une activité qui me passionne. | Non |
| Q6 | Je consacre du temps chaque semaine à ce qui m'anime. | Non |
| Q7 | Je me sens parfois coupé de ce que j'aime vraiment. | Oui |
| Q8 | J'ai tendance à prioriser les obligations avant mes élans personnels. | Oui |
| Q9 | Quand je pratique une passion, mon énergie change rapidement. | Non |
| Q10 | Je ressens un manque de sens ou de direction dans certaines périodes. | Oui |
| Q11 | Je sais quelle passion je pourrais remettre en action cette semaine. | Non |
| Q12 | Je passe facilement de l'envie à l'action. | Non |

4 questions inversées (Q4 repousse, Q7 coupé, Q8 priorise obligations, Q10 manque de sens).

## Diagnostic 5 niveaux (matière Jacky V0)

| Niveau | Label |
|---|---|
| 1 | Passion déconnectée |
| 2 | Passion mise de côté |
| 3 | Passion irrégulière |
| 4 | Passion active |
| 5 | Passion intégrée |

Messages d'accueil : cf. `src/data/s6-evaluation.ts` constante `S6_DIAGNOSTICS`.

## Programme 7 jours (drafts Claude)

Le doc Jacky V0 propose un programme **identique chaque jour** (choisir une passion, y consacrer du temps, observer). Adaptation V1 : 7 jours avec focus narratif progressif.

| Jour | Titre | Focus |
|---|---|---|
| J1 | Identifier | Lister passions, choisir celle de la semaine |
| J2 | Petite porte d'entrée | Démarrer petit, valider temps réel |
| J3 | Installer | Reprendre la pratique, observer après |
| J4 | Approfondir | Augmenter le temps si possible |
| J5 | Persévérer | 5ème jour, le rythme s'installe |
| J6 | Observer l'impact | Attention au reste de la journée |
| J7 | Intégrer | Cumul de la semaine en données réelles |

## Cumul hebdomadaire (Jacky V0)

L'app pourrait afficher en fin de pilier :
- Temps total consacré aux passions
- Passion la plus pratiquée
- Nombre de jours validés
- Meilleure journée
- Moyenne quotidienne

### Niveaux hebdomadaires
- 0-60 min : faible engagement
- 60-150 min : engagement en route
- 150-300 min : bon engagement
- 300+ min : passion réellement activée

**Note V1** : le cumul détaillé est **hors-scope V1** simple. À considérer pour S6 livraison Sprint code (l'engagement par cumul est puissant).

## Vidéo intro pilier (Brief Session 3)

- **Asset** : `media.s6.video-intro`
- **Format** : 9:16, 60-90s
- **Phrase clé Jacky** : *"Tu ne manques pas forcément de passion. Tu manques peut-être simplement de temps réellement consacré à ce qui t'anime."*
- **Phrase fin Jacky** : *"Ce que tu nourris prend de la place dans ta vie."*
- **Script texte** : [à produire Brief Session 3]

## Effet miroir fin de pilier (IA-47 récap)

Inspiré observation finale Jacky V0.

- **Delta positif (> +5)** : `Sept jours t'ont suffi à remettre du mouvement dans ce qui t'anime. Ce n'est pas anecdotique — c'est une partie vivante de toi qui reprend sa place.`
- **Delta léger (1 à 5)** : `Tu as recommencé à donner du temps réel à ce qui te nourrit. Le cumul prouve qu'il ne te manquait pas la passion — il te manquait le temps.`
- **Delta stable (-1 à +1)** : `Le score n'a pas bougé. Mais le simple fait d'avoir nommé une passion et de l'avoir pratiquée est déjà une donnée.`
- **Delta négatif (< -1)** : `Le score a baissé — ça arrive. Les 12 questions captent un instantané, ton ressenti compte plus que ce chiffre.`

## Mapping profil onboarding → niveau de départ (D15)

Drafts Claude — à valider Jacky.

| Profil | Niveau de départ S6 |
|---|---|
| P0 (terrain équilibré) | Progression |
| P1 (reboot complet) | Essentiel |
| P2 (remontée énergétique) | Essentiel |
| P3 (corps+mental à relancer) | Essentiel |
| P4 (lancé) | Immersion |
| P5 (base solide) | Progression |
| P6 (corps veut se relancer) | Progression |
| P7 (mental mène tout) | Essentiel |
| P8 (petit pas) | Essentiel |

## Notes voix

- "Ce qui t'anime" — formule Jacky récurrente
- "Temps réel" — opposition à "intention" / "envie"
- Pas de "passion comme purpose" (jargon LinkedIn)
- Pas de "trouve ta voie" (cliché développement personnel)
- Phrase clé : *"Ce que tu n'as jamais fait, c'est souvent simplement ce à quoi tu ne donnes jamais de temps."*

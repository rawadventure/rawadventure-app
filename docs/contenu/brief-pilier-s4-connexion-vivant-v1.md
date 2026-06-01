# Brief contenu — Pilier S4 Connexion au vivant V1

**Statut** : Drafts Claude basés sur matière Jacky V0 (`docs/matiere-jacky/V0_PILIER 4 — CONNEXION AU VIVANT.docx`). 12 questions + 5 diagnostics + 3 niveaux **livrés explicitement** par Jacky.
**Cible code** :
- `src/data/s4-evaluation.ts` (12 questions + 5 diagnostics)
- `src/data/s4-program.ts` (programme 7 jours + durées 5/20/45 min)
- `src/data/pillar-registry.ts` (meta pillar S4)

**Cadrage** : Feature Spec S1 Respiration V1.0 (pattern référence) + Métriques V1.5 + matière Jacky brute

## Type pilier

- **Type** : A — paramètre principal modulé par niveau d'engagement
- **Session type** : `chrono_libre` — timer pour temps passé en contact réel
- **Paramètre principal** : durée par session (matin OU soir)
- **3 niveaux Jacky** :
  - **Essentiel** (5 min, fourchette 5-15) : démarrer simple
  - **Progression** (20 min, fourchette 15-30) : structurer
  - **Immersion** (45 min, fourchette 30-60) : approfondir

## Spécificité S4 — 2 moments / jour (Jacky V0)

Jacky structure le pilier en **2 sessions/jour** (matin + soir), avec structure **identique chaque jour** (régulation nerveuse = répétition).

Adaptation V1 : la mécanique transverse Phase 1 = 3 sessions/jour. On garde 3 sessions cohérence + on adapte le contenu :
- Matin (session 1) : activation biologique (lumière, air)
- Midi (session 2) : pause connexion courte (5 min mini)
- Soir (session 3) : apaisement nerveux (lumière déclinante, présence)

Validation streak Phase 1 : 1 session sur 3 minimum (D6).

## 12 questions évaluation (matière Jacky V0)

Échelle 1-5.

| # | Question | Inversion |
|---|---|---|
| Q1 | Je passe du temps dehors chaque jour. | Non |
| Q2 | Je suis exposé à la lumière naturelle. | Non |
| Q3 | Je ressens le contact avec l'air. | Non |
| Q4 | Je suis souvent dans des environnements fermés. | Oui |
| Q5 | Je prends du temps sans écran. | Non |
| Q6 | Je me sens connecté à mon environnement. | Non |
| Q7 | Je ressens mon corps facilement. | Non |
| Q8 | Je me sens calme naturellement. | Non |
| Q9 | Je suis souvent stimulé mentalement. | Oui |
| Q10 | Je prends du temps pour observer. | Non |
| Q11 | Je suis en contact avec des éléments naturels (terre, eau, vent…). | Non |
| Q12 | Je ressens une vraie présence dans mes journées. | Non |

## Diagnostic 5 niveaux (matière Jacky V0)

| Niveau | Label |
|---|---|
| 1 | Très déconnecté |
| 2 | Déconnecté |
| 3 | Variable |
| 4 | Connecté |
| 5 | Très connecté |

Messages d'accueil : cf. `src/data/s4-evaluation.ts` constante `S4_DIAGNOSTICS`.

## Programme 7 jours (drafts Claude)

Le doc Jacky V0 propose un programme **identique chaque jour**. Adaptation V1 : 7 jours avec progression légère sur les éléments naturels mis en avant.

| Jour | Titre | Focus |
|---|---|---|
| J1 | Démarrer le contact | Sortir 5 min mini, matin et soir |
| J2 | Lumière du matin | Exposition lumière naturelle au réveil |
| J3 | Sentir l'air | Respiration naturelle dehors |
| J4 | Contact direct | Pieds nus, écorce, sol naturel |
| J5 | Apaisement du soir | Coucher de soleil ou lumière déclinante |
| J6 | Présence pleine | Observation prolongée d'un élément naturel |
| J7 | Intégrer le rythme | Reproduire les 2 moments sans réfléchir |

## Règle fondamentale (Jacky V0)

> "Pendant ces moments : aucun téléphone, aucun écran, aucune distraction. Sans ça, la connexion n'existe pas."

À afficher en intro pilier et en rappel quotidien.

## Tracking éléments (Jacky V0)

Le doc Jacky propose un tracking par éléments naturels :
- Lumière naturelle ☐
- Air / extérieur ☐
- Eau ☐
- Terre ☐

**Hors-scope V1 simple validation** — pourrait être ajouté Sprint code S4 livraison si UX riche souhaitée. À arbitrer.

## Vidéo intro pilier (Brief Session 3)

- **Asset** : `media.s4.video-intro`
- **Format** : 9:16, 60-90s
- **Phrase clé Jacky** : *"Tu ne vas rien apprendre. Tu vas simplement remettre ton corps en contact avec le réel."*
- **Phrase fin de pilier Jacky** : *"Tu n'as rien appris. Tu as retrouvé un état naturel."*
- **Script texte** : [à produire Brief Session 3]

## Effet miroir fin de pilier (IA-47 récap)

Inspiré observation finale Jacky V0.

- **Delta positif (> +5)** : `Sept jours de contact réel ont déjà recalibré ton système nerveux. Le calme que tu ressens n'est pas une humeur — c'est physiologique.`
- **Delta léger (1 à 5)** : `Tu as recréé un lien que la majorité des personnes ont perdu. C'est une base essentielle pour ton équilibre.`
- **Delta stable (-1 à +1)** : `Le score n'a pas bougé. Le ressenti de présence, lui, a souvent déjà changé.`
- **Delta négatif (< -1)** : `Le score a baissé — ça arrive. Les 12 questions captent un instantané, ton ressenti compte plus que ce chiffre.`

## Réactions normales (Jacky V0)

- Plus de calme
- Sensation de ralentissement
- Agitation au début possible
- Fatigue mentale qui descend

> "Ton corps sort d'un état de stimulation constante. C'est une transition normale."

À intégrer comme micro-message J2 ou J3.

## Mapping profil onboarding → niveau de départ (D15)

Drafts Claude — à valider Jacky.

| Profil | Niveau de départ S4 |
|---|---|
| P0 (terrain équilibré) | Progression |
| P1 (reboot complet) | Essentiel |
| P2 (remontée énergétique) | Essentiel |
| P3 (corps+mental à relancer) | Essentiel |
| P4 (lancé) | Progression |
| P5 (base solide) | Progression |
| P6 (corps veut se relancer) | Progression |
| P7 (mental mène tout) | Essentiel |
| P8 (petit pas) | Essentiel |

## Notes voix

- "Contact réel" — formule clé Jacky
- "Sortir de la stimulation" — opposition implicite à la vie moderne écran
- Pas de "nature thérapie", pas de "earthing" (jargon)
- Phrase clé : *"Tu n'as rien appris. Tu as retrouvé un état naturel."*

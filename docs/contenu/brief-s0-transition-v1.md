# Brief contenu — S0 Transition (J15-J16) V1

**Statut** : Scripts vidéo prototypes prêts (Brief Session 2 repo). Textes écran drafts Claude. À valider/finaliser Mimi & Jacky.
**Cible code** :
- `src/screens/v1/S01Screen.tsx` (J15 célébration + révélation Toile)
- `src/screens/v1/S02Screen.tsx` (J16 roadmap + intro éval S1)

**Cadrage** : IA V3 §IA-20 + §IA-21 + Feature Spec V1 §3 + D17 (S0 = 2 jours) + `docs/brief-contenu/session-2-videos-S0.md`

---

## S0.1 — Célébration et révélation Toile (IA-20)

Couche superposée plein écran, déclenchée premier lancement J15.

### Vidéo Mimi & Jacky `media.IA-20.video-celebration-14j`

- **Format** : 9:16 vertical (1080x1920)
- **Durée cible** : 75-80s (plage 60-90s)
- **Structure 5 segments** (cf. `docs/brief-contenu/session-2-videos-S0.md` §2)

#### Segment 1 — Accueil et reconnaissance (0-10s)
> "Voilà. Quatorze jours. Tu y es."
>
> *ou*
>
> "On y est. Tu viens de passer quatorze jours à observer ton terrain."

#### Segment 2 — Nommer ce qui s'est passé (10-30s)
> "Pendant ces quatorze jours, tu as fait quelque chose de rare. Tu as commencé à lire ton corps autrement. À repérer ce que tu sens vraiment, à distinguer la fatigue de l'épuisement, l'envie du besoin."

#### Segment 3 — Annoncer la révélation Toile (30-55s)
> "Tout ce que tu as observé pendant ces deux semaines, on l'a réuni dans un seul outil. Une carte. Pas un score, pas un diagnostic. Une carte de ton terrain en huit points."

#### Segment 4 — Adresse personnelle Mimi & Jacky (55-70s)
> "Cette carte, elle est à toi. Elle dit où tu en es, et elle dit ce qu'on va aller travailler ensemble. Pas tout en même temps. Une chose après l'autre."

#### Segment 5 — Ouverture vers lendemain (70-80s)
> "Regarde ta toile. Prends le temps. Demain, on continue."

### Textes accompagnement écran (drafts Claude à valider)

- **Marker** : `S0.1 · Transition` ✓
- **Titre** : `Quatorze jours. Tu y es.`
- **Subtitle** : `La Phase 0 est complète. Ton corps a reçu deux semaines de signaux. Ce que tu as observé, on l'a réuni dans une carte. La voilà.`
- **Label Toile section** : `Ta toile de vitalité` ✓
- **Subtitle Toile** : `Huit branches, une par pilier. Pas un score, pas un diagnostic. Une carte de ton terrain en huit points.`
- **CTA** : `Continuer` ✓

---

## S0.2 — Roadmap et intro éval S1 (IA-21)

Couche superposée plein écran, déclenchée premier lancement J16.

### Vidéo Mimi & Jacky `media.IA-21.video-roadmap-phase1`

- **Format** : 9:16 vertical (1080x1920)
- **Durée cible** : 75-80s (plage 60-90s)
- **Structure 5 segments** (cf. `docs/brief-contenu/session-2-videos-S0.md` §3)

#### Segment 1 — Bascule de mode (0-10s)
> "Aujourd'hui, on change d'allure. Et c'est volontaire."
>
> *ou*
>
> "On reprend. Mais pas de la même façon."

#### Segment 2 — Cadre Phase 1 (10-30s)
> "Les quatorze jours, c'était la lecture. Maintenant, on rentre dans le travail. Huit semaines, un pilier par semaine. Pas plus. Parce qu'on travaille en profondeur, pas en surface."

#### Segment 3 — Roadmap 8 piliers (30-55s)
> "Voilà ce qui t'attend. Respiration, alimentation, mindset, condition physique, repos et régénération, passion et chemin de vie, connexion au vivant, élimination et détox. Huit piliers. On commence par la respiration parce que c'est la base. C'est ce qui régule tout le reste."

#### Segment 4 — Adresse personnelle (55-70s)
> "Cette semaine, on est avec toi sur la respiration. On l'a expérimenté, on sait ce que ça change. À toi de voir ce que ça fait sur ton terrain."

#### Segment 5 — Démarrage évaluation (70-80s)
> "On commence par te poser quelques questions sur ta respiration. Réponds avec ton ressenti, pas avec ce que tu crois savoir. C'est parti."

### Textes accompagnement écran (drafts Claude à valider)

- **Marker** : `S0.2 · Roadmap` ✓
- **Titre** : `Huit semaines. Huit piliers.` ✓
- **Subtitle** : `La lecture, c'était les 14 jours. Maintenant, on rentre dans le travail. Un pilier par semaine, dans cet ordre. On commence par la respiration — c'est ce qui régule tout le reste.`
- **Label roadmap** : `L'ordre des piliers` ✓
- **Roadmap visuelle** : 8 piliers avec semaine + icône + nom + tagline courte (déjà codée S02Screen.tsx)
- **CTA** : `Démarrer l'évaluation Respiration` ✓

### Taglines roadmap (à valider Mimi & Jacky)

| Sem. | Pilier | Tagline actuelle |
|---|---|---|
| 1 | Respiration | `Le moteur invisible` |
| 2 | Activité physique | `Le corps en mouvement` |
| 3 | Alimentation | `Le carburant` |
| 4 | Connexion au vivant | `Le terrain extérieur` |
| 5 | Repos et régénération | `La récupération` |
| 6 | Passion et chemin de vie | `L'élan` |
| 7 | Mindset | `Le rapport à soi` |
| 8 | Élimination et détox | `Le nettoyage` |

---

## Notes voix (rappel)

- Pas de "Félicitations !" — Mimi/Jacky ne disent pas ça
- "Pas un score, pas un diagnostic" → formule clé à conserver pour la Toile
- Ordre Phase 1 nommé à l'oral (Segment 3 S0.2) — justifie pourquoi respiration en premier
- S0.2 = vers l'action (éval démarre immédiatement après vidéo)

## Ordre prod

1. Mimi/Jacky finalisent les 2 scripts (sous 7 jours après ce brief)
2. Tournage S0.1 + S0.2 dans la **même demi-journée** (cohérence calibrage)
3. Validation textes écran ci-dessus
4. Intégration code (remplace placeholders S01Screen.tsx + S02Screen.tsx)

## Annexe — Réf production

Voir `docs/brief-contenu/session-2-videos-S0.md` pour le brief complet de production (cadrage, contraintes techniques, dispositif Mimi-Jacky, tenue, lumière, fond, délais).

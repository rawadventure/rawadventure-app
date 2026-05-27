# Brief contenu — Paliers streak (IA-50 + IA-51) V1

**Statut** : Palier 7j validé Mimi 2026-05-27 (fusion charnière J7). Paliers 15/30/60/100/365 à valider Mimi/Jacky. Vidéos à tourner (Brief Session 1).
**Cible code** :
- `src/components/compositions/TierReachedModal.tsx` (modale palier)
- `src/screens/v1/PaliersGalleryScreen.tsx` (galerie IA-51)

**Cadrage** : IA V3 §IA-50 + §IA-51 + Feature Spec V1 §2.6 + D29 (1er franchissement vs redéclenchements) + Brief contenu Session 1

**Cascade Sprint 31** : palier 7j fusionne avec charnière J7 (un seul écran combinant vidéo Mimi/Jacky + texte effet miroir). Les autres paliers (15/30/60/100/365) restent autonomes — pas de collision charnière.

## Les 6 paliers

Seuils : 7j / 15j / 30j / 60j / 100j / 1 an

Pour chaque palier, produire :
- **Vidéo Mimi & Jacky** (1 vidéo dédiée par palier — variante 1er franchissement uniquement, D29)
- **Texte premier franchissement** : titre + body (visible avec la vidéo)
- **Texte galerie** : tagline courte (1 phrase, visible IA-51)

### Palier 7j (fusion charnière J7)

**Statut texte** : Validé Mimi 2026-05-27.

- **Vidéo** `media.tier.7j.video` :
  - Format 9:16, durée 30s
  - Script intention : première semaine acquise, le corps a enregistré le rythme, effet miroir qualitatif
  - Script texte : [à compléter Mimi/Jacky — Brief Session 1]
- **Titre premier franchissement** : `Sept jours.`
- **Body premier franchissement** : `Ton corps a enregistré le rythme — il commence à l'attendre. Ce que tu ressens maintenant, note-le. C'est ton point de départ réel.`
- **Tagline galerie** : [à valider — actuel : "Première semaine bouclée."]

### Palier 15j

**Statut** : Draft Claude — à valider Mimi/Jacky.

- **Vidéo** `media.tier.15j.video` :
  - Format 9:16, durée 30s
  - Script intention : cap deux semaines, sortie Phase 0, bascule mode dirigé
  - Script texte : [à compléter Mimi/Jacky — Brief Session 1]
- **Titre** : `Quinze jours.`
- **Body** : `Tu as traversé la Phase 0. Le terrain est posé. À partir de maintenant, on isole chaque pilier pour aller plus loin. Ce qui était observation devient pratique structurée.`
- **Tagline galerie** : `Phase 0 traversée.`

### Palier 30j

**Statut** : Draft Claude — à valider Mimi/Jacky.

- **Vidéo** `media.tier.30j.video` (30s, 9:16)
- **Titre** : `Un mois.`
- **Body** : `Trente jours de continuité. Tu n'es plus dans le démarrage. Le corps a intégré une routine — il l'attend, il s'y appuie. C'est ce qu'on cherchait depuis le début.`
- **Tagline galerie** : `Le rythme devient ton normal.`

### Palier 60j

**Statut** : Draft Claude — à valider Mimi/Jacky.

- **Vidéo** `media.tier.60j.video` (30s, 9:16)
- **Titre** : `Soixante jours.`
- **Body** : `Deux mois. La pratique est devenue ton normal. Tu ne te demandes plus pourquoi — tu fais. C'est ce moment où le corps précède le mental.`
- **Tagline galerie** : `La pratique précède le mental.`

### Palier 100j

**Statut** : Draft Claude — à valider Mimi/Jacky.

- **Vidéo** `media.tier.100j.video` (30s, 9:16)
- **Titre** : `Cent jours.`
- **Body** : `Cent jours. Tu as construit quelque chose de solide. Le rythme n'est plus une consigne, c'est une partie de toi. À ce stade, c'est toi qui sais.`
- **Tagline galerie** : `Quelque chose de solide.`

### Palier 1 an (365j)

**Statut** : Draft Claude — à valider Mimi/Jacky.

- **Vidéo** `media.tier.365.video` (30s, 9:16 — la plus chargée symboliquement)
- **Titre** : `Un an.`
- **Body** : `Trois cent soixante-cinq jours. Ce n'est plus un défi, c'est une vie. Tu as fait ce que peu de gens font — pas en intensité, en durée. Et c'est exactement ça qui change tout.`
- **Tagline galerie** : `Plus un défi, une vie.`

### Mise à jour palier 7j — tagline galerie

- **Tagline galerie draft Claude** : `Le rythme est posé.` (remplace placeholder V0 "Première semaine bouclée.")

## Variante redéclenchement (D29)

**Statut** : Draft Claude — à valider Mimi/Jacky.

1 seul message générique court pour TOUS les paliers re-franchis après cassure (modale allégée, pas de vidéo).

- **Message** : `Tu as repassé ce palier. La constance se rebâtit — un jour après l'autre.`

## Footnote galerie IA-51

**Statut** : Placeholder V1 acceptable — Mimi/Jacky peuvent affiner.

- **Texte actuel** : `Les paliers déjà atteints restent acquis même si le streak repart à zéro — ce qui est posé est posé.`

## Notes voix

- Pas de "Bravo !" "Génial !"
- Reconnaissance posée, observation
- Pas de pression de la perte ("Ne perds pas ton streak")
- Mention possible de l'effet physiologique (corps qui mémorise, pratique qui devient automatique)

# Brief contenu — Sortie S8 (IA-22 + IA-23 + IA-60) V1

**Statut** : Drafts Claude — à valider Mimi & Jacky. Vidéo IA-22 à tourner.
**Cible code** :
- `src/screens/v1/S8ExitScreen.tsx` (IA-22)
- `src/screens/v1/ConsolidationIntroScreen.tsx` (IA-23)
- `src/screens/v1/MentoratProposalModal.tsx` (IA-60)
- `src/screens/v1/ConsolidationHomeScreen.tsx` (variante post_s8 IA-11)

**Cadrage** : IA V3 §IA-22 + §IA-23 + §IA-60 + D9 (mentorat proposition active S8 sans hard-sell) + D13 (sortie S8)

---

## IA-22 — Écran de sortie de S8

Couche superposée plein écran, déclenchée fin éval finale S8.

### Vidéo Mimi & Jacky `media.IA-22.video-celebration-10-semaines`

- **Format** : 9:16 vertical (1080x1920)
- **Durée cible** : 75-80s (plage 60-90s)
- **Structure 5 segments** (pattern Session 2)

**Segment 1 — Accueil (0-15s)**
> "Dix semaines. Si tu es là, tu as fait quelque chose de rare. Pas un défi, pas un exploit. Une traversée."

**Segment 2 — Nommer ce qui a été traversé (15-40s)**
> "Quatorze jours d'amorçage. Huit semaines de piliers. Tu as travaillé chaque dimension de ton terrain — respiration, alimentation, mindset, condition physique, repos, passion, connexion, élimination. Pas en surface. En profondeur, un pilier à la fois."

**Segment 3 — Toile finale (40-60s)**
> "Regarde ta toile. Pas pour la noter — pour la lire. Chaque branche raconte ce qui a bougé. Là où c'est plus solide, là où il reste à explorer. C'est ta carte, pas ton score."

**Segment 4 — Mode libre (60-75s)**
> "Maintenant, le programme guidé s'arrête. Pas parce que c'est fini — parce que tu sais. Tu reviens quand tu veux, sur le pilier que tu veux. C'est toi qui décides."

**Segment 5 — Mentorat (75-90s)**
> "Si tu veux aller plus loin, accompagné, la porte est ouverte. Pas d'urgence. On est là quand tu seras prêt."

### Textes écran S8ExitScreen

- **Marker** : `FIN DE PHASE 1` ✓
- **Titre** : `Dix semaines. Tu y es.`
- **Subtitle** : `Phase 0 + 8 piliers, un par un. Tu as exploré chaque dimension de ton terrain. La toile en face de toi reflète ce que tu viens de poser.`
- **Bloc consolidation intro titre** : `Et maintenant ?` ✓
- **Bloc consolidation intro body** : `Pas de programme imposé maintenant. Tu choisis quand tu pratiques, sur quel pilier, à quel rythme. Ton abonnement reste actif pour conserver l'accès complet.`
- **Bloc mentorat titre** : `Aller plus loin ?` ✓
- **Bloc mentorat body** : `Si tu veux un accompagnement personnalisé avec Mimi & Jacky pour aller plus loin sur ce que tu viens de construire, le mentorat 1-to-1 est ouvert. Pas d'urgence — quand tu seras prêt.`
- **CTA secondaire** : `En savoir plus sur le mentorat` ✓
- **CTA principal** : `Continuer en consolidation libre` ✓

---

## IA-23 — Mode consolidation libre intro

Couche superposée plein écran, déclenchée par sortie IA-22.

### Textes écran

- **Marker** : `MODE CONSOLIDATION LIBRE` ✓
- **Titre** : `Voici ce que tu peux faire maintenant.` ✓
- **Subtitle** : `Le programme guidé est derrière toi. Tout ce que tu as travaillé reste accessible. À ton rythme, sur les piliers que tu veux.`

### 4 affordances

#### Revisiter chaque pilier
- **Titre** : `Revisiter chaque pilier`
- **Body** : `Les 8 piliers travaillés restent ouverts. Tap dans la Toile pour relire la fiche, refaire une session, ou juste te repérer.`

#### Refaire des sessions
- **Titre** : `Refaire des sessions`
- **Body** : `Cohérence cardiaque, fenêtre digestive, mouvement — tu choisis quand et combien. Pas de programme imposé.`

#### Streak qui continue
- **Titre** : `Streak qui continue`
- **Body** : `Une session par jour suffit à entretenir ton streak. Les paliers continuent de se débloquer.`

#### Contenu bonus
- **Titre** : `Contenu bonus`
- **Body** : `L'espace bonus reste accessible — vidéos, podcasts, lectures — au rythme de ton abonnement.`

- **CTA** : `Continuer` ✓

---

## IA-60 — Modale proposition active mentorat

Modale standard ouverte automatiquement à la sortie d'IA-23. Une seule fois (flag `mentorat_proposal_seen`).

### Textes

- **Titre** : `Tu as posé les bases.` ✓
- **Body** : `Si tu veux aller plus loin, accompagné, on en parle. Pas de pression — juste une porte ouverte.`
- **CTA1** : `Découvrir le mentorat` (mène IA-61 — actuellement Alert placeholder)
- **CTA2** : `Plus tard` (ferme, retour Accueil mode post_s8)

---

## ConsolidationHomeScreen (variante post_s8 IA-11)

### Textes

- **Marker header** : `Raw Adventure · Consolidation` ✓
- **Titre header** : `Mode libre` ✓
- **Intro body** : `Tu as bouclé les 8 piliers. Plus de programme imposé — tu choisis ce que tu pratiques et à quel rythme.`
- **Card piliers titre** : `Tes 8 piliers` ✓
- **Card piliers hint** : `Tap un pilier pour voir sa fiche et lancer une session libre.`
- **Bloc mentorat permanent titre** : `Mentorat` ✓
- **Bloc mentorat permanent body** : `Si tu veux un accompagnement personnalisé avec Mimi & Jacky, la porte est ouverte. Pas de pression — quand tu veux.`
- **CTA mentorat permanent** : `Découvrir le mentorat`

---

## Notes voix (rappel)

- C'est l'aboutissement narratif V1 — densité OK
- D9 : mentorat proposition active **sans hard-sell** — porte ouverte, pas vente
- Reconnaissance des 10 semaines mais sans surchauffe émotionnelle
- Le ton "C'est maintenant à toi" doit primer
- Pas de "Bravo", "Félicitations", "Tu l'as fait"
- "Tu sais" = mot clé Mimi/Jacky pour cette sortie

## Annexe — Réf production

Voir `docs/brief-contenu/session-2-videos-S0.md` pour le pattern de production des vidéos (cadrage, dispositif Mimi-Jacky, contraintes techniques). La vidéo IA-22 suit la même logique.

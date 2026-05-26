# Brief contenu — Sortie S8 (IA-22 + IA-23 + IA-60) V1

**Statut** : À remplir
**Cible code** :
- `src/screens/v1/S8ExitScreen.tsx` (IA-22)
- `src/screens/v1/ConsolidationIntroScreen.tsx` (IA-23)
- `src/screens/v1/MentoratProposalModal.tsx` (IA-60)
- `src/screens/v1/ConsolidationHomeScreen.tsx` (variante post_s8 IA-11)

**Cadrage** : IA V3 §IA-22 + §IA-23 + §IA-60 + D9 (mentorat proposition active) + D13 (sortie S8)

## IA-22 — Écran de sortie de S8

Couche superposée plein écran, déclenchée fin éval finale S8.

### Vidéo Mimi & Jacky `media.IA-22.video-celebration-10-semaines`

- **Format** : 9:16, 60-90s
- **Script intention** :
  - Célébration 10 semaines accomplies (Phase 0 + 8 piliers)
  - Pas de superlatif
  - Inviter à regarder la Toile finale (état comparatif)
- **Script texte** : [à compléter]

### Textes écran

- **Marker** : `FIN DE PHASE 1`
- **Titre** : [à compléter — actuel : "Dix semaines.\nTu y es."]
- **Subtitle** : [à compléter — actuel : "Phase 0 + 8 piliers travaillés un par un. Le terrain est posé. Ta toile reflète ce que tu as construit."]
- **Section Toile** :
  - Label : `Ta toile, vue d'ensemble`
- **Bloc consolidation libre intro** :
  - Titre : `Et maintenant ?`
  - Body : [à compléter — actuel : "Tu entres en mode consolidation libre. Pas de programme imposé — tu choisis quels piliers tu veux pratiquer, à ton rythme. Ton abonnement reste actif pour conserver l'accès à toute la pratique."]
- **Bloc mentorat** :
  - Titre : `Aller plus loin ?`
  - Body : [à compléter — actuel : "Si tu veux un accompagnement personnalisé avec Mimi & Jacky pour consolider et adapter à ta vie, le mentorat 1-to-1 est ouvert. Pas d'urgence — quand tu seras prêt."]
  - CTA secondaire : `En savoir plus sur le mentorat`
- **CTA principal** : `Continuer en consolidation libre`

## IA-23 — Présentation mode consolidation libre

Couche superposée plein écran, déclenchée par sortie IA-22.

### Textes écran

- **Marker** : `MODE CONSOLIDATION LIBRE`
- **Titre** : [à compléter — actuel : "Voici ce que tu peux faire maintenant."]
- **Subtitle** : [à compléter — actuel : "Le programme guidé est fini. Tout reste à disposition — tu choisis ce que tu pratiques et à quel rythme."]

### 4 affordances

#### Revisiter chaque pilier

- **Titre** : `Revisiter chaque pilier`
- **Body** : [à compléter — actuel : "Les 8 piliers travaillés restent ouverts. Tu tap dans la Toile pour relire la fiche, refaire une session, ou juste te repérer."]

#### Refaire des sessions

- **Titre** : `Refaire des sessions`
- **Body** : [à compléter — actuel : "Cohérence cardiaque, fenêtre digestive, mouvement — tu choisis quand et combien. Pas de programme imposé."]

#### Streak qui continue

- **Titre** : `Streak qui continue`
- **Body** : [à compléter — actuel : "Une session par jour suffit à entretenir ton streak. Les paliers continuent de se débloquer."]

#### Contenu bonus

- **Titre** : `Contenu bonus`
- **Body** : [à compléter — actuel : "L'espace bonus reste accessible — vidéos, podcasts, lectures — au rythme de ton abonnement."]

- **CTA** : `Continuer`

## IA-60 — Modale proposition active mentorat

Modale standard ouverte automatiquement à la sortie d'IA-23. Une seule fois (flag `mentorat_proposal_seen`).

### Textes

- **Titre** : [à compléter — actuel : "Tu as posé les bases."]
- **Body** : [à compléter — actuel : "Si tu veux aller plus loin, accompagné, on en parle. Pas de pression, juste une porte ouverte."]
- **CTA1** : `Découvrir le mentorat` (mène IA-61 — actuellement Alert placeholder)
- **CTA2** : `Plus tard` (ferme, retour Accueil mode post_s8)

## Mode consolidation libre — ConsolidationHomeScreen (variante IA-11)

### Textes

- **Marker header** : `Raw Adventure · Consolidation`
- **Titre header** : `Mode libre`
- **Intro body** : [à compléter — actuel : "Tu as bouclé les 8 piliers. Plus de programme imposé — tu choisis ce que tu pratiques et à quel rythme."]
- **Card piliers** :
  - Titre : `Tes 8 piliers`
  - Hint : `Tap un pilier pour voir sa fiche et lancer une session libre.`
- **Bloc mentorat permanent** :
  - Titre : `Mentorat`
  - Body : [à compléter — actuel : "Si tu veux un accompagnement personnalisé avec Mimi & Jacky, la porte est ouverte."]
  - CTA : `Découvrir le mentorat`

## Notes voix

- C'est l'aboutissement narratif V1 — densité OK
- D9 : mentorat proposition active **sans hard-sell** — porte ouverte, pas vente
- Reconnaissance des 10 semaines mais sans surchauffe émotionnelle
- Le ton "C'est maintenant à toi" doit primer

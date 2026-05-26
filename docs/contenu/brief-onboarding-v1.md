# Brief contenu — Onboarding V1

**Statut** : À remplir (intégration partielle V0 en place — voir Sprint 28)
**Cible code** : `src/screens/v1/OnboardingScreenV1.tsx`
**Cadrage** : IA V3 §IA-01 à §IA-09 + Audit copy V1

## Slide 1 — Welcome (IA-01)

- **Marker hero** : `RAW ADVENTURE`
- **Subtitle hero** : [à compléter — actuel V0 : "14 jours pour relancer ton énergie. Simple. Concret. Efficace."]
- **CTA bouton** : `Continuer` (générique, slides suivantes idem sauf si custom)

## Slide 2 — Le constat (IA-02)

- **Titre** : `Le constat`
- **Body** : [à compléter — actuel : "La fatigue moderne est devenue normale. Mais elle n'est pas inévitable. On va remettre les bons signaux."]

## Slide 3 — La promesse (IA-03)

- **Titre** : `La promesse`
- **Body** : [à compléter — actuel : "En 14 jours : plus d'énergie, corps plus léger, esprit plus clair. Tu testes. Tu ressens. Pas de théorie inutile, juste du concret à faire chaque jour."]

## Slide 4 — Questionnaire P1 (IA-04)

### Question énergie

- **Titre slide** : [à compléter — actuel V0 : "Aujourd'hui, ton niveau d'énergie"]
- **Échelle** : 1-5 (Scale15) — pas de touch
- **Labels échelle** :
  - Gauche : `Très basse`
  - Droite : `Très haute`

### Question corps

- **Question** : [à compléter — actuel V0 : "Ton corps se sent :"]
- **Options + hints (optionnels, V0 avait)** :
  - `Léger` → [à compléter]
  - `Neutre` → [à compléter]
  - `Lourd` → [à compléter]

## Slide 5 — Questionnaire P2 (IA-05)

### Question mental

- **Question** : `Ton mental est plutôt :`
- **Options + hints** :
  - `Calme` → [à compléter]
  - `Stable` → [à compléter]
  - `Agité` → [à compléter]

### Question motivation

- **Question** : `Tu es prêt à t'engager :`
- **Options + hints** :
  - `Un peu` → [à compléter]
  - `Sérieusement` → [à compléter]
  - `À fond` → [à compléter]

## Slide 6 — La projection (IA-06)

- **Titre** : `La projection`
- **Body** : [à compléter — actuel : "Dans 14 jours, ton sommeil sera plus dense. Ta digestion plus calme. Ta tête plus claire. Pas magique — physiologique."]

## Slide 7 — Profil dynamique (IA-07)

9 profils selon mapping `computeProfileDynamicId(answers)` (cf. `src/lib/onboarding.ts`).

### P0 — Terrain équilibré (défaut)

- **Titre** : [à compléter]
- **Message** : [à compléter]

### P1 — Reboot complet (low + heavy + agitated)

- **Titre** : [à compléter]
- **Message** : [à compléter]

### P2 — Remontée énergétique (low seul)

- **Titre** : [à compléter]
- **Message** : [à compléter]

### P3 — Décharger corps + mental (heavy + agitated)

- **Titre** : [à compléter]
- **Message** : [à compléter]

### P4 — Lancé (high + fired)

- **Titre** : [à compléter]
- **Message** : [à compléter]

### P5 — Base solide (high seul)

- **Titre** : [à compléter]
- **Message** : [à compléter]

### P6 — Corps veut se relancer (heavy seul)

- **Titre** : [à compléter]
- **Message** : [à compléter]

### P7 — Mental mène tout (agitated seul)

- **Titre** : [à compléter]
- **Message** : [à compléter]

### P8 — Petit pas grand changement (hesitant)

- **Titre** : [à compléter]
- **Message** : [à compléter]

## Slide 8 — Comment ça marche (IA-08)

- **Titre** : `Comment ça marche`
- **Body** : [à compléter — actuel : "14 jours gratuits d'amorçage en parallèle. Puis 8 semaines, un pilier de santé par semaine. La toile de vitalité prend forme au fil du parcours."]

## Slide 9 — Engagement (IA-09)

- **Titre** : [à compléter — actuel V0 : "Un seul engagement."]
- **Body** : [à compléter — actuel : "14 jours d'amorçage gratuit. Pas de carte bancaire. Juste un engagement à toi-même."]
- **Checkbox label** : `Je joue le jeu pendant 14 jours.`
- **CTA bouton finale** : `Créer mon compte` (slide 9 → IA-10 register)

## Notes voix

- Tutoiement systématique
- Pas d'emojis (Brand Core stricte)
- Pas de "Hey/Salut/Coucou"
- Vocabulaire OK : vitalité, énergie, terrain, signal, ressenti
- Vocabulaire NON : magique, hack, boost, transformation totale, warrior

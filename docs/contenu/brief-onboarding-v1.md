# Brief contenu — Onboarding V1

**Statut** : Validé Mimi & Jacky 2026-05-26 (intégration code Sprint 28)
**Cible code** : `src/screens/v1/OnboardingScreenV1.tsx` + `src/lib/onboarding.ts`
**Cadrage** : IA V3 §IA-01 à §IA-09 + Audit copy V1

## Slide 1 — Welcome (IA-01)

- **Marker hero** : `RAW ADVENTURE`
- **Subtitle hero** : `14 jours offerts pour relancer ta machine. Pas de théorie. Du concret. Dès aujourd'hui.`
- **Logo** : variant hero, taille 380px (bumped from 300 pour visibilité)
- **CTA bouton** : `Continuer`

## Slide 2 — Le constat (IA-02)

- **Titre** : `Le constat` (centré)
- **Body** (centré) :
  > Fatigue. Brouillard mental. Corps lourds.
  >
  > On a fini par croire que c'était normal.
  > Ça ne l'est pas.

## Slide 3 — La promesse (IA-03)

- **Titre** : `La promesse` (centré)
- **Body** (centré) :
  > En 14 jours, ton corps change de vitesse.
  > Sommeil plus dense. Digestion qui se calme. Tête qui s'allège.
  >
  > Pas de la magie — de la physiologie.
  > Tu fais. Tu ressens. Tu vois.

## Slide 4 — Questionnaire P1 (IA-04)

### Question énergie

- **Titre slide** : `Aujourd'hui, ton énergie elle est où ?` (centré)
- **Échelle** : 1-5 (Scale15)
- **Labels échelle** :
  - Gauche : `À plat`
  - Droite : `Au top`

### Question corps

- **Question** : `Ton corps, il se sent :` (centré)
- **Options** : `Léger` / `Neutre` / `Lourd`

## Slide 5 — Questionnaire P2 (IA-05)

### Question mental

- **Question** : `En ce moment, ta tête elle est :`
- **Options** : `Tranquille` / `Entre les deux` / `Dans tous les sens`
- **Note technique** : mapping ProfileDynamicId — `Dans tous les sens` = équivalent V0 `Agité` pour calcul P1/P3/P7

### Question motivation

- **Question** : `Tu es prêt à t'engager :`
- **Options** : `Un peu` / `Sérieusement` / `À fond`

## Slide 6 — La projection (IA-06)

- **Titre** : `La projection`
- **Body** :
  > Dans 14 jours :
  >
  > Ton sommeil devient plus dense.
  > Ta digestion se calme.
  > Ta tête se libère.
  >
  > Pas magique — physiologique.

## Slide 7 — Profil dynamique (IA-07)

9 profils selon mapping `computeProfileDynamicId(answers)`.

### P3 — Corps et mental à relancer (corps lourd + tête "Dans tous les sens")

- **Titre** : `Corps et mental à relancer.`
- **Message** : `Corps lourd. Tête pleine. L'un nourrit l'autre — et l'épuisement s'installe. On casse ce cycle dès le Jour 1. 14 jours pour retrouver ta légèreté.`

### Profils restants (P0, P1, P2, P4, P5, P6, P7, P8)

**Statut** : conservés du copy V0 strippé emojis (Sprint 28). Validation finale Mimi & Jacky à venir.
Référence pour révision ultérieure : `src/screens/v1/OnboardingScreenV1.tsx` constante `PROFILE_COPY`.

## Slide 8 — Comment ça marche (IA-08)

- **Titre** : `Comment ça marche`
- **Body** :
  > La vitalité ne revient pas d'un seul coup.
  > Elle se reconstruit pilier par pilier.
  >
  > 14 jours offerts pour relancer les bases.
  > Ensuite, on va plus loin — ensemble.

## Slide 9 — Engagement (IA-09)

- **Titre** : `Un seul engagement.`
- **Body** :
  > 14 jours offerts. Sans carte bancaire. Sans condition.
  >
  > Juste toi — et la décision de commencer.
- **Checkbox label** : `Je joue le jeu. 14 jours. C'est parti.`
- **CTA bouton finale** : `Créer mon compte` (slide 9 → IA-10 register)

## Notes voix

- Tutoiement systématique
- Pas d'emojis (Brand Core stricte)
- Pas de "Hey/Salut/Coucou"
- Vocabulaire OK : vitalité, énergie, terrain, signal, ressenti
- Vocabulaire NON : magique, hack, boost, transformation totale, warrior

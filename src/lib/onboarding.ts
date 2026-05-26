/**
 * onboarding.ts — dérivation du profil dynamique depuis les réponses du
 * questionnaire onboarding 4 dimensions.
 *
 * Réf : IA V3 §IA-07 (slide 7 — profil dynamique), Métriques V1.5 (mapping
 * profil → niveau de départ par pilier), CLAUDE.md §9 D15 (mapping 8 profils
 * × 8 piliers en cours de finalisation avec Jacky).
 *
 * 9 profils dynamiques (`P0` à `P8`). `P0` est le défaut si calcul impossible.
 * Mapping calqué sur la logique du V0 OnboardingScreen mais figée en identifiant
 * stable (au lieu de l'emoji/titre/copy retourné par le V0).
 *
 * Convention V1 : `profile_dynamic_id` est stocké dans `profiles.profile_dynamic_id`
 * et sert de clé pour les futurs mappings profil → niveau par pilier (Phase 0)
 * et profil → palette d'accueil par pilier.
 */

export type ProfileDynamicId =
  | 'P0' // défaut / inconnu
  | 'P1' // reboot complet (énergie basse + corps lourd + mental agité)
  | 'P2' // remontée énergétique (énergie basse, autres neutres)
  | 'P3' // décharge corps + mental (corps lourd + mental agité)
  | 'P4' // élan lancé (énergie haute + motivation à fond)
  | 'P5' // bonne base à exploiter (énergie haute seule)
  | 'P6' // relance corps (corps lourd seul)
  | 'P7' // recadrage mental (mental agité seul)
  | 'P8'; // petit pas (motivation hésitante)

export type OnboardingAnswers = {
  energy?: number;   // 1..10
  body?: string;     // 'Léger' | 'Neutre' | 'Lourd'
  mental?: string;   // V0 : 'Calme' | 'Stable' | 'Agité' — V1 Sprint 28 : 'Tranquille' | 'Entre les deux' | 'Dans tous les sens'
  motivation?: string; // 'Un peu' | 'Sérieusement' | 'À fond'
};

/**
 * Calcule le profil dynamique depuis les réponses brutes de l'onboarding.
 * Reprend les conditions du V0 OnboardingScreen mais en sortie d'identifiant
 * stable P0..P8 plutôt qu'un objet visuel.
 *
 * L'ordre des conditions est important (premier match gagne) — calqué V0.
 */
export function computeProfileDynamicId(answers: OnboardingAnswers): ProfileDynamicId {
  const energy = answers.energy ?? 5;
  const isLow = energy <= 3;
  const isHigh = energy >= 7;
  const isHeavy = answers.body === 'Lourd';
  // Accepte les libellés V0 ('Agité') ET V1 Sprint 28 ('Dans tous les sens').
  const isAgitated =
    answers.mental === 'Agité' || answers.mental === 'Dans tous les sens';
  const isFired = answers.motivation === 'À fond';
  const isHesitant = answers.motivation === 'Un peu';

  if (isLow && isHeavy && isAgitated) return 'P1';
  if (isLow) return 'P2';
  if (isHeavy && isAgitated) return 'P3';
  if (isHigh && isFired) return 'P4';
  if (isHigh) return 'P5';
  if (isHeavy) return 'P6';
  if (isAgitated) return 'P7';
  if (isHesitant) return 'P8';
  return 'P0';
}

/**
 * Convertit `Record<string, string>` (format historique V0 `onboardingData`)
 * en `OnboardingAnswers` typé. Le V0 stocke `energy` en string aussi.
 */
export function parseOnboardingAnswers(raw: Record<string, string | number>): OnboardingAnswers {
  return {
    energy:
      typeof raw.energy === 'number' ? raw.energy : raw.energy ? Number(raw.energy) : undefined,
    body: typeof raw.body === 'string' ? raw.body : undefined,
    mental: typeof raw.mental === 'string' ? raw.mental : undefined,
    motivation: typeof raw.motivation === 'string' ? raw.motivation : undefined,
  };
}

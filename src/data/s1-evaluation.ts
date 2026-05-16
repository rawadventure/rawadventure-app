/**
 * s1-evaluation.ts — données de l'évaluation 12 questions S1 Respiration.
 *
 * Réf Feature Spec S1 V1.0 §2.2 + Métriques V1.5 §2.4.
 *
 * Questions reprises intégralement de la matière V0 Jacky validée 12 mai 2026.
 * Les questions Q6, Q7 et Q8 sont marquées `reversed: true` — leur score est
 * inversé au calcul (score_utilisé = 6 - réponse) car formulées en sens inverse
 * des autres (un 5 = respi MOINS fonctionnelle, pas plus).
 */

export type S1QuestionId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type S1Question = {
  id: S1QuestionId;
  text: string;
  /** Si true, le score est inversé au calcul (score_utilisé = 6 - réponse). */
  reversed: boolean;
  copySlot: string;
};

export const S1_EVALUATION_QUESTIONS: readonly S1Question[] = [
  { id: 1, text: 'Ma respiration est calme et lente au repos.', reversed: false, copySlot: 'copy.IA-40.s1.q1' },
  { id: 2, text: 'Je respire principalement par le nez dans la journée.', reversed: false, copySlot: 'copy.IA-40.s1.q2' },
  { id: 3, text: 'Je respire par le nez pendant la nuit.', reversed: false, copySlot: 'copy.IA-40.s1.q3' },
  { id: 4, text: 'Ma respiration se fait naturellement dans le ventre.', reversed: false, copySlot: 'copy.IA-40.s1.q4' },
  { id: 5, text: 'Mes épaules restent détendues quand je respire.', reversed: false, copySlot: 'copy.IA-40.s1.q5' },
  { id: 6, text: 'Je ressens parfois le besoin de respirer fort ou profondément.', reversed: true, copySlot: 'copy.IA-40.s1.q6' },
  { id: 7, text: 'Je soupire ou bâille souvent sans raison claire.', reversed: true, copySlot: 'copy.IA-40.s1.q7' },
  { id: 8, text: 'Je me sens parfois à court d\'air ou oppressé.', reversed: true, copySlot: 'copy.IA-40.s1.q8' },
  { id: 9, text: 'Je récupère rapidement mon souffle après un effort léger.', reversed: false, copySlot: 'copy.IA-40.s1.q9' },
  { id: 10, text: 'Ma respiration m\'aide à me calmer quand je suis stressé.', reversed: false, copySlot: 'copy.IA-40.s1.q10' },
  { id: 11, text: 'Je suis conscient de ma respiration dans la journée.', reversed: false, copySlot: 'copy.IA-40.s1.q11' },
  { id: 12, text: 'Je peux ralentir volontairement ma respiration sans inconfort.', reversed: false, copySlot: 'copy.IA-40.s1.q12' },
] as const;

/** Diagnostic 5 niveaux S1 (Métriques V1.5 §2.4 / Feature Spec S1 §2.3). */
export type S1Diagnostic = {
  level: 1 | 2 | 3 | 4 | 5;
  label: string;
  /** Message d'accueil pédagogique placeholder — Brief contenu V1 à venir. */
  message: string;
};

export const S1_DIAGNOSTICS: Record<1 | 2 | 3 | 4 | 5, S1Diagnostic> = {
  1: {
    level: 1,
    label: 'Coûteuse',
    message:
      'Ta respiration est aujourd\'hui coûteuse — le corps lutte pour maintenir l\'apport en air. C\'est exactement le terrain où une semaine de pratique change le plus de choses. [copy à valider]',
  },
  2: {
    level: 2,
    label: 'Instable',
    message:
      'Ta respiration est instable. Elle alterne entre des moments fluides et des moments contraints. Cette semaine va te donner des repères pour stabiliser. [copy à valider]',
  },
  3: {
    level: 3,
    label: 'Respi en mode adaptation',
    message:
      'Ta respiration est en mode adaptation. Ni en alerte, ni vraiment libre — elle fait son travail mais sans réserve. Cette semaine va t\'aider à élargir le terrain. [copy à valider]',
  },
  4: {
    level: 4,
    label: 'Fonctionnelle',
    message:
      'Ta respiration est fonctionnelle. Bonne base. La semaine va te permettre d\'affiner et d\'aller chercher de la finesse. [copy à valider]',
  },
  5: {
    level: 5,
    label: 'Régulatrice',
    message:
      'Ta respiration est régulatrice — elle te sert d\'outil pour gérer ton état. La semaine va consolider cette compétence. [copy à valider]',
  },
};

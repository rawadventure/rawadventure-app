/**
 * s3-evaluation.ts — données de l'évaluation 12 questions S3 Alimentation.
 *
 * Réf brief-pilier-s3-alimentation-v1.md + matière Jacky V0
 * (V0_PILIER 3 — ALIMENTATION.docx) — 12 questions et 5 diagnostics
 * livrés explicitement par Jacky dans le doc V0.
 *
 * Pattern Type A — 5 questions inversées (Q4/Q6/Q8/Q10/Q12 formulées négatif).
 */

import type { S1Question, S1Diagnostic } from './s1-evaluation';

export const S3_EVALUATION_QUESTIONS: readonly S1Question[] = [
  { id: 1, text: 'Mon alimentation est composée principalement d\'aliments frais et peu transformés.', reversed: false, copySlot: 'copy.IA-40.s3.q1' },
  { id: 2, text: 'Je consomme régulièrement des fruits dans la journée.', reversed: false, copySlot: 'copy.IA-40.s3.q2' },
  { id: 3, text: 'Mon énergie reste stable après les repas.', reversed: false, copySlot: 'copy.IA-40.s3.q3' },
  { id: 4, text: 'Je ressens souvent de la fatigue après avoir mangé.', reversed: true, copySlot: 'copy.IA-40.s3.q4' },
  { id: 5, text: 'Je me sens léger après mes repas.', reversed: false, copySlot: 'copy.IA-40.s3.q5' },
  { id: 6, text: 'Je ressens des ballonnements, lourdeurs ou inconfort digestif.', reversed: true, copySlot: 'copy.IA-40.s3.q6' },
  { id: 7, text: 'Je bois de l\'eau régulièrement dans la journée.', reversed: false, copySlot: 'copy.IA-40.s3.q7' },
  { id: 8, text: 'Je consomme souvent des produits industriels ou transformés.', reversed: true, copySlot: 'copy.IA-40.s3.q8' },
  { id: 9, text: 'Je ressens clairement la vraie faim, différente d\'une envie ou d\'un automatisme.', reversed: false, copySlot: 'copy.IA-40.s3.q9' },
  { id: 10, text: 'Je mange souvent devant un écran ou en étant distrait.', reversed: true, copySlot: 'copy.IA-40.s3.q10' },
  { id: 11, text: 'Mon alimentation est simple, lisible et facile à digérer.', reversed: false, copySlot: 'copy.IA-40.s3.q11' },
  { id: 12, text: 'Certains aliments me fatiguent, me ralentissent ou me donnent une sensation de lourdeur.', reversed: true, copySlot: 'copy.IA-40.s3.q12' },
] as const;

/** Diagnostic 5 niveaux S3 (matière Jacky V0 § "Résultat sur 5 niveaux"). */
export const S3_DIAGNOSTICS: Record<1 | 2 | 3 | 4 | 5, S1Diagnostic> = {
  1: {
    level: 1,
    label: 'Alimentation contraignante',
    message:
      'Ton alimentation demande probablement beaucoup d\'énergie à ton corps. La digestion peut devenir une charge importante. Cette semaine, on va simplement alléger ce qui surcharge et observer comment ton corps répond.',
  },
  2: {
    level: 2,
    label: 'Alimentation coûteuse',
    message:
      'Certaines bases sont présentes, mais ton corps compense encore beaucoup après les repas. Cette semaine va t\'aider à voir ce qui se libère quand la charge digestive baisse.',
  },
  3: {
    level: 3,
    label: 'Alimentation instable',
    message:
      'Ton alimentation peut parfois soutenir ton énergie, mais elle reste irrégulière selon les repas, les horaires ou les choix. Cette semaine va t\'aider à créer un cadre simple et reproductible.',
  },
  4: {
    level: 4,
    label: 'Alimentation soutenante',
    message:
      'Ton alimentation commence à soutenir ton énergie, ta digestion et ta stabilité. La semaine va t\'aider à affiner — chercher la simplicité qui libère encore plus.',
  },
  5: {
    level: 5,
    label: 'Alimentation régénérante',
    message:
      'Ton alimentation est déjà très proche d\'un fonctionnement simple, vivant et cohérent avec ton corps. La semaine consolide en jouant sur la finesse plutôt que sur le changement.',
  },
};

/**
 * s8-evaluation.ts — données de l'évaluation 12 questions S8 Élimination et détox.
 *
 * Réf brief-pilier-s8-elimination-detox-v1.md + matière Jacky V0
 * (V0_PILIER 8 — ÉLIMINATION & DÉTOX.docx) — 12 questions et 5 niveaux
 * livrés explicitement par Jacky.
 *
 * Pattern Type A — 3 questions inversées (Q4 lourd/chargé, Q5 ballonnements,
 * Q6 selles sèches).
 */

import type { S1Question, S1Diagnostic } from './s1-evaluation';

export const S8_EVALUATION_QUESTIONS: readonly S1Question[] = [
  { id: 1, text: 'Mon transit est régulier.', reversed: false, copySlot: 'copy.IA-40.s8.q1' },
  { id: 2, text: 'Je vais à la selle facilement.', reversed: false, copySlot: 'copy.IA-40.s8.q2' },
  { id: 3, text: 'Mon ventre est confortable.', reversed: false, copySlot: 'copy.IA-40.s8.q3' },
  { id: 4, text: 'Je me sens souvent lourd ou chargé.', reversed: true, copySlot: 'copy.IA-40.s8.q4' },
  { id: 5, text: 'J\'ai des ballonnements.', reversed: true, copySlot: 'copy.IA-40.s8.q5' },
  { id: 6, text: 'J\'ai parfois des selles sèches ou difficiles à évacuer.', reversed: true, copySlot: 'copy.IA-40.s8.q6' },
  { id: 7, text: 'Je me sens bien hydraté.', reversed: false, copySlot: 'copy.IA-40.s8.q7' },
  { id: 8, text: 'Je consomme régulièrement des jus, fruits ou légumes riches en eau.', reversed: false, copySlot: 'copy.IA-40.s8.q8' },
  { id: 9, text: 'Mon énergie est stable.', reversed: false, copySlot: 'copy.IA-40.s8.q9' },
  { id: 10, text: 'Ma digestion est fluide.', reversed: false, copySlot: 'copy.IA-40.s8.q10' },
  { id: 11, text: 'Je ressens que mon corps élimine correctement.', reversed: false, copySlot: 'copy.IA-40.s8.q11' },
  { id: 12, text: 'Je me sens léger dans mon ventre.', reversed: false, copySlot: 'copy.IA-40.s8.q12' },
] as const;

/** Diagnostic 5 niveaux S8 (matière Jacky V0). */
export const S8_DIAGNOSTICS: Record<1 | 2 | 3 | 4 | 5, S1Diagnostic> = {
  1: {
    level: 1,
    label: 'Élimination ralentie',
    message:
      'Le corps semble manquer de fluidité et d\'élimination. Cette semaine, on va simplement l\'aider à mieux circuler, mieux s\'hydrater et mieux évacuer. Pas une détox extrême — juste plus d\'eau, plus de minéraux, plus de fluidité.',
  },
  2: {
    level: 2,
    label: 'Système chargé',
    message:
      'L\'élimination fonctionne, mais avec effort ou irrégularité. Cette semaine va t\'aider à donner à ton corps les conditions pour qu\'il évacue sans forcer.',
  },
  3: {
    level: 3,
    label: 'Élimination irrégulière',
    message:
      'Certaines bases sont présentes, mais le transit et la fluidité restent variables. Cette semaine va t\'aider à créer un signal stable — eau, minéraux, fluidité, transit.',
  },
  4: {
    level: 4,
    label: 'Élimination fonctionnelle',
    message:
      'Ton corps élimine déjà correctement, avec une bonne marge d\'optimisation. La semaine va t\'aider à affiner — sentir ce qui change quand la fluidité augmente.',
  },
  5: {
    level: 5,
    label: 'Élimination fluide',
    message:
      'Ton corps semble bien hydraté, minéralisé et capable d\'éliminer naturellement. La semaine consolide ce fonctionnement en cherchant la finesse.',
  },
};

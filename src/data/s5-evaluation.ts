/**
 * s5-evaluation.ts — données de l'évaluation 12 questions S5 Repos et régénération.
 *
 * Réf brief-pilier-s5-repos-regeneration-v1.md + matière Jacky V0
 * (V0_PILIER 5 — REPOS & RÉGÉNÉRATION.docx) — 12 questions et 5 niveaux
 * livrés explicitement par Jacky.
 *
 * **Type B** (D41) : évaluation conservée mais pas de mapping diagnostic →
 * engagement de départ. Pas de durées modulées par niveau (actions binaires
 * fait/pas fait).
 *
 * 5 questions inversées (Q3 réveille nuit, Q4 couche tard, Q5 écrans soir,
 * Q6 lève avec difficulté, Q10 stress soirée).
 */

import type { S1Question, S1Diagnostic } from './s1-evaluation';

export const S5_EVALUATION_QUESTIONS: readonly S1Question[] = [
  { id: 1, text: 'Je m\'endors facilement.', reversed: false, copySlot: 'copy.IA-40.s5.q1' },
  { id: 2, text: 'Je me réveille reposé.', reversed: false, copySlot: 'copy.IA-40.s5.q2' },
  { id: 3, text: 'Je me réveille la nuit.', reversed: true, copySlot: 'copy.IA-40.s5.q3' },
  { id: 4, text: 'Je me couche tard.', reversed: true, copySlot: 'copy.IA-40.s5.q4' },
  { id: 5, text: 'J\'utilise des écrans le soir.', reversed: true, copySlot: 'copy.IA-40.s5.q5' },
  { id: 6, text: 'Je me lève avec difficulté.', reversed: true, copySlot: 'copy.IA-40.s5.q6' },
  { id: 7, text: 'Mon énergie est stable dans la journée.', reversed: false, copySlot: 'copy.IA-40.s5.q7' },
  { id: 8, text: 'Je dors dans l\'obscurité totale.', reversed: false, copySlot: 'copy.IA-40.s5.q8' },
  { id: 9, text: 'Mon sommeil est profond.', reversed: false, copySlot: 'copy.IA-40.s5.q9' },
  { id: 10, text: 'Je ressens du stress en soirée.', reversed: true, copySlot: 'copy.IA-40.s5.q10' },
  { id: 11, text: 'Je respecte des horaires de coucher réguliers.', reversed: false, copySlot: 'copy.IA-40.s5.q11' },
  { id: 12, text: 'Je me sens récupéré physiquement au réveil.', reversed: false, copySlot: 'copy.IA-40.s5.q12' },
] as const;

/** Diagnostic 5 niveaux S5 (matière Jacky V0). */
export const S5_DIAGNOSTICS: Record<1 | 2 | 3 | 4 | 5, S1Diagnostic> = {
  1: {
    level: 1,
    label: 'Rythme très désorganisé',
    message:
      'Ton sommeil ne dépend pas seulement du nombre d\'heures. Il dépend du rythme, de la lumière et de l\'environnement que tu crées. Cette semaine va te donner les conditions pour que ton corps puisse à nouveau récupérer.',
  },
  2: {
    level: 2,
    label: 'Récupération instable',
    message:
      'Tu récupères certains jours, pas d\'autres. Cette semaine va t\'aider à créer un cadre stable — c\'est la régularité qui transforme, pas l\'intensité.',
  },
  3: {
    level: 3,
    label: 'Base correcte mais irrégulière',
    message:
      'Tu as une base correcte mais ton rythme reste irrégulier. Cette semaine va t\'aider à structurer un signal stable pour que ton corps trouve sa marge.',
  },
  4: {
    level: 4,
    label: 'Rythme soutenant',
    message:
      'Ton rythme soutient déjà ta récupération. La semaine va t\'aider à affiner — gagner en qualité de sommeil plutôt qu\'en quantité.',
  },
  5: {
    level: 5,
    label: 'Rythme régénérateur',
    message:
      'Ton rythme est cohérent et régénérateur. La semaine consolide en cherchant la finesse : observer ce qui change vraiment quand l\'environnement est optimal.',
  },
};

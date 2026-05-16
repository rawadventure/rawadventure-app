/**
 * s3-evaluation.ts — placeholder évaluation 12 questions S3 Alimentation.
 *
 * **STATUS** : placeholder Sprint 12. Vrai contenu à venir Feature Spec S3
 * basée sur `matiere-jacky/V0_PILIER 2 — ALIMENTATION.docx`.
 */

import type { S1Question, S1Diagnostic } from './s1-evaluation';

export const S3_EVALUATION_QUESTIONS: readonly S1Question[] = [
  { id: 1, text: 'Je mange à des horaires réguliers.', reversed: false, copySlot: 'copy.IA-40.s3.q1' },
  { id: 2, text: 'Mes repas contiennent des légumes frais.', reversed: false, copySlot: 'copy.IA-40.s3.q2' },
  { id: 3, text: 'Je bois suffisamment d\'eau dans la journée.', reversed: false, copySlot: 'copy.IA-40.s3.q3' },
  { id: 4, text: 'Je mâche bien mes aliments avant d\'avaler.', reversed: false, copySlot: 'copy.IA-40.s3.q4' },
  { id: 5, text: 'Je perçois clairement mes signaux de faim et de satiété.', reversed: false, copySlot: 'copy.IA-40.s3.q5' },
  { id: 6, text: 'Je grignote entre les repas sans réelle faim.', reversed: true, copySlot: 'copy.IA-40.s3.q6' },
  { id: 7, text: 'Je ressens des inconforts digestifs après un repas.', reversed: true, copySlot: 'copy.IA-40.s3.q7' },
  { id: 8, text: 'Je mange souvent en distrait (écran, debout, vite).', reversed: true, copySlot: 'copy.IA-40.s3.q8' },
  { id: 9, text: 'Je connais l\'origine et la qualité des aliments que je consomme.', reversed: false, copySlot: 'copy.IA-40.s3.q9' },
  { id: 10, text: 'Je prends du plaisir à manger.', reversed: false, copySlot: 'copy.IA-40.s3.q10' },
  { id: 11, text: 'Mon alimentation soutient mon énergie tout au long de la journée.', reversed: false, copySlot: 'copy.IA-40.s3.q11' },
  { id: 12, text: 'Je sais arrêter de manger avant de me sentir lourd.', reversed: false, copySlot: 'copy.IA-40.s3.q12' },
] as const;

export const S3_DIAGNOSTICS: Record<1 | 2 | 3 | 4 | 5, S1Diagnostic> = {
  1: { level: 1, label: 'Alimentation désorganisée', message: "Ton rapport à la nourriture est désorganisé. Beaucoup de marge — la semaine va apporter quelques repères simples. [copy à valider]" },
  2: { level: 2, label: 'Apports irréguliers', message: 'Tu manges, mais sans structure stable. Cette semaine va t\'aider à poser un cadre minimum. [copy à valider]' },
  3: { level: 3, label: 'Base correcte', message: "Base alimentaire correcte, avec des angles morts. La semaine va affiner ce qui se joue à chaque repas. [copy à valider]" },
  4: { level: 4, label: 'Alimentation soutenante', message: 'Ton alimentation soutient ton énergie. La semaine va précisifier la lecture des signaux. [copy à valider]' },
  5: { level: 5, label: 'Alimentation consciente', message: 'Tu manges avec conscience et plaisir. La semaine va consolider cette régularité. [copy à valider]' },
};

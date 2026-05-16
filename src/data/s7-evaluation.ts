/**
 * s7-evaluation.ts — placeholder évaluation S7 Mindset.
 * **Type B** (D41) : évaluation conservée, pas de mapping vers engagement.
 * Mécanique narrative 7 jours à cadrer en Feature Spec S7.
 * **STATUS** : placeholder Sprint 12.
 */

import type { S1Question, S1Diagnostic } from './s1-evaluation';

export const S7_EVALUATION_QUESTIONS: readonly S1Question[] = [
  { id: 1, text: 'Je sais accueillir mes émotions sans les fuir.', reversed: false, copySlot: 'copy.IA-40.s7.q1' },
  { id: 2, text: 'Je me parle avec bienveillance.', reversed: false, copySlot: 'copy.IA-40.s7.q2' },
  { id: 3, text: 'Je distingue mes pensées de la réalité.', reversed: false, copySlot: 'copy.IA-40.s7.q3' },
  { id: 4, text: 'Je sais me poser quand mon mental s\'emballe.', reversed: false, copySlot: 'copy.IA-40.s7.q4' },
  { id: 5, text: 'J\'observe mes réactions sans m\'identifier à elles.', reversed: false, copySlot: 'copy.IA-40.s7.q5' },
  { id: 6, text: 'Je me dévalorise souvent intérieurement.', reversed: true, copySlot: 'copy.IA-40.s7.q6' },
  { id: 7, text: 'Mes pensées tournent en boucle.', reversed: true, copySlot: 'copy.IA-40.s7.q7' },
  { id: 8, text: 'Je ressens des tensions liées à des inquiétudes mentales.', reversed: true, copySlot: 'copy.IA-40.s7.q8' },
  { id: 9, text: 'Je reconnais et nomme mes émotions.', reversed: false, copySlot: 'copy.IA-40.s7.q9' },
  { id: 10, text: 'Je sais demander de l\'aide quand j\'en ai besoin.', reversed: false, copySlot: 'copy.IA-40.s7.q10' },
  { id: 11, text: 'Mes pensées soutiennent ma vitalité plus qu\'elles ne la freinent.', reversed: false, copySlot: 'copy.IA-40.s7.q11' },
  { id: 12, text: 'Je me sens stable face à l\'inattendu.', reversed: false, copySlot: 'copy.IA-40.s7.q12' },
] as const;

export const S7_DIAGNOSTICS: Record<1 | 2 | 3 | 4 | 5, S1Diagnostic> = {
  1: { level: 1, label: 'Mental envahi', message: "Le mental occupe beaucoup de place. La semaine va apporter des outils simples. [copy à valider]" },
  2: { level: 2, label: 'Pensées instables', message: 'Tu navigues entre des moments clairs et embrouillés. La semaine va t\'aider à stabiliser. [copy à valider]' },
  3: { level: 3, label: 'En transition', message: "Tu as des repères mais peux te perdre. La semaine va consolider. [copy à valider]" },
  4: { level: 4, label: 'Mental régulé', message: "Tu sais t'observer. La semaine va affiner la précision. [copy à valider]" },
  5: { level: 5, label: 'Conscience stable', message: 'Tu es en relation lucide avec ton mental. La semaine consolide cette qualité. [copy à valider]' },
};

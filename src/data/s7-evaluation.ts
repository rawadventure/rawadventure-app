/**
 * s7-evaluation.ts — données de l'évaluation 12 questions S7 Mindset.
 *
 * Réf brief-pilier-s7-mindset-v1.md + matière Jacky V0
 * (V0_PILIER 7 — MINDSET.docx) — 12 questions et 5 niveaux livrés
 * explicitement par Jacky.
 *
 * **Type B** (D41) : évaluation conservée, pas de mapping diagnostic →
 * engagement, pas de durations modulées par niveau.
 *
 * Pattern : 6 questions inversées (Q2 négatives, Q3 rumine, Q4 emporté,
 * Q7 stress, Q8 mental tourne, Q11 reste dans négatif).
 */

import type { S1Question, S1Diagnostic } from './s1-evaluation';

export const S7_EVALUATION_QUESTIONS: readonly S1Question[] = [
  { id: 1, text: 'Je remarque facilement mes pensées.', reversed: false, copySlot: 'copy.IA-40.s7.q1' },
  { id: 2, text: 'Mes pensées sont souvent négatives.', reversed: true, copySlot: 'copy.IA-40.s7.q2' },
  { id: 3, text: 'Je rumine souvent.', reversed: true, copySlot: 'copy.IA-40.s7.q3' },
  { id: 4, text: 'Je me laisse emporter par mes émotions.', reversed: true, copySlot: 'copy.IA-40.s7.q4' },
  { id: 5, text: 'J\'arrive à prendre du recul.', reversed: false, copySlot: 'copy.IA-40.s7.q5' },
  { id: 6, text: 'Je vois facilement du positif.', reversed: false, copySlot: 'copy.IA-40.s7.q6' },
  { id: 7, text: 'Je ressens du stress régulièrement.', reversed: true, copySlot: 'copy.IA-40.s7.q7' },
  { id: 8, text: 'Mon mental tourne beaucoup.', reversed: true, copySlot: 'copy.IA-40.s7.q8' },
  { id: 9, text: 'Je me sens stable émotionnellement.', reversed: false, copySlot: 'copy.IA-40.s7.q9' },
  { id: 10, text: 'Je peux changer mon état rapidement.', reversed: false, copySlot: 'copy.IA-40.s7.q10' },
  { id: 11, text: 'Je reste longtemps dans le négatif.', reversed: true, copySlot: 'copy.IA-40.s7.q11' },
  { id: 12, text: 'Je me sens maître de mes réactions.', reversed: false, copySlot: 'copy.IA-40.s7.q12' },
] as const;

/** Diagnostic 5 niveaux S7 (matière Jacky V0). */
export const S7_DIAGNOSTICS: Record<1 | 2 | 3 | 4 | 5, S1Diagnostic> = {
  1: {
    level: 1,
    label: 'Mental subi',
    message:
      'Ton mental travaille toute la journée, mais aujourd\'hui ce n\'est pas toi qui le diriges. Cette semaine, tu vas commencer à le voir — puis à l\'orienter. Pas par contrôle, par observation.',
  },
  2: {
    level: 2,
    label: 'Mental réactif',
    message:
      'Ton mental réagit avant que tu n\'aies le temps de choisir. Cette semaine va te donner un espace entre la pensée et la réaction — c\'est là que la marge se crée.',
  },
  3: {
    level: 3,
    label: 'Mental instable',
    message:
      'Tu as des moments de clarté et des moments où ton mental tourne. Cette semaine va t\'aider à stabiliser cette capacité d\'observation.',
  },
  4: {
    level: 4,
    label: 'Mental en évolution',
    message:
      'Tu as déjà commencé à voir et à intervenir sur ton mental. La semaine va t\'aider à approfondir l\'impact — sentir vraiment ce que change la transformation.',
  },
  5: {
    level: 5,
    label: 'Mental orienté',
    message:
      'Ton mental est un outil que tu sais utiliser. La semaine consolide en cherchant les angles morts — les situations où l\'observation reste à affiner.',
  },
};

/**
 * s2-evaluation.ts — données de l'évaluation 12 questions S2 Activité physique.
 *
 * Réf brief-pilier-s2-activite-physique-v1.md + matière Jacky V0
 * (V0_PILIER 2 — ACTIVITÉ PHYSIQUE.docx).
 *
 * Pattern Type A — Q6/Q7/Q8 inversés (formulations négatives).
 *
 * Drafts Claude basés sur matière Jacky (qui ne contient pas de 12 questions
 * produites). À valider Jacky en session dédiée.
 */

import type { S1Question, S1Diagnostic } from './s1-evaluation';

export const S2_EVALUATION_QUESTIONS: readonly S1Question[] = [
  { id: 1, text: 'Je bouge mon corps tous les jours, ne serait-ce qu\'un peu.', reversed: false, copySlot: 'copy.IA-40.s2.q1' },
  { id: 2, text: 'Je marche au moins 30 minutes par jour.', reversed: false, copySlot: 'copy.IA-40.s2.q2' },
  { id: 3, text: 'Je me sens à l\'aise dans mon corps en mouvement.', reversed: false, copySlot: 'copy.IA-40.s2.q3' },
  { id: 4, text: 'J\'ai une activité physique structurée au moins 2 fois par semaine.', reversed: false, copySlot: 'copy.IA-40.s2.q4' },
  { id: 5, text: 'Je récupère rapidement après un effort modéré.', reversed: false, copySlot: 'copy.IA-40.s2.q5' },
  { id: 6, text: 'Je m\'essouffle facilement à l\'effort.', reversed: true, copySlot: 'copy.IA-40.s2.q6' },
  { id: 7, text: 'Je ressens des tensions ou raideurs corporelles régulières.', reversed: true, copySlot: 'copy.IA-40.s2.q7' },
  { id: 8, text: 'J\'évite les escaliers ou les efforts physiques quotidiens.', reversed: true, copySlot: 'copy.IA-40.s2.q8' },
  { id: 9, text: 'J\'ai assez de force pour porter mes affaires sans gêne.', reversed: false, copySlot: 'copy.IA-40.s2.q9' },
  { id: 10, text: 'Mon équilibre est stable, je ne trébuche pas facilement.', reversed: false, copySlot: 'copy.IA-40.s2.q10' },
  { id: 11, text: 'Je connais mes limites physiques et je les respecte.', reversed: false, copySlot: 'copy.IA-40.s2.q11' },
  { id: 12, text: 'Mon corps me semble fluide quand je bouge.', reversed: false, copySlot: 'copy.IA-40.s2.q12' },
] as const;

/** Diagnostic 5 niveaux S2 (drafts Claude — à valider Jacky). */
export const S2_DIAGNOSTICS: Record<1 | 2 | 3 | 4 | 5, S1Diagnostic> = {
  1: {
    level: 1,
    label: 'Sédentaire',
    message:
      'Ton corps a peu bougé ces derniers temps. Pas de jugement — c\'est exactement le terrain où une semaine de mouvement doux change le plus de choses.',
  },
  2: {
    level: 2,
    label: 'Mouvement irrégulier',
    message:
      'Tu bouges, mais sans régularité. Cette semaine va te donner une base stable et un rythme reproductible.',
  },
  3: {
    level: 3,
    label: 'Activité d\'entretien',
    message:
      'Tu maintiens un niveau d\'activité correct. La semaine va t\'aider à ajouter de la qualité au mouvement, pas juste de la quantité.',
  },
  4: {
    level: 4,
    label: 'Bonne base active',
    message:
      'Tu as une base solide. Cette semaine va t\'aider à affiner — chercher la finesse plutôt que l\'intensité.',
  },
  5: {
    level: 5,
    label: 'Corps acquis',
    message:
      'Ton corps est entraîné, ton mouvement est intégré. La semaine consolide en jouant sur la variété et la récupération.',
  },
};

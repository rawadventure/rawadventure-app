/**
 * s6-evaluation.ts — placeholder évaluation S6 Passion et chemin de vie.
 * **STATUS** : placeholder Sprint 12.
 */

import type { S1Question, S1Diagnostic } from './s1-evaluation';

export const S6_EVALUATION_QUESTIONS: readonly S1Question[] = [
  { id: 1, text: 'Je sais ce qui me met en mouvement profondément.', reversed: false, copySlot: 'copy.IA-40.s6.q1' },
  { id: 2, text: 'Je consacre du temps à ce qui me passionne.', reversed: false, copySlot: 'copy.IA-40.s6.q2' },
  { id: 3, text: 'Mes activités quotidiennes ont du sens pour moi.', reversed: false, copySlot: 'copy.IA-40.s6.q3' },
  { id: 4, text: 'Je me sens à ma place dans ma vie actuelle.', reversed: false, copySlot: 'copy.IA-40.s6.q4' },
  { id: 5, text: 'J\'identifie clairement mes priorités.', reversed: false, copySlot: 'copy.IA-40.s6.q5' },
  { id: 6, text: 'Je vis principalement par obligation extérieure.', reversed: true, copySlot: 'copy.IA-40.s6.q6' },
  { id: 7, text: 'Mes journées se ressemblent sans direction claire.', reversed: true, copySlot: 'copy.IA-40.s6.q7' },
  { id: 8, text: 'Je remets souvent à plus tard ce qui me tient à cœur.', reversed: true, copySlot: 'copy.IA-40.s6.q8' },
  { id: 9, text: 'J\'ose suivre une intuition forte quand elle se présente.', reversed: false, copySlot: 'copy.IA-40.s6.q9' },
  { id: 10, text: 'Je me sens vivant et engagé.', reversed: false, copySlot: 'copy.IA-40.s6.q10' },
  { id: 11, text: 'Je sais nourrir ma curiosité.', reversed: false, copySlot: 'copy.IA-40.s6.q11' },
  { id: 12, text: 'Je m\'autorise à explorer ce qui m\'attire.', reversed: false, copySlot: 'copy.IA-40.s6.q12' },
] as const;

export const S6_DIAGNOSTICS: Record<1 | 2 | 3 | 4 | 5, S1Diagnostic> = {
  1: { level: 1, label: 'En suspens', message: "Tu es en mode survie sans direction claire. La semaine va t'aider à rouvrir l'écoute. [copy à valider]" },
  2: { level: 2, label: 'Élan dispersé', message: "Tu sens des élans mais sans piste claire. La semaine va t'aider à clarifier. [copy à valider]" },
  3: { level: 3, label: 'Direction partielle', message: "Tu connais une part de ce qui t'anime. La semaine va l'épaissir. [copy à valider]" },
  4: { level: 4, label: 'Engagé', message: "Tu vis dans le sens de ce qui te tient. La semaine va affiner les choix. [copy à valider]" },
  5: { level: 5, label: 'Aligné', message: "Ton chemin est tracé et nourri. La semaine va consolider cette qualité. [copy à valider]" },
};

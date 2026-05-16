/**
 * s4-evaluation.ts — placeholder évaluation S4 Connexion au vivant.
 * **STATUS** : placeholder Sprint 12.
 */

import type { S1Question, S1Diagnostic } from './s1-evaluation';

export const S4_EVALUATION_QUESTIONS: readonly S1Question[] = [
  { id: 1, text: 'Je passe du temps dehors chaque jour.', reversed: false, copySlot: 'copy.IA-40.s4.q1' },
  { id: 2, text: 'Je suis exposé à la lumière naturelle le matin.', reversed: false, copySlot: 'copy.IA-40.s4.q2' },
  { id: 3, text: 'Je marche pieds nus sur la terre régulièrement.', reversed: false, copySlot: 'copy.IA-40.s4.q3' },
  { id: 4, text: 'Je sens les saisons dans mon corps.', reversed: false, copySlot: 'copy.IA-40.s4.q4' },
  { id: 5, text: 'Je connais et observe les plantes ou animaux autour de moi.', reversed: false, copySlot: 'copy.IA-40.s4.q5' },
  { id: 6, text: 'Je passe la majorité de mes journées en intérieur.', reversed: true, copySlot: 'copy.IA-40.s4.q6' },
  { id: 7, text: 'Je me sens déconnecté de mon environnement extérieur.', reversed: true, copySlot: 'copy.IA-40.s4.q7' },
  { id: 8, text: 'Je suis en permanence dans un environnement éclairé artificiellement.', reversed: true, copySlot: 'copy.IA-40.s4.q8' },
  { id: 9, text: 'Je touche du vivant (terre, eau, écorce) dans la semaine.', reversed: false, copySlot: 'copy.IA-40.s4.q9' },
  { id: 10, text: 'Je perçois le rythme jour/nuit dans mon corps.', reversed: false, copySlot: 'copy.IA-40.s4.q10' },
  { id: 11, text: 'Le contact avec la nature me détend.', reversed: false, copySlot: 'copy.IA-40.s4.q11' },
  { id: 12, text: 'Je vis dans un environnement vivant et sain.', reversed: false, copySlot: 'copy.IA-40.s4.q12' },
] as const;

export const S4_DIAGNOSTICS: Record<1 | 2 | 3 | 4 | 5, S1Diagnostic> = {
  1: { level: 1, label: 'Très déconnecté', message: "Tu vis principalement coupé du vivant extérieur. La semaine va t'aider à rouvrir cette porte. [copy à valider]" },
  2: { level: 2, label: 'Contact ponctuel', message: 'Tu sors par moments mais sans régularité. La semaine va installer un minimum quotidien. [copy à valider]' },
  3: { level: 3, label: 'Connexion partielle', message: "Tu as une connexion réelle mais limitée. La semaine va l'épaissir. [copy à valider]" },
  4: { level: 4, label: 'Bien ancré', message: "Tu sens le vivant autour de toi. La semaine va affiner ta lecture. [copy à valider]" },
  5: { level: 5, label: 'Tissé au vivant', message: 'Le vivant est intégré à ton quotidien. La semaine consolide cette qualité. [copy à valider]' },
};

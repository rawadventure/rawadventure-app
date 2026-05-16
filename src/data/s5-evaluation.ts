/**
 * s5-evaluation.ts — placeholder évaluation S5 Repos et régénération.
 * **Type B** (D41) : évaluation conservée mais pas de mapping diagnostic →
 * engagement de départ. Tout le monde démarre au même endroit. La Feature
 * Spec S5 décrira la mécanique alternative narrative 7 jours.
 * **STATUS** : placeholder Sprint 12.
 */

import type { S1Question, S1Diagnostic } from './s1-evaluation';

export const S5_EVALUATION_QUESTIONS: readonly S1Question[] = [
  { id: 1, text: 'Je dors entre 7 et 9 heures par nuit.', reversed: false, copySlot: 'copy.IA-40.s5.q1' },
  { id: 2, text: 'Mon sommeil est continu, sans réveils répétés.', reversed: false, copySlot: 'copy.IA-40.s5.q2' },
  { id: 3, text: 'Je me réveille reposé.', reversed: false, copySlot: 'copy.IA-40.s5.q3' },
  { id: 4, text: 'Je sais m\'arrêter pour me reposer dans la journée si besoin.', reversed: false, copySlot: 'copy.IA-40.s5.q4' },
  { id: 5, text: 'Mon endormissement est rapide (moins de 20 min).', reversed: false, copySlot: 'copy.IA-40.s5.q5' },
  { id: 6, text: 'Je me sens fatigué dès le réveil.', reversed: true, copySlot: 'copy.IA-40.s5.q6' },
  { id: 7, text: 'J\'ai besoin de café ou de stimulants pour démarrer.', reversed: true, copySlot: 'copy.IA-40.s5.q7' },
  { id: 8, text: 'Je m\'effondre le soir sans pouvoir m\'arrêter avant.', reversed: true, copySlot: 'copy.IA-40.s5.q8' },
  { id: 9, text: 'Je prends des temps calmes dans la journée.', reversed: false, copySlot: 'copy.IA-40.s5.q9' },
  { id: 10, text: 'Mon environnement de sommeil est calme et sombre.', reversed: false, copySlot: 'copy.IA-40.s5.q10' },
  { id: 11, text: 'J\'ai un rituel régulier avant le coucher.', reversed: false, copySlot: 'copy.IA-40.s5.q11' },
  { id: 12, text: 'Mon énergie est stable sur la journée.', reversed: false, copySlot: 'copy.IA-40.s5.q12' },
] as const;

export const S5_DIAGNOSTICS: Record<1 | 2 | 3 | 4 | 5, S1Diagnostic> = {
  1: { level: 1, label: 'Dette de sommeil', message: "Tu es en dette de sommeil. La semaine va poser quelques fondations très simples. [copy à valider]" },
  2: { level: 2, label: 'Récupération insuffisante', message: 'Tu récupères mais incomplètement. La semaine va t\'aider à élargir cet espace. [copy à valider]' },
  3: { level: 3, label: 'Sommeil correct', message: "Bon sommeil avec angles morts. La semaine va affiner la qualité. [copy à valider]" },
  4: { level: 4, label: 'Bonne régénération', message: "Tu récupères bien. La semaine va consolider tes appuis. [copy à valider]" },
  5: { level: 5, label: 'Récupération solide', message: 'Tu sais te reposer. La semaine va précisifier l\'écoute des signaux. [copy à valider]' },
};

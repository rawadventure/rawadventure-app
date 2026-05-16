/**
 * s8-evaluation.ts — placeholder évaluation S8 Élimination et détox.
 * **STATUS** : placeholder Sprint 12.
 */

import type { S1Question, S1Diagnostic } from './s1-evaluation';

export const S8_EVALUATION_QUESTIONS: readonly S1Question[] = [
  { id: 1, text: 'Mon transit est régulier (1-2 selles par jour).', reversed: false, copySlot: 'copy.IA-40.s8.q1' },
  { id: 2, text: 'Mes urines sont claires et inodores.', reversed: false, copySlot: 'copy.IA-40.s8.q2' },
  { id: 3, text: 'Je transpire facilement à l\'effort.', reversed: false, copySlot: 'copy.IA-40.s8.q3' },
  { id: 4, text: 'Ma peau est nette, sans inflammations chroniques.', reversed: false, copySlot: 'copy.IA-40.s8.q4' },
  { id: 5, text: 'Je bois 1.5 à 2 L d\'eau par jour.', reversed: false, copySlot: 'copy.IA-40.s8.q5' },
  { id: 6, text: 'Je suis constipé ou ballonné régulièrement.', reversed: true, copySlot: 'copy.IA-40.s8.q6' },
  { id: 7, text: 'Je ressens des problèmes cutanés (boutons, eczéma, démangeaisons).', reversed: true, copySlot: 'copy.IA-40.s8.q7' },
  { id: 8, text: 'Je consomme régulièrement des produits transformés.', reversed: true, copySlot: 'copy.IA-40.s8.q8' },
  { id: 9, text: 'Je sens mon corps léger après les repas.', reversed: false, copySlot: 'copy.IA-40.s8.q9' },
  { id: 10, text: 'Je connais et applique des pratiques de drainage simples.', reversed: false, copySlot: 'copy.IA-40.s8.q10' },
  { id: 11, text: 'Mon corps a une bonne capacité à éliminer.', reversed: false, copySlot: 'copy.IA-40.s8.q11' },
  { id: 12, text: 'Je suis attentif à ce qui entre dans mon corps.', reversed: false, copySlot: 'copy.IA-40.s8.q12' },
] as const;

export const S8_DIAGNOSTICS: Record<1 | 2 | 3 | 4 | 5, S1Diagnostic> = {
  1: { level: 1, label: 'Surcharge', message: "Tes systèmes d'élimination sont saturés. La semaine va apporter des leviers simples. [copy à valider]" },
  2: { level: 2, label: 'Élimination ralentie', message: 'Tu élimines mais pas optimal. La semaine va débloquer. [copy à valider]' },
  3: { level: 3, label: 'Élimination correcte', message: "Bon fonctionnement avec angles morts. La semaine va affiner. [copy à valider]" },
  4: { level: 4, label: 'Détox fluide', message: "Ton corps évacue bien. La semaine va précisifier l'écoute. [copy à valider]" },
  5: { level: 5, label: 'Terrain propre', message: 'Ton terrain est sain et opérant. La semaine va consolider. [copy à valider]' },
};

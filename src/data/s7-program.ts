/**
 * s7-program.ts — placeholder 7 jours S7 Mindset (Type B).
 * **STATUS** : placeholder Sprint 12.
 */

import type { S1Day } from './s1-program';

export const S7_PROGRAM: readonly S1Day[] = [
  { id: 1, title: 'Nommer une émotion', objective: 'Identifier et nommer 3 émotions ressenties dans la journée.', pedagogy: "Nommer = première étape pour ne pas être emporté. [copy à valider]", copySlot: 'copy.IA-43.s7.j1-explication' },
  { id: 2, title: 'Pause respi consciente', objective: '3 fois 1 min de respiration consciente.', pedagogy: "Sortir du flux mental par le corps. [copy à valider]", copySlot: 'copy.IA-43.s7.j2-explication' },
  { id: 3, title: 'Observer une pensée', objective: 'Repérer une pensée récurrente, la noter sans la juger.', pedagogy: "Tu n'es pas tes pensées, tu les observes. [copy à valider]", copySlot: 'copy.IA-43.s7.j3-explication' },
  { id: 4, title: 'Auto-compassion', objective: 'Te parler comme tu parlerais à un ami proche.', pedagogy: "Le ton intérieur change tout. [copy à valider]", copySlot: 'copy.IA-43.s7.j4-explication' },
  { id: 5, title: 'Marche méditative', objective: '15 min de marche en attention au corps.', pedagogy: "Le mouvement libère ce qui tourne dans la tête. [copy à valider]", copySlot: 'copy.IA-43.s7.j5-explication' },
  { id: 6, title: 'Lâcher prise', objective: 'Identifier UNE chose à lâcher aujourd\'hui.', pedagogy: "Lâcher ≠ abandonner. C'est libérer de l'énergie. [copy à valider]", copySlot: 'copy.IA-43.s7.j6-explication' },
  { id: 7, title: 'Synthèse calme', objective: 'Observer en silence 10 min ce qui a bougé en toi.', pedagogy: "Faire le bilan sans jugement. [copy à valider]", copySlot: 'copy.IA-43.s7.j7-explication' },
] as const;

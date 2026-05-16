/**
 * s5-program.ts — placeholder 7 jours S5 Repos et régénération (Type B).
 * **STATUS** : placeholder Sprint 12.
 */

import type { S1Day } from './s1-program';

export const S5_PROGRAM: readonly S1Day[] = [
  { id: 1, title: 'Coucher régulier', objective: 'Se coucher à heure fixe ce soir.', pedagogy: "Régularité = clé n°1 du sommeil de qualité. [copy à valider]", copySlot: 'copy.IA-43.s5.j1-explication' },
  { id: 2, title: 'Pas d\'écran 1h avant', objective: 'Couper tous écrans 60 min avant coucher.', pedagogy: "La lumière bleue retarde la mélatonine. [copy à valider]", copySlot: 'copy.IA-43.s5.j2-explication' },
  { id: 3, title: 'Chambre fraîche', objective: 'Baisser la température de la chambre.', pedagogy: "18-19 °C optimal pour l'endormissement. [copy à valider]", copySlot: 'copy.IA-43.s5.j3-explication' },
  { id: 4, title: 'Pause respi avant nuit', objective: '5 min de respiration ventrale au lit.', pedagogy: "Active le parasympathique avant l'endormissement. [copy à valider]", copySlot: 'copy.IA-43.s5.j4-explication' },
  { id: 5, title: 'Sieste consciente', objective: '10-20 min de repos allongé en journée.', pedagogy: "Pas dormir longtemps — juste poser le système nerveux. [copy à valider]", copySlot: 'copy.IA-43.s5.j5-explication' },
  { id: 6, title: 'Journal du soir', objective: 'Écrire 3 phrases sur la journée passée.', pedagogy: "Décharger la tête avant le coucher. [copy à valider]", copySlot: 'copy.IA-43.s5.j6-explication' },
  { id: 7, title: 'Routine complète', objective: 'Combiner tous les éléments de la semaine.', pedagogy: "Tu construis une routine pour la suite. [copy à valider]", copySlot: 'copy.IA-43.s5.j7-explication' },
] as const;

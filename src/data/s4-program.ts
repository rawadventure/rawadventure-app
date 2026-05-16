/**
 * s4-program.ts — placeholder 7 jours S4 Connexion au vivant.
 * **STATUS** : placeholder Sprint 12.
 */

import type { S1Day } from './s1-program';

export const S4_PROGRAM: readonly S1Day[] = [
  { id: 1, title: 'Lumière du matin', objective: '10 min de lumière naturelle directe dans l\'heure du réveil.', pedagogy: "La lumière matinale règle ton horloge biologique. [copy à valider]", copySlot: 'copy.IA-43.s4.j1-explication' },
  { id: 2, title: 'Marcher dehors', objective: '20 min de marche en extérieur.', pedagogy: "Air, lumière, odeurs — un cocktail simple et puissant. [copy à valider]", copySlot: 'copy.IA-43.s4.j2-explication' },
  { id: 3, title: 'Pieds nus', objective: 'Marcher 5 min pieds nus sur terre, herbe ou sable.', pedagogy: "Le contact direct au sol décharge l'électricité statique et relie. [copy à valider]", copySlot: 'copy.IA-43.s4.j3-explication' },
  { id: 4, title: 'Observer une plante', objective: 'Choisir une plante, l\'observer 5 min en silence.', pedagogy: "Attention soutenue sur un vivant — exercice rare et reposant. [copy à valider]", copySlot: 'copy.IA-43.s4.j4-explication' },
  { id: 5, title: 'Toucher le vivant', objective: 'Toucher avec attention terre, eau, écorce, feuille.', pedagogy: "Le toucher délicat ramène dans le corps. [copy à valider]", copySlot: 'copy.IA-43.s4.j5-explication' },
  { id: 6, title: 'Coucher de soleil', objective: 'Regarder le coucher du soleil sans écran.', pedagogy: "La lumière du soir prépare le système nerveux à la nuit. [copy à valider]", copySlot: 'copy.IA-43.s4.j6-explication' },
  { id: 7, title: 'Journée connectée', objective: 'Intégrer lumière, marche, contact direct dans une même journée.', pedagogy: "Combiner les éléments de la semaine en routine vivante. [copy à valider]", copySlot: 'copy.IA-43.s4.j7-explication' },
] as const;

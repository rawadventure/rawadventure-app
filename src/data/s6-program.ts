/**
 * s6-program.ts — placeholder 7 jours S6 Passion et chemin de vie.
 * **STATUS** : placeholder Sprint 12.
 */

import type { S1Day } from './s1-program';

export const S6_PROGRAM: readonly S1Day[] = [
  { id: 1, title: 'Lister ce qui anime', objective: 'Écrire 10 choses qui te mettent en mouvement.', pedagogy: "Sortir de la tête ce qui est confus dedans. [copy à valider]", copySlot: 'copy.IA-43.s6.j1-explication' },
  { id: 2, title: 'Une action curieuse', objective: 'Faire une chose qui éveille ta curiosité aujourd\'hui.', pedagogy: "La curiosité se renforce par la pratique. [copy à valider]", copySlot: 'copy.IA-43.s6.j2-explication' },
  { id: 3, title: 'Sentir le oui / non', objective: 'Observer les vrais oui et non de ta journée.', pedagogy: "Distinguer désir et obligation est une compétence. [copy à valider]", copySlot: 'copy.IA-43.s6.j3-explication' },
  { id: 4, title: 'Temps gratuit', objective: '30 min pour une activité sans utilité immédiate.', pedagogy: "Le jeu adulte est rare. Aujourd'hui tu le réintroduis. [copy à valider]", copySlot: 'copy.IA-43.s6.j4-explication' },
  { id: 5, title: 'Une priorité', objective: 'Identifier UNE priorité forte et lui consacrer 20 min.', pedagogy: "Une priorité honorée nourrit plus que 10 actes dispersés. [copy à valider]", copySlot: 'copy.IA-43.s6.j5-explication' },
  { id: 6, title: 'Conversation forte', objective: 'Parler à quelqu\'un de ce qui te tient à cœur.', pedagogy: "Mettre en mots, c'est ancrer. [copy à valider]", copySlot: 'copy.IA-43.s6.j6-explication' },
  { id: 7, title: 'Intention semaine', objective: 'Poser une intention concrète pour la semaine suivante.', pedagogy: "Concrétiser ce qui s'est dégagé pendant la semaine. [copy à valider]", copySlot: 'copy.IA-43.s6.j7-explication' },
] as const;

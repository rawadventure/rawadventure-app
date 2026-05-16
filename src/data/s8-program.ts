/**
 * s8-program.ts — placeholder 7 jours S8 Élimination et détox.
 * **STATUS** : placeholder Sprint 12.
 */

import type { S1Day } from './s1-program';

export const S8_PROGRAM: readonly S1Day[] = [
  { id: 1, title: 'Hydratation cadrée', objective: 'Boire 1.5 L d\'eau de qualité dans la journée.', pedagogy: "L'eau est le premier transporteur de déchets. [copy à valider]", copySlot: 'copy.IA-43.s8.j1-explication' },
  { id: 2, title: 'Transit conscient', objective: 'Aller aux toilettes au premier signal, sans retarder.', pedagogy: "Retarder le signal fatigue le système. [copy à valider]", copySlot: 'copy.IA-43.s8.j2-explication' },
  { id: 3, title: 'Brossage à sec', objective: '5 min de brossage à sec du corps avant la douche.', pedagogy: "Stimule la circulation lymphatique. [copy à valider]", copySlot: 'copy.IA-43.s8.j3-explication' },
  { id: 4, title: 'Sudation', objective: 'Activité physique qui fait transpirer 20 min.', pedagogy: "La transpiration est une voie d'élimination majeure. [copy à valider]", copySlot: 'copy.IA-43.s8.j4-explication' },
  { id: 5, title: 'Aliments simples', objective: 'Manger uniquement des aliments non-transformés.', pedagogy: "Soulager les organes émonctoires pour 24h. [copy à valider]", copySlot: 'copy.IA-43.s8.j5-explication' },
  { id: 6, title: 'Pause digestive', objective: '14h de jeûne nocturne (ex : 19h → 9h).', pedagogy: "Donner du temps aux organes pour nettoyer. [copy à valider]", copySlot: 'copy.IA-43.s8.j6-explication' },
  { id: 7, title: 'Intégration', objective: 'Combiner hydratation, mouvement, alimentation simple.', pedagogy: "Tu poses une routine de soutien pour la suite. [copy à valider]", copySlot: 'copy.IA-43.s8.j7-explication' },
] as const;

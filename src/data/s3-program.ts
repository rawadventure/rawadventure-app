/**
 * s3-program.ts — placeholder 7 jours S3 Alimentation.
 * **STATUS** : placeholder Sprint 12.
 */

import type { S1Day } from './s1-program';

export const S3_PROGRAM: readonly S1Day[] = [
  { id: 1, title: 'Mâcher chaque bouchée', objective: 'Mâcher au moins 20 fois par bouchée.', pedagogy: "Mâcher déclenche la digestion. Plus tu mâches, moins l'estomac travaille. [copy à valider]", copySlot: 'copy.IA-43.s3.j1-explication' },
  { id: 2, title: 'Manger en silence', objective: 'Un repas sans écran, sans téléphone.', pedagogy: "Sans distraction, tu retrouves tes signaux de satiété. [copy à valider]", copySlot: 'copy.IA-43.s3.j2-explication' },
  { id: 3, title: 'Eau au réveil', objective: 'Boire 500 ml d\'eau dès le lever.', pedagogy: "Le corps se déshydrate la nuit. Réhydrater au réveil relance les systèmes. [copy à valider]", copySlot: 'copy.IA-43.s3.j3-explication' },
  { id: 4, title: 'Légumes en entrée', objective: 'Commencer chaque repas par des légumes crus ou cuits.', pedagogy: "Les fibres en premier ralentissent l'absorption des sucres. [copy à valider]", copySlot: 'copy.IA-43.s3.j4-explication' },
  { id: 5, title: 'Pause entre les bouchées', objective: 'Reposer fourchette ou cuillère entre chaque bouchée.', pedagogy: "Ce micro-rituel ralentit le rythme et active la satiété. [copy à valider]", copySlot: 'copy.IA-43.s3.j5-explication' },
  { id: 6, title: 'Sentir la faim', objective: 'Attendre la faim physique avant de manger.', pedagogy: "Distinguer faim physique et envie émotionnelle. [copy à valider]", copySlot: 'copy.IA-43.s3.j6-explication' },
  { id: 7, title: 'Repas conscient complet', objective: 'Combiner tout : mâcher, silence, eau, légumes en entrée.', pedagogy: "Aujourd'hui tu mets tout ensemble. [copy à valider]", copySlot: 'copy.IA-43.s3.j7-explication' },
] as const;

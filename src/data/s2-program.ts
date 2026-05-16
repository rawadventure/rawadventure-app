/**
 * s2-program.ts — programme placeholder 7 jours S2 Activité physique.
 *
 * **STATUS** : placeholder Sprint 11. La vraie progression pédagogique S2
 * viendra de la Feature Spec S2 (à produire Sprint 12+) basée sur
 * `matiere-jacky/V0_PILIER 3 — CONDITION PHYSIQUE.docx`. Pour l'instant on
 * propose une progression simple "mobilité → marche → renforcement" pour
 * permettre le test de bascule pilier S1→S2.
 */

import type { S1Day } from './s1-program';

export const S2_PROGRAM: readonly S1Day[] = [
  {
    id: 1,
    title: 'Mobilité articulaire',
    objective: '5 min de mobilisation douce des articulations.',
    pedagogy:
      "Avant d'aller plus loin, on lubrifie les articulations. Cou, épaules, hanches, chevilles — chaque rotation libère ce qui s'est figé. [copy à valider]",
    copySlot: 'copy.IA-43.s2.j1-explication',
  },
  {
    id: 2,
    title: 'Marche consciente',
    objective: '20 min de marche en respiration nasale.',
    pedagogy:
      "La marche est le mouvement le plus naturel. En respirant par le nez, tu maintiens un effort soutenable et tu actives le système parasympathique. [copy à valider]",
    copySlot: 'copy.IA-43.s2.j2-explication',
  },
  {
    id: 3,
    title: 'Mobilité + force',
    objective: 'Mobilité + 10 répétitions de squat à poids du corps.',
    pedagogy:
      "Squat = mouvement fondamental humain. Pas de charge — juste apprendre à descendre et remonter avec le bon alignement. [copy à valider]",
    copySlot: 'copy.IA-43.s2.j3-explication',
  },
  {
    id: 4,
    title: 'Marche soutenue',
    objective: '30 min de marche, rythme plus engagé.',
    pedagogy:
      "Aujourd'hui on augmente l'intensité de la marche. Pas du running — juste un rythme où tu commences à respirer plus profondément. [copy à valider]",
    copySlot: 'copy.IA-43.s2.j4-explication',
  },
  {
    id: 5,
    title: 'Renforcement doux',
    objective: 'Pompes contre mur + planche 30s.',
    pedagogy:
      "Premiers exercices de force fonctionnelle. Pompes contre mur si tu n'es pas habitué — la version au sol viendra plus tard. [copy à valider]",
    copySlot: 'copy.IA-43.s2.j5-explication',
  },
  {
    id: 6,
    title: 'Mouvement libre',
    objective: '20 min de mouvement choisi (danse, vélo, nage, marche…).',
    pedagogy:
      "Aujourd'hui c'est toi qui choisis. L'important : que ça te fasse plaisir et que ce soit du mouvement. [copy à valider]",
    copySlot: 'copy.IA-43.s2.j6-explication',
  },
  {
    id: 7,
    title: 'Intégration',
    objective: 'Combiner mobilité + force + cardio léger sur 30 min.',
    pedagogy:
      "Dernier jour. Tu construis une mini-routine qui combine les éléments de la semaine. Tu peux la garder comme base hebdomadaire. [copy à valider]",
    copySlot: 'copy.IA-43.s2.j7-explication',
  },
] as const;

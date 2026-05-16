/**
 * s2-evaluation.ts — données placeholder évaluation 12 questions S2 Activité physique.
 *
 * **STATUS** : placeholder Sprint 11. Les vraies questions S2 viendront du
 * fichier `matiere-jacky/V0_PILIER 3 — CONDITION PHYSIQUE.docx` après
 * production de la Feature Spec S2 (à venir Sprint 12+). Pour l'instant, on
 * reprend la structure S1 avec des questions clonées + slot copy distinct.
 *
 * Inversion sémantique : pas de questions inversées en S2 dans cette version
 * placeholder. À réviser quand le contenu réel sera produit.
 */

import type { S1Question } from './s1-evaluation';

export const S2_EVALUATION_QUESTIONS: readonly S1Question[] = [
  { id: 1, text: 'Je bouge mon corps tous les jours.', reversed: false, copySlot: 'copy.IA-40.s2.q1' },
  { id: 2, text: 'Je marche au moins 30 minutes par jour.', reversed: false, copySlot: 'copy.IA-40.s2.q2' },
  { id: 3, text: 'Je me sens à l\'aise dans mon corps en mouvement.', reversed: false, copySlot: 'copy.IA-40.s2.q3' },
  { id: 4, text: 'J\'ai une activité physique structurée par semaine.', reversed: false, copySlot: 'copy.IA-40.s2.q4' },
  { id: 5, text: 'Je récupère bien après un effort physique.', reversed: false, copySlot: 'copy.IA-40.s2.q5' },
  { id: 6, text: 'Je m\'essouffle facilement à l\'effort.', reversed: true, copySlot: 'copy.IA-40.s2.q6' },
  { id: 7, text: 'Je ressens des tensions ou raideurs dans mon corps.', reversed: true, copySlot: 'copy.IA-40.s2.q7' },
  { id: 8, text: 'J\'évite les escaliers ou les efforts physiques quotidiens.', reversed: true, copySlot: 'copy.IA-40.s2.q8' },
  { id: 9, text: 'J\'ai une force suffisante pour porter mes affaires.', reversed: false, copySlot: 'copy.IA-40.s2.q9' },
  { id: 10, text: 'Mon équilibre est stable, je ne trébuche pas facilement.', reversed: false, copySlot: 'copy.IA-40.s2.q10' },
  { id: 11, text: 'Je connais mes limites physiques et les respecte.', reversed: false, copySlot: 'copy.IA-40.s2.q11' },
  { id: 12, text: 'Mon corps me semble fluide quand je bouge.', reversed: false, copySlot: 'copy.IA-40.s2.q12' },
] as const;

import type { S1Diagnostic } from './s1-evaluation';

export const S2_DIAGNOSTICS: Record<1 | 2 | 3 | 4 | 5, S1Diagnostic> = {
  1: {
    level: 1,
    label: 'Très sédentaire',
    message:
      'Ton corps a peu bougé ces derniers temps. Pas de jugement — c\'est exactement le terrain où une semaine de pratique douce change le plus de choses. [copy à valider]',
  },
  2: {
    level: 2,
    label: 'Mouvement irrégulier',
    message:
      'Tu bouges, mais sans régularité. Cette semaine va t\'aider à créer une base stable. [copy à valider]',
  },
  3: {
    level: 3,
    label: 'Activité d\'entretien',
    message:
      'Tu maintiens un niveau d\'activité correct. La semaine va t\'aider à ajouter de la qualité au mouvement. [copy à valider]',
  },
  4: {
    level: 4,
    label: 'Activité régulière',
    message:
      'Tu bouges bien et régulièrement. La semaine va affiner ta lecture du corps en mouvement. [copy à valider]',
  },
  5: {
    level: 5,
    label: 'Corps actif et fluide',
    message:
      'Ton corps est un allié quotidien. La semaine va consolider et préciser cette qualité. [copy à valider]',
  },
};

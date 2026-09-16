/**
 * s2-evaluation.ts — données de l'évaluation 12 questions S2 Activité physique.
 *
 * Réf brief-pilier-s2-activite-physique-v1.md + matière Jacky enrichie du
 * 16 sept 2026 (V0_PILIER 2 — ACTIVITÉ PHYSIQUE.docx, section
 * « ÉVALUATION DE DÉPART — CONDITION PHYSIQUE »).
 *
 * Provenance (réalignement salve C2, 16 sept 2026) :
 *  - 12 questions : Jacky, verbatim, dans son ordre.
 *  - Labels des 5 diagnostics : les NIVEAUX du doc Jacky.
 *  - Messages des 5 diagnostics : drafts Claude — à valider Jacky.
 *  - Inversions : Q5/Q6 inversées ; Q7 « je transpire facilement » codée
 *    directe, sens à trancher avec Jacky (arbitrage Stéphane 16 sept).
 */

import type { S1Question, S1Diagnostic } from './s1-evaluation';

export const S2_EVALUATION_QUESTIONS: readonly S1Question[] = [
  { id: 1, text: 'Je bouge physiquement presque tous les jours.', reversed: false, copySlot: 'copy.IA-40.s2.q1' },
  { id: 2, text: 'Je me sens en forme physiquement dans ma journée.', reversed: false, copySlot: 'copy.IA-40.s2.q2' },
  { id: 3, text: 'J\'ai de l\'énergie pour marcher, monter des escaliers ou porter des charges.', reversed: false, copySlot: 'copy.IA-40.s2.q3' },
  { id: 4, text: 'Mon corps récupère bien après un effort.', reversed: false, copySlot: 'copy.IA-40.s2.q4' },
  { id: 5, text: 'Je me sens souvent raide ou bloqué physiquement.', reversed: true, copySlot: 'copy.IA-40.s2.q5' },
  { id: 6, text: 'Je manque régulièrement d\'énergie pour faire du sport ou bouger.', reversed: true, copySlot: 'copy.IA-40.s2.q6' },
  // Sens à trancher avec Jacky : transpirer facilement = bon signe
  // (thermorégulation) ou mauvais signe (condition) ? Codée directe en attendant.
  { id: 7, text: 'Je transpire facilement quand je fais un effort.', reversed: false, copySlot: 'copy.IA-40.s2.q7' },
  { id: 8, text: 'Je sens que mon souffle est bon quand je marche ou cours.', reversed: false, copySlot: 'copy.IA-40.s2.q8' },
  { id: 9, text: 'Je me sens solide physiquement.', reversed: false, copySlot: 'copy.IA-40.s2.q9' },
  { id: 10, text: 'Je prends plaisir à bouger mon corps.', reversed: false, copySlot: 'copy.IA-40.s2.q10' },
  { id: 11, text: 'J\'ai l\'impression que mon corps devient plus fort ou plus endurant.', reversed: false, copySlot: 'copy.IA-40.s2.q11' },
  { id: 12, text: 'Je me sens vivant et dynamique physiquement.', reversed: false, copySlot: 'copy.IA-40.s2.q12' },
] as const;

/** Diagnostic 5 niveaux S2 — labels Jacky (NIVEAUX du doc 16 sept 2026),
 * messages drafts Claude à valider Jacky. */
export const S2_DIAGNOSTICS: Record<1 | 2 | 3 | 4 | 5, S1Diagnostic> = {
  1: {
    level: 1,
    label: 'Corps déconditionné',
    message:
      'Ton corps a peu bougé ces derniers temps. Pas de jugement — c\'est exactement le terrain où une semaine de mouvement doux change le plus de choses.',
  },
  2: {
    level: 2,
    label: 'Remise en mouvement nécessaire',
    message:
      'Tu bouges, mais sans régularité. Cette semaine va te donner une base stable et un rythme reproductible.',
  },
  3: {
    level: 3,
    label: 'Base physique présente',
    message:
      'Tu maintiens un niveau d\'activité correct. La semaine va t\'aider à ajouter de la qualité au mouvement, pas juste de la quantité.',
  },
  4: {
    level: 4,
    label: 'Condition physique fonctionnelle',
    message:
      'Tu as une base solide. Cette semaine va t\'aider à affiner — chercher la finesse plutôt que l\'intensité.',
  },
  5: {
    level: 5,
    label: 'Corps dynamique et adaptable',
    message:
      'Ton corps est entraîné, ton mouvement est intégré. La semaine consolide en jouant sur la variété et la récupération.',
  },
};

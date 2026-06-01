/**
 * s4-evaluation.ts — données de l'évaluation 12 questions S4 Connexion au vivant.
 *
 * Réf brief-pilier-s4-connexion-vivant-v1.md + matière Jacky V0
 * (V0_PILIER 4 — CONNEXION AU VIVANT.docx) — 12 questions et 5 niveaux
 * livrés explicitement par Jacky.
 *
 * Pattern Type A — Q4/Q9 inversés (formulations négatives :
 * environnements fermés, stimulation mentale).
 */

import type { S1Question, S1Diagnostic } from './s1-evaluation';

export const S4_EVALUATION_QUESTIONS: readonly S1Question[] = [
  { id: 1, text: 'Je passe du temps dehors chaque jour.', reversed: false, copySlot: 'copy.IA-40.s4.q1' },
  { id: 2, text: 'Je suis exposé à la lumière naturelle.', reversed: false, copySlot: 'copy.IA-40.s4.q2' },
  { id: 3, text: 'Je ressens le contact avec l\'air.', reversed: false, copySlot: 'copy.IA-40.s4.q3' },
  { id: 4, text: 'Je suis souvent dans des environnements fermés.', reversed: true, copySlot: 'copy.IA-40.s4.q4' },
  { id: 5, text: 'Je prends du temps sans écran.', reversed: false, copySlot: 'copy.IA-40.s4.q5' },
  { id: 6, text: 'Je me sens connecté à mon environnement.', reversed: false, copySlot: 'copy.IA-40.s4.q6' },
  { id: 7, text: 'Je ressens mon corps facilement.', reversed: false, copySlot: 'copy.IA-40.s4.q7' },
  { id: 8, text: 'Je me sens calme naturellement.', reversed: false, copySlot: 'copy.IA-40.s4.q8' },
  { id: 9, text: 'Je suis souvent stimulé mentalement.', reversed: true, copySlot: 'copy.IA-40.s4.q9' },
  { id: 10, text: 'Je prends du temps pour observer.', reversed: false, copySlot: 'copy.IA-40.s4.q10' },
  { id: 11, text: 'Je suis en contact avec des éléments naturels (terre, eau, vent…).', reversed: false, copySlot: 'copy.IA-40.s4.q11' },
  { id: 12, text: 'Je ressens une vraie présence dans mes journées.', reversed: false, copySlot: 'copy.IA-40.s4.q12' },
] as const;

/** Diagnostic 5 niveaux S4 (matière Jacky V0). */
export const S4_DIAGNOSTICS: Record<1 | 2 | 3 | 4 | 5, S1Diagnostic> = {
  1: {
    level: 1,
    label: 'Très déconnecté',
    message:
      'Ton corps a besoin de contact réel pour se réguler. Sans ça, il reste en stimulation permanente. Cette semaine va te faire ressentir le contraste — même 5 minutes réelles changent l\'état du système nerveux.',
  },
  2: {
    level: 2,
    label: 'Déconnecté',
    message:
      'Tu as quelques moments de contact mais ils sont rares. Cette semaine va t\'aider à structurer 2 moments quotidiens — matin et soir — pour donner à ton corps des repères biologiques stables.',
  },
  3: {
    level: 3,
    label: 'Variable',
    message:
      'Ton niveau de connexion fluctue selon les jours et les contextes. Cette semaine va t\'aider à créer un rythme reproductible pour que ton système nerveux trouve sa marge.',
  },
  4: {
    level: 4,
    label: 'Connecté',
    message:
      'Tu as déjà une bonne base de contact réel. La semaine va t\'aider à affiner la qualité de présence — pas juste la durée.',
  },
  5: {
    level: 5,
    label: 'Très connecté',
    message:
      'Ton rapport au vivant est solide. La semaine consolide en cherchant la finesse : observer ce que la présence change vraiment dans ta journée.',
  },
};

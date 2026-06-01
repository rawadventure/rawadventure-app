/**
 * s6-evaluation.ts — données de l'évaluation 12 questions S6 Passion et chemin de vie.
 *
 * Réf brief-pilier-s6-passion-v1.md + matière Jacky V0
 * (V0_PILIER 6 — PASSION.docx) — 12 questions et 5 niveaux livrés
 * explicitement par Jacky.
 *
 * Pattern Type A — 4 questions inversées (Q4 repousse, Q7 coupé,
 * Q8 priorise obligations, Q10 manque de sens).
 */

import type { S1Question, S1Diagnostic } from './s1-evaluation';

export const S6_EVALUATION_QUESTIONS: readonly S1Question[] = [
  { id: 1, text: 'Je sais clairement ce qui me passionne.', reversed: false, copySlot: 'copy.IA-40.s6.q1' },
  { id: 2, text: 'Je prends régulièrement du temps pour mes passions.', reversed: false, copySlot: 'copy.IA-40.s6.q2' },
  { id: 3, text: 'Mes passions me donnent de l\'énergie.', reversed: false, copySlot: 'copy.IA-40.s6.q3' },
  { id: 4, text: 'Je repousse souvent ce que j\'aime vraiment faire.', reversed: true, copySlot: 'copy.IA-40.s6.q4' },
  { id: 5, text: 'Je me sens vivant quand je pratique une activité qui me passionne.', reversed: false, copySlot: 'copy.IA-40.s6.q5' },
  { id: 6, text: 'Je consacre du temps chaque semaine à ce qui m\'anime.', reversed: false, copySlot: 'copy.IA-40.s6.q6' },
  { id: 7, text: 'Je me sens parfois coupé de ce que j\'aime vraiment.', reversed: true, copySlot: 'copy.IA-40.s6.q7' },
  { id: 8, text: 'J\'ai tendance à prioriser les obligations avant mes élans personnels.', reversed: true, copySlot: 'copy.IA-40.s6.q8' },
  { id: 9, text: 'Quand je pratique une passion, mon énergie change rapidement.', reversed: false, copySlot: 'copy.IA-40.s6.q9' },
  { id: 10, text: 'Je ressens un manque de sens ou de direction dans certaines périodes.', reversed: true, copySlot: 'copy.IA-40.s6.q10' },
  { id: 11, text: 'Je sais quelle passion je pourrais remettre en action cette semaine.', reversed: false, copySlot: 'copy.IA-40.s6.q11' },
  { id: 12, text: 'Je passe facilement de l\'envie à l\'action.', reversed: false, copySlot: 'copy.IA-40.s6.q12' },
] as const;

/** Diagnostic 5 niveaux S6 (matière Jacky V0). */
export const S6_DIAGNOSTICS: Record<1 | 2 | 3 | 4 | 5, S1Diagnostic> = {
  1: {
    level: 1,
    label: 'Passion déconnectée',
    message:
      'Tu sais peut-être ce que tu aimes, mais tu ne le vis presque pas dans ton quotidien. Cette semaine, on ne va pas réfléchir pendant des heures. On va remettre du temps réel sur ce qui t\'anime.',
  },
  2: {
    level: 2,
    label: 'Passion mise de côté',
    message:
      'Tes passions existent, mais elles passent souvent après tout le reste. Cette semaine va t\'aider à leur redonner une place — pas symbolique, concrète.',
  },
  3: {
    level: 3,
    label: 'Passion irrégulière',
    message:
      'Tu as des élans, mais ils manquent encore de régularité. Cette semaine va t\'aider à créer un cadre minimal — 15 minutes par jour suffisent à changer la dynamique.',
  },
  4: {
    level: 4,
    label: 'Passion active',
    message:
      'Tu nourris déjà ce qui t\'anime, avec une bonne marge de progression. La semaine va t\'aider à donner encore plus d\'espace à ce qui te fait vivre.',
  },
  5: {
    level: 5,
    label: 'Passion intégrée',
    message:
      'Tes passions font partie de ton équilibre et soutiennent ton énergie. La semaine consolide ce rapport vivant entre ton temps et ce qui te nourrit.',
  },
};

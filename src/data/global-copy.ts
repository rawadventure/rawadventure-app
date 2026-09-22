/**
 * global-copy — slots de copy transverses, hors écran spécifique (D23).
 *
 * F-13 (audit Lou, 22 sept 2026) : les notices de cohérence calendaire
 * vivaient en chaînes dures dans useStreakDomain (ex-ProgressContext).
 * D23 impose que tout texte affiché passe par un slot de copy identifié —
 * ce module est le point unique où Mimi & Jacky remplaceront les
 * placeholders (marqués [copy à valider]) par le copy définitif, sans
 * toucher à la logique.
 *
 * Ton : règles CLAUDE.md § 4 — sobre, non-culpabilisant (D26), pas de
 * pression par la perte, pas d'exclamation, pas d'emoji.
 */

import type { Phase } from '../lib/streak';

/**
 * Slot `copy.global.streak-reprise` (D38) : phrase de reprise de position.
 * En Phase 0 on cite le jour global (« Tu reprends au jour X ») ; en
 * Phase 1 l'UI parle en jour de pilier, pas en jour global — formulation
 * neutre hors Phase 0.
 */
export function repriseText(phase: Phase, day: number): string {
  return phase === 'phase_0'
    ? `Tu reprends au jour ${day}, là où tu t'étais arrêté.`
    : "Tu reprends là où tu t'étais arrêté.";
}

/**
 * Slot `copy.global.streak-remis-a-zero` (D26) : streak cassé après
 * absence. Affiché par la résolution de cohérence calendaire.
 */
export function streakBrokenNotice(
  phase: Phase,
  day: number,
): { title: string; body: string } {
  return {
    title: 'Streak remis à zéro',
    body:
      `Des journées sont passées sans validation. Ton streak repart de zéro — ` +
      `la prochaine validation le relance. ${repriseText(phase, day)} [copy à valider]`,
  };
}

/**
 * Slot `copy.global.message-joker-consomme` (D26/D6) : le joker
 * hebdomadaire a couvert une journée manquée.
 */
export function jokerUsedNotice(
  phase: Phase,
  day: number,
): { title: string; body: string } {
  return {
    title: 'Joker utilisé',
    body:
      `Ton joker de la semaine a couvert une journée manquée. ` +
      `Streak conservé. ${repriseText(phase, day)} [copy à valider]`,
  };
}

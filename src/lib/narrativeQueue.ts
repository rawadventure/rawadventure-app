/**
 * narrativeQueue — file d'écrans narratifs du hub (F-06 audit Lou, sept 2026).
 *
 * Encode UNE SEULE FOIS les règles de priorité narrative de la Phase 0 + S0,
 * jusqu'ici dupliquées entre l'effet hub_open de Phase0HomeScreen (14
 * dépendances, origine des « double trigger » / « re-trigger en boucle »)
 * et la cascade de handleConfirmValidation.
 *
 * Décisions encodées :
 *  - D19/D38 : charnières J3/J7/J11/J14, jouées à la VALIDATION du jour de
 *    position concerné (jamais à l'ouverture) ; jour jamais validé =
 *    charnière jamais jouée.
 *  - D25 : au plus UN événement narratif par tirage. Les écrans successifs
 *    s'espacent d'eux-mêmes : le flag est posé au déclenchement (§2.3), le
 *    tirage suivant rend l'événement d'après.
 *  - D29 : premier franchissement vs redéclenchement d'un palier —
 *    `isFirstReach` est calculé par validateDay et transite tel quel.
 *  - D30 : S0.1 (jour 15) et S0.2 (jour 16) priment sur un palier atteint le
 *    même jour → `defer_tier` ; le palier différé est repêché à la première
 *    validation sans collision (`show_tier` fromDeferred).
 *
 * Fonction PURE : aucun accès storage/réseau/horloge — tout vient de l'input,
 * tout ressort dans l'événement. L'écran applique les effets (poser le flag,
 * ouvrir la modale, setPendingTier…).
 *
 * Note : l'ancien enchaînement « palier puis charnière » (pendingCharniere,
 * Sprint 30 option A) n'est pas repris — il datait du palier 7 jours,
 * supprimé depuis. Un palier exige un streak ≥ 15 et une charnière un jour de
 * position ≤ 14 ; comme streak ≤ position (D38 : la position n'avance que par
 * validation), les deux ne peuvent plus tomber sur la même validation.
 */

import type { Phase, TierId } from './streak';

export type NarrativeTrigger = 'hub_open' | 'day_validated';

export type CharniereQueueDay = 3 | 7 | 11 | 14;

export const CHARNIERE_FLAGS: Record<
  CharniereQueueDay,
  'j3_charniere' | 'j7_charniere' | 'j11_charniere' | 'j14_charniere'
> = {
  3: 'j3_charniere',
  7: 'j7_charniere',
  11: 'j11_charniere',
  14: 'j14_charniere',
};

/** Sous-ensemble structurel de PendingTierReach (hooks/ProgressContext) —
 *  le module lib ne dépend pas des hooks. */
export type QueuePendingTier = {
  tierId: TierId;
  isFirstReach: boolean;
  streakValue: number;
};

export type NarrativeQueueInput = {
  trigger: NarrativeTrigger;
  /** Jour de position D38 au moment du tirage (valeur lue AVANT que la
   *  validation n'incrémente la position — sémantique de l'écran actuel). */
  currentDay: number;
  currentPhase: Phase;
  /** narrativeFlags du ProgressContext : flag présent = écran déjà joué. */
  narrativeFlags: Partial<Record<string, string>>;
  pendingTierReach: QueuePendingTier | null;
  /** Résultat de validateDay — requis pour trigger 'day_validated'. */
  validationResult?: {
    tierReached: TierId | null;
    tierIsFirstReach: boolean;
    newStreak: number;
    jokerUsed: boolean;
  };
};

export type NarrativeEvent =
  | { kind: 'welcome_video' }
  | { kind: 's0_1_screen' }
  | { kind: 's0_2_screen' }
  | {
      kind: 'charniere';
      day: CharniereQueueDay;
      flag: (typeof CHARNIERE_FLAGS)[CharniereQueueDay];
    }
  | {
      kind: 'show_tier';
      tierId: TierId;
      isFirstReach: boolean;
      streakValue: number;
      /** true = palier repêché depuis pendingTierReach (D30) — l'écran doit
       *  alors le consommer via clearPendingTier(). */
      fromDeferred: boolean;
    }
  | {
      kind: 'defer_tier';
      tierId: TierId;
      isFirstReach: boolean;
      streakValue: number;
    }
  | { kind: 'joker_notice'; newStreak: number };

export function nextNarrativeEvent(
  input: NarrativeQueueInput,
): NarrativeEvent | null {
  const { trigger, currentDay, currentPhase, narrativeFlags } = input;

  if (trigger === 'hub_open') {
    // IA-12 — tout premier lancement post-onboarding, peu importe le jour.
    // Garde phase_0 (audit B2) : en fenêtre transitoire phase_1 sans pilier,
    // ce hub rend brièvement — sans la garde, la vidéo J1 se rejouait à J17+.
    if (currentPhase === 'phase_0' && !narrativeFlags.welcome_video) {
      return { kind: 'welcome_video' };
    }
    // IA-20 / IA-21 — premier lancement du jour de position 15 / 16.
    if (currentDay === 15 && !narrativeFlags.s0_1_screen) {
      return { kind: 's0_1_screen' };
    }
    if (currentDay === 16 && !narrativeFlags.s0_2_screen) {
      return { kind: 's0_2_screen' };
    }
    // Pas de palier à l'ouverture : le repêchage D30 se fait à la validation.
    return null;
  }

  // trigger === 'day_validated'
  const result = input.validationResult;
  if (!result) return null;

  // D30 — collision : un palier atteint un jour S0.x est différé d'un cran.
  const isS0Day = currentDay === 15 || currentDay === 16;
  if (result.tierReached != null && isS0Day) {
    return {
      kind: 'defer_tier',
      tierId: result.tierReached,
      isFirstReach: result.tierIsFirstReach,
      streakValue: result.newStreak,
    };
  }

  if (result.tierReached != null) {
    return {
      kind: 'show_tier',
      tierId: result.tierReached,
      isFirstReach: result.tierIsFirstReach,
      streakValue: result.newStreak,
      fromDeferred: false,
    };
  }

  // D19/D38 — charnière du jour de position validé, une seule fois.
  const charniereFlag =
    CHARNIERE_FLAGS[currentDay as CharniereQueueDay] ?? null;
  if (charniereFlag && !narrativeFlags[charniereFlag]) {
    return {
      kind: 'charniere',
      day: currentDay as CharniereQueueDay,
      flag: charniereFlag,
    };
  }

  // D30 — repêchage du palier différé, à la première validation sans collision.
  if (input.pendingTierReach) {
    return {
      kind: 'show_tier',
      tierId: input.pendingTierReach.tierId,
      isFirstReach: input.pendingTierReach.isFirstReach,
      streakValue: input.pendingTierReach.streakValue,
      fromDeferred: true,
    };
  }

  if (result.jokerUsed) {
    return { kind: 'joker_notice', newStreak: result.newStreak };
  }

  return null;
}

/**
 * devTimelinePresets.ts — bibliothèque de snapshots préset pour navigation DEV.
 *
 * Chaque preset retourne un `TimelineSnapshot` complet décrivant un point
 * intéressant à tester (cold start, palier, charnière, S0.x, début/mid/fin
 * pilier, post-S8). Utilisé par UI Profil pour proposer des jumps atomiques.
 *
 * Tranche 1 : 5 snapshots de base. Tranches suivantes : +10.
 */

import type { TimelineSnapshot } from './devTimeline';

export const PRESET_PHASE0_J1_FRESH: TimelineSnapshot = {
  id: 'phase0_j1_fresh',
  label: 'P0 J1 fresh',
  description: 'Premier lancement, J1 vierge. Test welcome video + cold start.',
  phase: 'phase_0',
  currentDay: 1,
  alreadyValidatedToday: false,
  hasInitialEvalCurrent: false,
  hasFinalEvalCurrent: false,
  streakValue: 0,
  jokerConsumedThisWeek: false,
  narrativeFlagsSeen: [],
  s8FinalCompleted: false,
};

export const PRESET_PHASE0_J3_PRE_CHARNIERE: TimelineSnapshot = {
  id: 'phase0_j3_pre_charniere',
  label: 'P0 J3 avant validation',
  description: 'Valider J3 → charnière J3 fire.',
  phase: 'phase_0',
  currentDay: 3,
  alreadyValidatedToday: false,
  hasInitialEvalCurrent: false,
  hasFinalEvalCurrent: false,
  streakValue: 2,
  jokerConsumedThisWeek: false,
  narrativeFlagsSeen: ['welcome_video'],
  s8FinalCompleted: false,
};

export const PRESET_PHASE0_J7_PRE_PALIER: TimelineSnapshot = {
  id: 'phase0_j7_pre_palier',
  label: 'P0 J7 avant validation',
  description: 'Valider J7 → palier 7j + charnière J7.',
  phase: 'phase_0',
  currentDay: 7,
  alreadyValidatedToday: false,
  hasInitialEvalCurrent: false,
  hasFinalEvalCurrent: false,
  streakValue: 6,
  jokerConsumedThisWeek: false,
  narrativeFlagsSeen: ['welcome_video', 'j3_charniere'],
  s8FinalCompleted: false,
};

export const PRESET_PHASE0_J14_PRE_CHARNIERE: TimelineSnapshot = {
  id: 'phase0_j14_pre_charniere',
  label: 'P0 J14 avant validation',
  description: 'Valider J14 → charnière J14 riche (badge + vidéo + galerie).',
  phase: 'phase_0',
  currentDay: 14,
  alreadyValidatedToday: false,
  hasInitialEvalCurrent: false,
  hasFinalEvalCurrent: false,
  streakValue: 13,
  jokerConsumedThisWeek: false,
  narrativeFlagsSeen: [
    'welcome_video',
    'j3_charniere',
    'j7_charniere',
    'j11_charniere',
  ],
  s8FinalCompleted: false,
};

export const PRESET_PHASE0_J16_S02: TimelineSnapshot = {
  id: 'phase0_j16_s02',
  label: 'S0.2 J16',
  description: 'Roadmap + transition Phase 1.',
  phase: 'phase_0',
  currentDay: 16,
  alreadyValidatedToday: false,
  hasInitialEvalCurrent: false,
  hasFinalEvalCurrent: false,
  streakValue: 15,
  jokerConsumedThisWeek: false,
  narrativeFlagsSeen: [
    'welcome_video',
    'j3_charniere',
    'j7_charniere',
    'j11_charniere',
    'j14_charniere',
    's0_1_screen',
  ],
  s8FinalCompleted: false,
};

export const PRESET_PHASE0_J15_S01: TimelineSnapshot = {
  id: 'phase0_j15_s01',
  label: 'S0.1 J15',
  description: 'Toile révélée + palier 15j coordination D30.',
  phase: 'phase_0',
  currentDay: 15,
  alreadyValidatedToday: false,
  hasInitialEvalCurrent: false,
  hasFinalEvalCurrent: false,
  streakValue: 14,
  jokerConsumedThisWeek: false,
  narrativeFlagsSeen: [
    'welcome_video',
    'j3_charniere',
    'j7_charniere',
    'j11_charniere',
    'j14_charniere',
  ],
  s8FinalCompleted: false,
};

export const PRESET_S1_J1_FRESH: TimelineSnapshot = {
  id: 's1_j1_fresh',
  label: 'S1 J1 fresh',
  description: 'PillarOverview → eval init S1 → hub.',
  phase: 'phase_1',
  currentDay: 17,
  pillarId: 'S1',
  dayInPillarWeek: 1,
  alreadyValidatedToday: false,
  hasInitialEvalCurrent: false,
  hasFinalEvalCurrent: false,
  streakValue: 16,
  jokerConsumedThisWeek: false,
  narrativeFlagsSeen: [
    'welcome_video',
    'j3_charniere',
    'j7_charniere',
    'j11_charniere',
    'j14_charniere',
    's0_1_screen',
    's0_2_screen',
  ],
  s8FinalCompleted: false,
};

export const PRESET_S1_J3_MID: TimelineSnapshot = {
  id: 's1_j3_mid',
  label: 'S1 J3 mid (1 session today)',
  description: 'Hub Phase 1 mid-semaine, sessions matin validée.',
  phase: 'phase_1',
  currentDay: 19,
  pillarId: 'S1',
  dayInPillarWeek: 3,
  alreadyValidatedToday: true,
  sessionsValidatedToday: [1],
  hasInitialEvalCurrent: true,
  hasFinalEvalCurrent: false,
  streakValue: 19,
  jokerConsumedThisWeek: false,
  narrativeFlagsSeen: [
    'welcome_video',
    'j3_charniere',
    'j7_charniere',
    'j11_charniere',
    'j14_charniere',
    's0_1_screen',
    's0_2_screen',
  ],
  s8FinalCompleted: false,
};

export const PRESET_S1_J7_PRE_FINAL: TimelineSnapshot = {
  id: 's1_j7_pre_final',
  label: 'S1 J7 avant éval finale',
  description: 'Test carte CTA éval finale + forced redirect au lendemain.',
  phase: 'phase_1',
  currentDay: 23,
  pillarId: 'S1',
  dayInPillarWeek: 7,
  alreadyValidatedToday: true,
  sessionsValidatedToday: [1],
  hasInitialEvalCurrent: true,
  hasFinalEvalCurrent: false,
  streakValue: 23,
  jokerConsumedThisWeek: false,
  narrativeFlagsSeen: [
    'welcome_video',
    'j3_charniere',
    'j7_charniere',
    'j11_charniere',
    'j14_charniere',
    's0_1_screen',
    's0_2_screen',
  ],
  s8FinalCompleted: false,
};

export const PRESET_S2_J1_FRESH: TimelineSnapshot = {
  id: 's2_j1_fresh',
  label: 'S2 J1 (S1 prefilled)',
  description: 'Test transition S1→S2. S1 evals + sessions prefilled.',
  phase: 'phase_1',
  currentDay: 24,
  pillarId: 'S2',
  dayInPillarWeek: 1,
  alreadyValidatedToday: false,
  hasInitialEvalCurrent: false,
  hasFinalEvalCurrent: false,
  streakValue: 23,
  jokerConsumedThisWeek: false,
  narrativeFlagsSeen: [
    'welcome_video',
    'j3_charniere',
    'j7_charniere',
    'j11_charniere',
    'j14_charniere',
    's0_1_screen',
    's0_2_screen',
  ],
  s8FinalCompleted: false,
};

export const PRESET_S4_J1_FRESH: TimelineSnapshot = {
  id: 's4_j1_fresh',
  label: 'S4 J1 (S1-S3 prefilled)',
  description: 'Test toile 3 branches peuplées + démarrage pilier 4.',
  phase: 'phase_1',
  currentDay: 38,
  pillarId: 'S4',
  dayInPillarWeek: 1,
  alreadyValidatedToday: false,
  hasInitialEvalCurrent: false,
  hasFinalEvalCurrent: false,
  streakValue: 37,
  jokerConsumedThisWeek: false,
  narrativeFlagsSeen: [
    'welcome_video',
    'j3_charniere',
    'j7_charniere',
    'j11_charniere',
    'j14_charniere',
    's0_1_screen',
    's0_2_screen',
  ],
  s8FinalCompleted: false,
};

export const PRESET_POST_S8_CONSOLIDATION: TimelineSnapshot = {
  id: 'post_s8_consolidation',
  label: 'Post-S8 consolidation libre',
  description: 'Test IA-23 mode libre + proposition mentorat IA-60.',
  phase: 'post_s8',
  currentDay: 73,
  pillarId: 'S8',
  dayInPillarWeek: 7,
  alreadyValidatedToday: false,
  hasInitialEvalCurrent: true,
  hasFinalEvalCurrent: true,
  streakValue: 72,
  jokerConsumedThisWeek: false,
  narrativeFlagsSeen: [
    'welcome_video',
    'j3_charniere',
    'j7_charniere',
    'j11_charniere',
    'j14_charniere',
    's0_1_screen',
    's0_2_screen',
    's8_exit_screen',
  ],
  s8FinalCompleted: true,
};

export const PRESET_PHASE1_SUBSCRIPTION_EXPIRED: TimelineSnapshot = {
  id: 'phase1_subscription_expired',
  label: 'S2 J1 abonnement expiré',
  description: 'Test paywall gate Phase 1. Setup manuel Supabase requis.',
  phase: 'phase_1',
  currentDay: 24,
  pillarId: 'S2',
  dayInPillarWeek: 1,
  alreadyValidatedToday: false,
  hasInitialEvalCurrent: false,
  hasFinalEvalCurrent: false,
  streakValue: 23,
  jokerConsumedThisWeek: false,
  narrativeFlagsSeen: [
    'welcome_video',
    'j3_charniere',
    'j7_charniere',
    'j11_charniere',
    'j14_charniere',
    's0_1_screen',
    's0_2_screen',
  ],
  subscriptionStatus: 'cancelled',
  s8FinalCompleted: false,
};

export const PRESET_JOKER_BURN_PENDING: TimelineSnapshot = {
  id: 'joker_burn_pending',
  label: 'P0 J5 + skip J4 (joker dispo)',
  description: 'Test joker burn auto à l\'ouverture.',
  phase: 'phase_0',
  currentDay: 5,
  alreadyValidatedToday: false,
  hasInitialEvalCurrent: false,
  hasFinalEvalCurrent: false,
  streakValue: 3,
  jokerConsumedThisWeek: false,
  narrativeFlagsSeen: ['welcome_video', 'j3_charniere'],
  s8FinalCompleted: false,
};

export const PRESET_S8_J7_PRE_FINAL: TimelineSnapshot = {
  id: 's8_j7_pre_final',
  label: 'S8 J7 avant éval finale',
  description: 'Test forced eval finale S8 + sortie post-S8 (IA-22/IA-23).',
  phase: 'phase_1',
  currentDay: 72,
  pillarId: 'S8',
  dayInPillarWeek: 7,
  alreadyValidatedToday: true,
  sessionsValidatedToday: [1],
  hasInitialEvalCurrent: true,
  hasFinalEvalCurrent: false,
  streakValue: 72,
  jokerConsumedThisWeek: false,
  narrativeFlagsSeen: [
    'welcome_video',
    'j3_charniere',
    'j7_charniere',
    'j11_charniere',
    'j14_charniere',
    's0_1_screen',
    's0_2_screen',
  ],
  s8FinalCompleted: false,
};

/** Liste exposée pour UI Profil (ordre chronologique). */
export const TIMELINE_PRESETS: TimelineSnapshot[] = [
  PRESET_PHASE0_J1_FRESH,
  PRESET_PHASE0_J3_PRE_CHARNIERE,
  PRESET_PHASE0_J7_PRE_PALIER,
  PRESET_PHASE0_J14_PRE_CHARNIERE,
  PRESET_PHASE0_J15_S01,
  PRESET_PHASE0_J16_S02,
  PRESET_JOKER_BURN_PENDING,
  PRESET_S1_J1_FRESH,
  PRESET_S1_J3_MID,
  PRESET_S1_J7_PRE_FINAL,
  PRESET_S2_J1_FRESH,
  PRESET_S4_J1_FRESH,
  PRESET_S8_J7_PRE_FINAL,
  PRESET_POST_S8_CONSOLIDATION,
  PRESET_PHASE1_SUBSCRIPTION_EXPIRED,
];

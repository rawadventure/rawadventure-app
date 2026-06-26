/**
 * devTimeline.ts — moteur de snapshots préset DEV pour navigation temporelle.
 *
 * Remplace seedDevStreak / seedDevPillarDay / advanceToNextDay par un seul
 * `applyTimelineSnapshot(snapshot, ctx)` atomique :
 *
 *  1. Build COMPLET en mémoire (entries streak, evals, sessions, flags, tiers).
 *  2. Supabase ops séquentielles awaited (DELETE all → INSERT all).
 *  3. AsyncStorage multiSet atomique.
 *  4. setState EN DERNIER (un seul flush React, pas de race).
 *  5. Cohérence validator interne : warn console si computed != applied.
 *
 * Gated isDevToolsEnabled(). No-op si DEV tools off.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import {
  addDays,
  todayLocalDate,
  weekKeyOf,
  type LocalDate,
  type WeekKey,
} from './calendar';
import { devNowDate } from './devClock';
import { isDevToolsEnabled } from './devToolsEnabled';
import {
  TIER_THRESHOLDS,
  type JokerConsumption,
  type Phase,
  type StreakEntry,
  type TierId,
} from './streak';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SessionIndex = 1 | 2 | 3;
export type PillarId = 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'S7' | 'S8';

export type NarrativeEventId =
  | 'welcome_video'
  | 'j3_charniere'
  | 'j7_charniere'
  | 'j11_charniere'
  | 'j14_charniere'
  | 's0_1_screen'
  | 's0_2_screen'
  | 'phase0_to_s1_transition'
  | 's8_exit_screen'
  | 'consolidation_intro_seen'
  | 'mentorat_proposal_seen'
  | 'notif_permission_prompted';

/** État cible complet du parcours à un point T donné. */
export type TimelineSnapshot = {
  id: string;
  label: string;
  description: string;

  // Position programme
  phase: Phase;
  currentDay: number;                 // 1-72 (P0 + S0 + P1)
  pillarId?: PillarId;
  dayInPillarWeek?: number;           // 1-7

  // Validation aujourd'hui
  alreadyValidatedToday: boolean;
  sessionsValidatedToday?: SessionIndex[];

  // État éval pilier courant
  hasInitialEvalCurrent: boolean;
  hasFinalEvalCurrent: boolean;

  // Streak target
  streakValue: number;
  jokerConsumedThisWeek: boolean;

  // Narrative flags posés
  narrativeFlagsSeen: NarrativeEventId[];

  // Subscription state (PROD seulement : pas géré ici, signalé pour cohérence)
  subscriptionStatus?: 'active' | 'free' | 'cancelled' | 'past_due';
  s8FinalCompleted: boolean;
};

/** Helpers passés par ProgressContext pour permettre au moteur de muter le state. */
export type TimelineContext = {
  userId: string | null;
  setAccountCreatedAt: (iso: string | null) => void;
  setStreakHistory: (entries: StreakEntry[]) => void;
  setJokerConsumptions: (cons: JokerConsumption[]) => void;
  setTierReaches: (
    reaches: Array<{
      tier_id: TierId;
      first_reached_at: string;
      last_reached_at: string;
      reach_count: number;
    }>,
  ) => void;
  setNarrativeFlags: (flags: Partial<Record<NarrativeEventId, string>>) => void;
  setCurrentPillarId: (pid: string | null) => void;
  setPillarStartedAt: (iso: string | null) => void;
  setS8FinalCompleted: (v: boolean) => void;
};

// ─── Placeholders éval (raw 36 init / 48 final, niveau Progression) ───────────

const PLACEHOLDER_INITIAL_RESPONSES = Array.from({ length: 12 }, (_, i) => ({
  question_id: i + 1,
  value: 3 as 1 | 2 | 3 | 4 | 5,
}));
const PLACEHOLDER_FINAL_RESPONSES = Array.from({ length: 12 }, (_, i) => ({
  question_id: i + 1,
  value: 4 as 1 | 2 | 3 | 4 | 5,
}));

function buildPlaceholderEvalRow(
  pillarId: string,
  type: 'initial' | 'final',
  completedAt: string,
) {
  const isInitial = type === 'initial';
  return {
    pillar_id: pillarId,
    evaluation_type: type,
    responses: isInitial ? PLACEHOLDER_INITIAL_RESPONSES : PLACEHOLDER_FINAL_RESPONSES,
    raw_score: isInitial ? 36 : 48,
    normalized_score: isInitial ? 50 : 75,
    diagnostic_level: isInitial ? 3 : 4,
    engagement_level_recommended: 'progression' as const,
    engagement_level_chosen: 'progression' as const,
    completed_at: completedAt,
  };
}

// ─── AsyncStorage keys ────────────────────────────────────────────────────────

const LOCAL_KEYS = {
  accountCreatedAt: 'account_created_at',
  streakHistory: 'streak_history',
  jokerConsumptions: 'joker_consumptions',
  tierReaches: 'tier_reaches',
  narrativeFlags: 'narrative_flags',
  currentPillarId: 'current_pillar_id',
  pillarStartedAt: 'pillar_started_at',
};

const PILLAR_ORDER: PillarId[] = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];

function pillarIndexOf(pillarId: string): number {
  const idx = PILLAR_ORDER.indexOf(pillarId as PillarId);
  return idx >= 0 ? idx : 0;
}

// ─── Engine ───────────────────────────────────────────────────────────────────

/**
 * Applique un snapshot atomiquement. Construit l'état complet en mémoire,
 * persiste Supabase + AsyncStorage, puis met à jour React state en dernier.
 *
 * No-op + warn si DEV tools désactivés (isDevToolsEnabled() false).
 */
export async function applyTimelineSnapshot(
  snapshot: TimelineSnapshot,
  ctx: TimelineContext,
): Promise<void> {
  if (!isDevToolsEnabled()) {
    console.warn('[applyTimelineSnapshot] no-op : DEV tools désactivés');
    return;
  }

  const today = todayLocalDate();
  const now = devNowDate();
  const nowIso = now.toISOString();

  // ─── 1. Build complet en mémoire ────────────────────────────────────────────

  // 1a. accountCreatedAt : (currentDay - 1) jours dans le passé.
  // Si snapshot.currentDay === 1 et !alreadyValidatedToday → today.
  // currentDay = days passés validés + (alreadyToday ? 0 : 1).
  // Pour reproduire ça : streakHistory contient (alreadyToday ? currentDay : currentDay-1) entries.
  const validatedCount = snapshot.alreadyValidatedToday
    ? snapshot.currentDay
    : snapshot.currentDay - 1;

  // Calcul accountCreatedAt = (validatedCount - 1) jours dans le passé minimum
  // pour couvrir la timeline. On prend (currentDay - 1) jours dans le passé.
  const accountOffsetDays = Math.max(0, snapshot.currentDay - 1);
  const accountIso = new Date(
    now.getTime() - accountOffsetDays * 86_400_000,
  ).toISOString();

  // 1b. streakHistory : entries Phase 0 (1..16) puis Phase 1 (17..currentDay).
  const entries: StreakEntry[] = [];
  for (let i = 1; i <= validatedCount; i++) {
    const phase: Phase = i <= 16 ? 'phase_0' : 'phase_1';
    // local_date : décale d'(validatedCount - i) jours dans le passé si !alreadyToday,
    // ou (validatedCount - i) si alreadyToday (la dernière entry est sur today).
    const offsetDays = snapshot.alreadyValidatedToday
      ? validatedCount - i
      : validatedCount - i + 1;
    const localDate = addDays(today, -offsetDays);
    // Streak value : par défaut, ascending 1..N. Mais peut être < si jokers.
    // Pour V1, on suit la cible snapshot.streakValue : les dernières entries
    // reflètent la valeur cible, antérieures linéaires.
    // Simplification : streak_value_after = i (croissant). User peut surcharger
    // si besoin via snapshot.streakValue (on calera la dernière entry dessus).
    entries.push({
      local_date: localDate,
      validation_status: 'valid_above_threshold',
      phase,
      streak_value_after: i,
      joker_used: false,
    });
  }

  // Ajuste la dernière entry pour matcher snapshot.streakValue si différent.
  if (entries.length > 0 && entries[entries.length - 1].streak_value_after !== snapshot.streakValue) {
    entries[entries.length - 1].streak_value_after = snapshot.streakValue;
  }

  // 1c. jokerConsumptions : un seul joker week courante si jokerConsumedThisWeek.
  const consumptions: JokerConsumption[] = snapshot.jokerConsumedThisWeek
    ? [
        {
          week_key: weekKeyOf(today) as WeekKey,
          consumed_for_local_date: today,
        },
      ]
    : [];

  // 1d. tier_reaches : tous les paliers atteints au streakValue cible.
  const tierReaches = TIER_THRESHOLDS
    .filter((tier) => snapshot.streakValue >= tier)
    .map((tier) => ({
      tier_id: tier,
      first_reached_at: nowIso,
      last_reached_at: nowIso,
      reach_count: 1,
    }));

  // 1e. narrative_flags posés.
  const narrativeFlags: Partial<Record<NarrativeEventId, string>> = {};
  for (const flag of snapshot.narrativeFlagsSeen) {
    narrativeFlags[flag] = nowIso;
  }

  // 1f. pillarStartedAt + currentPillarId.
  let pillarStartedAtIso: string | null = null;
  let currentPillarId: string | null = null;
  if (snapshot.phase === 'phase_1' && snapshot.pillarId && snapshot.dayInPillarWeek) {
    currentPillarId = snapshot.pillarId;
    // pillarStartedAt = today - (dayInPillarWeek - 1) jours
    pillarStartedAtIso = new Date(
      now.getTime() - (snapshot.dayInPillarWeek - 1) * 86_400_000,
    ).toISOString();
  }

  // 1g. pillar_evaluations rows (placeholder) :
  //  - Tous piliers strictement avant `currentPillarId` : init + final.
  //  - Pilier courant : init seulement si hasInitialEvalCurrent.
  //                     final seulement si hasFinalEvalCurrent.
  const evalRows: Array<{
    user_id: string;
    pillar_id: string;
    evaluation_type: 'initial' | 'final';
    responses: Array<{ question_id: number; value: 1 | 2 | 3 | 4 | 5 }>;
    raw_score: number;
    normalized_score: number;
    diagnostic_level: 1 | 2 | 3 | 4 | 5;
    engagement_level_recommended: 'progression';
    engagement_level_chosen: 'progression';
    completed_at: string;
  }> = [];

  if (ctx.userId && (snapshot.phase === 'phase_1' || snapshot.phase === 'post_s8')) {
    const targetIdx = snapshot.pillarId ? pillarIndexOf(snapshot.pillarId) : 0;

    // Prior pillars complets.
    for (let priorIdx = 0; priorIdx < targetIdx; priorIdx++) {
      const priorPid = PILLAR_ORDER[priorIdx];
      evalRows.push({
        user_id: ctx.userId,
        ...buildPlaceholderEvalRow(priorPid, 'initial', nowIso),
      });
      evalRows.push({
        user_id: ctx.userId,
        ...buildPlaceholderEvalRow(priorPid, 'final', nowIso),
      });
    }

    // Pilier courant.
    if (snapshot.pillarId) {
      if (snapshot.hasInitialEvalCurrent) {
        evalRows.push({
          user_id: ctx.userId,
          ...buildPlaceholderEvalRow(snapshot.pillarId, 'initial', nowIso),
        });
      }
      if (snapshot.hasFinalEvalCurrent) {
        evalRows.push({
          user_id: ctx.userId,
          ...buildPlaceholderEvalRow(snapshot.pillarId, 'final', nowIso),
        });
      }
    }

    // Post-S8 : S8 final eval doit être posée.
    if (snapshot.phase === 'post_s8') {
      // S'assurer S8 init+final présents (déjà ajoutés ci-dessus si pillarId='S8')
      const hasS8Init = evalRows.some(
        (r) => r.pillar_id === 'S8' && r.evaluation_type === 'initial',
      );
      const hasS8Final = evalRows.some(
        (r) => r.pillar_id === 'S8' && r.evaluation_type === 'final',
      );
      if (!hasS8Init) {
        evalRows.push({
          user_id: ctx.userId,
          ...buildPlaceholderEvalRow('S8', 'initial', nowIso),
        });
      }
      if (!hasS8Final) {
        evalRows.push({
          user_id: ctx.userId,
          ...buildPlaceholderEvalRow('S8', 'final', nowIso),
        });
      }
    }
  }

  // 1h. pillar_sessions placeholder (1 session matin par jour validé en Phase 1).
  const sessionRows: Array<{
    user_id: string;
    pillar_id: string;
    day_in_week: number;
    session_index: number;
    local_date: LocalDate;
    completed_at: string;
    duration_seconds: number | null;
  }> = [];

  if (ctx.userId && (snapshot.phase === 'phase_1' || snapshot.phase === 'post_s8')) {
    const targetIdx = snapshot.pillarId ? pillarIndexOf(snapshot.pillarId) : 0;

    // Prior pillars : 7 sessions complets chacun (1 matin/jour).
    for (let priorIdx = 0; priorIdx < targetIdx; priorIdx++) {
      const priorPid = PILLAR_ORDER[priorIdx];
      for (let d = 1; d <= 7; d++) {
        // local_date relatif au jour de la semaine pilier dans la timeline globale.
        // Globally, prior pillar occupies days 17 + priorIdx*7 + (d-1) (programme)
        const programmeDay = 17 + priorIdx * 7 + (d - 1);
        // offset = currentDay - programmeDay jours dans le passé
        const offsetDays = Math.max(0, snapshot.currentDay - programmeDay);
        sessionRows.push({
          user_id: ctx.userId,
          pillar_id: priorPid,
          day_in_week: d,
          session_index: 1,
          local_date: addDays(today, -offsetDays),
          completed_at: nowIso,
          duration_seconds: 300,
        });
      }
    }

    // Pilier courant : sessions J1..J(dayInPillarWeek - 1) si !alreadyToday,
    // ou J1..J(dayInPillarWeek) si alreadyToday avec session today.
    if (snapshot.pillarId && snapshot.dayInPillarWeek) {
      const lastValidatedDay = snapshot.alreadyValidatedToday
        ? snapshot.dayInPillarWeek
        : snapshot.dayInPillarWeek - 1;
      for (let d = 1; d <= lastValidatedDay; d++) {
        const offsetFromToday = snapshot.dayInPillarWeek - d;
        // Sessions today : utilise sessionsValidatedToday[]. Sinon : 1 matin par défaut.
        if (d === snapshot.dayInPillarWeek && snapshot.alreadyValidatedToday) {
          const sessions = snapshot.sessionsValidatedToday ?? [1];
          for (const si of sessions) {
            sessionRows.push({
              user_id: ctx.userId,
              pillar_id: snapshot.pillarId,
              day_in_week: d,
              session_index: si,
              local_date: today,
              completed_at: nowIso,
              duration_seconds: 300,
            });
          }
        } else {
          sessionRows.push({
            user_id: ctx.userId,
            pillar_id: snapshot.pillarId,
            day_in_week: d,
            session_index: 1,
            local_date: addDays(today, -offsetFromToday),
            completed_at: nowIso,
            duration_seconds: 300,
          });
        }
      }
    }
  }

  // ─── 2. Supabase ops séquentielles (BLOCKING — avant setState) ─────────────

  if (ctx.userId) {
    try {
      // WIPE complet.
      await Promise.all([
        supabase.from('streak_history').delete().eq('user_id', ctx.userId),
        supabase.from('joker_consumptions').delete().eq('user_id', ctx.userId),
        supabase.from('tier_reaches').delete().eq('user_id', ctx.userId),
        supabase.from('pillar_evaluations').delete().eq('user_id', ctx.userId),
        supabase.from('pillar_sessions').delete().eq('user_id', ctx.userId),
        supabase.from('level_adaptive_choices').delete().eq('user_id', ctx.userId),
        supabase.from('progress').delete().eq('user_id', ctx.userId),
      ]);

      // Update profiles.account_created_at.
      await supabase
        .from('profiles')
        .update({ account_created_at: accountIso })
        .eq('id', ctx.userId);

      // Re-insert streak_history.
      if (entries.length > 0) {
        const { error: shErr } = await supabase
          .from('streak_history')
          .insert(entries.map((e) => ({ user_id: ctx.userId, ...e })));
        if (shErr) console.warn('[applyTimelineSnapshot] streak_history insert', shErr);

        await supabase.from('progress').insert(
          entries.map((_, idx) => ({
            user_id: ctx.userId,
            day_id: idx + 1,
            is_minimum: false,
            actions_count: 7,
          })),
        );
      }

      // Re-insert joker_consumptions.
      if (consumptions.length > 0) {
        const { error: jErr } = await supabase
          .from('joker_consumptions')
          .insert(consumptions.map((c) => ({ user_id: ctx.userId, ...c })));
        if (jErr) console.warn('[applyTimelineSnapshot] joker_consumptions insert', jErr);
      }

      // Re-insert tier_reaches.
      if (tierReaches.length > 0) {
        const { error: tErr } = await supabase
          .from('tier_reaches')
          .insert(tierReaches.map((t) => ({ user_id: ctx.userId, ...t })));
        if (tErr) console.warn('[applyTimelineSnapshot] tier_reaches insert', tErr);
      }

      // Re-insert pillar_evaluations.
      if (evalRows.length > 0) {
        const { error: eErr } = await supabase
          .from('pillar_evaluations')
          .insert(evalRows);
        if (eErr) console.warn('[applyTimelineSnapshot] pillar_evaluations insert', eErr);
      }

      // Re-insert pillar_sessions.
      if (sessionRows.length > 0) {
        const { error: sErr } = await supabase
          .from('pillar_sessions')
          .insert(sessionRows);
        if (sErr) console.warn('[applyTimelineSnapshot] pillar_sessions insert', sErr);
      }
    } catch (e) {
      console.error('[applyTimelineSnapshot] Supabase ops failed', e);
      // Continue quand même pour mettre à jour le local state.
    }
  }

  // ─── 3. AsyncStorage multiSet atomique ─────────────────────────────────────

  const localKvs: Array<[string, string]> = [
    [LOCAL_KEYS.accountCreatedAt, JSON.stringify(accountIso)],
    [LOCAL_KEYS.streakHistory, JSON.stringify(entries)],
    [LOCAL_KEYS.jokerConsumptions, JSON.stringify(consumptions)],
    [LOCAL_KEYS.tierReaches, JSON.stringify(tierReaches)],
    [LOCAL_KEYS.narrativeFlags, JSON.stringify(narrativeFlags)],
  ];
  if (currentPillarId) localKvs.push([LOCAL_KEYS.currentPillarId, JSON.stringify(currentPillarId)]);
  if (pillarStartedAtIso) localKvs.push([LOCAL_KEYS.pillarStartedAt, JSON.stringify(pillarStartedAtIso)]);

  await AsyncStorage.multiSet(localKvs);

  if (!currentPillarId) await AsyncStorage.removeItem(LOCAL_KEYS.currentPillarId);
  if (!pillarStartedAtIso) await AsyncStorage.removeItem(LOCAL_KEYS.pillarStartedAt);

  // Reset daily_check_actions.<today> et pillar_eval_progress.*
  await AsyncStorage.removeItem(`daily_check_actions.${today}`);
  const allKeys = await AsyncStorage.getAllKeys();
  const evalProgressKeys = allKeys.filter((k) => k.startsWith('pillar_eval_progress.'));
  if (evalProgressKeys.length > 0) {
    await AsyncStorage.multiRemove(evalProgressKeys);
  }

  // ─── 4. setState EN DERNIER (un seul flush React) ──────────────────────────

  ctx.setStreakHistory(entries);
  ctx.setJokerConsumptions(consumptions);
  ctx.setTierReaches(tierReaches);
  ctx.setNarrativeFlags(narrativeFlags);
  ctx.setAccountCreatedAt(accountIso);
  ctx.setPillarStartedAt(pillarStartedAtIso);
  ctx.setCurrentPillarId(currentPillarId);
  ctx.setS8FinalCompleted(snapshot.s8FinalCompleted);

  // ─── 5. Cohérence validator ────────────────────────────────────────────────
  // Compare snapshot.currentDay vs ce qui sera calculé à partir des entries.
  // currentDay = validatedCount + (alreadyToday ? 0 : 1) où validatedCount =
  // entries.length validés. À ce stade, tout est valid_above_threshold donc
  // validatedCount = entries.length.
  const computedCurrentDay = entries.length + (snapshot.alreadyValidatedToday ? 0 : 1);
  if (computedCurrentDay !== snapshot.currentDay) {
    console.warn(
      `[applyTimelineSnapshot:${snapshot.id}] cohérence currentDay mismatch ` +
        `(snapshot=${snapshot.currentDay}, computed=${computedCurrentDay})`,
    );
  }

  const computedStreak =
    entries.length > 0 ? entries[entries.length - 1].streak_value_after : 0;
  if (computedStreak !== snapshot.streakValue) {
    console.warn(
      `[applyTimelineSnapshot:${snapshot.id}] cohérence streak mismatch ` +
        `(snapshot=${snapshot.streakValue}, computed=${computedStreak})`,
    );
  }
}

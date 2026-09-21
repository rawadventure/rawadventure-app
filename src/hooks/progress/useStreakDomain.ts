/**
 * useStreakDomain — validation quotidienne, cohérence calendaire, palier
 * différé D30 (F-05.5, audit Lou — extrait de ProgressContext, même
 * comportement). Toutes les mutations passent par la file sérialisée et
 * lisent l'état courant depuis dataRef (F-05.4).
 */

import { useCallback, type MutableRefObject } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';
import { must } from '../../lib/supabaseMust';
import { showNotice } from '../../lib/notice';
import type { ProgressStore } from '../../lib/progressStore';
import {
  withCoherenceResolution,
  withJokerConsumption,
  withStreakEntry,
  withTierReach,
  type ProgressData,
} from '../../lib/progressData';
import {
  applyStreakIncrement,
  currentStreakFromHistory,
  determineValidationStatus,
  isJokerAvailable,
  resolveMissedDays,
  THRESHOLD_PHASE_0_TOTAL,
  tierJustReached,
  validatedDaysCount,
  type JokerConsumption,
  type Phase,
  type StreakEntry,
} from '../../lib/streak';
import { currentWeekKey, todayLocalDate } from '../../lib/calendar';
import {
  LOCAL_KEYS,
  type PendingTierReach,
  type TierReach,
  type ValidateDayArgs,
  type ValidateDayResult,
} from './types';

type StreakDomainDeps = {
  user: { id: string } | null;
  store: ProgressStore;
  dataRef: MutableRefObject<ProgressData>;
  commitData: (next: ProgressData) => void;
  enqueueMutation: <T>(op: () => Promise<T>) => Promise<T>;
  currentPhase: Phase;
  setPendingTierReachState: (v: PendingTierReach | null) => void;
};

export function useStreakDomain({
  user,
  store,
  dataRef,
  commitData,
  enqueueMutation,
  currentPhase,
  setPendingTierReachState,
}: StreakDomainDeps) {
  // F-04 : write-through via le store (profiles.pending_tier_reach en
  // connecté, AsyncStorage en anonyme) — un palier différé D30 ne doit pas
  // se perdre avec le navigateur.
  const setPendingTier = useCallback(
    async (pending: PendingTierReach) => {
      setPendingTierReachState(pending);
      await store.savePendingTier(pending);
    },
    [store],
  );

  const clearPendingTier = useCallback(async () => {
    setPendingTierReachState(null);
    await store.savePendingTier(null);
  }, [store]);

  // Sprint B email confirm — pendingMigration getters/setters.
  // `email` alimente EmailPendingScreen (affichage + verifyOtp + resend) —
  // il doit être dans le STATE dès le signup, pas seulement en AsyncStorage,
  // sinon l'écran est inutilisable jusqu'au prochain reload du bundle.

  // ── Cohérence calendaire (audit B1, Feature Spec §2.5 Cas C) ───────────────
  // Résout les jours manqués depuis la dernière entrée streak_history : joker
  // auto-consommé (streak conservé) ou cassure (streak 0). Tourne à la fin de
  // chaque chargement et à chaque changement de jour détecté (clockEpoch —
  // retour au premier plan M1, DEV clock). Idempotente : rien à résoudre →
  // aucune écriture.
  const runCalendarCoherence = useCallback(
    async (s8Done: boolean) => {
      // F-05.4 : sérialisé par la file de mutations (plus de garde
      // coherenceRunningRef) et lit l'état COURANT depuis dataRef au moment
      // où la mutation démarre — jamais des arguments figés à la
      // planification de l'effet.
      await enqueueMutation(async () => {
        const { streakHistory: history, jokerConsumptions: consumptions } =
          dataRef.current;
        // Phase des jours manqués — stable pendant une absence : currentDay
        // est basé sur les validations (D38), il n'avance pas sans l'app.
        const day =
          validatedDaysCount(history, 'phase_0') +
          validatedDaysCount(history, 'phase_1') +
          1;
        const phase: Phase = s8Done
          ? 'post_s8'
          : day <= 16
            ? 'phase_0'
            : 'phase_1';
        const resolved = resolveMissedDays({
          history,
          consumptions,
          today: todayLocalDate(),
          phase,
        });
        if (resolved.entries.length === 0) return;

        // Persistance batch — Supabase en connecté, AsyncStorage en anonyme.
        const nextData = withCoherenceResolution(
          dataRef.current,
          resolved.entries,
          resolved.consumptions,
        );
        if (user) {
          const rows = resolved.entries.map((e) => ({ user_id: user.id, ...e }));
          await must(
            supabase
              .from('streak_history')
              .upsert(rows, { onConflict: 'user_id,local_date' }),
          );
          if (resolved.consumptions.length > 0) {
            const cRows = resolved.consumptions.map((c) => ({
              user_id: user.id,
              ...c,
            }));
            await must(
              supabase
                .from('joker_consumptions')
                .upsert(cRows, { onConflict: 'user_id,week_key' }),
            );
          }
        } else {
          await AsyncStorage.setItem(
            LOCAL_KEYS.streakHistory,
            JSON.stringify(nextData.streakHistory),
          );
          if (resolved.consumptions.length > 0) {
            await AsyncStorage.setItem(
              LOCAL_KEYS.jokerConsumptions,
              JSON.stringify(nextData.jokerConsumptions),
            );
          }
        }
        commitData(nextData);

        // Message sobre, non-culpabilisant (D26). Slots définitifs
        // (copy.global.message-joker-consomme / streak-reprise) à venir
        // avec le Brief contenu Mimi & Jacky.
        const broke = resolved.entries.some(
          (e) => e.validation_status === 'broken_streak',
        );
        // Reprise de position (D38) : les jours manqués ne comptent pas en
        // progression, donc `day` (calculé avant résolution) est bien le jour
        // où l'utilisateur reprend. En Phase 1 l'UI parle en jour de pilier,
        // pas en jour global — formulation neutre hors Phase 0.
        const repriseText =
          phase === 'phase_0'
            ? `Tu reprends au jour ${day}, là où tu t'étais arrêté.`
            : 'Tu reprends là où tu t\'étais arrêté.';
        if (broke) {
          showNotice(
            'Streak remis à zéro',
            `Des journées sont passées sans validation. Ton streak repart de zéro — la prochaine validation le relance. ${repriseText} [copy à valider]`,
          );
        } else if (resolved.consumptions.length > 0) {
          showNotice(
            'Joker utilisé',
            `Ton joker de la semaine a couvert une journée manquée. Streak conservé. ${repriseText} [copy à valider]`,
          );
        }
      }).catch((e) => {
        // Non bloquant — retentera au prochain chargement / changement de jour.
        console.warn('[ProgressContext] cohérence calendaire échouée', e);
      });
    },
    [user, enqueueMutation, commitData],
  );


  const validateDay = useCallback(
    async (args: ValidateDayArgs): Promise<ValidateDayResult> =>
      // F-05.4 : mutation sérialisée. La base de streak et la dispo joker
      // sont lues depuis dataRef AU DÉMARRAGE de la mutation — jamais depuis
      // les closures/memos du render (bug F4 : une cassure de cohérence en
      // vol serait écrasée). Persistance d'abord (store, F-08), commit du
      // state seulement après succès, via les transitions pures de
      // src/lib/progressData.
      enqueueMutation(async () => {
        const localDate = args.localDate ?? todayLocalDate();
        const phase = args.phase ?? currentPhase;
        const userValidatedManually = args.userValidatedManually ?? true;

        const current = dataRef.current;
        const decision = determineValidationStatus({
          phase,
          actionsCount: args.actionsCount,
          userValidatedManually,
          jokerAvailable: isJokerAvailable(
            current.jokerConsumptions,
            todayLocalDate(),
          ),
        });
        const base = currentStreakFromHistory(current.streakHistory);
        const newStreak = applyStreakIncrement(base, decision.streakIncrement);
        const tierReached = tierJustReached(base, newStreak);

        // 1) Écrit l'entrée streak_history
        const entry: StreakEntry = {
          local_date: localDate,
          validation_status: decision.status,
          phase,
          streak_value_after: newStreak,
          joker_used: decision.jokerUsed,
        };
        let nextData = withStreakEntry(current, entry);
        await store.saveStreakEntry(entry, nextData.streakHistory);

        // 2) Consomme le joker si nécessaire
        if (decision.jokerUsed) {
          const consumption: JokerConsumption = {
            week_key: currentWeekKey(),
            consumed_for_local_date: localDate,
          };
          nextData = withJokerConsumption(nextData, consumption);
          await store.saveJokerConsumption(consumption, nextData.jokerConsumptions);
        }

        // 3) Écrit la ligne `progress` en Phase 0 si on a un day_id explicite
        if (phase === 'phase_0' && args.day != null && user) {
          const isMinimum = decision.status !== 'valid_above_threshold';
          await must(
            supabase.from('progress').upsert(
              {
                user_id: user.id,
                day_id: args.day,
                is_minimum: isMinimum,
                actions_count: Math.min(args.actionsCount, THRESHOLD_PHASE_0_TOTAL),
                validated_at: new Date().toISOString(),
              },
              { onConflict: 'user_id,day_id' },
            ),
          );
        }

        // 4) Enregistre le franchissement de palier
        let tierIsFirstReach = false;
        if (tierReached) {
          const now = new Date().toISOString();
          const existing = current.tierReaches.find(
            (t) => t.tier_id === tierReached,
          );
          const updated: TierReach = existing
            ? {
                ...existing,
                last_reached_at: now,
                reach_count: existing.reach_count + 1,
              }
            : {
                tier_id: tierReached,
                first_reached_at: now,
                last_reached_at: now,
                reach_count: 1,
              };
          tierIsFirstReach = updated.reach_count === 1;
          nextData = withTierReach(nextData, updated);
          await store.saveTierReach(updated, nextData.tierReaches);
        }

        // Toutes les écritures ont réussi → commit atomique du state.
        commitData(nextData);

        // 5) Sprint notifications Phase 0 — annule le rappel soir 20h du jour
        //    courant si on est en Phase 0 (action validée → pas besoin de
        //    rappel). Non-bloquant.
        if (phase === 'phase_0' && args.day != null) {
          try {
            const { cancelTodayReminder } = await import('../../lib/phase0-scheduler');
            await cancelTodayReminder(args.day);
          } catch (e) {
            console.warn('cancelTodayReminder failed', e);
          }
        }

        return {
          newStreak,
          jokerUsed: decision.jokerUsed,
          tierReached,
          tierIsFirstReach,
        };
      }),
    [currentPhase, store, user, enqueueMutation, commitData],
  );


  return { validateDay, runCalendarCoherence, setPendingTier, clearPendingTier };
}

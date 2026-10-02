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
import { addDays, currentWeekKey, todayLocalDate } from '../../lib/calendar';
import { loadDailyChecksCounts, removeDailyChecks } from '../../lib/dailyChecks';
import {
  autoValidatedNotice,
  jokerUsedNotice,
  streakBrokenNotice,
} from '../../data/global-copy';
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
        const today = todayLocalDate();
        // D44 : coches Phase 0 restées sur l'appareil — une journée passée à
        // ≥ 5/7 est validée à sa date.
        const checksByDate = await loadDailyChecksCounts();
        // D45 : les coches de la veille restent sur l'appareil (récapitulatif
        // « Hier » en lecture seule) ; seules les plus anciennes sont nettoyées.
        // Une date déjà dans l'historique n'est jamais revalidée.
        const yesterday = addDays(today, -1);
        const staleCheckDates = Object.keys(checksByDate).filter((d) => d < yesterday);
        const resolved = resolveMissedDays({
          history,
          consumptions,
          today,
          phase,
          checksByDate,
        });
        if (resolved.entries.length === 0) {
          await removeDailyChecks(staleCheckDates);
          return;
        }

        // Persistance batch — Supabase en connecté, AsyncStorage en anonyme.
        let nextData = withCoherenceResolution(
          dataRef.current,
          resolved.entries,
          resolved.consumptions,
        );

        // D44 : palier franchi par une validation auto → enregistré, et
        // différé (D30) : la modale IA-50 se joue à la prochaine validation
        // manuelle, jamais en plein chargement.
        let pendingFromAuto: PendingTierReach | null = null;
        let prevStreak = currentStreakFromHistory(history);
        for (const e of resolved.entries) {
          const tier = tierJustReached(prevStreak, e.streak_value_after);
          prevStreak = e.streak_value_after;
          if (!tier) continue;
          const now = new Date().toISOString();
          const existing = nextData.tierReaches.find((t) => t.tier_id === tier);
          const updated: TierReach = existing
            ? { ...existing, last_reached_at: now, reach_count: existing.reach_count + 1 }
            : { tier_id: tier, first_reached_at: now, last_reached_at: now, reach_count: 1 };
          nextData = withTierReach(nextData, updated);
          pendingFromAuto = {
            tierId: tier,
            isFirstReach: updated.reach_count === 1,
            streakValue: e.streak_value_after,
            deferredAt: now,
          };
        }

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
          // D44 : ligne `progress` par journée auto-validée (day_id = position
          // D38 de cette journée = validations antérieures + 1).
          let dayId = day;
          for (const auto of resolved.autoValidated) {
            await must(
              supabase.from('progress').upsert(
                {
                  user_id: user.id,
                  day_id: dayId,
                  is_minimum: false,
                  actions_count: Math.min(auto.actionsCount, THRESHOLD_PHASE_0_TOTAL),
                  validated_at: new Date().toISOString(),
                },
                { onConflict: 'user_id,day_id' },
              ),
            );
            dayId += 1;
          }
          if (pendingFromAuto) await store.saveTierReach(
            nextData.tierReaches.find((t) => t.tier_id === pendingFromAuto!.tierId)!,
            nextData.tierReaches,
          );
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
          if (pendingFromAuto) {
            await AsyncStorage.setItem(
              LOCAL_KEYS.tierReaches,
              JSON.stringify(nextData.tierReaches),
            );
          }
        }
        if (pendingFromAuto) await setPendingTier(pendingFromAuto);
        await removeDailyChecks(staleCheckDates);
        commitData(nextData);

        // Message sobre, non-culpabilisant (D26). Texte routé par slots de
        // copy dans src/data/global-copy.ts (D23, F-13 audit Lou).
        // Reprise de position (D38) : les jours manqués ne comptent pas en
        // progression ; les journées auto-validées (D44) si — le jour de
        // reprise est donc `day` + nombre de validations auto.
        const resumeDay = day + resolved.autoValidated.length;
        if (resolved.autoValidated.length > 0) {
          const n = autoValidatedNotice(resolved.autoValidated);
          showNotice(n.title, n.body);
        }
        const broke = resolved.entries.some(
          (e) => e.validation_status === 'broken_streak',
        );
        if (broke) {
          const n = streakBrokenNotice(phase, resumeDay);
          showNotice(n.title, n.body);
        } else if (resolved.consumptions.length > 0) {
          const n = jokerUsedNotice(phase, resumeDay);
          showNotice(n.title, n.body);
        }
      }).catch((e) => {
        // Non bloquant — retentera au prochain chargement / changement de jour.
        console.warn('[ProgressContext] cohérence calendaire échouée', e);
      });
    },
    [user, store, enqueueMutation, commitData, setPendingTier],
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
        // D27 — une journée validée reste validée. Garde au niveau de la
        // mutation (les écrans gardent aussi) : un second appel le même jour
        // réécrirait l'entrée et pourrait consommer le joker une 2e fois.
        if (current.streakHistory.some((e) => e.local_date === localDate)) {
          throw new Error(`Journée ${localDate} déjà validée (D27).`);
        }
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

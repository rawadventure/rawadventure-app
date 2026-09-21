/**
 * useCalendarDomain — horloge et dérivés calendaires du parcours (F-05.5,
 * audit Lou — extrait de ProgressContext, même comportement).
 *
 * Porte la décision D38 (position par validation) : currentDay,
 * dayInPillarWeek, currentPhase, streak, jokerAvailable, et le clockEpoch
 * qui invalide ces memos au passage de minuit (retour premier plan, audit
 * M1) et au DEV clock.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import {
  currentStreakFromHistory,
  isJokerAvailable,
  validatedDaysCount,
  type JokerConsumption,
  type Phase,
  type StreakEntry,
} from '../../lib/streak';
import { todayLocalDate, type LocalDate } from '../../lib/calendar';
import type { TierReach } from './types';

type CalendarDomainDeps = {
  accountCreatedAt: string | null;
  streakHistory: StreakEntry[];
  jokerConsumptions: JokerConsumption[];
  tierReaches: TierReach[];
  pillarStartedAt: string | null;
  s8FinalCompleted: boolean;
};

export function useCalendarDomain({
  accountCreatedAt,
  streakHistory,
  jokerConsumptions,
  tierReaches,
  pillarStartedAt,
  s8FinalCompleted,
}: CalendarDomainDeps) {
  void tierReaches;
  // DEV clock epoch — bump à chaque advanceDevClock/setDevClockOffset/reset
  // pour forcer recompute des useMemo currentDay/dayInPillarWeek/jokerAvailable.
  const [clockEpoch, setClockEpoch] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { isDevToolsEnabled } = require('../../lib/devToolsEnabled');
    if (!isDevToolsEnabled()) return;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { subscribeDevClock } = require('../../lib/devClock');
    return subscribeDevClock(() => setClockEpoch((e) => e + 1));
  }, []);

  // Audit M1 (2026-07-07) — recalcul du jour au retour au premier plan.
  // Les useMemo currentDay/dayInPillarWeek/jokerAvailable lisent
  // todayLocalDate() mais rien ne les invalidait au passage de minuit : une
  // PWA iOS résumée le matin (JS gardé vivant) restait sur le jour d'avant
  // jusqu'à une validation ou un vrai relaunch — écrans narratifs S0.1/S0.2/
  // charnières non déclenchés au lancement. Au retour 'active', si la date
  // locale a changé, on bump clockEpoch (déjà dans les deps des useMemo).
  // Sur web, AppState est mappé par react-native-web sur la Page Visibility
  // API — couvre le resume PWA.
  const lastKnownTodayRef = useRef(todayLocalDate());
  useEffect(() => {
    const onAppStateChange = (state: AppStateStatus) => {
      if (state !== 'active') return;
      const today = todayLocalDate();
      if (today !== lastKnownTodayRef.current) {
        lastKnownTodayRef.current = today;
        setClockEpoch((e) => e + 1);
      }
    };
    const sub = AppState.addEventListener('change', onAppStateChange);
    return () => sub.remove();
  }, []);


  // ── Calculs dérivés ───────────────────────────────────────────────────────

  // D38 (2026-06-17) — découplage progression / streak.
  // currentDay = jour du programme EN COURS (où je suis aujourd'hui).
  //  - Si journée today validée : currentDay = nb validations (sur ce jour).
  //  - Sinon : currentDay = nb validations + 1 (prochain jour à faire).
  // Passage de N → N+1 = nouveau jour calendaire OU bouton DEV "Passer jour
  // suivant" (qui shift le calendrier -1j). Validation seule N'avance PAS
  // currentDay. Absence n'avance pas non plus (streak casse, currentDay reste).
  const currentDay = useMemo(() => {
    if (!accountCreatedAt) return 0;
    const today = todayLocalDate();
    const alreadyToday = streakHistory.some((e) => e.local_date === today);
    const p0 = validatedDaysCount(streakHistory, 'phase_0');
    const p1 = validatedDaysCount(streakHistory, 'phase_1');
    return p0 + p1 + (alreadyToday ? 0 : 1);
    // clockEpoch : clé d'invalidation volontaire (passage de minuit, DEV
    // clock) — todayLocalDate() n'est pas une dépendance React trackable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountCreatedAt, streakHistory, clockEpoch]);

  // dayInPillarWeek = jour DU PILIER EN COURS où je suis aujourd'hui.
  // Même logique que currentDay : si une session phase_1 validée today, reste
  // sur le jour. Sinon prochain jour. Capped 7.
  const dayInPillarWeek = useMemo(() => {
    if (!pillarStartedAt) return 0;
    const startedDate = pillarStartedAt.slice(0, 10) as LocalDate;
    const today = todayLocalDate();
    const inPillar = streakHistory.filter(
      (e) =>
        e.phase === 'phase_1' &&
        e.local_date >= startedDate &&
        (e.validation_status === 'valid_above_threshold' ||
          e.validation_status === 'valid_with_joker'),
    );
    const validatedInPillar = inPillar.length;
    const alreadyTodayInPillar = inPillar.some((e) => e.local_date === today);
    return Math.min(validatedInPillar + (alreadyTodayInPillar ? 0 : 1), 7);
    // clockEpoch : clé d'invalidation volontaire (voir currentDay).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pillarStartedAt, streakHistory, clockEpoch]);

  const currentPhase: Phase = useMemo(() => {
    // Post-S8 prime dès qu'une éval finale S8 a été enregistrée — bascule
    // permanente vers mode consolidation libre (IA-23 + D13).
    if (s8FinalCompleted) return 'post_s8';
    // Phase 0 = J1 à J14 (parcours d'amorçage) + S0 = J15-J16 (transition
    // gratuite, D17 + CLAUDE.md §2). Au-delà de J16 → Phase 1 payante.
    // S0.1 (J15) et S0.2 (J16) restent dans `phase_0` côté type — pas de
    // valeur dédiée s0_1/s0_2 — la distinction se fait via `currentDay`
    // dans les écrans qui en ont besoin (HomeScreenV1, narratif).
    // Conséquence : paywall gate du RootNavigator laisse passer J15-J16.
    return currentDay <= 16 ? 'phase_0' : 'phase_1';
  }, [currentDay, s8FinalCompleted]);

  const streak = useMemo(
    () => currentStreakFromHistory(streakHistory),
    [streakHistory],
  );

  const jokerAvailable = useMemo(
    () => isJokerAvailable(jokerConsumptions, todayLocalDate()),
    // clockEpoch : recompute au changement de jour (audit M1) et au DEV clock —
    // sans lui, le joker de la semaine passée restait « consommé » après minuit
    // du dimanche tant que rien d'autre ne changeait.
    // clockEpoch : clé d'invalidation volontaire (voir currentDay).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [jokerConsumptions, clockEpoch],
  );


  return { clockEpoch, currentDay, dayInPillarWeek, currentPhase, streak, jokerAvailable };
}

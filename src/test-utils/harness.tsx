/**
 * harness.tsx — utilitaires partagés pour les tests d'intégration des
 * contexts et des écrans (ProgressContext, SubscriptionContext, flows).
 *
 * IMPORTANT : ce fichier vit hors de `__tests__/` pour ne pas être ramassé
 * comme suite de tests par le testMatch par défaut de Jest.
 *
 * Les `jest.mock(...)` restent dans chaque fichier de test (hoisting Jest) —
 * ici on ne fournit que des fabriques et helpers purs.
 */

import React, { type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressProvider } from '../hooks/ProgressContext';
import { addDays, parseLocalDate, todayLocalDate, type LocalDate } from '../lib/calendar';
import { resetDevClock, setDevClockOffset } from '../lib/devClock';
import type { StreakEntry, Phase, ValidationStatus } from '../lib/streak';

// ─── Horloge épinglée (indépendance à la date réelle du run) ─────────────────

/**
 * Épingle le devClock sur une date locale fixe (midi local par défaut).
 * Rend les tests sensibles aux semaines ISO (joker lundi-dimanche)
 * indépendants du jour réel d'exécution. Nécessite __DEV__ (vrai sous Jest).
 */
export function pinClockTo(date: LocalDate, hour = 12): void {
  const target = parseLocalDate(date);
  target.setHours(hour, 0, 0, 0);
  setDevClockOffset(target.getTime() - Date.now());
}

/** Remet l'horloge réelle (à appeler en afterEach). */
export function unpinClock(): void {
  resetDevClock();
}

// ─── Dates relatives (déterministes par run, compatibles devClock) ────────────

/** Date locale du jour (suit le devClock si offset posé). */
export function today(): LocalDate {
  return todayLocalDate();
}

/** Date locale N jours avant aujourd'hui (N ≥ 0). */
export function daysAgo(n: number): LocalDate {
  return addDays(todayLocalDate(), -n);
}

// ─── Seed d'historique streak ─────────────────────────────────────────────────

/** Construit une entrée streak_history validée (Cas A par défaut). */
export function entry(
  localDate: LocalDate,
  streakAfter: number,
  opts: Partial<{
    status: ValidationStatus;
    phase: Phase;
    jokerUsed: boolean;
  }> = {},
): StreakEntry {
  return {
    local_date: localDate,
    validation_status: opts.status ?? 'valid_above_threshold',
    phase: opts.phase ?? 'phase_0',
    streak_value_after: streakAfter,
    joker_used: opts.jokerUsed ?? false,
  };
}

/**
 * Construit un historique de N jours validés consécutifs se terminant à
 * `endDate` (par défaut : hier). Streak croissant 1..N.
 */
export function validatedRun(
  n: number,
  endDate: LocalDate = daysAgo(1),
  phase: Phase = 'phase_0',
): StreakEntry[] {
  const entries: StreakEntry[] = [];
  for (let i = 0; i < n; i++) {
    entries.push(entry(addDays(endDate, -(n - 1 - i)), i + 1, { phase }));
  }
  return entries;
}

/**
 * Seed AsyncStorage en mode anonyme AVANT le render du provider.
 * Pose accountCreatedAt + onboardingDone + historique fournis.
 */
export async function seedAnonymousStorage(args: {
  accountCreatedAt?: string;
  history?: StreakEntry[];
  jokerConsumptions?: Array<{ week_key: string; consumed_for_local_date: string }>;
  tierReaches?: Array<{
    tier_id: number;
    first_reached_at: string;
    last_reached_at: string;
    reach_count: number;
  }>;
  narrativeFlags?: Record<string, string>;
  currentPillarId?: string;
  pillarStartedAt?: string;
}): Promise<void> {
  const sets: Array<[string, string]> = [
    ['onboarding_done', JSON.stringify(true)],
    [
      'account_created_at',
      JSON.stringify(args.accountCreatedAt ?? new Date().toISOString()),
    ],
  ];
  if (args.history) sets.push(['streak_history', JSON.stringify(args.history)]);
  if (args.jokerConsumptions)
    sets.push(['joker_consumptions', JSON.stringify(args.jokerConsumptions)]);
  if (args.tierReaches)
    sets.push(['tier_reaches', JSON.stringify(args.tierReaches)]);
  if (args.narrativeFlags)
    sets.push(['narrative_flags', JSON.stringify(args.narrativeFlags)]);
  if (args.currentPillarId)
    sets.push(['current_pillar_id', JSON.stringify(args.currentPillarId)]);
  if (args.pillarStartedAt)
    sets.push(['pillar_started_at', JSON.stringify(args.pillarStartedAt)]);
  await AsyncStorage.multiSet(sets);
}

// ─── Wrapper provider ─────────────────────────────────────────────────────────
// (le mock Supabase vit dans src/test-utils/supabaseMock.ts — sans import app,
// pour être utilisable depuis les factories jest.mock hoistées)

/** Wrapper renderHook : ProgressProvider seul (AuthContext mocké par le test). */
export function progressWrapper({ children }: { children: ReactNode }) {
  return <ProgressProvider>{children}</ProgressProvider>;
}

/**
 * Tests progressData — transitions pures du trio streak/joker/palier
 * (F-05.4 audit Lou). Upserts dédupliqués par clé naturelle, tri stable,
 * immutabilité (l'entrée n'est jamais mutée).
 */

import {
  EMPTY_PROGRESS_DATA,
  withCoherenceResolution,
  withJokerConsumption,
  withStreakEntry,
  withTierReach,
  type ProgressData,
} from '../progressData';
import type { StreakEntry } from '../streak';

function entry(local_date: string, streak: number): StreakEntry {
  return {
    local_date,
    validation_status: 'valid_above_threshold',
    phase: 'phase_0',
    streak_value_after: streak,
    joker_used: false,
  };
}

describe('withStreakEntry', () => {
  test('insère trié par date', () => {
    let d = withStreakEntry(EMPTY_PROGRESS_DATA, entry('2026-10-15', 2));
    d = withStreakEntry(d, entry('2026-10-14', 1));
    expect(d.streakHistory.map((e) => e.local_date)).toEqual([
      '2026-10-14',
      '2026-10-15',
    ]);
  });

  test('upsert : une entrée du même jour remplace (D27 côté données)', () => {
    let d = withStreakEntry(EMPTY_PROGRESS_DATA, entry('2026-10-15', 2));
    d = withStreakEntry(d, { ...entry('2026-10-15', 3), joker_used: true });
    expect(d.streakHistory).toHaveLength(1);
    expect(d.streakHistory[0].streak_value_after).toBe(3);
  });

  test('immutabilité : l entrée n est pas mutée', () => {
    const before: ProgressData = {
      streakHistory: [entry('2026-10-14', 1)],
      jokerConsumptions: [],
      tierReaches: [],
    };
    const snapshot = JSON.parse(JSON.stringify(before));
    withStreakEntry(before, entry('2026-10-15', 2));
    expect(before).toEqual(snapshot);
  });
});

describe('withJokerConsumption / withTierReach', () => {
  test('joker : upsert par week_key', () => {
    let d = withJokerConsumption(EMPTY_PROGRESS_DATA, {
      week_key: '2026-W42',
      consumed_for_local_date: '2026-10-14',
    });
    d = withJokerConsumption(d, {
      week_key: '2026-W42',
      consumed_for_local_date: '2026-10-15',
    });
    expect(d.jokerConsumptions).toHaveLength(1);
    expect(d.jokerConsumptions[0].consumed_for_local_date).toBe('2026-10-15');
  });

  test('palier : upsert par tier_id', () => {
    let d = withTierReach(EMPTY_PROGRESS_DATA, {
      tier_id: 15,
      first_reached_at: 'a',
      last_reached_at: 'a',
      reach_count: 1,
    });
    d = withTierReach(d, {
      tier_id: 15,
      first_reached_at: 'a',
      last_reached_at: 'b',
      reach_count: 2,
    });
    expect(d.tierReaches).toHaveLength(1);
    expect(d.tierReaches[0].reach_count).toBe(2);
  });
});

describe('withCoherenceResolution', () => {
  test('applique entrées + jokers en batch, trié', () => {
    const base = withStreakEntry(EMPTY_PROGRESS_DATA, entry('2026-10-12', 3));
    const d = withCoherenceResolution(
      base,
      [
        {
          ...entry('2026-10-13', 3),
          validation_status: 'valid_with_joker',
          joker_used: true,
        },
        { ...entry('2026-10-14', 0), validation_status: 'broken_streak' },
      ],
      [{ week_key: '2026-W42', consumed_for_local_date: '2026-10-13' }],
    );
    expect(d.streakHistory.map((e) => e.local_date)).toEqual([
      '2026-10-12',
      '2026-10-13',
      '2026-10-14',
    ]);
    expect(d.jokerConsumptions).toHaveLength(1);
  });
});

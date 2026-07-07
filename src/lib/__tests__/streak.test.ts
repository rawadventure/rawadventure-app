/**
 * Tests streak.ts — mécanique streak + joker hebdo.
 *
 * Tests prioritaires : determineValidationStatus (cas A/B/C de §2.5),
 * applyStreakIncrement, tierJustReached, isJokerAvailable.
 */

import {
  applyStreakIncrement,
  currentStreakFromHistory,
  determineValidationStatus,
  isJokerAvailable,
  longestStreakFromHistory,
  missingDatesBetween,
  resolveMissedDays,
  THRESHOLD_PHASE_0_ACTIONS,
  THRESHOLD_PHASE_1_SESSIONS,
  tierJustReached,
  type StreakEntry,
} from '../streak';
import { weekKeyOf } from '../calendar';

describe('streak.currentStreakFromHistory', () => {
  test('historique vide → 0', () => {
    expect(currentStreakFromHistory([])).toBe(0);
  });
  test('renvoie streak_value_after du dernier (le plus récent)', () => {
    const h: StreakEntry[] = [
      { local_date: '2026-05-14', validation_status: 'valid_above_threshold', phase: 'phase_0', streak_value_after: 1, joker_used: false },
      { local_date: '2026-05-15', validation_status: 'valid_above_threshold', phase: 'phase_0', streak_value_after: 2, joker_used: false },
    ];
    expect(currentStreakFromHistory(h)).toBe(2);
  });
});

describe('streak.longestStreakFromHistory', () => {
  test('max sur l\'historique', () => {
    const h: StreakEntry[] = [
      { local_date: '2026-05-14', validation_status: 'valid_above_threshold', phase: 'phase_0', streak_value_after: 5, joker_used: false },
      { local_date: '2026-05-15', validation_status: 'broken_streak', phase: 'phase_0', streak_value_after: 0, joker_used: false },
      { local_date: '2026-05-16', validation_status: 'valid_above_threshold', phase: 'phase_0', streak_value_after: 1, joker_used: false },
    ];
    expect(longestStreakFromHistory(h)).toBe(5);
  });
});

describe('streak.isJokerAvailable', () => {
  test('aucune consommation → dispo', () => {
    expect(isJokerAvailable([], '2026-05-16')).toBe(true);
  });
  test('consommation cette semaine → indisponible', () => {
    expect(
      isJokerAvailable(
        [{ week_key: '2026-W20', consumed_for_local_date: '2026-05-13' }],
        '2026-05-16',
      ),
    ).toBe(false);
  });
  test('consommation semaine précédente → dispo', () => {
    expect(
      isJokerAvailable(
        [{ week_key: '2026-W19', consumed_for_local_date: '2026-05-06' }],
        '2026-05-16',
      ),
    ).toBe(true);
  });
});

describe('streak.determineValidationStatus — Cas A au-dessus du seuil', () => {
  test('Phase 0 — 5 actions cochées sur 7 → valid_above_threshold', () => {
    const r = determineValidationStatus({
      phase: 'phase_0',
      actionsCount: 5,
      userValidatedManually: true,
      jokerAvailable: true,
    });
    expect(r.status).toBe('valid_above_threshold');
    expect(r.jokerUsed).toBe(false);
    expect(r.streakIncrement).toBe(1);
  });
  test('Phase 0 — 7/7 → valid_above_threshold', () => {
    expect(
      determineValidationStatus({
        phase: 'phase_0',
        actionsCount: 7,
        userValidatedManually: true,
        jokerAvailable: true,
      }).status,
    ).toBe('valid_above_threshold');
  });
  test('Phase 1 — 1 session sur 3 → valid_above_threshold', () => {
    expect(
      determineValidationStatus({
        phase: 'phase_1',
        actionsCount: 1,
        userValidatedManually: true,
        jokerAvailable: true,
      }).status,
    ).toBe('valid_above_threshold');
  });
});

describe('streak.determineValidationStatus — Cas B sous le seuil + soft-rappel', () => {
  test('Phase 0 — 3 actions avec joker dispo → valid_with_joker, streak conservé', () => {
    const r = determineValidationStatus({
      phase: 'phase_0',
      actionsCount: 3,
      userValidatedManually: true,
      jokerAvailable: true,
    });
    expect(r.status).toBe('valid_with_joker');
    expect(r.jokerUsed).toBe(true);
    expect(r.streakIncrement).toBe(0);
  });
  test('Phase 0 — 3 actions sans joker → broken_streak', () => {
    const r = determineValidationStatus({
      phase: 'phase_0',
      actionsCount: 3,
      userValidatedManually: true,
      jokerAvailable: false,
    });
    expect(r.status).toBe('broken_streak');
    expect(r.jokerUsed).toBe(false);
    expect(r.streakIncrement).toBe(Number.NEGATIVE_INFINITY);
  });
});

describe('streak.determineValidationStatus — Cas C cohérence auto (journée non validée)', () => {
  test('non validé avec joker dispo → valid_with_joker', () => {
    const r = determineValidationStatus({
      phase: 'phase_0',
      actionsCount: 0,
      userValidatedManually: false,
      jokerAvailable: true,
    });
    expect(r.status).toBe('valid_with_joker');
    expect(r.jokerUsed).toBe(true);
    expect(r.streakIncrement).toBe(0);
  });
  test('non validé sans joker → broken_streak', () => {
    const r = determineValidationStatus({
      phase: 'phase_0',
      actionsCount: 0,
      userValidatedManually: false,
      jokerAvailable: false,
    });
    expect(r.status).toBe('broken_streak');
  });
});

describe('streak.applyStreakIncrement', () => {
  test('+1 → prev + 1', () => {
    expect(applyStreakIncrement(5, 1)).toBe(6);
  });
  test('0 → prev (joker, streak conservé)', () => {
    expect(applyStreakIncrement(5, 0)).toBe(5);
  });
  test('-Infinity → 0 (cassure)', () => {
    expect(applyStreakIncrement(15, Number.NEGATIVE_INFINITY)).toBe(0);
  });
});

describe('streak.tierJustReached', () => {
  test('6 → 7 → aucun palier (palier 7j supprimé le 2026-07-01, J7 = charnière)', () => {
    expect(tierJustReached(6, 7)).toBeNull();
  });
  test('14 → 15 → tier 15', () => {
    expect(tierJustReached(14, 15)).toBe(15);
  });
  test('29 → 30 → tier 30', () => {
    expect(tierJustReached(29, 30)).toBe(30);
  });
  test('364 → 365 → tier 365', () => {
    expect(tierJustReached(364, 365)).toBe(365);
  });
  test('aucun palier franchi', () => {
    expect(tierJustReached(2, 3)).toBeNull();
    expect(tierJustReached(8, 9)).toBeNull();
  });
  test('décroissance (cassure) → aucun', () => {
    expect(tierJustReached(7, 0)).toBeNull();
  });
});

describe('streak.missingDatesBetween', () => {
  test('même jour → []', () => {
    expect(missingDatesBetween('2026-05-16', '2026-05-16')).toEqual([]);
  });
  test('1 jour d\'écart → la date intermédiaire', () => {
    expect(missingDatesBetween('2026-05-15', '2026-05-16')).toEqual(['2026-05-16']);
  });
  test('3 jours d\'écart → 3 dates', () => {
    expect(missingDatesBetween('2026-05-14', '2026-05-17')).toEqual([
      '2026-05-15',
      '2026-05-16',
      '2026-05-17',
    ]);
  });
  test('lastProcessed null → []', () => {
    expect(missingDatesBetween(null, '2026-05-16')).toEqual([]);
  });
});

describe('streak — seuils constantes', () => {
  test('Phase 0 seuil = 5', () => {
    expect(THRESHOLD_PHASE_0_ACTIONS).toBe(5);
  });
  test('Phase 1 seuil = 1', () => {
    expect(THRESHOLD_PHASE_1_SESSIONS).toBe(1);
  });
});

// ── Cohérence calendaire (audit B1) — §2.5 Cas C ─────────────────────────────
// Repères : 2026-07-06 est un lundi. Semaine A = 06→12 juillet,
// semaine B = 13→19 juillet.

describe('streak.resolveMissedDays', () => {
  const validated = (local_date: string, streak: number): StreakEntry => ({
    local_date,
    validation_status: 'valid_above_threshold',
    phase: 'phase_0',
    streak_value_after: streak,
    joker_used: false,
  });

  test('historique vide → rien à résoudre', () => {
    const r = resolveMissedDays({
      history: [],
      consumptions: [],
      today: '2026-07-10',
      phase: 'phase_0',
    });
    expect(r.entries).toEqual([]);
    expect(r.consumptions).toEqual([]);
  });

  test('dernière entrée = hier → rien à résoudre (aujourd\'hui reste ouvert)', () => {
    const r = resolveMissedDays({
      history: [validated('2026-07-09', 4)],
      consumptions: [],
      today: '2026-07-10',
      phase: 'phase_0',
    });
    expect(r.entries).toEqual([]);
  });

  test('1 jour manqué, joker dispo → missed_with_joker, streak conservé', () => {
    const r = resolveMissedDays({
      history: [validated('2026-07-08', 3)],
      consumptions: [],
      today: '2026-07-10', // 07-09 manqué
      phase: 'phase_0',
    });
    expect(r.entries).toEqual([
      {
        local_date: '2026-07-09',
        validation_status: 'missed_with_joker',
        phase: 'phase_0',
        streak_value_after: 3,
        joker_used: true,
      },
    ]);
    expect(r.consumptions).toEqual([
      { week_key: weekKeyOf('2026-07-09'), consumed_for_local_date: '2026-07-09' },
    ]);
  });

  test('2 jours manqués même semaine → joker puis cassure', () => {
    const r = resolveMissedDays({
      history: [validated('2026-07-09', 4)],
      consumptions: [],
      today: '2026-07-12', // 07-10 et 07-11 manqués (même semaine)
      phase: 'phase_0',
    });
    expect(r.entries.map((e) => e.validation_status)).toEqual([
      'missed_with_joker',
      'broken_streak',
    ]);
    expect(r.entries[0].streak_value_after).toBe(4);
    expect(r.entries[1].streak_value_after).toBe(0);
    expect(r.consumptions).toHaveLength(1);
  });

  test('2 jours manqués à cheval sur 2 semaines → 2 jokers, streak conservé', () => {
    const r = resolveMissedDays({
      history: [validated('2026-07-11', 6)],
      consumptions: [],
      today: '2026-07-14', // 07-12 (dimanche, sem. A) + 07-13 (lundi, sem. B)
      phase: 'phase_0',
    });
    expect(r.entries.map((e) => e.validation_status)).toEqual([
      'missed_with_joker',
      'missed_with_joker',
    ]);
    expect(r.entries[1].streak_value_after).toBe(6);
    expect(r.consumptions).toHaveLength(2);
    expect(r.consumptions[0].week_key).not.toBe(r.consumptions[1].week_key);
  });

  test('joker déjà consommé cette semaine → cassure directe', () => {
    const r = resolveMissedDays({
      history: [validated('2026-07-09', 4)],
      consumptions: [
        { week_key: weekKeyOf('2026-07-09'), consumed_for_local_date: '2026-07-07' },
      ],
      today: '2026-07-11', // 07-10 manqué, joker semaine déjà pris
      phase: 'phase_0',
    });
    expect(r.entries).toEqual([
      {
        local_date: '2026-07-10',
        validation_status: 'broken_streak',
        phase: 'phase_0',
        streak_value_after: 0,
        joker_used: false,
      },
    ]);
    expect(r.consumptions).toEqual([]);
  });

  test('streak déjà à 0 → pas de joker consommé (choix produit 7 juillet 2026)', () => {
    const broken: StreakEntry = {
      local_date: '2026-07-08',
      validation_status: 'broken_streak',
      phase: 'phase_0',
      streak_value_after: 0,
      joker_used: false,
    };
    const r = resolveMissedDays({
      history: [broken],
      consumptions: [],
      today: '2026-07-10', // 07-09 manqué, streak 0
      phase: 'phase_0',
    });
    expect(r.entries[0].validation_status).toBe('broken_streak');
    expect(r.consumptions).toEqual([]);
  });

  test('longue absence : joker sur le 1er jour, cassure ensuite, une entrée par jour', () => {
    const r = resolveMissedDays({
      history: [validated('2026-07-06', 1)],
      consumptions: [],
      today: '2026-07-10', // 07-07, 07-08, 07-09 manqués
      phase: 'phase_0',
    });
    expect(r.entries.map((e) => e.validation_status)).toEqual([
      'missed_with_joker',
      'broken_streak',
      'broken_streak',
    ]);
    expect(r.entries.map((e) => e.local_date)).toEqual([
      '2026-07-07',
      '2026-07-08',
      '2026-07-09',
    ]);
    expect(r.consumptions).toHaveLength(1);
  });
});

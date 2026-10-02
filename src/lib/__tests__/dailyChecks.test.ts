/**
 * Tests dailyChecks.ts — stockage local des coches Phase 0 par date (D44).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  countChecked,
  dailyChecksKey,
  loadDailyChecks,
  loadDailyChecksCounts,
  removeDailyChecks,
} from '../dailyChecks';

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('dailyChecks.dailyChecksKey', () => {
  test('clé stable par date locale (compat V0 : daily_check_actions.<date>)', () => {
    expect(dailyChecksKey('2026-10-15')).toBe('daily_check_actions.2026-10-15');
  });
});

describe('dailyChecks.countChecked', () => {
  test('compte les valeurs vraies uniquement', () => {
    expect(countChecked({ a: true, b: false, c: true })).toBe(2);
    expect(countChecked({})).toBe(0);
  });
});

describe('dailyChecks.loadDailyChecksCounts', () => {
  test('renvoie le nombre de coches par date, ignore les autres clés', async () => {
    await AsyncStorage.multiSet([
      ['daily_check_actions.2026-10-14', JSON.stringify({ a: true, b: true, c: false })],
      ['daily_check_actions.2026-10-15', JSON.stringify({ a: true })],
      ['streak_history', JSON.stringify([])],
    ]);
    expect(await loadDailyChecksCounts()).toEqual({
      '2026-10-14': 2,
      '2026-10-15': 1,
    });
  });

  test('valeur illisible → date ignorée, pas d exception', async () => {
    await AsyncStorage.setItem('daily_check_actions.2026-10-14', '{not json');
    expect(await loadDailyChecksCounts()).toEqual({});
  });
});

describe('dailyChecks.removeDailyChecks', () => {
  test('supprime les clés des dates données uniquement', async () => {
    await AsyncStorage.multiSet([
      ['daily_check_actions.2026-10-14', '{}'],
      ['daily_check_actions.2026-10-15', '{}'],
    ]);
    await removeDailyChecks(['2026-10-14']);
    expect(await AsyncStorage.getItem('daily_check_actions.2026-10-14')).toBeNull();
    expect(await AsyncStorage.getItem('daily_check_actions.2026-10-15')).toBe('{}');
  });

  test('liste vide → no-op', async () => {
    await expect(removeDailyChecks([])).resolves.toBeUndefined();
  });
});

describe('dailyChecks.loadDailyChecks (D45 — récapitulatif de la veille)', () => {
  test('renvoie la carte des coches d une date', async () => {
    await AsyncStorage.setItem(
      'daily_check_actions.2026-10-14',
      JSON.stringify({ defi_froid: true, fruits: false }),
    );
    expect(await loadDailyChecks('2026-10-14')).toEqual({ defi_froid: true, fruits: false });
  });

  test('date sans coches ou valeur illisible → null', async () => {
    expect(await loadDailyChecks('2026-10-14')).toBeNull();
    await AsyncStorage.setItem('daily_check_actions.2026-10-14', '{oops');
    expect(await loadDailyChecks('2026-10-14')).toBeNull();
  });
});

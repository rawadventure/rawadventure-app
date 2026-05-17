/**
 * Tests calendar.ts — helpers temporels purs.
 *
 * Tests prioritaires : currentDayInParcours (J1=jour de création),
 * weekKeyOf (ISO 8601 lundi-dimanche), startOfNextLocalDay, daysBetween,
 * addDays.
 */

import {
  addDays,
  currentDayInParcours,
  daysBetween,
  hoursUntilNextLocalMidnight,
  localDateOf,
  parseLocalDate,
  startOfIsoWeek,
  startOfNextLocalDay,
  todayLocalDate,
  weekKeyOf,
} from '../calendar';

describe('calendar.localDateOf / parseLocalDate', () => {
  test('localDateOf renvoie YYYY-MM-DD du fuseau local', () => {
    const d = new Date(2026, 4, 16, 10, 0, 0); // 16 mai 2026 10h local
    expect(localDateOf(d)).toBe('2026-05-16');
  });
  test('parseLocalDate retourne minuit local de la date donnée', () => {
    const d = parseLocalDate('2026-05-16');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(4); // mai = index 4
    expect(d.getDate()).toBe(16);
    expect(d.getHours()).toBe(0);
  });
  test('todayLocalDate avec now injecté', () => {
    const now = new Date(2026, 4, 16, 15, 30);
    expect(todayLocalDate(now)).toBe('2026-05-16');
  });
});

describe('calendar.daysBetween / addDays', () => {
  test('daysBetween même jour = 0', () => {
    expect(daysBetween('2026-05-16', '2026-05-16')).toBe(0);
  });
  test('daysBetween 1 jour suivant = 1', () => {
    expect(daysBetween('2026-05-16', '2026-05-17')).toBe(1);
  });
  test('daysBetween 7 jours plus tard = 7', () => {
    expect(daysBetween('2026-05-16', '2026-05-23')).toBe(7);
  });
  test('daysBetween a > b renvoie négatif', () => {
    expect(daysBetween('2026-05-23', '2026-05-16')).toBe(-7);
  });
  test('daysBetween cross-month', () => {
    expect(daysBetween('2026-04-30', '2026-05-02')).toBe(2);
  });
  test('addDays +1', () => {
    expect(addDays('2026-05-16', 1)).toBe('2026-05-17');
  });
  test('addDays -1', () => {
    expect(addDays('2026-05-16', -1)).toBe('2026-05-15');
  });
  test('addDays cross-month forward', () => {
    expect(addDays('2026-04-30', 1)).toBe('2026-05-01');
  });
  test('addDays cross-year', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });
});

describe('calendar.currentDayInParcours', () => {
  test('J1 = jour calendaire local d\'accountCreatedAt', () => {
    const created = new Date(2026, 4, 16, 10, 0); // 16 mai
    const now = new Date(2026, 4, 16, 23, 59); // même jour
    expect(currentDayInParcours(created, now)).toBe(1);
  });
  test('J2 = lendemain calendaire local', () => {
    const created = new Date(2026, 4, 16, 10, 0);
    const now = new Date(2026, 4, 17, 0, 1); // 17 mai 00h01
    expect(currentDayInParcours(created, now)).toBe(2);
  });
  test('J14 après 13 jours calendaires', () => {
    const created = new Date(2026, 4, 16, 10, 0);
    const now = new Date(2026, 4, 29, 8, 0); // 29 mai = +13j
    expect(currentDayInParcours(created, now)).toBe(14);
  });
  test('démarrage différé : created dans le futur → 0', () => {
    const created = new Date(2026, 4, 17, 0, 0); // demain
    const now = new Date(2026, 4, 16, 23, 0); // aujourd'hui 23h
    expect(currentDayInParcours(created, now)).toBe(0);
  });
});

describe('calendar.startOfNextLocalDay / hoursUntilNextLocalMidnight', () => {
  test('startOfNextLocalDay = minuit local du lendemain', () => {
    const now = new Date(2026, 4, 16, 14, 30);
    const next = startOfNextLocalDay(now);
    const nextDate = new Date(next);
    expect(nextDate.getFullYear()).toBe(2026);
    expect(nextDate.getMonth()).toBe(4);
    expect(nextDate.getDate()).toBe(17);
    expect(nextDate.getHours()).toBe(0);
    expect(nextDate.getMinutes()).toBe(0);
  });
  test('hoursUntilNextLocalMidnight à 20h = 4h', () => {
    const now = new Date(2026, 4, 16, 20, 0);
    expect(hoursUntilNextLocalMidnight(now)).toBeCloseTo(4, 1);
  });
  test('hoursUntilNextLocalMidnight juste avant minuit ≈ 0', () => {
    const now = new Date(2026, 4, 16, 23, 55);
    expect(hoursUntilNextLocalMidnight(now)).toBeLessThan(0.1);
  });
});

describe('calendar.weekKeyOf (ISO 8601 lundi-dimanche)', () => {
  test('lundi → semaine donnée', () => {
    // 2026-05-11 est un lundi → semaine 20 de 2026
    expect(weekKeyOf('2026-05-11')).toBe('2026-W20');
  });
  test('dimanche → même semaine que lundi précédent', () => {
    expect(weekKeyOf('2026-05-17')).toBe('2026-W20'); // dimanche
  });
  test('lundi suivant → semaine suivante', () => {
    expect(weekKeyOf('2026-05-18')).toBe('2026-W21');
  });
  test('1er janvier 2026 (jeudi) → 2026-W01', () => {
    expect(weekKeyOf('2026-01-01')).toBe('2026-W01');
  });
  test('31 décembre 2025 (mercredi) → 2026-W01 (règle ISO)', () => {
    // La semaine ISO 1 est celle qui contient le premier jeudi. Le 31 déc 2025
    // est mercredi, dans la même semaine que le 1er janvier 2026 (jeudi).
    expect(weekKeyOf('2025-12-31')).toBe('2026-W01');
  });
});

describe('calendar.startOfIsoWeek', () => {
  test('mercredi → lundi de la même semaine', () => {
    // 2026-05-13 est un mercredi
    expect(startOfIsoWeek('2026-05-13')).toBe('2026-05-11');
  });
  test('lundi → lui-même', () => {
    expect(startOfIsoWeek('2026-05-11')).toBe('2026-05-11');
  });
  test('dimanche → lundi précédent', () => {
    expect(startOfIsoWeek('2026-05-17')).toBe('2026-05-11');
  });
});

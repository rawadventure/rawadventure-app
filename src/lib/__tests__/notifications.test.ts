/**
 * Tests notifications.ts — helpers plage silence (D32 22h-7h, ajusté 3 juin 2026).
 *
 * Couvre :
 *  - isInSilenceWindow : bornes 22h00 inclusif, 07h00 exclusif
 *  - shiftOutOfSilence : décalage à 07h00 du jour ou lendemain selon heure
 */

import { isInSilenceWindow, shiftOutOfSilence } from '../notifications';

describe('notifications — plage silence (D32 ajusté)', () => {
  describe('isInSilenceWindow', () => {
    test.each([
      ['21:59', 21, 59, false],
      ['22:00', 22, 0, true],
      ['22:30', 22, 30, true],
      ['23:59', 23, 59, true],
      ['00:00', 0, 0, true],
      ['03:30', 3, 30, true],
      ['06:59', 6, 59, true],
      ['07:00', 7, 0, false],
      ['07:01', 7, 1, false],
      ['08:00', 8, 0, false],
      ['12:00', 12, 0, false],
      ['18:00', 18, 0, false],
    ])('%s → %s', (_label, h, m, expected) => {
      const d = new Date(2026, 4, 22, h, m, 0, 0);
      expect(isInSilenceWindow(d)).toBe(expected);
    });
  });

  describe('shiftOutOfSilence', () => {
    test('hors plage : inchangé', () => {
      const d = new Date(2026, 4, 22, 14, 30, 0, 0);
      const shifted = shiftOutOfSilence(d);
      expect(shifted.getTime()).toBe(d.getTime());
    });

    test('22h30 → lendemain 07h00', () => {
      const d = new Date(2026, 4, 22, 22, 30, 0, 0);
      const shifted = shiftOutOfSilence(d);
      expect(shifted.getFullYear()).toBe(2026);
      expect(shifted.getMonth()).toBe(4);
      expect(shifted.getDate()).toBe(23);
      expect(shifted.getHours()).toBe(7);
      expect(shifted.getMinutes()).toBe(0);
    });

    test('23h59 → lendemain 07h00', () => {
      const d = new Date(2026, 4, 22, 23, 59, 0, 0);
      const shifted = shiftOutOfSilence(d);
      expect(shifted.getDate()).toBe(23);
      expect(shifted.getHours()).toBe(7);
    });

    test('03h30 (même jour, plage 00-07) → 07h00 même jour', () => {
      const d = new Date(2026, 4, 22, 3, 30, 0, 0);
      const shifted = shiftOutOfSilence(d);
      expect(shifted.getDate()).toBe(22);
      expect(shifted.getHours()).toBe(7);
      expect(shifted.getMinutes()).toBe(0);
    });

    test('06h59 → 07h00 même jour', () => {
      const d = new Date(2026, 4, 22, 6, 59, 0, 0);
      const shifted = shiftOutOfSilence(d);
      expect(shifted.getDate()).toBe(22);
      expect(shifted.getHours()).toBe(7);
    });

    test('passage fin de mois : 31 mai 23h00 → 1er juin 07h00', () => {
      const d = new Date(2026, 4, 31, 23, 0, 0, 0);
      const shifted = shiftOutOfSilence(d);
      expect(shifted.getMonth()).toBe(5);
      expect(shifted.getDate()).toBe(1);
      expect(shifted.getHours()).toBe(7);
    });
  });
});

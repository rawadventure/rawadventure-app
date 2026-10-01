/**
 * Tests useCalendarDomain — détection du passage de minuit (retours testeurs
 * 30 sept 2026, « validation pas fluide ») : une app laissée ouverte au
 * premier plan ne recevait aucun événement AppState à minuit et restait sur
 * la date de la veille. Un contrôle périodique (1 min) bump clockEpoch dès
 * que la date locale change.
 */

import { renderHook, act } from '@testing-library/react-native';
import * as calendar from '../../../lib/calendar';
import { useCalendarDomain } from '../useCalendarDomain';

const DEPS = {
  accountCreatedAt: '2026-10-10T08:00:00.000Z',
  streakHistory: [],
  jokerConsumptions: [],
  tierReaches: [],
  pillarStartedAt: null,
  s8FinalCompleted: false,
};

let todaySpy: jest.SpyInstance;

beforeEach(() => {
  jest.useFakeTimers();
  todaySpy = jest.spyOn(calendar, 'todayLocalDate').mockReturnValue('2026-10-15');
});

afterEach(() => {
  todaySpy.mockRestore();
  jest.useRealTimers();
});

describe('useCalendarDomain — passage de minuit app ouverte', () => {
  test('même date après 1 min → clockEpoch inchangé', async () => {
    const { result } = await renderHook(() => useCalendarDomain(DEPS));
    const before = result.current.clockEpoch;
    await act(async () => {
      jest.advanceTimersByTime(61_000);
    });
    expect(result.current.clockEpoch).toBe(before);
  });

  test('date locale changée → clockEpoch bump sans événement AppState', async () => {
    const { result } = await renderHook(() => useCalendarDomain(DEPS));
    const before = result.current.clockEpoch;
    todaySpy.mockReturnValue('2026-10-16');
    await act(async () => {
      jest.advanceTimersByTime(61_000);
    });
    expect(result.current.clockEpoch).toBe(before + 1);
    // Un seul bump par changement de date, pas un par minute.
    await act(async () => {
      jest.advanceTimersByTime(61_000);
    });
    expect(result.current.clockEpoch).toBe(before + 1);
  });

  test('démontage : le contrôle périodique est arrêté', async () => {
    const setSpy = jest.spyOn(global, 'setInterval');
    const clearSpy = jest.spyOn(global, 'clearInterval');
    const { unmount } = await renderHook(() => useCalendarDomain(DEPS));
    const id = setSpy.mock.results[setSpy.mock.results.length - 1]?.value;
    expect(id).toBeDefined();
    await act(async () => {
      unmount();
    });
    expect(clearSpy).toHaveBeenCalledWith(id);
    setSpy.mockRestore();
    clearSpy.mockRestore();
  });
});

/**
 * Tests Phase1HomeScreen — IA-11 hub Phase 1 (pilier en cours).
 *
 * Couvre : rendu du jour (titre/objectif/3 sessions), validation implicite
 * D6 (bannière dès 1/3), navigation vers IA-43, éval initiale mandatoire
 * (redirect PillarOverview fromStart), CTA éval finale J7 gaté par la
 * pratique du jour (clarif 2026-06-18), éval finale forcée au lendemain de
 * J7 (mode Z, D38), semaine terminée, et absence de bouton DEV hors mode DEV.
 *
 * Hooks mockés (pattern PaywallScreen) — les mécaniques dayInPillarWeek /
 * streak sont testées dans ProgressContext.test.
 */

import React from 'react';
import {
  render,
  screen,
  userEvent,
  waitFor,
} from '@testing-library/react-native';

jest.mock('../../../lib/supabase', () => {
  const { createSupabaseMock } = require('../../../test-utils/supabaseMock');
  const m = createSupabaseMock();
  return { supabase: m.client, __supabaseMock: m };
});

let mockUser: { id: string } | null = { id: 'user-1' };
jest.mock('../../../hooks/AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
}));

let mockCurrentPillarId: string | null = 'S1';
let mockDayInPillarWeek = 3;
let mockPillarStartedAt: string | null = null;
let mockStreak = 19;
let mockStreakHistory: Array<Record<string, unknown>> = [];
jest.mock('../../../hooks/ProgressContext', () => ({
  useProgress: () => ({
    currentPillarId: mockCurrentPillarId,
    dayInPillarWeek: mockDayInPillarWeek,
    pillarStartedAt: mockPillarStartedAt,
    streak: mockStreak,
    streakHistory: mockStreakHistory,
  }),
}));

let mockDevToolsEnabled = false;
jest.mock('../../../lib/devToolsEnabled', () => ({
  isDevToolsEnabled: () => mockDevToolsEnabled,
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({ navigate: mockNavigate }),
    useFocusEffect: (cb: () => void) => {
      React.useEffect(() => {
        cb();
      }, [cb]);
    },
  };
});

import Phase1HomeScreen from '../Phase1HomeScreen';
import { getPillarMeta } from '../../../data/pillar-registry';
import {
  daysAgo,
  entry,
  pinClockTo,
  today,
  unpinClock,
  validatedRun,
} from '../../../test-utils/harness';

const { __supabaseMock: sb } = jest.requireMock('../../../lib/supabase') as {
  __supabaseMock: import('../../../test-utils/supabaseMock').SupabaseMock;
};

const THURSDAY = '2026-10-15';
const S1 = getPillarMeta('S1')!;

const INITIAL_EVAL = {
  id: 'eval-1',
  user_id: 'user-1',
  pillar_id: 'S1',
  evaluation_type: 'initial',
};
const FINAL_EVAL = {
  id: 'eval-2',
  user_id: 'user-1',
  pillar_id: 'S1',
  evaluation_type: 'final',
};

function sessionRow(sessionIndex: number, localDate = today()) {
  return {
    user_id: 'user-1',
    pillar_id: 'S1',
    session_index: sessionIndex,
    local_date: localDate,
  };
}

async function renderHub() {
  const utils = await render(<Phase1HomeScreen />);
  // Attend le fetch initial (sinon hasInitialEval reste null).
  await waitFor(() => expect(screen.queryByText(/Sessions du jour/)).toBeTruthy());
  return utils;
}

beforeEach(() => {
  jest.clearAllMocks();
  sb.reset();
  pinClockTo(THURSDAY);
  mockUser = { id: 'user-1' };
  mockCurrentPillarId = 'S1';
  mockDayInPillarWeek = 3;
  mockPillarStartedAt = `${daysAgo(2)}T08:00:00.000Z`;
  mockStreak = 19;
  mockStreakHistory = [];
  mockDevToolsEnabled = false;
  sb.setTables({ pillar_evaluations: [INITIAL_EVAL] });
});

afterEach(() => {
  unpinClock();
});

describe('rendu du jour courant', () => {
  test('J3 : jour, titre et objectif du registre, 3 sessions à faire, pas de bannière', async () => {
    await renderHub();
    expect(screen.getByText('Jour 3 sur 7')).toBeTruthy();
    expect(screen.getByText(S1.program[2].title)).toBeTruthy();
    expect(screen.getByText(S1.program[2].objective)).toBeTruthy();
    expect(screen.getByText('0 / 3 validées')).toBeTruthy();
    expect(screen.getByLabelText('Matin, à faire')).toBeTruthy();
    expect(screen.getByLabelText('Midi, à faire')).toBeTruthy();
    expect(screen.getByLabelText('Soir, à faire')).toBeTruthy();
    expect(screen.queryByText(/Journée validée/)).toBeNull();
  });

  test('tap sur la session Matin → IA-43 Session index 1', async () => {
    await renderHub();
    const user = userEvent.setup();
    await user.press(screen.getByLabelText('Matin, à faire'));
    expect(mockNavigate).toHaveBeenCalledWith('Session', { sessionIndex: 1 });
  });

  test('1 session validée → bannière « Journée validée (1 / 3 sessions). » (D6 implicite)', async () => {
    sb.setTables({
      pillar_evaluations: [INITIAL_EVAL],
      pillar_sessions: [sessionRow(1)],
    });
    await renderHub();
    await waitFor(() =>
      expect(screen.getByText(/Journée validée \(1 \/ 3 sessions\)\./)).toBeTruthy(),
    );
    expect(screen.getByLabelText('Matin, validée')).toBeTruthy();
    expect(screen.queryByText(/Tu as fait les 3\./)).toBeNull();
  });

  test('3/3 sessions → « Tu as fait les 3. »', async () => {
    sb.setTables({
      pillar_evaluations: [INITIAL_EVAL],
      pillar_sessions: [sessionRow(1), sessionRow(2), sessionRow(3)],
    });
    await renderHub();
    await waitFor(() =>
      expect(screen.getByText(/Tu as fait les 3\./)).toBeTruthy(),
    );
    expect(screen.getByText('3 / 3 validées')).toBeTruthy();
  });

  test('les sessions d hier ne comptent pas pour aujourd hui', async () => {
    sb.setTables({
      pillar_evaluations: [INITIAL_EVAL],
      pillar_sessions: [sessionRow(1, daysAgo(1))],
    });
    await renderHub();
    expect(screen.getByText('0 / 3 validées')).toBeTruthy();
    expect(screen.queryByText(/Journée validée/)).toBeNull();
  });
});

describe('éval initiale mandatoire (flow 2026-06-18)', () => {
  test('pas d éval initiale → redirect PillarOverview fromStart (présentation puis 12 questions)', async () => {
    sb.setTables({ pillar_evaluations: [] });
    await renderHub();
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('PillarOverview', {
        pillarId: 'S1',
        fromStart: true,
      }),
    );
  });

  test('régression G6 (5 sept) : tap sur une session SANS éval initiale → renvoi vers l éval, pas de session', async () => {
    // L'utilisateur a échappé au redirect du mount (quitté l'éval en route,
    // revenu au hub) : le tap session doit re-router vers le flow d'éval.
    sb.setTables({ pillar_evaluations: [] });
    await renderHub();
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('PillarOverview', {
        pillarId: 'S1',
        fromStart: true,
      }),
    );
    mockNavigate.mockClear();
    const user = userEvent.setup();
    await user.press(screen.getByLabelText('Matin, à faire'));
    expect(mockNavigate).not.toHaveBeenCalledWith('Session', {
      sessionIndex: 1,
    });
    expect(mockNavigate).toHaveBeenCalledWith('PillarOverview', {
      pillarId: 'S1',
      fromStart: true,
    });
  });
});

describe('éval finale (J7 et mode Z — D38)', () => {
  test('J7 + 1 session du jour + pas d éval finale → CTA « Faire mon évaluation finale »', async () => {
    mockDayInPillarWeek = 7;
    sb.setTables({
      pillar_evaluations: [INITIAL_EVAL],
      pillar_sessions: [sessionRow(1)],
    });
    await renderHub();
    await waitFor(() =>
      expect(screen.getByText('Faire mon évaluation finale')).toBeTruthy(),
    );
    const user = userEvent.setup();
    await user.press(screen.getByText('Faire mon évaluation finale'));
    expect(mockNavigate).toHaveBeenCalledWith('PillarEvaluation', {
      pillarId: 'S1',
      evaluationType: 'final',
    });
  });

  test('J7 SANS session du jour → pas de CTA (clarif 2026-06-18 : pas avant la pratique)', async () => {
    mockDayInPillarWeek = 7;
    await renderHub();
    expect(screen.queryByText('Faire mon évaluation finale')).toBeNull();
  });

  test('lendemain de J7 (7 jours phase_1 validés, rien aujourd hui) + finale manquante → éval finale FORCÉE', async () => {
    mockDayInPillarWeek = 7;
    // 7 entrées phase_1 dans le pilier, aucune aujourd'hui.
    mockPillarStartedAt = `${daysAgo(8)}T08:00:00.000Z`;
    mockStreakHistory = validatedRun(7, daysAgo(1), 'phase_1');
    await renderHub();
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('PillarEvaluation', {
        pillarId: 'S1',
        evaluationType: 'final',
      }),
    );
  });

  test('éval finale faite → card « Semaine S1 terminée » + « Revoir mon récap final »', async () => {
    mockDayInPillarWeek = 7;
    sb.setTables({
      pillar_evaluations: [INITIAL_EVAL, FINAL_EVAL],
      pillar_sessions: [sessionRow(1)],
    });
    await renderHub();
    await waitFor(() =>
      expect(screen.getByText('Semaine S1 terminée')).toBeTruthy(),
    );
    const user = userEvent.setup();
    await user.press(screen.getByText('Revoir mon récap final'));
    expect(mockNavigate).toHaveBeenCalledWith('PillarFinalRecap', {
      pillarId: 'S1',
    });
    // Pas de double navigation forcée (finale déjà faite).
    expect(mockNavigate).not.toHaveBeenCalledWith('PillarEvaluation', {
      pillarId: 'S1',
      evaluationType: 'final',
    });
  });
});

describe('gating DEV (posture reset V1, §2.11)', () => {
  test('hors mode DEV : aucun bouton (DEV)', async () => {
    await renderHub();
    expect(screen.queryByText(/\(DEV\)/)).toBeNull();
  });

  test('en mode DEV : bouton skip présent', async () => {
    mockDevToolsEnabled = true;
    await renderHub();
    expect(screen.getByText('(DEV) Passer au jour suivant')).toBeTruthy();
  });
});

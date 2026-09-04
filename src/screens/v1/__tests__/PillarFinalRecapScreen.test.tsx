/**
 * Tests PillarFinalRecapScreen — IA-47 récap éval finale + différentiel.
 *
 * Comble le trou de couverture relevé en salve G5 (4 sept 2026) : l'écran
 * n'était pas testé et son bouton « Continuer » passait par un Alert.alert
 * (no-op sur react-native-web) — la navigation logée dans le bouton OK de
 * l'Alert ne partait jamais en PWA.
 */

import React from 'react';
import { Alert } from 'react-native';
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

const mockMarkNarrativeSeen = jest.fn(async () => {});
let mockNarrativeFlags: Record<string, string> = {};
jest.mock('../../../hooks/ProgressContext', () => ({
  useProgress: () => ({
    streak: 7,
    markNarrativeSeen: mockMarkNarrativeSeen,
    narrativeFlags: mockNarrativeFlags,
  }),
}));

jest.mock('../../../lib/notice', () => ({ showNotice: jest.fn() }));

// Toile et écrans narratifs S8 : hors périmètre — stubs légers.
jest.mock('../../../components/toile', () => {
  const { Text } = require('react-native');
  return {
    Toile: () => <Text>STUB:Toile</Text>,
    makeMockScores: () =>
      ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'].map((pillarId) => ({
        pillarId,
        state: 'initial',
      })),
  };
});
jest.mock('../S8ExitScreen', () => {
  const { Text } = require('react-native');
  return function Stub({ visible }: { visible: boolean }) {
    return visible ? <Text>STUB:S8Exit</Text> : null;
  };
});
jest.mock('../ConsolidationIntroScreen', () => {
  const { Text } = require('react-native');
  return function Stub({ visible }: { visible: boolean }) {
    return visible ? <Text>STUB:ConsolidationIntro</Text> : null;
  };
});
jest.mock('../MentoratProposalModal', () => {
  const { Text } = require('react-native');
  return function Stub({ visible }: { visible: boolean }) {
    return visible ? <Text>STUB:MentoratProposal</Text> : null;
  };
});

const mockPopToTop = jest.fn();
const mockGoBack = jest.fn();
let mockRouteParams: Record<string, unknown> = { pillarId: 'S1' };
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    popToTop: mockPopToTop,
    goBack: mockGoBack,
    navigate: jest.fn(),
  }),
  useRoute: () => ({ params: mockRouteParams }),
}));

import PillarFinalRecapScreen from '../PillarFinalRecapScreen';
import { getPillarMeta } from '../../../data/pillar-registry';
import { showNotice } from '../../../lib/notice';

const { __supabaseMock: sb } = jest.requireMock('../../../lib/supabase') as {
  __supabaseMock: import('../../../test-utils/supabaseMock').SupabaseMock;
};

function evalRows(pillarId: string, initialNorm: number, finalNorm: number) {
  return [
    {
      user_id: 'user-1',
      pillar_id: pillarId,
      evaluation_type: 'initial',
      raw_score: 30,
      normalized_score: initialNorm,
      diagnostic_level: 2,
    },
    {
      user_id: 'user-1',
      pillar_id: pillarId,
      evaluation_type: 'final',
      raw_score: 38,
      normalized_score: finalNorm,
      diagnostic_level: 3,
    },
  ];
}

async function renderRecap() {
  const utils = await render(<PillarFinalRecapScreen />);
  await waitFor(() => expect(screen.queryByText('Chargement…')).toBeNull());
  return utils;
}

let alertSpy: jest.SpyInstance;

beforeEach(() => {
  jest.clearAllMocks();
  sb.reset();
  mockUser = { id: 'user-1' };
  mockRouteParams = { pillarId: 'S1' };
  mockNarrativeFlags = {};
  alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  alertSpy.mockRestore();
});

describe('rendu du différentiel (IA-47)', () => {
  test('progrès : +15 points, avant → après, nouveau diagnostic narratif, toile', async () => {
    sb.setTables({ pillar_evaluations: evalRows('S1', 40, 55) });
    await renderRecap();
    expect(screen.getByText(/Sept jours\./)).toBeTruthy();
    expect(screen.getByText('+15.0 points')).toBeTruthy();
    expect(screen.getByText('40 → 55')).toBeTruthy();
    expect(
      screen.getByText(getPillarMeta('S1')!.diagnostics[3].label),
    ).toBeTruthy();
    expect(screen.getByText('STUB:Toile')).toBeTruthy();
  });

  test('stable : delta dans [-1, 1] → « Stable »', async () => {
    sb.setTables({ pillar_evaluations: evalRows('S1', 50, 50.5) });
    await renderRecap();
    expect(screen.getByText('Stable')).toBeTruthy();
  });

  test('éval initiale ou finale manquante → message + Retour (goBack)', async () => {
    sb.setTables({
      pillar_evaluations: [evalRows('S1', 40, 55)[0]], // initiale seule
    });
    await renderRecap();
    expect(
      screen.getByText('Évaluation finale ou initiale introuvable.'),
    ).toBeTruthy();
    const user = userEvent.setup();
    await user.press(screen.getByText('Retour'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});

describe('« Continuer » — sortie de semaine', () => {
  test('régression G5 (4 sept) : pilier ≠ S8 → annonce via showNotice + popToTop direct, PAS d Alert', async () => {
    sb.setTables({ pillar_evaluations: evalRows('S1', 40, 55) });
    await renderRecap();
    const user = userEvent.setup();
    await user.press(screen.getByText('Continuer'));
    // L'annonce du pilier suivant passe par showNotice (visible sur web),
    // et le retour au hub est direct — plus jamais dans un callback d'Alert.
    await waitFor(() => expect(mockPopToTop).toHaveBeenCalledTimes(1));
    expect(showNotice).toHaveBeenCalledWith(
      'Pilier S1 terminé',
      expect.stringContaining('S2'),
    );
    expect(alertSpy).not.toHaveBeenCalled();
  });

  test('dernier pilier (S8) → S8ExitScreen, pas de popToTop direct', async () => {
    mockRouteParams = { pillarId: 'S8' };
    sb.setTables({ pillar_evaluations: evalRows('S8', 40, 55) });
    await renderRecap();
    const user = userEvent.setup();
    await user.press(screen.getByText('Continuer'));
    expect(screen.getByText('STUB:S8Exit')).toBeTruthy();
    expect(mockMarkNarrativeSeen).toHaveBeenCalledWith('s8_exit_screen');
    expect(mockPopToTop).not.toHaveBeenCalled();
  });
});

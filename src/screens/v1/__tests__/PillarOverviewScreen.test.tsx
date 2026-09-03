/**
 * Tests PillarOverviewScreen — IA-42 vue d'ensemble du pilier en cours.
 *
 * Couvre : header (semaine/pilier/jour), niveau d'engagement chargé depuis
 * l'éval initiale (Supabase, filtres eq), programme 7 jours avec compteurs
 * de sessions, les 3 variantes de pied de page (fromStart → Continuer vers
 * l'éval ; consultation → Retour ; mode libre post-S8 → Lancer une session),
 * et l'absence de carte niveau pour un pilier Type B (D41).
 *
 * Hooks mockés (l'écran orchestre ; ProgressContext a ses tests dédiés).
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
let mockCurrentPhase = 'phase_1';
const mockStartPillarWeek = jest.fn(async () => {});
jest.mock('../../../hooks/ProgressContext', () => ({
  useProgress: () => ({
    currentPillarId: mockCurrentPillarId,
    dayInPillarWeek: mockDayInPillarWeek,
    currentPhase: mockCurrentPhase,
    startPillarWeek: mockStartPillarWeek,
  }),
}));

const mockNavigate = jest.fn();
const mockReplace = jest.fn();
const mockGoBack = jest.fn();
let mockRouteParams: Record<string, unknown> | undefined;
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: mockNavigate,
      replace: mockReplace,
      goBack: mockGoBack,
    }),
    useRoute: () => ({ params: mockRouteParams }),
    // Hors NavigationContainer : on exécute le callback comme un effet.
    useFocusEffect: (cb: () => void) => {
      React.useEffect(() => {
        cb();
      }, [cb]);
    },
  };
});

// Vidéo intro : hors périmètre (testée côté VideoPreview) — stub léger.
jest.mock('../../../components/compositions/VideoPreview', () => {
  const { Text } = require('react-native');
  return {
    VideoPreview: () => <Text>STUB:VideoPreview</Text>,
  };
});

import PillarOverviewScreen from '../PillarOverviewScreen';
import { getPillarMeta } from '../../../data/pillar-registry';

const { __supabaseMock: sb } = jest.requireMock('../../../lib/supabase') as {
  __supabaseMock: import('../../../test-utils/supabaseMock').SupabaseMock;
};

const S1 = getPillarMeta('S1')!;

async function renderOverview() {
  const utils = await render(<PillarOverviewScreen />);
  // Attend la fin du fetch (liste programme rendue).
  await waitFor(() =>
    expect(screen.queryByText('Chargement…')).toBeNull(),
  );
  return utils;
}

beforeEach(() => {
  jest.clearAllMocks();
  sb.reset();
  mockUser = { id: 'user-1' };
  mockCurrentPillarId = 'S1';
  mockDayInPillarWeek = 3;
  mockCurrentPhase = 'phase_1';
  mockRouteParams = undefined;
});

describe('header et programme', () => {
  test('header : semaine, pilier, nom et jour courant', async () => {
    await renderOverview();
    expect(screen.getByText('Semaine 1 · Pilier S1')).toBeTruthy();
    expect(screen.getByText('Respiration')).toBeTruthy();
    expect(screen.getByText('Jour 3 sur 7')).toBeTruthy();
  });

  test('programme : les 7 jours du registre S1 sont listés', async () => {
    await renderOverview();
    for (const day of S1.program) {
      expect(screen.getByText(day.title)).toBeTruthy();
    }
  });

  test('compteur de sessions : jour partiel affiché « 2/3 »', async () => {
    sb.setTables({
      pillar_sessions: [
        { user_id: 'user-1', pillar_id: 'S1', day_in_week: 1, session_index: 1 },
        { user_id: 'user-1', pillar_id: 'S1', day_in_week: 1, session_index: 2 },
      ],
    });
    await renderOverview();
    expect(screen.getByText('2/3')).toBeTruthy();
  });
});

describe('niveau d engagement (chargé depuis l éval initiale)', () => {
  test('éval initiale progression → badge Progression, paramètre 10 min', async () => {
    sb.setTables({
      pillar_evaluations: [
        {
          user_id: 'user-1',
          pillar_id: 'S1',
          evaluation_type: 'initial',
          engagement_level_chosen: 'progression',
        },
      ],
    });
    await renderOverview();
    await waitFor(() => expect(screen.getByText('Progression')).toBeTruthy());
    expect(screen.getByText('10 min')).toBeTruthy();
  });

  test('sans éval → défaut Essentiel (5 min sur S1)', async () => {
    await renderOverview();
    expect(screen.getByText('Essentiel')).toBeTruthy();
    expect(screen.getByText('5 min')).toBeTruthy();
  });

  test('D41 — pilier Type B (S5) : pas de carte NIVEAU ACTUEL', async () => {
    mockCurrentPillarId = 'S5';
    await renderOverview();
    expect(screen.getByText('Repos et régénération')).toBeTruthy();
    expect(screen.queryByText('NIVEAU ACTUEL')).toBeNull();
  });
});

describe('pied de page — 3 variantes', () => {
  test('fromStart (entrée de semaine, flow 2026-06-18) : Continuer → PillarEvaluation initiale', async () => {
    mockRouteParams = { fromStart: true };
    await renderOverview();
    const user = userEvent.setup();
    await user.press(screen.getByText('Continuer'));
    expect(mockReplace).toHaveBeenCalledWith('PillarEvaluation', {
      pillarId: 'S1',
      evaluationType: 'initial',
    });
  });

  test('consultation depuis le hub : Retour à l accueil → goBack', async () => {
    await renderOverview();
    const user = userEvent.setup();
    expect(screen.queryByText('Continuer')).toBeNull();
    await user.press(screen.getByText("Retour à l'accueil"));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  test('mode libre post-S8 (pillarId en param) : Lancer une session → Session du pilier choisi', async () => {
    mockCurrentPhase = 'post_s8';
    mockRouteParams = { pillarId: 'S3' };
    await renderOverview();
    expect(screen.getByText('Alimentation')).toBeTruthy();
    // Mode libre : jour affiché = 1 (pas de progression de semaine).
    expect(screen.getByText('Jour 1 sur 7')).toBeTruthy();
    const user = userEvent.setup();
    await user.press(screen.getByText('Lancer une session'));
    expect(mockNavigate).toHaveBeenCalledWith('Session', {
      sessionIndex: 1,
      pillarId: 'S3',
    });
  });
});

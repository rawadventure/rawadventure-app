/**
 * Test de navigation RÉELLE du récap d'éval initiale (IA-41) — reproduction
 * du blocage salve S1 du 7 sept 2026 : « Continuer » du récap laissait
 * l'utilisateur coincé sur « Ton diagnostic respiration » en PWA.
 *
 * Contrairement à PillarRecapScreen.test.tsx (navigation mockée), ce test
 * monte le VRAI HomeStack dans un NavigationContainer avec l'état initial
 * HomeV1 → PillarRecap, presse « Continuer », et vérifie qu'on atterrit
 * bien sur le hub Phase 1.
 */

import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
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

let mockUser: { id: string } | null = null;
jest.mock('../../../hooks/AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
}));

jest.mock('../../../lib/notice', () => ({ showNotice: jest.fn() }));

import HomeStack from '../../../navigation/HomeStack';
import { ProgressProvider, useProgress } from '../../../hooks/ProgressContext';
import { SubscriptionProvider } from '../../../hooks/SubscriptionContext';
import {
  pinClockTo,
  seedAnonymousStorage,
  today,
  unpinClock,
  validatedRun,
} from '../../../test-utils/harness';

const { __supabaseMock: sb } = jest.requireMock('../../../lib/supabase') as {
  __supabaseMock: import('../../../test-utils/supabaseMock').SupabaseMock;
};

const THURSDAY = '2026-10-15';

const EVAL_ROW = {
  user_id: 'user-1',
  pillar_id: 'S1',
  evaluation_type: 'initial',
  raw_score: 36,
  normalized_score: 50,
  diagnostic_level: 3,
  engagement_level_recommended: 'progression',
  engagement_level_chosen: 'progression',
  responses: [],
};

function Gated({ children }: { children: React.ReactNode }) {
  const { loading } = useProgress();
  if (loading) return null;
  return <>{children}</>;
}

function Probe() {
  const { currentDay, currentPhase, currentPillarId } = useProgress();
  const { Text } = require('react-native');
  return (
    <Text>{`probe:${currentDay}:${currentPhase}:${currentPillarId ?? 'none'}`}</Text>
  );
}

async function renderStackOnRecap() {
  const utils = await render(
    <ProgressProvider>
      <SubscriptionProvider>
        <Gated>
          <NavigationContainer
            initialState={{
              routes: [
                { name: 'HomeV1' },
                { name: 'PillarRecap', params: { pillarId: 'S1' } },
              ],
              index: 1,
            }}
          >
            <HomeStack />
          </NavigationContainer>
          <Probe />
        </Gated>
      </SubscriptionProvider>
    </ProgressProvider>,
  );
  await waitFor(() =>
    expect(screen.getByText(/Ton diagnostic/)).toBeTruthy(),
  );
  return utils;
}

beforeEach(async () => {
  mockUser = { id: 'user-1' };
  sb.reset();
  jest.clearAllMocks();
  await AsyncStorage.clear();
  pinClockTo(THURSDAY);
  // Utilisateur CONNECTÉ (flow réel +demo4) : l'état de parcours vit côté
  // Supabase — position jour 17 (16 jours validés en phase_0, y compris
  // J15/J16 : currentPhase ne passe à phase_1 qu'au 17e jour) + abonnement
  // actif + éval initiale S1 enregistrée.
  sb.setTables({
    profiles: {
      id: 'user-1',
      onboarding_done: true,
      onboarding_data: {},
      profile_dynamic_id: 'p1',
      account_created_at: '2026-09-29T08:00:00.000Z',
    },
    streak_history: validatedRun(16).map((e) => ({ user_id: 'user-1', ...e })),
    pillar_evaluations: [EVAL_ROW],
    subscriptions: [
      {
        user_id: 'user-1',
        status: 'active',
        plan: 'monthly',
        started_at: '2026-10-15T08:00:00.000Z',
        renews_at: '2026-11-15T08:00:00.000Z',
        cancelled_at: null,
      },
    ],
  });
  // Pilier en cours + flags narratifs : local-only même en mode connecté.
  await seedAnonymousStorage({
    currentPillarId: 'S1',
    pillarStartedAt: `${today()}T08:00:00.000Z`,
    narrativeFlags: {
      welcome_video: '2026-10-01T08:00:00.000Z',
      notif_permission_prompted: '2026-10-01T08:00:00.000Z',
      s0_1_screen: '2026-10-01T08:00:00.000Z',
      s0_2_screen: '2026-10-01T08:00:00.000Z',
    },
  });
});

afterEach(() => {
  unpinClock();
});

describe('récap éval initiale — navigation réelle (régression salve S1, 7 sept)', () => {
  test('« Continuer » quitte le récap et atterrit sur le hub Phase 1', async () => {
    await renderStackOnRecap();
    const user = userEvent.setup();
    await user.press(screen.getByText('Continuer'));
    // On doit quitter le récap…
    await waitFor(() =>
      expect(screen.queryByText(/Ton diagnostic/)).toBeNull(),
    );
    // …et retomber sur le hub Phase 1 (jour 1 du pilier S1).
    await waitFor(() =>
      expect(screen.getByText(/Jour 1 sur 7/)).toBeTruthy(),
    );
  });
});

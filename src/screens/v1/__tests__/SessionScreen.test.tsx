/**
 * Tests SessionScreen — IA-43 session de pratique Phase 1, rendu avec le
 * VRAI ProgressProvider en mode connecté (Supabase mocké, filtres eq).
 *
 * Couvre : les 3 types de session (acte_libre / coherence_cardiaque /
 * chrono_libre), la validation du jour à la 1re session (D6 : 1/3 minimum),
 * le gate anti double-validation (D27), le niveau adaptatif par session
 * (IA-44, D31 — modulation sans changer le niveau d'entrée, plafonnée),
 * le timer (duration_seconds), la cascade paliers dont le palier différé
 * (D30), et le mode libre post-S8.
 */

import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Text } from 'react-native';
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

const mockPopToTop = jest.fn();
const mockGoBack = jest.fn();
let mockRouteParams: Record<string, unknown> = { sessionIndex: 1 };
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    popToTop: mockPopToTop,
    goBack: mockGoBack,
    navigate: jest.fn(),
  }),
  useRoute: () => ({ params: mockRouteParams }),
}));

import SessionScreen from '../SessionScreen';
import { ProgressProvider, useProgress } from '../../../hooks/ProgressContext';
import {
  daysAgo,
  entry,
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
const NARRATIVES_SEEN = {
  welcome_video: '2026-10-01T08:00:00.000Z',
  s0_1_screen: '2026-10-01T08:00:00.000Z',
  s0_2_screen: '2026-10-01T08:00:00.000Z',
};

/** Sonde : historique streak + phase, pour asserter les validations. */
function Probe() {
  const { streakHistory, streak } = useProgress();
  const last = streakHistory[streakHistory.length - 1];
  return (
    <>
      <Text>{`probe:count:${streakHistory.length}`}</Text>
      <Text>{`probe:streak:${streak}`}</Text>
      <Text>{`probe:lastPhase:${last?.phase ?? 'none'}`}</Text>
    </>
  );
}

function Gated({ children }: { children: React.ReactNode }) {
  const { loading } = useProgress();
  if (loading) return null;
  return <>{children}</>;
}

/**
 * Seed connecté Phase 1 : profil distant + historique streak distant +
 * pilier en cours (local-only même en connecté) + éval initiale du pilier.
 */
async function seedPhase1(opts: {
  pillarId?: string;
  validatedDays?: number;
  engagement?: 'essentiel' | 'progression' | 'immersion';
  extraHistory?: ReturnType<typeof entry>[];
} = {}) {
  const pillarId = opts.pillarId ?? 'S1';
  const validatedDays = opts.validatedDays ?? 16;
  mockUser = { id: 'user-1' };
  const history = [
    ...validatedRun(validatedDays, daysAgo(1)),
    ...(opts.extraHistory ?? []),
  ];
  sb.setTables({
    profiles: {
      id: 'user-1',
      onboarding_done: true,
      account_created_at: '2026-09-20T08:00:00.000Z',
    },
    streak_history: history,
    pillar_evaluations: [
      {
        user_id: 'user-1',
        pillar_id: pillarId,
        evaluation_type: 'initial',
        engagement_level_chosen: opts.engagement ?? 'essentiel',
      },
    ],
  });
  // currentPillarId / pillarStartedAt / narrativeFlags : local-only V1.
  await seedAnonymousStorage({
    currentPillarId: pillarId,
    pillarStartedAt: '2026-10-15T08:00:00.000Z',
    narrativeFlags: NARRATIVES_SEEN,
  });
}

async function renderSession() {
  const utils = await render(
    <ProgressProvider>
      <Gated>
        <SessionScreen />
        <Probe />
      </Gated>
    </ProgressProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Chargement…')).toBeNull());
  await waitFor(() => expect(screen.queryByText(/probe:count/)).toBeTruthy());
  return utils;
}

let alertSpy: jest.SpyInstance;

function pressAlertButton(label: string) {
  const lastCall = alertSpy.mock.calls[alertSpy.mock.calls.length - 1];
  const buttons = lastCall?.[2] as
    | Array<{ text: string; onPress?: () => void }>
    | undefined;
  const btn = buttons?.find((b) => b.text === label);
  expect(btn).toBeDefined();
  btn!.onPress?.();
}

beforeEach(async () => {
  mockUser = null;
  sb.reset();
  jest.clearAllMocks();
  await AsyncStorage.clear();
  pinClockTo(THURSDAY);
  mockRouteParams = { sessionIndex: 1 };
  alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  unpinClock();
  alertSpy.mockRestore();
});

describe('acte_libre (S3) — validation du jour', () => {
  test('« C\'est fait » → upsert pillar_sessions + validation phase_1 (D6 : 1 session suffit) + Alert → popToTop', async () => {
    await seedPhase1({ pillarId: 'S3' });
    await renderSession();
    expect(screen.getByText(/PILIER S3/)).toBeTruthy();

    const user = userEvent.setup();
    await user.press(screen.getByText("C'est fait"));

    // Session persistée.
    await waitFor(() => {
      const upserts = sb.calls.filter(
        (c) => c.table === 'pillar_sessions' && c.op === 'upsert',
      );
      expect(upserts).toHaveLength(1);
      expect(upserts[0].payload).toMatchObject({
        user_id: 'user-1',
        pillar_id: 'S3',
        day_in_week: 1,
        session_index: 1,
        duration_seconds: 0,
      });
    });
    // Jour validé en phase_1 : 16 entrées + celle du jour.
    await waitFor(() =>
      expect(screen.getByText('probe:count:17')).toBeTruthy(),
    );
    expect(screen.getByText('probe:lastPhase:phase_1')).toBeTruthy();
    expect(screen.getByText('probe:streak:17')).toBeTruthy();
    // Alert de fin de session, OK → retour hub.
    expect(alertSpy).toHaveBeenCalledWith(
      'Session validée',
      expect.any(String),
      expect.any(Array),
    );
    pressAlertButton('OK');
    expect(mockPopToTop).toHaveBeenCalledTimes(1);
  });

  test('D27 — jour déjà validé : une 2e session ne revalide pas (pas de double entrée)', async () => {
    await seedPhase1({
      pillarId: 'S3',
      extraHistory: [entry(today(), 17, { phase: 'phase_1' })],
    });
    await renderSession();
    expect(screen.getByText('probe:count:17')).toBeTruthy();

    const user = userEvent.setup();
    await user.press(screen.getByText("C'est fait"));
    await waitFor(() =>
      expect(
        sb.calls.filter((c) => c.table === 'pillar_sessions'),
      ).toHaveLength(1),
    );
    // Historique inchangé — la session compte, le jour ne se revalide pas.
    expect(screen.getByText('probe:count:17')).toBeTruthy();
    expect(alertSpy).toHaveBeenCalledWith(
      'Session validée',
      expect.any(String),
      expect.any(Array),
    );
  });

  test('acte_libre : pas de bouton niveau adaptatif (pas de dose à moduler)', async () => {
    await seedPhase1({ pillarId: 'S3' });
    await renderSession();
    expect(
      screen.queryByLabelText('Modifier le niveau adaptatif de cette session'),
    ).toBeNull();
  });
});

describe('coherence_cardiaque (S1) — engagement et niveau adaptatif IA-44', () => {
  test('engagement progression chargé depuis l éval → « Lancer (10 min) »', async () => {
    await seedPhase1({ pillarId: 'S1', engagement: 'progression' });
    await renderSession();
    expect(screen.getByText('Lancer (10 min)')).toBeTruthy();
    expect(screen.getByText('Niveau session · Progression ')).toBeTruthy();
  });

  test('modale IA-44 : « Plus » → session intensifiée (20 min) + insert level_adaptive_choices, niveau d entrée inchangé (D31)', async () => {
    await seedPhase1({ pillarId: 'S1', engagement: 'progression' });
    await renderSession();
    const user = userEvent.setup();
    await user.press(
      screen.getByLabelText('Modifier le niveau adaptatif de cette session'),
    );
    await user.press(screen.getByLabelText('Plus'));
    await user.press(screen.getByText('Valider'));
    // Modulation appliquée à CETTE session.
    expect(screen.getByText('Lancer (20 min)')).toBeTruthy();
    expect(
      screen.getByText('Niveau session · Immersion (intensifié)'),
    ).toBeTruthy();
    // Choix tracé en base (matière pour la suggestion contextuelle D31).
    const inserts = sb.calls.filter(
      (c) => c.table === 'level_adaptive_choices' && c.op === 'insert',
    );
    expect(inserts).toHaveLength(1);
    expect(inserts[0].payload).toMatchObject({
      pillar_id: 'S1',
      choice: 'more',
    });
    // Le niveau d'entrée n'est PAS réécrit (aucun upsert pillar_evaluations).
    expect(
      sb.calls.filter((c) => c.table === 'pillar_evaluations' && c.op === 'upsert'),
    ).toHaveLength(0);
  });

  test('plafond : engagement immersion + « Plus » → reste Immersion (20 min)', async () => {
    await seedPhase1({ pillarId: 'S1', engagement: 'immersion' });
    await renderSession();
    const user = userEvent.setup();
    await user.press(
      screen.getByLabelText('Modifier le niveau adaptatif de cette session'),
    );
    await user.press(screen.getByLabelText('Plus'));
    await user.press(screen.getByText('Valider'));
    expect(screen.getByText('Lancer (20 min)')).toBeTruthy();
  });

  test('« Marquer comme faite » → session enregistrée avec duration_seconds 0', async () => {
    await seedPhase1({ pillarId: 'S1' });
    await renderSession();
    const user = userEvent.setup();
    await user.press(screen.getByText('Marquer comme faite'));
    await waitFor(() => {
      const upserts = sb.calls.filter((c) => c.table === 'pillar_sessions');
      expect(upserts).toHaveLength(1);
      expect(
        (upserts[0].payload as Record<string, unknown>).duration_seconds,
      ).toBe(0);
    });
  });
});

describe('paliers (D29/D30)', () => {
  test('la validation qui atteint 15 jours → modale palier plein écran (pas d Alert)', async () => {
    await seedPhase1({ pillarId: 'S3', validatedDays: 14 });
    await renderSession();
    const user = userEvent.setup();
    await user.press(screen.getByText("C'est fait"));
    await waitFor(() => expect(screen.getByText('Quinze jours.')).toBeTruthy());
    expect(screen.getByText('Palier atteint')).toBeTruthy();
    // Pas d'Alert simple quand un palier prime.
    expect(alertSpy).not.toHaveBeenCalledWith(
      'Session validée',
      expect.any(String),
      expect.any(Array),
    );
    // Fermer → retour hub.
    await user.press(screen.getByText('Continuer'));
    expect(mockPopToTop).toHaveBeenCalledTimes(1);
  });

  test('D30 — palier différé en attente : joué à la validation suivante puis consommé', async () => {
    await seedPhase1({ pillarId: 'S3', validatedDays: 16 });
    await AsyncStorage.setItem(
      'pending_tier_reach',
      JSON.stringify({ tierId: 15, isFirstReach: true, streakValue: 15 }),
    );
    await renderSession();
    const user = userEvent.setup();
    await user.press(screen.getByText("C'est fait"));
    await waitFor(() => expect(screen.getByText('Quinze jours.')).toBeTruthy());
    expect(await AsyncStorage.getItem('pending_tier_reach')).toBeNull();
  });
});

describe('mode libre post-S8', () => {
  test('pillarId en param + phase post_s8 → session du pilier choisi, validation en phase post_s8, jour forcé à 1', async () => {
    await seedPhase1({ pillarId: 'S8', validatedDays: 72 });
    // S8 final complété → currentPhase post_s8.
    const tables = {
      profiles: {
        id: 'user-1',
        onboarding_done: true,
        account_created_at: '2026-08-01T08:00:00.000Z',
      },
      streak_history: validatedRun(72, daysAgo(1)),
      pillar_evaluations: [
        {
          user_id: 'user-1',
          pillar_id: 'S8',
          evaluation_type: 'final',
          engagement_level_chosen: 'progression',
        },
      ],
    };
    sb.setTables(tables);
    mockRouteParams = { sessionIndex: 2, pillarId: 'S3' };
    await renderSession();
    expect(screen.getByText('PILIER S3 · JOUR 1 SUR 7')).toBeTruthy();
    const user = userEvent.setup();
    await user.press(screen.getByText("C'est fait"));
    await waitFor(() =>
      expect(screen.getByText('probe:lastPhase:post_s8')).toBeTruthy(),
    );
    const upsert = sb.calls.find((c) => c.table === 'pillar_sessions');
    expect(upsert?.payload).toMatchObject({
      pillar_id: 'S3',
      day_in_week: 1,
      session_index: 2,
    });
  });
});

describe('timer (chrono_libre S2)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test('Lancer → 3 s écoulées → Terminer maintenant → duration_seconds 3', async () => {
    await seedPhase1({ pillarId: 'S2', engagement: 'essentiel' });
    await renderSession();
    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });
    await user.press(screen.getByText('Lancer le chrono (30 min)'));
    const { act } = require('@testing-library/react-native');
    await act(async () => {
      await jest.advanceTimersByTimeAsync(3000);
    });
    await user.press(screen.getByText('Terminer maintenant'));
    await waitFor(() => {
      const upserts = sb.calls.filter((c) => c.table === 'pillar_sessions');
      expect(upserts).toHaveLength(1);
      expect(
        (upserts[0].payload as Record<string, unknown>).duration_seconds,
      ).toBe(3);
    });
  });
});

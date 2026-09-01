/**
 * Tests de flow HomeScreenV1 — IA-11 hub quotidien Phase 0, rendu avec les
 * VRAIS providers (ProgressProvider + SubscriptionProvider, Supabase mocké,
 * mode anonyme AsyncStorage).
 *
 * Couvre le parcours utilisateur réel : cocher des actions → IA-15 →
 * validation → bannière/streak, soft-rappel D26, charnière J3 (D19/D38),
 * vidéo de bienvenue J1, D27 (journée figée), collision palier×S0.1 (D30),
 * CTA paywall fin de Phase 0.
 */

import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  render,
  screen,
  userEvent,
  waitFor,
} from '@testing-library/react-native';

// ── Mocks (hoistés) ──────────────────────────────────────────────────────────

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

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
    addListener: jest.fn(() => jest.fn()),
  }),
}));

// Écrans lourds hors du périmètre de ce fichier — stubs légers.
jest.mock('../Phase1HomeScreen', () => {
  const { Text } = require('react-native');
  const React = require('react');
  return { __esModule: true, default: () => React.createElement(Text, null, 'PHASE1_HOME_STUB') };
});
jest.mock('../ConsolidationHomeScreen', () => {
  const { Text } = require('react-native');
  const React = require('react');
  return { __esModule: true, default: () => React.createElement(Text, null, 'CONSOLIDATION_STUB') };
});

import HomeScreenV1 from '../HomeScreenV1';
import { ProgressProvider, useProgress } from '../../../hooks/ProgressContext';
import { SubscriptionProvider } from '../../../hooks/SubscriptionContext';
import { showNotice } from '../../../lib/notice';
import {
  pinClockTo,
  seedAnonymousStorage,
  unpinClock,
  validatedRun,
} from '../../../test-utils/harness';

const { __supabaseMock: sb } = jest.requireMock('../../../lib/supabase') as {
  __supabaseMock: import('../../../test-utils/supabaseMock').SupabaseMock;
};

const THURSDAY = '2026-10-15';

// Flags posés pour ne pas superposer la vidéo J1 sur les tests de jours > 1.
const WELCOME_SEEN = {
  welcome_video: '2026-10-01T08:00:00.000Z',
  notif_permission_prompted: '2026-10-01T08:00:00.000Z',
};

/**
 * Reproduit le gating du RootNavigator réel : le hub ne monte qu'une fois
 * ProgressContext chargé (loading=false). Sans ce gate, le hub monterait
 * avec narrativeFlags={} et déclencherait à tort la vidéo J1 — écrasant les
 * flags seedés (comportement impossible en prod, LoadingScreen fait écran).
 */
function GatedHome() {
  const { loading } = useProgress();
  if (loading) return null;
  return <HomeScreenV1 />;
}

async function renderHome() {
  const utils = await render(
    <ProgressProvider>
      <SubscriptionProvider>
        <GatedHome />
      </SubscriptionProvider>
    </ProgressProvider>,
  );
  // Attend la fin du chargement providers + checks du jour.
  await waitFor(() => expect(screen.queryByText(/Actions du jour/)).toBeTruthy());
  return utils;
}

/** Coche `n` actions via les checkboxes accessibles. */
async function checkActions(n: number) {
  const user = userEvent.setup();
  const boxes = screen.getAllByRole('checkbox');
  for (let i = 0; i < n; i++) {
    await user.press(boxes[i]);
  }
  return user;
}

beforeEach(async () => {
  mockUser = null;
  sb.reset();
  jest.clearAllMocks();
  await AsyncStorage.clear();
  pinClockTo(THURSDAY);
});

afterEach(() => {
  unpinClock();
});

describe('rendu du hub — Jour X sur 14, message du jour, 7 actions', () => {
  test('J5 : libellé de jour, message J5, 7 actions listées, bouton désactivé à 0 coche', async () => {
    await seedAnonymousStorage({
      history: validatedRun(4),
      narrativeFlags: WELCOME_SEEN,
    });
    await renderHome();

    expect(screen.getByText('Jour 5 sur 14')).toBeTruthy();
    expect(screen.getByText(/Mi-parcours de la première semaine/)).toBeTruthy();
    expect(screen.getAllByRole('checkbox')).toHaveLength(7);
    expect(screen.getByText('Activation matinale')).toBeTruthy();
    expect(screen.getByText('Défi froid')).toBeTruthy();
    expect(screen.getByText('0 / 7 cochées')).toBeTruthy();
    // Bouton validation présent mais désactivé sans coche.
    const btn = screen.getByText('Valider ma journée');
    expect(btn).toBeTruthy();
  });

  test('cocher des actions met le compteur à jour', async () => {
    await seedAnonymousStorage({
      history: validatedRun(4),
      narrativeFlags: WELCOME_SEEN,
    });
    await renderHome();
    await checkActions(3);
    expect(screen.getByText('3 / 7 cochées')).toBeTruthy();
  });

  test('les coches persistent en AsyncStorage par date locale', async () => {
    await seedAnonymousStorage({
      history: validatedRun(4),
      narrativeFlags: WELCOME_SEEN,
    });
    await renderHome();
    await checkActions(2);
    await waitFor(async () => {
      const raw = await AsyncStorage.getItem(`daily_check_actions.${THURSDAY}`);
      expect(raw).not.toBeNull();
      expect(Object.values(JSON.parse(raw!)).filter(Boolean)).toHaveLength(2);
    });
  });
});

describe('validation cas A (≥ 5/7) — flow complet IA-15', () => {
  test('5 coches → modale confirmation → validation → bannière + streak +1 (D27 : journée figée)', async () => {
    await seedAnonymousStorage({
      history: validatedRun(4),
      narrativeFlags: {
        ...WELCOME_SEEN,
        j3_charniere: '2026-10-05T08:00:00.000Z',
      },
    });
    await renderHome();
    const user = await checkActions(5);

    await user.press(screen.getByText('Valider ma journée'));
    // IA-15 variante au-dessus du seuil.
    expect(screen.getByText('Journée validée.')).toBeTruthy();
    expect(screen.getByText('5 actions sur 7. Le corps enregistre.')).toBeTruthy();

    // Le bouton de la modale porte le même libellé que celui du hub —
    // on prend le dernier rendu (celui de la modale).
    const validateButtons = screen.getAllByText('Valider ma journée');
    await user.press(validateButtons[validateButtons.length - 1]);

    // Post-validation : bannière + streak 5, journée figée (D27).
    await waitFor(() => expect(screen.getByText('Journée validée')).toBeTruthy());
    expect(screen.getByText(/Streak 5 jours/)).toBeTruthy();
    expect(screen.queryByText('Valider ma journée')).toBeNull();
    // Coches remises à zéro et checkboxes désactivées.
    expect(screen.getByText('0 / 7 cochées')).toBeTruthy();
  });
});

describe('validation sous le seuil — soft-rappel D26', () => {
  test('2 coches → "Tu peux faire mieux." → Valider quand même → joker consommé, notice', async () => {
    await seedAnonymousStorage({
      history: validatedRun(4),
      narrativeFlags: {
        ...WELCOME_SEEN,
        j3_charniere: '2026-10-05T08:00:00.000Z',
      },
    });
    await renderHome();
    const user = await checkActions(2);

    await user.press(screen.getByText('Valider ma journée'));
    expect(screen.getByText('Tu peux faire mieux.')).toBeTruthy();
    expect(screen.getByText("Cocher d'autres actions")).toBeTruthy();

    await user.press(screen.getByText('Valider quand même'));
    await waitFor(() => expect(screen.getByText('Journée validée')).toBeTruthy());
    // Streak conservé (4), pas incrémenté — cas B.
    expect(screen.getByText(/Streak 4 jours/)).toBeTruthy();
    expect(showNotice).toHaveBeenCalledWith(
      'Joker consommé',
      expect.stringContaining('Streak conservé à 4'),
    );
  });

  test('"Cocher d autres actions" referme la modale sans valider', async () => {
    await seedAnonymousStorage({
      history: validatedRun(4),
      narrativeFlags: WELCOME_SEEN,
    });
    await renderHome();
    const user = await checkActions(2);
    await user.press(screen.getByText('Valider ma journée'));
    await user.press(screen.getByText("Cocher d'autres actions"));
    await waitFor(() =>
      expect(screen.queryByText('Tu peux faire mieux.')).toBeNull(),
    );
    // Toujours pas validé : bouton du hub encore là, compteur intact.
    expect(screen.getByText('Valider ma journée')).toBeTruthy();
    expect(screen.getByText('2 / 7 cochées')).toBeTruthy();
  });
});

describe('charnière J3 (D19/D38 — à la validation du jour de position)', () => {
  test('valider le jour 3 ouvre la charnière J3 et pose le flag', async () => {
    await seedAnonymousStorage({
      history: validatedRun(2),
      narrativeFlags: WELCOME_SEEN,
    });
    await renderHome();
    expect(screen.getByText('Jour 3 sur 14')).toBeTruthy();
    const user = await checkActions(5);
    await user.press(screen.getByText('Valider ma journée'));
    const validateButtons = screen.getAllByText('Valider ma journée');
    await user.press(validateButtons[validateButtons.length - 1]);

    await waitFor(() =>
      expect(screen.getByText(/Le corps commence/)).toBeTruthy(),
    );
    const raw = await AsyncStorage.getItem('narrative_flags');
    expect(JSON.parse(raw!).j3_charniere).toBeDefined();
  });

  test('charnière déjà vue : pas de re-déclenchement (un écran narratif ne se joue qu une fois)', async () => {
    await seedAnonymousStorage({
      history: validatedRun(2),
      narrativeFlags: {
        ...WELCOME_SEEN,
        j3_charniere: '2026-10-05T08:00:00.000Z',
      },
    });
    await renderHome();
    // Attend le chargement complet du provider (jour affiché) avant
    // d'interagir — sinon la validation part avec des flags pas encore lus.
    await waitFor(() => expect(screen.getByText('Jour 3 sur 14')).toBeTruthy());
    const user = await checkActions(5);
    await user.press(screen.getByText('Valider ma journée'));
    const validateButtons = screen.getAllByText('Valider ma journée');
    await user.press(validateButtons[validateButtons.length - 1]);
    await waitFor(() => expect(screen.getByText('Journée validée')).toBeTruthy());
    expect(screen.queryByText(/Le corps commence/)).toBeNull();
  });
});

describe('vidéo de bienvenue J1 (IA-12)', () => {
  test('premier lancement : overlay vidéo affiché et flag posé', async () => {
    await seedAnonymousStorage({ history: [] });
    await render(
      <ProgressProvider>
        <SubscriptionProvider>
          <GatedHome />
        </SubscriptionProvider>
      </ProgressProvider>,
    );
    await waitFor(async () => {
      const raw = await AsyncStorage.getItem('narrative_flags');
      expect(raw).not.toBeNull();
      expect(JSON.parse(raw!).welcome_video).toBeDefined();
    });
  });

  test('flag déjà posé : pas d overlay vidéo', async () => {
    await seedAnonymousStorage({
      history: [],
      narrativeFlags: WELCOME_SEEN,
    });
    await renderHome();
    expect(screen.getByText('Jour 1 sur 14')).toBeTruthy();
  });
});

describe('collision palier 15j × S0.1 (D30)', () => {
  test('J15 : S0.1 s ouvre au lancement (flag posé) ; la validation diffère le palier 15', async () => {
    await seedAnonymousStorage({
      history: validatedRun(14),
      narrativeFlags: {
        ...WELCOME_SEEN,
        j3_charniere: 'x',
        j7_charniere: 'x',
        j11_charniere: 'x',
        j14_charniere: 'x',
      },
    });
    await renderHome();
    // S0.1 (IA-20) se superpose au premier lancement du 15e jour de position.
    await waitFor(() =>
      expect(screen.getByText(/Quatorze jours/)).toBeTruthy(),
    );
    const rawFlags = await AsyncStorage.getItem('narrative_flags');
    expect(JSON.parse(rawFlags!).s0_1_screen).toBeDefined();

    // Validation du jour (streak 14 → 15) : collision narrative D30 —
    // le palier 15 est différé, pas affiché par-dessus S0.1.
    const user = await checkActions(5);
    const hubValidate = screen.getAllByText('Valider ma journée')[0];
    await user.press(hubValidate);
    const validateButtons = screen.getAllByText('Valider ma journée');
    await user.press(validateButtons[validateButtons.length - 1]);

    await waitFor(async () => {
      const raw = await AsyncStorage.getItem('pending_tier_reach');
      expect(raw).not.toBeNull();
      expect(JSON.parse(raw!).tierId).toBe(15);
    });
  });
});

describe('CTA paywall fin de Phase 0 (J14-J16, non abonné)', () => {
  test('J14 : bouton "Découvrir l abonnement" présent → navigate Paywall', async () => {
    await seedAnonymousStorage({
      history: validatedRun(13),
      narrativeFlags: WELCOME_SEEN,
    });
    await renderHome();
    expect(screen.getByText('Jour 14 sur 14')).toBeTruthy();
    const user = userEvent.setup();
    await user.press(screen.getByText("Découvrir l'abonnement"));
    expect(mockNavigate).toHaveBeenCalledWith('Paywall');
  });

  test('J5 : pas de CTA abonnement', async () => {
    await seedAnonymousStorage({
      history: validatedRun(4),
      narrativeFlags: WELCOME_SEEN,
    });
    await renderHome();
    expect(screen.queryByText("Découvrir l'abonnement")).toBeNull();
  });
});

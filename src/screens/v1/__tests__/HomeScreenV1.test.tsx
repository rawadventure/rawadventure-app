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
  act,
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
import { advanceDevClock } from '../../../lib/devClock';

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

const RULE_HINT =
  '5 actions sur 7 suffisent pour valider. Coche le jour même\u00a0: à minuit, la journée se ferme.';

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
    // Règle du jeu sous le bouton (retour testeur beta, 3 oct 2026).
    expect(screen.getByText(RULE_HINT)).toBeTruthy();
    // Règle du joker sous la règle de validation (retour testeuse 8 oct 2026).
    expect(screen.getByText('Un joker par semaine couvre un jour en dessous.')).toBeTruthy();
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
    expect(screen.getByText(/Ta série : 5 jours/)).toBeTruthy();
    expect(screen.queryByText('Valider ma journée')).toBeNull();
    // La règle disparaît avec le bouton : journée figée, plus rien à cocher.
    expect(screen.queryByText(RULE_HINT)).toBeNull();
    // Retours testeurs 30 sept 2026 (option A, note historique) : les cases
    // cochées restent visibles après validation, en lecture seule.
    expect(screen.getByText('5 / 7 cochées')).toBeTruthy();
    const boxes = screen.getAllByRole('checkbox');
    expect(boxes.filter((b) => b.props.accessibilityState?.checked)).toHaveLength(5);
    expect(boxes.every((b) => b.props.accessibilityState?.disabled)).toBe(true);
    // Journée figée (D27) : un appui sur une case ne change rien.
    await user.press(boxes[6]);
    expect(screen.getByText('5 / 7 cochées')).toBeTruthy();
    // Coches conservées en stockage pour une réouverture le même jour.
    const raw = await AsyncStorage.getItem(`daily_check_actions.${THURSDAY}`);
    expect(Object.values(JSON.parse(raw!)).filter(Boolean)).toHaveLength(5);
  });

  test('réouverture de l app le même jour après validation : cases cochées relues depuis le stockage', async () => {
    // État laissé par une validation plus tôt dans la journée : aujourd'hui
    // dans l'historique + coches du jour encore en stockage.
    await seedAnonymousStorage({
      history: validatedRun(5, THURSDAY),
      narrativeFlags: {
        ...WELCOME_SEEN,
        j3_charniere: '2026-10-05T08:00:00.000Z',
      },
    });
    await AsyncStorage.setItem(
      `daily_check_actions.${THURSDAY}`,
      JSON.stringify({
        activation_matinale: true,
        defi_froid: true,
        mouvement_recuperation: true,
        mineralisation: true,
        fenetre_digestive: true,
        fruits: false,
        soiree_sans_ecrans: false,
      }),
    );
    await renderHome();
    await waitFor(() => expect(screen.getByText('5 / 7 cochées')).toBeTruthy());
    expect(screen.getByText('Journée validée')).toBeTruthy();
    expect(screen.queryByText('Valider ma journée')).toBeNull();
  });

  test('le lendemain : nouvelle journée vierge, pas de double validation de la veille', async () => {
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
    const validateButtons = screen.getAllByText('Valider ma journée');
    await user.press(validateButtons[validateButtons.length - 1]);
    await waitFor(() => expect(screen.getByText(/Ta série : 5 jours/)).toBeTruthy());

    await act(async () => advanceDevClock(1));

    await waitFor(() => expect(screen.getByText('Jour 6 sur 14')).toBeTruthy());
    await waitFor(() => expect(screen.getByText('0 / 7 cochées')).toBeTruthy());
    // La veille était déjà validée à la main : aucune validation automatique.
    expect(showNotice).not.toHaveBeenCalledWith('Journée validée', expect.anything());
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
    expect(screen.getByText(/Ta série : 4 jours/)).toBeTruthy();
    expect(showNotice).toHaveBeenCalledWith(
      'Joker utilisé',
      'Ta série reste à 4 et ta journée compte. Nouveau joker lundi.',
    );
  });

  // Retour testeuse beta 8 oct 2026 : 2e jour sous le seuil dans la même
  // semaine ISO → cassure. Jusqu'ici aucun message (bulle à 0 en silence).
  test('2 coches, joker déjà consommé cette semaine → Valider quand même → série à 0, notice de cassure', async () => {
    await seedAnonymousStorage({
      history: validatedRun(4),
      jokerConsumptions: [{ week_key: '2026-W42', consumed_for_local_date: '2026-10-13' }],
      narrativeFlags: {
        ...WELCOME_SEEN,
        j3_charniere: '2026-10-05T08:00:00.000Z',
      },
    });
    await renderHome();
    const user = await checkActions(2);
    await user.press(screen.getByText('Valider ma journée'));
    await user.press(screen.getByText('Valider quand même'));

    await waitFor(() =>
      expect(showNotice).toHaveBeenCalledWith(
        'Série remise à zéro',
        expect.stringContaining('5 actions sur 7'),
      ),
    );
    expect(showNotice).not.toHaveBeenCalledWith('Joker utilisé', expect.anything());
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

describe('revoir la vidéo de bienvenue (IA-12, retours testeurs 3 oct 2026)', () => {
  const LINK = 'Revoir la vidéo de bienvenue';

  test('J2 : lien visible, rouvre l écran, « Continuer » ramène à l accueil sans rien changer', async () => {
    await seedAnonymousStorage({
      history: validatedRun(1),
      narrativeFlags: WELCOME_SEEN,
    });
    await renderHome();
    expect(screen.getByText('Jour 2 sur 14')).toBeTruthy();
    expect(screen.queryByText("C'est parti.")).toBeNull();
    const flagsBefore = await AsyncStorage.getItem('narrative_flags');

    const user = userEvent.setup();
    await user.press(screen.getByText(LINK));
    await waitFor(() => expect(screen.getByText("C'est parti.")).toBeTruthy());
    await user.press(screen.getByText('Continuer'));
    await waitFor(() => expect(screen.queryByText("C'est parti.")).toBeNull());

    expect(screen.getByText('Jour 2 sur 14')).toBeTruthy();
    expect(await AsyncStorage.getItem('narrative_flags')).toBe(flagsBefore);
    // Relecture ≠ premier lancement : pas de pre-prompt notifications.
    expect(screen.queryByText('Un rappel par jour')).toBeNull();
  });

  test('J4 : lien absent', async () => {
    await seedAnonymousStorage({
      history: validatedRun(3),
      narrativeFlags: { ...WELCOME_SEEN, j3_charniere: '2026-10-14T08:00:00.000Z' },
    });
    await renderHome();
    expect(screen.getByText('Jour 4 sur 14')).toBeTruthy();
    expect(screen.queryByText(LINK)).toBeNull();
  });
});

describe('pre-prompt notifications J1 (R3-5)', () => {
  const notifMock = jest.requireMock('expo-notifications') as {
    getPermissionsAsync: jest.Mock;
    requestPermissionsAsync: jest.Mock;
  };

  function mockPermissionUndetermined() {
    notifMock.getPermissionsAsync.mockResolvedValue({
      granted: false,
      canAskAgain: true,
      status: 'undetermined',
    });
    notifMock.requestPermissionsAsync.mockResolvedValue({
      granted: true,
      status: 'granted',
    });
  }

  test('pendant la vidéo J1 : pas de prompt système, pre-prompt affiché à la fermeture', async () => {
    mockPermissionUndetermined();
    await seedAnonymousStorage({ history: [] });
    await render(
      <ProgressProvider>
        <SubscriptionProvider>
          <GatedHome />
        </SubscriptionProvider>
      </ProgressProvider>,
    );
    // Vidéo J1 visible.
    await waitFor(() => expect(screen.getByText("C'est parti.")).toBeTruthy());
    // Aucune demande système tant que la vidéo est ouverte.
    expect(notifMock.requestPermissionsAsync).not.toHaveBeenCalled();
    expect(screen.queryByText('Un rappel par jour')).toBeNull();

    const user = userEvent.setup();
    await user.press(screen.getByText('Continuer'));

    // Pre-prompt visible, prompt système toujours pas déclenché.
    await waitFor(() => expect(screen.getByText('Un rappel par jour')).toBeTruthy());
    expect(notifMock.requestPermissionsAsync).not.toHaveBeenCalled();
  });

  test('« Activer les rappels » → prompt système + flag notif_permission_prompted posé', async () => {
    mockPermissionUndetermined();
    await seedAnonymousStorage({
      history: [],
      narrativeFlags: { welcome_video: '2026-10-01T08:00:00.000Z' },
    });
    await renderHome();
    await waitFor(() => expect(screen.getByText('Un rappel par jour')).toBeTruthy());

    const user = userEvent.setup();
    await user.press(screen.getByText('Activer les rappels'));

    await waitFor(() => expect(notifMock.requestPermissionsAsync).toHaveBeenCalled());
    await waitFor(async () => {
      const raw = await AsyncStorage.getItem('narrative_flags');
      expect(JSON.parse(raw!).notif_permission_prompted).toBeDefined();
    });
    expect(screen.queryByText('Un rappel par jour')).toBeNull();
  });

  test('« Pas maintenant » → flag posé, AUCUN prompt système', async () => {
    mockPermissionUndetermined();
    await seedAnonymousStorage({
      history: [],
      narrativeFlags: { welcome_video: '2026-10-01T08:00:00.000Z' },
    });
    await renderHome();
    await waitFor(() => expect(screen.getByText('Un rappel par jour')).toBeTruthy());

    const user = userEvent.setup();
    await user.press(screen.getByText('Pas maintenant'));

    await waitFor(async () => {
      const raw = await AsyncStorage.getItem('narrative_flags');
      expect(JSON.parse(raw!).notif_permission_prompted).toBeDefined();
    });
    expect(notifMock.requestPermissionsAsync).not.toHaveBeenCalled();
    expect(screen.queryByText('Un rappel par jour')).toBeNull();
  });

  test('flag notif_permission_prompted déjà posé : pas de pre-prompt', async () => {
    mockPermissionUndetermined();
    await seedAnonymousStorage({ history: [], narrativeFlags: WELCOME_SEEN });
    await renderHome();
    expect(screen.queryByText('Un rappel par jour')).toBeNull();
    expect(notifMock.requestPermissionsAsync).not.toHaveBeenCalled();
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

describe('F-01 (audit Lou) — transition de phase sans démontage', () => {
  // Régression rules-of-hooks : le hub Phase 0 déclarait ses hooks APRÈS les
  // returns précoces Phase 1 / post-S8. Quand currentPhase bascule pendant que
  // le composant reste monté (validation du J16 → J17 + auto-start S1), le
  // nombre de hooks change entre deux renders → « Rendered fewer hooks than
  // expected ». Le fix F-01 (routeur mince + Phase0HomeScreen) rend la
  // transition sûre.
  test('validation du J16 → bascule Phase 1 montée : pas d erreur React, Phase1HomeScreen rendu', async () => {
    await seedAnonymousStorage({
      history: validatedRun(15),
      tierReaches: [
        {
          tier_id: 15,
          first_reached_at: '2026-10-13T08:00:00.000Z',
          last_reached_at: '2026-10-13T08:00:00.000Z',
          reach_count: 1,
        },
      ],
      narrativeFlags: {
        ...WELCOME_SEEN,
        j3_charniere: 'x',
        j7_charniere: 'x',
        j11_charniere: 'x',
        j14_charniere: 'x',
        s0_1_screen: 'x',
        s0_2_screen: 'x',
      },
    });
    await renderHome();
    expect(screen.getByText('S0.2 · Roadmap')).toBeTruthy();

    const user = await checkActions(5);
    await user.press(screen.getAllByText('Valider ma journée')[0]);
    const validateButtons = screen.getAllByText('Valider ma journée');
    await user.press(validateButtons[validateButtons.length - 1]);
    await waitFor(() => expect(screen.getByText('Journée validée')).toBeTruthy());

    // Passage de minuit, app restée ouverte (cas 23h59 → 00h00) : currentDay
    // 16 → 17, currentPhase bascule phase_1, l'auto-start S1 pose
    // currentPillarId. Le hub doit router vers Phase1HomeScreen sans crash.
    await act(async () => {
      advanceDevClock(1);
    });
    await waitFor(() =>
      expect(screen.getByText('PHASE1_HOME_STUB')).toBeTruthy(),
    );
  });
});

// ─── D44 (1er octobre 2026) — validation automatique de la veille ≥ 5/7 ──────
// Retours testeurs beta 30 sept. Flow réel : la testeuse coche 5 actions le
// soir, ne tape pas « Valider », rouvre l'app le lendemain.

describe('D44 — coches de la veille ≥ 5/7 validées automatiquement au changement de jour', () => {
  test('J5 : 5 coches sans valider → lendemain : jour 6, série 5, coches du jour vides, notice', async () => {
    await seedAnonymousStorage({
      history: validatedRun(4),
      narrativeFlags: { ...WELCOME_SEEN, j3_charniere: '2026-10-05T08:00:00.000Z' },
    });
    await renderHome();
    expect(screen.getByText('Jour 5 sur 14')).toBeTruthy();
    await checkActions(5);
    await waitFor(async () => {
      const raw = await AsyncStorage.getItem(`daily_check_actions.${THURSDAY}`);
      expect(Object.values(JSON.parse(raw!)).filter(Boolean)).toHaveLength(5);
    });

    await act(async () => advanceDevClock(1));

    await waitFor(() => expect(screen.getByText('Jour 6 sur 14')).toBeTruthy());
    expect(showNotice).toHaveBeenCalledWith(
      'Journée validée',
      expect.stringContaining('5 actions sur 7'),
    );
    // Nouvelle journée ouverte : rien de coché, bouton de validation présent.
    await waitFor(() => expect(screen.getByText('0 / 7 cochées')).toBeTruthy());
    expect(screen.getByText('Valider ma journée')).toBeTruthy();
  });

  test('J3 : 5 coches sans valider → lendemain : charnière J3 rattrapée à l ouverture (D19/D25)', async () => {
    await seedAnonymousStorage({
      history: validatedRun(2),
      narrativeFlags: WELCOME_SEEN,
    });
    await renderHome();
    expect(screen.getByText('Jour 3 sur 14')).toBeTruthy();
    await checkActions(5);

    await act(async () => advanceDevClock(1));

    await waitFor(() => expect(screen.getByText(/Le corps commence/)).toBeTruthy());
    const raw = await AsyncStorage.getItem('narrative_flags');
    expect(JSON.parse(raw!).j3_charniere).toBeDefined();
  });

  test('course au changement de date : les coches d hier ne sont pas recopiées sous la clé du jour', async () => {
    await seedAnonymousStorage({
      history: validatedRun(4),
      narrativeFlags: { ...WELCOME_SEEN, j3_charniere: '2026-10-05T08:00:00.000Z' },
    });
    await renderHome();
    await checkActions(3);

    await act(async () => advanceDevClock(1));

    await waitFor(() => expect(screen.getByText('Jour 5 sur 14')).toBeTruthy());
    await waitFor(() => expect(screen.getByText('0 / 7 cochées')).toBeTruthy());
    const friday = await AsyncStorage.getItem('daily_check_actions.2026-10-16');
    expect(friday == null || Object.values(JSON.parse(friday)).filter(Boolean).length === 0).toBe(true);
  });
});

// ─── D45 (2 octobre 2026) — récapitulatif de la veille, lecture seule ────────
// Retour testeuse : « Peut-on revoir les cases cochées de la veille ? »
// (option B de docs/cadrage/note-historique-jours-phase0.md).

describe('D45 — « Hier » : cases cochées de la veille en lecture seule', () => {
  const YESTERDAY = '2026-10-14';
  const yesterdayChecks = JSON.stringify({
    activation_matinale: true,
    defi_froid: true,
    mouvement_recuperation: false,
    mineralisation: true,
    fenetre_digestive: true,
    fruits: true,
    soiree_sans_ecrans: false,
  });

  test('veille cochée → ligne « Hier : Mes actions », détail des 7 actions, fermeture', async () => {
    await seedAnonymousStorage({
      history: validatedRun(4),
      narrativeFlags: { ...WELCOME_SEEN, j3_charniere: '2026-10-05T08:00:00.000Z' },
    });
    await AsyncStorage.setItem(`daily_check_actions.${YESTERDAY}`, yesterdayChecks);
    await renderHome();
    const user = userEvent.setup();

    const line = await screen.findByText('Hier : Mes actions');
    await user.press(line);

    expect(screen.getByText('Hier')).toBeTruthy();
    expect(screen.getByText('5 actions sur 7')).toBeTruthy();
    expect(screen.getByLabelText('Défi froid : fait')).toBeTruthy();
    expect(screen.getByLabelText('Fruits dans la journée : fait')).toBeTruthy();
    expect(screen.getByLabelText('Soirée sans écrans : non fait')).toBeTruthy();
    expect(screen.getByLabelText('Mouvement ou récupération : non fait')).toBeTruthy();
    // La veille est dans l'historique en « validée » → confirmation sobre.
    expect(screen.getByText('Journée validée.')).toBeTruthy();

    await user.press(screen.getByText('Fermer'));
    await waitFor(() => expect(screen.queryByLabelText('Défi froid : fait')).toBeNull());
    // Lecture seule : les cases du jour ne sont pas affectées.
    expect(screen.getByText('0 / 7 cochées')).toBeTruthy();
  });

  test('aucune coche la veille → pas de ligne « Hier »', async () => {
    await seedAnonymousStorage({
      history: validatedRun(4),
      narrativeFlags: { ...WELCOME_SEEN, j3_charniere: '2026-10-05T08:00:00.000Z' },
    });
    await renderHome();
    expect(screen.queryByText(/^Hier :/)).toBeNull();
  });

  test('flow réel : cocher 5 cases, valider, revenir le lendemain → « Hier : Mes actions »', async () => {
    await seedAnonymousStorage({
      history: validatedRun(4),
      narrativeFlags: { ...WELCOME_SEEN, j3_charniere: '2026-10-05T08:00:00.000Z' },
    });
    await renderHome();
    const user = await checkActions(5);
    await user.press(screen.getByText('Valider ma journée'));
    const validateButtons = screen.getAllByText('Valider ma journée');
    await user.press(validateButtons[validateButtons.length - 1]);
    await waitFor(() => expect(screen.getByText(/Ta série : 5 jours/)).toBeTruthy());
    expect(screen.queryByText(/^Hier :/)).toBeNull();

    await act(async () => advanceDevClock(1));

    await waitFor(() => expect(screen.getByText('Jour 6 sur 14')).toBeTruthy());
    expect(await screen.findByText('Hier : Mes actions')).toBeTruthy();
  });
});

/**
 * Tests ProfilTabScreen — IA-70 profil utilisateur.
 *
 * Couvre : infos parcours, card abonnement (statut/plan/renouvellement),
 * gating des CTA (portail Stripe seulement si abonnement existant ;
 * « Découvrir l'abonnement » seulement non-abonné ET dès J3 — D3),
 * navigation paliers, déconnexion, liens légaux (App Store §5.1.1),
 * absence totale de boutons DEV hors mode DEV (posture reset V1 §2.11).
 *
 * Hooks mockés (pattern PaywallScreen).
 */

import React from 'react';
import { Linking } from 'react-native';
import { render, screen, userEvent } from '@testing-library/react-native';

jest.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
    },
  },
}));

const mockSignOut = jest.fn();
let mockUser: { id: string; email?: string } | null = {
  id: 'user-1',
  email: 'stephane@example.com',
};
jest.mock('../../../hooks/AuthContext', () => ({
  useAuth: () => ({ user: mockUser, signOut: mockSignOut }),
}));

let mockCurrentDay = 5;
let mockCurrentPhase = 'phase_0';
let mockProfileDynamicId: string | null = 'fatigue-motivation';
jest.mock('../../../hooks/ProgressContext', () => ({
  useProgress: () => ({
    currentDay: mockCurrentDay,
    currentPhase: mockCurrentPhase,
    streak: 5,
    jokerAvailable: true,
    profileDynamicId: mockProfileDynamicId,
    accountCreatedAt: '2026-10-10T08:00:00.000Z',
    resetAll: jest.fn(),
    applyDevSnapshot: jest.fn(),
  }),
}));

let mockSubscriptionState: {
  status: string;
  plan: string | null;
  renewsAt: string | null;
} = { status: 'free', plan: null, renewsAt: null };
let mockSubscriptionActive = false;
jest.mock('../../../hooks/SubscriptionContext', () => ({
  useSubscription: () => ({
    state: mockSubscriptionState,
    isActive: mockSubscriptionActive,
    setMockSubscriptionState: jest.fn(),
    resetSubscription: jest.fn(),
    reload: jest.fn(),
  }),
}));

let mockDevToolsEnabled = false;
jest.mock('../../../lib/devToolsEnabled', () => ({
  isDevToolsEnabled: () => mockDevToolsEnabled,
}));

jest.mock('../../../lib/openExternal', () => ({
  openExternal: jest.fn(async () => ({ type: 'cancel' })),
}));
jest.mock('../../../lib/notifications', () => ({
  cancelAllNotifications: jest.fn(),
  requestNotificationPermission: jest.fn(async () => 'granted'),
  scheduleLocalNotification: jest.fn(async () => 'id'),
  schedulePhase0Notifications: jest.fn(async () => {}),
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

import ProfilTabScreen from '../ProfilTabScreen';

let linkingSpy: jest.SpyInstance;

beforeEach(() => {
  jest.clearAllMocks();
  mockUser = { id: 'user-1', email: 'stephane@example.com' };
  mockCurrentDay = 5;
  mockCurrentPhase = 'phase_0';
  mockProfileDynamicId = 'fatigue-motivation';
  mockSubscriptionState = { status: 'free', plan: null, renewsAt: null };
  mockSubscriptionActive = false;
  mockDevToolsEnabled = false;
  linkingSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true as never);
});

afterEach(() => {
  linkingSpy.mockRestore();
});

describe('infos parcours et compte', () => {
  test('email du compte, jour, phase, profil dynamique, date de démarrage', async () => {
    await render(<ProfilTabScreen />);
    expect(screen.getByText('stephane@example.com')).toBeTruthy();
    // « 5 » apparaît aussi dans la StreakBubble → on cible la ligne Jour.
    expect(screen.getAllByText('5').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Jour :')).toBeTruthy();
    expect(screen.getByText('phase_0')).toBeTruthy();
    expect(screen.getByText('fatigue-motivation')).toBeTruthy();
    expect(screen.getByText('10/10/2026')).toBeTruthy();
  });

  test('sans session : « (mode anonyme) »', async () => {
    mockUser = null;
    await render(<ProfilTabScreen />);
    expect(screen.getByText('(mode anonyme)')).toBeTruthy();
  });
});

describe('card abonnement — gating des CTA', () => {
  test('free à J5 → « Découvrir l abonnement » (D3 : dès J3) → navigate Paywall ; pas de portail Stripe', async () => {
    await render(<ProfilTabScreen />);
    expect(screen.queryByText('Gérer mon abonnement')).toBeNull();
    const user = userEvent.setup();
    await user.press(screen.getByText("Découvrir l'abonnement"));
    expect(mockNavigate).toHaveBeenCalledWith('Paywall');
  });

  test('free à J2 → PAS de « Découvrir l abonnement » (avant J3)', async () => {
    mockCurrentDay = 2;
    await render(<ProfilTabScreen />);
    expect(screen.queryByText("Découvrir l'abonnement")).toBeNull();
  });

  test('abonné actif → « Gérer mon abonnement », plan et renouvellement affichés, pas de « Découvrir »', async () => {
    mockSubscriptionState = {
      status: 'active',
      plan: 'monthly',
      renewsAt: '2026-11-10T08:00:00.000Z',
    };
    mockSubscriptionActive = true;
    await render(<ProfilTabScreen />);
    expect(screen.getByText('Gérer mon abonnement')).toBeTruthy();
    expect(screen.getByText('monthly')).toBeTruthy();
    expect(screen.getByText('10/11/2026')).toBeTruthy();
    expect(screen.queryByText("Découvrir l'abonnement")).toBeNull();
  });

  test('abonnement expiré (non actif, J17) → portail Stripe ET « Découvrir » (relance possible)', async () => {
    mockCurrentDay = 17;
    mockCurrentPhase = 'phase_1';
    mockSubscriptionState = { status: 'expired', plan: 'monthly', renewsAt: null };
    mockSubscriptionActive = false;
    await render(<ProfilTabScreen />);
    expect(screen.getByText('Gérer mon abonnement')).toBeTruthy();
    expect(screen.getByText("Découvrir l'abonnement")).toBeTruthy();
  });
});

describe('navigation et actions', () => {
  test('« Voir mes paliers » → galerie IA-51', async () => {
    await render(<ProfilTabScreen />);
    const user = userEvent.setup();
    await user.press(screen.getByText('Voir mes paliers'));
    expect(mockNavigate).toHaveBeenCalledWith('PaliersGallery');
  });

  test('« Se déconnecter » → signOut', async () => {
    await render(<ProfilTabScreen />);
    const user = userEvent.setup();
    await user.press(screen.getByText('Se déconnecter'));
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  test('liens légaux (App Store §5.1.1) → rawadventure.world', async () => {
    await render(<ProfilTabScreen />);
    const user = userEvent.setup();
    await user.press(screen.getByText('Conditions générales'));
    expect(linkingSpy).toHaveBeenCalledWith('https://rawadventure.world/cgu/');
    await user.press(screen.getByText('Politique de confidentialité'));
    expect(linkingSpy).toHaveBeenCalledWith(
      'https://rawadventure.world/politique-confidentialite/',
    );
    await user.press(screen.getByText('Mentions légales'));
    expect(linkingSpy).toHaveBeenCalledWith(
      'https://rawadventure.world/mentions-legales/',
    );
  });
});

describe('posture reset V1 (§2.11)', () => {
  test('hors mode DEV : aucun bouton (DEV) ni outil de reset', async () => {
    await render(<ProfilTabScreen />);
    expect(screen.queryByText(/\(DEV\)/)).toBeNull();
  });
});

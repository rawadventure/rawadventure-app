/**
 * Tests RootNavigator — table de routage centrale (M7 + A3, Sprint A/B/C auth,
 * D24 démarrage différé, gating paywall Feature Spec abonnement §5).
 *
 * Approche : les 3 hooks (auth/progress/subscription) sont mockés par
 * variables module mutables et les 9 écrans importés sont stubbés par des
 * marqueurs texte légers — le routeur lit une dizaine de champs et rend un
 * écran, c'est une table de routage qui se teste en unitaire. L'intégration
 * vrais-providers est couverte ailleurs (App.smoke + tests d'écrans).
 */

import React from 'react';
import { Platform } from 'react-native';
import { render, screen, userEvent } from '@testing-library/react-native';

// ---- Hooks mockés (variables mutables, reset dans beforeEach) ----

let mockSession: { user: { id: string } } | null = null;
let mockAuthLoading = false;
let mockPasswordRecoveryMode = false;

let mockProgressLoading = false;
let mockOnboardingDone = false;
let mockAccountCreatedAt: string | null = null;
let mockCurrentDay = 0;
let mockCurrentPhase: 'phase_0' | 's0_1' | 's0_2' | 'phase_1' | 'post_s8' =
  'phase_0';
let mockPendingMigration: { userId: string } | null = null;
const mockCompleteOnboarding = jest.fn(async () => {});

let mockSubscriptionActive = false;
let mockSubscriptionLoading = false;

jest.mock('../../hooks/AuthContext', () => ({
  useAuth: () => ({
    session: mockSession,
    loading: mockAuthLoading,
    passwordRecoveryMode: mockPasswordRecoveryMode,
  }),
}));
jest.mock('../../hooks/ProgressContext', () => ({
  useProgress: () => ({
    loading: mockProgressLoading,
    onboardingDone: mockOnboardingDone,
    accountCreatedAt: mockAccountCreatedAt,
    currentDay: mockCurrentDay,
    currentPhase: mockCurrentPhase,
    completeOnboarding: mockCompleteOnboarding,
    pendingMigration: mockPendingMigration,
  }),
}));
jest.mock('../../hooks/SubscriptionContext', () => ({
  useSubscription: () => ({
    isActive: mockSubscriptionActive,
    loading: mockSubscriptionLoading,
  }),
}));

// ---- Écrans stubbés — marqueurs + boutons qui invoquent les props ----

jest.mock('../../screens/v1/OnboardingScreenV1', () => {
  const { Text } = require('react-native');
  return function OnboardingStub(props: {
    onAlreadyHaveAccount: () => void;
    onComplete: (answers: Record<string, unknown>) => Promise<void>;
  }) {
    return (
      <>
        <Text>STUB:Onboarding</Text>
        <Text onPress={props.onAlreadyHaveAccount}>STUB:dejaUnCompte</Text>
        <Text
          onPress={() =>
            props.onComplete({ energy: 2, body: 2, mental: 2, motivation: 2 })
          }
        >
          STUB:terminerOnboarding
        </Text>
      </>
    );
  };
});
jest.mock('../../screens/v1/EmailConfirmedFallbackScreen', () => {
  const { Text } = require('react-native');
  return function Stub() {
    return <Text>STUB:EmailConfirmedFallback</Text>;
  };
});
jest.mock('../../screens/v1/RegisterScreen', () => {
  const { Text } = require('react-native');
  return function RegisterStub(props: {
    initialMode?: string;
    onSignupRedirect?: () => void;
    onRegistered: (r: { requiresStartChoice: boolean }) => void;
  }) {
    return (
      <>
        <Text>{`STUB:Register:${props.initialMode ?? 'signup'}`}</Text>
        {props.onSignupRedirect ? (
          <Text onPress={props.onSignupRedirect}>STUB:versSignup</Text>
        ) : null}
        <Text
          onPress={() => props.onRegistered({ requiresStartChoice: true })}
        >
          STUB:registeredD24
        </Text>
        <Text
          onPress={() => props.onRegistered({ requiresStartChoice: false })}
        >
          STUB:registeredNormal
        </Text>
      </>
    );
  };
});
jest.mock('../../screens/v1/ResetPasswordConfirmScreen', () => {
  const { Text } = require('react-native');
  return function Stub() {
    return <Text>STUB:ResetPasswordConfirm</Text>;
  };
});
jest.mock('../../screens/v1/EmailPendingScreen', () => {
  const { Text } = require('react-native');
  return function Stub() {
    return <Text>STUB:EmailPending</Text>;
  };
});
jest.mock('../../screens/v1/StartChoiceScreen', () => {
  const { Text } = require('react-native');
  return function StartChoiceStub(props: { onChoice: () => void }) {
    return (
      <>
        <Text>STUB:StartChoice</Text>
        <Text onPress={props.onChoice}>STUB:choisir</Text>
      </>
    );
  };
});
jest.mock('../../screens/v1/WaitingScreen', () => {
  const { Text } = require('react-native');
  return function Stub() {
    return <Text>STUB:Waiting</Text>;
  };
});
jest.mock('../../screens/v1/PaywallScreen', () => {
  const { Text } = require('react-native');
  return function Stub() {
    return <Text>STUB:Paywall</Text>;
  };
});
jest.mock('../TabNavigator', () => {
  const { Text } = require('react-native');
  return function Stub() {
    return <Text>STUB:TabNavigator</Text>;
  };
});

import RootNavigator from '../RootNavigator';

// ---- Helpers plateforme web (branche 0.5 confirm-email) ----

const originalPlatformDescriptor = Object.getOwnPropertyDescriptor(
  Platform,
  'OS',
);

function setPlatformOS(os: string) {
  Object.defineProperty(Platform, 'OS', {
    configurable: true,
    get: () => os,
  });
}

function restorePlatformOS() {
  if (originalPlatformDescriptor) {
    Object.defineProperty(Platform, 'OS', originalPlatformDescriptor);
  }
}

function setWebLanding(pathname: string) {
  (globalThis as Record<string, unknown>).window = {
    location: { pathname },
  };
  setPlatformOS('web');
}

function clearWebLanding() {
  delete (globalThis as Record<string, unknown>).window;
  restorePlatformOS();
}

// ---- Fixtures ----

const SESSION = { user: { id: 'user-1' } };
const inFuture = (hours: number) =>
  new Date(Date.now() + hours * 3_600_000).toISOString();
const inPast = (days: number) =>
  new Date(Date.now() - days * 86_400_000).toISOString();

/** État par défaut : utilisateur installé, J5 Phase 0, non abonné. */
function seedActiveUser() {
  mockSession = SESSION;
  mockOnboardingDone = true;
  mockAccountCreatedAt = inPast(5);
  mockCurrentDay = 5;
  mockCurrentPhase = 'phase_0';
}

beforeEach(() => {
  jest.clearAllMocks();
  mockSession = null;
  mockAuthLoading = false;
  mockPasswordRecoveryMode = false;
  mockProgressLoading = false;
  mockOnboardingDone = false;
  mockAccountCreatedAt = null;
  mockCurrentDay = 0;
  mockCurrentPhase = 'phase_0';
  mockPendingMigration = null;
  mockSubscriptionActive = false;
  mockSubscriptionLoading = false;
});

afterEach(() => {
  clearWebLanding();
});

describe('chargement initial', () => {
  test.each([
    ['authLoading', () => (mockAuthLoading = true)],
    ['progressLoading', () => (mockProgressLoading = true)],
    ['subscriptionLoading', () => (mockSubscriptionLoading = true)],
  ])('%s → LoadingScreen (aucun écran de parcours)', async (_label, arm) => {
    seedActiveUser();
    arm();
    await render(<RootNavigator />);
    expect(screen.queryByText(/^STUB:/)).toBeNull();
  });
});

describe('branche 0 — password recovery (Sprint A)', () => {
  test('passwordRecoveryMode prime sur tout, même session + parcours actif', async () => {
    seedActiveUser();
    mockPasswordRecoveryMode = true;
    await render(<RootNavigator />);
    expect(screen.getByText('STUB:ResetPasswordConfirm')).toBeTruthy();
  });
});

describe('branche 0.5 — atterrissage web /confirm-email (Sprint C)', () => {
  test('web + /confirm-email + contexte vierge → EmailConfirmedFallback', async () => {
    setWebLanding('/confirm-email');
    await render(<RootNavigator />);
    expect(screen.getByText('STUB:EmailConfirmedFallback')).toBeTruthy();
  });

  test('web + /confirm-email + pendingMigration (Safari partage le localStorage) → skip, branche migration', async () => {
    setWebLanding('/confirm-email');
    mockOnboardingDone = true;
    mockPendingMigration = { userId: 'user-1' };
    await render(<RootNavigator />);
    // !session + pendingMigration + onboardingDone → EmailPendingScreen (2a)
    expect(screen.getByText('STUB:EmailPending')).toBeTruthy();
  });

  test('web + /confirm-email + onboardingDone (migration déjà faite ici) → app normale', async () => {
    setWebLanding('/confirm-email');
    seedActiveUser();
    await render(<RootNavigator />);
    expect(screen.getByText('STUB:TabNavigator')).toBeTruthy();
  });

  test('web + autre pathname → routing normal (onboarding)', async () => {
    setWebLanding('/');
    await render(<RootNavigator />);
    expect(screen.getByText('STUB:Onboarding')).toBeTruthy();
  });
});

describe('branche 0.6 / 2a — migration en attente (§2.10, Sprint B)', () => {
  test('session + pendingMigration → LoadingScreen (pas de flash onboarding)', async () => {
    mockSession = SESSION;
    mockPendingMigration = { userId: 'user-1' };
    await render(<RootNavigator />);
    expect(screen.queryByText(/^STUB:/)).toBeNull();
  });

  test('pas de session + pendingMigration + onboardingDone → EmailPendingScreen', async () => {
    mockOnboardingDone = true;
    mockPendingMigration = { userId: 'user-1' };
    await render(<RootNavigator />);
    expect(screen.getByText('STUB:EmailPending')).toBeTruthy();
  });
});

describe('branche 1 — onboarding (mode anonyme)', () => {
  test('!onboardingDone → Onboarding, même avec session', async () => {
    mockSession = SESSION;
    await render(<RootNavigator />);
    expect(screen.getByText('STUB:Onboarding')).toBeTruthy();
  });

  test('terminer l’onboarding → completeOnboarding(answers, profileId calculé)', async () => {
    await render(<RootNavigator />);
    const user = userEvent.setup();
    await user.press(screen.getByText('STUB:terminerOnboarding'));
    expect(mockCompleteOnboarding).toHaveBeenCalledTimes(1);
    const [answers, profileId] = mockCompleteOnboarding.mock
      .calls[0] as unknown as [Record<string, unknown>, string];
    expect(answers).toMatchObject({ energy: 2, body: 2 });
    expect(typeof profileId).toBe('string');
    expect(profileId.length).toBeGreaterThan(0);
  });

  test('« J’ai déjà un compte » → RegisterScreen mode signin (Sprint C PWA)', async () => {
    await render(<RootNavigator />);
    const user = userEvent.setup();
    await user.press(screen.getByText('STUB:dejaUnCompte'));
    expect(screen.getByText('STUB:Register:signin')).toBeTruthy();
  });

  test('depuis le signin demandé, « créer un compte » → retour Onboarding', async () => {
    await render(<RootNavigator />);
    const user = userEvent.setup();
    await user.press(screen.getByText('STUB:dejaUnCompte'));
    await user.press(screen.getByText('STUB:versSignup'));
    expect(screen.getByText('STUB:Onboarding')).toBeTruthy();
  });
});

describe('branche 2 — IA-10 création de compte', () => {
  test('onboardingDone + pas de session → RegisterScreen (mode signup par défaut)', async () => {
    mockOnboardingDone = true;
    await render(<RootNavigator />);
    expect(screen.getByText('STUB:Register:signup')).toBeTruthy();
  });
});

describe('branches 3 et 4 — D24 démarrage différé (IA-10b / IA-10c)', () => {
  // NB : les mocks de hooks sont des variables module — les muter ne re-rend
  // pas le routeur. On simule l'arrivée de la session (onAuthStateChange dans
  // la vraie app) par un `screen.rerender` explicite après mutation.

  test('onRegistered({requiresStartChoice:true}) + session → StartChoiceScreen', async () => {
    mockOnboardingDone = true;
    await render(<RootNavigator />);
    const user = userEvent.setup();
    await user.press(screen.getByText('STUB:registeredD24'));
    seedActiveUser();
    await screen.rerender(<RootNavigator />);
    expect(screen.getByText('STUB:StartChoice')).toBeTruthy();
  });

  test('choix « demain » → accountCreatedAt futur → WaitingScreen (IA-10c)', async () => {
    mockOnboardingDone = true;
    await render(<RootNavigator />);
    const user = userEvent.setup();
    await user.press(screen.getByText('STUB:registeredD24'));
    mockSession = SESSION;
    mockAccountCreatedAt = inFuture(3);
    mockCurrentDay = 0;
    await screen.rerender(<RootNavigator />);
    await user.press(screen.getByText('STUB:choisir'));
    expect(screen.getByText('STUB:Waiting')).toBeTruthy();
  });

  test('choix « maintenant » → accountCreatedAt passé → TabNavigator', async () => {
    mockOnboardingDone = true;
    await render(<RootNavigator />);
    const user = userEvent.setup();
    await user.press(screen.getByText('STUB:registeredD24'));
    seedActiveUser();
    mockCurrentDay = 1;
    mockAccountCreatedAt = inPast(0);
    await screen.rerender(<RootNavigator />);
    await user.press(screen.getByText('STUB:choisir'));
    expect(screen.getByText('STUB:TabNavigator')).toBeTruthy();
  });

  test('onRegistered({requiresStartChoice:false}) → pas de StartChoice, hub direct', async () => {
    mockOnboardingDone = true;
    await render(<RootNavigator />);
    const user = userEvent.setup();
    await user.press(screen.getByText('STUB:registeredNormal'));
    seedActiveUser();
    mockCurrentDay = 1;
    await screen.rerender(<RootNavigator />);
    expect(screen.queryByText('STUB:StartChoice')).toBeNull();
    expect(screen.getByText('STUB:TabNavigator')).toBeTruthy();
  });
});

describe('branche 4.5 — gating paywall (Feature Spec abonnement §5)', () => {
  test('phase_1 + non abonné → PaywallScreen', async () => {
    seedActiveUser();
    mockCurrentPhase = 'phase_1';
    mockCurrentDay = 17;
    await render(<RootNavigator />);
    expect(screen.getByText('STUB:Paywall')).toBeTruthy();
  });

  test('s0_1 + non abonné → PaywallScreen (S0 est déjà hors phase_0)', async () => {
    seedActiveUser();
    mockCurrentPhase = 's0_1';
    mockCurrentDay = 15;
    await render(<RootNavigator />);
    expect(screen.getByText('STUB:Paywall')).toBeTruthy();
  });

  test('phase_1 + abonné → TabNavigator', async () => {
    seedActiveUser();
    mockCurrentPhase = 'phase_1';
    mockCurrentDay = 17;
    mockSubscriptionActive = true;
    await render(<RootNavigator />);
    expect(screen.getByText('STUB:TabNavigator')).toBeTruthy();
  });

  test('phase_0 + non abonné → TabNavigator (Phase 0 accessible à vie en free)', async () => {
    seedActiveUser();
    await render(<RootNavigator />);
    expect(screen.getByText('STUB:TabNavigator')).toBeTruthy();
  });
});

describe('branche 5 — parcours actif et garde-fou', () => {
  test('session + onboardingDone + currentDay >= 1 → TabNavigator', async () => {
    seedActiveUser();
    mockCurrentDay = 1;
    await render(<RootNavigator />);
    expect(screen.getByText('STUB:TabNavigator')).toBeTruthy();
  });

  test('accountCreatedAt null (état dégradé) → TabNavigator quand même', async () => {
    mockSession = SESSION;
    mockOnboardingDone = true;
    mockAccountCreatedAt = null;
    mockCurrentDay = 0;
    await render(<RootNavigator />);
    expect(screen.getByText('STUB:TabNavigator')).toBeTruthy();
  });
});

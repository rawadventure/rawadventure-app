/**
 * Tests RegisterScreen — IA-10 (création de compte / connexion / mot de passe
 * oublié), fenêtre D24 (démarrage différé si <4h avant minuit local), flow
 * migration §2.10 (session immédiate vs email confirm en attente).
 *
 * Hooks mockés (l'écran orchestre, les mécaniques ont leurs tests dédiés).
 * L'horloge est épinglée via pinClockTo pour piloter la fenêtre D24.
 */

import React from 'react';
import { Alert } from 'react-native';
import { render, screen, userEvent } from '@testing-library/react-native';

const mockSignUp = jest.fn();
const mockSignIn = jest.fn();
const mockResetPassword = jest.fn();
const mockClearSessionExpired = jest.fn();
let mockSessionExpired = false;

jest.mock('../../../hooks/AuthContext', () => ({
  useAuth: () => ({
    signUpWithPassword: mockSignUp,
    signInWithPassword: mockSignIn,
    resetPasswordForEmail: mockResetPassword,
    sessionExpired: mockSessionExpired,
    clearSessionExpired: mockClearSessionExpired,
  }),
}));

const mockMigrate = jest.fn(async () => {});
const mockMarkPendingMigration = jest.fn(async () => {});
jest.mock('../../../hooks/ProgressContext', () => ({
  useProgress: () => ({
    migrateLocalToRemote: mockMigrate,
    markPendingMigration: mockMarkPendingMigration,
  }),
}));

// getSession direct de l'écran (détection session immédiate post-signup).
let mockImmediateSession: object | null = null;
jest.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: async () => ({
        data: { session: mockImmediateSession },
        error: null,
      }),
    },
  },
}));

import RegisterScreen from '../RegisterScreen';
import { pinClockTo, unpinClock } from '../../../test-utils/harness';

const USER = { id: 'user-1' };
let alertSpy: jest.SpyInstance;

/** Presse le bouton d'un Alert par son libellé (ex : 'OK'). */
function pressAlertButton(label: string) {
  const lastCall = alertSpy.mock.calls[alertSpy.mock.calls.length - 1];
  const buttons = lastCall?.[2] as
    | Array<{ text: string; onPress?: () => void }>
    | undefined;
  const btn = buttons?.find((b) => b.text === label);
  expect(btn).toBeDefined();
  btn!.onPress?.();
}

async function fillCredentials(
  user: ReturnType<typeof userEvent.setup>,
  email: string,
  password?: string,
) {
  await user.type(screen.getByPlaceholderText('Email'), email);
  if (password !== undefined) {
    await user.type(screen.getByPlaceholderText(/Mot de passe/), password);
  }
}

beforeEach(() => {
  jest.clearAllMocks();
  mockSessionExpired = false;
  mockImmediateSession = null;
  mockSignUp.mockResolvedValue({ user: USER, error: null });
  mockSignIn.mockResolvedValue({ user: USER, error: null });
  mockResetPassword.mockResolvedValue({ error: null });
  alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  // Mercredi 14 oct 2026, midi — hors fenêtre D24 par défaut.
  pinClockTo('2026-10-14', 12);
});

afterEach(() => {
  unpinClock();
  alertSpy.mockRestore();
});

describe('modes et toggles', () => {
  test('mode register par défaut : ÉTAPE 10 SUR 10', async () => {
    await render(<RegisterScreen onRegistered={jest.fn()} />);
    expect(screen.getByText('ÉTAPE 10 SUR 10')).toBeTruthy();
    expect(screen.getByText('On crée ton compte.')).toBeTruthy();
    expect(screen.getByText('Créer mon compte')).toBeTruthy();
  });

  test('toggle register ↔ signin', async () => {
    await render(<RegisterScreen onRegistered={jest.fn()} />);
    const user = userEvent.setup();
    await user.press(screen.getByText("J'ai déjà un compte"));
    expect(screen.getByText('CONNEXION')).toBeTruthy();
    expect(screen.getByText('Te revoilà.')).toBeTruthy();
    await user.press(screen.getByText('Créer un compte'));
    expect(screen.getByText('ÉTAPE 10 SUR 10')).toBeTruthy();
  });

  test('signin → « Mot de passe oublié ? » → mode forgot → retour connexion', async () => {
    await render(<RegisterScreen onRegistered={jest.fn()} initialMode="signin" />);
    const user = userEvent.setup();
    await user.press(screen.getByText('Mot de passe oublié ?'));
    expect(screen.getByText('MOT DE PASSE OUBLIÉ')).toBeTruthy();
    // Pas de champ mot de passe en mode forgot.
    expect(screen.queryByPlaceholderText(/Mot de passe/)).toBeNull();
    await user.press(screen.getByText('Retour à la connexion'));
    expect(screen.getByText('CONNEXION')).toBeTruthy();
  });

  test('sessionExpired → démarre en signin avec la bannière session expirée', async () => {
    mockSessionExpired = true;
    await render(<RegisterScreen onRegistered={jest.fn()} />);
    expect(screen.getByText('CONNEXION')).toBeTruthy();
    expect(screen.getByText(/Ta session a expiré/)).toBeTruthy();
  });

  test('entrée slide 1 (onSignupRedirect) : « Créer un compte » redirige vers l onboarding au lieu de basculer', async () => {
    const onSignupRedirect = jest.fn();
    await render(
      <RegisterScreen
        onRegistered={jest.fn()}
        initialMode="signin"
        onSignupRedirect={onSignupRedirect}
      />,
    );
    const user = userEvent.setup();
    await user.press(screen.getByText('Créer un compte'));
    expect(onSignupRedirect).toHaveBeenCalledTimes(1);
    // Pas de bascule en mode register dans CE contexte.
    expect(screen.getByText('CONNEXION')).toBeTruthy();
  });
});

describe('validations de saisie', () => {
  test('champs vides → Alert « Champs manquants »', async () => {
    await render(<RegisterScreen onRegistered={jest.fn()} />);
    const user = userEvent.setup();
    await user.press(screen.getByText('Créer mon compte'));
    expect(alertSpy).toHaveBeenCalledWith(
      'Champs manquants',
      expect.any(String),
    );
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  test('email invalide → Alert « Email invalide »', async () => {
    await render(<RegisterScreen onRegistered={jest.fn()} />);
    const user = userEvent.setup();
    await fillCredentials(user, 'pas-un-email', 'motdepasse');
    await user.press(screen.getByText('Créer mon compte'));
    expect(alertSpy).toHaveBeenCalledWith('Email invalide', expect.any(String));
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  test('register : mot de passe < 6 caractères refusé', async () => {
    await render(<RegisterScreen onRegistered={jest.fn()} />);
    const user = userEvent.setup();
    await fillCredentials(user, 'a@b.fr', '123');
    await user.press(screen.getByText('Créer mon compte'));
    expect(alertSpy).toHaveBeenCalledWith(
      'Mot de passe trop court',
      expect.any(String),
    );
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  test('signin : pas de contrôle de longueur (comptes historiques)', async () => {
    await render(<RegisterScreen onRegistered={jest.fn()} initialMode="signin" />);
    const user = userEvent.setup();
    await fillCredentials(user, 'a@b.fr', '123');
    await user.press(screen.getByText('Me connecter'));
    expect(mockSignIn).toHaveBeenCalledWith('a@b.fr', '123');
  });
});

describe('connexion (mode signin)', () => {
  test('succès → clearSessionExpired, ni migration ni onRegistered (le routeur enchaîne)', async () => {
    const onRegistered = jest.fn();
    await render(
      <RegisterScreen onRegistered={onRegistered} initialMode="signin" />,
    );
    const user = userEvent.setup();
    await fillCredentials(user, 'a@b.fr', 'motdepasse');
    await user.press(screen.getByText('Me connecter'));
    expect(mockClearSessionExpired).toHaveBeenCalled();
    expect(mockMigrate).not.toHaveBeenCalled();
    expect(mockMarkPendingMigration).not.toHaveBeenCalled();
    expect(onRegistered).not.toHaveBeenCalled();
  });

  test('erreur → Alert « Connexion échouée »', async () => {
    mockSignIn.mockResolvedValueOnce({
      user: null,
      error: { message: 'Invalid login credentials' },
    });
    await render(<RegisterScreen onRegistered={jest.fn()} initialMode="signin" />);
    const user = userEvent.setup();
    await fillCredentials(user, 'a@b.fr', 'mauvais');
    await user.press(screen.getByText('Me connecter'));
    expect(alertSpy).toHaveBeenCalledWith(
      'Connexion échouée',
      'Invalid login credentials',
    );
    expect(mockClearSessionExpired).not.toHaveBeenCalled();
  });
});

describe('création de compte (mode register, §2.10)', () => {
  test('sans session immédiate (email confirm ON) → markPendingMigration avec email, PAS de migration ni onRegistered', async () => {
    const onRegistered = jest.fn();
    await render(<RegisterScreen onRegistered={onRegistered} />);
    const user = userEvent.setup();
    await fillCredentials(user, 'new@user.fr', 'motdepasse');
    await user.press(screen.getByText('Créer mon compte'));
    expect(mockMarkPendingMigration).toHaveBeenCalledWith(
      'user-1',
      expect.any(String),
      'new@user.fr',
    );
    expect(mockMigrate).not.toHaveBeenCalled();
    expect(onRegistered).not.toHaveBeenCalled();
  });

  test('avec session immédiate, hors fenêtre D24 (midi) → migration + onRegistered({requiresStartChoice:false})', async () => {
    mockImmediateSession = { user: USER };
    const onRegistered = jest.fn();
    await render(<RegisterScreen onRegistered={onRegistered} />);
    const user = userEvent.setup();
    await fillCredentials(user, 'new@user.fr', 'motdepasse');
    await user.press(screen.getByText('Créer mon compte'));
    expect(mockMigrate).toHaveBeenCalledWith('user-1', expect.any(String));
    expect(onRegistered).toHaveBeenCalledWith({ requiresStartChoice: false });
  });

  test('avec session immédiate, à 22h (<4h avant minuit) → requiresStartChoice true (D24)', async () => {
    pinClockTo('2026-10-14', 22);
    mockImmediateSession = { user: USER };
    const onRegistered = jest.fn();
    await render(<RegisterScreen onRegistered={onRegistered} />);
    const user = userEvent.setup();
    await fillCredentials(user, 'new@user.fr', 'motdepasse');
    await user.press(screen.getByText('Créer mon compte'));
    expect(onRegistered).toHaveBeenCalledWith({ requiresStartChoice: true });
  });

  test('signUp en erreur → Alert « Création échouée », rien d autre', async () => {
    mockSignUp.mockResolvedValueOnce({
      user: null,
      error: { message: 'over_email_send_rate_limit' },
    });
    const onRegistered = jest.fn();
    await render(<RegisterScreen onRegistered={onRegistered} />);
    const user = userEvent.setup();
    await fillCredentials(user, 'new@user.fr', 'motdepasse');
    await user.press(screen.getByText('Créer mon compte'));
    expect(alertSpy).toHaveBeenCalledWith(
      'Création échouée',
      'over_email_send_rate_limit',
    );
    expect(mockMarkPendingMigration).not.toHaveBeenCalled();
    expect(onRegistered).not.toHaveBeenCalled();
  });
});

describe('mot de passe oublié (mode forgot)', () => {
  test('email valide → resetPasswordForEmail + Alert « Email envoyé », OK → retour signin', async () => {
    await render(<RegisterScreen onRegistered={jest.fn()} initialMode="signin" />);
    const user = userEvent.setup();
    await user.press(screen.getByText('Mot de passe oublié ?'));
    await user.type(screen.getByPlaceholderText('Email'), 'a@b.fr');
    await user.press(screen.getByText('Recevoir le lien'));
    expect(mockResetPassword).toHaveBeenCalledWith('a@b.fr');
    expect(alertSpy).toHaveBeenCalledWith(
      'Email envoyé',
      expect.any(String),
      expect.any(Array),
    );
    pressAlertButton('OK');
    expect(await screen.findByText('CONNEXION')).toBeTruthy();
  });

  test('email vide ou invalide → bloqué avant l appel', async () => {
    await render(<RegisterScreen onRegistered={jest.fn()} initialMode="signin" />);
    const user = userEvent.setup();
    await user.press(screen.getByText('Mot de passe oublié ?'));
    await user.press(screen.getByText('Recevoir le lien'));
    expect(alertSpy).toHaveBeenCalledWith('Email manquant', expect.any(String));
    expect(mockResetPassword).not.toHaveBeenCalled();
  });
});

/**
 * Tests d'intégration AuthContext — session Supabase, événements auth
 * (Sprint A recovery, Sprint B email confirm, Sprint C OTP/PWA), cache
 * mémoire du mot de passe signup, signal sessionExpired.
 *
 * Le client Supabase est mocké via supabaseMock (auth pilotable :
 * `sb.setSession`, `sb.emitAuthEvent`, spies `sb.authSpies`).
 *
 * PIÈGE cache signup : `cachedSignupPassword` est un état module (pas un
 * state React) — il survit d'un test à l'autre. Les tests qui l'assertent
 * partent d'un état connu en appelant `signOut()` (qui l'efface) ou en
 * l'écrasant via un signUp réussi.
 */

import React, { type ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';

jest.mock('../../lib/supabase', () => {
  const { createSupabaseMock } = require('../../test-utils/supabaseMock');
  const m = createSupabaseMock();
  return { supabase: m.client, __supabaseMock: m };
});

import {
  AuthProvider,
  useAuth,
  getCachedSignupPassword,
} from '../AuthContext';

const { __supabaseMock: sb } = jest.requireMock('../../lib/supabase') as {
  __supabaseMock: import('../../test-utils/supabaseMock').SupabaseMock;
};

const SESSION = {
  user: { id: 'user-1', email: 'test@example.com' },
  access_token: 'token',
};

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

async function renderAuth() {
  const utils = await renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(utils.result.current.loading).toBe(false));
  return utils;
}

beforeEach(() => {
  sb.reset();
  jest.clearAllMocks();
});

describe('boot', () => {
  test('sans session existante : loading passe à false, session null', async () => {
    const { result } = await renderAuth();
    expect(result.current.session).toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.passwordRecoveryMode).toBe(false);
    expect(result.current.sessionExpired).toBe(false);
  });

  test('avec session existante (getSession) : session et user exposés', async () => {
    sb.setSession(SESSION);
    const { result } = await renderAuth();
    expect(result.current.session).toEqual(SESSION);
    expect(result.current.user).toEqual(SESSION.user);
  });
});

describe('événements onAuthStateChange', () => {
  test('SIGNED_IN → session posée, cache signup effacé', async () => {
    const { result } = await renderAuth();
    // Pose un cache via un signup réussi (état connu).
    await act(async () => {
      await result.current.signUpWithPassword('a@b.c', 'secret123');
    });
    expect(getCachedSignupPassword()).toBe('secret123');
    await act(async () => {
      sb.emitAuthEvent('SIGNED_IN', SESSION);
    });
    expect(result.current.session).toEqual(SESSION);
    expect(getCachedSignupPassword()).toBeNull();
  });

  test('PASSWORD_RECOVERY → passwordRecoveryMode true (Sprint A)', async () => {
    const { result } = await renderAuth();
    await act(async () => {
      sb.emitAuthEvent('PASSWORD_RECOVERY', SESSION);
    });
    expect(result.current.passwordRecoveryMode).toBe(true);
  });

  test('SIGNED_OUT après session active → sessionExpired true, clearSessionExpired le remet', async () => {
    sb.setSession(SESSION);
    const { result } = await renderAuth();
    await act(async () => {
      sb.emitAuthEvent('SIGNED_OUT', null);
    });
    expect(result.current.sessionExpired).toBe(true);
    await act(async () => {
      result.current.clearSessionExpired();
    });
    expect(result.current.sessionExpired).toBe(false);
  });

  test('SIGNED_OUT sans session préalable → sessionExpired reste false', async () => {
    const { result } = await renderAuth();
    await act(async () => {
      sb.emitAuthEvent('SIGNED_OUT', null);
    });
    expect(result.current.sessionExpired).toBe(false);
  });

  test('TOKEN_REFRESHED puis SIGNED_OUT → sessionExpired true (heuristique hadSession)', async () => {
    const { result } = await renderAuth();
    await act(async () => {
      sb.emitAuthEvent('TOKEN_REFRESHED', SESSION);
    });
    await act(async () => {
      sb.emitAuthEvent('SIGNED_OUT', null);
    });
    expect(result.current.sessionExpired).toBe(true);
  });

  test('SIGNED_IN efface un sessionExpired posé (reconnexion réussie)', async () => {
    sb.setSession(SESSION);
    const { result } = await renderAuth();
    await act(async () => {
      sb.emitAuthEvent('SIGNED_OUT', null);
    });
    expect(result.current.sessionExpired).toBe(true);
    await act(async () => {
      sb.emitAuthEvent('SIGNED_IN', SESSION);
    });
    expect(result.current.sessionExpired).toBe(false);
  });
});

describe('signUpWithPassword (Sprint B email confirm)', () => {
  test('passe le deep link natif rawadventure://confirm-email et cache le mot de passe', async () => {
    const { result } = await renderAuth();
    await act(async () => {
      await result.current.signOut(); // état cache connu
      await result.current.signUpWithPassword('new@user.fr', 'monmotdepasse');
    });
    expect(sb.authSpies.signUp).toHaveBeenCalledWith({
      email: 'new@user.fr',
      password: 'monmotdepasse',
      options: { emailRedirectTo: 'rawadventure://confirm-email' },
    });
    expect(getCachedSignupPassword()).toBe('monmotdepasse');
  });

  test('signup en erreur → pas de cache du mot de passe', async () => {
    const { result } = await renderAuth();
    await act(async () => {
      await result.current.signOut(); // efface tout cache résiduel
    });
    sb.authSpies.signUp.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'over_email_send_rate_limit' },
    });
    await act(async () => {
      const { error } = await result.current.signUpWithPassword(
        'new@user.fr',
        'refusé',
      );
      expect(error).not.toBeNull();
    });
    expect(getCachedSignupPassword()).toBeNull();
  });
});

describe('signIn / signOut', () => {
  test('signInWithPassword relaie email + password et retourne le user', async () => {
    sb.authSpies.signInWithPassword.mockResolvedValueOnce({
      data: { user: SESSION.user, session: SESSION },
      error: null,
    });
    const { result } = await renderAuth();
    let res: { user: unknown; error: unknown } | undefined;
    await act(async () => {
      res = await result.current.signInWithPassword('test@example.com', 'pw');
    });
    expect(sb.authSpies.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'pw',
    });
    expect(res?.user).toEqual(SESSION.user);
    expect(res?.error).toBeNull();
  });

  test('signOut appelle Supabase et efface le cache signup', async () => {
    const { result } = await renderAuth();
    await act(async () => {
      await result.current.signUpWithPassword('a@b.c', 'topsecret');
    });
    expect(getCachedSignupPassword()).toBe('topsecret');
    await act(async () => {
      await result.current.signOut();
    });
    expect(sb.authSpies.signOut).toHaveBeenCalledTimes(1);
    expect(getCachedSignupPassword()).toBeNull();
  });
});

describe('reset password (Sprint A)', () => {
  test('resetPasswordForEmail cible le deep link rawadventure://reset-password', async () => {
    const { result } = await renderAuth();
    await act(async () => {
      await result.current.resetPasswordForEmail('test@example.com');
    });
    expect(sb.authSpies.resetPasswordForEmail).toHaveBeenCalledWith(
      'test@example.com',
      { redirectTo: 'rawadventure://reset-password' },
    );
  });

  test('updateUserPassword réussi → sort du mode recovery', async () => {
    const { result } = await renderAuth();
    await act(async () => {
      sb.emitAuthEvent('PASSWORD_RECOVERY', SESSION);
    });
    expect(result.current.passwordRecoveryMode).toBe(true);
    await act(async () => {
      await result.current.updateUserPassword('nouveau-mdp');
    });
    expect(sb.authSpies.updateUser).toHaveBeenCalledWith({
      password: 'nouveau-mdp',
    });
    expect(result.current.passwordRecoveryMode).toBe(false);
  });

  test('updateUserPassword en erreur → reste en mode recovery', async () => {
    const { result } = await renderAuth();
    await act(async () => {
      sb.emitAuthEvent('PASSWORD_RECOVERY', SESSION);
    });
    sb.authSpies.updateUser.mockResolvedValueOnce({
      error: { message: 'weak_password' },
    });
    await act(async () => {
      await result.current.updateUserPassword('123');
    });
    expect(result.current.passwordRecoveryMode).toBe(true);
  });

  test('clearPasswordRecoveryMode (annulation utilisateur)', async () => {
    const { result } = await renderAuth();
    await act(async () => {
      sb.emitAuthEvent('PASSWORD_RECOVERY', SESSION);
    });
    await act(async () => {
      result.current.clearPasswordRecoveryMode();
    });
    expect(result.current.passwordRecoveryMode).toBe(false);
  });
});

describe('OTP et renvoi d email (Sprint B/C)', () => {
  test('verifyEmailOtp trim le code et vérifie en type signup', async () => {
    const { result } = await renderAuth();
    await act(async () => {
      await result.current.verifyEmailOtp('test@example.com', '  123456  ');
    });
    expect(sb.authSpies.verifyOtp).toHaveBeenCalledWith({
      email: 'test@example.com',
      token: '123456',
      type: 'signup',
    });
  });

  test('resendConfirmationEmail renvoie le mail signup avec le deep link', async () => {
    const { result } = await renderAuth();
    await act(async () => {
      await result.current.resendConfirmationEmail('test@example.com');
    });
    expect(sb.authSpies.resend).toHaveBeenCalledWith({
      type: 'signup',
      email: 'test@example.com',
      options: { emailRedirectTo: 'rawadventure://confirm-email' },
    });
  });
});

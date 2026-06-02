/**
 * AuthContext — gestion de la session Supabase Auth.
 *
 * Réf docs : Feature Spec V1 Socle minimum §2.10 (migration local → distant à
 * la création de compte). Décisions D22 (repo privé) et D28 (storage local-only
 * V1 — mais Supabase Auth + persistance distante minimale conservées comme
 * "cloud minimal" pour retrouver progression sur même téléphone après
 * réinstallation).
 *
 * REFACTOR Sprint 4 (chantier M7 + A3) — expose `signUpWithPassword`,
 * `signInWithPassword`, `signInWithOAuth` (Apple/Google plus tard). En V0 le
 * RegisterScreen et le LoginScreen appelaient `supabase.auth` directement —
 * désormais on passe par le hook pour centraliser les erreurs et le logging.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type AuthResult = {
  user: User | null;
  error: AuthError | null;
};

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  /**
   * Sprint A auth — true quand Supabase a déclenché `PASSWORD_RECOVERY`
   * (deep link reçu depuis l'email de reset). Le RootNavigator bascule alors
   * sur `ResetPasswordConfirmScreen`. Repassé à false après `updateUserPassword`
   * réussi ou annulation utilisateur.
   */
  passwordRecoveryMode: boolean;
  signInWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signUpWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<{ error: AuthError | null }>;
  updateUserPassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  clearPasswordRecoveryMode: () => void;
  /**
   * Sprint B email confirm — renvoie l'email de confirmation après signup.
   * Utile si l'email initial est tombé en spam ou si l'utilisateur tarde
   * à cliquer le lien.
   */
  resendConfirmationEmail: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordRecoveryMode, setPasswordRecoveryMode] = useState(false);

  useEffect(() => {
    // Récupère la session existante au démarrage.
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session ?? null);
      })
      .finally(() => setLoading(false));

    // Écoute les changements d'état d'authentification (signIn / signOut / refresh).
    // Sprint A auth — capte `PASSWORD_RECOVERY` déclenché quand l'utilisateur
    // arrive depuis le lien email de reset (deep link `rawadventure://...`).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === 'PASSWORD_RECOVERY') {
        setPasswordRecoveryMode(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithPassword = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { user: data.user ?? null, error };
    },
    [],
  );

  const signUpWithPassword = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      // Sprint B email confirm — passe le redirect deep link pour que le clic
      // sur le lien email ouvre l'app et déclenche `SIGNED_IN`. Si Supabase a
      // "Confirm email" OFF en dashboard, `data.session` arrive directement.
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: 'rawadventure://confirm-email' },
      });
      return { user: data.user ?? null, error };
    },
    [],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const resetPasswordForEmail = useCallback(
    async (email: string): Promise<{ error: AuthError | null }> => {
      // Deep link cible IA-Reset. Le scheme `rawadventure://` est déclaré
      // dans app.json. Supabase ajoute ses tokens en fragment d'URL et
      // déclenche `PASSWORD_RECOVERY` côté client à l'ouverture.
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'rawadventure://reset-password',
      });
      return { error };
    },
    [],
  );

  const updateUserPassword = useCallback(
    async (newPassword: string): Promise<{ error: AuthError | null }> => {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (!error) {
        setPasswordRecoveryMode(false);
      }
      return { error };
    },
    [],
  );

  const clearPasswordRecoveryMode = useCallback(() => {
    setPasswordRecoveryMode(false);
  }, []);

  const resendConfirmationEmail = useCallback(
    async (email: string): Promise<{ error: AuthError | null }> => {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: 'rawadventure://confirm-email' },
      });
      return { error };
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        passwordRecoveryMode,
        signInWithPassword,
        signUpWithPassword,
        signOut,
        resetPasswordForEmail,
        updateUserPassword,
        clearPasswordRecoveryMode,
        resendConfirmationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return ctx;
}

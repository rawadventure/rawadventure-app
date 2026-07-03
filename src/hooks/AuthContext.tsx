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
import { Platform } from 'react-native';
import type { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

/**
 * URL de base pour les redirects auth. Sur web PWA, retourne l'origin
 * courant (ex: https://app.rawadventure.world). Sur natif iOS/Android,
 * retourne le custom scheme deep link `rawadventure://`.
 *
 * Permet aux emails de confirmation / reset password d'ouvrir le bon
 * endroit selon la plateforme du user au moment du signup.
 */
function authRedirectBase(): string {
  if (Platform.OS === 'web') {
    // window.location.origin dispo côté web uniquement
    if (typeof window !== 'undefined' && window.location?.origin) {
      return window.location.origin;
    }
    return 'https://app.rawadventure.world';
  }
  return 'rawadventure://';
}

export type AuthResult = {
  user: User | null;
  error: AuthError | null;
};

/**
 * Sprint C auth PWA — cache mémoire (module, jamais persisté) du mot de passe
 * saisi au signup. Permet la recovery "J'ai déjà confirmé via le lien" sur
 * EmailPendingScreen : si l'utilisateur a confirmé en cliquant le lien dans
 * un AUTRE navigateur (Safari fresh vs PWA installée), le code OTP est
 * consommé — on retente alors un signInWithPassword silencieux dans le bon
 * contexte. Perdu au reload du bundle JS : l'écran demande alors le mot de
 * passe manuellement. Effacé dès qu'une session arrive ou au signOut.
 */
let cachedSignupPassword: string | null = null;

export function getCachedSignupPassword(): string | null {
  return cachedSignupPassword;
}

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
  /**
   * Sprint C polish auth — true si la dernière déconnexion a été déclenchée
   * par Supabase suite à un échec de refresh token (session expirée /
   * utilisateur supprimé / refresh révoqué). Permet à RegisterScreen d'afficher
   * un bandeau explicite "Ta session a expiré, reconnecte-toi" au lieu de
   * laisser l'utilisateur perplexe. Repassé à false dès qu'une nouvelle
   * connexion réussit.
   */
  sessionExpired: boolean;
  clearSessionExpired: () => void;
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
  /**
   * Sprint C auth PWA — vérifie le code OTP 6 chiffres reçu par email
   * (template Supabase "Confirm signup" avec `{{ .Token }}`). Crée la session
   * DANS le contexte courant — indispensable sur PWA installée iOS où le
   * click lien ouvre toujours un Safari fresh au lieu de la PWA.
   */
  verifyEmailOtp: (email: string, token: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordRecoveryMode, setPasswordRecoveryMode] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    let hadSession = false;
    // Récupère la session existante au démarrage.
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session ?? null);
        hadSession = !!data.session;
      })
      .finally(() => setLoading(false));

    // Écoute les changements d'état d'authentification (signIn / signOut / refresh).
    // Sprint A auth — capte `PASSWORD_RECOVERY` déclenché quand l'utilisateur
    // arrive depuis le lien email de reset (deep link `rawadventure://...`).
    // Sprint C polish auth — détecte session expirée (SIGNED_OUT après
    // refresh raté ou USER_DELETED).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === 'PASSWORD_RECOVERY') {
        setPasswordRecoveryMode(true);
      }
      // Heuristique : un SIGNED_OUT alors qu'on avait une session active
      // sans appel explicite à signOut() côté UI = session expirée. On ne
      // peut pas distinguer parfaitement, mais ce flag est juste un signal
      // UX. Le flag est posé ; UI le clear quand utile.
      if (event === 'SIGNED_OUT' && hadSession) {
        setSessionExpired(true);
      }
      if (event === 'SIGNED_IN') {
        setSessionExpired(false);
        hadSession = true;
        // Session établie — le cache signup n'a plus de raison d'exister.
        cachedSignupPassword = null;
      }
      if (event === 'TOKEN_REFRESHED') {
        hadSession = true;
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
      const base = authRedirectBase();
      const emailRedirectTo =
        Platform.OS === 'web'
          ? `${base}/confirm-email`
          : `${base}confirm-email`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo },
      });
      if (!error) {
        cachedSignupPassword = password;
      }
      return { user: data.user ?? null, error };
    },
    [],
  );

  const signOut = useCallback(async () => {
    cachedSignupPassword = null;
    await supabase.auth.signOut();
  }, []);

  const resetPasswordForEmail = useCallback(
    async (email: string): Promise<{ error: AuthError | null }> => {
      // Deep link cible IA-Reset. Le scheme `rawadventure://` est déclaré
      // dans app.json. Supabase ajoute ses tokens en fragment d'URL et
      // déclenche `PASSWORD_RECOVERY` côté client à l'ouverture.
      const base = authRedirectBase();
      const redirectTo =
        Platform.OS === 'web'
          ? `${base}/reset-password`
          : `${base}reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
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

  const clearSessionExpired = useCallback(() => {
    setSessionExpired(false);
  }, []);

  const resendConfirmationEmail = useCallback(
    async (email: string): Promise<{ error: AuthError | null }> => {
      const base = authRedirectBase();
      const emailRedirectTo =
        Platform.OS === 'web'
          ? `${base}/confirm-email`
          : `${base}confirm-email`;
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo },
      });
      return { error };
    },
    [],
  );

  const verifyEmailOtp = useCallback(
    async (email: string, token: string): Promise<{ error: AuthError | null }> => {
      // `type: 'signup'` = confirmation de compte non confirmé. Si Supabase
      // renvoyait "token not found" sur un code régénéré par resend, retenter
      // avec `type: 'email'` serait le fallback documenté — pas observé à ce
      // jour, pas de branche.
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: token.trim(),
        type: 'signup',
      });
      // Succès → session posée automatiquement → onAuthStateChange SIGNED_IN.
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
        sessionExpired,
        clearSessionExpired,
        signInWithPassword,
        signUpWithPassword,
        signOut,
        resetPasswordForEmail,
        updateUserPassword,
        clearPasswordRecoveryMode,
        resendConfirmationEmail,
        verifyEmailOtp,
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

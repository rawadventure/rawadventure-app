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
  signInWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signUpWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupère la session existante au démarrage.
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session ?? null);
      })
      .finally(() => setLoading(false));

    // Écoute les changements d'état d'authentification (signIn / signOut / refresh).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
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
      const { data, error } = await supabase.auth.signUp({ email, password });
      return { user: data.user ?? null, error };
    },
    [],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        signInWithPassword,
        signUpWithPassword,
        signOut,
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

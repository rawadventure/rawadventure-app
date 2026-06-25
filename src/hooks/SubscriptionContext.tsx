/**
 * SubscriptionContext — état abonnement utilisateur.
 *
 * Réf Feature Spec abonnement V1.0 §4 (états + mapping accès), §5 (paywall),
 * §7 (lapse), §10 (Reader App pattern).
 *
 * Source de vérité : table Supabase `public.subscriptions`. Le webhook Stripe
 * (Edge Function) écrit dans cette table après chaque event d'abonnement.
 *
 * V1 transition : on garde aussi une copie locale AsyncStorage pour DEV mock
 * + offline read au démarrage. Quand session arrive, on synchronise depuis
 * Supabase et on écoute les changements via Postgres Changes (Supabase
 * realtime).
 *
 * États possibles (FSM) :
 *  - free       : Phase 0 accessible, paywall bloque Phase 1+
 *  - trial      : Phase 0 active (J1-J14), paywall bloque Phase 1+
 *  - active     : tous accès débloqués
 *  - past_due   : grace 7 jours, accès Phase 1 maintenu temporairement
 *  - cancelled  : accès Phase 1 jusqu'à renewsAt, puis expired
 *  - expired    : Phase 1 gelée, Phase 0 accessible
 *
 * `isActive` = booléen agrégé pour gating UI (sessions, paywall, etc.).
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { devNow } from '../lib/devClock';

export type SubscriptionStatus =
  | 'free'
  | 'trial'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'expired';

export type SubscriptionPlan = 'monthly' | 'semestrial' | 'annual';

export type SubscriptionState = {
  status: SubscriptionStatus;
  plan: SubscriptionPlan | null;
  startedAt: string | null; // ISO
  renewsAt: string | null; // ISO
  cancelledAt: string | null; // ISO
};

const DEFAULT_STATE: SubscriptionState = {
  status: 'free',
  plan: null,
  startedAt: null,
  renewsAt: null,
  cancelledAt: null,
};

const STORAGE_KEY = 'subscription_state';

interface SubscriptionContextType {
  state: SubscriptionState;
  loading: boolean;
  /** True si l'utilisateur a accès payant à Phase 1+ (active OU cancelled jusqu'à renewsAt OU past_due grace). */
  isActive: boolean;
  /** Force refetch depuis Supabase (utile post-checkout deep link). */
  reload: () => Promise<void>;
  /** DEV / mock : pose un état arbitraire en local. Webhook réel écrit côté Supabase. */
  setMockSubscriptionState: (next: Partial<SubscriptionState>) => Promise<void>;
  /** Reset à l'état free (local only, ne touche pas Supabase). */
  resetSubscription: () => Promise<void>;
}

type SubscriptionRow = {
  user_id: string;
  status: SubscriptionStatus;
  plan: SubscriptionPlan | null;
  started_at: string | null;
  renews_at: string | null;
  cancelled_at: string | null;
};

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

function computeIsActive(state: SubscriptionState): boolean {
  if (state.status === 'active') return true;
  if (state.status === 'past_due') {
    // Grace 7 jours après échéance — V1 : on tolère simplement.
    return true;
  }
  if (state.status === 'cancelled' && state.renewsAt) {
    return new Date(state.renewsAt).getTime() > devNow();
  }
  return false;
}

function rowToState(row: SubscriptionRow): SubscriptionState {
  return {
    status: row.status,
    plan: row.plan,
    startedAt: row.started_at,
    renewsAt: row.renews_at,
    cancelledAt: row.cancelled_at,
  };
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<SubscriptionState>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);

  // Sauvegarde locale (AsyncStorage) pour offline + DEV mock.
  const persistLocal = useCallback(async (next: SubscriptionState) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  /**
   * Charge depuis Supabase si user connecté, sinon depuis AsyncStorage.
   *
   * Cas particuliers :
   *  - User non connecté (anonyme onboarding) → AsyncStorage uniquement
   *  - User connecté + row Supabase absente → cas exceptionnel (trigger
   *    on_auth_user_created devrait l'avoir créée). On insère 'free' par
   *    sécurité.
   *  - User connecté + row présente → source de vérité Supabase
   */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (!user) {
        // Mode anonyme : AsyncStorage
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        setState(raw ? (JSON.parse(raw) as SubscriptionState) : DEFAULT_STATE);
        return;
      }

      // Mode connecté : Supabase
      const { data, error } = await supabase
        .from('subscriptions')
        .select('user_id, status, plan, started_at, renews_at, cancelled_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.warn('SubscriptionContext load error', error);
        // Fallback AsyncStorage local
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        setState(raw ? (JSON.parse(raw) as SubscriptionState) : DEFAULT_STATE);
        return;
      }

      if (!data) {
        // Trigger pas passé pour cet user — sécurité : crée la row 'free'
        await supabase.from('subscriptions').insert({
          user_id: user.id,
          status: 'free',
        });
        setState(DEFAULT_STATE);
        await persistLocal(DEFAULT_STATE);
        return;
      }

      const next = rowToState(data as SubscriptionRow);
      setState(next);
      await persistLocal(next);
    } finally {
      setLoading(false);
    }
  }, [user, persistLocal]);

  // Reload quand user change.
  useEffect(() => {
    void load();
  }, [load]);

  // Realtime : écoute les changements sur la row de cet user.
  // Supabase Realtime → Postgres Changes filtrés par user_id.
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  useEffect(() => {
    if (!user) {
      if (channelRef.current) {
        void supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      return;
    }

    const channel = supabase
      .channel(`subscriptions:user:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const row = payload.new as SubscriptionRow;
          if (row && row.user_id === user.id) {
            const next = rowToState(row);
            setState(next);
            void persistLocal(next);
          }
        },
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      void supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [user, persistLocal]);

  const setMockSubscriptionState = useCallback(
    async (next: Partial<SubscriptionState>) => {
      const merged = { ...state, ...next };
      setState(merged);
      await persistLocal(merged);
      // En DEV, on écrit aussi côté Supabase si user connecté pour cohérence.
      // Permet de tester le gating Phase 1+ avec un état réaliste.
      if (user) {
        await supabase
          .from('subscriptions')
          .update({
            status: merged.status,
            plan: merged.plan,
            started_at: merged.startedAt,
            renews_at: merged.renewsAt,
            cancelled_at: merged.cancelledAt,
          })
          .eq('user_id', user.id);
      }
    },
    [state, user, persistLocal],
  );

  const resetSubscription = useCallback(async () => {
    setState(DEFAULT_STATE);
    await AsyncStorage.removeItem(STORAGE_KEY);
    if (user) {
      await supabase
        .from('subscriptions')
        .update({
          status: 'free',
          plan: null,
          started_at: null,
          renews_at: null,
          cancelled_at: null,
        })
        .eq('user_id', user.id);
    }
  }, [user]);

  // clockEpoch force recompute quand mock clock change (DEV uniquement).
  const [clockEpoch, setClockEpoch] = useState(0);
  useEffect(() => {
    if (!__DEV__) return;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { subscribeDevClock } = require('../lib/devClock');
    return subscribeDevClock(() => setClockEpoch((e) => e + 1));
  }, []);
  const isActive = useMemo(() => computeIsActive(state), [state, clockEpoch]);

  return (
    <SubscriptionContext.Provider
      value={{
        state,
        loading,
        isActive,
        reload: load,
        setMockSubscriptionState,
        resetSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription doit être utilisé dans SubscriptionProvider');
  return ctx;
}

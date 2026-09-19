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
import { isDevToolsEnabled } from '../lib/devToolsEnabled';

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
// F-09 : le mock DEV vit sous sa propre clé, lue UNIQUEMENT quand les dev
// tools sont actifs. Il prime alors sur Supabase (survit au reload — bug DEV
// n°2 de la salve de tests) et n'écrit jamais côté serveur.
const MOCK_STORAGE_KEY = 'subscription_state_mock';

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
   * Cas particuliers (F-09 audit Lou : le client ne modifie JAMAIS la table
   * `subscriptions` — seul le webhook Stripe en service role écrit) :
   *  - Dev tools actifs + mock local présent → le mock prime (test gating)
   *  - User non connecté (anonyme onboarding) → AsyncStorage uniquement
   *  - User connecté + row Supabase absente → free (la création de la row
   *    appartient au trigger on_auth_user_created, pas au client)
   *  - User connecté + row présente → source de vérité Supabase
   *  - Erreur de chargement → état conservé (le fallback local n'existe
   *    qu'en dev tools : en prod un état AsyncStorage est manipulable
   *    depuis la console navigateur — pas une source d'autorisation)
   */
  const load = useCallback(async (opts?: { silent?: boolean }) => {
    // `silent` : rafraîchit sans lever le flag global `loading`. Évite que le
    // RootNavigator bascule sur LoadingScreen (qui démonterait toute la nav)
    // sur un reload transitoire — ex : PaywallScreen qui reload à son ouverture
    // provoquait un retour à l'accueil au 1er clic. Le boot initial reste
    // non-silent (affiche bien le LoadingScreen au démarrage).
    if (!opts?.silent) setLoading(true);
    try {
      // Mock DEV : prime sur toute autre source tant que dev tools actifs.
      if (isDevToolsEnabled()) {
        const rawMock = await AsyncStorage.getItem(MOCK_STORAGE_KEY);
        if (rawMock) {
          setState(JSON.parse(rawMock) as SubscriptionState);
          return;
        }
      }

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
        if (isDevToolsEnabled()) {
          // Confort dev offline : dernier état synchronisé.
          const raw = await AsyncStorage.getItem(STORAGE_KEY);
          setState(raw ? (JSON.parse(raw) as SubscriptionState) : DEFAULT_STATE);
        }
        // Hors dev : état en mémoire conservé, un reload() ultérieur
        // (ouverture Paywall, retour premier plan) retentera.
        return;
      }

      if (!data) {
        // Trigger on_auth_user_created pas encore passé pour cet user —
        // on reste free côté client, la row arrivera côté serveur (F-09 :
        // pas d'insert client, la policy RLS est SELECT only).
        setState(DEFAULT_STATE);
        await persistLocal(DEFAULT_STATE);
        return;
      }

      const next = rowToState(data as SubscriptionRow);
      setState(next);
      await persistLocal(next);
    } finally {
      if (!opts?.silent) setLoading(false);
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

  // F-09 : mock strictement local (clé dédiée, lue par load() en dev tools
  // uniquement). Plus aucune écriture Supabase côté client — la table
  // `subscriptions` n'est modifiée que par le webhook Stripe (service role).
  const setMockSubscriptionState = useCallback(
    async (next: Partial<SubscriptionState>) => {
      if (!isDevToolsEnabled()) return;
      const merged = { ...state, ...next };
      setState(merged);
      await AsyncStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(merged));
    },
    [state],
  );

  const resetSubscription = useCallback(async () => {
    setState(DEFAULT_STATE);
    await AsyncStorage.multiRemove([STORAGE_KEY, MOCK_STORAGE_KEY]);
  }, []);

  // clockEpoch force recompute quand mock clock change (DEV tools uniquement).
  const [clockEpoch, setClockEpoch] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { isDevToolsEnabled } = require('../lib/devToolsEnabled');
    if (!isDevToolsEnabled()) return;
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
        // reload silencieux : rafraîchit sans flip du flag loading global
        // (sinon RootNavigator démonte la nav → retour accueil intempestif).
        reload: () => load({ silent: true }),
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

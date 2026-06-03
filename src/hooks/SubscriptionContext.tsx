/**
 * SubscriptionContext — état abonnement utilisateur.
 *
 * Réf Feature Spec abonnement V1.0 §4 (états + mapping accès), §5 (paywall),
 * §7 (lapse), §10 (Reader App pattern).
 *
 * V1 mock : la source de vérité est AsyncStorage (clé `subscription_state`).
 * Sera remplacé par Supabase + webhook Stripe en post-V1 (cf. §9.1 spec).
 * Les DEV buttons ProfilTabScreen permettent de simuler chaque état.
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
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  /** Force refresh depuis AsyncStorage. */
  reload: () => Promise<void>;
  /** DEV / mock : pose un état arbitraire. Webhook réel le fera plus tard. */
  setMockSubscriptionState: (next: Partial<SubscriptionState>) => Promise<void>;
  /** Reset à l'état free. */
  resetSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

function computeIsActive(state: SubscriptionState): boolean {
  if (state.status === 'active') return true;
  if (state.status === 'past_due') {
    // Grace 7 jours après échéance — on tolère tant que < 7j après startedAt
    // ou renewsAt (selon disponibilité).
    // V1 mock : tolère simplement.
    return true;
  }
  if (state.status === 'cancelled' && state.renewsAt) {
    return new Date(state.renewsAt).getTime() > Date.now();
  }
  return false;
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SubscriptionState>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SubscriptionState;
        setState(parsed);
      } else {
        setState(DEFAULT_STATE);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setMockSubscriptionState = useCallback(
    async (next: Partial<SubscriptionState>) => {
      const merged = { ...state, ...next };
      setState(merged);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    },
    [state],
  );

  const resetSubscription = useCallback(async () => {
    setState(DEFAULT_STATE);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const isActive = useMemo(() => computeIsActive(state), [state]);

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

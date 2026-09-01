/**
 * Tests d'intégration SubscriptionContext — FSM abonnement, calcul isActive
 * (gating paywall Phase 1+), chargement anonyme/connecté, realtime, reload
 * silencieux (bug retour accueil PaywallScreen).
 *
 * Réf Feature Spec abonnement V1.0 §4, §5, §7.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { type ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';

jest.mock('../../lib/supabase', () => {
  const { createSupabaseMock } = require('../../test-utils/supabaseMock');
  const m = createSupabaseMock();
  return { supabase: m.client, __supabaseMock: m };
});

let mockUser: { id: string } | null = null;
jest.mock('../AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
}));

import {
  SubscriptionProvider,
  useSubscription,
  type SubscriptionState,
} from '../SubscriptionContext';
import { pinClockTo, unpinClock } from '../../test-utils/harness';
import { advanceDevClock } from '../../lib/devClock';

const { __supabaseMock: sb } = jest.requireMock('../../lib/supabase') as {
  __supabaseMock: import('../../test-utils/supabaseMock').SupabaseMock;
};

function wrapper({ children }: { children: ReactNode }) {
  return <SubscriptionProvider>{children}</SubscriptionProvider>;
}

async function renderSubscription() {
  const utils = await renderHook(() => useSubscription(), { wrapper });
  await waitFor(() => expect(utils.result.current.loading).toBe(false));
  return utils;
}

function subRow(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    user_id: 'user-1',
    status: 'active',
    plan: 'monthly',
    started_at: '2026-10-01T10:00:00.000Z',
    renews_at: '2026-11-01T10:00:00.000Z',
    cancelled_at: null,
    ...overrides,
  };
}

beforeEach(async () => {
  mockUser = null;
  sb.reset();
  jest.clearAllMocks();
  await AsyncStorage.clear();
  pinClockTo('2026-10-15');
});

afterEach(() => {
  unpinClock();
});

describe('mode anonyme (AsyncStorage)', () => {
  test('sans état stocké : free, pas d accès Phase 1', async () => {
    const { result } = await renderSubscription();
    expect(result.current.state.status).toBe('free');
    expect(result.current.isActive).toBe(false);
  });

  test('état actif stocké localement : rechargé au boot', async () => {
    const stored: SubscriptionState = {
      status: 'active',
      plan: 'annual',
      startedAt: '2026-10-01T10:00:00.000Z',
      renewsAt: '2027-10-01T10:00:00.000Z',
      cancelledAt: null,
    };
    await AsyncStorage.setItem('subscription_state', JSON.stringify(stored));
    const { result } = await renderSubscription();
    expect(result.current.state.status).toBe('active');
    expect(result.current.isActive).toBe(true);
  });
});

describe('calcul isActive — gating Phase 1+ (FSM §4)', () => {
  test.each([
    ['free', false],
    ['trial', false],
    ['active', true],
    ['past_due', true], // grace 7 jours
    ['expired', false],
  ] as const)('statut %s → isActive %s', async (status, expected) => {
    await AsyncStorage.setItem(
      'subscription_state',
      JSON.stringify({
        status,
        plan: 'monthly',
        startedAt: null,
        renewsAt: null,
        cancelledAt: null,
      }),
    );
    const { result } = await renderSubscription();
    expect(result.current.isActive).toBe(expected);
  });

  test('cancelled avec renewsAt futur : accès maintenu jusqu à échéance', async () => {
    await AsyncStorage.setItem(
      'subscription_state',
      JSON.stringify({
        status: 'cancelled',
        plan: 'monthly',
        startedAt: '2026-09-15T10:00:00.000Z',
        renewsAt: '2026-10-20T10:00:00.000Z', // dans 5 jours (clock épinglée au 15)
        cancelledAt: '2026-10-10T10:00:00.000Z',
      }),
    );
    const { result } = await renderSubscription();
    expect(result.current.isActive).toBe(true);
  });

  test('cancelled avec renewsAt passé : accès coupé', async () => {
    await AsyncStorage.setItem(
      'subscription_state',
      JSON.stringify({
        status: 'cancelled',
        plan: 'monthly',
        startedAt: '2026-08-15T10:00:00.000Z',
        renewsAt: '2026-10-10T10:00:00.000Z', // passé
        cancelledAt: '2026-09-20T10:00:00.000Z',
      }),
    );
    const { result } = await renderSubscription();
    expect(result.current.isActive).toBe(false);
  });

  test('cancelled : l accès expire quand l échéance passe (recompute au changement de jour)', async () => {
    await AsyncStorage.setItem(
      'subscription_state',
      JSON.stringify({
        status: 'cancelled',
        plan: 'monthly',
        startedAt: '2026-09-15T10:00:00.000Z',
        renewsAt: '2026-10-17T10:00:00.000Z',
        cancelledAt: '2026-10-10T10:00:00.000Z',
      }),
    );
    const { result } = await renderSubscription();
    expect(result.current.isActive).toBe(true);
    await act(async () => advanceDevClock(3)); // 18 octobre > renewsAt
    expect(result.current.isActive).toBe(false);
  });
});

describe('mode connecté (Supabase)', () => {
  beforeEach(() => {
    mockUser = { id: 'user-1' };
  });

  test('row Supabase active → hydrate state + cache local', async () => {
    sb.setTables({ subscriptions: subRow() });
    const { result } = await renderSubscription();
    expect(result.current.state.status).toBe('active');
    expect(result.current.state.plan).toBe('monthly');
    expect(result.current.isActive).toBe(true);
    // Copie locale écrite (offline read au prochain démarrage).
    const raw = await AsyncStorage.getItem('subscription_state');
    expect(JSON.parse(raw!).status).toBe('active');
  });

  test('row absente : insert free par sécurité (trigger raté)', async () => {
    sb.setTables({ subscriptions: [] });
    const { result } = await renderSubscription();
    expect(result.current.state.status).toBe('free');
    const inserts = sb.calls.filter(
      (c) => c.table === 'subscriptions' && c.op === 'insert',
    );
    expect(inserts).toHaveLength(1);
    expect((inserts[0].payload as Record<string, unknown>).status).toBe('free');
  });

  test('event realtime : mise à jour du state sans reload', async () => {
    sb.setTables({ subscriptions: subRow({ status: 'free', plan: null }) });
    const { result } = await renderSubscription();
    expect(result.current.isActive).toBe(false);
    expect(sb.realtimeCallbacks.length).toBeGreaterThanOrEqual(1);
    await act(async () => {
      sb.realtimeCallbacks[0]({ new: subRow({ status: 'active' }) });
    });
    expect(result.current.state.status).toBe('active');
    expect(result.current.isActive).toBe(true);
  });

  test('reload() est silencieux : loading ne repasse pas à true (bug PaywallScreen)', async () => {
    sb.setTables({ subscriptions: subRow({ status: 'free', plan: null }) });
    const { result } = await renderSubscription();
    const loadingDuringReload: boolean[] = [];
    await act(async () => {
      const p = result.current.reload();
      loadingDuringReload.push(result.current.loading);
      await p;
    });
    expect(loadingDuringReload).toEqual([false]);
    expect(result.current.loading).toBe(false);
  });

  test('reload() rafraîchit le state après changement distant (retour paiement)', async () => {
    sb.setTables({ subscriptions: subRow({ status: 'free', plan: null }) });
    const { result } = await renderSubscription();
    expect(result.current.isActive).toBe(false);
    // Le webhook Stripe a écrit pendant que l'app était en arrière-plan.
    sb.setTables({ subscriptions: subRow({ status: 'active' }) });
    await act(async () => {
      await result.current.reload();
    });
    expect(result.current.state.status).toBe('active');
    expect(result.current.isActive).toBe(true);
  });

  test('resetSubscription : retour à free local + update Supabase', async () => {
    sb.setTables({ subscriptions: subRow() });
    const { result } = await renderSubscription();
    expect(result.current.isActive).toBe(true);
    await act(async () => {
      await result.current.resetSubscription();
    });
    expect(result.current.state.status).toBe('free');
    expect(result.current.isActive).toBe(false);
    const updates = sb.calls.filter(
      (c) => c.table === 'subscriptions' && c.op === 'update',
    );
    expect(updates.length).toBeGreaterThanOrEqual(1);
  });
});

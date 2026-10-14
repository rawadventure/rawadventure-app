/**
 * Tests progressStore — F-05.3 audit Lou. Chaque implémentation lit/écrit SA
 * source ; le RemoteStore garde chaque écriture par must() (F-08 : un échec
 * throw au lieu de corrompre le state en silence).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../supabase', () => {
  const { createSupabaseMock } = require('../../test-utils/supabaseMock');
  const m = createSupabaseMock();
  return { supabase: m.client, __supabaseMock: m };
});

import {
  createAnonymousStore,
  createRemoteStore,
  PROGRESS_LOCAL_KEYS,
  progressCacheKey,
} from '../progressStore';

const { __supabaseMock: sb } = jest.requireMock('../supabase') as {
  __supabaseMock: import('../../test-utils/supabaseMock').SupabaseMock;
};

beforeEach(async () => {
  sb.reset();
  await AsyncStorage.clear();
});

describe('AnonymousStore (AsyncStorage)', () => {
  test('round-trip : saves puis load', async () => {
    const store = createAnonymousStore();
    await store.saveOnboarding({ answers: { q1: 'a' }, dynamicId: 'explorateur' });
    await store.saveAccountCreatedAt('2026-10-01T08:00:00.000Z');
    await store.saveNarrativeFlags({ welcome_video: 'x' });
    await store.savePillarState('S2', '2026-10-10T08:00:00.000Z');
    await store.savePendingTier({
      tierId: 15,
      isFirstReach: true,
      streakValue: 15,
      deferredAt: 'x',
    });

    const snap = await store.load();
    expect(snap.onboardingDone).toBe(true);
    expect(snap.onboardingData).toEqual({ q1: 'a' });
    expect(snap.profileDynamicId).toBe('explorateur');
    expect(snap.accountCreatedAt).toBe('2026-10-01T08:00:00.000Z');
    expect(snap.narrativeFlags).toEqual({ welcome_video: 'x' });
    expect(snap.currentPillarId).toBe('S2');
    expect(snap.pendingTierReach).toMatchObject({ tierId: 15 });
    expect(snap.pillarEvaluations).toBeNull();
  });

  test('savePendingTier(null) efface la clé', async () => {
    const store = createAnonymousStore();
    await store.savePendingTier({
      tierId: 15,
      isFirstReach: true,
      streakValue: 15,
      deferredAt: 'x',
    });
    await store.savePendingTier(null);
    expect(
      await AsyncStorage.getItem(PROGRESS_LOCAL_KEYS.pendingTierReach),
    ).toBeNull();
  });

  test('reset efface toutes les clés de progression', async () => {
    const store = createAnonymousStore();
    await store.saveNarrativeFlags({ welcome_video: 'x' });
    await store.reset();
    const snap = await store.load();
    expect(snap.narrativeFlags).toBeNull();
    expect(snap.onboardingDone).toBeNull();
  });
});

describe('RemoteStore (Supabase)', () => {
  test('load lit profiles + tables filles', async () => {
    sb.setTables({
      profiles: {
        id: 'u1',
        onboarding_done: true,
        onboarding_data: { q1: 'a' },
        profile_dynamic_id: null,
        account_created_at: '2026-10-01T08:00:00.000Z',
        narrative_flags: { welcome_video: 'x' },
        current_pillar_id: 'S3',
        pillar_started_at: null,
        pending_tier_reach: null,
      },
      streak_history: [
        {
          user_id: 'u1',
          local_date: '2026-10-14',
          validation_status: 'valid_above_threshold',
          phase: 'phase_0',
          streak_value_after: 1,
          joker_used: false,
        },
      ],
      joker_consumptions: [],
      tier_reaches: [],
      pillar_evaluations: [
        {
          user_id: 'u1',
          pillar_id: 'S3',
          evaluation_type: 'initial',
          completed_at: '2026-10-12T08:00:00.000Z',
        },
      ],
    });
    const store = createRemoteStore('u1');
    const snap = await store.load();
    expect(snap.onboardingDone).toBe(true);
    expect(snap.narrativeFlags).toEqual({ welcome_video: 'x' });
    expect(snap.currentPillarId).toBe('S3');
    expect(snap.streakHistory).toHaveLength(1);
    expect(snap.pillarEvaluations).toHaveLength(1);
  });

  test('saveStreakEntry upsert avec user_id', async () => {
    const store = createRemoteStore('u1');
    await store.saveStreakEntry(
      {
        local_date: '2026-10-15',
        validation_status: 'valid_above_threshold',
        phase: 'phase_0',
        streak_value_after: 2,
        joker_used: false,
      },
      [],
    );
    const upserts = sb.calls.filter(
      (c) => c.table === 'streak_history' && c.op === 'upsert',
    );
    expect(upserts).toHaveLength(1);
    expect((upserts[0].payload as Record<string, unknown>).user_id).toBe('u1');
  });

  test('F-08 : écriture en erreur → throw (must)', async () => {
    sb.failNext('streak_history', 'upsert', { message: 'RLS denied' });
    const store = createRemoteStore('u1');
    await expect(
      store.saveStreakEntry(
        {
          local_date: '2026-10-15',
          validation_status: 'valid_above_threshold',
          phase: 'phase_0',
          streak_value_after: 2,
          joker_used: false,
        },
        [],
      ),
    ).rejects.toThrow('RLS denied');
  });

  // Régression retour testeuse (4 oct 2026) : un hub monté avant la fin du
  // chargement écrivait { welcome_video } seul et effaçait j3/j7 en base.
  // L'écriture FUSIONNE avec la colonne distante — un flag posé ne disparaît
  // jamais, et sa date de premier affichage est conservée.
  test('saveNarrativeFlags fusionne avec les flags distants (jamais d écrasement)', async () => {
    sb.setTables({
      profiles: {
        id: 'u1',
        narrative_flags: { welcome_video: 'ancien', j3_charniere: 'ancien' },
      },
    });
    const store = createRemoteStore('u1');
    await store.saveNarrativeFlags({ welcome_video: 'nouveau' });
    const update = sb.calls.find(
      (c) => c.table === 'profiles' && c.op === 'update',
    );
    expect((update!.payload as Record<string, unknown>).narrative_flags).toEqual({
      welcome_video: 'ancien',
      j3_charniere: 'ancien',
    });
  });

  test('saveNarrativeFlags : lecture distante en échec → throw, aucune écriture', async () => {
    sb.failNext('profiles', 'select', { message: 'offline' });
    const store = createRemoteStore('u1');
    await expect(
      store.saveNarrativeFlags({ welcome_video: 'x' }),
    ).rejects.toThrow('offline');
    expect(sb.calls.filter((c) => c.op === 'update')).toHaveLength(0);
  });

  test('reset : update profiles (colonnes F-04 incluses) + deletes des 7 tables', async () => {
    const store = createRemoteStore('u1');
    await store.reset();
    const update = sb.calls.find(
      (c) => c.table === 'profiles' && c.op === 'update',
    );
    expect(update).toBeTruthy();
    expect(
      (update!.payload as Record<string, unknown>).current_pillar_id,
    ).toBeNull();
    const deletes = sb.calls.filter((c) => c.op === 'delete');
    expect(deletes.map((d) => d.table).sort()).toEqual(
      [
        'joker_consumptions',
        'level_adaptive_choices',
        'pillar_evaluations',
        'pillar_sessions',
        'progress',
        'streak_history',
        'tier_reaches',
      ].sort(),
    );
  });
});

// ─── Hors ligne (carte R1-21, retour testeuse 13 oct 2026) ──────────────────
// Sans réseau, supabase-js résout `{ data: null, error }` sur chaque lecture :
// le snapshot revenait entièrement null et le hub se rendait comme un compte
// neuf (« jour zéro »). Le remote store doit lever l'erreur et servir le
// dernier snapshot chargé avec succès, mis en cache par compte.

describe('RemoteStore — hors ligne (R1-21)', () => {
  function seedRemote(overrides: Record<string, unknown> = {}) {
    sb.setTables({
      profiles: {
        id: 'u1',
        onboarding_done: true,
        onboarding_data: { q1: 'a' },
        profile_dynamic_id: null,
        account_created_at: '2026-10-01T08:00:00.000Z',
        narrative_flags: { welcome_video: 'x' },
        current_pillar_id: null,
        pillar_started_at: null,
        pending_tier_reach: null,
        dev_tools_enabled: false,
        ...overrides,
      },
      streak_history: [
        {
          user_id: 'u1',
          local_date: '2026-10-14',
          validation_status: 'valid_above_threshold',
          phase: 'phase_0',
          streak_value_after: 1,
          joker_used: false,
        },
      ],
      joker_consumptions: [],
      tier_reaches: [],
      pillar_evaluations: [],
    });
  }

  test('lecture en erreur sans cache → throw, jamais un snapshot vide', async () => {
    seedRemote();
    sb.failNext('profiles', 'select', { message: 'Failed to fetch' });
    await expect(createRemoteStore('u1').load()).rejects.toThrow(/Failed to fetch/);
  });

  test('lecture réussie → snapshot mis en cache sous une clé propre au compte', async () => {
    seedRemote();
    const snap = await createRemoteStore('u1').load();
    expect(snap.stale).toBeFalsy();
    const raw = await AsyncStorage.getItem(progressCacheKey('u1'));
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!).streakHistory).toHaveLength(1);
  });

  test('lecture en erreur avec cache → snapshot du cache, marqué périmé, panneau DEV coupé', async () => {
    seedRemote({ dev_tools_enabled: true });
    const store = createRemoteStore('u1');
    const fresh = await store.load();
    expect(fresh.devToolsEnabled).toBe(true);

    sb.failNext('streak_history', 'select', { message: 'Failed to fetch' });
    const snap = await store.load();
    expect(snap.stale).toBe(true);
    expect(snap.onboardingDone).toBe(true);
    expect(snap.streakHistory).toHaveLength(1);
    expect(snap.narrativeFlags).toEqual({ welcome_video: 'x' });
    // Le flag DEV n'est jamais servi depuis le stockage local (manipulable
    // depuis la console navigateur en PWA).
    expect(snap.devToolsEnabled).toBeNull();
  });

  test('le cache d un autre compte n est jamais servi', async () => {
    seedRemote();
    await createRemoteStore('u1').load();
    sb.failNext('profiles', 'select', { message: 'Failed to fetch' });
    await expect(createRemoteStore('u2').load()).rejects.toThrow();
  });

  test('reset efface aussi le cache local', async () => {
    seedRemote();
    const store = createRemoteStore('u1');
    await store.load();
    await store.reset();
    expect(await AsyncStorage.getItem(progressCacheKey('u1'))).toBeNull();
  });
});

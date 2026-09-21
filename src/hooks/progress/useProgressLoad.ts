/**
 * useProgressLoad — chargement et composition des snapshots (F-05.5,
 * audit Lou — extrait de ProgressContext, même comportement).
 *
 * Le store anonyme sert de secours de transition en connecté (comptes
 * d'avant F-04) ; le remote est la source de vérité. La composition
 * (union des flags, backfill account_created_at, fallback pilier depuis
 * les évals) vit ici, pas dans les stores.
 */

import { type MutableRefObject } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';
import {
  createAnonymousStore,
  createRemoteStore,
  type ProgressSnapshot,
} from '../../lib/progressStore';
import type { ProgressData } from '../../lib/progressData';
import type { JokerConsumption, StreakEntry } from '../../lib/streak';
import {
  LOCAL_KEYS,
  type NarrativeEventId,
  type PendingMigration,
  type PendingTierReach,
  type TierReach,
} from './types';

type ProgressLoadDeps = {
  user: { id: string } | null;
  dataRef: MutableRefObject<ProgressData>;
  commitData: (next: ProgressData) => void;
  narrativeFlagsRef: MutableRefObject<Partial<Record<NarrativeEventId, string>>>;
  setLoading: (v: boolean) => void;
  setOnboardingDone: (v: boolean) => void;
  setOnboardingData: (v: Record<string, string>) => void;
  setProfileDynamicId: (v: string | null) => void;
  setAccountCreatedAtState: (v: string | null) => void;
  setNarrativeFlagsSynced: (f: Partial<Record<NarrativeEventId, string>>) => void;
  setCurrentPillarId: (v: string | null) => void;
  setPillarStartedAt: (v: string | null) => void;
  setS8FinalCompleted: (v: boolean) => void;
  setPendingTierReachState: (v: PendingTierReach | null) => void;
  setPendingMigrationState: (v: PendingMigration | null) => void;
};

export function createProgressLoader({
  user,
  dataRef,
  commitData,
  narrativeFlagsRef,
  setLoading,
  setOnboardingDone,
  setOnboardingData,
  setProfileDynamicId,
  setAccountCreatedAtState,
  setNarrativeFlagsSynced,
  setCurrentPillarId,
  setPillarStartedAt,
  setS8FinalCompleted,
  setPendingTierReachState,
  setPendingMigrationState,
}: ProgressLoadDeps) {
  const loadData = async () => {
    setLoading(true);
    try {
      const local = await createAnonymousStore().load();
      const remote = user ? await createRemoteStore(user.id).load() : null;
      applySnapshots(local, remote, user?.id ?? null);
      // Sprint B email confirm — restaure pendingMigration (clé locale pure).
      const rawPM = await AsyncStorage.getItem(LOCAL_KEYS.pendingMigration);
      if (rawPM) setPendingMigrationState(JSON.parse(rawPM));
    } catch (e) {
      console.error('[ProgressContext] Erreur chargement progression:', e);
    } finally {
      setLoading(false);
    }
  };

  /**
   * F-05.3 — applique les snapshots des stores au state React.
   * `remote` null = mode anonyme. La composition (union des flags, secours
   * local, backfill, dérivation du pilier depuis les évals — F-04) vit ici,
   * pas dans les stores.
   */
  const applySnapshots = (
    local: ProgressSnapshot,
    remote: ProgressSnapshot | null,
    userId: string | null,
  ) => {
    const primary = remote ?? local;
    if (primary.onboardingDone != null) setOnboardingDone(primary.onboardingDone);
    if (primary.onboardingData != null) setOnboardingData(primary.onboardingData);
    setProfileDynamicId(primary.profileDynamicId ?? null);

    if (remote && userId) {
      // Backfill `account_created_at` pour les comptes V0 antérieurs à la
      // migration 001. Fire-and-forget : si l'écriture échoue, on retentera
      // au prochain boot.
      if (!remote.accountCreatedAt && (remote.onboardingDone ?? false)) {
        const nowIso = new Date().toISOString();
        setAccountCreatedAtState(nowIso);
        supabase
          .from('profiles')
          .update({ account_created_at: nowIso })
          .eq('id', userId)
          .then(({ error }) => {
            if (error)
              console.warn('[ProgressContext] backfill accountCreatedAt failed', error);
          });
      } else {
        setAccountCreatedAtState(remote.accountCreatedAt);
      }
    } else if (local.accountCreatedAt != null) {
      setAccountCreatedAtState(local.accountCreatedAt);
    }

    commitData({
      streakHistory:
        (primary.streakHistory as StreakEntry[] | null) ??
        dataRef.current.streakHistory,
      jokerConsumptions:
        (primary.jokerConsumptions as JokerConsumption[] | null) ??
        dataRef.current.jokerConsumptions,
      tierReaches:
        (primary.tierReaches as TierReach[] | null) ?? dataRef.current.tierReaches,
    });

    const evalRows = remote?.pillarEvaluations ?? [];
    setS8FinalCompleted(
      evalRows.some((r) => r.pillar_id === 'S8' && r.evaluation_type === 'final'),
    );

    // Flags : union locale ∪ distante, la ref in-flight prime (un flag posé
    // en mémoire pendant que ce load était en vol — deux loadData
    // concurrents post-OTP — ne doit pas être écrasé).
    const mergedFlags = {
      ...(local.narrativeFlags ?? {}),
      ...(remote?.narrativeFlags ?? {}),
      ...narrativeFlagsRef.current,
    } as Partial<Record<NarrativeEventId, string>>;
    if (Object.keys(mergedFlags).length > 0) {
      setNarrativeFlagsSynced(mergedFlags);
    }

    // Pilier : remote d'abord, storage local en secours, sinon dérivation
    // depuis la dernière évaluation (« changement de téléphone » — on ne
    // repart plus jamais à S1 par défaut si l'utilisateur a des évals).
    if (remote?.currentPillarId) {
      setCurrentPillarId(remote.currentPillarId);
      setPillarStartedAt(remote.pillarStartedAt);
    } else if (local.currentPillarId) {
      setCurrentPillarId(local.currentPillarId);
      if (local.pillarStartedAt) setPillarStartedAt(local.pillarStartedAt);
    } else if (evalRows.length > 0) {
      const latest = evalRows.reduce((a, b) =>
        (a.completed_at ?? '') >= (b.completed_at ?? '') ? a : b,
      );
      setCurrentPillarId(latest.pillar_id);
    }

    const pending = remote?.pendingTierReach ?? local.pendingTierReach;
    if (pending) setPendingTierReachState(pending as PendingTierReach);
  };


  return loadData;
}

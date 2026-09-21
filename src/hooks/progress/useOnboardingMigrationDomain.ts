/**
 * useOnboardingMigrationDomain — onboarding, migration locale → distante
 * au signup (M7+A3, §2.10), reset DEV (F-05.5, audit Lou — extrait de
 * ProgressContext, même comportement).
 */

import { useCallback, type MutableRefObject } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';
import { must } from '../../lib/supabaseMust';
import {
  createAnonymousStore,
  createRemoteStore,
  type ProgressStore,
} from '../../lib/progressStore';
import { EMPTY_PROGRESS_DATA, type ProgressData } from '../../lib/progressData';
import type { JokerConsumption, StreakEntry } from '../../lib/streak';
import {
  type TierReach,
  LOCAL_KEYS,
  type NarrativeEventId,
  type PendingMigration,
  type PendingTierReach,
} from './types';

type OnboardingMigrationDeps = {
  user: { id: string } | null;
  store: ProgressStore;
  dataRef: MutableRefObject<ProgressData>;
  commitData: (next: ProgressData) => void;
  narrativeFlagsRef: MutableRefObject<Partial<Record<NarrativeEventId, string>>>;
  accountCreatedAt: string | null;
  onboardingData: Record<string, string>;
  profileDynamicId: string | null;
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

export function useOnboardingMigrationDomain({
  user,
  store,
  dataRef,
  commitData,
  narrativeFlagsRef,
  accountCreatedAt,
  onboardingData,
  profileDynamicId,
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
}: OnboardingMigrationDeps) {
  const markPendingMigration = useCallback(
    async (userId: string, accountCreatedAtIso: string, email?: string) => {
      const pm: PendingMigration = { userId, accountCreatedAt: accountCreatedAtIso, email };
      setPendingMigrationState(pm);
      await AsyncStorage.setItem(LOCAL_KEYS.pendingMigration, JSON.stringify(pm));
    },
    [],
  );

  const clearPendingMigration = useCallback(async () => {
    setPendingMigrationState(null);
    await AsyncStorage.removeItem(LOCAL_KEYS.pendingMigration);
  }, [setPendingMigrationState]);


  /**
   * Migration des données AsyncStorage anonymes vers Supabase à la création
   * de compte (M7+A3 — Feature Spec V1 Socle minimum §2.10).
   *
   * À appeler depuis IA-10 RegisterScreen après `signUpWithPassword`
   * réussi. Effectue :
   *  1. Update profile (onboarding_done + onboarding_data + profile_dynamic_id
   *     + account_created_at)
   *  2. Upsert progress (Phase 0 jours déjà cochés en anonyme, généralement vide)
   *  3. Upsert streak_history / joker_consumptions / tier_reaches (idem)
   *  4. Clear des 9 clés AsyncStorage anonymes
   *  5. Met à jour le state local accountCreatedAt
   *
   * Le trigger Supabase `on_auth_user_created` a déjà créé la ligne `profiles`
   * avec des valeurs par défaut — on l'update simplement.
   */
  const migrateLocalToRemote = useCallback(
    async (userId: string, accountCreatedAtIso: string) => {
      const dynamicId =
        profileDynamicId ??
        (await AsyncStorage.getItem(LOCAL_KEYS.profileDynamicId).then((v) =>
          v ? JSON.parse(v) : null,
        ));

      // F-03 (audit Lou) : chaque écriture passe par must() — supabase-js ne
      // throw pas, il résout { error }. Sans la garde, une écriture échouée
      // laissait la migration « réussir » puis effacer les clés locales →
      // perte définitive des données anonymes. Un throw ici remonte au catch
      // de l'effet pendingMigration, qui CONSERVE pendingMigration pour retry
      // au prochain load. Les upserts sont idempotents (onConflict) : rejouer
      // une migration partiellement écrite est sûr — pas besoin de RPC
      // atomique côté Postgres en V1.
      //
      // Source des données : AsyncStorage d'abord, state en secours. Après un
      // échec, loadData (connecté) a pu écraser le state avec le remote
      // (vide) — un retry qui lirait les closures migrerait alors du vide et
      // effacerait les clés locales « avec succès ». Le storage anonyme reste
      // la source de vérité tant que la migration n'a pas abouti.
      const readLocal = async <T,>(key: string, fallback: T): Promise<T> => {
        const raw = await AsyncStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
      };
      const localHistory = await readLocal<StreakEntry[]>(
        LOCAL_KEYS.streakHistory,
        dataRef.current.streakHistory,
      );
      const localJokers = await readLocal<JokerConsumption[]>(
        LOCAL_KEYS.jokerConsumptions,
        dataRef.current.jokerConsumptions,
      );
      const localTiers = await readLocal<TierReach[]>(
        LOCAL_KEYS.tierReaches,
        dataRef.current.tierReaches,
      );
      // F-04 : les flags narratifs et le palier différé migrent aussi vers
      // profiles (colonnes ajoutées par la migration 20260921).
      const localFlags = await readLocal<Partial<Record<NarrativeEventId, string>>>(
        LOCAL_KEYS.narrativeFlags,
        narrativeFlagsRef.current,
      );
      const localPendingTier = await readLocal<PendingTierReach | null>(
        LOCAL_KEYS.pendingTierReach,
        null,
      );

      // 1. Update profil distant avec onboarding_data + profile_dynamic_id
      await must(
        supabase
          .from('profiles')
          .update({
            onboarding_done: true,
            onboarding_data: onboardingData,
            profile_dynamic_id: dynamicId,
            account_created_at: accountCreatedAtIso,
            narrative_flags: localFlags,
            pending_tier_reach: localPendingTier,
          })
          .eq('id', userId),
      );

      // Le loadData() déclenché par l'arrivée de la session a pu lire
      // onboarding_done=false AVANT ce write (race) et écraser le state →
      // OnboardingScreen re-affiché à tort. On repose le state tout de suite ;
      // le re-load post-migration (effet pendingMigration) re-synchronisera
      // le reste depuis le remote.
      setOnboardingDone(true);

      // 2. streak_history (Sprint 24 : table `progress` plus alimentée
      //    en mode anonyme — validateDay l'écrit directement quand l'user
      //    est connecté).
      if (localHistory.length > 0) {
        const rows = localHistory.map((e) => ({ user_id: userId, ...e }));
        await must(
          supabase
            .from('streak_history')
            .upsert(rows, { onConflict: 'user_id,local_date' }),
        );
      }

      // 4. joker_consumptions
      if (localJokers.length > 0) {
        const rows = localJokers.map((c) => ({ user_id: userId, ...c }));
        await must(
          supabase
            .from('joker_consumptions')
            .upsert(rows, { onConflict: 'user_id,week_key' }),
        );
      }

      // 5. tier_reaches
      if (localTiers.length > 0) {
        const rows = localTiers.map((t) => ({ user_id: userId, ...t }));
        await must(
          supabase
            .from('tier_reaches')
            .upsert(rows, { onConflict: 'user_id,tier_id' }),
        );
      }

      // 6. Clear local. F-04 : narrative_flags est désormais migré vers la
      // colonne profiles (étape 1) — l'ancienne exception qui le préservait
      // en local n'a plus de raison d'être. Le state in-memory (ref) reste
      // posé, et le re-load post-migration relit la colonne distante.
      await AsyncStorage.multiRemove(Object.values(LOCAL_KEYS));

      // 7. Met à jour le state in-memory accountCreatedAt pour que currentDay
      //    se recalcule immédiatement.
      setAccountCreatedAtState(accountCreatedAtIso);

      // 8. Sprint notifications Phase 0 — planifie les 14 notifs J1-J14
      //    si permission accordée. Idempotent : annule + replanifie.
      //    Silencieux si permission denied (utilisateur peut activer
      //    plus tard depuis Profil et déclencher la replanif manuelle).
      try {
        const { schedulePhase0Notifications } = await import(
          '../../lib/phase0-scheduler'
        );
        await schedulePhase0Notifications(new Date(accountCreatedAtIso));
      } catch (e) {
        // Pas bloquant — la migration est faite, les notifs sont un plus.
        console.warn('Phase 0 notifications scheduling failed', e);
      }
    },
    // dataRef/narrativeFlagsRef : refs stables, lues au moment de la
    // migration, pas figées dans la closure (F-03/F-05.4).
    [
      onboardingData,
      profileDynamicId,
      dataRef,
      narrativeFlagsRef,
      setAccountCreatedAtState,
      setOnboardingDone,
    ],
  );


  const setAccountCreatedAt = useCallback(
    async (iso: string) => {
      setAccountCreatedAtState(iso);
      await store.saveAccountCreatedAt(iso);
    },
    [store],
  );


  // ── Onboarding ────────────────────────────────────────────────────────────

  const completeOnboarding = useCallback(
    async (answers: Record<string, string>, dynamicId?: string) => {
      setOnboardingData(answers);
      setOnboardingDone(true);
      if (dynamicId) setProfileDynamicId(dynamicId);

      // Pose accountCreatedAt = now() si pas encore défini. Couvre :
      //  - user connecté qui re-passe par l'onboarding après resetAll
      //  - user anonyme qui finit onboarding avant IA-10 (le RegisterScreen
      //    écrasera avec sa propre valeur si nécessaire)
      const nowIso = new Date().toISOString();
      const shouldSetCreatedAt = !accountCreatedAt;
      if (shouldSetCreatedAt) {
        setAccountCreatedAtState(nowIso);
      }

      await store.saveOnboarding({
        answers,
        dynamicId,
        accountCreatedAtIso: shouldSetCreatedAt ? nowIso : undefined,
      });
    },
    [store, accountCreatedAt],
  );


  // ── Reset complet (DEV / __DEV__ uniquement) ──────────────────────────────

  const resetAll = useCallback(async () => {
    // 1) Reset tout le state local React
    setOnboardingDone(false);
    setOnboardingData({});
    setProfileDynamicId(null);
    setAccountCreatedAtState(null);
    commitData(EMPTY_PROGRESS_DATA);
    setNarrativeFlagsSynced({});
    setCurrentPillarId(null);
    setPillarStartedAt(null);
    setS8FinalCompleted(false);
    setPendingTierReachState(null);
    setPendingMigrationState(null);

    // 2) Clear TOUT le storage local (mode connecté OU anonyme) — couvre
    // les 12 clés sans exception. Évite que de la stale data survive au
    // reset en mode connecté.
    await createAnonymousStore().reset();

    // 3) Clear toutes les clés daily_check_actions.<date> (coches en cours
    // de plusieurs jours potentiels). Pas dans LOCAL_KEYS car clé dynamique.
    const allKeys = await AsyncStorage.getAllKeys();
    const dailyCheckKeys = allKeys.filter((k) =>
      k.startsWith('daily_check_actions.'),
    );
    if (dailyCheckKeys.length > 0) {
      await AsyncStorage.multiRemove(dailyCheckKeys);
    }

    // 4) Reset Supabase si connecté (store distant — F-08 : chaque écriture
    // gardée par must(), un delete échoué fait échouer le reset visiblement).
    if (user) {
      await createRemoteStore(user.id).reset();
    }
  }, [user]);


  return {
    markPendingMigration,
    clearPendingMigration,
    migrateLocalToRemote,
    setAccountCreatedAt,
    completeOnboarding,
    resetAll,
  };
}

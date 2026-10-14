/**
 * progressStore — persistance de la progression (F-05.3, audit Lou).
 *
 * Une interface, deux implémentations :
 *  - createAnonymousStore() : AsyncStorage (parcours pré-signup)
 *  - createRemoteStore(userId) : Supabase (utilisateur connecté), chaque
 *    écriture gardée par must() — un échec throw, jamais de perte silencieuse
 *    (F-03/F-08).
 *
 * ProgressContext choisit le store selon la session et arrête de brancher
 * `if (user)` dans chaque méthode. La COMPOSITION (merge local ∪ distant,
 * ref in-flight, backfill, fallback pilier depuis les évals) reste dans le
 * contexte : le store lit et écrit UNE source, sans logique métier.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import { must } from './supabaseMust';
import type { Phase, TierId } from './streak';

// Types structurels partagés (le module lib ne dépend pas des hooks — les
// types de ProgressContext leur sont assignables).
export type StoreStreakEntry = {
  local_date: string;
  validation_status: string;
  phase: Phase;
  streak_value_after: number;
  joker_used: boolean;
};
export type StoreJokerConsumption = {
  week_key: string;
  consumed_for_local_date: string;
};
export type StoreTierReach = {
  tier_id: TierId;
  first_reached_at: string;
  last_reached_at: string;
  reach_count: number;
};
export type StorePendingTier = {
  tierId: TierId;
  isFirstReach: boolean;
  streakValue: number;
  deferredAt: string;
};
export type StoreNarrativeFlags = Partial<Record<string, string>>;

export type ProgressSnapshot = {
  onboardingDone: boolean | null;
  onboardingData: Record<string, string> | null;
  profileDynamicId: string | null;
  accountCreatedAt: string | null;
  streakHistory: StoreStreakEntry[] | null;
  jokerConsumptions: StoreJokerConsumption[] | null;
  tierReaches: StoreTierReach[] | null;
  narrativeFlags: StoreNarrativeFlags | null;
  currentPillarId: string | null;
  pillarStartedAt: string | null;
  pendingTierReach: StorePendingTier | null;
  /** Remote uniquement : lignes pillar_evaluations (fallback pilier + flag
   *  post-S8). Null en anonyme (pas d'évals hors connexion, V1). */
  pillarEvaluations:
    | Array<{ pillar_id: string; evaluation_type: string; completed_at: string | null }>
    | null;
  /** F-07/K1 : profiles.dev_tools_enabled — panneau DEV par compte.
   *  Null en anonyme (le mode anonyme n'a pas de compte à flagger). */
  devToolsEnabled: boolean | null;
  /** R1-21 : vrai quand le snapshot vient du cache local parce que la
   *  lecture distante a échoué (hors ligne). Absent/false sinon. */
  stale?: boolean;
};

export interface ProgressStore {
  load(): Promise<ProgressSnapshot>;
  saveStreakEntry(entry: StoreStreakEntry, all: StoreStreakEntry[]): Promise<void>;
  saveJokerConsumption(
    consumption: StoreJokerConsumption,
    all: StoreJokerConsumption[],
  ): Promise<void>;
  saveTierReach(reach: StoreTierReach, all: StoreTierReach[]): Promise<void>;
  saveNarrativeFlags(flags: StoreNarrativeFlags): Promise<void>;
  savePillarState(pillarId: string, startedAtIso: string): Promise<void>;
  savePendingTier(pending: StorePendingTier | null): Promise<void>;
  saveAccountCreatedAt(iso: string): Promise<void>;
  saveOnboarding(args: {
    answers: Record<string, string>;
    dynamicId?: string;
    accountCreatedAtIso?: string;
  }): Promise<void>;
  /** Efface la progression de CETTE source (reset DEV). */
  reset(): Promise<void>;
}

// ─── Clés AsyncStorage (source unique — réexportées pour le contexte) ────────

export const PROGRESS_LOCAL_KEYS = {
  onboardingDone: 'onboarding_done',
  onboardingData: 'onboarding_data',
  profileDynamicId: 'profile_dynamic_id',
  accountCreatedAt: 'account_created_at',
  streakHistory: 'streak_history',
  jokerConsumptions: 'joker_consumptions',
  tierReaches: 'tier_reaches',
  narrativeFlags: 'narrative_flags',
  currentPillarId: 'current_pillar_id',
  pillarStartedAt: 'pillar_started_at',
  pendingTierReach: 'pending_tier_reach',
  pendingMigration: 'pending_migration',
} as const;

/**
 * R1-21 (retour testeuse 13 oct 2026) : clé du dernier snapshot distant
 * chargé avec succès, par compte. Servi quand la lecture Supabase échoue
 * (hors ligne) à la place d'un snapshot vide qui rendait le hub comme un
 * compte neuf (« jour zéro »).
 */
export function progressCacheKey(userId: string): string {
  return `progress_cache:${userId}`;
}

async function readJson<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

// ─── Implémentation AsyncStorage (mode anonyme) ─────────────────────────────

export function createAnonymousStore(): ProgressStore {
  const K = PROGRESS_LOCAL_KEYS;
  return {
    async load() {
      const [
        onboardingDone,
        onboardingData,
        profileDynamicId,
        accountCreatedAt,
        streakHistory,
        jokerConsumptions,
        tierReaches,
        narrativeFlags,
        currentPillarId,
        pillarStartedAt,
        pendingTierReach,
      ] = await Promise.all([
        readJson<boolean>(K.onboardingDone),
        readJson<Record<string, string>>(K.onboardingData),
        readJson<string>(K.profileDynamicId),
        readJson<string>(K.accountCreatedAt),
        readJson<StoreStreakEntry[]>(K.streakHistory),
        readJson<StoreJokerConsumption[]>(K.jokerConsumptions),
        readJson<StoreTierReach[]>(K.tierReaches),
        readJson<StoreNarrativeFlags>(K.narrativeFlags),
        readJson<string>(K.currentPillarId),
        readJson<string>(K.pillarStartedAt),
        readJson<StorePendingTier>(K.pendingTierReach),
      ]);
      return {
        onboardingDone,
        onboardingData,
        profileDynamicId,
        accountCreatedAt,
        streakHistory,
        jokerConsumptions,
        tierReaches,
        narrativeFlags,
        currentPillarId,
        pillarStartedAt,
        pendingTierReach,
        pillarEvaluations: null,
        devToolsEnabled: null,
      };
    },

    async saveStreakEntry(_entry, all) {
      await AsyncStorage.setItem(K.streakHistory, JSON.stringify(all));
    },
    async saveJokerConsumption(_consumption, all) {
      await AsyncStorage.setItem(K.jokerConsumptions, JSON.stringify(all));
    },
    async saveTierReach(_reach, all) {
      await AsyncStorage.setItem(K.tierReaches, JSON.stringify(all));
    },
    async saveNarrativeFlags(flags) {
      await AsyncStorage.setItem(K.narrativeFlags, JSON.stringify(flags));
    },
    async savePillarState(pillarId, startedAtIso) {
      await AsyncStorage.multiSet([
        [K.currentPillarId, JSON.stringify(pillarId)],
        [K.pillarStartedAt, JSON.stringify(startedAtIso)],
      ]);
    },
    async savePendingTier(pending) {
      if (pending) {
        await AsyncStorage.setItem(K.pendingTierReach, JSON.stringify(pending));
      } else {
        await AsyncStorage.removeItem(K.pendingTierReach);
      }
    },
    async saveAccountCreatedAt(iso) {
      await AsyncStorage.setItem(K.accountCreatedAt, JSON.stringify(iso));
    },
    async saveOnboarding({ answers, dynamicId, accountCreatedAtIso }) {
      const sets: Array<[string, string]> = [
        [K.onboardingData, JSON.stringify(answers)],
        [K.onboardingDone, JSON.stringify(true)],
      ];
      if (dynamicId) sets.push([K.profileDynamicId, JSON.stringify(dynamicId)]);
      if (accountCreatedAtIso) {
        sets.push([K.accountCreatedAt, JSON.stringify(accountCreatedAtIso)]);
      }
      await AsyncStorage.multiSet(sets);
    },
    async reset() {
      await AsyncStorage.multiRemove(Object.values(K));
    },
  };
}

/**
 * Fusion de flags narratifs : union des clés, la valeur déjà en base gagne
 * (date du premier affichage conservée). Un flag posé ne disparaît jamais.
 */
export function mergeNarrativeFlags(
  remote: StoreNarrativeFlags | null | undefined,
  incoming: StoreNarrativeFlags | null | undefined,
): StoreNarrativeFlags {
  return { ...(incoming ?? {}), ...(remote ?? {}) } as StoreNarrativeFlags;
}

// ─── Implémentation Supabase (mode connecté) ────────────────────────────────

export function createRemoteStore(userId: string): ProgressStore {
  const cacheKey = progressCacheKey(userId);

  async function loadRemote(): Promise<ProgressSnapshot> {
    // Chaque lecture passe par must() : supabase-js ne throw jamais, il
    // résout `{ data: null, error }` — sans réseau, le snapshot revenait
    // entièrement null (R1-21). Le profil est lu en maybeSingle : un compte
    // dont la ligne n'existe pas encore n'est pas une panne réseau.
    const [p, streakRows, jokerRows, tierRows, evalRows] = await Promise.all([
      must(
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      ) as Promise<Record<string, unknown> | null>,
      must(
        supabase
          .from('streak_history')
          .select(
            'local_date, validation_status, phase, streak_value_after, joker_used',
          )
          .eq('user_id', userId)
          .order('local_date', { ascending: true }),
      ) as Promise<StoreStreakEntry[] | null>,
      must(
        supabase
          .from('joker_consumptions')
          .select('week_key, consumed_for_local_date')
          .eq('user_id', userId),
      ) as Promise<StoreJokerConsumption[] | null>,
      must(
        supabase.from('tier_reaches').select('*').eq('user_id', userId),
      ) as Promise<StoreTierReach[] | null>,
      must(
        supabase
          .from('pillar_evaluations')
          .select('pillar_id, evaluation_type, completed_at')
          .eq('user_id', userId),
      ) as Promise<ProgressSnapshot['pillarEvaluations']>,
    ]);
    return {
      onboardingDone: (p?.onboarding_done as boolean | undefined) ?? null,
      onboardingData:
        (p?.onboarding_data as Record<string, string> | undefined) ?? null,
      profileDynamicId: (p?.profile_dynamic_id as string | undefined) ?? null,
      accountCreatedAt: (p?.account_created_at as string | undefined) ?? null,
      streakHistory: streakRows ?? null,
      jokerConsumptions: jokerRows ?? null,
      tierReaches: tierRows ?? null,
      narrativeFlags:
        (p?.narrative_flags as StoreNarrativeFlags | undefined) ?? null,
      currentPillarId: (p?.current_pillar_id as string | undefined) ?? null,
      pillarStartedAt: (p?.pillar_started_at as string | undefined) ?? null,
      pendingTierReach:
        (p?.pending_tier_reach as StorePendingTier | undefined) ?? null,
      pillarEvaluations: evalRows ?? null,
      devToolsEnabled: (p?.dev_tools_enabled as boolean | undefined) ?? null,
    };
  }

  return {
    async load() {
      let snap: ProgressSnapshot;
      try {
        snap = await loadRemote();
      } catch (e) {
        // Hors ligne (ou panne) : dernier snapshot chargé avec succès pour
        // CE compte, marqué périmé. Sans cache, l'erreur remonte — le
        // chargeur ne doit jamais recevoir un snapshot vide.
        const cached = await readJson<ProgressSnapshot>(cacheKey);
        if (!cached) throw e;
        // Le flag DEV n'est jamais servi depuis le stockage local :
        // manipulable depuis la console navigateur en PWA (même posture
        // que SubscriptionContext).
        return { ...cached, devToolsEnabled: null, stale: true };
      }
      // Cache fire-and-forget : un échec d'écriture locale ne doit pas
      // bloquer un chargement réussi.
      AsyncStorage.setItem(cacheKey, JSON.stringify(snap)).catch(() => {});
      return snap;
    },

    async saveStreakEntry(entry) {
      await must(
        supabase.from('streak_history').upsert(
          { user_id: userId, ...entry },
          { onConflict: 'user_id,local_date' },
        ),
      );
    },
    async saveJokerConsumption(consumption) {
      await must(
        supabase.from('joker_consumptions').upsert(
          { user_id: userId, ...consumption },
          { onConflict: 'user_id,week_key' },
        ),
      );
    },
    async saveTierReach(reach) {
      await must(
        supabase.from('tier_reaches').upsert(
          { user_id: userId, ...reach },
          { onConflict: 'user_id,tier_id' },
        ),
      );
    },
    async saveNarrativeFlags(flags) {
      // Lire-fusionner-écrire : la colonne n'est jamais remplacée par la
      // seule mémoire de l'app (retour testeuse 4 oct 2026 — une mémoire
      // vide effaçait les flags déjà posés). Non atomique, mais les flags
      // sont posés une fois et jamais retirés hors reset().
      const row = await must(
        supabase
          .from('profiles')
          .select('narrative_flags')
          .eq('id', userId)
          .single(),
      );
      const remote =
        ((row as { narrative_flags?: StoreNarrativeFlags | null } | null)
          ?.narrative_flags as StoreNarrativeFlags | null | undefined) ?? null;
      await must(
        supabase
          .from('profiles')
          .update({ narrative_flags: mergeNarrativeFlags(remote, flags) })
          .eq('id', userId),
      );
    },
    async savePillarState(pillarId, startedAtIso) {
      await must(
        supabase
          .from('profiles')
          .update({ current_pillar_id: pillarId, pillar_started_at: startedAtIso })
          .eq('id', userId),
      );
    },
    async savePendingTier(pending) {
      await must(
        supabase
          .from('profiles')
          .update({ pending_tier_reach: pending })
          .eq('id', userId),
      );
    },
    async saveAccountCreatedAt(iso) {
      await must(
        supabase
          .from('profiles')
          .update({ account_created_at: iso })
          .eq('id', userId),
      );
    },
    async saveOnboarding({ answers, dynamicId, accountCreatedAtIso }) {
      await must(
        supabase
          .from('profiles')
          .update({
            onboarding_done: true,
            onboarding_data: answers,
            ...(dynamicId ? { profile_dynamic_id: dynamicId } : {}),
            ...(accountCreatedAtIso
              ? { account_created_at: accountCreatedAtIso }
              : {}),
          })
          .eq('id', userId),
      );
    },
    async reset() {
      await Promise.all([
        must(
          supabase
            .from('profiles')
            .update({
              onboarding_done: false,
              onboarding_data: {},
              profile_dynamic_id: null,
              account_created_at: null,
              narrative_flags: {},
              current_pillar_id: null,
              pillar_started_at: null,
              pending_tier_reach: null,
            })
            .eq('id', userId),
        ),
        must(supabase.from('progress').delete().eq('user_id', userId)),
        must(supabase.from('streak_history').delete().eq('user_id', userId)),
        must(supabase.from('joker_consumptions').delete().eq('user_id', userId)),
        must(supabase.from('tier_reaches').delete().eq('user_id', userId)),
        must(supabase.from('pillar_evaluations').delete().eq('user_id', userId)),
        must(supabase.from('pillar_sessions').delete().eq('user_id', userId)),
        must(
          supabase.from('level_adaptive_choices').delete().eq('user_id', userId),
        ),
        AsyncStorage.removeItem(cacheKey),
      ]);
    },
  };
}

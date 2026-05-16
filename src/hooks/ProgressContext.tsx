/**
 * ProgressContext — état du parcours utilisateur.
 *
 * Source de vérité in-memory + persistance hybride :
 *  - en mode anonyme (avant création de compte) : AsyncStorage local
 *  - en mode connecté : Supabase (avec cache local pour la session courante)
 *
 * Réf docs : Feature Spec V1 Socle minimum §2.3 (gestion temporelle), §2.4
 * (check quotidien et seuils 5/7 et 1/3), §2.5 (streak + joker hebdo), §2.6
 * (paliers). Décisions D6, D24, D26, D27, D28, D29, D34.
 *
 * REFACTOR Sprint 3 (chantier M2 + M3) — ajoute :
 *   - calcul calendaire : `accountCreatedAt`, `currentDay`, `currentPhase`
 *   - mécanique streak/joker calendaire : `streakHistory`, `jokerConsumptions`,
 *     `tierReaches`, `jokerAvailable`, `streak` correctement calculé
 *   - méthode `validateDay()` qui orchestre `progress` + `streak_history` +
 *     `joker_consumptions` + `tier_reaches` selon §2.5
 *
 * API legacy V0 conservée pour compatibilité avec les écrans HomeScreen /
 * ChecklistScreen / DayScreen / ProtocolScreen / ConversionScreen non encore
 * migrés (refonte écrans = Sprint 4+) : `completeDay`, `isDayCompleted`,
 * `isDayUnlocked`, `completedDays`, `minimumDays`, `streak`, `resetAll`. La
 * sémantique de `streak` reste le compte des jours validés mais passe désormais
 * par le calcul streak_history (et donc gère joker / cassure).
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
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import {
  currentDayInParcours,
  currentWeekKey,
  todayLocalDate,
  type LocalDate,
} from '../lib/calendar';
import {
  applyStreakIncrement,
  currentStreakFromHistory,
  determineValidationStatus,
  isJokerAvailable,
  THRESHOLD_PHASE_0_TOTAL,
  tierJustReached,
  type JokerConsumption,
  type Phase,
  type StreakEntry,
  type TierId,
} from '../lib/streak';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TierReach = {
  tier_id: TierId;
  first_reached_at: string;
  last_reached_at: string;
  reach_count: number;
};

interface ProgressContextType {
  // ── état chargement
  loading: boolean;

  // ── onboarding
  onboardingDone: boolean;
  onboardingData: Record<string, string>;
  profileDynamicId: string | null;

  // ── calendrier
  accountCreatedAt: string | null;
  currentDay: number; // jour 1-based depuis accountCreatedAt
  currentPhase: Phase;

  // ── streak / joker
  streak: number;
  jokerAvailable: boolean;
  streakHistory: StreakEntry[];
  tierReaches: TierReach[];

  // ── API legacy V0 (compat écrans non migrés)
  completedDays: number[];
  minimumDays: number[];
  isDayCompleted: (day: number) => boolean;
  isDayUnlocked: (day: number) => boolean;
  completeDay: (day: number, isMinimum?: boolean) => Promise<void>;

  // ── API V1 (Sprint 3+)
  validateDay: (args: ValidateDayArgs) => Promise<ValidateDayResult>;
  setAccountCreatedAt: (iso: string) => Promise<void>;
  /** Flags des écrans narratifs déjà vus (Feature Spec V1 §2.3). */
  narrativeFlags: Partial<Record<NarrativeEventId, string>>;
  /** Marque un écran narratif comme déjà vu. Idempotent. Pose un timestamp ISO. */
  markNarrativeSeen: (id: NarrativeEventId) => Promise<void>;
  /** Sprint 4 (M7+A3) : pousse les données AsyncStorage anonymes vers Supabase
   *  après que l'utilisateur ait créé son compte à IA-10. Appelle obligatoirement
   *  avec un `userId` valide (issu de `signUpWithPassword`). */
  migrateLocalToRemote: (userId: string, accountCreatedAtIso: string) => Promise<void>;

  // ── lifecycle
  completeOnboarding: (
    answers: Record<string, string>,
    profileDynamicId?: string,
  ) => Promise<void>;
  resetAll: () => Promise<void>;
}

export type ValidateDayArgs = {
  /** Jour du parcours 1-based (correspondant à `progress.day_id` en Phase 0). */
  day?: number;
  /** Date calendaire locale concernée (par défaut : aujourd'hui). */
  localDate?: LocalDate;
  phase?: Phase;
  /** Nombre d'actions/sessions cochées par l'utilisateur. */
  actionsCount: number;
  /** Soft-rappel D26 dépassé ? `true` si l'utilisateur a tapé "Valider quand même". */
  userValidatedManually?: boolean;
};

export type ValidateDayResult = {
  newStreak: number;
  jokerUsed: boolean;
  tierReached: TierId | null;
  /** `true` si c'est la première fois que ce palier est franchi (D29 →
   *  IA-50 variante vidéo). `false` pour redéclenchements après cassure. */
  tierIsFirstReach: boolean;
};

const ProgressContext = createContext<ProgressContextType | null>(null);

// Clés AsyncStorage (mode anonyme — avant création de compte)
const LOCAL_KEYS = {
  onboardingDone: 'onboarding_done',
  onboardingData: 'onboarding_data',
  profileDynamicId: 'profile_dynamic_id',
  accountCreatedAt: 'account_created_at',
  completedDays: 'completed_days',
  minimumDays: 'minimum_days',
  streakHistory: 'streak_history',
  jokerConsumptions: 'joker_consumptions',
  tierReaches: 'tier_reaches',
  narrativeFlags: 'narrative_flags',
};

/**
 * Identifiants stables des écrans narratifs qui ne doivent se jouer qu'une
 * seule fois (Feature Spec V1 Socle minimum §2.3).
 *
 * Stockés dans `narrativeFlags` (AsyncStorage en V1 — pas encore synchronisés
 * vers Supabase). Le flag est posé au déclenchement, pas à la fermeture
 * (§2.3 — si l'utilisateur ferme pendant la vidéo, l'écran ne se rejoue pas).
 */
export type NarrativeEventId =
  | 'welcome_video'    // IA-12 J1
  | 'j3_charniere'     // IA-14 J3
  | 'j7_charniere'     // IA-14 J7
  | 'j11_charniere'    // IA-14 J11
  | 'j14_charniere'    // IA-14 J14
  | 's0_1_screen'      // IA-20 S0.1
  | 's0_2_screen'      // IA-21 S0.2
  | 'phase0_to_s1_transition' // IA-45
  | 's8_exit_screen';  // IA-22

// ─── Provider ────────────────────────────────────────────────────────────────

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  // Onboarding
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [onboardingData, setOnboardingData] = useState<Record<string, string>>({});
  const [profileDynamicId, setProfileDynamicId] = useState<string | null>(null);
  const [accountCreatedAt, setAccountCreatedAtState] = useState<string | null>(null);

  // Streak / joker V1
  const [streakHistory, setStreakHistory] = useState<StreakEntry[]>([]);
  const [jokerConsumptions, setJokerConsumptions] = useState<JokerConsumption[]>([]);
  const [tierReaches, setTierReaches] = useState<TierReach[]>([]);

  // API legacy V0
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [minimumDays, setMinimumDays] = useState<number[]>([]);

  // Flags écrans narratifs déjà vus (§2.3) — local-only V1.
  const [narrativeFlags, setNarrativeFlags] = useState<
    Partial<Record<NarrativeEventId, string>>
  >({});

  // ── Chargement initial / changement d'utilisateur ─────────────────────────
  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (user) {
        await loadFromSupabase(user.id);
      } else {
        await loadFromAsyncStorage();
      }
    } catch (e) {
      console.error('[ProgressContext] Erreur chargement progression:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadFromSupabase = async (userId: string) => {
    const [
      profileRes,
      progressRes,
      streakRes,
      jokerRes,
      tierRes,
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('progress').select('*').eq('user_id', userId),
      supabase
        .from('streak_history')
        .select('local_date, validation_status, phase, streak_value_after, joker_used')
        .eq('user_id', userId)
        .order('local_date', { ascending: true }),
      supabase
        .from('joker_consumptions')
        .select('week_key, consumed_for_local_date')
        .eq('user_id', userId),
      supabase.from('tier_reaches').select('*').eq('user_id', userId),
    ]);

    if (profileRes.data) {
      setOnboardingDone(profileRes.data.onboarding_done ?? false);
      setOnboardingData(profileRes.data.onboarding_data ?? {});
      setProfileDynamicId(profileRes.data.profile_dynamic_id ?? null);

      // Backfill `account_created_at` pour les comptes V0 antérieurs à la
      // migration 001 (colonne ajoutée mais non renseignée). On pose `now()`
      // sur le premier boot V1 — l'utilisateur démarre son parcours
      // calendaire au moment où il revient dans l'app V1. Idempotent.
      const remoteCreatedAt = profileRes.data.account_created_at ?? null;
      if (!remoteCreatedAt && (profileRes.data.onboarding_done ?? false)) {
        const nowIso = new Date().toISOString();
        setAccountCreatedAtState(nowIso);
        // Fire-and-forget : si l'écriture échoue, on retentera au prochain boot.
        supabase
          .from('profiles')
          .update({ account_created_at: nowIso })
          .eq('id', userId)
          .then(({ error }) => {
            if (error) console.warn('[ProgressContext] backfill accountCreatedAt failed', error);
          });
      } else {
        setAccountCreatedAtState(remoteCreatedAt);
      }
    }
    if (progressRes.data) {
      setCompletedDays(progressRes.data.map((r: any) => r.day_id));
      setMinimumDays(
        progressRes.data.filter((r: any) => r.is_minimum).map((r: any) => r.day_id),
      );
    }
    if (streakRes.data) setStreakHistory(streakRes.data as StreakEntry[]);
    if (jokerRes.data) setJokerConsumptions(jokerRes.data as JokerConsumption[]);
    if (tierRes.data) setTierReaches(tierRes.data as TierReach[]);

    // Narrative flags : local-only V1 même en mode connecté (pas de table
    // distante dédiée pour l'instant — Sprint 7+).
    const rawFlags = await AsyncStorage.getItem(LOCAL_KEYS.narrativeFlags);
    if (rawFlags) setNarrativeFlags(JSON.parse(rawFlags));
  };

  const loadFromAsyncStorage = async () => {
    const [
      done,
      data,
      dynamicId,
      createdAt,
      days,
      minDays,
      history,
      consumptions,
      tiers,
    ] = await Promise.all([
      AsyncStorage.getItem(LOCAL_KEYS.onboardingDone),
      AsyncStorage.getItem(LOCAL_KEYS.onboardingData),
      AsyncStorage.getItem(LOCAL_KEYS.profileDynamicId),
      AsyncStorage.getItem(LOCAL_KEYS.accountCreatedAt),
      AsyncStorage.getItem(LOCAL_KEYS.completedDays),
      AsyncStorage.getItem(LOCAL_KEYS.minimumDays),
      AsyncStorage.getItem(LOCAL_KEYS.streakHistory),
      AsyncStorage.getItem(LOCAL_KEYS.jokerConsumptions),
      AsyncStorage.getItem(LOCAL_KEYS.tierReaches),
    ]);
    if (done) setOnboardingDone(JSON.parse(done));
    if (data) setOnboardingData(JSON.parse(data));
    if (dynamicId) setProfileDynamicId(JSON.parse(dynamicId));
    if (createdAt) setAccountCreatedAtState(JSON.parse(createdAt));
    if (days) setCompletedDays(JSON.parse(days));
    if (minDays) setMinimumDays(JSON.parse(minDays));
    if (history) setStreakHistory(JSON.parse(history));
    if (consumptions) setJokerConsumptions(JSON.parse(consumptions));
    if (tiers) setTierReaches(JSON.parse(tiers));
    const rawFlags = await AsyncStorage.getItem(LOCAL_KEYS.narrativeFlags);
    if (rawFlags) setNarrativeFlags(JSON.parse(rawFlags));
  };

  const markNarrativeSeen = useCallback(
    async (id: NarrativeEventId) => {
      if (narrativeFlags[id]) return; // déjà marqué — idempotent
      const next = { ...narrativeFlags, [id]: new Date().toISOString() };
      setNarrativeFlags(next);
      await AsyncStorage.setItem(LOCAL_KEYS.narrativeFlags, JSON.stringify(next));
    },
    [narrativeFlags],
  );

  // ── Calculs dérivés ───────────────────────────────────────────────────────

  const currentDay = useMemo(() => {
    if (!accountCreatedAt) return 0;
    return currentDayInParcours(accountCreatedAt);
  }, [accountCreatedAt]);

  const currentPhase: Phase = useMemo(() => {
    // Phase 0 = J1 à J14, plus l'état initial (currentDay = 0, accountCreatedAt
    // null ou futur). Au-delà de J14 on bascule en S0 puis Phase 1 — pour
    // l'instant tout > 14 est traité comme Phase 1 côté streak. La nuance S0
    // (jours 15-16) sera distinguée quand IA-20 / IA-21 seront codés.
    return currentDay <= 14 ? 'phase_0' : 'phase_1';
  }, [currentDay]);

  const streak = useMemo(
    () => currentStreakFromHistory(streakHistory),
    [streakHistory],
  );

  const jokerAvailable = useMemo(
    () => isJokerAvailable(jokerConsumptions, todayLocalDate()),
    [jokerConsumptions],
  );

  // ── Méthodes V1 ──────────────────────────────────────────────────────────

  const persistStreakHistoryEntry = useCallback(
    async (entry: StreakEntry, userId: string | undefined) => {
      if (userId) {
        await supabase.from('streak_history').upsert(
          { user_id: userId, ...entry },
          { onConflict: 'user_id,local_date' },
        );
      } else {
        const next = [...streakHistory.filter((e) => e.local_date !== entry.local_date), entry];
        next.sort((a, b) => a.local_date.localeCompare(b.local_date));
        await AsyncStorage.setItem(LOCAL_KEYS.streakHistory, JSON.stringify(next));
      }
    },
    [streakHistory],
  );

  const persistJokerConsumption = useCallback(
    async (consumption: JokerConsumption, userId: string | undefined) => {
      if (userId) {
        await supabase.from('joker_consumptions').upsert(
          { user_id: userId, ...consumption },
          { onConflict: 'user_id,week_key' },
        );
      } else {
        const next = [
          ...jokerConsumptions.filter((c) => c.week_key !== consumption.week_key),
          consumption,
        ];
        await AsyncStorage.setItem(LOCAL_KEYS.jokerConsumptions, JSON.stringify(next));
      }
    },
    [jokerConsumptions],
  );

  const persistTierReach = useCallback(
    async (tierId: TierId, streakValue: number, userId: string | undefined) => {
      const now = new Date().toISOString();
      const existing = tierReaches.find((t) => t.tier_id === tierId);
      const updated: TierReach = existing
        ? {
            ...existing,
            last_reached_at: now,
            reach_count: existing.reach_count + 1,
          }
        : {
            tier_id: tierId,
            first_reached_at: now,
            last_reached_at: now,
            reach_count: 1,
          };

      if (userId) {
        await supabase.from('tier_reaches').upsert(
          { user_id: userId, ...updated },
          { onConflict: 'user_id,tier_id' },
        );
      } else {
        const next = [...tierReaches.filter((t) => t.tier_id !== tierId), updated];
        await AsyncStorage.setItem(LOCAL_KEYS.tierReaches, JSON.stringify(next));
      }
      // streakValue référencé pour la signature même si non stocké dans `tier_reaches`
      // (schéma alternatif PK composite §2.3) — utilisé en analytics future.
      void streakValue;
      return updated;
    },
    [tierReaches],
  );

  const validateDay = useCallback(
    async (args: ValidateDayArgs): Promise<ValidateDayResult> => {
      const localDate = args.localDate ?? todayLocalDate();
      const phase = args.phase ?? currentPhase;
      const userValidatedManually = args.userValidatedManually ?? true;

      const decision = determineValidationStatus({
        phase,
        actionsCount: args.actionsCount,
        userValidatedManually,
        jokerAvailable,
      });
      const newStreak = applyStreakIncrement(streak, decision.streakIncrement);
      const tierReached = tierJustReached(streak, newStreak);

      // 1) Écrit l'entrée streak_history
      const entry: StreakEntry = {
        local_date: localDate,
        validation_status: decision.status,
        phase,
        streak_value_after: newStreak,
        joker_used: decision.jokerUsed,
      };
      await persistStreakHistoryEntry(entry, user?.id);
      setStreakHistory((prev) => {
        const next = [...prev.filter((e) => e.local_date !== entry.local_date), entry];
        next.sort((a, b) => a.local_date.localeCompare(b.local_date));
        return next;
      });

      // 2) Consomme le joker si nécessaire
      if (decision.jokerUsed) {
        const consumption: JokerConsumption = {
          week_key: currentWeekKey(),
          consumed_for_local_date: localDate,
        };
        await persistJokerConsumption(consumption, user?.id);
        setJokerConsumptions((prev) => [
          ...prev.filter((c) => c.week_key !== consumption.week_key),
          consumption,
        ]);
      }

      // 3) Écrit la ligne `progress` en Phase 0 si on a un day_id explicite
      if (phase === 'phase_0' && args.day != null) {
        const isMinimum = decision.status !== 'valid_above_threshold';
        if (user) {
          await supabase.from('progress').upsert(
            {
              user_id: user.id,
              day_id: args.day,
              is_minimum: isMinimum,
              actions_count: Math.min(args.actionsCount, THRESHOLD_PHASE_0_TOTAL),
              validated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,day_id' },
          );
        }
        setCompletedDays((prev) => (prev.includes(args.day!) ? prev : [...prev, args.day!]));
        if (isMinimum) {
          setMinimumDays((prev) => (prev.includes(args.day!) ? prev : [...prev, args.day!]));
        }
        // Mode local : sync AsyncStorage des listes legacy
        if (!user) {
          const updatedDays = completedDays.includes(args.day)
            ? completedDays
            : [...completedDays, args.day];
          await AsyncStorage.setItem(
            LOCAL_KEYS.completedDays,
            JSON.stringify(updatedDays),
          );
          if (isMinimum) {
            const updatedMin = minimumDays.includes(args.day)
              ? minimumDays
              : [...minimumDays, args.day];
            await AsyncStorage.setItem(
              LOCAL_KEYS.minimumDays,
              JSON.stringify(updatedMin),
            );
          }
        }
      }

      // 4) Enregistre le franchissement de palier
      let tierIsFirstReach = false;
      if (tierReached) {
        const updated = await persistTierReach(tierReached, newStreak, user?.id);
        tierIsFirstReach = updated.reach_count === 1;
        setTierReaches((prev) => [
          ...prev.filter((t) => t.tier_id !== tierReached),
          updated,
        ]);
      }

      return { newStreak, jokerUsed: decision.jokerUsed, tierReached, tierIsFirstReach };
    },
    [
      currentPhase,
      jokerAvailable,
      streak,
      persistStreakHistoryEntry,
      persistJokerConsumption,
      persistTierReach,
      user,
      completedDays,
      minimumDays,
    ],
  );

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

      // 1. Update profil distant avec onboarding_data + profile_dynamic_id
      await supabase
        .from('profiles')
        .update({
          onboarding_done: true,
          onboarding_data: onboardingData,
          profile_dynamic_id: dynamicId,
          account_created_at: accountCreatedAtIso,
        })
        .eq('id', userId);

      // 2. Progress (Phase 0 jours déjà cochés) — généralement vide à la création
      //    de compte mais on copie pour être robuste.
      if (completedDays.length > 0) {
        const rows = completedDays.map((day) => ({
          user_id: userId,
          day_id: day,
          is_minimum: minimumDays.includes(day),
          actions_count: minimumDays.includes(day) ? 3 : 7,
        }));
        await supabase.from('progress').upsert(rows, { onConflict: 'user_id,day_id' });
      }

      // 3. streak_history (idem)
      if (streakHistory.length > 0) {
        const rows = streakHistory.map((e) => ({ user_id: userId, ...e }));
        await supabase
          .from('streak_history')
          .upsert(rows, { onConflict: 'user_id,local_date' });
      }

      // 4. joker_consumptions
      if (jokerConsumptions.length > 0) {
        const rows = jokerConsumptions.map((c) => ({ user_id: userId, ...c }));
        await supabase
          .from('joker_consumptions')
          .upsert(rows, { onConflict: 'user_id,week_key' });
      }

      // 5. tier_reaches
      if (tierReaches.length > 0) {
        const rows = tierReaches.map((t) => ({ user_id: userId, ...t }));
        await supabase
          .from('tier_reaches')
          .upsert(rows, { onConflict: 'user_id,tier_id' });
      }

      // 6. Clear local
      await AsyncStorage.multiRemove(Object.values(LOCAL_KEYS));

      // 7. Met à jour le state in-memory accountCreatedAt pour que currentDay
      //    se recalcule immédiatement.
      setAccountCreatedAtState(accountCreatedAtIso);
    },
    [
      onboardingData,
      profileDynamicId,
      completedDays,
      minimumDays,
      streakHistory,
      jokerConsumptions,
      tierReaches,
    ],
  );

  const setAccountCreatedAt = useCallback(
    async (iso: string) => {
      setAccountCreatedAtState(iso);
      if (user) {
        await supabase
          .from('profiles')
          .update({ account_created_at: iso })
          .eq('id', user.id);
      } else {
        await AsyncStorage.setItem(LOCAL_KEYS.accountCreatedAt, JSON.stringify(iso));
      }
    },
    [user],
  );

  // ── Onboarding ────────────────────────────────────────────────────────────

  const completeOnboarding = useCallback(
    async (answers: Record<string, string>, dynamicId?: string) => {
      setOnboardingData(answers);
      setOnboardingDone(true);
      if (dynamicId) setProfileDynamicId(dynamicId);

      if (user) {
        await supabase
          .from('profiles')
          .update({
            onboarding_done: true,
            onboarding_data: answers,
            ...(dynamicId ? { profile_dynamic_id: dynamicId } : {}),
          })
          .eq('id', user.id);
      } else {
        await AsyncStorage.setItem(LOCAL_KEYS.onboardingData, JSON.stringify(answers));
        await AsyncStorage.setItem(LOCAL_KEYS.onboardingDone, JSON.stringify(true));
        if (dynamicId) {
          await AsyncStorage.setItem(
            LOCAL_KEYS.profileDynamicId,
            JSON.stringify(dynamicId),
          );
        }
      }
    },
    [user],
  );

  // ── API legacy V0 (compat écrans non migrés) ──────────────────────────────

  const completeDay = useCallback(
    async (day: number, isMinimum = false) => {
      // Bridge legacy → V1 validateDay. Le count exact n'est pas connu côté
      // V0 (juste un flag isMinimum), donc on traduit avec des valeurs proxy
      // qui produisent le bon `validation_status` en sortie de
      // `determineValidationStatus`. À supprimer quand les écrans M2+M3 sont
      // refondus (Sprint 4+) et appellent `validateDay` directement.
      const actionsCount = isMinimum ? 3 : 7;
      await validateDay({
        day,
        phase: 'phase_0',
        actionsCount,
        userValidatedManually: true,
      });
    },
    [validateDay],
  );

  const isDayCompleted = useCallback(
    (day: number) => completedDays.includes(day),
    [completedDays],
  );
  const isDayUnlocked = useCallback(
    (day: number) => day === 1 || completedDays.includes(day - 1),
    [completedDays],
  );

  // ── Reset complet (DEV / __DEV__ uniquement) ──────────────────────────────

  const resetAll = useCallback(async () => {
    setOnboardingDone(false);
    setOnboardingData({});
    setProfileDynamicId(null);
    setAccountCreatedAtState(null);
    setCompletedDays([]);
    setMinimumDays([]);
    setStreakHistory([]);
    setJokerConsumptions([]);
    setTierReaches([]);
    setNarrativeFlags({});
    if (user) {
      await AsyncStorage.removeItem(LOCAL_KEYS.narrativeFlags);
    }

    if (user) {
      await Promise.all([
        supabase
          .from('profiles')
          .update({
            onboarding_done: false,
            onboarding_data: {},
            profile_dynamic_id: null,
            account_created_at: null,
          })
          .eq('id', user.id),
        supabase.from('progress').delete().eq('user_id', user.id),
        supabase.from('streak_history').delete().eq('user_id', user.id),
        supabase.from('joker_consumptions').delete().eq('user_id', user.id),
        supabase.from('tier_reaches').delete().eq('user_id', user.id),
      ]);
    } else {
      await AsyncStorage.multiRemove(Object.values(LOCAL_KEYS));
    }
  }, [user]);

  return (
    <ProgressContext.Provider
      value={{
        loading,
        onboardingDone,
        onboardingData,
        profileDynamicId,
        accountCreatedAt,
        currentDay,
        currentPhase,
        streak,
        jokerAvailable,
        streakHistory,
        tierReaches,
        completedDays,
        minimumDays,
        isDayCompleted,
        isDayUnlocked,
        completeDay,
        validateDay,
        setAccountCreatedAt,
        migrateLocalToRemote,
        narrativeFlags,
        markNarrativeSeen,
        completeOnboarding,
        resetAll,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress doit être utilisé dans un ProgressProvider');
  return ctx;
}

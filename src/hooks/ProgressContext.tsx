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
  addDays,
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

  // ── Phase 1 — pilier en cours
  /** Identifiant du pilier Phase 1 actif ('S1' à 'S8'). `null` tant que la
   *  semaine pilier n'a pas démarré (sortie IA-41). */
  currentPillarId: string | null;
  /** Timestamp ISO de démarrage de la semaine pilier (sortie IA-41
   *  "Démarrer cette semaine"). `null` tant que pas démarré. */
  pillarStartedAt: string | null;
  /** Jour 1-7 dans la semaine du pilier en cours, calculé depuis pillarStartedAt.
   *  `0` si pilier pas démarré. */
  dayInPillarWeek: number;

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
  /**
   * DEV uniquement (gated par __DEV__ côté caller) : simule un parcours
   * jusqu'au jour cible avec `targetDay - 1` jours valid_above_threshold
   * pré-remplis. Pose `accountCreatedAt = targetDay - 1` jours dans le passé.
   * Clear streak_history / joker_consumptions / tier_reaches existants.
   */
  seedDevStreak: (targetDay: number) => Promise<void>;
  /** Enregistre une évaluation 12 questions (IA-40 initiale ou IA-46 finale).
   *  Réf Feature Spec S1 §2.5 + Schéma de données V1.1 §2.4. */
  savePillarEvaluation: (args: SavePillarEvaluationArgs) => Promise<void>;
  /** DEV uniquement : simule un pilier au jour cible (1-7). Pose
   *  currentPillarId + pillarStartedAt = (targetDay-1) jours dans le passé.
   *  Ne touche pas streak_history. */
  seedDevPillarDay: (pillarId: string, targetDay: number) => Promise<void>;
  /** Démarre la semaine d'un pilier de Phase 1 (sortie IA-41 "Démarrer cette
   *  semaine"). Pose `currentPillarId` et `pillarStartedAt = now()`. */
  startPillarWeek: (pillarId: string) => Promise<void>;
  /** Enregistre une session pratiquée en Phase 1 (sortie IA-43).
   *  Réf Feature Spec S1 §4.4 + Schéma de données V1.1 §2.5. */
  savePillarSession: (args: SavePillarSessionArgs) => Promise<void>;
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

export type SavePillarSessionArgs = {
  pillarId: string;
  /** Jour dans la semaine du pilier (1-7). */
  dayInWeek: number;
  /** Index de la session du jour (1 matin / 2 midi / 3 soir). */
  sessionIndex: 1 | 2 | 3;
  /** Date locale `YYYY-MM-DD` de la session. */
  localDate: string;
  /** Durée effective de la session en secondes (utile si change de niveau en cours de semaine). */
  durationSeconds?: number;
};

export type SavePillarEvaluationArgs = {
  /** Identifiant du pilier ('S1' à 'S8'). */
  pillarId: string;
  /** 'initial' (IA-40) ou 'final' (IA-46). */
  evaluationType: 'initial' | 'final';
  /** Tableau brut des 12 réponses ([{ question_id, value }]). */
  responses: Array<{ question_id: number; value: 1 | 2 | 3 | 4 | 5 }>;
  rawScore: number;
  normalizedScore: number;
  diagnosticLevel: 1 | 2 | 3 | 4 | 5;
  engagementLevelRecommended: 'essentiel' | 'progression' | 'immersion';
  engagementLevelChosen: 'essentiel' | 'progression' | 'immersion';
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
  currentPillarId: 'current_pillar_id',
  pillarStartedAt: 'pillar_started_at',
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

  // Phase 1 — pilier en cours (local-only V1)
  const [currentPillarId, setCurrentPillarId] = useState<string | null>(null);
  const [pillarStartedAt, setPillarStartedAt] = useState<string | null>(null);

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

    // Pilier en cours : local-only V1 (Sprint 10+ : migration vers une
    // colonne `current_pillar_id` + `pillar_started_at` sur `profiles`).
    const [rawPid, rawPstart] = await Promise.all([
      AsyncStorage.getItem(LOCAL_KEYS.currentPillarId),
      AsyncStorage.getItem(LOCAL_KEYS.pillarStartedAt),
    ]);
    if (rawPid) setCurrentPillarId(JSON.parse(rawPid));
    if (rawPstart) setPillarStartedAt(JSON.parse(rawPstart));
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
    const [rawPid, rawPstart] = await Promise.all([
      AsyncStorage.getItem(LOCAL_KEYS.currentPillarId),
      AsyncStorage.getItem(LOCAL_KEYS.pillarStartedAt),
    ]);
    if (rawPid) setCurrentPillarId(JSON.parse(rawPid));
    if (rawPstart) setPillarStartedAt(JSON.parse(rawPstart));
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

  // ── Persistance des évaluations 12 questions ──────────────────────────────

  const savePillarEvaluation = useCallback(
    async (args: SavePillarEvaluationArgs) => {
      const row = {
        pillar_id: args.pillarId,
        evaluation_type: args.evaluationType,
        responses: args.responses,
        raw_score: args.rawScore,
        normalized_score: args.normalizedScore,
        diagnostic_level: args.diagnosticLevel,
        engagement_level_recommended: args.engagementLevelRecommended,
        engagement_level_chosen: args.engagementLevelChosen,
        completed_at: new Date().toISOString(),
      };
      if (user) {
        const { error } = await supabase
          .from('pillar_evaluations')
          .upsert(
            { user_id: user.id, ...row },
            { onConflict: 'user_id,pillar_id,evaluation_type' },
          );
        if (error) {
          console.warn('[savePillarEvaluation] supabase upsert failed', error);
          throw error;
        }
      } else {
        // Mode anonyme : pas de support V1 pour les éval en local-only — l'utilisateur
        // doit être connecté pour qu'une éval soit persistée. À étendre Sprint 9+
        // si besoin (mais le flow normal arrive à IA-40 après IA-10 register).
        console.warn(
          '[savePillarEvaluation] user non connecté — évaluation non persistée',
        );
      }
    },
    [user],
  );

  // ── DEV : seedDevStreak ───────────────────────────────────────────────────
  // Simule un parcours à un jour donné. NE PAS exposer en production. Le
  // caller (ProfilTabScreen) doit gater l'appel via __DEV__.
  const seedDevStreak = useCallback(
    async (targetDay: number) => {
      if (targetDay < 1 || targetDay > 16) {
        console.warn('[seedDevStreak] targetDay doit être entre 1 et 16 (S0 inclus)');
        return;
      }
      const today = todayLocalDate();
      const newCreatedAtIso = new Date(
        Date.now() - (targetDay - 1) * 24 * 60 * 60 * 1000,
      ).toISOString();

      // 1) Construit les entrées streak_history valides. Cappé à 14 entrées
      // Phase 0 max (day_id 1..14). Pour targetDay 15/16 (S0), on garde
      // 14 entrées validées — la transition S0 n'incrémente pas le streak
      // en V1 jusqu'à validation Phase 1 (cf. Feature Spec V1 §2.5).
      const numEntries = Math.min(targetDay - 1, 14);
      const entries: StreakEntry[] = [];
      for (let i = 1; i <= numEntries; i++) {
        entries.push({
          local_date: addDays(today, -(targetDay - i)),
          validation_status: 'valid_above_threshold',
          phase: 'phase_0',
          streak_value_after: i,
          joker_used: false,
        });
      }

      // 2) Reset local state + persist
      setAccountCreatedAtState(newCreatedAtIso);
      setStreakHistory(entries);
      setJokerConsumptions([]);
      setTierReaches([]);
      setNarrativeFlags({});
      setCompletedDays(entries.map((_, idx) => idx + 1));
      setMinimumDays([]);

      if (user) {
        // Reset distant
        await Promise.all([
          supabase
            .from('profiles')
            .update({ account_created_at: newCreatedAtIso })
            .eq('id', user.id),
          supabase.from('progress').delete().eq('user_id', user.id),
          supabase.from('streak_history').delete().eq('user_id', user.id),
          supabase.from('joker_consumptions').delete().eq('user_id', user.id),
          supabase.from('tier_reaches').delete().eq('user_id', user.id),
        ]);
        // Insert les nouvelles entrées
        if (entries.length > 0) {
          await supabase.from('streak_history').insert(
            entries.map((e) => ({ user_id: user.id, ...e })),
          );
          await supabase.from('progress').insert(
            entries.map((_, idx) => ({
              user_id: user.id,
              day_id: idx + 1,
              is_minimum: false,
              actions_count: 7,
            })),
          );
        }
      } else {
        await AsyncStorage.multiSet([
          [LOCAL_KEYS.accountCreatedAt, JSON.stringify(newCreatedAtIso)],
          [LOCAL_KEYS.streakHistory, JSON.stringify(entries)],
          [LOCAL_KEYS.jokerConsumptions, JSON.stringify([])],
          [LOCAL_KEYS.tierReaches, JSON.stringify([])],
          [LOCAL_KEYS.narrativeFlags, JSON.stringify({})],
          [LOCAL_KEYS.completedDays, JSON.stringify(entries.map((_, idx) => idx + 1))],
          [LOCAL_KEYS.minimumDays, JSON.stringify([])],
        ]);
      }
      // Reset les coches en cours du jour courant
      await AsyncStorage.removeItem(`daily_check_actions.${today}`);
    },
    [user],
  );

  // ── Calculs dérivés ───────────────────────────────────────────────────────

  const currentDay = useMemo(() => {
    if (!accountCreatedAt) return 0;
    return currentDayInParcours(accountCreatedAt);
  }, [accountCreatedAt]);

  const dayInPillarWeek = useMemo(() => {
    if (!pillarStartedAt) return 0;
    const d = currentDayInParcours(pillarStartedAt);
    return Math.min(d, 7); // borne à 7 jours par pilier
  }, [pillarStartedAt]);

  const startPillarWeek = useCallback(
    async (pillarId: string) => {
      const nowIso = new Date().toISOString();
      setCurrentPillarId(pillarId);
      setPillarStartedAt(nowIso);
      await AsyncStorage.multiSet([
        [LOCAL_KEYS.currentPillarId, JSON.stringify(pillarId)],
        [LOCAL_KEYS.pillarStartedAt, JSON.stringify(nowIso)],
      ]);
    },
    [],
  );

  const seedDevPillarDay = useCallback(
    async (pillarId: string, targetDay: number) => {
      if (targetDay < 1 || targetDay > 7) {
        console.warn('[seedDevPillarDay] targetDay doit être entre 1 et 7');
        return;
      }
      const offsetMs = (targetDay - 1) * 24 * 60 * 60 * 1000;
      const startedAt = new Date(Date.now() - offsetMs).toISOString();
      setCurrentPillarId(pillarId);
      setPillarStartedAt(startedAt);
      await AsyncStorage.multiSet([
        [LOCAL_KEYS.currentPillarId, JSON.stringify(pillarId)],
        [LOCAL_KEYS.pillarStartedAt, JSON.stringify(startedAt)],
      ]);
    },
    [],
  );

  const savePillarSession = useCallback(
    async (args: SavePillarSessionArgs) => {
      if (!user) {
        console.warn('[savePillarSession] user non connecté — session non persistée');
        return;
      }
      const row = {
        user_id: user.id,
        pillar_id: args.pillarId,
        day_in_week: args.dayInWeek,
        session_index: args.sessionIndex,
        local_date: args.localDate,
        completed_at: new Date().toISOString(),
        duration_seconds: args.durationSeconds ?? null,
      };
      const { error } = await supabase
        .from('pillar_sessions')
        .upsert(row, {
          onConflict: 'user_id,pillar_id,day_in_week,session_index',
        });
      if (error) {
        console.warn('[savePillarSession] supabase upsert failed', error);
        throw error;
      }
    },
    [user],
  );

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

      // Pose accountCreatedAt = now() si pas encore défini. Couvre :
      //  - user connecté qui re-passe par l'onboarding après resetAll
      //  - user anonyme qui finit onboarding avant IA-10 (le RegisterScreen
      //    écrasera avec sa propre valeur si nécessaire)
      const nowIso = new Date().toISOString();
      const shouldSetCreatedAt = !accountCreatedAt;
      if (shouldSetCreatedAt) {
        setAccountCreatedAtState(nowIso);
      }

      if (user) {
        await supabase
          .from('profiles')
          .update({
            onboarding_done: true,
            onboarding_data: answers,
            ...(dynamicId ? { profile_dynamic_id: dynamicId } : {}),
            ...(shouldSetCreatedAt ? { account_created_at: nowIso } : {}),
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
        if (shouldSetCreatedAt) {
          await AsyncStorage.setItem(
            LOCAL_KEYS.accountCreatedAt,
            JSON.stringify(nowIso),
          );
        }
      }
    },
    [user, accountCreatedAt],
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
    setCurrentPillarId(null);
    setPillarStartedAt(null);
    if (user) {
      await AsyncStorage.multiRemove([
        LOCAL_KEYS.narrativeFlags,
        LOCAL_KEYS.currentPillarId,
        LOCAL_KEYS.pillarStartedAt,
      ]);
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
        seedDevStreak,
        savePillarEvaluation,
        startPillarWeek,
        savePillarSession,
        seedDevPillarDay,
        currentPillarId,
        pillarStartedAt,
        dayInPillarWeek,
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

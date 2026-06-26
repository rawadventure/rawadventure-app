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
 * Sprint 24 — Cleanup legacy V0 : retrait de l'API `completeDay`,
 * `isDayCompleted`, `isDayUnlocked`, `completedDays`, `minimumDays` —
 * plus aucun consommateur depuis Sprint 14 (écrans V0 supprimés). La
 * persistance Phase 0 dans la table Supabase `progress` reste assurée
 * par validateDay() pour traçabilité serveur.
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
  TIER_THRESHOLDS,
  tierJustReached,
  validatedDaysCount,
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

  // ── API V1 (Sprint 3+)
  validateDay: (args: ValidateDayArgs) => Promise<ValidateDayResult>;
  setAccountCreatedAt: (iso: string) => Promise<void>;
  /** Flags des écrans narratifs déjà vus (Feature Spec V1 §2.3). */
  narrativeFlags: Partial<Record<NarrativeEventId, string>>;
  /** Marque un écran narratif comme déjà vu. Idempotent. Pose un timestamp ISO. */
  markNarrativeSeen: (id: NarrativeEventId) => Promise<void>;
  /** Enregistre une évaluation 12 questions (IA-40 initiale ou IA-46 finale).
   *  Réf Feature Spec S1 §2.5 + Schéma de données V1.1 §2.4. */
  savePillarEvaluation: (args: SavePillarEvaluationArgs) => Promise<void>;
  /** DEV uniquement : applique un snapshot timeline atomique. Voir
   *  src/lib/devTimeline.ts pour la liste des presets. */
  applyDevSnapshot: (snapshot: import('../lib/devTimeline').TimelineSnapshot) => Promise<void>;
  /** Démarre la semaine d'un pilier de Phase 1 (sortie IA-41 "Démarrer cette
   *  semaine"). Pose `currentPillarId` et `pillarStartedAt = now()`. */
  startPillarWeek: (pillarId: string) => Promise<void>;
  /** Enregistre une session pratiquée en Phase 1 (sortie IA-43).
   *  Réf Feature Spec S1 §4.4 + Schéma de données V1.1 §2.5. */
  savePillarSession: (args: SavePillarSessionArgs) => Promise<void>;
  /** Enregistre un choix de niveau adaptatif (IA-44 modale Moins/Pareil/Plus).
   *  Réf Feature Spec S1 §5.1 + Schéma de données V1.1 §2.6. Le choix
   *  module la session ponctuelle sans modifier le niveau d'entrée. */
  saveAdaptiveChoice: (args: SaveAdaptiveChoiceArgs) => Promise<void>;
  /** Sprint 4 (M7+A3) : pousse les données AsyncStorage anonymes vers Supabase
   *  après que l'utilisateur ait créé son compte à IA-10. Appelle obligatoirement
   *  avec un `userId` valide (issu de `signUpWithPassword`). */
  migrateLocalToRemote: (userId: string, accountCreatedAtIso: string) => Promise<void>;
  /** Sprint B email confirm — pose la pendingMigration en AsyncStorage au signup
   *  (avant confirmation email). Sera consommée par useEffect quand session arrive. */
  markPendingMigration: (userId: string, accountCreatedAtIso: string) => Promise<void>;
  /** Sprint B email confirm — true si signup fait + confirmation email en attente. */
  pendingMigration: PendingMigration | null;
  /** Sprint B email confirm — efface la pendingMigration (annulation ou reset). */
  clearPendingMigration: () => Promise<void>;

  // ── lifecycle
  completeOnboarding: (
    answers: Record<string, string>,
    profileDynamicId?: string,
  ) => Promise<void>;
  resetAll: () => Promise<void>;
  /** D30 — palier différé en attente d'affichage (collision narrative S0.1 etc.).
   *  `null` si aucun palier en attente. Sera ouvert à la prochaine validation
   *  sans collision narrative. */
  pendingTierReach: PendingTierReach | null;
  /** D30 — pose un palier différé (caller détecte collision narrative). */
  setPendingTier: (pending: PendingTierReach) => Promise<void>;
  /** D30 — vide le palier différé après affichage. */
  clearPendingTier: () => Promise<void>;

  /** UI : cache la TabBar globale. Utilisé par PillarEvaluationScreen pour
   *  forcer l'éval (mandatory — pas de sortie via tabs Accueil/Toile/Profil). */
  tabBarHidden: boolean;
  setTabBarHidden: (hidden: boolean) => void;
}

export type PendingMigration = {
  userId: string;
  accountCreatedAt: string;
  email?: string;
};

export type PendingTierReach = {
  tierId: TierId;
  isFirstReach: boolean;
  streakValue: number;
  deferredAt: string; // ISO timestamp
};

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

export type SaveAdaptiveChoiceArgs = {
  pillarId: string;
  /** ID de la session liée (optionnel — peut être null si choix Phase 0 ou pré-session). */
  sessionId?: string | null;
  choice: 'less' | 'same' | 'more';
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
  streakHistory: 'streak_history',
  jokerConsumptions: 'joker_consumptions',
  tierReaches: 'tier_reaches',
  narrativeFlags: 'narrative_flags',
  currentPillarId: 'current_pillar_id',
  pillarStartedAt: 'pillar_started_at',
  pendingTierReach: 'pending_tier_reach',
  /** Sprint B email confirm — userId + accountCreatedAt stockés au signup
   *  pour migration différée quand la session arrive post-confirmation. */
  pendingMigration: 'pending_migration',
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
  | 's8_exit_screen'           // IA-22
  | 'consolidation_intro_seen' // IA-23
  | 'mentorat_proposal_seen'   // IA-60
  | 'notif_permission_prompted'; // Sprint notifications — prompt natif déclenché J1

// ─── Constantes piliers + placeholders DEV ────────────────────────────────────

const PILLAR_ORDER = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'] as const;

const PLACEHOLDER_INITIAL_RESPONSES = Array.from({ length: 12 }, (_, i) => ({
  question_id: i + 1,
  value: 3 as 1 | 2 | 3 | 4 | 5,
}));
const PLACEHOLDER_FINAL_RESPONSES = Array.from({ length: 12 }, (_, i) => ({
  question_id: i + 1,
  value: 4 as 1 | 2 | 3 | 4 | 5,
}));

/** Construit une ligne `pillar_evaluations` placeholder pour DEV jump.
 *  Initial : raw 36/60, normalized 50, diagnostic 3, engagement Progression.
 *  Final   : raw 48/60, normalized 75, diagnostic 4, engagement Progression.
 *  Permet à la toile d'araignée d'avoir une branche peuplée par pilier
 *  complété + au flow Phase1HomeScreen de ne pas bloquer sur eval manquante. */
function buildPlaceholderEvalRow(pillarId: string, type: 'initial' | 'final') {
  const isInitial = type === 'initial';
  return {
    pillar_id: pillarId,
    evaluation_type: type,
    responses: isInitial ? PLACEHOLDER_INITIAL_RESPONSES : PLACEHOLDER_FINAL_RESPONSES,
    raw_score: isInitial ? 36 : 48,
    normalized_score: isInitial ? 50 : 75,
    diagnostic_level: isInitial ? 3 : 4,
    engagement_level_recommended: 'progression' as const,
    engagement_level_chosen: 'progression' as const,
    completed_at: new Date().toISOString(),
  };
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  // DEV clock epoch — bump à chaque advanceDevClock/setDevClockOffset/reset
  // pour forcer recompute des useMemo currentDay/dayInPillarWeek/jokerAvailable.
  const [clockEpoch, setClockEpoch] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { isDevToolsEnabled } = require('../lib/devToolsEnabled');
    if (!isDevToolsEnabled()) return;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { subscribeDevClock } = require('../lib/devClock');
    return subscribeDevClock(() => setClockEpoch((e) => e + 1));
  }, []);

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

  // Flags écrans narratifs déjà vus (§2.3) — local-only V1.
  const [narrativeFlags, setNarrativeFlags] = useState<
    Partial<Record<NarrativeEventId, string>>
  >({});

  // Phase 1 — pilier en cours (local-only V1)
  const [currentPillarId, setCurrentPillarId] = useState<string | null>(null);
  const [pillarStartedAt, setPillarStartedAt] = useState<string | null>(null);

  // Post-S8 — déclenche bascule `currentPhase = 'post_s8'` (IA-23 consolidation).
  // Vrai dès qu'une éval finale S8 existe dans pillar_evaluations.
  const [s8FinalCompleted, setS8FinalCompleted] = useState(false);

  // D30 — palier différé suite à collision narrative (typique : palier 15j
  // tombe le même jour que S0.1 → S0.1 prime, palier différé d'un cran).
  const [pendingTierReach, setPendingTierReachState] = useState<PendingTierReach | null>(null);

  // Sprint B email confirm — userId/accountCreatedAt en attente de migration
  // (signup fait, email confirmation en attente). Restauré au load.
  const [pendingMigration, setPendingMigrationState] = useState<PendingMigration | null>(null);
  const [tabBarHidden, setTabBarHidden] = useState(false);

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
      streakRes,
      jokerRes,
      tierRes,
      s8FinalRes,
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
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
      supabase
        .from('pillar_evaluations')
        .select('pillar_id')
        .eq('user_id', userId)
        .eq('pillar_id', 'S8')
        .eq('evaluation_type', 'final')
        .limit(1),
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
    if (streakRes.data) setStreakHistory(streakRes.data as StreakEntry[]);
    if (jokerRes.data) setJokerConsumptions(jokerRes.data as JokerConsumption[]);
    if (tierRes.data) setTierReaches(tierRes.data as TierReach[]);
    setS8FinalCompleted(!!s8FinalRes.data && s8FinalRes.data.length > 0);

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

    const rawPending = await AsyncStorage.getItem(LOCAL_KEYS.pendingTierReach);
    if (rawPending) setPendingTierReachState(JSON.parse(rawPending));

    // Sprint B email confirm — restaure pendingMigration si signup en attente.
    const rawPM = await AsyncStorage.getItem(LOCAL_KEYS.pendingMigration);
    if (rawPM) setPendingMigrationState(JSON.parse(rawPM));
  };

  const loadFromAsyncStorage = async () => {
    const [
      done,
      data,
      dynamicId,
      createdAt,
      history,
      consumptions,
      tiers,
    ] = await Promise.all([
      AsyncStorage.getItem(LOCAL_KEYS.onboardingDone),
      AsyncStorage.getItem(LOCAL_KEYS.onboardingData),
      AsyncStorage.getItem(LOCAL_KEYS.profileDynamicId),
      AsyncStorage.getItem(LOCAL_KEYS.accountCreatedAt),
      AsyncStorage.getItem(LOCAL_KEYS.streakHistory),
      AsyncStorage.getItem(LOCAL_KEYS.jokerConsumptions),
      AsyncStorage.getItem(LOCAL_KEYS.tierReaches),
    ]);
    if (done) setOnboardingDone(JSON.parse(done));
    if (data) setOnboardingData(JSON.parse(data));
    if (dynamicId) setProfileDynamicId(JSON.parse(dynamicId));
    if (createdAt) setAccountCreatedAtState(JSON.parse(createdAt));
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

    const rawPending = await AsyncStorage.getItem(LOCAL_KEYS.pendingTierReach);
    if (rawPending) setPendingTierReachState(JSON.parse(rawPending));

    const rawPM = await AsyncStorage.getItem(LOCAL_KEYS.pendingMigration);
    if (rawPM) setPendingMigrationState(JSON.parse(rawPM));
  };

  const setPendingTier = useCallback(async (pending: PendingTierReach) => {
    setPendingTierReachState(pending);
    await AsyncStorage.setItem(LOCAL_KEYS.pendingTierReach, JSON.stringify(pending));
  }, []);

  const clearPendingTier = useCallback(async () => {
    setPendingTierReachState(null);
    await AsyncStorage.removeItem(LOCAL_KEYS.pendingTierReach);
  }, []);

  // Sprint B email confirm — pendingMigration getters/setters.
  const markPendingMigration = useCallback(
    async (userId: string, accountCreatedAtIso: string) => {
      const pm: PendingMigration = { userId, accountCreatedAt: accountCreatedAtIso };
      setPendingMigrationState(pm);
      await AsyncStorage.setItem(LOCAL_KEYS.pendingMigration, JSON.stringify(pm));
    },
    [],
  );

  const clearPendingMigration = useCallback(async () => {
    setPendingMigrationState(null);
    await AsyncStorage.removeItem(LOCAL_KEYS.pendingMigration);
  }, []);

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
        // Bascule post_s8 dès enregistrement éval finale S8 (IA-23).
        if (args.pillarId === 'S8' && args.evaluationType === 'final') {
          setS8FinalCompleted(true);
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


  // ── Calculs dérivés ───────────────────────────────────────────────────────

  // D38 (2026-06-17) — découplage progression / streak.
  // currentDay = jour du programme EN COURS (où je suis aujourd'hui).
  //  - Si journée today validée : currentDay = nb validations (sur ce jour).
  //  - Sinon : currentDay = nb validations + 1 (prochain jour à faire).
  // Passage de N → N+1 = nouveau jour calendaire OU bouton DEV "Passer jour
  // suivant" (qui shift le calendrier -1j). Validation seule N'avance PAS
  // currentDay. Absence n'avance pas non plus (streak casse, currentDay reste).
  const currentDay = useMemo(() => {
    if (!accountCreatedAt) return 0;
    const today = todayLocalDate();
    const alreadyToday = streakHistory.some((e) => e.local_date === today);
    const p0 = validatedDaysCount(streakHistory, 'phase_0');
    const p1 = validatedDaysCount(streakHistory, 'phase_1');
    return p0 + p1 + (alreadyToday ? 0 : 1);
  }, [accountCreatedAt, streakHistory, clockEpoch]);

  // dayInPillarWeek = jour DU PILIER EN COURS où je suis aujourd'hui.
  // Même logique que currentDay : si une session phase_1 validée today, reste
  // sur le jour. Sinon prochain jour. Capped 7.
  const dayInPillarWeek = useMemo(() => {
    if (!pillarStartedAt) return 0;
    const startedDate = pillarStartedAt.slice(0, 10) as LocalDate;
    const today = todayLocalDate();
    const inPillar = streakHistory.filter(
      (e) =>
        e.phase === 'phase_1' &&
        e.local_date >= startedDate &&
        (e.validation_status === 'valid_above_threshold' ||
          e.validation_status === 'valid_with_joker'),
    );
    const validatedInPillar = inPillar.length;
    const alreadyTodayInPillar = inPillar.some((e) => e.local_date === today);
    return Math.min(validatedInPillar + (alreadyTodayInPillar ? 0 : 1), 7);
  }, [pillarStartedAt, streakHistory, clockEpoch]);

  const startPillarWeek = useCallback(
    async (pillarId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { devNowDate } = require('../lib/devClock');
      const nowIso = (devNowDate() as Date).toISOString();
      setCurrentPillarId(pillarId);
      setPillarStartedAt(nowIso);
      await AsyncStorage.multiSet([
        [LOCAL_KEYS.currentPillarId, JSON.stringify(pillarId)],
        [LOCAL_KEYS.pillarStartedAt, JSON.stringify(nowIso)],
      ]);
    },
    [],
  );


  /**
   * Applique un snapshot timeline DEV atomiquement. Moteur centralisé qui
   * remplace seedDevStreak / seedDevPillarDay / advanceToNextDay (supprimés
   * Tranche 3 2026-06-19). Voir src/lib/devTimeline.ts.
   */
  const applyDevSnapshot = useCallback(
    async (snapshot: import('../lib/devTimeline').TimelineSnapshot) => {
      const { applyTimelineSnapshot } = await import('../lib/devTimeline');
      await applyTimelineSnapshot(snapshot, {
        userId: user?.id ?? null,
        setAccountCreatedAt: setAccountCreatedAtState,
        setStreakHistory,
        setJokerConsumptions,
        setTierReaches,
        setNarrativeFlags,
        setCurrentPillarId,
        setPillarStartedAt,
        setS8FinalCompleted,
      });
    },
    [user],
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

  const saveAdaptiveChoice = useCallback(
    async (args: SaveAdaptiveChoiceArgs) => {
      if (!user) {
        console.warn('[saveAdaptiveChoice] user non connecté — choix non persisté');
        return;
      }
      const { error } = await supabase.from('level_adaptive_choices').insert({
        user_id: user.id,
        pillar_id: args.pillarId,
        session_id: args.sessionId ?? null,
        choice: args.choice,
        chosen_at: new Date().toISOString(),
      });
      if (error) {
        console.warn('[saveAdaptiveChoice] supabase insert failed', error);
        throw error;
      }
    },
    [user],
  );

  const currentPhase: Phase = useMemo(() => {
    // Post-S8 prime dès qu'une éval finale S8 a été enregistrée — bascule
    // permanente vers mode consolidation libre (IA-23 + D13).
    if (s8FinalCompleted) return 'post_s8';
    // Phase 0 = J1 à J14 (parcours d'amorçage) + S0 = J15-J16 (transition
    // gratuite, D17 + CLAUDE.md §2). Au-delà de J16 → Phase 1 payante.
    // S0.1 (J15) et S0.2 (J16) restent dans `phase_0` côté type — pas de
    // valeur dédiée s0_1/s0_2 — la distinction se fait via `currentDay`
    // dans les écrans qui en ont besoin (HomeScreenV1, narratif).
    // Conséquence : paywall gate du RootNavigator laisse passer J15-J16.
    return currentDay <= 16 ? 'phase_0' : 'phase_1';
  }, [currentDay, s8FinalCompleted]);

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

      // 5) Sprint notifications Phase 0 — annule le rappel soir 20h du jour
      //    courant si on est en Phase 0 (action validée → pas besoin de rappel).
      //    Non-bloquant.
      if (phase === 'phase_0' && args.day != null) {
        try {
          const { cancelTodayReminder } = await import('../lib/phase0-scheduler');
          await cancelTodayReminder(args.day);
        } catch (e) {
          console.warn('cancelTodayReminder failed', e);
        }
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

      // 2. streak_history (Sprint 24 : table `progress` plus alimentée
      //    en mode anonyme — validateDay l'écrit directement quand l'user
      //    est connecté).
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

      // 8. Sprint notifications Phase 0 — planifie les 14 notifs J1-J14
      //    si permission accordée. Idempotent : annule + replanifie.
      //    Silencieux si permission denied (utilisateur peut activer
      //    plus tard depuis Profil et déclencher la replanif manuelle).
      try {
        const { schedulePhase0Notifications } = await import(
          '../lib/phase0-scheduler'
        );
        await schedulePhase0Notifications(new Date(accountCreatedAtIso));
      } catch (e) {
        // Pas bloquant — la migration est faite, les notifs sont un plus.
        console.warn('Phase 0 notifications scheduling failed', e);
      }
    },
    [
      onboardingData,
      profileDynamicId,
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

  // ── Reset complet (DEV / __DEV__ uniquement) ──────────────────────────────

  const resetAll = useCallback(async () => {
    // 1) Reset tout le state local React
    setOnboardingDone(false);
    setOnboardingData({});
    setProfileDynamicId(null);
    setAccountCreatedAtState(null);
    setStreakHistory([]);
    setJokerConsumptions([]);
    setTierReaches([]);
    setNarrativeFlags({});
    setCurrentPillarId(null);
    setPillarStartedAt(null);
    setS8FinalCompleted(false);
    setPendingTierReachState(null);
    setPendingMigrationState(null);

    // 2) Clear TOUT AsyncStorage (mode connecté OU anonyme) — couvre les
    // 12 clés LOCAL_KEYS sans exception. Évite que de la stale data
    // (onboardingDone, accountCreatedAt, streakHistory, etc.) survive
    // au reset en mode connecté.
    await AsyncStorage.multiRemove(Object.values(LOCAL_KEYS));

    // 3) Clear toutes les clés daily_check_actions.<date> (coches en cours
    // de plusieurs jours potentiels). Pas dans LOCAL_KEYS car clé dynamique.
    const allKeys = await AsyncStorage.getAllKeys();
    const dailyCheckKeys = allKeys.filter((k) =>
      k.startsWith('daily_check_actions.'),
    );
    if (dailyCheckKeys.length > 0) {
      await AsyncStorage.multiRemove(dailyCheckKeys);
    }

    // 4) Reset Supabase tables si connecté
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
        supabase.from('pillar_evaluations').delete().eq('user_id', user.id),
        supabase.from('pillar_sessions').delete().eq('user_id', user.id),
        supabase.from('level_adaptive_choices').delete().eq('user_id', user.id),
      ]);
    }
  }, [user]);

  // Sprint B email confirm — Migration différée. Quand la session arrive
  // (utilisateur a cliqué le lien de confirmation dans son email) et qu'une
  // pendingMigration matchant userId est en attente, on déclenche la migration
  // AsyncStorage → Supabase et on efface le pending.
  useEffect(() => {
    if (!user || !pendingMigration) return;
    if (user.id !== pendingMigration.userId) return;
    void (async () => {
      try {
        await migrateLocalToRemote(pendingMigration.userId, pendingMigration.accountCreatedAt);
        await clearPendingMigration();
      } catch (e) {
        // Migration échouée — on garde pendingMigration pour retry au prochain load.
        console.warn('Pending migration failed', e);
      }
    })();
  }, [user, pendingMigration, migrateLocalToRemote, clearPendingMigration]);

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
        validateDay,
        setAccountCreatedAt,
        migrateLocalToRemote,
        narrativeFlags,
        markNarrativeSeen,
        savePillarEvaluation,
        startPillarWeek,
        savePillarSession,
        saveAdaptiveChoice,
        applyDevSnapshot,
        currentPillarId,
        pillarStartedAt,
        dayInPillarWeek,
        completeOnboarding,
        resetAll,
        pendingTierReach,
        setPendingTier,
        clearPendingTier,
        markPendingMigration,
        pendingMigration,
        clearPendingMigration,
        tabBarHidden,
        setTabBarHidden,
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

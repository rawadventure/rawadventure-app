/**
 * Types et clés du domaine progression — extraits de ProgressContext
 * (F-05.5, audit Lou). Réexportés par ProgressContext pour compatibilité
 * avec les consommateurs existants.
 */

import type { LocalDate } from '../../lib/calendar';
import type { Phase, StreakEntry, TierId } from '../../lib/streak';

export type TierReach = {
  tier_id: TierId;
  first_reached_at: string;
  last_reached_at: string;
  reach_count: number;
};

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
  responses: { question_id: number; value: 1 | 2 | 3 | 4 | 5 }[];
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

// Clés AsyncStorage (mode anonyme — avant création de compte)
export const LOCAL_KEYS = {
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

// ─── Interface du contexte (F-05.5 — utilisée par ProgressContext) ─────────

export interface ProgressContextType {
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
  applyDevSnapshot: (snapshot: import('../../lib/devTimeline').TimelineSnapshot) => Promise<void>;
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
  markPendingMigration: (userId: string, accountCreatedAtIso: string, email?: string) => Promise<void>;
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
   *  sans collision narrative (HomeScreenV1 en Phase 0, SessionScreen en
   *  Phase 1). Stockage AsyncStorage local-only : perdu à la désinstallation
   *  ou au changement d'appareil — accepté V1 (audit 6 juillet 2026, même
   *  posture que narrative_flags ; la modale palier est alors simplement
   *  sautée, tier_reaches distant reste correct). */
  pendingTierReach: PendingTierReach | null;
  /** D30 — pose un palier différé (caller détecte collision narrative). */
  setPendingTier: (pending: PendingTierReach) => Promise<void>;
  /** D30 — vide le palier différé après affichage. */
  clearPendingTier: () => Promise<void>;
}


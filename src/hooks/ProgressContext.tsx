/**
 * ProgressContext — état du parcours utilisateur.
 *
 * F-05.5 (audit Lou) : le provider compose les domaines de src/hooks/progress
 * (calendrier D38, streak, pilier, onboarding/migration, chargement, snapshot
 * DEV) et expose la façade `useProgress()` inchangée. Historique détaillé des
 * refontes : git log de ce fichier.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import {
  createAnonymousStore,
  createRemoteStore,
} from '../lib/progressStore';
import { EMPTY_PROGRESS_DATA, type ProgressData } from '../lib/progressData';
import {
  type NarrativeEventId,
  type PendingMigration,
  type PendingTierReach,
  type SaveAdaptiveChoiceArgs,
  type SavePillarEvaluationArgs,
  type SavePillarSessionArgs,
  type TierReach,
  type ValidateDayArgs,
  type ValidateDayResult,
  type ProgressContextType,
} from './progress/types';
import { usePillarDomain } from './progress/usePillarDomain';
import { useStreakDomain } from './progress/useStreakDomain';
import { useOnboardingMigrationDomain } from './progress/useOnboardingMigrationDomain';
import { createProgressLoader } from './progress/useProgressLoad';
import { useCalendarDomain } from './progress/useCalendarDomain';
import { useDevSnapshot } from './progress/useDevSnapshot';

// Réexports — les consommateurs continuent d'importer depuis ProgressContext.
export type {
  NarrativeEventId,
  PendingMigration,
  PendingTierReach,
  SaveAdaptiveChoiceArgs,
  SavePillarEvaluationArgs,
  SavePillarSessionArgs,
  TierReach,
  ValidateDayArgs,
  ValidateDayResult,
};


// ─── Types ────────────────────────────────────────────────────────────────────


const ProgressContext = createContext<ProgressContextType | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  // Onboarding
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [onboardingData, setOnboardingData] = useState<Record<string, string>>({});
  const [profileDynamicId, setProfileDynamicId] = useState<string | null>(null);
  const [accountCreatedAt, setAccountCreatedAtState] = useState<string | null>(null);

  // Streak / joker / paliers V1 — F-05.4 (audit Lou).
  //
  // SOURCE DE VÉRITÉ : `dataRef`, lue de façon synchrone par tout le code
  // async (validateDay, cohérence calendaire). Le state React `data` n'est
  // que la PROJECTION pour le rendu ; l'unique porte d'écriture est
  // `commitData`, et les transitions sont les fonctions pures de
  // src/lib/progressData. Remplace les trois refs miroirs bricolées
  // (streakHistoryRef — bug F4, coherenceRunningRef) : le code async
  // calcule l'état suivant depuis l'état courant, jamais depuis une
  // closure figée.
  const [data, setDataState] = useState<ProgressData>(EMPTY_PROGRESS_DATA);
  const dataRef = useRef<ProgressData>(EMPTY_PROGRESS_DATA);
  const commitData = useCallback((next: ProgressData) => {
    dataRef.current = next;
    setDataState(next);
  }, []);
  const { streakHistory, jokerConsumptions, tierReaches } = data;

  // File de mutations : validation et cohérence calendaire s'exécutent
  // strictement l'une après l'autre — plus de fenêtre réseau où les deux
  // s'entrelacent (classe de bug F4).
  const mutationChainRef = useRef<Promise<unknown>>(Promise.resolve());
  const enqueueMutation = useCallback(<T,>(op: () => Promise<T>): Promise<T> => {
    const run = mutationChainRef.current.then(op, op);
    mutationChainRef.current = run.catch(() => undefined);
    return run;
  }, []);

  // API legacy V0

  // Flags écrans narratifs déjà vus (§2.3) — local-only V1.
  const [narrativeFlags, setNarrativeFlags] = useState<
    Partial<Record<NarrativeEventId, string>>
  >({});
  // F-05.4 : même pattern que dataRef — la ref est la SOURCE (lue/écrite de
  // façon synchrone), le state la projection render, une seule porte
  // d'écriture (setNarrativeFlagsSynced). Deux markNarrativeSeen dans le
  // même commit React (ex : J1 — welcome_video + prompt notifs) liraient
  // sinon des closures stales et se perdraient mutuellement (bug double
  // vidéo J1).
  const narrativeFlagsRef = useRef<Partial<Record<NarrativeEventId, string>>>({});
  const setNarrativeFlagsSynced = useCallback(
    (flags: Partial<Record<NarrativeEventId, string>>) => {
      narrativeFlagsRef.current = flags;
      setNarrativeFlags(flags);
    },
    [],
  );

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
  // F-05.2 : tabBarHidden a déménagé dans TabBarContext (état d'interface,
  // pas de progression).

  // F-05.3 : la persistance vit dans src/lib/progressStore (une interface,
  // deux implémentations). Le contexte compose : le snapshot local sert de
  // secours de transition en connecté (comptes d'avant F-04), le remote est
  // la source de vérité.
  const store = useMemo(
    () => (user ? createRemoteStore(user.id) : createAnonymousStore()),
    [user],
  );

  // F-05.5 : domaine pilier extrait (évals, sessions, niveau adaptatif,
  // démarrage de semaine).
  const { savePillarEvaluation, startPillarWeek, savePillarSession, saveAdaptiveChoice } =
    usePillarDomain({
      user,
      store,
      setS8FinalCompleted,
      setCurrentPillarId,
      setPillarStartedAt,
    });


  // F-05.5 : chargement + composition des snapshots extraits
  // (progress/useProgressLoad). Les refs sont TRANSMISES au loader (qui les
  // lit au moment du chargement), pas lues pendant le render.
  // eslint-disable-next-line react-hooks/refs
  const loadData = createProgressLoader({
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
  });

  // ── Chargement initial / changement d'utilisateur ─────────────────────────
  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const markNarrativeSeen = useCallback(
    async (id: NarrativeEventId) => {
      if (narrativeFlagsRef.current[id]) return; // déjà marqué — idempotent
      const next = { ...narrativeFlagsRef.current, [id]: new Date().toISOString() };
      setNarrativeFlagsSynced(next);
      // F-04 : write-through via le store (profiles.narrative_flags en
      // connecté — survit au changement de téléphone ; AsyncStorage en
      // anonyme).
      await store.saveNarrativeFlags(next);
    },
    [setNarrativeFlagsSynced, store],
  );

  // F-05.5 : dérivés calendaires + clockEpoch extraits
  // (progress/useCalendarDomain — porte le commentaire D38).
  const { clockEpoch, currentDay, dayInPillarWeek, currentPhase, streak, jokerAvailable } =
    useCalendarDomain({
      accountCreatedAt,
      streakHistory,
      jokerConsumptions,
      tierReaches,
      pillarStartedAt,
      s8FinalCompleted,
    });

  // F-05.5/F-07 : snapshot DEV isolé (progress/useDevSnapshot).
  const applyDevSnapshot = useDevSnapshot({
    user,
    dataRef,
    commitData,
    setAccountCreatedAtState,
    setNarrativeFlagsSynced,
    setCurrentPillarId,
    setPillarStartedAt,
    setS8FinalCompleted,
  });

  // F-05.5 : domaine streak extrait (validation quotidienne, cohérence
  // calendaire, palier différé D30).
  const { validateDay, runCalendarCoherence, setPendingTier, clearPendingTier } =
    useStreakDomain({
      user,
      store,
      dataRef,
      commitData,
      enqueueMutation,
      currentPhase,
      setPendingTierReachState,
    });

  // F-05.5 : domaine onboarding + migration + reset extrait.
  const {
    markPendingMigration,
    clearPendingMigration,
    migrateLocalToRemote,
    setAccountCreatedAt,
    completeOnboarding,
    resetAll,
  } = useOnboardingMigrationDomain({
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
  });

  // Déclenchement : fin de chargement (ouverture, changement d'utilisateur,
  // re-load post-migration) + changement de jour (clockEpoch). Les données
  // sont lues depuis dataRef AU DÉMARRAGE de la mutation (F-05.4) — pas de
  // dépendance sur streakHistory ici.
  useEffect(() => {
    if (loading) return;
    void runCalendarCoherence(s8FinalCompleted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, clockEpoch, user?.id, runCalendarCoherence]);

  // ── Méthodes V1 ──────────────────────────────────────────────────────────

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
        // Re-hydrate depuis le remote : le loadData() concurrent déclenché par
        // l'arrivée de la session a pu lire un profil pré-migration
        // (onboarding_done=false) — sans ce re-load l'user retombe sur
        // l'onboarding jusqu'au prochain reload manuel.
        await loadData();
      } catch (e) {
        // Migration échouée — on garde pendingMigration pour retry au prochain load.
        console.warn('Pending migration failed', e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, pendingMigration, migrateLocalToRemote, clearPendingMigration]);

  // F-05.1 (audit Lou) : value mémoïsé — l'objet littéral inline re-rendait
  // tous les consommateurs (et refaisait tourner leurs effets) à chaque
  // render du Provider, même sans changement d'état. Toutes les fonctions
  // exposées sont des useCallback : la référence ne change que quand un
  // état listé change réellement.
  const contextValue = useMemo(
    () => ({
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
    }),
    [
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
    ],
  );

  return (
    <ProgressContext.Provider value={contextValue}>
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

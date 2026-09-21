/**
 * usePillarDomain — Phase 1 : évaluations, sessions, niveau adaptatif,
 * démarrage de semaine de pilier (F-05.5, audit Lou — extrait de
 * ProgressContext, même comportement).
 */

import { useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { must } from '../../lib/supabaseMust';
import type { ProgressStore } from '../../lib/progressStore';
import type {
  SaveAdaptiveChoiceArgs,
  SavePillarEvaluationArgs,
  SavePillarSessionArgs,
} from './types';

type PillarDomainDeps = {
  user: { id: string } | null;
  store: ProgressStore;
  setS8FinalCompleted: (v: boolean) => void;
  setCurrentPillarId: (v: string | null) => void;
  setPillarStartedAt: (v: string | null) => void;
};

export function usePillarDomain({
  user,
  store,
  setS8FinalCompleted,
  setCurrentPillarId,
  setPillarStartedAt,
}: PillarDomainDeps) {
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



  const startPillarWeek = useCallback(
    async (pillarId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { devNowDate } = require('../../lib/devClock');
      const nowIso = (devNowDate() as Date).toISOString();
      setCurrentPillarId(pillarId);
      setPillarStartedAt(nowIso);
      // F-04 : write-through via le store (le pilier en cours ne repart
      // plus à S1 après un changement de téléphone).
      await store.savePillarState(pillarId, nowIso);
    },
    [store],
  );


  /**
   * Applique un snapshot timeline DEV atomiquement. Moteur centralisé qui
   * remplace seedDevStreak / seedDevPillarDay / advanceToNextDay (supprimés
   * Tranche 3 2026-06-19). Voir src/lib/devTimeline.ts.
   */

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


  return { savePillarEvaluation, startPillarWeek, savePillarSession, saveAdaptiveChoice };
}

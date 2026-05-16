/**
 * pillar-registry.ts — lookup centralisé des données par pilier.
 *
 * Réf décision D39 (ordre canonique) + Métriques V1.5 + Feature Spec S1.
 *
 * Les écrans IA-40, IA-41, IA-43, IA-47, Phase1HomeScreen consomment ce
 * registre via `getPillarMeta(pillarId)` au lieu d'importer directement
 * `s1-evaluation` ou `s1-program`. Ça permet de basculer entre piliers
 * via `currentPillarId` sans modification de code.
 *
 * Sprint 11 : S1 (données réelles) + S2 (placeholders). S3-S8 à venir
 * Sprint 12+ avec leurs Feature Specs dédiées.
 */

import type { S1Question, S1Diagnostic } from './s1-evaluation';
import type { S1Day } from './s1-program';

import { S1_EVALUATION_QUESTIONS, S1_DIAGNOSTICS } from './s1-evaluation';
import { S1_PROGRAM, S1_DURATIONS_MIN } from './s1-program';
import { S2_EVALUATION_QUESTIONS, S2_DIAGNOSTICS } from './s2-evaluation';
import { S2_PROGRAM } from './s2-program';

export type PillarId = 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'S7' | 'S8';

export type PillarMeta = {
  id: PillarId;
  weekIndex: number; // 1 à 8
  name: string;
  shortName: string;
  /** Type A = mappage diagnostic→engagement actif. Type B (S5/S7) = pas de
   *  paramètre principal modulé (Métriques V1.5 D41). Sprint 11 : tout est A. */
  type: 'A' | 'B';
  questions: readonly S1Question[];
  diagnostics: Record<1 | 2 | 3 | 4 | 5, S1Diagnostic>;
  program: readonly S1Day[];
  /** Durées du paramètre principal par niveau (placeholder S2 = clone S1). */
  durationsMin: Record<'essentiel' | 'progression' | 'immersion', number>;
  /** Libellé du paramètre principal pour copy IA-41 / IA-43. */
  parameterLabel: string;
};

export const PILLAR_ORDER_CANONICAL: PillarId[] = [
  'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8',
];

const REGISTRY: Partial<Record<PillarId, PillarMeta>> = {
  S1: {
    id: 'S1',
    weekIndex: 1,
    name: 'Respiration',
    shortName: 'Respiration',
    type: 'A',
    questions: S1_EVALUATION_QUESTIONS,
    diagnostics: S1_DIAGNOSTICS,
    program: S1_PROGRAM,
    durationsMin: S1_DURATIONS_MIN,
    parameterLabel: 'sessions de cohérence cardiaque',
  },
  S2: {
    id: 'S2',
    weekIndex: 2,
    name: 'Activité physique',
    shortName: 'Activité physique',
    type: 'A',
    questions: S2_EVALUATION_QUESTIONS,
    diagnostics: S2_DIAGNOSTICS,
    program: S2_PROGRAM,
    // Sprint 11 placeholder : mêmes durées que S1. La Feature Spec S2 redéfinira.
    durationsMin: S1_DURATIONS_MIN,
    parameterLabel: 'sessions de mouvement',
  },
};

export function getPillarMeta(pillarId: string): PillarMeta | undefined {
  return REGISTRY[pillarId as PillarId];
}

/** Renvoie l'identifiant du pilier suivant dans l'ordre canonique D39, ou
 *  `null` si on est au dernier (S8). */
export function getNextPillarId(currentPillarId: string): PillarId | null {
  const idx = PILLAR_ORDER_CANONICAL.indexOf(currentPillarId as PillarId);
  if (idx === -1 || idx === PILLAR_ORDER_CANONICAL.length - 1) return null;
  return PILLAR_ORDER_CANONICAL[idx + 1];
}

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
import { S2_PROGRAM, S2_DURATIONS_MIN } from './s2-program';
import { S3_EVALUATION_QUESTIONS, S3_DIAGNOSTICS } from './s3-evaluation';
import { S3_PROGRAM } from './s3-program';
import { S4_EVALUATION_QUESTIONS, S4_DIAGNOSTICS } from './s4-evaluation';
import { S4_PROGRAM } from './s4-program';
import { S5_EVALUATION_QUESTIONS, S5_DIAGNOSTICS } from './s5-evaluation';
import { S5_PROGRAM } from './s5-program';
import { S6_EVALUATION_QUESTIONS, S6_DIAGNOSTICS } from './s6-evaluation';
import { S6_PROGRAM } from './s6-program';
import { S7_EVALUATION_QUESTIONS, S7_DIAGNOSTICS } from './s7-evaluation';
import { S7_PROGRAM } from './s7-program';
import { S8_EVALUATION_QUESTIONS, S8_DIAGNOSTICS } from './s8-evaluation';
import { S8_PROGRAM } from './s8-program';

export type PillarId = 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'S7' | 'S8';

/** Type de session pratique (Sprint 15 D — polymorphisme IA-43).
 *  - `coherence_cardiaque` : cercle respi animé 6 cycles/min + timer durée
 *    (S1). C'est l'archétype timer + rythme respiratoire.
 *  - `chrono_libre` : timer durée simple sans rythme respiratoire (S2 marche,
 *    S4 exposition dehors, mouvement libre).
 *  - `acte_libre` : pas de timer, l'utilisateur valide manuellement quand
 *    l'acte est fait (S3 manger consciemment, S5 routine du soir, S6 journal,
 *    S7 méditation libre, S8 hydratation/brossage).
 */
export type SessionType = 'coherence_cardiaque' | 'chrono_libre' | 'acte_libre';

export type PillarMeta = {
  id: PillarId;
  weekIndex: number; // 1 à 8
  name: string;
  shortName: string;
  /** Type A = mappage diagnostic→engagement actif. Type B (S5/S7) = pas de
   *  paramètre principal modulé (Métriques V1.5 D41). */
  type: 'A' | 'B';
  /** Type de session pour IA-43 — détermine quel sous-composant rendre. */
  sessionType: SessionType;
  questions: readonly S1Question[];
  diagnostics: Record<1 | 2 | 3 | 4 | 5, S1Diagnostic>;
  program: readonly S1Day[];
  /** Durées du paramètre principal par niveau. Utilisé uniquement par
   *  les sessionType timés (coherence_cardiaque, chrono_libre). */
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
    sessionType: 'coherence_cardiaque',
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
    sessionType: 'chrono_libre',
    questions: S2_EVALUATION_QUESTIONS,
    diagnostics: S2_DIAGNOSTICS,
    program: S2_PROGRAM,
    durationsMin: S2_DURATIONS_MIN,
    parameterLabel: 'séances de mouvement',
  },
  S3: {
    id: 'S3',
    weekIndex: 3,
    name: 'Alimentation',
    shortName: 'Alimentation',
    type: 'A',
    sessionType: 'acte_libre',
    questions: S3_EVALUATION_QUESTIONS,
    diagnostics: S3_DIAGNOSTICS,
    program: S3_PROGRAM,
    durationsMin: S1_DURATIONS_MIN,
    parameterLabel: 'pratiques alimentaires',
  },
  S4: {
    id: 'S4',
    weekIndex: 4,
    name: 'Connexion au vivant',
    shortName: 'Connexion vivant',
    type: 'A',
    sessionType: 'chrono_libre',
    questions: S4_EVALUATION_QUESTIONS,
    diagnostics: S4_DIAGNOSTICS,
    program: S4_PROGRAM,
    durationsMin: S1_DURATIONS_MIN,
    parameterLabel: 'temps dehors',
  },
  S5: {
    id: 'S5',
    weekIndex: 5,
    name: 'Repos et régénération',
    shortName: 'Repos & régé.',
    type: 'B', // D41 — pas de mapping diagnostic → engagement
    sessionType: 'acte_libre',
    questions: S5_EVALUATION_QUESTIONS,
    diagnostics: S5_DIAGNOSTICS,
    program: S5_PROGRAM,
    durationsMin: S1_DURATIONS_MIN,
    parameterLabel: 'pratiques de récupération',
  },
  S6: {
    id: 'S6',
    weekIndex: 6,
    name: 'Passion et chemin de vie',
    shortName: 'Passion',
    type: 'A',
    sessionType: 'acte_libre',
    questions: S6_EVALUATION_QUESTIONS,
    diagnostics: S6_DIAGNOSTICS,
    program: S6_PROGRAM,
    durationsMin: S1_DURATIONS_MIN,
    parameterLabel: 'temps d\'écoute',
  },
  S7: {
    id: 'S7',
    weekIndex: 7,
    name: 'Mindset',
    shortName: 'Mindset',
    type: 'B', // D41 — pas de mapping diagnostic → engagement
    sessionType: 'acte_libre',
    questions: S7_EVALUATION_QUESTIONS,
    diagnostics: S7_DIAGNOSTICS,
    program: S7_PROGRAM,
    durationsMin: S1_DURATIONS_MIN,
    parameterLabel: 'pratiques mentales',
  },
  S8: {
    id: 'S8',
    weekIndex: 8,
    name: 'Élimination et détox',
    shortName: 'Élim. & détox',
    type: 'A',
    sessionType: 'acte_libre',
    questions: S8_EVALUATION_QUESTIONS,
    diagnostics: S8_DIAGNOSTICS,
    program: S8_PROGRAM,
    durationsMin: S1_DURATIONS_MIN,
    parameterLabel: 'pratiques d\'élimination',
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

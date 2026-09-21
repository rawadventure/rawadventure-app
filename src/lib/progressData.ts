/**
 * progressData — transitions pures du trio streak / joker / palier
 * (F-05.4, audit Lou).
 *
 * L'état autoritaire du ProgressContext (historique de streak, jokers
 * consommés, paliers atteints) ne se manipule qu'à travers ces fonctions
 * pures : upsert dédupliqué par clé naturelle, tri stable. Le code async du
 * contexte calcule l'état suivant depuis l'état COURANT (dataRef, lu de
 * façon synchrone) — jamais depuis une closure figée. C'est la réponse
 * structurelle au bug F4 (validation pendant la fenêtre réseau d'une
 * cassure de cohérence → streak recalculé sur une base périmée).
 */

import type { JokerConsumption, StreakEntry } from './streak';
import type { TierId } from './streak';

export type ProgressTierReach = {
  tier_id: TierId;
  first_reached_at: string;
  last_reached_at: string;
  reach_count: number;
};

export type ProgressData = {
  streakHistory: StreakEntry[];
  jokerConsumptions: JokerConsumption[];
  tierReaches: ProgressTierReach[];
};

export const EMPTY_PROGRESS_DATA: ProgressData = {
  streakHistory: [],
  jokerConsumptions: [],
  tierReaches: [],
};

function sortedHistory(entries: StreakEntry[]): StreakEntry[] {
  return [...entries].sort((a, b) => a.local_date.localeCompare(b.local_date));
}

/** Upsert d'une entrée d'historique (clé : local_date), tri chronologique. */
export function withStreakEntry(
  data: ProgressData,
  entry: StreakEntry,
): ProgressData {
  return {
    ...data,
    streakHistory: sortedHistory([
      ...data.streakHistory.filter((e) => e.local_date !== entry.local_date),
      entry,
    ]),
  };
}

/** Upsert d'une consommation de joker (clé : week_key). */
export function withJokerConsumption(
  data: ProgressData,
  consumption: JokerConsumption,
): ProgressData {
  return {
    ...data,
    jokerConsumptions: [
      ...data.jokerConsumptions.filter((c) => c.week_key !== consumption.week_key),
      consumption,
    ],
  };
}

/** Upsert d'un palier atteint (clé : tier_id). */
export function withTierReach(
  data: ProgressData,
  reach: ProgressTierReach,
): ProgressData {
  return {
    ...data,
    tierReaches: [
      ...data.tierReaches.filter((t) => t.tier_id !== reach.tier_id),
      reach,
    ],
  };
}

/** Applique le résultat d'une résolution de cohérence calendaire :
 *  entrées de jours manqués + jokers auto-consommés, en batch. */
export function withCoherenceResolution(
  data: ProgressData,
  entries: StreakEntry[],
  consumptions: JokerConsumption[],
): ProgressData {
  let next = data;
  for (const e of entries) next = withStreakEntry(next, e);
  for (const c of consumptions) next = withJokerConsumption(next, c);
  return next;
}

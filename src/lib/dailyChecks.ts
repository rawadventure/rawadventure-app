/**
 * dailyChecks.ts — coches Phase 0 du jour, stockées localement par date.
 *
 * Clé AsyncStorage `daily_check_actions.<YYYY-MM-DD>` (héritée du V0 : le
 * format est conservé pour ne pas perdre les coches des testeurs en cours).
 * Les coches vivent sur l'appareil uniquement — elles ne sont ni
 * synchronisées ni historisées (D34 : pas de score quotidien V1). Seul le
 * nombre d'actions cochées remonte dans `progress.actions_count` à la
 * validation.
 *
 * D44 (1er octobre 2026) : la cohérence calendaire lit ces clés pour
 * valider automatiquement une journée passée à ≥ 5/7 coches, puis les
 * supprime. Ce module est le seul point d'accès à ces clés.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LocalDate } from './calendar';

export const DAILY_CHECKS_PREFIX = 'daily_check_actions.';

export type DailyChecksMap = Record<string, boolean>;

export function dailyChecksKey(localDate: LocalDate): string {
  return `${DAILY_CHECKS_PREFIX}${localDate}`;
}

export function countChecked(map: DailyChecksMap): number {
  return Object.values(map).filter(Boolean).length;
}

/**
 * Nombre d'actions cochées pour chaque date présente en stockage.
 * Une valeur illisible est ignorée (jamais d'exception : la cohérence
 * calendaire ne doit pas se bloquer sur une clé corrompue).
 */
export async function loadDailyChecksCounts(): Promise<Record<LocalDate, number>> {
  const keys = (await AsyncStorage.getAllKeys()).filter((k) =>
    k.startsWith(DAILY_CHECKS_PREFIX),
  );
  if (keys.length === 0) return {};
  const pairs = await AsyncStorage.multiGet(keys);
  const counts: Record<LocalDate, number> = {};
  for (const [key, raw] of pairs) {
    if (!raw) continue;
    try {
      counts[key.slice(DAILY_CHECKS_PREFIX.length)] = countChecked(JSON.parse(raw));
    } catch {
      // clé corrompue — ignorée, nettoyée au prochain passage
    }
  }
  return counts;
}

export async function removeDailyChecks(dates: LocalDate[]): Promise<void> {
  if (dates.length === 0) return;
  await AsyncStorage.multiRemove(dates.map(dailyChecksKey));
}

/**
 * Coches d'une date précise, ou `null` si rien n'est stocké / illisible.
 * Sert au récapitulatif de la veille (D45).
 */
export async function loadDailyChecks(localDate: LocalDate): Promise<DailyChecksMap | null> {
  const raw = await AsyncStorage.getItem(dailyChecksKey(localDate));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DailyChecksMap;
  } catch {
    return null;
  }
}

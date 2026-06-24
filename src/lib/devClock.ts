/**
 * devClock.ts — horloge mockable pour les raccourcis DEV timeline.
 *
 * Permet aux helpers calendaires de raisonner sur une date "virtuelle" décalée
 * d'un offset configurable. En PROD (__DEV__ false), l'offset est forcé à 0
 * et `devNow()` retourne `Date.now()` strict.
 *
 * Usage typique :
 *  - `advanceDevClock(7)` : avance le clock de 7 jours → tous les helpers
 *    temporels (currentDay calcul, joker week_key, missingDatesBetween) voient
 *    le futur sans toucher au streakHistory réel
 *  - `setDevClockOffset(0)` ou `resetDevClock()` : remet à l'heure réelle
 *
 * IMPORTANT : ne PAS utiliser `devNow()` pour `completed_at` audit timestamps
 * (validateDay, savePillarSession, savePillarEvaluation) — ces champs doivent
 * refléter l'instant RÉEL d'écriture pour cohérence audit. Le mock clock sert
 * uniquement à driver les calculs de jour/semaine côté UI.
 */

import type { LocalDate } from './calendar';

let devClockOffsetMs = 0;
let listeners: Array<() => void> = [];

/** Retourne le timestamp courant + offset DEV (ms). En PROD, == Date.now(). */
export function devNow(): number {
  if (!__DEV__) return Date.now();
  return Date.now() + devClockOffsetMs;
}

/** Retourne une `Date` au timestamp `devNow()`. */
export function devNowDate(): Date {
  return new Date(devNow());
}

/** Date locale (YYYY-MM-DD) du clock DEV courant. */
export function devTodayLocalDate(): LocalDate {
  const d = devNowDate();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Offset courant en jours (float, positif = futur). DEV-only. */
export function devClockOffsetDays(): number {
  if (!__DEV__) return 0;
  return devClockOffsetMs / 86_400_000;
}

/** Pose l'offset DEV en ms. Force 0 en PROD. */
export function setDevClockOffset(ms: number): void {
  if (!__DEV__) return;
  devClockOffsetMs = ms;
  notify();
}

/** Avance le clock de N jours (peut être négatif). */
export function advanceDevClock(days: number): void {
  if (!__DEV__) return;
  devClockOffsetMs += days * 86_400_000;
  notify();
}

/** Reset offset à 0 (clock réel). */
export function resetDevClock(): void {
  if (!__DEV__) return;
  devClockOffsetMs = 0;
  notify();
}

/** Abonnement aux changements d'offset (pour forcer re-renders UI DEV). */
export function subscribeDevClock(cb: () => void): () => void {
  if (!__DEV__) return () => {};
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

function notify(): void {
  for (const l of listeners) {
    try {
      l();
    } catch (e) {
      console.warn('[devClock] listener threw', e);
    }
  }
}

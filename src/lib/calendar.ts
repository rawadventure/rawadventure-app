/**
 * calendar.ts — helpers temporels purs et déterministes.
 *
 * Réf design system + Feature Spec V1 Socle minimum §2.3 (Gestion temporelle).
 *
 * RÈGLE D'OR : l'app raisonne en **temps local de l'appareil**. Toutes les
 * dates qui définissent un "jour" du parcours sont calculées dans le fuseau
 * horaire local courant. Pas de conversion en UTC pour les calculs de jour.
 *
 * Conséquence assumée (§2.3) : un utilisateur qui voyage et change de fuseau
 * peut voir son calendrier de parcours "sauter" ou "régresser" d'un jour.
 * À revoir en V1.5 si retours utilisateurs.
 *
 * Toutes les fonctions ici sont PURES (pas de side-effects) et déterministes
 * (même entrée → même sortie). Idempotentes. La date courante n'est lue qu'au
 * niveau des helpers `now*` qui fournissent l'horloge.
 */

// ─── Type de date locale au format ISO court ──────────────────────────────────

/** Date locale au format `YYYY-MM-DD` (10 caractères, pas d'heure ni fuseau). */
export type LocalDate = string;

/** Identifiant de semaine ISO 8601 au format `YYYY-WNN` (ex : `2026-W19`). */
export type WeekKey = string;

// ─── Helpers de date locale ───────────────────────────────────────────────────

/** Date courante locale au format `YYYY-MM-DD`.
 *  Si `now` est omis, utilise le clock DEV (qui est = Date.now() en PROD). */
export function todayLocalDate(now?: Date): LocalDate {
  // Import dynamique pour éviter cycle (devClock importe LocalDate).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { devNowDate } = require('./devClock');
  return localDateOf(now ?? devNowDate());
}

/** Convertit une `Date` (heure locale) en `YYYY-MM-DD` local. */
export function localDateOf(date: Date): LocalDate {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parse une `LocalDate` `YYYY-MM-DD` en `Date` (minuit local du jour donné). */
export function parseLocalDate(localDate: LocalDate): Date {
  const [y, m, d] = localDate.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

/** Différence en jours calendaires entre deux dates locales (b - a, en jours entiers). */
export function daysBetween(a: LocalDate, b: LocalDate): number {
  const da = parseLocalDate(a);
  const db = parseLocalDate(b);
  // Pas via getTime / 86400000 qui peut renvoyer un float à cause de DST.
  // On calcule via UTC pour éliminer le DST des deux côtés (ils sont symétriques
  // dans le même fuseau local, donc le delta reste exact).
  const utcA = Date.UTC(da.getFullYear(), da.getMonth(), da.getDate());
  const utcB = Date.UTC(db.getFullYear(), db.getMonth(), db.getDate());
  return Math.round((utcB - utcA) / 86400000);
}

/** Ajoute `days` jours calendaires à une `LocalDate`. */
export function addDays(localDate: LocalDate, days: number): LocalDate {
  const d = parseLocalDate(localDate);
  d.setDate(d.getDate() + days);
  return localDateOf(d);
}

// ─── Minuit local et démarrage différé (D24) ──────────────────────────────────

/** Renvoie le timestamp ISO du prochain minuit local (00:00 du jour suivant). */
export function startOfNextLocalDay(now?: Date): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { devNowDate } = require('./devClock');
  const base = now ?? devNowDate();
  const next = new Date(base);
  next.setDate(next.getDate() + 1);
  next.setHours(0, 0, 0, 0);
  return next.toISOString();
}

/** Heures restantes avant le prochain minuit local. Float (avec décimales). */
export function hoursUntilNextLocalMidnight(now?: Date): number {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { devNowDate } = require('./devClock');
  const base = now ?? devNowDate();
  const next = new Date(base);
  next.setDate(next.getDate() + 1);
  next.setHours(0, 0, 0, 0);
  return (next.getTime() - base.getTime()) / 3_600_000;
}

// ─── Jour du parcours (currentDay) ────────────────────────────────────────────

/**
 * Calcule le jour N du parcours (1-based) depuis la date de création de compte.
 *
 * Convention §2.3 : J1 = jour calendaire local de `accountCreatedAt`. J2 commence
 * au minuit local suivant. Donc :
 *   currentDay = 1 + daysBetween(localDate(accountCreatedAt), todayLocal)
 *
 * Renvoie un entier ≥ 1. Renvoie 1 si l'utilisateur ouvre l'app le jour même de
 * sa création de compte (cas dégénéré J1 court §2.3, limité par D24).
 *
 * Si `accountCreatedAt` est dans le futur (cas démarrage différé pré-Phase 0),
 * renvoie 0 — signal aux callers qu'on est en `pre_phase_0_waiting`.
 */
export function currentDayInParcours(
  accountCreatedAt: Date | string,
  now?: Date,
): number {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { devNowDate } = require('./devClock');
  const base = now ?? devNowDate();
  const created = typeof accountCreatedAt === 'string' ? new Date(accountCreatedAt) : accountCreatedAt;
  if (created.getTime() > base.getTime()) return 0;
  const diff = daysBetween(localDateOf(created), localDateOf(base));
  return diff + 1;
}

// ─── Semaine calendaire ISO 8601 (lundi-dimanche) ─────────────────────────────

/**
 * Identifiant ISO 8601 de la semaine d'une date locale, au format `YYYY-WNN`.
 *
 * Semaine ISO 8601 :
 *  - démarre le LUNDI
 *  - la semaine 1 est celle qui contient le 4 janvier (équivalemment, celle
 *    qui contient le premier jeudi de l'année)
 *
 * Réf §2.5 : « Le joker est par semaine calendaire fixe lundi-dimanche fuseau
 * local ». `weekKeyOf` identifie de manière unique cette semaine.
 */
export function weekKeyOf(localDate: LocalDate | Date): WeekKey {
  const d =
    typeof localDate === 'string' ? parseLocalDate(localDate) : new Date(localDate);
  // Algorithme ISO 8601 standard (Mozilla / IANA) :
  // 1) prendre la date, la rebaser en UTC pour éviter DST
  const utc = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // 2) ramener au jeudi de la semaine ISO (1 = lundi, 7 = dimanche)
  const dayNum = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - dayNum);
  // 3) année ISO = année de ce jeudi
  const year = utc.getUTCFullYear();
  // 4) numéro de semaine = nombre de semaines depuis le 1er janvier de l'année ISO
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const weekNum = Math.ceil(((utc.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${year}-W${String(weekNum).padStart(2, '0')}`;
}

/** Identifiant de la semaine ISO courante. */
export function currentWeekKey(now?: Date): WeekKey {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { devNowDate } = require('./devClock');
  return weekKeyOf(localDateOf(now ?? devNowDate()));
}

/** Renvoie le LUNDI (local) de la semaine ISO d'une date donnée. */
export function startOfIsoWeek(localDate: LocalDate | Date): LocalDate {
  const d =
    typeof localDate === 'string' ? parseLocalDate(localDate) : new Date(localDate);
  const dayNum = d.getDay() || 7; // dim=7
  const monday = new Date(d);
  monday.setDate(d.getDate() - (dayNum - 1));
  return localDateOf(monday);
}

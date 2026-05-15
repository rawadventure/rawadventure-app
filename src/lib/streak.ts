/**
 * streak.ts — mécanique pure du streak + joker hebdomadaire.
 *
 * Réf design system + Feature Spec V1 Socle minimum §2.4 + §2.5.
 *
 * Décisions structurantes appliquées :
 *  - D6 (modifié 7 mai 2026) : seuil Phase 0 = 5 actions/7 minimum. Seuil
 *    Phase 1 = 1 session/3 minimum. Joker hebdo en semaine calendaire fixe
 *    (lundi 00:00 → dimanche 23:59 fuseau local), 1 joker max par semaine.
 *  - D26 : soft-rappel non-culpabilisant si Phase 0 strictement < 5/7.
 *  - D27 : pas de modification rétroactive d'un check validé.
 *  - D29 : compteur `tier{N}ReachedCount` pour distinguer premier
 *    franchissement (vidéo) des redéclenchements (modale allégée).
 *  - D34 : pas de score quotidien V1 (`actions_count` affiché transitoirement
 *    dans IA-15 mais non agrégé sur la durée).
 *
 * Toutes les fonctions ici sont PURES et déterministes. Pas de side-effects,
 * pas de lecture d'horloge interne (la date courante est passée en arg si
 * nécessaire).
 *
 * IMPORTANT : ce module définit la mécanique. Le `ProgressContext` orchestre
 * la persistance (AsyncStorage en mode anonyme, Supabase en connecté) en
 * appelant ces fonctions.
 */

import type { LocalDate, WeekKey } from './calendar';
import { daysBetween, weekKeyOf } from './calendar';

// ─── Types métier ─────────────────────────────────────────────────────────────

export type Phase = 'phase_0' | 'phase_1';

export type ValidationStatus =
  | 'valid_above_threshold'  // Phase 0 ≥ 5/7 ou Phase 1 ≥ 1/3
  | 'valid_with_joker'        // Phase 0 < 5/7, joker dispo et consommé
  | 'broken_streak'           // sous le seuil ET joker indisponible
  | 'not_yet_processed';      // jour pas encore traité par la cohérence

/** Une entrée de l'historique du streak (table `streak_history`). */
export type StreakEntry = {
  local_date: LocalDate;
  validation_status: ValidationStatus;
  phase: Phase;
  streak_value_after: number;
  joker_used: boolean;
};

/** Une consommation de joker enregistrée (table `joker_consumptions`). */
export type JokerConsumption = {
  week_key: WeekKey;
  consumed_for_local_date: LocalDate;
};

// ─── Constantes des seuils (D6 modifié 7 mai 2026) ────────────────────────────

export const THRESHOLD_PHASE_0_ACTIONS = 5; // sur 7
export const THRESHOLD_PHASE_0_TOTAL = 7;
export const THRESHOLD_PHASE_1_SESSIONS = 1; // sur 3
export const THRESHOLD_PHASE_1_TOTAL = 3;

// ─── Calcul du streak courant ─────────────────────────────────────────────────

/**
 * Renvoie la valeur du streak en cours, lue directement depuis le dernier
 * `streak_value_after` enregistré. Si aucune entrée, renvoie 0.
 *
 * Convention : les entrées doivent être triées par `local_date` croissant.
 * La fonction prend la dernière (la plus récente).
 */
export function currentStreakFromHistory(history: StreakEntry[]): number {
  if (history.length === 0) return 0;
  const last = history[history.length - 1];
  return last.streak_value_after;
}

/** Plus long streak atteint au cours du parcours (réservé V1.5, calculé en interne). */
export function longestStreakFromHistory(history: StreakEntry[]): number {
  return history.reduce((max, entry) => Math.max(max, entry.streak_value_after), 0);
}

// ─── Joker hebdomadaire ───────────────────────────────────────────────────────

/**
 * Le joker est-il disponible pour la semaine ISO de `localDate` ?
 *
 * Renvoie `true` si aucune consommation n'existe pour la `week_key`
 * correspondante. Aligné §2.5 : « Le joker est dispo si, dans la semaine
 * calendaire fixe en cours, aucun joker n'a déjà été consommé ».
 */
export function isJokerAvailable(
  consumptions: JokerConsumption[],
  localDate: LocalDate,
): boolean {
  const week = weekKeyOf(localDate);
  return !consumptions.some((c) => c.week_key === week);
}

// ─── Décision de validation (cas A / B / C de §2.5) ───────────────────────────

/**
 * Détermine le statut de validation pour un jour donné.
 *
 *  - **Cas A** (`valid_above_threshold`) : Phase 0 ≥ 5/7 OU Phase 1 ≥ 1/3.
 *    Streak +1, joker non consommé.
 *  - **Cas B** (`valid_with_joker`) : Phase 0 < 5/7 ET utilisateur valide
 *    quand même (D26 soft-rappel) ET joker dispo. Streak inchangé (PAS +1).
 *    Joker consommé. *Pas de Cas B équivalent en Phase 1.*
 *  - **Cas C variante 1** (`valid_with_joker`) : journée non validée du tout,
 *    traitée à la prochaine ouverture, joker dispo → consommé, streak conservé.
 *  - **Cas C variante 2** (`broken_streak`) : sous le seuil OU non validée,
 *    joker déjà consommé cette semaine → streak passe à 0.
 *
 * @param args.phase phase courante (drive le seuil et les variantes de cas)
 * @param args.actionsCount nombre d'actions/sessions cochées par l'utilisateur
 * @param args.userValidatedManually `true` si l'utilisateur a tapé "Valider quand même"
 *   après le soft-rappel D26. Toujours `true` en Cas A. `false` si le jour est
 *   traité automatiquement par la fonction de cohérence à la prochaine ouverture
 *   après minuit (Cas C).
 * @param args.jokerAvailable état du joker pour la semaine concernée
 */
export function determineValidationStatus(args: {
  phase: Phase;
  actionsCount: number;
  userValidatedManually: boolean;
  jokerAvailable: boolean;
}): {
  status: ValidationStatus;
  jokerUsed: boolean;
  streakIncrement: number; // +1 / 0 / -prev (cassure)
} {
  const { phase, actionsCount, userValidatedManually, jokerAvailable } = args;
  const threshold =
    phase === 'phase_0' ? THRESHOLD_PHASE_0_ACTIONS : THRESHOLD_PHASE_1_SESSIONS;

  // Cas A : au-dessus du seuil.
  if (actionsCount >= threshold) {
    return { status: 'valid_above_threshold', jokerUsed: false, streakIncrement: 1 };
  }

  // Sous le seuil. Deux sous-cas selon validation manuelle ou cohérence auto.
  if (userValidatedManually && phase === 'phase_0') {
    // Cas B Phase 0 : soft-rappel D26, "Valider quand même".
    if (jokerAvailable) {
      return { status: 'valid_with_joker', jokerUsed: true, streakIncrement: 0 };
    }
    // Cas B sans joker : cassure du streak.
    return { status: 'broken_streak', jokerUsed: false, streakIncrement: -Infinity };
  }

  // Cas C : journée non validée du tout (traitée par cohérence auto).
  if (jokerAvailable) {
    return { status: 'valid_with_joker', jokerUsed: true, streakIncrement: 0 };
  }
  return { status: 'broken_streak', jokerUsed: false, streakIncrement: -Infinity };
}

/**
 * Calcule la nouvelle valeur de streak à partir de la précédente et de
 * l'incrément renvoyé par `determineValidationStatus`.
 *
 *  - increment +1 : nouvelle valeur = prev + 1
 *  - increment 0 : nouvelle valeur = prev (joker, streak conservé)
 *  - increment -Infinity : nouvelle valeur = 0 (cassure)
 */
export function applyStreakIncrement(prev: number, increment: number): number {
  if (increment === Number.POSITIVE_INFINITY || increment >= 1) return prev + 1;
  if (increment === Number.NEGATIVE_INFINITY) return 0;
  return prev;
}

// ─── Paliers de récompense (§2.6 + D29) ───────────────────────────────────────

export const TIER_THRESHOLDS = [7, 15, 30, 60, 100, 365] as const;
export type TierId = (typeof TIER_THRESHOLDS)[number];

/**
 * Détecte si le streak vient de franchir un palier en passant de `prev` à `next`.
 * Renvoie l'identifiant du palier franchi, ou `null` si aucun.
 *
 * Convention §2.6 : « Le palier est franchi à la validation d'une journée qui
 * amène le streak au seuil ». Donc franchissement strict : prev < tier <= next.
 */
export function tierJustReached(prev: number, next: number): TierId | null {
  for (const tier of TIER_THRESHOLDS) {
    if (prev < tier && next >= tier) {
      return tier;
    }
  }
  return null;
}

// ─── Cohérence calendaire à l'ouverture ───────────────────────────────────────

/**
 * Renvoie la liste des dates locales pour lesquelles aucune entrée
 * `streak_history` n'existe entre `lastProcessedDate` (exclu) et `today` (inclus).
 *
 * Sert à la fonction de cohérence appelée à chaque ouverture : pour chaque
 * jour manquant, on doit créer une ligne `streak_history` avec statut
 * `not_yet_processed` puis la résoudre selon le joker / la cassure.
 *
 * Renvoie `[]` si tout est à jour.
 */
export function missingDatesBetween(
  lastProcessedDate: LocalDate | null,
  today: LocalDate,
): LocalDate[] {
  if (!lastProcessedDate) return [];
  const delta = daysBetween(lastProcessedDate, today);
  if (delta <= 0) return [];
  const result: LocalDate[] = [];
  for (let i = 1; i <= delta; i++) {
    const d = new Date(Date.parse(lastProcessedDate));
    d.setDate(d.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    result.push(`${yyyy}-${mm}-${dd}`);
  }
  return result;
}

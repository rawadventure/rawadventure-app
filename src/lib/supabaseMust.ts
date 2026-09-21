/**
 * must — garde d'écriture Supabase (F-03/F-08, audit Lou Grenier sept 2026).
 *
 * supabase-js ne throw JAMAIS sur un échec de requête : il résout
 * `{ data, error }`. Toute écriture dont on ignore `error` peut échouer en
 * silence (réseau, RLS, contrainte) — le state React part alors en avance
 * sur la base, et au prochain lancement la journée validée ou le streak
 * « revert ». Pire : migrateLocalToRemote effaçait les clés locales après
 * des écritures peut-être échouées → perte définitive de l'onboarding.
 *
 * `must(...)` attend la requête, throw si `error` est non-null (en le
 * remontant à Sentry), sinon renvoie `data`. À utiliser sur TOUTE écriture
 * Supabase dont l'échec doit interrompre le flux appelant.
 */

import * as Sentry from '@sentry/react-native';

export async function must<T>(
  p: PromiseLike<{ data: T; error: unknown }>,
): Promise<T> {
  const { data, error } = await p;
  if (error) {
    const err =
      error instanceof Error
        ? error
        : new Error(
            typeof error === 'object' && error !== null && 'message' in error
              ? String((error as { message: unknown }).message)
              : String(error),
          );
    try {
      Sentry.captureException(err);
    } catch {
      // Sentry non initialisé (DSN absent, tests) — le throw suffit.
    }
    throw err;
  }
  return data;
}

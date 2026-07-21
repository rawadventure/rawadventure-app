/**
 * flushSync — version native : exécute simplement le callback.
 *
 * Sur natif, le <Video> de VideoPreview est monté en permanence : aucun besoin
 * de forcer un commit React synchrone. La variante web (flushSync.web.ts)
 * utilise le vrai flushSync de react-dom pour monter le <video> pendant le
 * geste utilisateur (exigence iOS Safari pour lecture + plein écran). Le split
 * par extension de plateforme évite d'embarquer react-dom dans les bundles
 * natifs.
 */
export function flushSync<R>(fn: () => R): R {
  return fn();
}

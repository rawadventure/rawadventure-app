/**
 * useKeepAwake — garde l'écran allumé tant que `active` est vrai.
 *
 * Contexte (salve M2, 11 sept 2026) : une session de cohérence cardiaque dure
 * 5/10/20 minutes sans toucher l'écran — la mise en veille iOS est garantie.
 * Le timer par horloge murale (useWallClockCountdown) valide quand même la
 * session au réveil, mais l'expérience voulue est un écran qui reste allumé
 * pendant la pratique.
 *
 * Implémentation web uniquement : API standard Screen Wake Lock
 * (`navigator.wakeLock.request('screen')`, iOS Safari/PWA ≥ 16.4). L'OS
 * libère le verrou à chaque passage en arrière-plan → on le redemande au
 * retour visible. Best-effort : API absente ou refus → silencieux, aucune
 * dépendance nouvelle. Sur natif, `navigator.wakeLock` n'existe pas → no-op
 * (expo-keep-awake à envisager à la prochaine montée de SDK).
 */

import { useEffect } from 'react';

type WakeLockSentinel = { release?: () => Promise<void> };
type WakeLockNavigator = {
  wakeLock?: { request?: (type: 'screen') => Promise<WakeLockSentinel> };
};
type VisibilityDocument = {
  visibilityState?: string;
  addEventListener?: (type: string, cb: () => void) => void;
  removeEventListener?: (type: string, cb: () => void) => void;
};

export function useKeepAwakeWhile(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const nav = (globalThis as { navigator?: WakeLockNavigator }).navigator;
    const doc = (globalThis as { document?: VisibilityDocument }).document;
    const request = nav?.wakeLock?.request;
    if (!request || !nav?.wakeLock) return;

    let sentinel: WakeLockSentinel | null = null;
    let stopped = false;

    const acquire = async () => {
      try {
        const s = await request.call(nav.wakeLock, 'screen');
        if (stopped) {
          void s.release?.();
        } else {
          sentinel = s;
        }
      } catch {
        // Refus (batterie faible, onglet caché…) : best-effort, silencieux.
      }
    };

    const onVisibility = () => {
      if (!stopped && doc?.visibilityState === 'visible') void acquire();
    };

    void acquire();
    doc?.addEventListener?.('visibilitychange', onVisibility);

    return () => {
      stopped = true;
      doc?.removeEventListener?.('visibilitychange', onVisibility);
      void sentinel?.release?.();
      sentinel = null;
    };
  }, [active]);
}

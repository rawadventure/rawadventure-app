/**
 * useDevTools — accès unique des écrans à l'outillage DEV (F-07, audit Lou).
 *
 * Les écrans de production ne déclarent plus d'état ni de require dev :
 * ils lisent `enabled` pour gater le rendu du bouton/panneau et appellent
 * les actions exposées ici — chacune no-op quand les dev tools sont
 * désactivés (devClock et devTimeline sont eux-mêmes gated).
 */

import { useCallback } from 'react';
import { isDevToolsEnabled } from '../lib/devToolsEnabled';
import { advanceDevClock } from '../lib/devClock';

export function useDevTools() {
  const enabled = isDevToolsEnabled();

  /** Avance l'horloge virtuelle d'un jour (bouton « (DEV) Passer au jour
   *  suivant »). No-op hors dev tools. */
  const advanceDay = useCallback(() => {
    advanceDevClock(1);
  }, []);

  return { enabled, advanceDay };
}

/**
 * useScaledFontSize — hook respect Dynamic Type iOS et Font Scaling Android.
 *
 * Réf design system V1.1 §11.3 : « Plafond max 1.6× pour préserver les layouts ».
 *
 * Usage : `const size = useScaledFontSize(17);` pour body-large.
 * Le hook lit le facteur d'échelle système et le clampe entre 1.0 et 1.6.
 *
 * Pour les composants qui doivent absolument ignorer le scaling système
 * (ex : compteur de streak qui doit rester dans sa bulle), utiliser
 * directement la valeur du token sans passer par ce hook + appliquer
 * `allowFontScaling={false}` sur le <Text>.
 */

import { useMemo } from 'react';
import { PixelRatio } from 'react-native';

const SCALE_MIN = 1.0;
const SCALE_MAX = 1.6;

export function useScaledFontSize(baseSize: number): number {
  return useMemo(() => {
    const rawScale = PixelRatio.getFontScale();
    const clampedScale = Math.min(SCALE_MAX, Math.max(SCALE_MIN, rawScale));
    return Math.round(baseSize * clampedScale);
  }, [baseSize]);
}

/** Facteur d'échelle clampé, utile pour des calculs dérivés (line-height, espacements). */
export function useFontScale(): number {
  return useMemo(() => {
    const rawScale = PixelRatio.getFontScale();
    return Math.min(SCALE_MAX, Math.max(SCALE_MIN, rawScale));
  }, []);
}

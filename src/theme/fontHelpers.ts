/**
 * fontHelpers — utilitaires de résolution Inter font family.
 *
 * `@expo-google-fonts/inter` charge chaque poids comme une famille distincte
 * (`Inter_400Regular`, `Inter_500Medium`, etc.). Pour styler un Text, on doit
 * donc passer `fontFamily: 'Inter_700Bold'` plutôt que combiner `fontWeight`.
 *
 * Ces helpers centralisent le mapping poids → fontFamily exact, et fournissent
 * un `interTextStyle(scale)` qui combine fontFamily + lineHeight + letterSpacing
 * depuis un niveau typographique du design system V1.1 §3.2.
 */

import type { TextStyle } from 'react-native';
import { typography } from './theme-tokens';

export type InterWeight = '400' | '500' | '600' | '700' | '800';

const WEIGHT_TO_FAMILY: Record<InterWeight, string> = {
  '400': 'Inter_400Regular',
  '500': 'Inter_500Medium',
  '600': 'Inter_600SemiBold',
  '700': 'Inter_700Bold',
  '800': 'Inter_800ExtraBold',
};

export function getInterFamily(weight: InterWeight): string {
  return WEIGHT_TO_FAMILY[weight];
}

export type TypographyScale = keyof typeof typography.scale;

/**
 * Convertit un niveau typographique du design system V1.1 (§3.2) en `TextStyle`
 * exploitable directement par un <Text>. Inclut fontFamily Inter du bon poids,
 * fontSize, lineHeight, letterSpacing.
 *
 * Usage :
 *   <Text style={interTextStyle('h1')}>Titre</Text>
 */
export function interTextStyle(scale: TypographyScale): TextStyle {
  const t = typography.scale[scale];
  return {
    fontFamily: getInterFamily(t.fontWeight as InterWeight),
    fontSize: t.fontSize,
    lineHeight: t.lineHeight,
    letterSpacing: t.letterSpacing,
  };
}

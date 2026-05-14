/**
 * src/theme/index.ts — point d'entrée de la couche thème.
 *
 * Deux strates cohabitent en V1 :
 *
 * 1. Tokens V1.1 (source de vérité — design system V1.1) :
 *    `tokens`, `brandColors`, `pillarColors`, `treeColors`, `neutralColors`,
 *    `semanticColors`, `typography`, `space`, `radius` (V1.1), `elevation`,
 *    `motion`, `iconSize`, `layout`, plus hooks `usePillarTheme` et
 *    `useScaledFontSize`. À utiliser pour tout NOUVEAU code.
 *
 * 2. Exports legacy V0 (`colors`, `fonts`, `spacing`, `radius` ancien) :
 *    palette sombre héritée du proto V0 (background noir, vert flat). Consommés
 *    par 8 écrans V0 (AuthScreen, ChecklistScreen, ConversionScreen, DayScreen,
 *    HomeScreen, OnboardingScreen, ProtocolScreen, SettingsScreen) + App.tsx.
 *
 *    À RETIRER au fil des refontes (chantier M2+M3 calendaire en Sprint 3,
 *    chantier M5 conversion, M7 inversion flow auth, refonte Phase 1 S1).
 *    Tant qu'un écran V0 n'a pas été migré vers les tokens V1.1, il continue
 *    de consommer ces exports legacy.
 *
 *    Le token `radius` V1.1 (qui inclut `pill`, `2xl`, etc.) est ré-exporté
 *    sous l'alias `radiusV1` pour éviter le conflit avec le legacy.
 */

// ─── Strate V1.1 — tokens V1 (source de vérité) ───────────────────────────────
export {
  brandColors,
  pillarColors,
  treeColors,
  neutralColors,
  semanticColors,
  typography,
  space,
  radius as radiusV1,
  elevation,
  motion,
  iconSize,
  layout,
  tokens,
} from './theme-tokens';
export type { PillarKey } from './theme-tokens';

// ─── Strate V1.1 — hooks ──────────────────────────────────────────────────────
export { usePillarTheme } from './usePillarTheme';
export type { PillarContext, PillarTheme } from './usePillarTheme';
export { useScaledFontSize, useFontScale } from './useScaledFontSize';

// ─── Strate legacy V0 — à retirer au fil des refontes ─────────────────────────
// Palette sombre flat héritée du V0. NE PAS UTILISER pour le nouveau code.
export const colors = {
  greenDark: '#1B5E20',
  green: '#2E7D32',
  greenLight: '#4CAF50',
  background: '#0A0A0A',
  surface: '#141414',
  border: '#2A2A2A',
  white: '#FFFFFF',
  gray: '#888888',
  grayLight: '#CCCCCC',
  black: '#000000',
};

export const fonts = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  black: 'System',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

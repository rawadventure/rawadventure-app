/**
 * Raw Adventure App — Design System V1 Tokens
 *
 * Source de vérité technique pour toutes les valeurs visuelles de l'app.
 * Dérivé du Design Système V1 (markdown), sections 2 à 11.
 *
 * Auteur : Stéphane (avec assistance Claude)
 * Version : 1.1 — 14 mai 2026
 *
 * CHANGELOG v1.0 → v1.1 :
 * - Section 2.2 : pillar.phase0 dispose désormais de sa propre paire chromatique
 *   pêche corail (#FFB87A bg, #3D1A0F text, #E65D3C headerBg). pillar.neutral
 *   conserve le fond crème mais est désormais réservé aux écrans Toile et Profil.
 * - Section 2.2 : ajout d'un sous-token headerBg sur chaque pilier pour la couleur
 *   du header pilier illustré.
 * - Section 5 : nouveau composant "Header pilier illustré" avec logo Raw Adventure
 *   en filigrane (constantes ajoutées dans `layout.pillarHeader`).
 * - Section 6 : composant Toile remplacé par version hybride camembert + radar.
 *   Marqué provisoire, à itérer avec Mimi.
 */

// 1. COULEURS DE MARQUE — Section 2.1
export const brandColors = {
  deep: '#1F1147',
  sun: '#F4C95D',
  alive: '#7BA84A',
  cream: '#F5EEDF',
  flame: '#E66B2E',
} as const;

// 2. COULEURS PAR PILIER — Section 2.2
export const pillarColors = {
  phase0: {
    bg: '#FFB87A',
    text: '#3D1A0F',
    headerBg: '#E65D3C',
    contrastRatio: 8.2,
  },
  s1: {
    bg: '#C9DFEC',
    text: '#1A2D4D',
    headerBg: '#4A7AB3',
    contrastRatio: 9.6,
  },
  s2: {
    bg: '#F4A87E',
    text: '#3D1A0F',
    headerBg: '#D4734A',
    contrastRatio: 8.4,
  },
  s3: {
    bg: '#F5C896',
    text: '#3D2810',
    headerBg: '#C99650',
    contrastRatio: 7.9,
  },
  s4: {
    bg: '#D9F2B0',
    text: '#1F3D14',
    headerBg: '#7AB04A',
    contrastRatio: 10.2,
  },
  s5: {
    bg: '#DCC5F0',
    text: '#2D1B6B',
    headerBg: '#8E6FBC',
    contrastRatio: 11.4,
  },
  s6: {
    bg: '#F2B5C2',
    text: '#4D1A28',
    headerBg: '#C76680',
    contrastRatio: 8.7,
  },
  s7: {
    bg: '#F7D670',
    text: '#3D2A0A',
    headerBg: '#BA7517',
    contrastRatio: 10.6,
  },
  s8: {
    bg: '#B5DDD0',
    text: '#0F3D32',
    headerBg: '#6CA48E',
    contrastRatio: 11.1,
  },
  neutral: {
    bg: '#F5EEDF',
    text: '#1F1147',
    headerBg: '#1F1147',
    contrastRatio: 12.8,
  },
} as const;

export type PillarKey = keyof typeof pillarColors;

// 3. COULEURS NEUTRES — Section 2.3
export const neutralColors = {
  textSecondary: '#5A4B7A',
  textMuted: '#8A7CA8',
  textInverse: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  borderSubtle: '#E8DFC8',
  borderVisible: '#C9B8A0',
  disabledBg: '#E5DEC9',
  disabledText: '#A89B7E',
} as const;

// 4. COULEURS SÉMANTIQUES UI — Section 2.4
export const semanticColors = {
  success: '#5A8F2E',
  successBg: '#D8E9C2',
  danger: '#B83A2E',
  dangerBg: '#F2D4CF',
  alert: '#D4861F',
  alertBg: '#F2E0C2',
  info: '#3D6B9E',
  infoBg: '#D4DCEA',
  focus: '#7BA84A',
} as const;

// 5. COULEURS DES BRANCHES DE TOILE — Section 6.3
export const treeColors = {
  s1: { stroke: '#4A7AB3', tip: '#2D5085' },
  s2: { stroke: '#D4734A', tip: '#A4502D' },
  s3: { stroke: '#C99650', tip: '#9A6E2E' },
  s4: { stroke: '#7AB04A', tip: '#558030' },
  s5: { stroke: '#8E6FBC', tip: '#5D448F' },
  s6: { stroke: '#C76680', tip: '#94405A' },
  s7: { stroke: '#D4A24A', tip: '#A47830' },
  s8: { stroke: '#6CA48E', tip: '#418068' },
} as const;

// 6. TYPOGRAPHIE — Section 3
export const typography = {
  family: {
    system: 'Inter',
    brand: 'Lulo Clean',
    editorial: 'Georgia Pro',
  },
  scale: {
    display: { fontSize: 36, fontWeight: '800', lineHeight: 40, letterSpacing: -0.72 },
    displayAlt: { fontSize: 42, fontWeight: '800', lineHeight: 46, letterSpacing: -0.84 },
    h1: { fontSize: 28, fontWeight: '700', lineHeight: 34, letterSpacing: -0.28 },
    h2: { fontSize: 22, fontWeight: '700', lineHeight: 28, letterSpacing: 0 },
    h3: { fontSize: 18, fontWeight: '600', lineHeight: 24, letterSpacing: 0 },
    bodyLarge: { fontSize: 17, fontWeight: '400', lineHeight: 26, letterSpacing: 0 },
    bodyLargeEmphasis: { fontSize: 17, fontWeight: '600', lineHeight: 26, letterSpacing: 0 },
    body: { fontSize: 15, fontWeight: '400', lineHeight: 22, letterSpacing: 0 },
    bodySmall: { fontSize: 13, fontWeight: '400', lineHeight: 19, letterSpacing: 0 },
    caption: { fontSize: 12, fontWeight: '500', lineHeight: 16, letterSpacing: 0.24 },
    button: { fontSize: 16, fontWeight: '600', lineHeight: 20, letterSpacing: 0 },
  },
} as const;

// 7. ESPACEMENTS — Section 4.1
export const space = {
  0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48, 8: 64, 9: 96,
} as const;

// 8. RAYONS DE BORDURE — Section 4.5
export const radius = {
  none: 0, sm: 4, md: 8, lg: 12, xl: 16, '2xl': 24, pill: 9999, full: 9999,
} as const;

// 9. ÉLÉVATIONS ET OMBRES — Section 4.6
export const elevation = {
  0: { shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
  1: { shadowColor: '#1F1147', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  2: { shadowColor: '#1F1147', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 8 },
} as const;

// 10. ANIMATIONS — Section 9
export const motion = {
  duration: {
    instant: 100, fast: 200, standard: 300, slow: 500, narrative: 1000, structural: 2500,
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
    accelerate: 'cubic-bezier(0.4, 0.0, 1.0, 1.0)',
    bouncy: 'cubic-bezier(0.5, 1.5, 0.5, 1.0)',
  },
} as const;

// 11. TAILLES D'ICÔNES — Section 7.2
export const iconSize = { xs: 16, sm: 20, md: 24, lg: 32, xl: 48 } as const;

// 12. CONSTANTES DE LAYOUT
export const layout = {
  screen: {
    marginHorizontal: 24,
    marginHorizontalTight: 16,
    marginHorizontalWide: 32,
    paddingTopStandard: 16,
    paddingTopNarrative: 32,
    paddingBottom: 16,
  },
  maxWidth: { prose: 560, card: 400, narrative: 480 },
  touchTargetMin: 44,
  tabBarHeight: 56,
  headerHeight: 44,
  pillarHeader: {
    paddingTop: 18,
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    logoFiligraneOpacity: {
      pillar: 0.14,
      phase0: 0.16,
      neutral: 0.08,
    },
    logoFiligraneSize: 280,
    logoFiligraneRight: -60,
    logoFiligraneTop: -40,
  },
  brandLogo: { onboardingSize: 220, splashSize: 160 },
  streakCounter: { paddingVertical: 6, paddingHorizontal: 12, iconSize: 14, fontSize: 13 },
} as const;

// EXPORT GROUPÉ
export const tokens = {
  colors: { brand: brandColors, pillar: pillarColors, neutral: neutralColors, semantic: semanticColors, tree: treeColors },
  typography,
  space,
  radius,
  elevation,
  motion,
  iconSize,
  layout,
} as const;

export default tokens;

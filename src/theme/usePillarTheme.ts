/**
 * usePillarTheme — hook de résolution de palette par contexte de pilier.
 *
 * Réfs design system V1.1 §2.2 et §12 :
 * - 10 contextes (Phase 0 + S1..S8 + neutral Toile/Profil)
 * - chaque contexte porte une paire fond/texte + une couleur headerBg
 * - tous validés WCAG AA (ratios documentés dans tokens)
 *
 * V1 : le contexte est passé en argument explicite. À terme (Sprint 3+),
 * un second hook `usePillarContextFromProgress()` lira le contexte courant
 * depuis le ProgressContext (Phase 0 vs S{1..8} en cours vs neutre Toile/Profil)
 * et alimentera automatiquement ce hook depuis les écrans concernés.
 */

import { useMemo } from 'react';
import { pillarColors, treeColors, brandColors } from './theme-tokens';

export type PillarContext =
  | 'phase0'
  | 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8'
  | 'neutral';

export type PillarTheme = {
  /** Fond plein de l'écran (corps). */
  bg: string;
  /** Couleur de texte principale du contexte. */
  text: string;
  /** Couleur du Header pilier illustré (cf. PillarHeader §5.8). */
  headerBg: string;
  /** Ratio de contraste fond/texte (documenté, ≥ WCAG AA 4.5:1). */
  contrastRatio: number;
  /** Couleur stroke saturée pour la toile (undefined sur Phase 0 et neutral). */
  treeStroke?: string;
  /** Couleur tip foncée pour la toile (undefined sur Phase 0 et neutral). */
  treeTip?: string;
  /** Opacité recommandée du logo Raw Adventure en filigrane sur le header. */
  filigraneOpacity: number;
  /** Couleur de texte à utiliser SUR le headerBg (inverse pour contextes colorés). */
  headerText: string;
};

const FILIGRANE_OPACITY: Record<PillarContext, number> = {
  phase0: 0.16,
  s1: 0.14, s2: 0.14, s3: 0.14, s4: 0.14,
  s5: 0.14, s6: 0.14, s7: 0.14, s8: 0.14,
  neutral: 0.08,
};

export function usePillarTheme(context: PillarContext): PillarTheme {
  return useMemo(() => {
    const palette = pillarColors[context];
    const tree =
      context === 'phase0' || context === 'neutral'
        ? { stroke: undefined, tip: undefined }
        : treeColors[context];

    return {
      bg: palette.bg,
      text: palette.text,
      headerBg: palette.headerBg,
      contrastRatio: palette.contrastRatio,
      treeStroke: tree.stroke,
      treeTip: tree.tip,
      filigraneOpacity: FILIGRANE_OPACITY[context],
      // Sur header coloré (Phase 0 + S1-S8) on écrit en blanc inversé.
      // Sur header neutre (crème) on écrit en violet profond de marque.
      headerText: context === 'neutral' ? brandColors.deep : '#FFFFFF',
    };
  }, [context]);
}

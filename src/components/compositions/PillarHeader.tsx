/**
 * PillarHeader — Header pilier illustré (composant signature V1.1).
 *
 * Réf design system V1.1 §5.8 + Patch 2 du 14 mai 2026.
 *
 * Bande horizontale collée au top de l'écran sous la status bar. Élément
 * signature des écrans courants Phase 0 ET Phase 1.
 *
 * Anatomie :
 *  - Fond plein dans la couleur `pillar.{contexte}.headerBg`
 *  - Coins inférieurs `radius.2xl` (32px)
 *  - Logo Raw Adventure en filigrane top-right avec dépassement (opacité héritée
 *    du contexte via `usePillarTheme().filigraneOpacity`)
 *  - Petit cercle décoratif bottom-left (couleur du fond pastel, opacité 35-55%)
 *  - Contenu textuel :
 *      · marqueur uppercase letter-spacing 0.6px en blanc 85% (ex: "SEMAINE 7")
 *      · titre Inter Display 32px weight 800 blanc
 *      · ligne métadonnées : dayLabel + StreakBubble intégrée + nextTier optionnel
 *
 * IMPORTANT : la bulle streak est INTÉGRÉE dans la ligne de métadonnées,
 * pas flottante en haut à droite de l'écran (Patch 2).
 */

import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { layout, neutralColors, space, usePillarTheme } from '../../theme';
import type { PillarContext } from '../../theme';
import { getInterFamily } from '../../theme';
import { LogoRawAdventure } from '../illustrations';
import { StreakBubble } from './StreakBubble';

export type PillarHeaderProps = {
  /** Contexte de pilier — détermine la palette. */
  context: PillarContext;
  /** Marqueur uppercase au-dessus du titre. Ex : "SEMAINE 7", "PHASE 0 · AMORÇAGE". */
  marker: string;
  /** Titre principal. Ex : "Mindset", "Amorçage". */
  title: string;
  /** Libellé de jour en métadonnée. Ex : "Jour 4 sur 7". Optionnel. */
  dayLabel?: string;
  /** Nombre de jours de streak. Si fourni, affiche la StreakBubble intégrée. */
  streakDays?: number;
  /** Libellé du prochain palier. Ex : "Prochain palier · 15j". Optionnel. */
  nextTierLabel?: string;
  /** Style additionnel sur le conteneur racine. */
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function PillarHeader({
  context,
  marker,
  title,
  dayLabel,
  streakDays,
  nextTierLabel,
  style,
  testID,
}: PillarHeaderProps) {
  const theme = usePillarTheme(context);

  // Petit cercle décoratif : reprend la couleur du fond pastel pilier.
  // Sur contexte 'neutral' (crème), on n'affiche pas le cercle (pas de pastel saturé).
  const showDecorativeCircle = context !== 'neutral';

  const containerStyle: ViewStyle = {
    backgroundColor: theme.headerBg,
    paddingTop: layout.pillarHeader.paddingTop,
    paddingHorizontal: layout.pillarHeader.paddingHorizontal,
    paddingBottom: layout.pillarHeader.paddingBottom,
    borderBottomLeftRadius: layout.pillarHeader.borderBottomLeftRadius,
    borderBottomRightRadius: layout.pillarHeader.borderBottomRightRadius,
    overflow: 'hidden',
  };

  const hasMeta = !!(dayLabel || streakDays != null || nextTierLabel);

  return (
    <View style={[containerStyle, style]} testID={testID}>
      {/* Logo Raw Adventure en filigrane top-right avec dépassement */}
      <LogoRawAdventure
        variant="filigrane"
        size={layout.pillarHeader.logoFiligraneSize}
        opacity={theme.filigraneOpacity}
        color={theme.headerText}
        style={[
          styles.filigrane,
          {
            right: layout.pillarHeader.logoFiligraneRight,
            top: layout.pillarHeader.logoFiligraneTop,
          },
        ]}
      />

      {/* Petit cercle décoratif bottom-left */}
      {showDecorativeCircle && (
        <View
          pointerEvents="none"
          style={[
            styles.decorativeCircle,
            { backgroundColor: theme.bg },
          ]}
        />
      )}

      {/* Contenu textuel */}
      <View style={styles.content}>
        <Text style={[styles.marker, { color: theme.headerText }]}>
          {marker.toUpperCase()}
        </Text>
        <Text style={[styles.title, { color: theme.headerText }]} numberOfLines={2}>
          {title}
        </Text>

        {hasMeta && (
          <View style={styles.metaRow}>
            {dayLabel && (
              <Text style={[styles.metaLabel, { color: theme.headerText }]}>
                {dayLabel}
              </Text>
            )}
            {streakDays != null && <StreakBubble days={streakDays} />}
            {nextTierLabel && (
              <Text style={[styles.metaLabel, { color: theme.headerText, opacity: 0.75 }]}>
                {nextTierLabel}
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filigrane: {
    position: 'absolute',
  },
  decorativeCircle: {
    position: 'absolute',
    width: 95,
    height: 95,
    borderRadius: 9999,
    bottom: -30,
    left: -30,
    opacity: 0.45,
  },
  content: {
    // Sous les éléments décoratifs (filigrane + cercle) grâce au z-index implicite.
    zIndex: 1,
  },
  marker: {
    fontFamily: getInterFamily('500'),
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    opacity: 0.85,
    marginBottom: space[2],
  },
  title: {
    fontFamily: getInterFamily('800'),
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.64,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: space[3],
    marginTop: space[3],
  },
  metaLabel: {
    fontFamily: getInterFamily('500'),
    fontSize: 13,
    lineHeight: 19,
  },
});

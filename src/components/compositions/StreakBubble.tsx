/**
 * StreakBubble — bulle de compteur de streak.
 *
 * Réf design system V1.1 §5.7 + Patch 2 du 14 mai 2026.
 *
 * Pastille blanche radius.pill, padding vertical 6px / horizontal 12px,
 * icône flamme Lucide 14px en `brand.flame` (#E66B2E), chiffre weight 700 +
 * libellé "jours" caption weight 500. Box-shadow subtile pour détachement
 * sur fond coloré.
 *
 * IMPORTANT (Patch 2) : ce composant est INTÉGRÉ dans le PillarHeader
 * (ligne de métadonnées sous le titre du pilier), pas flottant en haut à
 * droite de l'écran. Le streak counter du V0 (qui flotte) est obsolète.
 *
 * Animation d'incrément (flip vertical 350ms) à implémenter en Sprint 3 quand
 * le ProgressContext refactor M2+M3 expose un événement "streak incremented".
 * En Sprint 1, le composant rend statiquement la valeur passée en prop.
 */

import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { Flame } from 'lucide-react-native';
import { brandColors, neutralColors, radiusV1, space } from '../../theme';
import { getInterFamily } from '../../theme';

export type StreakBubbleProps = {
  /** Nombre de jours de streak (≥ 0). */
  days: number;
  /** Style additionnel (positionnement). */
  style?: StyleProp<ViewStyle>;
  /** Cacher le libellé "jours" (mode ultra-compact). */
  hideLabel?: boolean;
  testID?: string;
};

export function StreakBubble({
  days,
  style,
  hideLabel = false,
  testID,
}: StreakBubbleProps) {
  return (
    <View
      style={[styles.bubble, style]}
      accessibilityRole="text"
      accessibilityLabel={`Streak de ${days} jour${days > 1 ? 's' : ''}`}
      testID={testID}
    >
      <Flame size={14} color={brandColors.flame} fill={brandColors.flame} />
      <Text style={styles.count}>{days}</Text>
      {!hideLabel && <Text style={styles.label}>{days > 1 ? 'jours' : 'jour'}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: neutralColors.surfaceElevated,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radiusV1.pill,
    // Box-shadow subtile pour détachement sur header coloré.
    shadowColor: '#1F1147',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    alignSelf: 'flex-start',
  },
  count: {
    fontFamily: getInterFamily('700'),
    fontSize: 13,
    lineHeight: 19,
    color: '#1F1147',
    marginLeft: space[1],
  },
  label: {
    fontFamily: getInterFamily('500'),
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.24,
    color: '#1F1147',
    marginLeft: 4,
  },
});

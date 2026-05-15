/**
 * LevelSelector — sélecteur de niveau adaptatif Moins / Pareil / Plus.
 *
 * Réf design system V1.1 §5.4 + IA V3 §IA-44.
 *
 * 3 boutons côte à côte, hauteur 56px, radius.lg, état sélectionné fond
 * couleur de texte du pilier + label blanc.
 *
 * Le niveau adaptatif est MANUEL en V1 (D31) : pas de suggestion automatique.
 * Sémantique précisée 7 mai 2026 (V6 de la Synthèse) : ce sélecteur peut être
 * proposé contextuellement par l'app après plusieurs "Moins" successifs, mais
 * le changement effectif reste manuel via IA-44 ou IA-41/IA-42.
 */

import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import { TrendingDown, Minus, TrendingUp } from 'lucide-react-native';
import {
  brandColors,
  neutralColors,
  radiusV1,
  space,
  usePillarTheme,
} from '../../theme';
import type { PillarContext } from '../../theme';
import { getInterFamily } from '../../theme';

export type AdaptiveLevel = 'less' | 'same' | 'more';

export type LevelSelectorProps = {
  value: AdaptiveLevel | null;
  onChange: (next: AdaptiveLevel) => void;
  context?: PillarContext;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const LEVELS: { id: AdaptiveLevel; label: string; Icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
  { id: 'less', label: 'Moins', Icon: TrendingDown },
  { id: 'same', label: 'Pareil', Icon: Minus },
  { id: 'more', label: 'Plus', Icon: TrendingUp },
];

export function LevelSelector({
  value,
  onChange,
  context = 'neutral',
  disabled = false,
  style,
  testID,
}: LevelSelectorProps) {
  const theme = usePillarTheme(context);

  return (
    <View style={[styles.container, style]} testID={testID}>
      {LEVELS.map(({ id, label, Icon }) => {
        const selected = value === id;
        const btnStyle: ViewStyle = {
          flex: 1,
          height: 56,
          borderRadius: radiusV1.lg,
          backgroundColor: selected ? theme.text : neutralColors.surfaceElevated,
          borderWidth: selected ? 0 : 1.5,
          borderColor: theme.text,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        };

        const labelStyle: TextStyle = {
          fontFamily: getInterFamily('600'),
          fontSize: 15,
          color: selected ? brandColors.cream : theme.text,
          marginLeft: space[2],
        };

        return (
          <Pressable
            key={id}
            onPress={() => !disabled && onChange(id)}
            disabled={disabled}
            hitSlop={4}
            accessibilityRole="radio"
            accessibilityState={{ selected, disabled }}
            accessibilityLabel={label}
            style={({ pressed }) => [
              btnStyle,
              { opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
            ]}
          >
            <Icon size={18} color={selected ? brandColors.cream : theme.text} />
            <Text style={labelStyle}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: space[2],
    width: '100%',
  },
});

/**
 * Scale15 — composant signature des évaluations 12 questions par pilier.
 *
 * Réf design system V1.1 §5.4.
 *
 * 5 boutons cercles 56×56px disposés horizontalement. État sélectionné :
 * fond `brand.alive`, chiffre blanc, scale bouncy 0.92 → 1.05 → 1.0.
 *
 * Utilisé en IA-40 (évaluation initiale) et IA-46 (évaluation finale) pour
 * chaque pilier — 12 questions × valeurs 1 à 5.
 *
 * Inversion sémantique : la prop `value` capture la sélection brute 1-5. Le
 * calcul du score (et inversion des questions Q6/Q7/Q8 pour S1, cf. Feature
 * Spec S1 § 2.2) est de la responsabilité du composant parent, pas de Scale15.
 */

import React, { useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { brandColors, neutralColors, space, usePillarTheme } from '../../theme';
import type { PillarContext } from '../../theme';
import { getInterFamily } from '../../theme';

export type Scale15Value = 1 | 2 | 3 | 4 | 5;

export type Scale15Props = {
  value?: Scale15Value | null;
  onChange: (next: Scale15Value) => void;
  context?: PillarContext;
  /** Libellés de borne (gauche / droite). Ex : "Jamais" / "Toujours". */
  leftLabel?: string;
  rightLabel?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const CIRCLE_SIZE = 56;

export function Scale15({
  value,
  onChange,
  context = 'neutral',
  leftLabel,
  rightLabel,
  disabled = false,
  style,
  testID,
}: Scale15Props) {
  const theme = usePillarTheme(context);

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.row}>
        {([1, 2, 3, 4, 5] as Scale15Value[]).map((n) => (
          <ScaleCircle
            key={n}
            value={n}
            selected={value === n}
            onPress={() => !disabled && onChange(n)}
            disabled={disabled}
            textColor={theme.text}
          />
        ))}
      </View>
      {(leftLabel || rightLabel) && (
        <View style={styles.labelsRow}>
          <Text style={[styles.boundLabel, { color: neutralColors.textSecondary }]}>
            {leftLabel ?? ''}
          </Text>
          <Text
            style={[
              styles.boundLabel,
              { color: neutralColors.textSecondary, textAlign: 'right' },
            ]}
          >
            {rightLabel ?? ''}
          </Text>
        </View>
      )}
    </View>
  );
}

type ScaleCircleProps = {
  value: Scale15Value;
  selected: boolean;
  onPress: () => void;
  disabled: boolean;
  textColor: string;
};

function ScaleCircle({ value, selected, onPress, disabled, textColor }: ScaleCircleProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (selected) {
      // Bouncy 0.92 → 1.05 → 1.0 (§5.4)
      scale.value = withSequence(
        withTiming(0.92, { duration: 80 }),
        withSpring(1.0, { damping: 7, stiffness: 200, mass: 0.5, overshootClamping: false }),
      );
    }
  }, [selected, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const circleStyle: ViewStyle = {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: selected ? brandColors.alive : 'transparent',
    borderWidth: selected ? 0 : 1.5,
    borderColor: textColor,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const labelStyle: TextStyle = {
    fontFamily: getInterFamily('700'),
    fontSize: 20,
    color: selected ? '#FFFFFF' : textColor,
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={4}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={`Note ${value} sur 5`}
      style={({ pressed }) => ({ opacity: disabled ? 0.5 : pressed ? 0.85 : 1 })}
    >
      <Animated.View style={[circleStyle, animatedStyle]}>
        <Text style={labelStyle}>{value}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: space[2],
    paddingHorizontal: space[1],
  },
  boundLabel: {
    fontFamily: getInterFamily('500'),
    fontSize: 12,
    letterSpacing: 0.24,
    flex: 1,
  },
});

/**
 * Checkbox — case à cocher.
 *
 * Réf design system V1.1 §5.3.
 *
 * 2 tailles :
 *  - `large` (Phase 0, par défaut) : 28×28px, bordure 2px, animation bouncy
 *  - `standard` : 22×22px, bordure 1.5px
 *
 * Quand cochée : fond plein `brand.alive` + check blanc 18px centré.
 * Quand non cochée : fond transparent, bordure couleur de texte du pilier.
 *
 * Toute la ligne (libellé inclus) est tap-cible. Tap target ≥ 44pt (hitSlop).
 * Transition scale bouncy 250ms à la transition.
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
import { Check } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { brandColors, radiusV1, space, usePillarTheme } from '../../theme';
import type { PillarContext } from '../../theme';
import { getInterFamily } from '../../theme';

export type CheckboxSize = 'large' | 'standard';

export type CheckboxProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  size?: CheckboxSize;
  context?: PillarContext;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const SIZE_BOX: Record<CheckboxSize, number> = {
  large: 28,
  standard: 22,
};

const SIZE_BORDER: Record<CheckboxSize, number> = {
  large: 2,
  standard: 1.5,
};

const SIZE_CHECK: Record<CheckboxSize, number> = {
  large: 18,
  standard: 14,
};

export function Checkbox({
  checked,
  onChange,
  label,
  size = 'large',
  context = 'phase0',
  disabled = false,
  style,
  testID,
}: CheckboxProps) {
  const theme = usePillarTheme(context);
  const scale = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    if (checked) {
      // Apparition bouncy : 0 → 1.15 → 1
      scale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withSpring(1, { damping: 8, stiffness: 180, mass: 0.6 }),
      );
    } else {
      scale.value = withTiming(0, { duration: 150 });
    }
  }, [checked, scale]);

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  const box = SIZE_BOX[size];

  const boxStyle: ViewStyle = {
    width: box,
    height: box,
    borderRadius: radiusV1.md,
    borderWidth: checked ? 0 : SIZE_BORDER[size],
    borderColor: theme.text,
    backgroundColor: checked ? brandColors.alive : 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const labelStyle: TextStyle = {
    fontFamily: getInterFamily('500'),
    fontSize: 15,
    lineHeight: 22,
    color: theme.text,
    marginLeft: space[3],
    flex: 1,
  };

  return (
    <Pressable
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
      hitSlop={12}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label}
      testID={testID}
      style={({ pressed }) => [
        styles.row,
        { opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      <View style={boxStyle}>
        <Animated.View style={checkAnimatedStyle}>
          <Check size={SIZE_CHECK[size]} color="#FFFFFF" strokeWidth={3} />
        </Animated.View>
      </View>
      {label && <Text style={labelStyle}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44, // touch target accessibilité §11.2
    paddingVertical: space[1],
  },
});

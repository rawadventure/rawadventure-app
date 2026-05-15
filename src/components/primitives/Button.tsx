/**
 * Button — bouton primitif.
 *
 * Réf design system V1.1 §5.1.
 *
 * 4 variantes :
 *  - `primary` : fond couleur de texte du pilier, libellé crème, radius.pill
 *  - `secondary` : fond blanc, bordure 1.5px couleur pilier, texte pilier
 *  - `ghost` : pas de fond, texte coloré pilier
 *  - `destructive` : fond `semantic.danger`, libellé blanc (rare)
 *
 * 3 tailles :
 *  - `compact` : hauteur 36px, texte 14px
 *  - `standard` : hauteur 48px, texte 16px (par défaut)
 *  - `large` : hauteur 56px, texte 17px (écrans narratifs)
 *
 * États : pressed (opacité 0.85), disabled (fond `neutral.disabledBg`, texte
 * `neutral.disabledText`), loading (spinner blanc, label caché, désactive tap).
 *
 * Icône optionnelle leading ou trailing (composant Lucide passé en prop).
 *
 * Le contexte de pilier détermine la teinte. Sans `context`, défaut `neutral`
 * (texte violet profond, fond crème — pour écrans Toile/Profil).
 */

import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import {
  brandColors,
  neutralColors,
  semanticColors,
  radiusV1,
  space,
  usePillarTheme,
} from '../../theme';
import type { PillarContext } from '../../theme';
import { getInterFamily } from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'compact' | 'standard' | 'large';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Contexte de pilier — détermine la couleur. Défaut : 'neutral'. */
  context?: PillarContext;
  /** Désactive le bouton (visuel + interaction). */
  disabled?: boolean;
  /** Affiche un spinner et désactive l'interaction. */
  loading?: boolean;
  /** Largeur 100% du parent. */
  fullWidth?: boolean;
  /** Icône à gauche du label (composant Lucide). */
  IconLeft?: React.ComponentType<{ size?: number; color?: string }>;
  /** Icône à droite du label (composant Lucide). */
  IconRight?: React.ComponentType<{ size?: number; color?: string }>;
  /** Style additionnel sur le conteneur. */
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
};

const SIZE_HEIGHT: Record<ButtonSize, number> = {
  compact: 36,
  standard: 48,
  large: 56,
};

const SIZE_FONT: Record<ButtonSize, number> = {
  compact: 14,
  standard: 16,
  large: 17,
};

const SIZE_PADDING: Record<ButtonSize, number> = {
  compact: space[3],
  standard: space[4],
  large: space[5],
};

const SIZE_ICON: Record<ButtonSize, number> = {
  compact: 16,
  standard: 18,
  large: 20,
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'standard',
  context = 'neutral',
  disabled = false,
  loading = false,
  fullWidth = false,
  IconLeft,
  IconRight,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: ButtonProps) {
  const theme = usePillarTheme(context);
  const isInactive = disabled || loading;

  // Résolution des couleurs selon variante.
  // En primaire : fond = couleur de texte du pilier (`theme.text`), libellé crème.
  // En secondaire : fond blanc, bordure + texte = couleur de texte du pilier.
  // En ghost : transparent, texte = couleur de texte du pilier.
  // En destructive : fond rouge sémantique, libellé blanc.
  const variantStyles = (() => {
    if (variant === 'primary') {
      return {
        bg: theme.text,
        border: 'transparent',
        text: brandColors.cream,
      };
    }
    if (variant === 'secondary') {
      return {
        bg: neutralColors.surfaceElevated,
        border: theme.text,
        text: theme.text,
      };
    }
    if (variant === 'ghost') {
      return {
        bg: 'transparent',
        border: 'transparent',
        text: theme.text,
      };
    }
    // destructive
    return {
      bg: semanticColors.danger,
      border: 'transparent',
      text: '#FFFFFF',
    };
  })();

  const containerStyle: ViewStyle = {
    height: SIZE_HEIGHT[size],
    borderRadius: radiusV1.pill,
    paddingHorizontal: SIZE_PADDING[size],
    backgroundColor: isInactive ? neutralColors.disabledBg : variantStyles.bg,
    borderWidth: variant === 'secondary' ? 1.5 : 0,
    borderColor: isInactive ? neutralColors.disabledBg : variantStyles.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    minWidth: SIZE_HEIGHT[size], // garantit hit target 44pt+
  };

  const labelStyle: TextStyle = {
    fontFamily: getInterFamily('600'),
    fontSize: SIZE_FONT[size],
    lineHeight: SIZE_FONT[size] + 4,
    color: isInactive ? neutralColors.disabledText : variantStyles.text,
    textAlign: 'center',
  };

  const iconColor = isInactive ? neutralColors.disabledText : variantStyles.text;
  const iconSize = SIZE_ICON[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={isInactive}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isInactive, busy: loading }}
      testID={testID}
      style={({ pressed }) => [
        containerStyle,
        pressed && !isInactive && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.text} size="small" />
      ) : (
        <>
          {IconLeft && (
            <View style={styles.iconLeft}>
              <IconLeft size={iconSize} color={iconColor} />
            </View>
          )}
          <Text style={labelStyle} numberOfLines={1}>
            {label}
          </Text>
          {IconRight && (
            <View style={styles.iconRight}>
              <IconRight size={iconSize} color={iconColor} />
            </View>
          )}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },
  iconLeft: {
    marginRight: space[2],
  },
  iconRight: {
    marginLeft: space[2],
  },
});

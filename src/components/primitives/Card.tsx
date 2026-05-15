/**
 * Card — conteneur primitif.
 *
 * Réf design system V1.1 §5.2.
 *
 * 4 variantes :
 *  - `standard` : radius.lg, padding space.4, élévation 1
 *  - `forte` : radius.xl, padding space.5, élévation 1
 *  - `action` : cliquable, chevron à droite, ressort à la pression
 *  - `pilier` : fond légèrement teinté de la couleur du pilier
 *
 * Règle d'imbrication : une card ne contient JAMAIS une autre card (§5.2).
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
import { ChevronRight } from 'lucide-react-native';
import {
  neutralColors,
  pillarColors,
  radiusV1,
  space,
  elevation,
  usePillarTheme,
} from '../../theme';
import type { PillarContext } from '../../theme';
import { getInterFamily } from '../../theme';

export type CardVariant = 'standard' | 'forte' | 'action' | 'pilier';

export type CardProps = {
  variant?: CardVariant;
  /** Contexte de pilier — détermine la teinte pour variant='pilier' et la couleur du chevron pour 'action'. */
  context?: PillarContext;
  /** Pour variant='action' : action déclenchée au tap. */
  onPress?: () => void;
  /** Titre H3 affiché en haut (optionnel). */
  title?: string;
  /** Sous-titre body affiché sous le titre (optionnel). */
  subtitle?: string;
  /** Contenu libre rendu sous le titre/sous-titre. */
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
};

const VARIANT_RADIUS: Record<CardVariant, number> = {
  standard: radiusV1.lg,
  forte: radiusV1.xl,
  action: radiusV1.lg,
  pilier: radiusV1.lg,
};

const VARIANT_PADDING: Record<CardVariant, number> = {
  standard: space[4],
  forte: space[5],
  action: space[4],
  pilier: space[4],
};

/**
 * Mélange une couleur de pilier avec du blanc pour obtenir une teinte douce
 * (variant `pilier`). On utilise la couleur `bg` du contexte avec une opacité.
 */
function getPillarCardBg(context: PillarContext): string {
  // pillarColors[context].bg est déjà un pastel. On l'utilise avec un overlay
  // blanc via un ViewStyle backgroundColor + opacité parente. Pour rester
  // simple en V1 : on prend directement le bg du contexte, légèrement plus pâle.
  return pillarColors[context].bg;
}

export function Card({
  variant = 'standard',
  context = 'neutral',
  onPress,
  title,
  subtitle,
  children,
  style,
  accessibilityLabel,
  testID,
}: CardProps) {
  const theme = usePillarTheme(context);

  const baseStyle: ViewStyle = {
    backgroundColor:
      variant === 'pilier' ? getPillarCardBg(context) : neutralColors.surfaceElevated,
    borderRadius: VARIANT_RADIUS[variant],
    padding: VARIANT_PADDING[variant],
    ...elevation[1],
  };

  const titleStyle: TextStyle = {
    fontFamily: getInterFamily('600'),
    fontSize: 18,
    lineHeight: 24,
    color: variant === 'pilier' ? theme.text : '#1F1147',
    marginBottom: subtitle || children ? space[2] : 0,
  };

  const subtitleStyle: TextStyle = {
    fontFamily: getInterFamily('400'),
    fontSize: 15,
    lineHeight: 22,
    color: variant === 'pilier' ? theme.text : neutralColors.textSecondary,
    marginBottom: children ? space[3] : 0,
  };

  const content = (
    <>
      {title && <Text style={titleStyle}>{title}</Text>}
      {subtitle && <Text style={subtitleStyle}>{subtitle}</Text>}
      {children}
    </>
  );

  if (variant === 'action') {
    return (
      <Pressable
        onPress={onPress}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        testID={testID}
        style={({ pressed }) => [
          baseStyle,
          styles.actionRow,
          pressed && styles.pressed,
          style,
        ]}
      >
        <View style={styles.actionContent}>{content}</View>
        <ChevronRight size={20} color={theme.text} />
      </Pressable>
    );
  }

  return (
    <View
      style={[baseStyle, style]}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.92,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionContent: {
    flex: 1,
    marginRight: space[3],
  },
});

/**
 * Modal — composant primitif de superposition.
 *
 * Réf design system V1.1 §5.6.
 *
 * 3 variantes :
 *  - `fullscreen` : 100% écran, fond pastel pilier ou phase, marges narratives.
 *    Pour S0.1, S0.2, paliers, jours-charnière. Pas de swipe pour fermer.
 *  - `standard` : centré 85% largeur (max 360px), radius.2xl, padding space.5,
 *    élévation 2, overlay #1F1147 à 40%.
 *  - `bottomSheet` : monte de 0 à 60-90% selon contenu, coins supérieurs
 *    radius.2xl, handle gris en haut.
 *
 * Animations (§9.3) :
 *  - standard : scale 0.92 → 1.0 + fade 300ms (easing standard)
 *  - bottomSheet : translateY 350ms decelerate
 *  - fullscreen : fade + scale 500ms
 */

import React, { useEffect } from 'react';
import {
  Modal as RNModal,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { neutralColors, pillarColors, radiusV1, space, elevation } from '../../theme';
import type { PillarContext } from '../../theme';

export type ModalVariant = 'fullscreen' | 'standard' | 'bottomSheet';

export type ModalProps = {
  visible: boolean;
  onClose: () => void;
  variant?: ModalVariant;
  /** Pour fullscreen : contexte de pilier qui détermine le fond. */
  context?: PillarContext;
  children: React.ReactNode;
  /** Désactive la fermeture au tap sur l'overlay (standard / bottomSheet). */
  dismissable?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const OVERLAY_COLOR = 'rgba(31, 17, 71, 0.40)';
const EASING = Easing.bezier(0.4, 0.0, 0.2, 1.0);
const EASING_DECELERATE = Easing.bezier(0.0, 0.0, 0.2, 1.0);

export function Modal({
  visible,
  onClose,
  variant = 'standard',
  context = 'neutral',
  children,
  dismissable = true,
  style,
  testID,
}: ModalProps) {
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);
  const translateY = useSharedValue(Dimensions.get('window').height);

  useEffect(() => {
    if (variant === 'fullscreen') {
      opacity.value = withTiming(visible ? 1 : 0, { duration: 500, easing: EASING });
      scale.value = withTiming(visible ? 1 : 0.92, { duration: 500, easing: EASING });
    } else if (variant === 'standard') {
      opacity.value = withTiming(visible ? 1 : 0, { duration: 300, easing: EASING });
      scale.value = withTiming(visible ? 1 : 0.92, { duration: 300, easing: EASING });
    } else {
      // bottomSheet
      opacity.value = withTiming(visible ? 1 : 0, { duration: 250, easing: EASING });
      translateY.value = withTiming(visible ? 0 : Dimensions.get('window').height, {
        duration: 350,
        easing: EASING_DECELERATE,
      });
    }
  }, [visible, variant, opacity, scale, translateY]);

  const overlayAnimStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const contentAnimStyle = useAnimatedStyle(() => {
    if (variant === 'bottomSheet') {
      return { transform: [{ translateY: translateY.value }] };
    }
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const handleOverlayPress = () => {
    if (dismissable) onClose();
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
      testID={testID}
    >
      {variant === 'fullscreen' ? (
        <Animated.View
          style={[
            styles.fullscreen,
            { backgroundColor: pillarColors[context].bg },
            contentAnimStyle,
            style,
          ]}
        >
          <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
            {children}
          </View>
        </Animated.View>
      ) : (
        <View style={StyleSheet.absoluteFill}>
          <Animated.View style={[styles.overlay, overlayAnimStyle]}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={handleOverlayPress}
              accessibilityRole="button"
              accessibilityLabel="Fermer"
              accessibilityHint={dismissable ? 'Tap pour fermer' : undefined}
            />
          </Animated.View>

          {variant === 'standard' ? (
            <View style={styles.centerWrap} pointerEvents="box-none">
              <Animated.View style={[styles.standardCard, contentAnimStyle, style]}>
                {children}
              </Animated.View>
            </View>
          ) : (
            <Animated.View
              style={[
                styles.bottomSheet,
                { paddingBottom: insets.bottom + space[4] },
                contentAnimStyle,
                style,
              ]}
            >
              <View style={styles.bottomSheetHandle} />
              {children}
            </Animated.View>
          )}
        </View>
      )}
    </RNModal>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: OVERLAY_COLOR,
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[4],
  },
  standardCard: {
    width: '85%',
    maxWidth: 360,
    backgroundColor: neutralColors.surfaceElevated,
    borderRadius: radiusV1['2xl'],
    padding: space[5],
    ...elevation[2],
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: neutralColors.surfaceElevated,
    borderTopLeftRadius: radiusV1['2xl'],
    borderTopRightRadius: radiusV1['2xl'],
    paddingHorizontal: space[5],
    paddingTop: space[3],
    ...elevation[2],
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: neutralColors.borderVisible,
    alignSelf: 'center',
    marginBottom: space[3],
  },
});

/**
 * DataPointsLayer — couche 5 de la Toile.
 *
 * Réf design system V1.1 §6.1 couche 5.
 *
 *  - Points initiaux (mémorisés) : cercles BLANCS 5px cerclés violet profond 2px,
 *    positionnés à la distance du score INITIAL.
 *  - Sommets finaux : cercles PLEINS 7px couleur `tree.{S}.tip` bordés blanc 2px,
 *    positionnés à la distance du score FINAL (ou initial si pas encore finalisé).
 *  - Pour la branche FOCUSED : halo additionnel 12px à 40% opacité autour
 *    du sommet final.
 */

import React from 'react';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { Circle } from 'react-native-svg';
import { brandColors, treeColors } from '../../../theme';
import {
  finalPointPositions,
  initialPointPositions,
  type PillarScore,
  type PillarSlot,
} from '../geometry';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  cx: number;
  cy: number;
  radius: number;
  scores: PillarScore[];
  focusedPillar?: PillarSlot;
};

export function DataPointsLayer({ cx, cy, radius, scores, focusedPillar }: Props) {
  const initials = initialPointPositions(cx, cy, radius, scores);
  const finals = finalPointPositions(cx, cy, radius, scores);

  return (
    <>
      {/* Points initiaux (mémorisés) — blancs cerclés violet */}
      {initials.map((entry) => {
        if (!entry) return null;
        return (
          <Circle
            key={`init-${entry.pillarId}`}
            cx={entry.point.x}
            cy={entry.point.y}
            r={5}
            fill="#FFFFFF"
            stroke={brandColors.deep}
            strokeWidth={2}
          />
        );
      })}

      {/* Sommets finaux + halo focused (animé) */}
      {finals.map((entry) => {
        if (!entry) return null;
        const isFocused = focusedPillar === entry.pillarId;
        return (
          <React.Fragment key={`final-${entry.pillarId}`}>
            {isFocused && (
              <PulsingHalo
                cx={entry.point.x}
                cy={entry.point.y}
                color={treeColors[entry.pillarId].tip}
              />
            )}
            <Circle
              cx={entry.point.x}
              cy={entry.point.y}
              r={isFocused ? 8 : 7}
              fill={treeColors[entry.pillarId].tip}
              stroke="#FFFFFF"
              strokeWidth={isFocused ? 2.5 : 2}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}

/**
 * PulsingHalo — anneau qui pulse autour d'un sommet focused.
 *
 * Anime simultanément le rayon (10 → 16 → 10) et l'opacité (0.55 → 0.1 → 0.55)
 * en boucle 1300ms easing easeInOut. Désactivé Reduce Motion à terme via
 * AccessibilityInfo (Sprint 3+).
 */
function PulsingHalo({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  const t = useSharedValue(0);

  React.useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 1300, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    return () => {
      cancelAnimation(t);
    };
  }, [t]);

  const animatedProps = useAnimatedProps(() => ({
    r: 10 + t.value * 6,
    fillOpacity: 0.55 - t.value * 0.45,
  }));

  return (
    <AnimatedCircle
      cx={cx}
      cy={cy}
      fill={color}
      animatedProps={animatedProps}
    />
  );
}

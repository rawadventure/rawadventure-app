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
import { Circle } from 'react-native-svg';
import { brandColors, treeColors } from '../../../theme';
import {
  finalPointPositions,
  initialPointPositions,
  type PillarScore,
  type PillarSlot,
} from '../geometry';

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

      {/* Sommets finaux + halo focused */}
      {finals.map((entry) => {
        if (!entry) return null;
        const isFocused = focusedPillar === entry.pillarId;
        return (
          <React.Fragment key={`final-${entry.pillarId}`}>
            {isFocused && (
              <Circle
                cx={entry.point.x}
                cy={entry.point.y}
                r={12}
                fill={treeColors[entry.pillarId].tip}
                fillOpacity={0.4}
              />
            )}
            <Circle
              cx={entry.point.x}
              cy={entry.point.y}
              r={7}
              fill={treeColors[entry.pillarId].tip}
              stroke="#FFFFFF"
              strokeWidth={2}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}

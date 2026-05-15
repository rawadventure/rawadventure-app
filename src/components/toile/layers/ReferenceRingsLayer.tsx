/**
 * ReferenceRingsLayer — couche 3 de la Toile.
 *
 * Réf design system V1.1 §6.1 couche 3.
 *
 * Trois cercles concentriques pointillés discrets aux paliers 33 et 66
 * (à 18% opacité), plus le cercle externe plein à 25%.
 *
 * Couleur : `brand.deep` violet profond (cohérence avec le polygone radar).
 */

import React from 'react';
import { Circle } from 'react-native-svg';
import { brandColors } from '../../../theme';

type Props = {
  cx: number;
  cy: number;
  radius: number;
};

export function ReferenceRingsLayer({ cx, cy, radius }: Props) {
  return (
    <>
      {/* Anneau 33% — pointillé */}
      <Circle
        cx={cx}
        cy={cy}
        r={radius * 0.33}
        stroke={brandColors.deep}
        strokeWidth={1}
        strokeOpacity={0.18}
        strokeDasharray="3 4"
        fill="none"
      />
      {/* Anneau 66% — pointillé */}
      <Circle
        cx={cx}
        cy={cy}
        r={radius * 0.66}
        stroke={brandColors.deep}
        strokeWidth={1}
        strokeOpacity={0.18}
        strokeDasharray="3 4"
        fill="none"
      />
      {/* Anneau externe — plein à 25% */}
      <Circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={brandColors.deep}
        strokeWidth={1.5}
        strokeOpacity={0.25}
        fill="none"
      />
    </>
  );
}

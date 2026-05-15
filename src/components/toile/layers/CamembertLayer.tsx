/**
 * CamembertLayer — couche 1 de la Toile.
 *
 * Réf design system V1.1 §6.1 couche 1.
 *
 * 8 parts de 45° chacune, fond pastel pilier (`pillar.{S}.bg`).
 *  - Piliers actifs (state 'started' / 'completed') : pleine opacité 1.0
 *  - Piliers en attente (state 'pending') : opacité 0.45
 *
 * Séparateurs blancs 2.5px entre parts pour lisibilité maximale.
 */

import React from 'react';
import { Path } from 'react-native-svg';
import { pillarColors } from '../../../theme';
import {
  PILLAR_CENTER_ANGLE,
  SECTOR_HALF_ANGLE,
  sectorPath,
  type PillarScore,
} from '../geometry';

type Props = {
  cx: number;
  cy: number;
  radius: number;
  scores: PillarScore[];
};

export function CamembertLayer({ cx, cy, radius, scores }: Props) {
  return (
    <>
      {scores.map((s) => {
        const center = PILLAR_CENTER_ANGLE[s.pillarId];
        const start = center - SECTOR_HALF_ANGLE;
        const end = center + SECTOR_HALF_ANGLE;
        const d = sectorPath(cx, cy, radius, start, end);
        const opacity = s.state === 'pending' ? 0.45 : 1.0;
        return (
          <Path
            key={`pie-${s.pillarId}`}
            d={d}
            fill={pillarColors[s.pillarId].bg}
            fillOpacity={opacity}
            stroke="#FFFFFF"
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
        );
      })}
    </>
  );
}

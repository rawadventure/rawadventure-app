/**
 * SaturatedZonesLayer — couche 2 de la Toile.
 *
 * Réf design system V1.1 §6.1 couche 2.
 *
 * Pour chaque pilier en état 'started' ou 'completed', secteur triangulaire
 * entre le centre et l'arc de la part, à distance = (score/100) × radius.
 * Couleur = `tree.{S}.stroke` à 70% opacité. Donne le signal visuel "ta
 * progression occupe cet espace".
 */

import React from 'react';
import { Path } from 'react-native-svg';
import { treeColors } from '../../../theme';
import {
  PILLAR_CENTER_ANGLE,
  SECTOR_HALF_ANGLE,
  sectorPath,
  type PillarScore,
} from '../geometry';

type Props = {
  cx: number;
  cy: number;
  /** Rayon total de la toile (100%). */
  radius: number;
  scores: PillarScore[];
};

export function SaturatedZonesLayer({ cx, cy, radius, scores }: Props) {
  return (
    <>
      {scores.map((s) => {
        if (s.state === 'pending') return null;
        const effective = s.finalScore ?? s.initialScore;
        if (effective == null || effective <= 0) return null;

        const sectorRadius = (effective / 100) * radius;
        const center = PILLAR_CENTER_ANGLE[s.pillarId];
        const start = center - SECTOR_HALF_ANGLE;
        const end = center + SECTOR_HALF_ANGLE;
        const d = sectorPath(cx, cy, sectorRadius, start, end);

        return (
          <Path
            key={`sat-${s.pillarId}`}
            d={d}
            fill={treeColors[s.pillarId].stroke}
            fillOpacity={0.7}
          />
        );
      })}
    </>
  );
}

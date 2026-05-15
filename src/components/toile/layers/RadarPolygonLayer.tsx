/**
 * RadarPolygonLayer — couche 4 de la Toile.
 *
 * Réf design system V1.1 §6.1 couche 4.
 *
 * Polygone violet profond `brand.deep` en contour SEUL (pas de remplissage),
 * stroke 2.5px, stroke-linejoin round. Relie les sommets au centre de chaque
 * part de camembert à la distance correspondant au score. Passe par le centre
 * dans la zone des piliers en attente (score effectif = 0 → sommet au centre).
 */

import React from 'react';
import { Polygon } from 'react-native-svg';
import { brandColors } from '../../../theme';
import { polygonPoints, pointsToAttr, type PillarScore } from '../geometry';

type Props = {
  cx: number;
  cy: number;
  radius: number;
  scores: PillarScore[];
};

export function RadarPolygonLayer({ cx, cy, radius, scores }: Props) {
  const pts = polygonPoints(cx, cy, radius, scores);
  return (
    <Polygon
      points={pointsToAttr(pts)}
      fill="none"
      stroke={brandColors.deep}
      strokeWidth={2.5}
      strokeLinejoin="round"
    />
  );
}

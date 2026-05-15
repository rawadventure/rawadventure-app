/**
 * geometry.ts — helpers géométriques purs pour la Toile.
 *
 * Réf design system V1.1 §6.2 — positionnement des 8 branches en ordre
 * canonique D39 (S1 en haut, sens horaire) :
 *  - S1 Respiration            centre  -90°  (haut)
 *  - S2 Activité physique      centre  -45°
 *  - S3 Alimentation           centre    0°  (droite)
 *  - S4 Connexion au vivant    centre   45°
 *  - S5 Repos et régénération  centre   90°  (bas)
 *  - S6 Passion / chemin       centre  135°
 *  - S7 Mindset                centre  180°  (gauche)
 *  - S8 Élimination et détox   centre  225°
 *
 * Conventions :
 *  - angle 0° = +x (droite), sens horaire positif (convention SVG)
 *  - tous les angles ci-dessous sont en degrés
 *  - chaque part de camembert = 45°
 *
 * Helpers exportés purs et testables — pas d'effets de bord, pas de React.
 */

/** Identifiants des 8 piliers Phase 1 (sous-ensemble de PillarKey du theme,
 * excluant 'phase0' et 'neutral' qui n'ont pas de branche sur la Toile). */
export type PillarSlot = 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8';

export type PillarState = 'pending' | 'started' | 'completed';

export type PillarScore = {
  pillarId: PillarSlot;
  state: PillarState;
  /** Score initial (éval initiale), 0-100. Optionnel : undefined si état pending. */
  initialScore?: number;
  /** Score final (éval finale), 0-100. Optionnel : présent uniquement si état completed. */
  finalScore?: number;
};

/** Ordre canonique D39 des piliers (S1 en haut, sens horaire). */
export const PILLAR_ORDER: PillarSlot[] = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'];

/** Angle centre de chaque part de camembert en degrés (cf. table §6.2). */
export const PILLAR_CENTER_ANGLE: Record<PillarSlot, number> = {
  s1: -90,
  s2: -45,
  s3: 0,
  s4: 45,
  s5: 90,
  s6: 135,
  s7: 180,
  s8: 225,
};

export const SECTOR_HALF_ANGLE = 22.5; // chaque part = 45°, demi-secteur 22.5°

export type Point = { x: number; y: number };

/** Convertit (angle en degrés, rayon) en (x, y) cartésien autour d'un centre. */
export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleDeg: number,
): Point {
  const a = (angleDeg * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(a),
    y: centerY + radius * Math.sin(a),
  };
}

/**
 * Construit un chemin SVG pour un secteur (slice de camembert) plein depuis le
 * centre jusqu'au rayon `radius`, entre `startAngle` et `endAngle`.
 *
 * Format : M cx,cy L p1.x,p1.y A r,r 0 [largeArc],1 p2.x,p2.y Z
 */
export function sectorPath(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
  const sweep = 1; // sens horaire pour des angles croissants
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
}

/**
 * Calcule les 8 sommets du polygone radar — un point par pilier, à la distance
 * correspondant au score effectif (final si présent, sinon initial, sinon 0).
 */
export function polygonPoints(
  cx: number,
  cy: number,
  radius: number,
  scores: PillarScore[],
): Point[] {
  return scores.map((s) => {
    const effectiveScore = s.finalScore ?? s.initialScore ?? 0;
    const r = (effectiveScore / 100) * radius;
    return polarToCartesian(cx, cy, r, PILLAR_CENTER_ANGLE[s.pillarId]);
  });
}

/** Sérialise une liste de points en attribut `points` de <Polygon>. */
export function pointsToAttr(points: Point[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(' ');
}

/** Renvoie les positions des sommets initiaux (mémorisés) pour la couche 5. */
export function initialPointPositions(
  cx: number,
  cy: number,
  radius: number,
  scores: PillarScore[],
): Array<{ pillarId: PillarSlot; point: Point } | null> {
  return scores.map((s) => {
    if (s.initialScore == null) return null;
    const r = (s.initialScore / 100) * radius;
    return {
      pillarId: s.pillarId,
      point: polarToCartesian(cx, cy, r, PILLAR_CENTER_ANGLE[s.pillarId]),
    };
  });
}

/** Renvoie les positions des sommets finaux (état completed ou started). */
export function finalPointPositions(
  cx: number,
  cy: number,
  radius: number,
  scores: PillarScore[],
): Array<{ pillarId: PillarSlot; point: Point } | null> {
  return scores.map((s) => {
    if (s.state === 'pending') return null;
    const effective = s.finalScore ?? s.initialScore;
    if (effective == null) return null;
    const r = (effective / 100) * radius;
    return {
      pillarId: s.pillarId,
      point: polarToCartesian(cx, cy, r, PILLAR_CENTER_ANGLE[s.pillarId]),
    };
  });
}

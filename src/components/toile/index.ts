/**
 * Composant signature Toile — hybride camembert + radar V1.1 (PROVISOIRE).
 *
 * Réf design system V1.1 §6 + Patch 3 du 14 mai 2026.
 *
 * Géométrie validée provisoirement, à itérer avec Mimi. L'API publique
 * (Toile, ToileProps, PillarScore) est conçue pour SURVIVRE à un changement
 * de géométrie interne — les écrans consommateurs (IA-20, IA-25, IA-26,
 * IA-47, IA-22) ne dépendent que de cette API.
 */

export { Toile, makeMockScores } from './Toile';
export type { ToileProps, ToileVariant } from './Toile';
export type { PillarScore, PillarState, PillarSlot } from './geometry';
export { PILLAR_ORDER, PILLAR_CENTER_ANGLE } from './geometry';

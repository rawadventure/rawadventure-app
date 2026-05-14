/**
 * Composant signature Toile — version hybride camembert + radar V1.1 (PROVISOIRE).
 *
 * Réf design system V1.1 §6 + Patch 3 du 14 mai 2026.
 *
 * À implémenter en Sprint 2 avec API paramétrée stable (props agnostiques au rendu)
 * pour permettre une refonte ultérieure du rendu avec Mimi sans casser
 * les écrans consommateurs (IA-20, IA-25, IA-26, IA-47, IA-22).
 *
 * Sous-fichiers prévus :
 *  - Toile.tsx (orchestrateur, API publique)
 *  - geometry.ts (helpers purs : polarToCartesian, sectorPath, polygonPoints)
 *  - layers/CamembertLayer.tsx (couche 1 : parts pastels)
 *  - layers/SaturatedZonesLayer.tsx (couche 2 : secteurs saturés)
 *  - layers/ReferenceRingsLayer.tsx (couche 3 : anneaux pointillés)
 *  - layers/RadarPolygonLayer.tsx (couche 4 : polygone violet contour)
 *  - layers/DataPointsLayer.tsx (couche 5 : points initiaux + sommets finaux)
 *  - animations.ts (déploiement, mise à jour branche, tap)
 */
export {};

/**
 * Toile — composant signature V1.1 hybride camembert + radar (PROVISOIRE).
 *
 * Réf design system V1.1 §6 + Patch 3 du 14 mai 2026.
 *
 * STATUT : géométrie V1.1 validée provisoirement. Sera retravaillée avec
 * Mimi à partir de références visuelles complémentaires. L'API publique
 * de ce composant est conçue pour SURVIVRE à un changement de géométrie
 * interne — les écrans consommateurs (IA-20, IA-25, IA-26, IA-47, IA-22)
 * ne dépendent que des props définies ici.
 *
 * 5 couches superposées (cf. sous-fichiers `layers/*`) :
 *  1. Camembert pastel — 8 parts 45° colorées
 *  2. Saturated zones — secteurs intérieurs saturés (signal "ta progression")
 *  3. Reference rings — 3 cercles concentriques discrets (paliers 33/66/100)
 *  4. Radar polygon — contour violet profond reliant les sommets
 *  5. Data points — points initiaux mémorisés + sommets finaux + halo focus
 *
 * Variants (Section 6.4) :
 *  - 'full' : 320x340 par défaut, pour IA-25 onglet Toile
 *  - 'detail' : 240x240, pour IA-26 détail d'une branche
 *  - 'mini' : 80-100px, sur cards pilier et header de profil
 *  - 'comparison' : pour IA-22 sortie de S8 (deux instances côte à côte)
 */

import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const AnimatedG = Animated.createAnimatedComponent(G);
import { brandColors } from '../../theme';
import { getInterFamily } from '../../theme';
import {
  PILLAR_CENTER_ANGLE,
  PILLAR_ORDER,
  SECTOR_HALF_ANGLE,
  polarToCartesian,
  sectorPath,
  type PillarScore,
  type PillarSlot,
} from './geometry';
import { CamembertLayer } from './layers/CamembertLayer';
import { SaturatedZonesLayer } from './layers/SaturatedZonesLayer';
import { ReferenceRingsLayer } from './layers/ReferenceRingsLayer';
import { RadarPolygonLayer } from './layers/RadarPolygonLayer';
import { DataPointsLayer } from './layers/DataPointsLayer';

export type ToileVariant = 'full' | 'detail' | 'mini' | 'comparison';

export type ToileProps = {
  /** Toujours 8 entrées, dans l'ordre canonique D39 (s1..s8). */
  scores: PillarScore[];
  /** Diamètre cible en px. Par défaut selon variant. */
  size?: number;
  /** Variante de rendu — affecte le padding et la taille labels. */
  variant?: ToileVariant;
  /** Pilier focalisé : reçoit un halo additionnel sur son sommet final. */
  focusedPillar?: PillarSlot;
  /** Affiche les labels textuels courts autour des branches (vues `full` et `detail`). */
  showLabels?: boolean;
  /** Callback de tap sur une part. Si fourni, chaque part est rendue cliquable. */
  onPillarPress?: (id: PillarSlot) => void;
  /**
   * Sprint 23 : animation de déploiement au mount (séquence centre → branches
   * → anneaux → points → labels, total ~1.8s, §6.4). Implémentée via
   * Reanimated 4 + AnimatedG opacity. Sans cette prop, rendu statique full
   * opacity (préservation comportement existant pour IA-25 / IA-26 / IA-47).
   */
  animateOnMount?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const VARIANT_DEFAULT_SIZE: Record<ToileVariant, number> = {
  full: 320,
  detail: 240,
  mini: 96,
  comparison: 150,
};

/**
 * Intitulés courts validés (Q1.4 — session design Stéphane × Claude).
 * Design system V1.1 §6.5 « Intitulés courts pour les labels piliers ».
 * Les noms canoniques complets (D39, Métriques V1.5) restent affichés sur
 * la roadmap S0.2 et IA-26 détail branche.
 */
const PILLAR_LABEL: Record<PillarSlot, string> = {
  s1: 'Respiration',
  s2: 'Activité physique',
  s3: 'Alimentation',
  s4: 'Connexion vivant',
  s5: 'Repos & régé.',
  s6: 'Passion',
  s7: 'Mindset',
  s8: 'Élim. & détox',
};

export function Toile({
  scores,
  size,
  variant = 'full',
  focusedPillar,
  showLabels,
  onPillarPress,
  animateOnMount,
  style,
  testID,
}: ToileProps) {
  const resolvedSize = size ?? VARIANT_DEFAULT_SIZE[variant];

  // Animation séquencée centre → branches → anneaux → points → labels (§6.4).
  // Valeurs initiales : 0 si animation, 1 sinon (rendu statique).
  const initial = animateOnMount ? 0 : 1;
  const opBranches = useSharedValue(initial);
  const opRings = useSharedValue(initial);
  const opCentre = useSharedValue(initial);
  const opPoints = useSharedValue(initial);
  const opLabels = useSharedValue(initial);

  useEffect(() => {
    if (!animateOnMount) return;
    const EASE = Easing.bezier(0.2, 0.7, 0.3, 1.0);
    const TIMING = { duration: 900, easing: EASE } as const;
    // Séquence : branches d'abord (camembert pose le décor), puis anneaux
    // référence, puis polygone centre, puis points, enfin labels. Total
    // ≈ 3.2s pour permettre à l'œil de suivre le déploiement.
    opBranches.value = withDelay(0, withTiming(1, TIMING));
    opRings.value = withDelay(500, withTiming(1, TIMING));
    opCentre.value = withDelay(1100, withTiming(1, TIMING));
    opPoints.value = withDelay(1700, withTiming(1, TIMING));
    opLabels.value = withDelay(2300, withTiming(1, TIMING));
  }, [animateOnMount, opCentre, opBranches, opRings, opPoints, opLabels]);

  const branchesProps = useAnimatedProps(() => ({ opacity: opBranches.value }));
  const ringsProps = useAnimatedProps(() => ({ opacity: opRings.value }));
  const centreProps = useAnimatedProps(() => ({ opacity: opCentre.value }));
  const pointsProps = useAnimatedProps(() => ({ opacity: opPoints.value }));
  const labelsProps = useAnimatedProps(() => ({ opacity: opLabels.value }));

  // Labels affichés autour : on étend le viewBox pour leur faire de la place.
  const shouldShowLabels = showLabels ?? (variant === 'full' || variant === 'detail');
  const labelPadding = shouldShowLabels ? 58 : 8;

  const viewBoxSize = resolvedSize;
  const cx = viewBoxSize / 2;
  const cy = viewBoxSize / 2;
  const radius = (viewBoxSize - labelPadding * 2) / 2;
  const labelRadius = radius + labelPadding * 0.45;

  // Sécurité : si scores n'est pas length 8 ou pas dans l'ordre canonique,
  // on re-trie pour éviter de produire un rendu incorrect.
  const orderedScores = React.useMemo(() => {
    const byId = new Map(scores.map((s) => [s.pillarId, s]));
    return PILLAR_ORDER.map((id) => byId.get(id)).filter(
      (s): s is PillarScore => s != null,
    );
  }, [scores]);

  // Si une callback de tap est fournie, on rend chaque part comme zone tactile
  // séparée via un Path overlay transparent. Sinon, rendu décoratif uniquement.
  const interactive = !!onPillarPress;

  return (
    <View
      style={[styles.container, { width: resolvedSize, height: resolvedSize }, style]}
      testID={testID}
      accessibilityRole={interactive ? undefined : 'image'}
      accessibilityLabel={
        interactive
          ? undefined
          : 'Toile de vitalité — 8 branches représentant chaque pilier'
      }
    >
      <Svg width={resolvedSize} height={resolvedSize} viewBox={`0 0 ${resolvedSize} ${resolvedSize}`}>
        {/* Ordre Z important : camembert → saturated zones → rings → polygon → points
            Variant 'mini' (96px) : camembert + zones saturées uniquement. Les anneaux,
            polygone radar et points de données sont supprimés car illisibles à cette
            taille — la vue compacte sert juste à signaler "où tu en es" globalement. */}
        <AnimatedG animatedProps={branchesProps}>
          <CamembertLayer cx={cx} cy={cy} radius={radius} scores={orderedScores} />
          <SaturatedZonesLayer cx={cx} cy={cy} radius={radius} scores={orderedScores} />
        </AnimatedG>
        {variant !== 'mini' && (
          <>
            <AnimatedG animatedProps={ringsProps}>
              <ReferenceRingsLayer cx={cx} cy={cy} radius={radius} />
            </AnimatedG>
            <AnimatedG animatedProps={centreProps}>
              <RadarPolygonLayer cx={cx} cy={cy} radius={radius} scores={orderedScores} />
            </AnimatedG>
            <AnimatedG animatedProps={pointsProps}>
              <DataPointsLayer
                cx={cx}
                cy={cy}
                radius={radius}
                scores={orderedScores}
                focusedPillar={focusedPillar}
              />
            </AnimatedG>
          </>
        )}

        {/* Labels textuels autour (variant full / detail uniquement).
            Intitulés courts §6.5 — 1 ligne, rendu via <SvgText>. */}
        {shouldShowLabels && (
          <AnimatedG animatedProps={labelsProps}>
            {PILLAR_ORDER.map((pid) => {
              const angle = PILLAR_CENTER_ANGLE[pid];
              const p = polarToCartesian(cx, cy, labelRadius, angle);
              return (
                <SvgText
                  key={`label-${pid}`}
                  x={p.x}
                  y={p.y}
                  fontSize={10}
                  fontFamily={getInterFamily('600')}
                  fill={brandColors.deep}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {PILLAR_LABEL[pid]}
                </SvgText>
              );
            })}
          </AnimatedG>
        )}
      </Svg>

      {/* Overlay tactile : zones invisibles par-dessus chaque part */}
      {interactive && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <Svg
            width={resolvedSize}
            height={resolvedSize}
            viewBox={`0 0 ${resolvedSize} ${resolvedSize}`}
            style={StyleSheet.absoluteFill}
            pointerEvents="box-none"
          >
            {orderedScores.map((s) => {
              const center = PILLAR_CENTER_ANGLE[s.pillarId];
              const start = center - SECTOR_HALF_ANGLE;
              const end = center + SECTOR_HALF_ANGLE;
              const d = sectorPath(cx, cy, radius, start, end);
              return (
                <Path
                  key={`hit-${s.pillarId}`}
                  d={d}
                  fill="transparent"
                  onPress={() => onPillarPress?.(s.pillarId)}
                />
              );
            })}
          </Svg>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
});

/**
 * Utilitaire de test : génère un état de scores cohérent pour le showcase.
 * À retirer ou déplacer ailleurs en Sprint 3+ quand le store réel alimente la Toile.
 */
export function makeMockScores(
  pattern: 'empty' | 'level1' | 'midway' | 'full',
): PillarScore[] {
  if (pattern === 'empty') {
    // État brut : aucune éval initiale réalisée. Polygone collapse au centre.
    // Rare en pratique (la Phase 0 alimente déjà les premières valeurs des
    // branches via le profil onboarding) — conservé pour test edge case.
    return PILLAR_ORDER.map((id) => ({ pillarId: id, state: 'pending' as const }));
  }
  if (pattern === 'level1') {
    // Tous les piliers au niveau 1 (20%) — état d'amorçage typique post-S0.1.
    // Polygone visible petit, montre la construction sans cas dégénéré à 0.
    return PILLAR_ORDER.map((id) => ({
      pillarId: id,
      state: 'started' as const,
      initialScore: 20,
    }));
  }
  if (pattern === 'midway') {
    return PILLAR_ORDER.map((id, idx) => {
      if (idx === 0) return { pillarId: id, state: 'completed', initialScore: 35, finalScore: 72 };
      if (idx === 1) return { pillarId: id, state: 'started', initialScore: 42 };
      // Piliers restants au niveau 1 plutôt que zéro brut.
      return { pillarId: id, state: 'started' as const, initialScore: 20 };
    });
  }
  // full
  return PILLAR_ORDER.map((id, idx) => {
    const initials = [35, 42, 28, 50, 48, 33, 40, 55];
    const finals = [72, 65, 60, 78, 70, 55, 68, 82];
    return {
      pillarId: id,
      state: 'completed',
      initialScore: initials[idx],
      finalScore: finals[idx],
    };
  });
}

/**
 * SignatureShowcaseScreen — galerie DEV des composants signature Sprint 2.
 *
 * STATUT : DEV uniquement. Voir PrimitivesShowcaseScreen pour le mode d'emploi
 * du branchement temporaire dans App.tsx.
 *
 * Affiche PillarHeader dans plusieurs contextes (Phase 0, S1, S7, neutral)
 * et la Toile dans plusieurs états (empty, midway, full, focused, variants).
 *
 * Réf design system V1.1 §5.8 + §6.
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PillarHeader } from '../../components/compositions';
import { Toile, makeMockScores } from '../../components/toile';
import { brandColors, neutralColors, pillarColors, space, interTextStyle } from '../../theme';

export default function SignatureShowcaseScreen() {
  const empty = makeMockScores('empty');
  const level1 = makeMockScores('level1');
  const midway = makeMockScores('midway');
  const full = makeMockScores('full');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionLabel}>SPRINT 2 — SIGNATURE</Text>

        {/* PILLAR HEADERS */}
        <Text style={styles.h2}>PillarHeader — Phase 0</Text>
        <PillarHeader
          context="phase0"
          marker="Phase 0 · Amorçage"
          title="Amorçage"
          dayLabel="Jour 4 sur 14"
          streakDays={12}
          nextTierLabel="Prochain palier · 15j"
        />
        <View style={{ height: space[4], backgroundColor: pillarColors.phase0.bg }} />

        <Text style={styles.h2}>PillarHeader — S1 Respiration</Text>
        <PillarHeader
          context="s1"
          marker="Semaine 1"
          title="Respiration"
          dayLabel="Jour 3 sur 7"
          streakDays={17}
        />
        <View style={{ height: space[4], backgroundColor: pillarColors.s1.bg }} />

        <Text style={styles.h2}>PillarHeader — S7 Mindset</Text>
        <PillarHeader
          context="s7"
          marker="Semaine 7"
          title="Mindset"
          dayLabel="Jour 5 sur 7"
          streakDays={47}
          nextTierLabel="Prochain palier · 60j"
        />
        <View style={{ height: space[4], backgroundColor: pillarColors.s7.bg }} />

        <Text style={styles.h2}>PillarHeader — Neutre (Toile / Profil)</Text>
        <PillarHeader
          context="neutral"
          marker="Raw Adventure"
          title="Ma toile"
        />
        <View style={{ height: space[4], backgroundColor: pillarColors.neutral.bg }} />

        {/* TOILES */}
        <View style={styles.toileSection}>
          <Text style={styles.h2}>Toile — état level1 (tous à 20%, état amorçage post-S0.1)</Text>
          <View style={styles.toileCenter}>
            <Toile scores={level1} variant="full" />
          </View>
        </View>

        <View style={styles.toileSection}>
          <Text style={styles.h2}>Toile — état midway (S1 completed, S2 started, reste level1)</Text>
          <View style={styles.toileCenter}>
            <Toile scores={midway} variant="full" />
          </View>
        </View>

        <View style={styles.toileSection}>
          <Text style={styles.h2}>Toile — état full (8 piliers complétés)</Text>
          <View style={styles.toileCenter}>
            <Toile scores={full} variant="full" />
          </View>
        </View>

        <View style={styles.toileSection}>
          <Text style={styles.h2}>Toile — focused S7 (halo)</Text>
          <View style={styles.toileCenter}>
            <Toile scores={full} variant="full" focusedPillar="s7" />
          </View>
        </View>

        <View style={styles.toileSection}>
          <Text style={styles.h2}>Toile — variant detail 240 (S1 focused)</Text>
          <View style={styles.toileCenter}>
            <Toile scores={full} variant="detail" focusedPillar="s1" />
          </View>
        </View>

        <View style={styles.toileSection}>
          <Text style={styles.h2}>Toile — variant mini 96 (header profil / card)</Text>
          <View style={styles.toileCenter}>
            <Toile scores={full} variant="mini" />
          </View>
        </View>

        <View style={styles.toileSection}>
          <Text style={styles.h2}>Toile — variant comparison (avant level1 / après full)</Text>
          <View style={[styles.toileCenter, { flexDirection: 'row', gap: space[4], justifyContent: 'center' }]}>
            <Toile scores={level1} variant="comparison" />
            <Toile scores={full} variant="comparison" />
          </View>
        </View>

        <View style={styles.toileSection}>
          <Text style={styles.h2}>Toile — état empty (edge case avant éval initiale)</Text>
          <View style={styles.toileCenter}>
            <Toile scores={empty} variant="full" />
          </View>
        </View>

        <View style={{ height: space[8] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: brandColors.cream,
  },
  scroll: {
    paddingBottom: space[5],
  },
  sectionLabel: {
    ...interTextStyle('caption'),
    color: neutralColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: space[5],
    paddingTop: space[5],
  },
  h2: {
    ...interTextStyle('h3'),
    color: '#1F1147',
    paddingHorizontal: space[5],
    paddingTop: space[5],
    paddingBottom: space[2],
  },
  toileSection: {
    marginTop: space[3],
  },
  toileCenter: {
    alignItems: 'center',
    paddingVertical: space[4],
  },
});

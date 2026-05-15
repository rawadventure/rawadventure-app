/**
 * ToileTabScreen — IA-25 (placeholder Sprint 4).
 *
 * Réf IA V3 §IA-25 + design system V1.1 §6 + Pattern E (§10.5).
 *
 * Placeholder Sprint 4 : rend le PillarHeader neutral + une Toile mockée
 * pour démontrer le rendu sur device. Le couplage à l'état réel du parcours
 * (`pillar_evaluations` Supabase → `scores: PillarScore[]`) sera fait en
 * Sprint 5+ quand les évaluations Phase 1 seront codées.
 *
 * Référence IA : IA-25. Pattern : E.
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PillarHeader } from '../../components/compositions';
import { Toile, makeMockScores } from '../../components/toile';
import { brandColors, interTextStyle, space } from '../../theme';

export default function ToileTabScreen() {
  // Sprint 4 : Toile mockée level1 (état post-S0.1 typique).
  // Sprint 5+ : remplacer par les vrais scores lus depuis pillar_evaluations.
  const scores = makeMockScores('level1');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView>
        <PillarHeader context="neutral" marker="Raw Adventure" title="Ma toile" />
        <View style={styles.body}>
          <Text style={styles.intro}>
            Chaque branche représente un pilier de ta vitalité. Elle se renforce à mesure
            que tu pratiques.
          </Text>
          <View style={styles.toileWrap}>
            <Toile scores={scores} variant="full" />
          </View>
          <Text style={styles.placeholder}>
            (Sprint 4 — Toile mockée. Sera connectée aux évaluations Phase 1 en Sprint 5+.)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: brandColors.cream },
  body: { padding: space[5] },
  intro: { ...interTextStyle('bodyLarge'), color: brandColors.deep, marginBottom: space[5] },
  toileWrap: { alignItems: 'center', paddingVertical: space[4] },
  placeholder: {
    ...interTextStyle('caption'),
    color: '#8A7CA8',
    textAlign: 'center',
    marginTop: space[6],
  },
});

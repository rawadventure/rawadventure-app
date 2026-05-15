/**
 * StaticShowcaseScreen — galerie DEV sans Reanimated.
 *
 * Isole les composants qui n'utilisent PAS react-native-reanimated, pour
 * tester sur Expo Go en cas de problème worklets natifs.
 * Si cet écran s'affiche → composants OK, problème = Reanimated 4 / worklets.
 * Si cet écran crashe → problème = ailleurs (Babel, Metro, expo-go SDK).
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Settings } from 'lucide-react-native';
import { Button, Card, LevelSelector } from '../../components/primitives';
import { StreakBubble } from '../../components/compositions';
import { brandColors, pillarColors, space, interTextStyle } from '../../theme';
import type { AdaptiveLevel } from '../../components/primitives';

export default function StaticShowcaseScreen() {
  const [level, setLevel] = React.useState<AdaptiveLevel | null>('same');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h1}>Sprint 1 — Showcase STATIC (sans Reanimated)</Text>

        <Text style={styles.h2}>Button — variantes</Text>
        <Button label="Primaire" onPress={() => {}} />
        <Button label="Secondaire" variant="secondary" onPress={() => {}} />
        <Button label="Ghost" variant="ghost" onPress={() => {}} />
        <Button label="Avec icônes" onPress={() => {}} IconLeft={Settings} IconRight={ArrowRight} />
        <Button label="Disabled" disabled onPress={() => {}} />
        <Button label="Loading" loading onPress={() => {}} />
        <Button label="Destructive" variant="destructive" onPress={() => {}} />
        <Button label="Phase 0 primaire" context="phase0" onPress={() => {}} fullWidth />
        <Button label="S1 primaire" context="s1" onPress={() => {}} fullWidth />
        <Button label="S7 primaire" context="s7" onPress={() => {}} fullWidth />

        <Text style={styles.h2}>Card — variantes</Text>
        <Card title="Card standard" subtitle="Sous-titre body." />
        <Card variant="forte" title="Card forte" subtitle="Padding plus généreux." />
        <Card variant="action" title="Card action" subtitle="Tap pour naviguer." onPress={() => {}} />
        <Card variant="pilier" context="s1" title="Pilier S1" subtitle="Teinte S1 Respiration." />
        <Card variant="pilier" context="s7" title="Pilier S7" subtitle="Teinte S7 Mindset." />

        <Text style={styles.h2}>LevelSelector</Text>
        <LevelSelector value={level} onChange={setLevel} context="s1" />

        <Text style={styles.h2}>StreakBubble</Text>
        <View style={[styles.bubbleRow, { backgroundColor: pillarColors.phase0.headerBg }]}>
          <StreakBubble days={12} />
          <StreakBubble days={1} />
          <StreakBubble days={365} hideLabel />
        </View>
        <View style={[styles.bubbleRow, { backgroundColor: pillarColors.s7.headerBg }]}>
          <StreakBubble days={47} />
        </View>

        <View style={{ height: space[8] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: brandColors.cream },
  scroll: { padding: space[5], gap: space[3] },
  h1: { ...interTextStyle('h1'), color: '#1F1147', marginBottom: space[3] },
  h2: { ...interTextStyle('h2'), color: '#1F1147', marginTop: space[5], marginBottom: space[2] },
  bubbleRow: {
    flexDirection: 'row',
    gap: space[3],
    padding: space[4],
    borderRadius: 16,
    flexWrap: 'wrap',
  },
});

/**
 * PrimitivesShowcaseScreen — galerie DEV des composants primitifs Sprint 1.
 *
 * STATUT : DEV uniquement, JAMAIS branché en production. Sert à vérifier
 * visuellement le rendu de Button / Card / Checkbox / Scale15 / LevelSelector /
 * StreakBubble / Modal sur device réel pendant le développement.
 *
 * USAGE TEMPORAIRE pour tester sur device :
 *
 *   1. Dans `App.tsx`, remplace temporairement le contenu de `AppNavigator`
 *      par : `return <PrimitivesShowcaseScreen />;`
 *   2. Reload l'app dans Expo Go (`r` dans terminal Metro).
 *   3. Une fois validé visuellement, restaure App.tsx (git checkout App.tsx)
 *      et ne jamais commit le branchement temporaire.
 *
 * Réf design system V1.1 §5.
 */

import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Settings } from 'lucide-react-native';
import {
  Button,
  Card,
  Checkbox,
  Scale15,
  LevelSelector,
  Modal,
} from '../../components/primitives';
import { StreakBubble } from '../../components/compositions';
import { brandColors, pillarColors, space, interTextStyle } from '../../theme';
import type {
  Scale15Value,
  AdaptiveLevel,
} from '../../components/primitives';
import type { PillarContext } from '../../theme';

export default function PrimitivesShowcaseScreen() {
  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(false);
  const [scale, setScale] = useState<Scale15Value | null>(3);
  const [level, setLevel] = useState<AdaptiveLevel | null>('same');
  const [modalStandard, setModalStandard] = useState(false);
  const [modalSheet, setModalSheet] = useState(false);
  const [modalFull, setModalFull] = useState(false);

  const contexts: PillarContext[] = ['phase0', 's1', 's7', 'neutral'];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h1}>Sprint 1 — Primitives showcase</Text>
        <Text style={styles.body}>
          Galerie DEV. Tap-test chaque variante, observe animations, vérifie
          contrastes et tailles touch target.
        </Text>

        {/* BUTTONS */}
        <Section title="Button — 4 variantes × 3 tailles">
          {contexts.map((ctx) => (
            <View key={ctx} style={styles.contextBlock}>
              <Text style={styles.contextLabel}>context: {ctx}</Text>
              <Button label="Primaire standard" context={ctx} onPress={() => {}} />
              <Button label="Secondaire" variant="secondary" context={ctx} onPress={() => {}} />
              <Button label="Ghost" variant="ghost" context={ctx} onPress={() => {}} />
              <Button
                label="Avec icônes"
                context={ctx}
                onPress={() => {}}
                IconLeft={Settings}
                IconRight={ArrowRight}
              />
            </View>
          ))}
          <View style={styles.contextBlock}>
            <Text style={styles.contextLabel}>tailles + états</Text>
            <Button label="Compact" size="compact" onPress={() => {}} />
            <Button label="Standard" size="standard" onPress={() => {}} />
            <Button label="Large" size="large" onPress={() => {}} fullWidth />
            <Button label="Disabled" disabled onPress={() => {}} />
            <Button label="Loading" loading onPress={() => {}} />
            <Button label="Destructive" variant="destructive" onPress={() => {}} />
          </View>
        </Section>

        {/* CARDS */}
        <Section title="Card — 4 variantes">
          <Card title="Card standard" subtitle="Sous-titre body 15px." />
          <Card variant="forte" title="Card forte" subtitle="Padding plus généreux, radius xl." />
          <Card
            variant="action"
            title="Card action"
            subtitle="Tap pour naviguer."
            onPress={() => {}}
          />
          <Card variant="pilier" context="s1" title="Card pilier S1" subtitle="Teinte S1." />
          <Card variant="pilier" context="s7" title="Card pilier S7 Mindset" subtitle="Teinte S7." />
        </Section>

        {/* CHECKBOX */}
        <Section title="Checkbox — large + standard">
          <Checkbox
            checked={check1}
            onChange={setCheck1}
            label="Activation matinale (Phase 0)"
            context="phase0"
          />
          <Checkbox
            checked={check2}
            onChange={setCheck2}
            label="Défi froid"
            context="phase0"
          />
          <Checkbox checked={false} onChange={() => {}} label="Disabled" disabled />
          <Checkbox
            checked={true}
            onChange={() => {}}
            label="Taille standard"
            size="standard"
            context="s1"
          />
        </Section>

        {/* SCALE 1-5 */}
        <Section title="Scale15 — échelle 1-5 évaluations">
          <Scale15
            value={scale}
            onChange={setScale}
            context="s1"
            leftLabel="Jamais"
            rightLabel="Toujours"
          />
        </Section>

        {/* LEVEL SELECTOR */}
        <Section title="LevelSelector — niveau adaptatif">
          <LevelSelector value={level} onChange={setLevel} context="s1" />
        </Section>

        {/* STREAK BUBBLE */}
        <Section title="StreakBubble — sur fonds variés">
          <View style={[styles.bubbleRow, { backgroundColor: pillarColors.phase0.headerBg }]}>
            <StreakBubble days={12} />
            <StreakBubble days={1} />
            <StreakBubble days={365} hideLabel />
          </View>
          <View style={[styles.bubbleRow, { backgroundColor: pillarColors.s7.headerBg }]}>
            <StreakBubble days={47} />
          </View>
        </Section>

        {/* MODALS */}
        <Section title="Modal — 3 variantes">
          <Button label="Ouvrir modale standard" onPress={() => setModalStandard(true)} />
          <Button label="Ouvrir bottom sheet" variant="secondary" onPress={() => setModalSheet(true)} />
          <Button label="Ouvrir fullscreen pilier S1" variant="ghost" context="s1" onPress={() => setModalFull(true)} />
        </Section>

        <View style={{ height: space[8] }} />
      </ScrollView>

      {/* MODALES */}
      <Modal visible={modalStandard} onClose={() => setModalStandard(false)} variant="standard">
        <Text style={[styles.h3, { marginBottom: space[3] }]}>Modale standard</Text>
        <Text style={[styles.body, { marginBottom: space[4] }]}>
          Centré, scale + fade 300ms. Tap overlay pour fermer.
        </Text>
        <Button label="OK" onPress={() => setModalStandard(false)} fullWidth />
      </Modal>

      <Modal visible={modalSheet} onClose={() => setModalSheet(false)} variant="bottomSheet">
        <Text style={[styles.h3, { marginBottom: space[3] }]}>Bottom sheet</Text>
        <Text style={[styles.body, { marginBottom: space[4] }]}>
          Monte depuis le bas, translateY 350ms decelerate.
        </Text>
        <Button label="Fermer" onPress={() => setModalSheet(false)} fullWidth />
      </Modal>

      <Modal
        visible={modalFull}
        onClose={() => setModalFull(false)}
        variant="fullscreen"
        context="s1"
      >
        <View style={{ flex: 1, padding: space[6], justifyContent: 'center' }}>
          <Text style={[styles.h1, { color: pillarColors.s1.text }]}>Plein écran S1</Text>
          <Text style={[styles.body, { color: pillarColors.s1.text, marginVertical: space[4] }]}>
            Fond pastel S1 (#C9DFEC), pas d'overlay, marges narratives. Pour
            S0.1 / S0.2 / paliers / jours-charnière.
          </Text>
          <Button label="Fermer" context="s1" onPress={() => setModalFull(false)} fullWidth />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.h2}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: brandColors.cream,
  },
  scroll: {
    padding: space[5],
    gap: space[5],
  },
  h1: {
    ...interTextStyle('h1'),
    color: '#1F1147',
    marginBottom: space[2],
  },
  h2: {
    ...interTextStyle('h2'),
    color: '#1F1147',
    marginBottom: space[3],
  },
  h3: {
    ...interTextStyle('h3'),
    color: '#1F1147',
  },
  body: {
    ...interTextStyle('body'),
    color: '#5A4B7A',
  },
  section: {
    marginTop: space[3],
  },
  sectionContent: {
    gap: space[3],
  },
  contextBlock: {
    marginBottom: space[4],
    gap: space[2],
  },
  contextLabel: {
    ...interTextStyle('caption'),
    color: '#5A4B7A',
    textTransform: 'uppercase',
    marginBottom: space[1],
  },
  bubbleRow: {
    flexDirection: 'row',
    gap: space[3],
    padding: space[4],
    borderRadius: 16,
    flexWrap: 'wrap',
  },
});

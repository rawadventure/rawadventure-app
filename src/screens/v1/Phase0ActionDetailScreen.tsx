/**
 * Phase0ActionDetailScreen — IA-13 V1 (détail d'une action Phase 0).
 *
 * Réf IA V3 §IA-13 + design system V1.1 Pattern C (§10.3).
 *
 * Affiche le détail riche d'une action de Phase 0 (why / how / tip). Le copy
 * affiché en V1.0 est un placeholder marqué `[copy à valider]` quand on
 * déborde du titre / sous-titre. Le copy définitif viendra du Brief contenu
 * V1 produit par Mimi & Jacky.
 *
 * Pas de vidéo en Phase 0 (D33 = 1 vidéo par pilier en Phase 1 uniquement),
 * donc le Pattern C est adapté ici sans vignette vidéo. Bouton "C'est pris,
 * je rentre à l'accueil" pour ramener à IA-11.
 *
 * Référence IA : IA-13. Pattern : C adapté.
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft } from 'lucide-react-native';
import { Button } from '../../components/primitives';
import {
  interTextStyle,
  layout,
  neutralColors,
  pillarColors,
  space,
} from '../../theme';
import { getPhase0Action, type Phase0ActionId } from '../../data/phase0-actions';
import type { Phase0StackParamList } from '../../navigation/HomeStack';
import { Pressable } from 'react-native';

type Route = NativeStackScreenProps<Phase0StackParamList, 'Phase0ActionDetail'>['route'];
type Nav = NativeStackNavigationProp<Phase0StackParamList>;

export default function Phase0ActionDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const action = getPhase0Action(route.params.actionId as Phase0ActionId);

  if (!action) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Text style={styles.errorText}>Action inconnue.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.headerBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Retour"
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
        >
          <ChevronLeft size={24} color={pillarColors.phase0.text} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.iconHero}>
          <action.Icon size={48} color={pillarColors.phase0.text} />
        </View>
        <Text style={styles.title}>{action.title}</Text>
        <Text style={styles.subtitle}>{action.subtitle}</Text>

        <Text style={styles.sectionTitle}>Pourquoi</Text>
        <Text style={styles.body}>{action.why}</Text>

        <Text style={styles.sectionTitle}>Comment</Text>
        <View style={styles.howList}>
          {action.how.map((step, idx) => (
            <View key={idx} style={styles.howItem}>
              <Text style={styles.howBullet}>·</Text>
              <Text style={styles.howText}>{step}</Text>
            </View>
          ))}
        </View>

        {action.tip && (
          <>
            <Text style={styles.sectionTitle}>Astuce</Text>
            <Text style={styles.body}>{action.tip}</Text>
          </>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <Button
          label="C'est fait, on continue"
          onPress={() => navigation.goBack()}
          fullWidth
          size="large"
          context="phase0"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: pillarColors.phase0.bg },
  headerBar: {
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: layout.screen.marginHorizontal,
    paddingBottom: space[6],
  },
  iconHero: {
    alignItems: 'center',
    marginVertical: space[5],
  },
  title: {
    ...interTextStyle('display'),
    color: pillarColors.phase0.text,
    textAlign: 'center',
  },
  subtitle: {
    ...interTextStyle('bodyLarge'),
    color: pillarColors.phase0.text,
    textAlign: 'center',
    opacity: 0.85,
    marginTop: space[2],
    marginBottom: space[6],
  },
  sectionTitle: {
    ...interTextStyle('h3'),
    color: pillarColors.phase0.text,
    marginTop: space[5],
    marginBottom: space[2],
  },
  body: {
    ...interTextStyle('bodyLarge'),
    color: pillarColors.phase0.text,
  },
  howList: { gap: space[2] },
  howItem: { flexDirection: 'row', gap: space[2] },
  howBullet: {
    ...interTextStyle('bodyLarge'),
    color: pillarColors.phase0.text,
    opacity: 0.6,
  },
  howText: { ...interTextStyle('bodyLarge'), color: pillarColors.phase0.text, flex: 1 },
  footer: {
    padding: layout.screen.marginHorizontal,
  },
  errorText: { ...interTextStyle('body'), color: neutralColors.textSecondary, padding: space[5] },
});

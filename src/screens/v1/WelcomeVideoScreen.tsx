/**
 * WelcomeVideoScreen — IA-12 vidéo de bienvenue J1.
 *
 * Réf IA V3 §IA-12 (ligne 386).
 *
 * Couche superposée plein écran déclenchée au premier lancement de l'accueil
 * après onboarding (currentDay === 1 + !narrativeFlags.welcome_video).
 * Pas un écran à part entière, plutôt une couche narrative qui se ferme
 * automatiquement après lecture vidéo, ou que l'utilisateur peut passer.
 *
 * Sortie : retour IA-11 mode J1.
 *
 * V1 Sprint 27 simplifications acceptables :
 *  - vidéo Mimi & Jacky : placeholder en attendant tournage Brief contenu
 *    (pas listé dans Sessions 1/2/3 — Brief vidéo bienvenue J1 à produire)
 *  - bouton "Passer" présent (placeholder n'est pas une vraie vidéo donc
 *    skip = bouton "Continuer")
 *  - durée vidéo 15-30s prévue, à préciser après production
 *
 * Référence IA : IA-12. Pattern : A (écran narratif plein).
 */

import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import { Modal } from '../../components/primitives/Modal';
import { Button } from '../../components/primitives/Button';
import { LogoRawAdventure } from '../../components/illustrations';
import {
  brandColors,
  interTextStyle,
  pillarColors,
  radiusV1,
  space,
} from '../../theme';

export type WelcomeVideoScreenProps = {
  visible: boolean;
  /** Tap "Continuer" ou "Passer" — ferme couche, retour Accueil J1. */
  onContinue: () => void;
};

export default function WelcomeVideoScreen({ visible, onContinue }: WelcomeVideoScreenProps) {
  return (
    <Modal visible={visible} onClose={() => {}} variant="fullscreen" context="phase0" dismissable={false}>
      <View style={styles.skipRow}>
        <Pressable
          onPress={onContinue}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Passer la vidéo"
          style={({ pressed }) => [styles.skipBtn, pressed && { opacity: 0.7 }]}
        >
          <X size={22} color={brandColors.deep} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.head}>
          <Text style={styles.marker}>JOUR 1 · BIENVENUE</Text>
          <Text style={styles.title}>C'est parti.</Text>
          <Text style={styles.subtitle}>
            14 jours. 7 actions par jour. Guidées. À ton rythme.{'\n\n'}
            Tu ouvres. Tu fais. Tu coches.
          </Text>
        </View>

        <View style={styles.videoPlaceholder}>
          <LogoRawAdventure variant="filigrane" size={56} opacity={0.22} color={brandColors.deep} />
          <Text style={styles.videoText}>
            Vidéo Mimi & Jacky — bienvenue J1{'\n'}
            (Brief contenu vidéo bienvenue, 15-30s)
          </Text>
        </View>

        <View style={styles.notes}>
          <Text style={styles.note}>
            5 sur 7 suffisent pour valider ta journée. Et le joker est là pour
            les jours difficiles.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Continuer" onPress={onContinue} fullWidth size="large" context="phase0" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  skipRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: space[5],
    paddingTop: space[2],
  },
  skipBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flexGrow: 1,
    padding: space[6],
    gap: space[5],
  },
  head: { gap: space[3] },
  marker: {
    ...interTextStyle('caption'),
    color: brandColors.deep,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    ...interTextStyle('display'),
    color: brandColors.deep,
  },
  subtitle: {
    ...interTextStyle('bodyLarge'),
    color: brandColors.deep,
  },
  videoPlaceholder: {
    backgroundColor: pillarColors.neutral.bg,
    borderRadius: radiusV1.xl,
    padding: space[5],
    alignItems: 'center',
    gap: space[3],
    borderWidth: 1.5,
    borderColor: brandColors.deep + '22',
    minHeight: 200,
    justifyContent: 'center',
  },
  videoText: {
    ...interTextStyle('bodySmall'),
    color: brandColors.deep,
    textAlign: 'center',
    opacity: 0.75,
  },
  notes: {
    paddingTop: space[3],
    borderTopWidth: 1,
    borderTopColor: brandColors.deep + '22',
  },
  note: {
    ...interTextStyle('body'),
    color: brandColors.deep,
  },
  footer: {
    padding: space[6],
  },
});

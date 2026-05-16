/**
 * S01Screen — IA-20 célébration et révélation de la toile (S0.1).
 *
 * Réf IA V3 §IA-20 + Feature Spec V1 Socle minimum §3 fiche IA-20.
 *
 * Couche superposée plein écran, déclenchée au premier lancement du J15
 * calendaire. C'est le moment narratif central de la Phase 0 → S0 :
 *  - célèbre les 14 jours d'amorçage terminés
 *  - révèle la toile d'araignée (jamais vue avant — D5 masquée Phase 0)
 *  - ouvre sur la suite (Phase 1)
 *
 * **D30 — coordination palier 15j ↔ S0.1.** Si le palier 15j tombe le même
 * jour que S0.1, c'est S0.1 qui prime — la modale IA-50 du palier 15j est
 * différée d'un cran à la prochaine validation. Cette priorité est gérée
 * côté caller (HomeScreenV1 doit déclencher S0.1 avant tout autre overlay
 * narratif quand currentDay = 15).
 *
 * V1 Sprint 7 simplifications acceptables :
 *  - vidéo Mimi & Jacky `media.IA-20.video-celebration-14j` → placeholder
 *    en attendant tournage Brief contenu Session 2
 *  - animation de déploiement de la toile : laissée au composant Toile
 *    via prop `animateOnMount` (no-op V1, polish Sprint 8+)
 *  - bouton "Passer" en haut à droite : pas implémenté V1 (la "vidéo"
 *    placeholder est statique, donc pas besoin de skip)
 *
 * Référence IA : IA-20. Pattern : A (écran narratif plein).
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Sparkle } from 'lucide-react-native';
import { Modal } from '../../components/primitives/Modal';
import { Button } from '../../components/primitives/Button';
import { Toile, makeMockScores } from '../../components/toile';
import {
  brandColors,
  interTextStyle,
  pillarColors,
  radiusV1,
  space,
} from '../../theme';
import { LogoRawAdventure } from '../../components/illustrations';

export type S01ScreenProps = {
  visible: boolean;
  /** Streak en cours (en général 14 à J15 si parcours complet). */
  streak: number;
  /** Tap "Continuer" — bascule l'app en `s0_1` et ferme la couche. */
  onContinue: () => void;
};

export default function S01Screen({ visible, streak, onContinue }: S01ScreenProps) {
  // Mock scores level1 — l'utilisateur n'a pas encore fait d'évaluation initiale.
  // À remplacer par l'état réel quand le mapping profil dynamique → niveau
  // de départ par pilier (D15) sera implémenté en Sprint 8+.
  const scores = makeMockScores('level1');

  return (
    <Modal visible={visible} onClose={() => {}} variant="fullscreen" context="neutral" dismissable={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.head}>
          <View style={styles.markerRow}>
            <Sparkle size={16} color={brandColors.deep} fill={brandColors.deep} />
            <Text style={styles.marker}>S0.1 · Transition</Text>
          </View>
          <Text style={styles.title}>Quatorze jours{'\n'}derrière toi.</Text>
          <Text style={styles.subtitle}>
            La Phase 0 est complète. Tu as construit le terrain. Le corps a
            reçu deux semaines de signaux. [copy à valider]
          </Text>
        </View>

        {/* Placeholder vidéo Mimi & Jacky 60-90s (Brief contenu Session 2) */}
        <View style={styles.videoPlaceholder}>
          <LogoRawAdventure variant="filigrane" size={56} opacity={0.22} color={brandColors.deep} />
          <Text style={styles.videoText}>
            Vidéo Mimi & Jacky — célébration 14 jours{'\n'}
            (Brief contenu Session 2, 60-90s)
          </Text>
        </View>

        <View style={styles.toileSection}>
          <Text style={styles.toileLabel}>Ta toile de vitalité</Text>
          <Text style={styles.toileSubtitle}>
            Huit branches, une par pilier. Elles se renforcent à mesure que
            tu pratiques. C'est la carte de ta progression.
          </Text>
          <View style={styles.toileWrap}>
            <Toile scores={scores} variant="full" animateOnMount />
          </View>
        </View>

        {streak > 0 && (
          <View style={styles.streakBlock}>
            <Text style={styles.streakLabel}>Streak</Text>
            <Text style={styles.streakValue}>
              {streak} jour{streak > 1 ? 's' : ''} consécutif{streak > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <Button label="Continuer" onPress={onContinue} fullWidth size="large" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: space[6],
    gap: space[5],
  },
  head: { gap: space[3] },
  markerRow: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
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
  },
  videoText: {
    ...interTextStyle('bodySmall'),
    color: brandColors.deep,
    textAlign: 'center',
    opacity: 0.7,
  },
  toileSection: { gap: space[2] },
  toileLabel: {
    ...interTextStyle('h2'),
    color: brandColors.deep,
  },
  toileSubtitle: {
    ...interTextStyle('body'),
    color: brandColors.deep,
    opacity: 0.8,
  },
  toileWrap: { alignItems: 'center', paddingVertical: space[3] },
  streakBlock: {
    marginTop: space[3],
    paddingTop: space[4],
    borderTopWidth: 1,
    borderTopColor: brandColors.deep + '22',
    gap: space[1],
  },
  streakLabel: {
    ...interTextStyle('caption'),
    color: brandColors.deep,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  streakValue: {
    ...interTextStyle('h3'),
    color: brandColors.deep,
  },
  footer: {
    padding: space[6],
  },
});

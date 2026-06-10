/**
 * S02Screen — IA-21 roadmap et démarrage de l'évaluation S1 (S0.2).
 *
 * Réf IA V3 §IA-21 + Feature Spec V1 Socle minimum §3 fiche IA-21.
 *
 * Couche superposée plein écran, déclenchée au premier lancement du J16
 * calendaire. Présente la roadmap des 8 piliers de Phase 1 et ouvre sur
 * l'évaluation initiale du premier pilier (S1 Respiration, IA-40).
 *
 * Ordre canonique D39 des piliers : S1 Respiration → S2 Activité physique
 * → S3 Alimentation → S4 Connexion au vivant → S5 Repos → S6 Passion →
 * S7 Mindset → S8 Élimination et détox.
 *
 * V1 Sprint 7 simplifications acceptables :
 *  - vidéo Mimi & Jacky `media.IA-21.video-introduction-phase-1` →
 *    placeholder en attendant tournage Brief contenu Session 2
 *  - animation cascade des 8 piliers : pas implémentée V1 (statique). Polish
 *    Sprint 8+ via Reanimated.
 *  - bouton "Démarrer l'évaluation Respiration" → onClose Sprint 7. La
 *    navigation vers IA-40 sera câblée en Sprint 8 quand l'écran existe.
 *
 * Référence IA : IA-21. Pattern : A.
 */

import React, { useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import {
  Activity,
  Apple,
  Compass,
  Lightbulb,
  Moon,
  Play,
  Recycle,
  Sparkle,
  Trees,
  Wind,
} from 'lucide-react-native';
import { Modal } from '../../components/primitives/Modal';
import { Button } from '../../components/primitives/Button';
import { LogoRawAdventure } from '../../components/illustrations';
import {
  brandColors,
  interTextStyle,
  pillarColors,
  radiusV1,
  space,
  treeColors,
} from '../../theme';
import { getInterFamily } from '../../theme';
import type { PillarSlot } from '../../components/toile';

type RoadmapPillar = {
  id: PillarSlot;
  week: number;
  name: string;
  short: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
};

/** Ordre canonique D39 — figé en V1 (Feature Spec V1 §1.4). Icônes Lucide
 *  provisoires en attendant arbitrage Charte graphique (§7.4 Piliers Phase 1
 *  « à arbitrer en revue de maquette »). */
const ROADMAP: RoadmapPillar[] = [
  { id: 's1', week: 1, name: 'Respiration', short: 'Le moteur invisible', Icon: Wind },
  { id: 's2', week: 2, name: 'Activité physique', short: 'Le corps en mouvement', Icon: Activity },
  { id: 's3', week: 3, name: 'Alimentation', short: 'Le carburant', Icon: Apple },
  { id: 's4', week: 4, name: 'Connexion au vivant', short: 'Le terrain extérieur', Icon: Trees },
  { id: 's5', week: 5, name: 'Repos et régénération', short: 'La récupération', Icon: Moon },
  { id: 's6', week: 6, name: 'Passion et chemin de vie', short: "L'élan", Icon: Compass },
  { id: 's7', week: 7, name: 'Mindset', short: 'Le rapport à soi', Icon: Lightbulb },
  { id: 's8', week: 8, name: 'Élimination et détox', short: 'Le nettoyage', Icon: Recycle },
];

export type S02ScreenProps = {
  visible: boolean;
  /** Tap "Démarrer l'évaluation Respiration" → ferme la couche + navigation IA-40
   *  (à câbler Sprint 8 quand IA-40 existera). En Sprint 7 c'est juste un close. */
  onStartEvaluation: () => void;
};

/**
 * URL vidéo S0.2 roadmap Phase 1 — Supabase Storage public bucket
 * `phase0-videos`. Brief contenu Session 2 (Mimi & Jacky), ~60-90s.
 */
const VIDEO_URL =
  'https://aknvitrtfxqjdwiyxryt.supabase.co/storage/v1/object/public/phase0-videos/s0-2-roadmap.mp4';

export default function S02Screen({ visible, onStartEvaluation }: S02ScreenProps) {
  const videoRef = useRef<Video | null>(null);
  const openVideoFullscreen = async () => {
    try {
      await videoRef.current?.presentFullscreenPlayer();
      await videoRef.current?.playAsync();
    } catch (e) {
      console.warn('S02Screen — fullscreen launch failed', e);
    }
  };

  return (
    <Modal visible={visible} onClose={() => {}} variant="fullscreen" context="neutral" dismissable={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.head}>
          <View style={styles.markerRow}>
            <Sparkle size={16} color={brandColors.deep} fill={brandColors.deep} />
            <Text style={styles.marker}>S0.2 · Roadmap</Text>
          </View>
          <Text style={styles.title}>Huit semaines.{'\n'}Huit piliers.</Text>
          <Text style={styles.subtitle}>
            Phase 1 démarre demain. Tu vas explorer un pilier par semaine,
            dans cet ordre précis. Chaque pilier renforce une branche de ta
            toile. [copy à valider]
          </Text>
        </View>

        {/* Vidéo Mimi & Jacky introduction Phase 1 — preview 16:9 + tap fullscreen */}
        <Pressable
          onPress={openVideoFullscreen}
          style={styles.videoPreview}
          accessibilityRole="button"
          accessibilityLabel="Lire la vidéo d'introduction Phase 1"
        >
          <Video
            ref={(r) => {
              videoRef.current = r;
            }}
            source={{ uri: VIDEO_URL }}
            style={StyleSheet.absoluteFill}
            resizeMode={ResizeMode.COVER}
            isLooping={false}
            shouldPlay={false}
            positionMillis={1000}
          />
          <View style={styles.videoPlayOverlay} pointerEvents="none">
            <View style={styles.videoPlayCircle}>
              <Play size={28} color="#FFFFFF" fill="#FFFFFF" />
            </View>
          </View>
        </Pressable>

        <Text style={styles.roadmapTitle}>L'ordre des piliers</Text>

        <View style={styles.roadmap}>
          {ROADMAP.map((p, idx) => {
            const tip = treeColors[p.id].tip;
            const isFirst = idx === 0;
            return (
              <View key={p.id} style={[styles.pillarRow, isFirst && styles.pillarRowHighlight]}>
                <View style={[styles.pillarWeekBubble, { backgroundColor: tip }]}>
                  <Text style={styles.pillarWeekNumber}>{p.week}</Text>
                </View>
                <View style={styles.pillarIconWrap}>
                  <p.Icon size={22} color={tip} />
                </View>
                <View style={styles.pillarText}>
                  <Text style={[styles.pillarName, isFirst && styles.pillarNameHighlight]}>
                    {p.name}
                  </Text>
                  <Text style={styles.pillarShort}>{p.short}</Text>
                </View>
                {isFirst && (
                  <View style={styles.firstBadge}>
                    <Text style={styles.firstBadgeText}>ON DÉMARRE</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <Text style={styles.transition}>
          Le premier pilier est <Text style={styles.transitionBold}>Respiration</Text>. On
          commence par une évaluation rapide — 12 questions, deux minutes — pour calibrer
          ta semaine. [copy à valider]
        </Text>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          label="Démarrer l'évaluation Respiration"
          onPress={onStartEvaluation}
          fullWidth
          size="large"
          context="s1"
        />
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
  videoPreview: {
    borderRadius: radiusV1.xl,
    overflow: 'hidden',
    backgroundColor: '#000',
    width: '100%',
    aspectRatio: 16 / 9,
    alignSelf: 'center',
    position: 'relative',
  },
  videoPlayOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  videoPlayCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
  },
  roadmapTitle: {
    ...interTextStyle('h2'),
    color: brandColors.deep,
  },
  roadmap: { gap: space[2] },
  pillarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingVertical: space[3],
    paddingHorizontal: space[3],
    borderRadius: radiusV1.lg,
    backgroundColor: 'transparent',
  },
  pillarRowHighlight: {
    backgroundColor: pillarColors.s1.bg,
    borderWidth: 1.5,
    borderColor: pillarColors.s1.headerBg,
  },
  pillarWeekBubble: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarWeekNumber: {
    fontFamily: getInterFamily('700'),
    fontSize: 15,
    color: '#FFFFFF',
  },
  pillarIconWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarText: { flex: 1 },
  pillarName: {
    fontFamily: getInterFamily('600'),
    fontSize: 16,
    lineHeight: 22,
    color: brandColors.deep,
  },
  pillarNameHighlight: {
    color: pillarColors.s1.text,
  },
  pillarShort: {
    fontFamily: getInterFamily('400'),
    fontSize: 13,
    lineHeight: 18,
    color: brandColors.deep,
    opacity: 0.65,
  },
  firstBadge: {
    backgroundColor: pillarColors.s1.headerBg,
    paddingHorizontal: space[2],
    paddingVertical: 4,
    borderRadius: radiusV1.pill,
  },
  firstBadgeText: {
    fontFamily: getInterFamily('700'),
    fontSize: 10,
    letterSpacing: 0.8,
    color: '#FFFFFF',
  },
  transition: {
    ...interTextStyle('body'),
    color: brandColors.deep,
  },
  transitionBold: {
    fontFamily: getInterFamily('700'),
  },
  footer: {
    padding: space[6],
  },
});

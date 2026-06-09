/**
 * TierReachedModal — IA-50 modale de palier de récompense streak.
 *
 * Réf IA V3 §IA-50 + Feature Spec V1 Socle minimum §2.6 + D29 + D30 +
 * design system V1.1 §5.7 (badge palier).
 *
 * Deux variantes selon `isFirstReach` (D29 — compteur `tier{N}ReachedCount`) :
 *
 *   - **Premier franchissement** (`reach_count === 1`) : modale plein écran,
 *     vidéo 30s placeholder (en attendant tournage Mimi & Jacky — Brief
 *     contenu Session 1), badge 120px, message personnalisé long, deux boutons
 *     "Voir ma galerie" et "Continuer".
 *
 *   - **Redéclenchements** (`reach_count > 1`, palier déjà atteint puis cassé
 *     puis reconstruit) : modale standard simplifiée, badge 80px, message
 *     court de reconnaissance, un seul bouton "Continuer".
 *
 * **D30 — coordination palier 15j ↔ S0.1.** Si le palier 15j tombe le même
 * jour que le déclenchement de S0.1, c'est S0.1 qui prime, IA-50 du palier
 * 15j est différé d'un cran. Cette coordination est gérée côté caller
 * (HomeScreenV1 doit vérifier la queue d'écrans narratifs avant d'ouvrir
 * cette modale). À implémenter en Sprint 6 IA-14 / Sprint 7 S0.
 */

import React, { useRef } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Play, Sparkle } from 'lucide-react-native';
import { Modal } from '../primitives/Modal';
import { Button } from '../primitives/Button';
import {
  brandColors,
  interTextStyle,
  pillarColors,
  radiusV1,
  space,
} from '../../theme';
import { getInterFamily } from '../../theme';
import { LogoRawAdventure } from '../illustrations';
import type { TierId } from '../../lib/streak';

export type TierReachedModalProps = {
  visible: boolean;
  tierId: TierId | null;
  isFirstReach: boolean;
  streakValue: number;
  onClose: () => void;
  /** Si fourni et `isFirstReach=true`, ajoute un bouton "Voir ma galerie" qui
   *  navigue vers IA-51. Réservé Sprint 7+ (galerie pas encore codée). */
  onViewGallery?: () => void;
};

/** Couleur dominante du badge selon le palier (§5.7 + cohérence palette brand). */
const TIER_COLOR: Record<TierId, string> = {
  7: brandColors.sun,
  15: brandColors.alive,
  30: pillarColors.s1.headerBg,
  60: pillarColors.s5.headerBg,
  100: pillarColors.s6.headerBg,
  365: brandColors.deep,
};

/**
 * URLs vidéos paliers — Supabase Storage public bucket `phase0-videos`.
 * Tournage Brief contenu Session 1 (Mimi & Jacky).
 * Format : MP4 H.264, ~30s, portrait 1080×1920, ~18 Mo chacune.
 *
 * Si vidéo absente (null) → fallback placeholder texte (cf. composant ci-dessous).
 */
const SUPABASE_VIDEOS_BASE =
  'https://aknvitrtfxqjdwiyxryt.supabase.co/storage/v1/object/public/phase0-videos';

const TIER_VIDEO_URL: Record<TierId, string | null> = {
  7: `${SUPABASE_VIDEOS_BASE}/palier-7j.mp4`,
  15: `${SUPABASE_VIDEOS_BASE}/palier-15j.mp4`,
  30: `${SUPABASE_VIDEOS_BASE}/palier-30j.mp4`,
  60: `${SUPABASE_VIDEOS_BASE}/palier-60j.mp4`,
  100: `${SUPABASE_VIDEOS_BASE}/palier-100j.mp4`,
  365: `${SUPABASE_VIDEOS_BASE}/palier-365j.mp4`,
};

/** Message court de premier franchissement par palier (placeholders V1). */
const TIER_FIRST_MESSAGE: Record<TierId, { title: string; body: string }> = {
  7: {
    title: 'Sept jours.',
    body: "Une semaine de signaux quotidiens, c'est ce qu'il faut pour que le corps commence à recalibrer son fonctionnement de base. Sommeil un peu plus dense, énergie plus stable au réveil, moins de pics de faim — ce sont des indices, pas des illusions. Tu n'es plus en train d'essayer. Tu pratiques. Et le corps suit.",
  },
  15: {
    title: 'Quinze jours.',
    body: "Tu as traversé la Phase 0. Les bases sont posées. [copy à valider]",
  },
  30: {
    title: 'Un mois.',
    body: "Le cap symbolique du mois. Tu n'es plus dans le démarrage. [copy à valider]",
  },
  60: {
    title: 'Soixante jours.',
    body: "Deux mois de continuité. La pratique devient ton normal. [copy à valider]",
  },
  100: {
    title: 'Cent jours.',
    body: "Un chiffre rond et lourd. Tu as construit quelque chose de solide. [copy à valider]",
  },
  365: {
    title: 'Un an.',
    body: "Trois cent soixante-cinq jours. Ce n'est plus un défi, c'est une vie. [copy à valider]",
  },
};

/** Message court de redéclenchement (D29 variante allégée). */
const TIER_REPEAT_MESSAGE = "Tu as repassé ce palier. La constance se rebâtit.";

export function TierReachedModal({
  visible,
  tierId,
  isFirstReach,
  streakValue,
  onClose,
  onViewGallery,
}: TierReachedModalProps) {
  const videoRef = useRef<Video | null>(null);

  if (!tierId) return null;

  const color = TIER_COLOR[tierId];
  const videoUrl = TIER_VIDEO_URL[tierId];

  /**
   * Lance le player en plein écran (iOS : QuickTime-style natif, Android :
   * ExoPlayer fullscreen). User tap preview → on appelle l'API native
   * via la ref Video. Auto-play une fois en fullscreen.
   */
  const openVideoFullscreen = async () => {
    try {
      await videoRef.current?.presentFullscreenPlayer();
      await videoRef.current?.playAsync();
    } catch (e) {
      console.warn('TierReachedModal — fullscreen launch failed', e);
    }
  };

  if (isFirstReach) {
    const message = TIER_FIRST_MESSAGE[tierId];
    return (
      <Modal visible={visible} onClose={onClose} variant="fullscreen" context="neutral">
        <View style={styles.fullscreenBody}>
          <View>
            <View style={styles.markerRow}>
              <Sparkle size={16} color={brandColors.deep} fill={brandColors.deep} />
              <Text style={styles.marker}>Palier atteint</Text>
            </View>
            <Text style={styles.titleFull}>{message.title}</Text>
            <Text style={styles.bodyFull}>{message.body}</Text>
          </View>

          {/* Badge palier 120px — placeholder Lulo Clean (Inter 800 uppercase
              en attendant l'asset SVG du wordmark/badges Lulo). */}
          <View style={styles.badgeWrap}>
            <View style={[styles.badgeLarge, { backgroundColor: color }]}>
              <Text style={styles.badgeNumber}>{tierId}</Text>
              <Text style={styles.badgeLabel}>{tierId === 365 ? 'AN' : 'JOURS'}</Text>
            </View>
          </View>

          {/* Vidéo Mimi & Jacky — Supabase Storage.
              UX : preview compacte 16:9 cliquable → tap ouvre player natif
              plein écran (fullscreen iOS/Android). Pas d'auto-play sur
              modale ouverture — l'utilisateur déclenche la lecture quand
              il a fini de lire le titre + body au-dessus. */}
          {videoUrl ? (
            <Pressable
              onPress={openVideoFullscreen}
              style={styles.videoPreview}
              accessibilityRole="button"
              accessibilityLabel={`Lire la vidéo du palier ${tierId} jours`}
            >
              <Video
                ref={(r) => {
                  videoRef.current = r;
                }}
                source={{ uri: videoUrl }}
                style={StyleSheet.absoluteFill}
                resizeMode={ResizeMode.COVER}
                isLooping={false}
                shouldPlay={false}
                // positionMillis avance le frame d'1s pour avoir un poster
                // déjà reconnaissable (visage Mimi/Jacky en place, pas
                // l'écran noir du début).
                positionMillis={1000}
              />
              <View style={styles.videoPlayOverlay} pointerEvents="none">
                <View style={styles.videoPlayCircle}>
                  <Play size={28} color="#FFFFFF" fill="#FFFFFF" />
                </View>
              </View>
            </Pressable>
          ) : (
            <View style={styles.videoPlaceholder}>
              <LogoRawAdventure variant="filigrane" size={48} opacity={0.18} color={brandColors.deep} />
              <Text style={styles.videoText}>
                Vidéo Mimi & Jacky — à venir.{'\n'}(Brief contenu Session 1)
              </Text>
            </View>
          )}

          <View style={styles.actionsFull}>
            {onViewGallery && (
              <Button
                label="Voir ma galerie"
                variant="secondary"
                onPress={onViewGallery}
                fullWidth
              />
            )}
            <Button label="Continuer" onPress={onClose} fullWidth size="large" />
          </View>
        </View>
      </Modal>
    );
  }

  // Variante redéclenchement (modale standard simplifiée)
  return (
    <Modal visible={visible} onClose={onClose} variant="standard">
      <View style={styles.standardHead}>
        <View style={[styles.badgeSmall, { backgroundColor: color }]}>
          <Text style={styles.badgeNumberSmall}>{tierId}</Text>
        </View>
        <View style={styles.standardTitleWrap}>
          <Text style={styles.standardTitle}>Palier {tierId} jours</Text>
          <Text style={styles.standardSubtitle}>Streak {streakValue}</Text>
        </View>
      </View>
      <Text style={styles.standardBody}>{TIER_REPEAT_MESSAGE}</Text>
      <Button label="Continuer" onPress={onClose} fullWidth />
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Fullscreen (premier franchissement)
  fullscreenBody: {
    flex: 1,
    padding: space[6],
    justifyContent: 'space-between',
  },
  markerRow: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  marker: {
    ...interTextStyle('caption'),
    color: brandColors.deep,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  titleFull: {
    ...interTextStyle('display'),
    color: brandColors.deep,
    marginTop: space[3],
  },
  bodyFull: {
    ...interTextStyle('bodyLarge'),
    color: brandColors.deep,
    marginTop: space[4],
  },
  badgeWrap: { alignItems: 'center' },
  badgeLarge: {
    width: 120,
    height: 120,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeNumber: {
    fontFamily: getInterFamily('800'),
    fontSize: 36,
    lineHeight: 40,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  badgeLabel: {
    fontFamily: getInterFamily('700'),
    fontSize: 10,
    letterSpacing: 1,
    color: '#FFFFFF',
    marginTop: 2,
  },
  videoPlaceholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: radiusV1.xl,
    padding: space[5],
    alignItems: 'center',
    gap: space[3],
    borderWidth: 1.5,
    borderColor: brandColors.deep + '22',
  },
  videoPreview: {
    borderRadius: radiusV1.xl,
    overflow: 'hidden',
    backgroundColor: '#000',
    // Preview compacte 16:9 paysage (~180px hauteur) avec play overlay.
    // Tap → openVideoFullscreen() → player iOS/Android natif portrait plein
    // écran, parfait pour visage Mimi/Jacky en 9:16 source.
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
    // Décalage léger Play icon (triangle pas parfaitement centré visuellement).
    paddingLeft: 4,
  },
  videoText: {
    ...interTextStyle('bodySmall'),
    color: brandColors.deep,
    textAlign: 'center',
    opacity: 0.7,
  },
  actionsFull: { gap: space[3] },

  // Standard (redéclenchement)
  standardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    marginBottom: space[3],
  },
  badgeSmall: {
    width: 56,
    height: 56,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeNumberSmall: {
    fontFamily: getInterFamily('800'),
    fontSize: 20,
    color: '#FFFFFF',
  },
  standardTitleWrap: { flex: 1 },
  standardTitle: {
    ...interTextStyle('h3'),
    color: brandColors.deep,
  },
  standardSubtitle: {
    ...interTextStyle('caption'),
    color: brandColors.deep,
    opacity: 0.65,
  },
  standardBody: {
    ...interTextStyle('body'),
    color: brandColors.deep,
    marginBottom: space[4],
  },
});

// Image not used — placeholder for future hero image.
void Image;

/**
 * VideoPreview — preview vidéo 16:9 + lecture, compatible natif et web.
 *
 * Extrait du pattern dupliqué dans WelcomeVideoScreen / JourCharniereScreen /
 * S01Screen / S02Screen / PillarOverviewScreen / TierReachedModal.
 *
 * Tap → lecteur fullscreen (`presentFullscreenPlayer`) puis lecture, sur
 * natif ET web : expo-av web supporte le fullscreen (requestFullscreen
 * standard, fallback `webkitEnterFullScreen` iOS Safari). Sur web le
 * fullscreen peut échouer au premier essai si les métadonnées vidéo ne sont
 * pas encore chargées (`InvalidStateError`) — on re-tente une fois dès que
 * la lecture démarre (onPlaybackStatusUpdate). Filet : lecture inline avec
 * contrôles natifs du navigateur si le fullscreen reste indisponible.
 *
 * Preview : poster embarqué (registre video-posters) — iOS Safari ne peint
 * jamais la frame d'une vidéo en pause, ni via positionMillis ni via #t=1.
 *
 * Chaque écran appelant passe SA vidéo (`uri`) et, si fourni, SON poster.
 */

import React, { useRef, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Video, ResizeMode, type AVPlaybackStatus } from 'expo-av';
import { Play } from 'lucide-react-native';
import { radiusV1 } from '../../theme';
import { getVideoPoster } from '../../lib/video-posters';

export type VideoPreviewProps = {
  /** URL mp4 (Supabase Storage public). */
  uri: string;
  /** Image poster optionnelle affichée avant lecture (fallback preview). */
  posterUri?: string;
  accessibilityLabel: string;
  /** Overrides du conteneur (le style de base 16:9 arrondi est inclus). */
  style?: StyleProp<ViewStyle>;
};

const isWeb = Platform.OS === 'web';

export function VideoPreview({
  uri,
  posterUri,
  accessibilityLabel,
  style,
}: VideoPreviewProps) {
  const videoRef = useRef<Video | null>(null);
  const [webPlaying, setWebPlaying] = useState(false);
  // Fullscreen raté au tap (métadonnées pas prêtes) → re-tenter dès que la
  // lecture démarre. Une seule re-tentative.
  const pendingFullscreenRef = useRef(false);

  const sourceUri = isWeb ? `${uri}#t=1` : uri;

  // Poster : prop explicite > registre embarqué (frame extraite de la vidéo).
  // Affiché tant que la lecture web n'a pas démarré — iOS Safari ne peint
  // jamais la frame d'une vidéo en pause, le poster est la preview fiable.
  const poster = posterUri ? { uri: posterUri } : getVideoPoster(uri);

  const handlePress = async () => {
    // Fullscreen et lecture séparés : un échec fullscreen ne bloque pas la
    // lecture. Sur web, le fullscreen échoue si la vidéo n'a encore rien
    // chargé — flag posé pour re-tenter au démarrage de la lecture.
    try {
      await videoRef.current?.presentFullscreenPlayer();
    } catch (e) {
      pendingFullscreenRef.current = true;
      console.warn('VideoPreview — fullscreen différé', e);
    }
    try {
      await videoRef.current?.setStatusAsync({ shouldPlay: true });
    } catch (e) {
      console.warn('VideoPreview — lecture échouée', e);
    }
    if (isWeb) {
      // Masque poster + overlay ; contrôles natifs en filet si le fullscreen
      // reste indisponible.
      setWebPlaying(true);
    }
  };

  const handleStatusUpdate = (status: AVPlaybackStatus) => {
    if (!pendingFullscreenRef.current) return;
    if (status.isLoaded && status.isPlaying) {
      pendingFullscreenRef.current = false;
      videoRef.current?.presentFullscreenPlayer().catch(() => {
        // Fullscreen refusé (jeton de geste expiré) — l'inline avec
        // contrôles fait le travail.
      });
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={webPlaying}
      style={[styles.container, style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Video
        ref={(r) => {
          videoRef.current = r;
        }}
        source={{ uri: sourceUri }}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        isLooping={false}
        shouldPlay={false}
        useNativeControls={isWeb && webPlaying}
        positionMillis={isWeb ? undefined : 1000}
        onPlaybackStatusUpdate={handleStatusUpdate}
      />
      {poster && !webPlaying && (
        <Image
          source={poster}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      )}
      {!webPlaying && (
        <View style={styles.playOverlay} pointerEvents="none">
          <View style={styles.playCircle}>
            <Play size={28} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radiusV1.xl,
    overflow: 'hidden',
    backgroundColor: '#000',
    width: '100%',
    aspectRatio: 16 / 9,
    alignSelf: 'center',
    position: 'relative',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  playCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
  },
});

/**
 * VideoPreview — preview vidéo 16:9 + lecture, compatible natif et web.
 *
 * Extrait du pattern dupliqué dans WelcomeVideoScreen / JourCharniereScreen /
 * S01Screen / S02Screen / PillarOverviewScreen / TierReachedModal.
 *
 * Natif : tap → lecteur fullscreen (`presentFullscreenPlayer`) puis lecture.
 * Web : `presentFullscreenPlayer` n'existe pas (throw) — tap → lecture inline
 * avec les contrôles natifs du navigateur. La preview repose sur le fragment
 * média `#t=1` (peint la frame à 1s, y compris iOS Safari) ; `positionMillis`
 * est ignoré côté web. Un poster optionnel peut remplacer la frame auto.
 *
 * Chaque écran appelant passe SA vidéo (`uri`) et, si fourni, SON poster.
 */

import React, { useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Play } from 'lucide-react-native';
import { radiusV1 } from '../../theme';

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

  const sourceUri = isWeb ? `${uri}#t=1` : uri;

  const handlePress = async () => {
    if (isWeb) {
      try {
        await videoRef.current?.setStatusAsync({ shouldPlay: true });
        setWebPlaying(true);
      } catch (e) {
        console.warn('VideoPreview — lecture web échouée', e);
      }
      return;
    }
    // Fullscreen et lecture séparés : un échec fullscreen ne bloque pas la lecture.
    try {
      await videoRef.current?.presentFullscreenPlayer();
    } catch (e) {
      console.warn('VideoPreview — fullscreen indisponible', e);
    }
    try {
      await videoRef.current?.playAsync();
    } catch (e) {
      console.warn('VideoPreview — lecture échouée', e);
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
        posterSource={posterUri ? { uri: posterUri } : undefined}
        usePoster={!!posterUri && !webPlaying}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        isLooping={false}
        shouldPlay={false}
        useNativeControls={isWeb && webPlaying}
        positionMillis={isWeb ? undefined : 1000}
      />
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

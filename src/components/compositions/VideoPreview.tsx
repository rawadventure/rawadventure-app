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

import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Video, ResizeMode, type AVPlaybackStatus } from 'expo-av';
import { Play, RefreshCw } from 'lucide-react-native';
import { getInterFamily, radiusV1 } from '../../theme';
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

// Réseau coupé / URL en panne : sans plafond, le tap play reste un carré
// noir muet indéfiniment. Au-delà de ce délai sans démarrage de lecture,
// on bascule sur l'état d'erreur (audit M4).
const START_TIMEOUT_MS = 12000;

export function VideoPreview({
  uri,
  posterUri,
  accessibilityLabel,
  style,
}: VideoPreviewProps) {
  const videoRef = useRef<Video | null>(null);
  const [webPlaying, setWebPlaying] = useState(false);
  // Audit M4 — cycle de vie visible : spinner entre le tap et le démarrage
  // réel, état d'erreur explicite (réseau coupé, URL Supabase en panne),
  // re-tentative par remount du <Video> (retryKey). Les boutons « Continuer »
  // des écrans parents ne dépendent jamais de cet état.
  const [starting, setStarting] = useState(false);
  const [errored, setErrored] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const startTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Fullscreen raté au tap (métadonnées pas prêtes) → re-tenter dès que la
  // lecture démarre. Une seule re-tentative.
  const pendingFullscreenRef = useRef(false);

  const clearStartTimeout = () => {
    if (startTimeoutRef.current) {
      clearTimeout(startTimeoutRef.current);
      startTimeoutRef.current = null;
    }
  };
  useEffect(() => clearStartTimeout, []);

  const markError = (e: unknown) => {
    console.warn('VideoPreview — vidéo indisponible', e);
    clearStartTimeout();
    pendingFullscreenRef.current = false;
    // Referme le lecteur plein écran natif s'il s'est ouvert : figé sur un
    // écran noir en cas de panne réseau, il masquerait l'overlay d'erreur
    // (constat test iPhone 7 juillet).
    videoRef.current?.dismissFullscreenPlayer().catch(() => {});
    setStarting(false);
    setWebPlaying(false);
    setErrored(true);
  };

  const sourceUri = isWeb ? `${uri}#t=1` : uri;

  // Poster : prop explicite > registre embarqué (frame extraite de la vidéo).
  // Affiché tant que la lecture web n'a pas démarré — iOS Safari ne peint
  // jamais la frame d'une vidéo en pause, le poster est la preview fiable.
  const poster = posterUri ? { uri: posterUri } : getVideoPoster(uri);

  const handlePress = async () => {
    if (errored) {
      // Re-tentative : remount du <Video> (nouvelle source propre), retour à
      // l'état preview — l'utilisateur relance la lecture d'un tap.
      setErrored(false);
      setRetryKey((k) => k + 1);
      return;
    }
    setStarting(true);
    startTimeoutRef.current = setTimeout(
      () => markError(`pas de lecture après ${START_TIMEOUT_MS} ms`),
      START_TIMEOUT_MS,
    );
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
      markError(e);
      return;
    }
    if (isWeb) {
      // Masque poster + overlay ; contrôles natifs en filet si le fullscreen
      // reste indisponible.
      setWebPlaying(true);
    }
  };

  const handleStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      // `error` n'est renseigné que sur vraie erreur de chargement — un
      // status non chargé sans erreur est l'état normal pré-lecture.
      if (status.error) markError(status.error);
      return;
    }
    if (!status.isPlaying) return;
    // Lecture démarrée — le plafond de démarrage ne s'applique plus.
    clearStartTimeout();
    setStarting(false);
    if (pendingFullscreenRef.current) {
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
      accessibilityLabel={errored ? 'Vidéo indisponible, réessayer' : accessibilityLabel}
    >
      <Video
        key={retryKey}
        ref={(r) => {
          videoRef.current = r;
        }}
        source={{ uri: sourceUri }}
        // Web : élément <video> invisible tant que la lecture n'a pas démarré.
        // Certains iOS Safari peignent la frame 0 brute (cadrage caméra raté)
        // d'une vidéo en pause — constat testeuse 8 juillet 2026 : si le
        // poster manque ou tarde, cette frame moche transperce. Caché, le
        // fallback est le fond noir + play, jamais une frame subie.
        style={[StyleSheet.absoluteFill, isWeb && !webPlaying && { opacity: 0 }]}
        resizeMode={ResizeMode.COVER}
        isLooping={false}
        shouldPlay={false}
        useNativeControls={isWeb && webPlaying}
        positionMillis={isWeb ? undefined : 1000}
        onPlaybackStatusUpdate={handleStatusUpdate}
        onError={(e) => markError(e)}
      />
      {poster && !webPlaying && (
        <Image
          source={poster}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      )}
      {errored ? (
        <View style={styles.playOverlay} pointerEvents="none">
          <View style={styles.errorBox}>
            <RefreshCw size={22} color="#FFFFFF" />
            <Text style={styles.errorTitle}>Vidéo indisponible</Text>
            <Text style={styles.errorHint}>
              Vérifie ta connexion, puis touche pour réessayer.
            </Text>
          </View>
        </View>
      ) : (
        !webPlaying && (
          <View style={styles.playOverlay} pointerEvents="none">
            <View style={styles.playCircle}>
              {starting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Play size={28} color="#FFFFFF" fill="#FFFFFF" />
              )}
            </View>
          </View>
        )
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
  errorBox: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontFamily: getInterFamily('600'),
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  errorHint: {
    fontFamily: getInterFamily('400'),
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
  },
});

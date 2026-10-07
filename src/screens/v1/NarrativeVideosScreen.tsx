/**
 * NarrativeVideosScreen — IA-70 sous-écran « Revoir les vidéos ».
 *
 * Retour testeuse beta (7 octobre 2026) : interrompue pendant la vidéo de la
 * charnière J7, impossible d'en réécouter la fin — l'écran narratif ne se
 * joue qu'une fois. Décision Stéphane : liste simple des vidéos narratives
 * déjà débloquées par le parcours (bienvenue, charnières J7/J14, S0.1, S0.2,
 * intros de pilier), vignette + titre + lecteur, sans rejouer l'écran
 * narratif complet. Même logique que la galerie des paliers (IA-51) : rien
 * n'apparaît avant d'être débloqué. Aucune écriture d'état.
 *
 * Déblocage : `listReplayableVideos` (src/lib/narrativeReplay.ts).
 * Copy : slots `copy.IA-70.revoir-videos.*` (global-copy).
 *
 * Référence IA : IA-70. Pattern : F (galerie).
 */

import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { useProgress } from '../../hooks/ProgressContext';
import { VideoPreview } from '../../components/compositions/VideoPreview';
import { listReplayableVideos } from '../../lib/narrativeReplay';
import {
  narrativeVideoTitle,
  narrativeVideosEmptyText,
  narrativeVideosEntryLabel,
} from '../../data/global-copy';
import { brandColors, interTextStyle, space } from '../../theme';

export default function NarrativeVideosScreen() {
  const navigation = useNavigation();
  const { narrativeFlags, currentPhase, currentPillarId } = useProgress();

  const videos = listReplayableVideos({ narrativeFlags, currentPhase, currentPillarId });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
          }}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Retour"
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
        >
          <ChevronLeft size={26} color={brandColors.deep} />
        </Pressable>
        <Text style={styles.marker}>PARCOURS · VIDÉOS</Text>
        <Text style={styles.title}>{narrativeVideosEntryLabel()}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {videos.length === 0 ? (
          <Text style={styles.empty}>{narrativeVideosEmptyText()}</Text>
        ) : (
          videos.map((video) => {
            const title = narrativeVideoTitle(video.id);
            return (
              <View key={video.id} style={styles.item}>
                <Text style={styles.itemTitle}>{title}</Text>
                {/* Vignette carrée : posters extraits en 720×720 (video-posters). */}
                <VideoPreview
                  uri={video.url}
                  accessibilityLabel={`Lire la vidéo ${title}`}
                  style={styles.video}
                />
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: brandColors.cream },
  header: {
    paddingHorizontal: space[5],
    paddingTop: space[2],
    paddingBottom: space[4],
    gap: space[1],
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: space[1],
  },
  marker: {
    ...interTextStyle('caption'),
    color: brandColors.deep,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    opacity: 0.7,
  },
  title: {
    ...interTextStyle('h1'),
    color: brandColors.deep,
  },
  scroll: {
    paddingHorizontal: space[5],
    paddingBottom: space[8],
    gap: space[5],
  },
  item: {
    gap: space[2],
  },
  itemTitle: {
    ...interTextStyle('h3'),
    color: brandColors.deep,
  },
  video: {
    aspectRatio: 1,
  },
  empty: {
    ...interTextStyle('body'),
    color: brandColors.deep,
    opacity: 0.7,
  },
});

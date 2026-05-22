/**
 * ConsolidationHomeScreen — IA-11 variante post_s8 (mode consolidation libre).
 *
 * Réf IA V3 §IA-11 lignes 204/380 + D13 + D9.
 *
 * Variante de l'Accueil affichée quand `currentPhase === 'post_s8'`. Pas de
 * pilier imposé, pas de checklist Phase 0, pas de session Phase 1. Affiche :
 *  - en-tête célébration + streak vivant
 *  - grille des 8 piliers en mode lecture — chaque tap renvoie vers l'onglet
 *    Toile (IA-25/IA-26) où la fiche est déjà accessible
 *  - bandeau mentorat permanent (D9 proposition active)
 *
 * V1 minimal : pas de "lance une session" depuis ici — le mode libre des
 * sessions sera Sprint 19+ (refonte SessionScreen pour pillarId paramétré).
 *
 * Référence IA : IA-11 variante post_s8. Pattern : B variante.
 */

import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import { Button } from '../../components/primitives';
import { PillarHeader } from '../../components/compositions';
import { useProgress } from '../../hooks/ProgressContext';
import { getPillarMeta } from '../../data/pillar-registry';
import {
  brandColors,
  interTextStyle,
  pillarColors,
  radiusV1,
  space,
} from '../../theme';

const PILLAR_IDS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'] as const;

export default function ConsolidationHomeScreen() {
  const { streak } = useProgress();

  const openPillarHint = (pillarId: string, name: string) => {
    Alert.alert(
      `Pilier ${pillarId} — ${name}`,
      "Accède à la fiche complète et au diagnostic via l'onglet Toile. Une refonte session libre arrive bientôt. [copy à valider]",
      [{ text: 'OK' }],
    );
  };

  const openMentoratHint = () => {
    Alert.alert(
      'Mentorat',
      "L'espace mentorat sera ouvert dans une prochaine version. En attendant, contacte Mimi & Jacky par les canaux habituels. [copy à valider]",
      [{ text: 'OK' }],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: space[8] }}>
        <PillarHeader
          context="neutral"
          marker="Raw Adventure · Consolidation"
          title="Mode libre"
          streakDays={streak}
        />
        <View style={styles.body}>
          <Text style={styles.intro}>
            Tu as bouclé les 8 piliers. Plus de programme imposé — tu choisis
            ce que tu pratiques et à quel rythme. [copy à valider]
          </Text>

          <View style={styles.pillarsCard}>
            <Text style={styles.cardTitle}>Tes 8 piliers</Text>
            <Text style={styles.cardHint}>
              La Toile (onglet dédié) donne accès à chaque fiche détaillée.
            </Text>
            <View style={styles.grid}>
              {PILLAR_IDS.map((pid) => {
                const meta = getPillarMeta(pid);
                const slot = pid.toLowerCase() as keyof typeof pillarColors;
                const palette = pillarColors[slot] ?? pillarColors.s1;
                return (
                  <Pressable
                    key={pid}
                    onPress={() => openPillarHint(pid, meta?.name ?? '—')}
                    style={({ pressed }) => [
                      styles.tile,
                      { backgroundColor: palette.bg, borderColor: palette.headerBg },
                      pressed && { opacity: 0.75 },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Ouvrir pilier ${pid} ${meta?.name ?? ''}`}
                  >
                    <Text style={[styles.tileId, { color: palette.text }]}>{pid}</Text>
                    <Text style={[styles.tileName, { color: palette.text }]} numberOfLines={2}>
                      {meta?.name ?? '—'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.mentoratBlock}>
            <View style={styles.mentoratHead}>
              <View style={styles.mentoratIcon}>
                <Heart size={20} color={brandColors.deep} strokeWidth={2} />
              </View>
              <Text style={styles.mentoratTitle}>Mentorat</Text>
            </View>
            <Text style={styles.mentoratBody}>
              Si tu veux un accompagnement personnalisé avec Mimi & Jacky, la
              porte est ouverte. [copy à valider]
            </Text>
            <Button
              label="Découvrir le mentorat"
              variant="secondary"
              onPress={openMentoratHint}
              fullWidth
              size="standard"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: brandColors.cream },
  body: { padding: space[5], gap: space[5] },
  intro: {
    ...interTextStyle('bodyLarge'),
    color: brandColors.deep,
  },
  pillarsCard: {
    backgroundColor: pillarColors.neutral.bg,
    borderRadius: radiusV1.xl,
    padding: space[5],
    gap: space[3],
    borderWidth: 1.5,
    borderColor: brandColors.deep + '22',
  },
  cardTitle: { ...interTextStyle('h2'), color: brandColors.deep },
  cardHint: { ...interTextStyle('body'), color: brandColors.deep, opacity: 0.75 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[3],
    marginTop: space[2],
  },
  tile: {
    width: '47%',
    minHeight: 84,
    borderRadius: radiusV1.lg,
    padding: space[3],
    borderWidth: 1.5,
    gap: space[1],
    justifyContent: 'center',
  },
  tileId: {
    ...interTextStyle('caption'),
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    opacity: 0.8,
  },
  tileName: { ...interTextStyle('h3') },
  mentoratBlock: {
    backgroundColor: '#FFFFFF',
    borderRadius: radiusV1.xl,
    padding: space[5],
    gap: space[2],
    borderWidth: 1.5,
    borderColor: brandColors.deep + '22',
  },
  mentoratHead: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  mentoratIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: brandColors.deep + '11',
  },
  mentoratTitle: { ...interTextStyle('h2'), color: brandColors.deep },
  mentoratBody: { ...interTextStyle('body'), color: brandColors.deep },
});

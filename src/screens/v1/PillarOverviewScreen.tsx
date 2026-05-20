/**
 * PillarOverviewScreen — IA-42 vue d'ensemble du pilier en cours.
 *
 * Réf IA V3 §IA-42.
 *
 * Affiche pendant une semaine de Phase 1 :
 *  - header pilier illustré contexte courant + jour courant
 *  - niveau d'engagement actuel (Essentiel/Progression/Immersion + paramètre
 *    principal × 3 sessions/jour) avec bouton "Modifier"
 *  - placeholder vidéo intro pilier (Brief contenu V1 à venir)
 *  - liste des 7 jours du pilier (titre + objectif + état done/current/future)
 *    avec indicateur 0-3 sessions validées par jour
 *  - bouton "Retour à l'accueil"
 *
 * Accessible depuis Phase1HomeScreen via card secondaire "Vue d'ensemble".
 * Sortie : retour Accueil (Phase1HomeScreen) via stack pop.
 *
 * Référence IA : IA-42. Pattern : F (liste/galerie).
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft, Circle, CheckCircle2 } from 'lucide-react-native';
import { Button } from '../../components/primitives';
import { LogoRawAdventure } from '../../components/illustrations';
import {
  brandColors,
  interTextStyle,
  layout,
  neutralColors,
  pillarColors,
  radiusV1,
  space,
} from '../../theme';
import { getInterFamily } from '../../theme';
import { useAuth } from '../../hooks/AuthContext';
import { useProgress } from '../../hooks/ProgressContext';
import { supabase } from '../../lib/supabase';
import { getPillarMeta } from '../../data/pillar-registry';
import type { Phase0StackParamList } from '../../navigation/HomeStack';

type Nav = NativeStackNavigationProp<Phase0StackParamList>;
type Palette = { bg: string; text: string; headerBg: string };
type EngagementLevel = 'essentiel' | 'progression' | 'immersion';

const ENGAGEMENT_LABEL: Record<EngagementLevel, string> = {
  essentiel: 'Essentiel',
  progression: 'Progression',
  immersion: 'Immersion',
};

export default function PillarOverviewScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { currentPillarId, dayInPillarWeek } = useProgress();

  const pillarId = currentPillarId ?? 'S1';
  const meta = getPillarMeta(pillarId) ?? getPillarMeta('S1')!;
  const currentDay = dayInPillarWeek > 0 ? Math.min(dayInPillarWeek, 7) : 1;
  const pillarKey = pillarId.toLowerCase() as 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8';
  const palette = pillarColors[pillarKey] ?? pillarColors.s1;
  const styles = useMemo(() => makeStyles(palette), [palette]);

  const [engagement, setEngagement] = useState<EngagementLevel>('essentiel');
  const [sessionsByDay, setSessionsByDay] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState(true);

  // Charge engagement + comptage sessions par jour de la semaine
  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    const [{ data: ev }, { data: sessions }] = await Promise.all([
      supabase
        .from('pillar_evaluations')
        .select('engagement_level_chosen')
        .eq('user_id', user.id)
        .eq('pillar_id', pillarId)
        .eq('evaluation_type', 'initial')
        .maybeSingle(),
      supabase
        .from('pillar_sessions')
        .select('day_in_week, session_index')
        .eq('user_id', user.id)
        .eq('pillar_id', pillarId),
    ]);
    if (ev?.engagement_level_chosen) {
      setEngagement(ev.engagement_level_chosen as EngagementLevel);
    }
    if (sessions) {
      const counts = new Map<number, number>();
      for (const s of sessions as Array<{ day_in_week: number; session_index: number }>) {
        counts.set(s.day_in_week, (counts.get(s.day_in_week) ?? 0) + 1);
      }
      setSessionsByDay(counts);
    }
    setLoading(false);
  }, [user, pillarId]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  useFocusEffect(
    useCallback(() => {
      void fetchData();
    }, [fetchData]),
  );

  const durationMin = meta.durationsMin[engagement];
  const isTypeB = meta.type === 'B';

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeTop} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header pilier */}
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Retour"
              style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
            >
              <ChevronLeft size={26} color={'#FFFFFF'} />
            </Pressable>
            <LogoRawAdventure
              variant="filigrane"
              size={220}
              opacity={0.16}
              color={'#FFFFFF'}
              style={styles.headerLogo}
            />
            <Text style={styles.headerMarker}>{`Semaine ${meta.weekIndex} · Pilier ${pillarId}`}</Text>
            <Text style={styles.headerTitle}>{meta.name}</Text>
            <Text style={styles.headerSubtitle}>{`Jour ${currentDay} sur 7`}</Text>
          </View>

          <View style={styles.body}>
            {/* Niveau d'engagement actuel */}
            {!isTypeB && (
              <View style={styles.engagementCard}>
                <Text style={styles.cardLabel}>NIVEAU ACTUEL</Text>
                <View style={styles.engagementRow}>
                  <View style={styles.engagementBadge}>
                    <Text style={styles.engagementBadgeText}>{ENGAGEMENT_LABEL[engagement]}</Text>
                  </View>
                  <Text style={styles.engagementParam}>
                    {`3 ${meta.parameterLabel} de `}
                    <Text style={styles.engagementParamBold}>{durationMin} min</Text>
                    {' chacune'}
                  </Text>
                </View>
              </View>
            )}

            {/* Placeholder vidéo intro pilier (Brief contenu Session 3) */}
            <View style={styles.videoPlaceholder}>
              <LogoRawAdventure variant="filigrane" size={48} opacity={0.22} color={brandColors.deep} />
              <Text style={styles.videoText}>
                Vidéo Mimi & Jacky — intro pilier {meta.name}{'\n'}
                (Brief contenu Session 3, 60-90s)
              </Text>
            </View>

            {/* Liste 7 jours */}
            <View style={styles.programSection}>
              <Text style={styles.sectionTitle}>Programme 7 jours</Text>
              {loading && <Text style={styles.loadingText}>Chargement…</Text>}
              {!loading && meta.program.map((day) => {
                const sessionsCount = sessionsByDay.get(day.id) ?? 0;
                const isPast = day.id < currentDay;
                const isCurrent = day.id === currentDay;
                const isFuture = day.id > currentDay;
                return (
                  <View
                    key={day.id}
                    style={[
                      styles.dayRow,
                      isCurrent && styles.dayRowCurrent,
                      isFuture && styles.dayRowFuture,
                    ]}
                  >
                    <View style={styles.dayLeft}>
                      <Text style={styles.dayNumber}>{`J${day.id}`}</Text>
                      <View style={styles.dayStatusIcon}>
                        {sessionsCount >= 3 ? (
                          <CheckCircle2 size={18} color={brandColors.alive} strokeWidth={2.5} />
                        ) : sessionsCount > 0 ? (
                          <Text style={styles.dayPartial}>{sessionsCount}/3</Text>
                        ) : (
                          <Circle size={18} color={isPast ? '#B83A2E' : palette.text} strokeWidth={1.5} />
                        )}
                      </View>
                    </View>
                    <View style={styles.dayContent}>
                      <Text style={[styles.dayTitle, isFuture && { opacity: 0.6 }]}>
                        {day.title}
                      </Text>
                      <Text style={[styles.dayObjective, isFuture && { opacity: 0.5 }]} numberOfLines={2}>
                        {day.objective}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <View style={styles.footer}>
        <Button
          label="Retour à l'accueil"
          variant="secondary"
          onPress={() => navigation.goBack()}
          fullWidth
          size="large"
          context={pillarKey}
        />
      </View>
    </View>
  );
}

const HEADER_RADIUS = 28;

const makeStyles = (palette: Palette) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.bg },
    safeTop: { flex: 1, backgroundColor: palette.headerBg },
    scroll: { backgroundColor: palette.bg, paddingBottom: space[8] },
    header: {
      backgroundColor: palette.headerBg,
      paddingTop: space[3],
      paddingHorizontal: space[5],
      paddingBottom: space[6],
      borderBottomLeftRadius: HEADER_RADIUS,
      borderBottomRightRadius: HEADER_RADIUS,
      overflow: 'hidden',
    },
    backBtn: {
      width: 44,
      height: 44,
      alignItems: 'flex-start',
      justifyContent: 'center',
      marginBottom: space[2],
    },
    headerLogo: {
      position: 'absolute',
      top: -40,
      right: -60,
      opacity: 0.16,
    },
    headerMarker: {
      fontFamily: getInterFamily('500'),
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.6,
      color: '#FFFFFF',
      opacity: 0.85,
      textTransform: 'uppercase',
      marginBottom: space[2],
    },
    headerTitle: {
      fontFamily: getInterFamily('800'),
      fontSize: 32,
      lineHeight: 36,
      letterSpacing: -0.64,
      color: '#FFFFFF',
    },
    headerSubtitle: {
      fontFamily: getInterFamily('500'),
      fontSize: 14,
      lineHeight: 20,
      color: '#FFFFFF',
      opacity: 0.85,
      marginTop: space[2],
    },
    body: { padding: space[5], gap: space[4] },
    engagementCard: {
      backgroundColor: neutralColors.surfaceElevated,
      borderRadius: radiusV1.xl,
      padding: space[4],
      borderWidth: 1.5,
      borderColor: palette.headerBg,
      gap: space[2],
    },
    cardLabel: {
      ...interTextStyle('caption'),
      color: palette.text,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      opacity: 0.7,
    },
    engagementRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space[3],
      flexWrap: 'wrap',
    },
    engagementBadge: {
      backgroundColor: palette.headerBg,
      paddingHorizontal: space[3],
      paddingVertical: 6,
      borderRadius: radiusV1.pill,
    },
    engagementBadgeText: {
      fontFamily: getInterFamily('700'),
      fontSize: 14,
      color: '#FFFFFF',
    },
    engagementParam: {
      ...interTextStyle('body'),
      color: palette.text,
      flex: 1,
    },
    engagementParamBold: { fontFamily: getInterFamily('700') },
    videoPlaceholder: {
      backgroundColor: neutralColors.surfaceElevated,
      borderRadius: radiusV1.xl,
      padding: space[4],
      alignItems: 'center',
      gap: space[2],
      borderWidth: 1.5,
      borderColor: brandColors.deep + '22',
    },
    videoText: {
      ...interTextStyle('bodySmall'),
      color: brandColors.deep,
      textAlign: 'center',
      opacity: 0.75,
    },
    programSection: { gap: space[2] },
    sectionTitle: {
      ...interTextStyle('h3'),
      color: palette.text,
      marginBottom: space[1],
    },
    loadingText: {
      ...interTextStyle('body'),
      color: palette.text,
      opacity: 0.6,
      textAlign: 'center',
      paddingVertical: space[4],
    },
    dayRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space[3],
      backgroundColor: neutralColors.surfaceElevated,
      borderRadius: radiusV1.lg,
      padding: space[3],
      borderWidth: 1,
      borderColor: neutralColors.borderSubtle,
    },
    dayRowCurrent: {
      borderWidth: 2,
      borderColor: palette.headerBg,
    },
    dayRowFuture: {
      opacity: 0.65,
    },
    dayLeft: {
      alignItems: 'center',
      gap: space[1],
      minWidth: 36,
    },
    dayNumber: {
      fontFamily: getInterFamily('700'),
      fontSize: 13,
      color: palette.text,
    },
    dayStatusIcon: {
      width: 22,
      height: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayPartial: {
      fontFamily: getInterFamily('600'),
      fontSize: 10,
      color: brandColors.alive,
    },
    dayContent: { flex: 1 },
    dayTitle: {
      fontFamily: getInterFamily('600'),
      fontSize: 15,
      lineHeight: 20,
      color: palette.text,
    },
    dayObjective: {
      fontFamily: getInterFamily('400'),
      fontSize: 13,
      lineHeight: 18,
      color: palette.text,
      opacity: 0.75,
      marginTop: 2,
    },
    footer: { padding: space[5] },
  });

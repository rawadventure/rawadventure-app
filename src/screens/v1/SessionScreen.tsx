/**
 * SessionScreen — IA-43 écran de session de pratique Phase 1.
 *
 * Réf IA V3 §IA-43 + Feature Spec S1 V1.0 §4.1 et §3.3.
 *
 * Affiche :
 *  - titre du jour S1 (Feature Spec §4.3) + objectif + courte pédagogie
 *  - timer de session paramétré par engagement_level_chosen (5/10/20 min)
 *  - rythme respiratoire visualisé : cercle qui grossit pendant l'inspiration
 *    et rétrécit pendant l'expiration, 6 cycles/min (5s/5s, RESPI_CYCLE)
 *  - bouton "Marquer comme faite" (mode manuel hors timer)
 *  - bouton "Quitter la session" en mode actif (haut gauche)
 *
 * À la fin du timer ou tap "Marquer comme faite" : appel `savePillarSession`
 * + alerte de fin de session + retour à l'accueil Phase 1.
 *
 * **Cohérence cardiaque invariante** : le rythme respiratoire ne change PAS
 * d'un jour à l'autre — seule la durée totale module avec le niveau
 * d'engagement. La consigne du jour (titre / pédagogie) est une focale
 * d'attention sur la pratique, pas une technique alternative
 * (Feature Spec S1 §4.3 note).
 *
 * Référence IA : IA-43 (S1). Pattern : C adapté Phase 1.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Button } from '../../components/primitives';
import {
  interTextStyle,
  layout,
  pillarColors,
  space,
} from '../../theme';
import { getInterFamily } from '../../theme';
import { useProgress } from '../../hooks/ProgressContext';
import {
  RESPI_CYCLE,
  SESSION_INDEX_LABEL,
  type SessionIndex,
} from '../../data/s1-program';
import { getPillarMeta } from '../../data/pillar-registry';
import { todayLocalDate } from '../../lib/calendar';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Phase0StackParamList } from '../../navigation/HomeStack';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/AuthContext';

type Route = NativeStackScreenProps<Phase0StackParamList, 'Session'>['route'];
type Nav = NativeStackNavigationProp<Phase0StackParamList>;

type EngagementLevel = 'essentiel' | 'progression' | 'immersion';

export default function SessionScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const sessionIndex = route.params.sessionIndex as SessionIndex;

  const { user } = useAuth();
  const { currentPillarId, dayInPillarWeek, savePillarSession } = useProgress();
  const pillarId = currentPillarId ?? 'S1';
  const meta = getPillarMeta(pillarId) ?? getPillarMeta('S1')!;
  const dayId = dayInPillarWeek > 0 ? dayInPillarWeek : 1;
  const day = meta.program.find((d) => d.id === dayId);
  const pillarKey = pillarId.toLowerCase() as 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8';
  const palette = pillarColors[pillarKey] ?? pillarColors.s1;
  const styles = React.useMemo(() => makeStyles(palette), [palette]);

  const [engagement, setEngagement] = useState<EngagementLevel>('essentiel');
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [saving, setSaving] = useState(false);

  const durationMin = meta.durationsMin[engagement];
  const totalSeconds = durationMin * 60;

  // Charge le niveau d'engagement choisi depuis pillar_evaluations.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('pillar_evaluations')
        .select('engagement_level_chosen')
        .eq('user_id', user.id)
        .eq('pillar_id', pillarId)
        .eq('evaluation_type', 'initial')
        .maybeSingle();
      if (cancelled) return;
      if (data?.engagement_level_chosen) {
        setEngagement(data.engagement_level_chosen as EngagementLevel);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, pillarId]);

  // ── Timer de session ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          // Timer terminé → validation auto.
          void handleComplete(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // ── Animation cercle respiratoire (cohérence cardiaque 6 cycles/min) ─────
  const scale = useSharedValue(1);

  useEffect(() => {
    if (active) {
      // Cycle : 5s inspire (scale 0.6 → 1.0) puis 5s expire (scale 1.0 → 0.6)
      scale.value = 0.6;
      scale.value = withRepeat(
        withSequence(
          withTiming(1.0, {
            duration: RESPI_CYCLE.inhaleSeconds * 1000,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(0.6, {
            duration: RESPI_CYCLE.exhaleSeconds * 1000,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        -1, // infini
        false,
      );
    } else {
      cancelAnimation(scale);
      scale.value = withTiming(0.6, { duration: 300 });
    }
    return () => {
      cancelAnimation(scale);
    };
  }, [active, scale]);

  const breathStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // ── Phase texte (Inspire / Expire) synchro avec scale ─────────────────────
  const [phaseLabel, setPhaseLabel] = useState<'Inspire' | 'Expire' | 'Prêt'>('Prêt');
  useEffect(() => {
    if (!active) {
      setPhaseLabel('Prêt');
      return;
    }
    setPhaseLabel('Inspire');
    const id = setInterval(() => {
      setPhaseLabel((prev) => (prev === 'Inspire' ? 'Expire' : 'Inspire'));
    }, RESPI_CYCLE.inhaleSeconds * 1000);
    return () => clearInterval(id);
  }, [active]);

  const handleStart = () => {
    setSecondsLeft(totalSeconds);
    setActive(true);
  };

  const handleComplete = async (auto: boolean) => {
    setActive(false);
    if (saving) return;
    setSaving(true);
    const durationSec = auto ? totalSeconds : totalSeconds - secondsLeft;
    try {
      await savePillarSession({
        pillarId,
        dayInWeek: dayId,
        sessionIndex,
        localDate: todayLocalDate(),
        durationSeconds: durationSec,
      });
      Alert.alert(
        'Session validée',
        'Ton système vient de recevoir un signal de calme. [copy à valider]',
        [{ text: 'OK', onPress: () => navigation.popToTop() }],
      );
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? "Impossible d'enregistrer la session.");
    } finally {
      setSaving(false);
    }
  };

  const handleQuit = () => {
    if (active) {
      Alert.alert(
        'Quitter la session ?',
        'Si tu quittes maintenant, la session ne sera pas comptée.',
        [
          { text: 'Continuer', style: 'cancel' },
          {
            text: 'Quitter',
            style: 'destructive',
            onPress: () => {
              setActive(false);
              navigation.goBack();
            },
          },
        ],
      );
    } else {
      navigation.goBack();
    }
  };

  // Minutes:secondes
  const min = Math.floor(secondsLeft / 60);
  const sec = secondsLeft % 60;
  const timerLabel = active
    ? `${min}:${sec.toString().padStart(2, '0')}`
    : `${durationMin}:00`;

  const dayTitle = day?.title ?? `Jour ${dayId}`;
  const dayObjective = day?.objective ?? '';
  const dayPedagogy = day?.pedagogy ?? '';
  const sessionLabel = SESSION_INDEX_LABEL[sessionIndex];

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.loadingText}>Chargement…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.headerBar}>
        <Pressable
          onPress={handleQuit}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Retour"
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
        >
          <ChevronLeft size={24} color={palette.text} />
        </Pressable>
        <Text style={styles.sessionLabel}>{sessionLabel}</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.body}>
        <View style={styles.head}>
          <Text style={styles.marker}>{`PILIER ${pillarId} · JOUR ${dayId} SUR 7`}</Text>
          <Text style={styles.title}>{dayTitle}</Text>
          <Text style={styles.objective}>{dayObjective}</Text>
        </View>

        <View style={styles.breathArea}>
          <Animated.View style={[styles.breathCircle, breathStyle]}>
            <Text style={styles.phaseLabel}>{phaseLabel}</Text>
          </Animated.View>
          <Text style={styles.timer}>{timerLabel}</Text>
          <Text style={styles.rythmHint}>Rythme 6 cycles/min — 5s / 5s</Text>
        </View>

        {!active && (
          <Text style={styles.pedagogy}>{dayPedagogy}</Text>
        )}

        <View style={styles.actions}>
          {!active ? (
            <>
              <Button
                label={`Lancer (${durationMin} min)`}
                onPress={handleStart}
                fullWidth
                size="large"
                context={pillarKey}
              />
              <Button
                label="Marquer comme faite"
                variant="secondary"
                onPress={() => handleComplete(false)}
                loading={saving}
                fullWidth
                context={pillarKey}
              />
            </>
          ) : (
            <Button
              label="Terminer maintenant"
              variant="secondary"
              onPress={() => handleComplete(false)}
              loading={saving}
              fullWidth
              context={pillarKey}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const CIRCLE_SIZE = 200;

type Palette = { bg: string; text: string; headerBg: string };

/** Styles paramétrés par palette pilier (Sprint 11 — multi-pilier). */
const makeStyles = (palette: Palette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: palette.bg },
    loadingText: {
      ...interTextStyle('bodyLarge'),
      color: palette.text,
      textAlign: 'center',
      marginTop: space[8],
    },
    headerBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: space[3],
      paddingVertical: space[2],
    },
    backBtn: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sessionLabel: {
      ...interTextStyle('caption'),
      color: palette.text,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      opacity: 0.85,
    },
    body: {
      flex: 1,
      paddingHorizontal: layout.screen.marginHorizontal,
      paddingBottom: space[5],
      justifyContent: 'space-between',
    },
    head: { gap: space[2] },
    marker: {
      ...interTextStyle('caption'),
      color: palette.text,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      opacity: 0.7,
    },
    title: {
      ...interTextStyle('h1'),
      color: palette.text,
    },
    objective: {
      ...interTextStyle('bodyLarge'),
      color: palette.text,
      opacity: 0.85,
    },
    breathArea: {
      alignItems: 'center',
      gap: space[3],
    },
    breathCircle: {
      width: CIRCLE_SIZE,
      height: CIRCLE_SIZE,
      borderRadius: CIRCLE_SIZE / 2,
      backgroundColor: palette.headerBg,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: palette.headerBg,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 6,
    },
    phaseLabel: {
      fontFamily: getInterFamily('700'),
      fontSize: 28,
      color: '#FFFFFF',
      letterSpacing: 0.4,
    },
    timer: {
      fontFamily: getInterFamily('800'),
      fontSize: 36,
      color: palette.text,
      fontVariant: ['tabular-nums'],
    },
    rythmHint: {
      ...interTextStyle('caption'),
      color: palette.text,
      opacity: 0.65,
    },
    pedagogy: {
      ...interTextStyle('body'),
      color: palette.text,
      opacity: 0.85,
    },
    actions: { gap: space[3] },
  });


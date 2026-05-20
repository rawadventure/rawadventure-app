/**
 * SessionScreen — IA-43 écran de session de pratique Phase 1.
 *
 * Réf IA V3 §IA-43 + Feature Spec S1 V1.0 §4.1 et §3.3 (S1 archétype).
 *
 * **Polymorphe par `meta.sessionType` (Sprint 15 D)** :
 *  - `coherence_cardiaque` (S1) : cercle respiratoire animé 6 cycles/min
 *    (5s/5s) + timer décompte 5/10/20 min. Archétype historique.
 *  - `chrono_libre` (S2 marche, S4 dehors) : timer décompte simple sans
 *    rythme respiratoire. L'utilisateur pratique librement, l'app compte.
 *  - `acte_libre` (S3 manger, S5 routine, S6 journal, S7 méditation,
 *    S8 hydratation/brossage) : pas de timer, l'utilisateur valide
 *    manuellement quand l'acte est fait. Objective + bouton "C'est fait".
 *
 * Sub-composants inline pour éviter prolifération de fichiers. Sprint 16+
 * éventuel : extraire en fichiers séparés si chacun grossit.
 *
 * Référence IA : IA-43. Pattern : C adapté Phase 1.
 */

import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, CheckCircle2 } from 'lucide-react-native';
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
type Palette = { bg: string; text: string; headerBg: string };

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
  const [saving, setSaving] = useState(false);

  const durationMin = meta.durationsMin[engagement];

  // Charge engagement_level_chosen depuis pillar_evaluations au mount.
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

  const handleComplete = async (durationSec: number) => {
    if (saving) return;
    setSaving(true);
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
        'Bien joué. Ton corps a reçu un signal de plus. [copy à valider]',
        [{ text: 'OK', onPress: () => navigation.popToTop() }],
      );
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? "Impossible d'enregistrer la session.");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => navigation.goBack();

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
          onPress={handleBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Retour"
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
        >
          <ChevronLeft size={24} color={palette.text} />
        </Pressable>
        <Text style={styles.sessionLabel}>{SESSION_INDEX_LABEL[sessionIndex]}</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.body}>
        <View style={styles.head}>
          <Text style={styles.marker}>{`PILIER ${pillarId} · JOUR ${dayId} SUR 7`}</Text>
          <Text style={styles.title}>{day?.title ?? `Jour ${dayId}`}</Text>
          <Text style={styles.objective}>{day?.objective ?? ''}</Text>
        </View>

        {/* Branche par sessionType — Sprint 15 D polymorphisme */}
        {meta.sessionType === 'coherence_cardiaque' && (
          <CoherenceCardiaqueSession
            durationMin={durationMin}
            pillarKey={pillarKey}
            palette={palette}
            pedagogy={day?.pedagogy ?? ''}
            saving={saving}
            onComplete={handleComplete}
          />
        )}
        {meta.sessionType === 'chrono_libre' && (
          <ChronoLibreSession
            durationMin={durationMin}
            pillarKey={pillarKey}
            palette={palette}
            pedagogy={day?.pedagogy ?? ''}
            saving={saving}
            onComplete={handleComplete}
          />
        )}
        {meta.sessionType === 'acte_libre' && (
          <ActeLibreSession
            pillarKey={pillarKey}
            palette={palette}
            pedagogy={day?.pedagogy ?? ''}
            saving={saving}
            onComplete={() => handleComplete(0)}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Sub-component 1 : Cohérence cardiaque (S1) ───────────────────────────────

type CoherenceProps = {
  durationMin: number;
  pillarKey: 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8';
  palette: Palette;
  pedagogy: string;
  saving: boolean;
  onComplete: (durationSec: number) => void;
};

function CoherenceCardiaqueSession({
  durationMin,
  pillarKey,
  palette,
  pedagogy,
  saving,
  onComplete,
}: CoherenceProps) {
  const styles = React.useMemo(() => makeStyles(palette), [palette]);
  const totalSeconds = durationMin * 60;
  const [active, setActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [phaseLabel, setPhaseLabel] = useState<'Inspire' | 'Expire' | 'Prêt'>('Prêt');
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          onComplete(totalSeconds);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (active) {
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
        -1,
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

  const breathStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleStart = () => {
    setSecondsLeft(totalSeconds);
    setActive(true);
  };
  const handleTerminate = () => {
    setActive(false);
    onComplete(totalSeconds - secondsLeft);
  };

  const min = Math.floor(secondsLeft / 60);
  const sec = secondsLeft % 60;
  const timerLabel = active
    ? `${min}:${sec.toString().padStart(2, '0')}`
    : `${durationMin}:00`;

  return (
    <>
      <View style={styles.breathArea}>
        <Animated.View style={[styles.breathCircle, breathStyle]}>
          <Text style={styles.phaseLabel}>{phaseLabel}</Text>
        </Animated.View>
        <Text style={styles.timer}>{timerLabel}</Text>
        <Text style={styles.rythmHint}>Rythme 6 cycles/min — 5s / 5s</Text>
      </View>

      {!active && <Text style={styles.pedagogy}>{pedagogy}</Text>}

      <View style={styles.actions}>
        {!active ? (
          <>
            <Button label={`Lancer (${durationMin} min)`} onPress={handleStart} fullWidth size="large" context={pillarKey} />
            <Button label="Marquer comme faite" variant="secondary" onPress={() => onComplete(0)} loading={saving} fullWidth context={pillarKey} />
          </>
        ) : (
          <Button label="Terminer maintenant" variant="secondary" onPress={handleTerminate} loading={saving} fullWidth context={pillarKey} />
        )}
      </View>
    </>
  );
}

// ─── Sub-component 2 : Chrono libre (S2 marche, S4 dehors) ────────────────────

function ChronoLibreSession({
  durationMin,
  pillarKey,
  palette,
  pedagogy,
  saving,
  onComplete,
}: CoherenceProps) {
  const styles = React.useMemo(() => makeStyles(palette), [palette]);
  const totalSeconds = durationMin * 60;
  const [active, setActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          onComplete(totalSeconds);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const handleStart = () => {
    setSecondsLeft(totalSeconds);
    setActive(true);
  };
  const handleTerminate = () => {
    setActive(false);
    onComplete(totalSeconds - secondsLeft);
  };

  const min = Math.floor(secondsLeft / 60);
  const sec = secondsLeft % 60;
  const timerLabel = active
    ? `${min}:${sec.toString().padStart(2, '0')}`
    : `${durationMin}:00`;

  return (
    <>
      <View style={styles.chronoArea}>
        <Text style={styles.timerBig}>{timerLabel}</Text>
        <Text style={styles.rythmHint}>{active ? 'En cours' : 'Prêt à démarrer'}</Text>
      </View>

      {!active && <Text style={styles.pedagogy}>{pedagogy}</Text>}

      <View style={styles.actions}>
        {!active ? (
          <>
            <Button label={`Lancer le chrono (${durationMin} min)`} onPress={handleStart} fullWidth size="large" context={pillarKey} />
            <Button label="Marquer comme faite" variant="secondary" onPress={() => onComplete(0)} loading={saving} fullWidth context={pillarKey} />
          </>
        ) : (
          <Button label="Terminer maintenant" variant="secondary" onPress={handleTerminate} loading={saving} fullWidth context={pillarKey} />
        )}
      </View>
    </>
  );
}

// ─── Sub-component 3 : Acte libre (S3 / S5 / S6 / S7 / S8) ────────────────────

type ActeProps = {
  pillarKey: 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8';
  palette: Palette;
  pedagogy: string;
  saving: boolean;
  onComplete: () => void;
};

function ActeLibreSession({ pillarKey, palette, pedagogy, saving, onComplete }: ActeProps) {
  const styles = React.useMemo(() => makeStyles(palette), [palette]);
  return (
    <>
      <View style={styles.acteArea}>
        <CheckCircle2 size={96} color={palette.text} strokeWidth={1.5} />
      </View>

      <Text style={styles.pedagogy}>{pedagogy}</Text>

      <View style={styles.actions}>
        <Button
          label="C'est fait"
          onPress={onComplete}
          loading={saving}
          fullWidth
          size="large"
          context={pillarKey}
        />
      </View>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CIRCLE_SIZE = 200;

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
    timerBig: {
      fontFamily: getInterFamily('800'),
      fontSize: 96,
      lineHeight: 100,
      color: palette.text,
      fontVariant: ['tabular-nums'],
    },
    rythmHint: {
      ...interTextStyle('caption'),
      color: palette.text,
      opacity: 0.65,
    },
    chronoArea: {
      alignItems: 'center',
      gap: space[3],
      paddingVertical: space[6],
    },
    acteArea: {
      alignItems: 'center',
      paddingVertical: space[7],
    },
    pedagogy: {
      ...interTextStyle('body'),
      color: palette.text,
      opacity: 0.85,
    },
    actions: { gap: space[3] },
  });

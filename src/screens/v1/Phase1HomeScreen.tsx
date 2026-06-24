/**
 * Phase1HomeScreen — IA-11 mode Phase 1 (pilier en cours).
 *
 * Réf IA V3 §IA-11 + Feature Spec S1 V1.0 §4.1 + design system V1.1 §10.2
 * (Pattern B Hub d'accueil).
 *
 * Affiche pour le jour courant du pilier en cours (S1 en Sprint 9) :
 *  - Header pilier S1 illustré bleu (context s1)
 *  - Titre + objectif du jour (S1_PROGRAM)
 *  - 3 cards session (matin / midi / soir) avec état validé / non validé
 *    et bouton "Lancer ma session"
 *  - Tap card → IA-43 SessionScreen
 *
 * Validation Phase 1 : 1 session sur 3 valide la journée (D6, Feature Spec
 * S1 §4.5). Pas de modale IA-15 ni de bouton "Valider ma journée" — la
 * validation est implicite à la première session validée.
 *
 * Référence IA : IA-11 (Phase 1 S1). Pattern : B.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CheckCircle2, Sun, Clock, Moon, ClipboardCheck } from 'lucide-react-native';
import { PillarHeader } from '../../components/compositions';
import { Button, Card } from '../../components/primitives';
import {
  brandColors,
  interTextStyle,
  neutralColors,
  pillarColors,
  radiusV1,
  space,
} from '../../theme';
import { getInterFamily } from '../../theme';
import { useAuth } from '../../hooks/AuthContext';
import { useProgress } from '../../hooks/ProgressContext';
import { supabase } from '../../lib/supabase';
import { SESSION_INDEX_LABEL, type SessionIndex } from '../../data/s1-program';
import { getPillarMeta } from '../../data/pillar-registry';
import { todayLocalDate } from '../../lib/calendar';
import type { Phase0StackParamList } from '../../navigation/HomeStack';

type Nav = NativeStackNavigationProp<Phase0StackParamList>;

const SESSION_ICONS: Record<SessionIndex, React.ComponentType<{ size?: number; color?: string }>> = {
  1: Sun,
  2: Clock,
  3: Moon,
};

export default function Phase1HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { currentPillarId, dayInPillarWeek, pillarStartedAt, streak, streakHistory, seedDevPillarDay, advanceToNextDay } = useProgress();

  // DEV gate — bouton skip jour suivant accessible uniquement en mode DEV.
  const devPanelEnabled =
    __DEV__ || process.env.EXPO_PUBLIC_ENABLE_DEV_PANEL === 'true';

  const handleDevNextDay = async () => {
    const currentPid = currentPillarId ?? 'S1';
    const day = dayInPillarWeek > 0 ? dayInPillarWeek : 1;

    // J7 + pas d'éval finale → redirect IA-46 obligatoire. Sinon shift clock.
    if (day === 7 && !hasFinalEval) {
      navigation.navigate('PillarEvaluation', {
        pillarId: currentPid,
        evaluationType: 'final',
      });
      return;
    }

    // T2.3 (2026-06-19) — clock virtuel +1j. Les useEffects de Phase1HomeScreen
    // re-évaluent isDayAfterJ7, dayInPillarWeek, hasFinalEval via re-fetch
    // naturellement. Pas de mutation streakHistory directe.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { advanceDevClock } = require('../../lib/devClock');
    advanceDevClock(1);

    // Reset local state pour cohérence UI immédiate.
    setValidatedSessions(new Set());
    setHasFinalEval(false);
    void fetchTodaySessions();
  };
  const pillarId = currentPillarId ?? 'S1';
  const dayId = dayInPillarWeek > 0 ? dayInPillarWeek : 1;
  const meta = getPillarMeta(pillarId) ?? getPillarMeta('S1')!;
  const day = meta.program.find((d) => d.id === dayId);
  const pillarKey = pillarId.toLowerCase() as 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8';
  const palette = pillarColors[pillarKey] ?? pillarColors.s1;
  const styles = React.useMemo(() => makeStyles(palette), [palette]);

  const [validatedSessions, setValidatedSessions] = useState<Set<SessionIndex>>(new Set());
  const [hasFinalEval, setHasFinalEval] = useState(false);
  const [hasInitialEval, setHasInitialEval] = useState<boolean | null>(null);

  const fetchTodaySessions = useCallback(async () => {
    if (!user) return;
    const today = todayLocalDate();
    const [{ data: sessions }, { data: finalEval }, { data: initialEval }] = await Promise.all([
      supabase
        .from('pillar_sessions')
        .select('session_index')
        .eq('user_id', user.id)
        .eq('pillar_id', pillarId)
        .eq('local_date', today),
      supabase
        .from('pillar_evaluations')
        .select('id')
        .eq('user_id', user.id)
        .eq('pillar_id', pillarId)
        .eq('evaluation_type', 'final')
        .maybeSingle(),
      supabase
        .from('pillar_evaluations')
        .select('id')
        .eq('user_id', user.id)
        .eq('pillar_id', pillarId)
        .eq('evaluation_type', 'initial')
        .maybeSingle(),
    ]);
    // Set sessions even si data null/empty pour reset après DEV jump.
    setValidatedSessions(new Set((sessions ?? []).map((r: any) => r.session_index as SessionIndex)));
    setHasFinalEval(!!finalEval);
    setHasInitialEval(!!initialEval);
  }, [user, pillarId, pillarStartedAt]);

  // Phase A — éval initiale mandatoire à J17 (Phase 1 J1). Si user arrive
  // ici sans éval (cas normal : S0.2 modale ne déclenche plus l'éval,
  // démarrage Phase 1 force le questionnaire). Redirect direct vers IA-40,
  // pas de bypass possible. hasInitialEval=null = chargement → on attend.
  useEffect(() => {
    if (hasInitialEval === false) {
      // Nouveau flow (2026-06-18) : IA-42 PillarOverview (intro vidéo +
      // programme) AVANT IA-40 PillarEvaluation. User voit présentation
      // pilier puis enchaîne sur questionnaire 12 questions.
      navigation.navigate('PillarOverview', {
        pillarId,
        fromStart: true,
      });
    }
  }, [hasInitialEval, navigation, pillarId]);

  // Phase A — éval finale forcée seulement au LENDEMAIN de J7 si pas faite.
  // D38 (2026-06-17) + clarif 2026-06-18 :
  //  - J7 fresh ou en cours : éval finale visible en CTA tappable (cf.
  //    showFinalEvalCta plus bas), pas forcée. User choisit son moment.
  //  - Lendemain de J7 (>=7 entries phase_1 dans pilier ET aucune entry today)
  //    et éval pas faite → forcée par navigate. Compromise mode Z.
  const pillarStartedDate = pillarStartedAt ? (pillarStartedAt.slice(0, 10)) : null;
  const today = todayLocalDate();
  const phase1EntriesInPillar = pillarStartedDate
    ? streakHistory.filter(
        (e) =>
          e.phase === 'phase_1' &&
          e.local_date >= pillarStartedDate &&
          (e.validation_status === 'valid_above_threshold' ||
            e.validation_status === 'valid_with_joker'),
      )
    : [];
  const rawDayInPillar = phase1EntriesInPillar.length; // non cappé
  const hasEntryToday = phase1EntriesInPillar.some((e) => e.local_date === today);
  const isDayAfterJ7 = rawDayInPillar >= 7 && !hasEntryToday;
  useEffect(() => {
    if (
      isDayAfterJ7 &&
      hasInitialEval === true &&
      hasFinalEval === false
    ) {
      navigation.navigate('PillarEvaluation', {
        pillarId,
        evaluationType: 'final',
      });
    }
  }, [isDayAfterJ7, hasInitialEval, hasFinalEval, navigation, pillarId]);

  useEffect(() => {
    void fetchTodaySessions();
  }, [fetchTodaySessions]);

  // Re-fetch quand l'écran reprend le focus (après retour de IA-43).
  useFocusEffect(
    useCallback(() => {
      void fetchTodaySessions();
    }, [fetchTodaySessions]),
  );

  const allDone = validatedSessions.size === 3;
  const dayValidated = validatedSessions.size >= 1; // Phase 1 D6 : 1/3 suffit
  const isEvaluationDay = dayId >= 7;
  // CTA éval finale visible seulement à J7 ET au moins 1 session J7 validée
  // (clarif user 2026-06-18 : pas dispo "trop tôt" avant pratique du jour).
  const showFinalEvalCta = isEvaluationDay && dayValidated && !hasFinalEval;

  const openSession = (idx: SessionIndex) => {
    navigation.navigate('Session', { sessionIndex: idx });
  };

  const openFinalEvaluation = () => {
    navigation.navigate('PillarEvaluation', {
      pillarId,
      evaluationType: 'final',
    });
  };

  const openFinalRecap = () => {
    navigation.navigate('PillarFinalRecap', { pillarId });
  };

  const openOverview = () => {
    navigation.navigate('PillarOverview');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeTop} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <PillarHeader
            context={pillarKey}
            marker={`Semaine ${meta.weekIndex} · ${meta.name}`}
            title={meta.name}
            dayLabel={`Jour ${dayId} sur 7`}
            streakDays={streak}
          />

          <View style={styles.body}>
            {dayValidated && (
              <View style={styles.validatedBanner}>
                <CheckCircle2 size={24} color={brandColors.alive} strokeWidth={2.5} />
                <Text style={styles.validatedText}>
                  Journée validée ({validatedSessions.size} / 3 sessions).
                  {allDone ? ' Tu as fait les 3.' : ''}
                </Text>
              </View>
            )}

            <Text style={styles.dayTitle}>{day?.title ?? '—'}</Text>
            <Text style={styles.objective}>{day?.objective ?? ''}</Text>

            <Card title="Sessions du jour" subtitle={`${validatedSessions.size} / 3 validées`} variant="forte">
              <View style={styles.sessionList}>
                {([1, 2, 3] as SessionIndex[]).map((idx) => {
                  const Icon = SESSION_ICONS[idx];
                  const isDone = validatedSessions.has(idx);
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => openSession(idx)}
                      activeOpacity={0.7}
                      accessibilityRole="button"
                      accessibilityLabel={`${SESSION_INDEX_LABEL[idx]}, ${isDone ? 'validée' : 'à faire'}`}
                      style={styles.sessionRow}
                    >
                      <View
                        style={[
                          styles.sessionIconWrap,
                          isDone && { backgroundColor: brandColors.alive },
                        ]}
                      >
                        {isDone ? (
                          <CheckCircle2 size={20} color="#FFFFFF" strokeWidth={3} />
                        ) : (
                          <Icon size={20} color={palette.text} />
                        )}
                      </View>
                      <View style={styles.sessionText}>
                        <Text
                          style={[
                            styles.sessionLabel,
                            isDone && { textDecorationLine: 'line-through', opacity: 0.6 },
                          ]}
                        >
                          {SESSION_INDEX_LABEL[idx]}
                        </Text>
                        <Text style={styles.sessionHint}>
                          {isDone ? 'Validée' : 'Tap pour démarrer'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Card>

            {/* Card "Vue d'ensemble du pilier" — accès IA-42 */}
            <Card variant="action" title={`Pilier ${meta.name}`} subtitle="Voir le programme 7 jours, le niveau, l'intro vidéo" onPress={openOverview} context={pillarKey} />

            {!allDone && (
              <Text style={styles.pedagogy}>{day?.pedagogy}</Text>
            )}

            {showFinalEvalCta && (
              <Card
                variant="forte"
                title="Évaluation finale de la semaine"
                subtitle={`Pilier ${pillarId} — 12 questions, environ 2 minutes`}
              >
                <Text style={styles.evalIntro}>
                  Tu arrives en fin de semaine S1. Refais les mêmes 12 questions
                  qu'au début pour mesurer le différentiel sur ta toile. [copy à valider]
                </Text>
                <Button
                  label="Faire mon évaluation finale"
                  onPress={openFinalEvaluation}
                  IconLeft={ClipboardCheck}
                  fullWidth
                  size="large"
                  context={pillarKey}
                  style={{ marginTop: space[3] }}
                />
              </Card>
            )}

            {isEvaluationDay && hasFinalEval && (
              <Card
                variant="forte"
                title={`Semaine ${pillarId} terminée`}
                subtitle={`Tu as bouclé la semaine ${meta.weekIndex} de Phase 1`}
              >
                <Button
                  label="Revoir mon récap final"
                  variant="secondary"
                  onPress={openFinalRecap}
                  fullWidth
                  context={pillarKey}
                  style={{ marginTop: space[3] }}
                />
              </Card>
            )}

            <Text style={styles.hint}>
              1 session sur 3 suffit pour valider ta journée. Les 3 sessions
              renforcent davantage la pratique. [copy à valider]
            </Text>

            {/* DEV : skip jour suivant. Avance dans pilier (day+1) ou
                bascule au pilier suivant (S1→S2, etc.) à day 7. Permet
                tester progression Phase 1 sans faire toutes les sessions.
                Gated devPanelEnabled — invisible build prod. */}
            {devPanelEnabled && (
              <Button
                label="(DEV) Passer au jour suivant"
                onPress={handleDevNextDay}
                variant="ghost"
                fullWidth
                context={pillarKey}
                style={{ marginTop: space[3] }}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

type Palette = { bg: string; text: string; headerBg: string };

/** Styles paramétrés par palette pilier (Sprint 11 — multi-pilier). */
const makeStyles = (palette: Palette) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.bg },
    safeTop: { flex: 1, backgroundColor: palette.headerBg },
    scroll: { backgroundColor: palette.bg, paddingBottom: space[8] },
    body: { padding: space[5], gap: space[4] },
    validatedBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space[3],
      backgroundColor: neutralColors.surfaceElevated,
      borderRadius: radiusV1.lg,
      paddingVertical: space[3],
      paddingHorizontal: space[4],
      borderWidth: 1.5,
      borderColor: brandColors.alive,
    },
    validatedText: {
      ...interTextStyle('body'),
      color: brandColors.deep,
      flex: 1,
    },
    dayTitle: {
      ...interTextStyle('h1'),
      color: palette.text,
    },
    objective: {
      ...interTextStyle('bodyLarge'),
      color: palette.text,
      opacity: 0.85,
    },
    sessionList: { gap: space[2], marginTop: space[2] },
    sessionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space[3],
      paddingVertical: space[3],
      borderBottomWidth: 1,
      borderBottomColor: neutralColors.borderSubtle,
    },
    sessionIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 9999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.bg,
      borderWidth: 1.5,
      borderColor: palette.text,
    },
    sessionText: { flex: 1 },
    sessionLabel: {
      fontFamily: getInterFamily('600'),
      fontSize: 16,
      color: palette.text,
    },
    sessionHint: {
      fontFamily: getInterFamily('400'),
      fontSize: 13,
      color: palette.text,
      opacity: 0.65,
    },
    pedagogy: {
      ...interTextStyle('body'),
      color: palette.text,
      opacity: 0.85,
    },
    hint: {
      ...interTextStyle('caption'),
      color: palette.text,
      opacity: 0.6,
      textAlign: 'center',
      marginTop: space[3],
    },
    evalIntro: {
      ...interTextStyle('body'),
      color: palette.text,
      marginTop: space[2],
    },
  });


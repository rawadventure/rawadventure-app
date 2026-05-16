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
import {
  S1_PROGRAM,
  SESSION_INDEX_LABEL,
  getS1Day,
  type SessionIndex,
} from '../../data/s1-program';
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
  const { currentPillarId, dayInPillarWeek, streak } = useProgress();
  const pillarId = currentPillarId ?? 'S1';
  const dayId = dayInPillarWeek > 0 ? dayInPillarWeek : 1;
  const day = getS1Day(dayId);

  const [validatedSessions, setValidatedSessions] = useState<Set<SessionIndex>>(new Set());
  const [hasFinalEval, setHasFinalEval] = useState(false);

  const fetchTodaySessions = useCallback(async () => {
    if (!user) return;
    const today = todayLocalDate();
    const [{ data: sessions }, { data: finalEval }] = await Promise.all([
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
    ]);
    if (sessions) {
      setValidatedSessions(new Set(sessions.map((r: any) => r.session_index as SessionIndex)));
    }
    setHasFinalEval(!!finalEval);
  }, [user, pillarId]);

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
  const showFinalEvalCta = isEvaluationDay && !hasFinalEval;

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

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeTop} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <PillarHeader
            context="s1"
            marker={`Semaine 1 · ${pillarId === 'S1' ? 'Respiration' : pillarId}`}
            title="Respiration"
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
                          <Icon size={20} color={pillarColors.s1.text} />
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

            {!allDone && (
              <Text style={styles.pedagogy}>{day?.pedagogy}</Text>
            )}

            {showFinalEvalCta && (
              <Card
                variant="forte"
                title="Évaluation finale de la semaine"
                subtitle="12 questions — environ 2 minutes"
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
                  context="s1"
                  style={{ marginTop: space[3] }}
                />
              </Card>
            )}

            {isEvaluationDay && hasFinalEval && (
              <Card variant="forte" title="Semaine S1 terminée" subtitle="Tu as bouclé ta première semaine de Phase 1">
                <Button
                  label="Revoir mon récap final"
                  variant="secondary"
                  onPress={openFinalRecap}
                  fullWidth
                  context="s1"
                  style={{ marginTop: space[3] }}
                />
              </Card>
            )}

            <Text style={styles.hint}>
              1 session sur 3 suffit pour valider ta journée. Les 3 sessions
              renforcent davantage la pratique. [copy à valider]
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: pillarColors.s1.bg },
  safeTop: { flex: 1, backgroundColor: pillarColors.s1.headerBg },
  scroll: { backgroundColor: pillarColors.s1.bg, paddingBottom: space[8] },
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
    color: pillarColors.s1.text,
  },
  objective: {
    ...interTextStyle('bodyLarge'),
    color: pillarColors.s1.text,
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
    backgroundColor: pillarColors.s1.bg,
    borderWidth: 1.5,
    borderColor: pillarColors.s1.text,
  },
  sessionText: { flex: 1 },
  sessionLabel: {
    fontFamily: getInterFamily('600'),
    fontSize: 16,
    color: pillarColors.s1.text,
  },
  sessionHint: {
    fontFamily: getInterFamily('400'),
    fontSize: 13,
    color: pillarColors.s1.text,
    opacity: 0.65,
  },
  pedagogy: {
    ...interTextStyle('body'),
    color: pillarColors.s1.text,
    opacity: 0.85,
  },
  hint: {
    ...interTextStyle('caption'),
    color: pillarColors.s1.text,
    opacity: 0.6,
    textAlign: 'center',
    marginTop: space[3],
  },
  evalIntro: {
    ...interTextStyle('body'),
    color: pillarColors.s1.text,
    marginTop: space[2],
  },
});

// S1_PROGRAM utilisé via getS1Day(dayId) — import conservé pour cohérence.
void S1_PROGRAM;

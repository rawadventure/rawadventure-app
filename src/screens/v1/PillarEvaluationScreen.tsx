/**
 * PillarEvaluationScreen — IA-40 évaluation 12 questions initiale (ou finale).
 *
 * Réf IA V3 §IA-40 + Feature Spec S1 V1.0 §2 + design system V1.1 Pattern D
 * (écran de saisie / évaluation).
 *
 * Format invariant pour les 8 piliers V1 :
 *  - 12 questions, une par écran, échelle 1-5 via composant Scale15
 *  - Indicateur progression 12 segments (§5.5)
 *  - Bouton "Continuer" (ou "Question suivante") qui n'apparaît qu'après
 *    sélection d'une valeur
 *  - Bouton "Précédente" optionnel (en ghost) sauf sur la première
 *  - Tab bar masquée pendant l'évaluation (couche fullscreen overlay)
 *
 * Inversion sémantique Q6/Q7/Q8 S1 : transparent pour l'utilisateur (il
 * répond toujours 1-5 selon la formulation lue), le calcul l'applique au
 * moment d'agréger (cf. `src/lib/metrics.ts`).
 *
 * V1 Sprint 8 ne couvre que la **variante S1 initiale**. Les variantes
 * finales (IA-46) et les piliers S2-S8 seront ajoutés Sprint 9+ avec leurs
 * propres fichiers de questions (`src/data/s{N}-evaluation.ts`).
 *
 * Référence IA : IA-40 (S1). Pattern : D.
 */

import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Scale15 } from '../../components/primitives';
import type { Scale15Value } from '../../components/primitives';
import {
  brandColors,
  interTextStyle,
  layout,
  neutralColors,
  pillarColors,
  radiusV1,
  space,
} from '../../theme';
import { getPillarMeta } from '../../data/pillar-registry';
import { aggregateEvaluation, type RawResponse } from '../../lib/metrics';
import { useProgress } from '../../hooks/ProgressContext';
import type { Phase0StackParamList } from '../../navigation/HomeStack';

type Route = NativeStackScreenProps<Phase0StackParamList, 'PillarEvaluation'>['route'];
type Nav = NativeStackNavigationProp<Phase0StackParamList>;

const TOTAL_QUESTIONS = 12;

export default function PillarEvaluationScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const pillarId = route.params.pillarId; // 'S1' pour Sprint 8
  const evaluationType = route.params.evaluationType ?? 'initial';

  const { savePillarEvaluation, setTabBarHidden, startPillarWeek, pillarStartedAt, currentPillarId } = useProgress();

  // Clé AsyncStorage pour sauvegarder progrès en cours (reprise si user
  // quitte app pendant questionnaire). Scopée par pilier + type éval.
  const progressKey = `pillar_eval_progress.${pillarId}.${evaluationType}`;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Scale15Value>>({});
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Cache tab bar pendant l'évaluation (mandatory — user ne peut sortir
  // qu'en complétant ou en quittant l'app). TabNavigator est custom
  // (pas @react-navigation/bottom-tabs) → on passe par un flag global
  // dans ProgressContext que TabNavigator lit pour conditionnellement
  // rendre la TabBar.
  useEffect(() => {
    setTabBarHidden(true);
    return () => setTabBarHidden(false);
  }, [setTabBarHidden]);

  // Restaure progrès sauvegardé au mount (si user a quitté app en cours).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(progressKey);
        if (!cancelled && raw) {
          const parsed = JSON.parse(raw) as {
            index: number;
            answers: Record<number, Scale15Value>;
          };
          if (typeof parsed.index === 'number') setIndex(parsed.index);
          if (parsed.answers) setAnswers(parsed.answers);
        }
      } catch {
        // pas grave, on repart de zéro
      }
      if (!cancelled) setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [progressKey]);

  // Persiste progrès à chaque changement (index ou answers) une fois hydraté.
  useEffect(() => {
    if (!hydrated) return;
    void AsyncStorage.setItem(progressKey, JSON.stringify({ index, answers }));
  }, [hydrated, index, answers, progressKey]);

  // Lookup via registry pillar (Sprint 11). Fallback S1 si pillarId inconnu.
  const meta = getPillarMeta(pillarId);
  const questions = meta?.questions ?? getPillarMeta('S1')!.questions;

  // Couleur fond match palette du pilier.
  const pillarKey = pillarId.toLowerCase() as 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8';
  const palette = pillarColors[pillarKey] ?? pillarColors.s1;
  const styles = React.useMemo(() => makeStyles(palette.bg), [palette.bg]);

  const current = questions[index];
  const currentValue = answers[current.id] ?? null;
  const canContinue = currentValue != null;
  const isLast = index === TOTAL_QUESTIONS - 1;

  const handleSelect = (v: Scale15Value) => {
    setAnswers((prev) => ({ ...prev, [current.id]: v }));
  };

  const handleNext = async () => {
    if (!canContinue) return;
    if (!isLast) {
      setIndex(index + 1);
      return;
    }
    // Dernière question : agrège + persiste + navigue vers IA-41.
    setSaving(true);
    try {
      const responses: RawResponse[] = questions.map((q) => ({
        questionId: q.id,
        value: answers[q.id] as Scale15Value,
        reversed: q.reversed,
      }));
      const result = aggregateEvaluation(responses);

      await savePillarEvaluation({
        pillarId,
        evaluationType,
        responses: responses.map((r) => ({ question_id: r.questionId, value: r.value })),
        rawScore: result.rawScore,
        normalizedScore: result.normalizedScore,
        diagnosticLevel: result.diagnostic,
        engagementLevelRecommended: result.recommendedEngagement,
        engagementLevelChosen: result.recommendedEngagement, // défaut = recommandé
      });

      // Clear progrès en cours — éval persistée Supabase, plus besoin du cache.
      await AsyncStorage.removeItem(progressKey);

      // Démarrage semaine pilier au moment du save initial (avant Recap),
      // pour que si user quitte sur Recap, pillarStartedAt soit déjà posé
      // et le hub fonctionne correctement à la prochaine ouverture.
      if (evaluationType === 'initial' && (currentPillarId !== pillarId || !pillarStartedAt)) {
        await startPillarWeek(pillarId);
      }

      if (evaluationType === 'final') {
        navigation.replace('PillarFinalRecap', { pillarId });
      } else {
        navigation.replace('PillarRecap', { pillarId, evaluationType });
      }
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? "Impossible d'enregistrer l'évaluation.");
    } finally {
      setSaving(false);
    }
  };

  const handlePrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.body}>
        <View style={styles.head}>
          <ProgressIndicator current={index + 1} total={TOTAL_QUESTIONS} />
          <Text style={styles.marker}>{`PILIER ${pillarId} · ÉVALUATION ${evaluationType === 'initial' ? 'INITIALE' : 'FINALE'}`}</Text>
          <Text style={styles.counter}>{`Question ${index + 1} sur ${TOTAL_QUESTIONS}`}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.questionWrap}>
          <Text style={styles.question}>{current.text}</Text>
        </ScrollView>

        <View style={styles.scaleWrap}>
          <Scale15
            value={currentValue}
            onChange={handleSelect}
            context="s1"
            leftLabel="Jamais"
            rightLabel="Toujours"
          />
        </View>

        <View style={styles.actions}>
          <Button
            label={isLast ? 'Voir mon récap' : 'Question suivante'}
            onPress={handleNext}
            disabled={!canContinue}
            loading={saving}
            fullWidth
            size="large"
            context="s1"
          />
          {index > 0 && (
            <Button
              label="Précédente"
              variant="ghost"
              onPress={handlePrev}
              disabled={saving}
              fullWidth
              context="s1"
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

/** Indicateur de progression segmenté (12 segments) — design system §5.5. */
function ProgressIndicator({ current, total }: { current: number; total: number }) {
  return (
    <View style={progressStyles.container}>
      {Array.from({ length: total }, (_, i) => {
        const isReached = i < current;
        const isCurrent = i === current - 1;
        return (
          <View
            key={i}
            style={[
              progressStyles.seg,
              isReached && progressStyles.segReached,
              isCurrent && progressStyles.segCurrent,
            ]}
          />
        );
      })}
    </View>
  );
}

const progressStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
  },
  seg: {
    flex: 1,
    height: 4,
    borderRadius: radiusV1.sm,
    backgroundColor: neutralColors.borderSubtle,
  },
  segReached: {
    backgroundColor: brandColors.alive,
    opacity: 0.6,
  },
  segCurrent: {
    backgroundColor: brandColors.alive,
    opacity: 1,
  },
});

function makeStyles(bgColor: string) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: bgColor },
  body: {
    flex: 1,
    paddingHorizontal: layout.screen.marginHorizontal,
    paddingTop: space[3],
    paddingBottom: space[5],
    justifyContent: 'space-between',
  },
  head: { gap: space[3] },
  progressContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  progressSeg: {
    flex: 1,
    height: 4,
    borderRadius: radiusV1.sm,
    backgroundColor: neutralColors.borderSubtle,
  },
  progressSegReached: {
    backgroundColor: brandColors.alive,
    opacity: 0.6,
  },
  progressSegCurrent: {
    backgroundColor: brandColors.alive,
    opacity: 1,
  },
  marker: {
    ...interTextStyle('caption'),
    color: pillarColors.s1.text,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    opacity: 0.75,
  },
  counter: {
    ...interTextStyle('bodySmall'),
    color: pillarColors.s1.text,
    opacity: 0.65,
  },
  questionWrap: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: space[5],
  },
  question: {
    ...interTextStyle('h1'),
    color: pillarColors.s1.text,
    textAlign: 'center',
  },
  scaleWrap: {
    paddingVertical: space[4],
  },
  actions: { gap: space[3] },
  });
}

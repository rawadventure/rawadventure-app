/**
 * PillarRecapScreen — IA-41 récapitulatif évaluation initiale + intro pilier.
 *
 * Réf IA V3 §IA-41 + Feature Spec S1 V1.0 §3 + design system V1.1
 * (Pattern A écran narratif plein).
 *
 * Affiche :
 *  - le libellé narratif du diagnostic 5 niveaux (PAS le score brut)
 *  - le message d'accueil pédagogique du niveau (slot copy à valider)
 *  - le niveau d'engagement de départ recommandé (D40 — Essentiel ou
 *    Progression, jamais Immersion auto)
 *  - le paramètre principal du pilier (durée de session × 3/jour, S1 : 5/10/20)
 *  - un bouton "Modifier mon niveau" qui ouvre une modale standard avec les
 *    3 options Essentiel/Progression/Immersion
 *  - un bouton "Démarrer cette semaine" qui (Sprint 8 minimum) ferme le flow
 *    et revient à l'accueil. Sprint 9+ : passe l'app en `phase_1` avec
 *    `currentPilar = 1` et `pilarStartedAt = now()`.
 *
 * V1 Sprint 8 ne couvre que la **variante S1 initiale**. IA-46/IA-47 (final
 * + différentiel toile) viendront Sprint 10+.
 *
 * Référence IA : IA-41 (S1). Pattern : A.
 */

import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Sparkle } from 'lucide-react-native';
import { Button, Modal, LevelSelector } from '../../components/primitives';
import type { AdaptiveLevel } from '../../components/primitives';
import {
  brandColors,
  interTextStyle,
  layout,
  pillarColors,
  radiusV1,
  space,
} from '../../theme';
import { getInterFamily } from '../../theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/AuthContext';
import { useProgress } from '../../hooks/ProgressContext';
import { S1_DIAGNOSTICS } from '../../data/s1-evaluation';
import type { Phase0StackParamList } from '../../navigation/HomeStack';
import type {
  DiagnosticLevel,
  EngagementLevel,
} from '../../lib/metrics';

type Route = NativeStackScreenProps<Phase0StackParamList, 'PillarRecap'>['route'];
type Nav = NativeStackNavigationProp<Phase0StackParamList>;

/** Durées du paramètre principal S1 par niveau d'engagement (Feature Spec S1 §3.3). */
const S1_DURATIONS_MIN: Record<EngagementLevel, number> = {
  essentiel: 5,
  progression: 10,
  immersion: 20,
};

const ENGAGEMENT_LABEL: Record<EngagementLevel, string> = {
  essentiel: 'Essentiel',
  progression: 'Progression',
  immersion: 'Immersion',
};

export default function PillarRecapScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const pillarId = route.params.pillarId;
  const evaluationType = route.params.evaluationType ?? 'initial';

  const { user } = useAuth();
  const { savePillarEvaluation, markNarrativeSeen, startPillarWeek } = useProgress();

  const [loading, setLoading] = useState(true);
  const [diagnostic, setDiagnostic] = useState<DiagnosticLevel | null>(null);
  const [recommended, setRecommended] = useState<EngagementLevel>('essentiel');
  const [chosen, setChosen] = useState<EngagementLevel>('essentiel');
  const [responses, setResponses] = useState<unknown>(null);
  const [rawScore, setRawScore] = useState(0);
  const [normalizedScore, setNormalizedScore] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingLevel, setPendingLevel] = useState<AdaptiveLevel | null>(null);

  // Charge l'évaluation persistée à l'étape IA-40 précédente.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('pillar_evaluations')
        .select('*')
        .eq('user_id', user.id)
        .eq('pillar_id', pillarId)
        .eq('evaluation_type', evaluationType)
        .single();
      if (cancelled) return;
      if (error) {
        console.warn('[PillarRecap] fetch failed', error);
        setLoading(false);
        return;
      }
      if (data) {
        setDiagnostic(data.diagnostic_level as DiagnosticLevel);
        setRecommended(data.engagement_level_recommended as EngagementLevel);
        setChosen(data.engagement_level_chosen as EngagementLevel);
        setResponses(data.responses);
        setRawScore(data.raw_score);
        setNormalizedScore(Number(data.normalized_score));
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, pillarId, evaluationType]);

  const handleConfirmLevel = async () => {
    if (!pendingLevel) {
      setModalVisible(false);
      return;
    }
    const map: Record<AdaptiveLevel, EngagementLevel> = {
      less: 'essentiel',
      same: 'progression',
      more: 'immersion',
    };
    const newLevel = map[pendingLevel];
    setChosen(newLevel);
    setModalVisible(false);

    // Persiste le nouveau choix (override du recommandé).
    if (responses && diagnostic) {
      await savePillarEvaluation({
        pillarId,
        evaluationType,
        responses: responses as Array<{ question_id: number; value: 1 | 2 | 3 | 4 | 5 }>,
        rawScore,
        normalizedScore,
        diagnosticLevel: diagnostic,
        engagementLevelRecommended: recommended,
        engagementLevelChosen: newLevel,
      });
    }
  };

  const handleStart = async () => {
    // Sprint 9 : démarre la semaine du pilier — pose currentPillarId et
    // pillarStartedAt → HomeScreenV1 bascule sur Phase1HomeScreen automatiquement.
    await markNarrativeSeen('s0_2_screen');
    await startPillarWeek(pillarId);
    navigation.popToTop();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.loadingText}>Chargement…</Text>
      </SafeAreaView>
    );
  }

  if (!diagnostic) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.loadingText}>Évaluation introuvable.</Text>
        <View style={{ padding: space[5] }}>
          <Button label="Retour" variant="secondary" onPress={() => navigation.goBack()} fullWidth />
        </View>
      </SafeAreaView>
    );
  }

  const diag = S1_DIAGNOSTICS[diagnostic];
  const duration = S1_DURATIONS_MIN[chosen];
  const isRecommended = chosen === recommended;

  // Mapping AdaptiveLevel actuel pour la modale
  const adaptiveFromEngagement: Record<EngagementLevel, AdaptiveLevel> = {
    essentiel: 'less',
    progression: 'same',
    immersion: 'more',
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.markerRow}>
          <Sparkle size={16} color={pillarColors.s1.text} fill={pillarColors.s1.text} />
          <Text style={styles.marker}>Pilier S1 · Évaluation initiale</Text>
        </View>

        <Text style={styles.title}>Ta respiration{'\n'}aujourd'hui.</Text>

        {/* Diagnostic */}
        <View style={styles.diagnosticBlock}>
          <Text style={styles.diagnosticLabel}>{diag.label}</Text>
          <Text style={styles.diagnosticMessage}>{diag.message}</Text>
        </View>

        {/* Niveau d'engagement */}
        <View style={styles.engagementBlock}>
          <Text style={styles.sectionTitle}>Ton niveau pour la semaine</Text>
          <View style={styles.levelRow}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>{ENGAGEMENT_LABEL[chosen]}</Text>
            </View>
            <Text style={styles.levelStatus}>
              {isRecommended ? '— recommandé' : '— choisi'}
            </Text>
          </View>
          <Text style={styles.parametre}>
            Cette semaine, 3 sessions de cohérence cardiaque par jour, de{' '}
            <Text style={styles.parametreBold}>{duration} minutes</Text> chacune.
          </Text>
          <Button
            label="Modifier mon niveau"
            variant="ghost"
            onPress={() => {
              setPendingLevel(adaptiveFromEngagement[chosen]);
              setModalVisible(true);
            }}
            context="s1"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Démarrer cette semaine"
          onPress={handleStart}
          fullWidth
          size="large"
          context="s1"
        />
      </View>

      {/* Modale modification niveau */}
      <Modal visible={modalVisible} onClose={() => setModalVisible(false)} variant="standard">
        <Text style={styles.modalTitle}>Ton niveau d'engagement</Text>
        <Text style={styles.modalBody}>
          Choisis l'intensité que tu veux donner à cette semaine. Tu peux ajuster plus tard.
        </Text>
        <View style={styles.modalLevels}>
          <LevelSelector
            value={pendingLevel}
            onChange={setPendingLevel}
            context="s1"
          />
        </View>
        <View style={styles.modalDurations}>
          <DurationRow label="Moins (Essentiel)" duration={S1_DURATIONS_MIN.essentiel} />
          <DurationRow label="Pareil (Progression)" duration={S1_DURATIONS_MIN.progression} />
          <DurationRow label="Plus (Immersion)" duration={S1_DURATIONS_MIN.immersion} />
        </View>
        <View style={styles.modalActions}>
          <Button label="Annuler" variant="secondary" onPress={() => setModalVisible(false)} fullWidth />
          <Button label="Valider mon niveau" onPress={handleConfirmLevel} fullWidth />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function DurationRow({ label, duration }: { label: string; duration: number }) {
  return (
    <View style={styles.durationRow}>
      <Text style={styles.durationLabel}>{label}</Text>
      <Text style={styles.durationValue}>{duration} min</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: pillarColors.s1.bg },
  loadingText: {
    ...interTextStyle('bodyLarge'),
    color: pillarColors.s1.text,
    textAlign: 'center',
    marginTop: space[8],
  },
  scroll: {
    padding: layout.screen.marginHorizontal,
    paddingTop: space[5],
    gap: space[5],
  },
  markerRow: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  marker: {
    ...interTextStyle('caption'),
    color: pillarColors.s1.text,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    opacity: 0.85,
  },
  title: {
    ...interTextStyle('display'),
    color: pillarColors.s1.text,
  },
  diagnosticBlock: {
    backgroundColor: '#FFFFFF',
    borderRadius: radiusV1.xl,
    padding: space[5],
    gap: space[2],
    borderWidth: 1.5,
    borderColor: pillarColors.s1.headerBg,
  },
  diagnosticLabel: {
    fontFamily: getInterFamily('800'),
    fontSize: 28,
    lineHeight: 32,
    color: pillarColors.s1.text,
  },
  diagnosticMessage: {
    ...interTextStyle('bodyLarge'),
    color: pillarColors.s1.text,
  },
  engagementBlock: { gap: space[3] },
  sectionTitle: {
    ...interTextStyle('h3'),
    color: pillarColors.s1.text,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  levelBadge: {
    backgroundColor: pillarColors.s1.headerBg,
    paddingHorizontal: space[3],
    paddingVertical: 6,
    borderRadius: radiusV1.pill,
  },
  levelBadgeText: {
    fontFamily: getInterFamily('700'),
    fontSize: 14,
    color: '#FFFFFF',
  },
  levelStatus: {
    ...interTextStyle('bodySmall'),
    color: pillarColors.s1.text,
    opacity: 0.7,
  },
  parametre: {
    ...interTextStyle('bodyLarge'),
    color: pillarColors.s1.text,
  },
  parametreBold: { fontFamily: getInterFamily('700') },
  footer: {
    padding: layout.screen.marginHorizontal,
  },
  modalTitle: {
    ...interTextStyle('h2'),
    color: brandColors.deep,
    marginBottom: space[2],
  },
  modalBody: {
    ...interTextStyle('body'),
    color: brandColors.deep,
    opacity: 0.75,
    marginBottom: space[4],
  },
  modalLevels: { marginBottom: space[4] },
  modalDurations: { gap: space[2], marginBottom: space[5] },
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationLabel: {
    ...interTextStyle('bodySmall'),
    color: brandColors.deep,
    opacity: 0.7,
  },
  durationValue: {
    fontFamily: getInterFamily('700'),
    fontSize: 13,
    color: brandColors.deep,
  },
  modalActions: { gap: space[2] },
});

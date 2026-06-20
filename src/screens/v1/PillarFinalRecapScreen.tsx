/**
 * PillarFinalRecapScreen — IA-47 récapitulatif évaluation finale + différentiel.
 *
 * Réf IA V3 §IA-47 + Feature Spec S1 V1.0 §6 + Métriques V1.5 §2.6/§2.7.
 *
 * Affiche en fin de semaine pilier :
 *  - libellé narratif du nouveau diagnostic 5 niveaux
 *  - différentiel score initial → final (en points sur 0-100)
 *  - message pédagogique selon le sens du différentiel (progrès / stable / recul)
 *  - mini-Toile avec branche du pilier mise à jour (état après vs avant)
 *  - bouton "Continuer" → ferme la semaine, propose le pilier suivant
 *
 * V1 Sprint 10 simplifications acceptables :
 *  - animation de mise à jour de la branche : statique (transition Sprint 11+)
 *  - copy différentiel : placeholders selon delta, à valider Brief contenu V1
 *  - transition vers S2 : Sprint 10 = Alert "Pilier suivant à venir Sprint 11+".
 *    Sprint 11 codera la bascule effective pillarId='S2' + reset semaine.
 *
 * Référence IA : IA-47 (S1). Pattern : A.
 */

import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Sparkle, TrendingUp, Minus, TrendingDown } from 'lucide-react-native';
import { Button } from '../../components/primitives';
import { Toile, makeMockScores, type PillarScore } from '../../components/toile';
import S8ExitScreen from './S8ExitScreen';
import ConsolidationIntroScreen from './ConsolidationIntroScreen';
import MentoratProposalModal from './MentoratProposalModal';
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
import { getNextPillarId, getPillarMeta } from '../../data/pillar-registry';
import type { Phase0StackParamList } from '../../navigation/HomeStack';
import type { DiagnosticLevel } from '../../lib/metrics';

type Route = NativeStackScreenProps<Phase0StackParamList, 'PillarFinalRecap'>['route'];
type Nav = NativeStackNavigationProp<Phase0StackParamList>;

type EvalRow = {
  raw_score: number;
  normalized_score: string | number;
  diagnostic_level: number;
};

export default function PillarFinalRecapScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const pillarId = route.params.pillarId;

  const { user } = useAuth();
  const { streak, markNarrativeSeen, narrativeFlags } = useProgress();
  const [showS8Exit, setShowS8Exit] = useState(false);
  const [showConsolidationIntro, setShowConsolidationIntro] = useState(false);
  const [showMentoratProposal, setShowMentoratProposal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initial, setInitial] = useState<EvalRow | null>(null);
  const [final, setFinal] = useState<EvalRow | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('pillar_evaluations')
        .select('evaluation_type, raw_score, normalized_score, diagnostic_level')
        .eq('user_id', user.id)
        .eq('pillar_id', pillarId);
      if (cancelled) return;
      if (data) {
        const ini = data.find((r: any) => r.evaluation_type === 'initial');
        const fin = data.find((r: any) => r.evaluation_type === 'final');
        if (ini) setInitial(ini as EvalRow);
        if (fin) setFinal(fin as EvalRow);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, pillarId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.loadingText}>Chargement…</Text>
      </SafeAreaView>
    );
  }

  if (!initial || !final) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.loadingText}>Évaluation finale ou initiale introuvable.</Text>
        <View style={{ padding: space[5] }}>
          <Button label="Retour" variant="secondary" onPress={() => navigation.goBack()} fullWidth />
        </View>
      </SafeAreaView>
    );
  }

  const initialNorm = Number(initial.normalized_score);
  const finalNorm = Number(final.normalized_score);
  const delta = Math.round((finalNorm - initialNorm) * 10) / 10;
  const meta = getPillarMeta(pillarId) ?? getPillarMeta('S1')!;
  const diag = meta.diagnostics[final.diagnostic_level as DiagnosticLevel];
  const nextPillarId = getNextPillarId(pillarId);

  // Toile : on construit un état "level1 par défaut" et on remplace la branche
  // du pilier avec finalScore = finalNorm + initialScore = initialNorm pour
  // que le différentiel apparaisse sur la branche correspondante.
  const baseScores = makeMockScores('level1');
  const scoresWithUpdate: PillarScore[] = baseScores.map((s) => {
    if (s.pillarId.toUpperCase() === pillarId) {
      return {
        ...s,
        state: 'completed',
        initialScore: Math.round(initialNorm),
        finalScore: Math.round(finalNorm),
      };
    }
    return s;
  });

  const slotPillar = pillarId.toLowerCase() as 's1';

  const TrendIcon = delta > 1 ? TrendingUp : delta < -1 ? TrendingDown : Minus;
  const trendColor = delta > 1 ? brandColors.alive : delta < -1 ? '#B83A2E' : '#5A4B7A';
  const trendLabel =
    delta > 1
      ? `+${delta.toFixed(1)} points`
      : delta < -1
        ? `${delta.toFixed(1)} points`
        : 'Stable';

  const deltaMessage =
    delta > 5
      ? "Sept jours de pratique ont déplacé ton score de manière nette. Le corps a enregistré la consigne. [copy à valider]"
      : delta > 1
        ? "Tu as gagné en finesse cette semaine. Les changements sont parfois subtils mais réels. [copy à valider]"
        : delta < -1
          ? "Le score a baissé — cela arrive et n'est pas un échec. Les 12 questions captent un instantané, ton ressenti compte plus que ce chiffre. [copy à valider]"
          : "Stable cette semaine. La régularité est déjà une forme de progrès. [copy à valider]";

  const handleContinue = () => {
    if (!nextPillarId) {
      // Dernier pilier (S8) → IA-22 sortie de Phase 1.
      if (!narrativeFlags.s8_exit_screen) {
        void markNarrativeSeen('s8_exit_screen');
      }
      setShowS8Exit(true);
      return;
    }
    const nextMeta = getPillarMeta(nextPillarId);
    Alert.alert(
      `Pilier ${pillarId} terminé`,
      `Sept jours posés autour de ${getPillarMeta(pillarId)?.name ?? 'ce pilier'}. La branche est lue, la toile mise à jour.\n\nDemain, on enchaîne avec ${nextPillarId} — ${nextMeta?.name ?? '…'}. Tu commenceras par une évaluation 12 questions pour calibrer la nouvelle semaine.\n\nÀ demain.`,
      [
        {
          text: 'Continuer',
          onPress: () => navigation.popToTop(),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.markerRow}>
          <Sparkle size={16} color={pillarColors[slotPillar].text} fill={pillarColors[slotPillar].text} />
          <Text style={styles.marker}>Pilier S1 · Évaluation finale</Text>
        </View>

        <Text style={styles.title}>Sept jours.{'\n'}Voilà où tu en es.</Text>

        {/* Différentiel chiffré */}
        <View style={styles.deltaBlock}>
          <View style={[styles.deltaIcon, { backgroundColor: trendColor }]}>
            <TrendIcon size={24} color="#FFFFFF" strokeWidth={3} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.deltaLabel}>Différentiel</Text>
            <Text style={[styles.deltaValue, { color: trendColor }]}>{trendLabel}</Text>
          </View>
          <View style={styles.scoreCol}>
            <Text style={styles.scoreLabel}>Avant → Après</Text>
            <Text style={styles.scoreValue}>
              {Math.round(initialNorm)} → {Math.round(finalNorm)}
            </Text>
          </View>
        </View>

        {/* Nouveau diagnostic */}
        <View style={styles.diagnosticBlock}>
          <Text style={styles.diagnosticLabel}>{diag.label}</Text>
          <Text style={styles.diagnosticMessage}>{deltaMessage}</Text>
        </View>

        {/* Toile mise à jour */}
        <View style={styles.toileSection}>
          <Text style={styles.toileTitle}>Ta toile, mise à jour</Text>
          <View style={styles.toileWrap}>
            <Toile scores={scoresWithUpdate} variant="full" focusedPillar={slotPillar} />
          </View>
          <Text style={styles.toileHint}>
            La branche {pillarId} reflète maintenant ton score final. Les autres
            branches se mettront à jour au fil des semaines.
          </Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          label="Continuer"
          onPress={handleContinue}
          fullWidth
          size="large"
          context={slotPillar}
        />
      </View>

      <S8ExitScreen
        visible={showS8Exit}
        streak={streak}
        onContinue={() => {
          setShowS8Exit(false);
          if (!narrativeFlags.consolidation_intro_seen) {
            void markNarrativeSeen('consolidation_intro_seen');
          }
          setShowConsolidationIntro(true);
        }}
      />

      <ConsolidationIntroScreen
        visible={showConsolidationIntro}
        onContinue={() => {
          setShowConsolidationIntro(false);
          if (!narrativeFlags.mentorat_proposal_seen) {
            void markNarrativeSeen('mentorat_proposal_seen');
            setShowMentoratProposal(true);
          } else {
            navigation.popToTop();
          }
        }}
      />

      <MentoratProposalModal
        visible={showMentoratProposal}
        onDiscover={() => {
          setShowMentoratProposal(false);
          Alert.alert(
            'Mentorat',
            "L'espace mentorat sera ouvert dans une prochaine version. En attendant, contacte Mimi & Jacky par les canaux habituels. [copy à valider]",
            [{ text: 'OK', onPress: () => navigation.popToTop() }],
          );
        }}
        onLater={() => {
          setShowMentoratProposal(false);
          navigation.popToTop();
        }}
      />
    </SafeAreaView>
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
    paddingBottom: space[5],
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
  deltaBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    backgroundColor: '#FFFFFF',
    borderRadius: radiusV1.xl,
    padding: space[4],
    borderWidth: 1.5,
    borderColor: pillarColors.s1.headerBg,
  },
  deltaIcon: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deltaLabel: {
    ...interTextStyle('caption'),
    color: pillarColors.s1.text,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  deltaValue: {
    fontFamily: getInterFamily('800'),
    fontSize: 22,
    marginTop: 2,
  },
  scoreCol: { alignItems: 'flex-end' },
  scoreLabel: {
    ...interTextStyle('caption'),
    color: pillarColors.s1.text,
    opacity: 0.7,
    textAlign: 'right',
  },
  scoreValue: {
    fontFamily: getInterFamily('700'),
    fontSize: 16,
    color: pillarColors.s1.text,
    marginTop: 2,
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
    fontSize: 24,
    lineHeight: 28,
    color: pillarColors.s1.text,
  },
  diagnosticMessage: {
    ...interTextStyle('bodyLarge'),
    color: pillarColors.s1.text,
  },
  toileSection: { gap: space[2] },
  toileTitle: {
    ...interTextStyle('h3'),
    color: pillarColors.s1.text,
  },
  toileWrap: { alignItems: 'center', paddingVertical: space[3] },
  toileHint: {
    ...interTextStyle('body'),
    color: pillarColors.s1.text,
    opacity: 0.75,
  },
  footer: { padding: layout.screen.marginHorizontal },
});

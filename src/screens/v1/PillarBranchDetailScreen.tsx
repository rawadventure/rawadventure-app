/**
 * PillarBranchDetailScreen — IA-26 détail d'une branche de la Toile.
 *
 * Réf IA V3 §IA-26.
 *
 * Accessible depuis IA-25 (ToileTabScreen) au tap sur une branche.
 * Affiche :
 *  - header pilier illustré bandeau couleur pilier
 *  - score initial + final (si éval finale faite) avec différentiel
 *  - libellé diagnostic narratif (Coûteuse/Instable/.../Régulatrice etc.)
 *  - état : pending / started / completed
 *  - mini-Toile focusedPillar pour visualiser la branche
 *  - bouton retour
 *
 * Référence IA : IA-26. Pattern : E variante détail.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft, TrendingUp, Minus, TrendingDown } from 'lucide-react-native';
import { Button } from '../../components/primitives';
import { Toile, type PillarScore, type PillarSlot } from '../../components/toile';
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
import { supabase } from '../../lib/supabase';
import { getPillarMeta } from '../../data/pillar-registry';
import type { ToileStackParamList } from '../../navigation/ToileStack';
import type { DiagnosticLevel } from '../../lib/metrics';

type Route = NativeStackScreenProps<ToileStackParamList, 'PillarBranchDetail'>['route'];
type Nav = NativeStackNavigationProp<ToileStackParamList>;
type Palette = { bg: string; text: string; headerBg: string };

type EvalRow = {
  evaluation_type: string;
  normalized_score: string | number;
  diagnostic_level: number;
};

export default function PillarBranchDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const pillarSlot = route.params.pillarSlot;
  const pillarId = pillarSlot.toUpperCase();

  const meta = getPillarMeta(pillarId) ?? getPillarMeta('S1')!;
  const palette = pillarColors[pillarSlot] ?? pillarColors.s1;
  const styles = useMemo(() => makeStyles(palette), [palette]);

  const { user } = useAuth();
  const [evals, setEvals] = useState<EvalRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('pillar_evaluations')
        .select('evaluation_type, normalized_score, diagnostic_level')
        .eq('user_id', user.id)
        .eq('pillar_id', pillarId);
      if (!cancelled) {
        setEvals((data as EvalRow[]) ?? []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, pillarId]);

  const initial = evals.find((e) => e.evaluation_type === 'initial');
  const final = evals.find((e) => e.evaluation_type === 'final');

  const initialNorm = initial ? Math.round(Number(initial.normalized_score)) : null;
  const finalNorm = final ? Math.round(Number(final.normalized_score)) : null;
  const delta = initialNorm != null && finalNorm != null
    ? Math.round((finalNorm - initialNorm) * 10) / 10
    : null;

  const state: 'pending' | 'started' | 'completed' = !initial
    ? 'pending'
    : final
      ? 'completed'
      : 'started';

  // Diagnostic affiché : final s'il existe, sinon initial.
  const diagLevel = (final?.diagnostic_level ?? initial?.diagnostic_level) as DiagnosticLevel | undefined;
  const diagnostic = diagLevel ? meta.diagnostics[diagLevel] : null;

  // Mini-Toile : 1 branche pour ce pilier, autres pending.
  const miniScores: PillarScore[] = useMemo(() => {
    const slots: PillarSlot[] = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'];
    return slots.map<PillarScore>((slot) => {
      if (slot !== pillarSlot) return { pillarId: slot, state: 'pending' };
      if (state === 'pending') return { pillarId: slot, state: 'pending' };
      if (state === 'started') return { pillarId: slot, state: 'started', initialScore: initialNorm ?? 0 };
      return {
        pillarId: slot,
        state: 'completed',
        initialScore: initialNorm ?? 0,
        finalScore: finalNorm ?? 0,
      };
    });
  }, [pillarSlot, state, initialNorm, finalNorm]);

  const TrendIcon = delta == null ? Minus : delta > 1 ? TrendingUp : delta < -1 ? TrendingDown : Minus;
  const trendColor = delta == null ? neutralColors.textSecondary : delta > 1 ? brandColors.alive : delta < -1 ? '#B83A2E' : '#5A4B7A';

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeTop} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Header bandeau */}
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Retour"
              style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
            >
              <ChevronLeft size={26} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.headerMarker}>{`Pilier ${pillarId} · Semaine ${meta.weekIndex}`}</Text>
            <Text style={styles.headerTitle}>{meta.name}</Text>
          </View>

          <View style={styles.body}>
            {loading && <Text style={styles.loadingText}>Chargement…</Text>}

            {!loading && state === 'pending' && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Branche non encore évaluée</Text>
                <Text style={styles.cardBody}>
                  Cette branche se renforcera après l'évaluation initiale du
                  pilier {meta.name}. [copy à valider]
                </Text>
              </View>
            )}

            {!loading && state !== 'pending' && (
              <>
                {/* Diagnostic */}
                {diagnostic && (
                  <View style={styles.diagBlock}>
                    <Text style={styles.diagLabel}>{diagnostic.label}</Text>
                    <Text style={styles.diagMessage}>{diagnostic.message}</Text>
                  </View>
                )}

                {/* Scores */}
                <View style={styles.scoresRow}>
                  <View style={styles.scoreCol}>
                    <Text style={styles.scoreLabel}>INITIAL</Text>
                    <Text style={styles.scoreValue}>{initialNorm ?? '—'}</Text>
                  </View>
                  {delta != null && (
                    <View style={[styles.scoreCol, styles.deltaCol]}>
                      <TrendIcon size={20} color={trendColor} strokeWidth={2.5} />
                      <Text style={[styles.deltaValue, { color: trendColor }]}>
                        {delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)}
                      </Text>
                    </View>
                  )}
                  <View style={styles.scoreCol}>
                    <Text style={styles.scoreLabel}>{state === 'completed' ? 'FINAL' : 'EN COURS'}</Text>
                    <Text style={styles.scoreValue}>{finalNorm ?? '—'}</Text>
                  </View>
                </View>

                {/* Mini Toile branche focused */}
                <View style={styles.toileWrap}>
                  <Toile scores={miniScores} variant="detail" focusedPillar={pillarSlot} />
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
      <View style={styles.footer}>
        <Button
          label="Retour à la toile"
          variant="secondary"
          onPress={() => navigation.goBack()}
          fullWidth
          size="large"
          context={pillarSlot}
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
    scroll: { backgroundColor: palette.bg, paddingBottom: space[5] },
    header: {
      backgroundColor: palette.headerBg,
      paddingTop: space[3],
      paddingHorizontal: space[5],
      paddingBottom: space[6],
      borderBottomLeftRadius: HEADER_RADIUS,
      borderBottomRightRadius: HEADER_RADIUS,
    },
    backBtn: {
      width: 44,
      height: 44,
      alignItems: 'flex-start',
      justifyContent: 'center',
      marginBottom: space[2],
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
    body: { padding: space[5], gap: space[4] },
    loadingText: {
      ...interTextStyle('bodyLarge'),
      color: palette.text,
      textAlign: 'center',
    },
    card: {
      backgroundColor: neutralColors.surfaceElevated,
      borderRadius: radiusV1.xl,
      padding: space[5],
      gap: space[2],
      borderWidth: 1.5,
      borderColor: palette.headerBg,
    },
    cardTitle: {
      ...interTextStyle('h3'),
      color: palette.text,
    },
    cardBody: {
      ...interTextStyle('body'),
      color: palette.text,
    },
    diagBlock: {
      backgroundColor: neutralColors.surfaceElevated,
      borderRadius: radiusV1.xl,
      padding: space[5],
      gap: space[2],
      borderWidth: 1.5,
      borderColor: palette.headerBg,
    },
    diagLabel: {
      fontFamily: getInterFamily('800'),
      fontSize: 24,
      lineHeight: 28,
      color: palette.text,
    },
    diagMessage: {
      ...interTextStyle('bodyLarge'),
      color: palette.text,
    },
    scoresRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: neutralColors.surfaceElevated,
      borderRadius: radiusV1.xl,
      padding: space[4],
      borderWidth: 1.5,
      borderColor: palette.headerBg,
    },
    scoreCol: {
      alignItems: 'center',
      flex: 1,
    },
    scoreLabel: {
      ...interTextStyle('caption'),
      color: palette.text,
      opacity: 0.7,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    scoreValue: {
      fontFamily: getInterFamily('800'),
      fontSize: 32,
      lineHeight: 36,
      color: palette.text,
      marginTop: space[1],
    },
    deltaCol: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: space[1],
    },
    deltaValue: {
      fontFamily: getInterFamily('700'),
      fontSize: 16,
    },
    toileWrap: {
      alignItems: 'center',
      paddingVertical: space[3],
    },
    footer: { padding: layout.screen.marginHorizontal },
  });

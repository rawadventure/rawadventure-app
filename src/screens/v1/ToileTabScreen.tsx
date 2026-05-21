/**
 * ToileTabScreen — IA-25 vue principale Toile.
 *
 * Réf IA V3 §IA-25 + design system V1.1 §6 + Pattern E.
 *
 * Affiche la Toile dans son état réel (lecture pillar_evaluations Supabase
 * pour les 8 piliers). Chaque branche est tap-cible → IA-26 détail.
 *
 * Onglet masqué en Phase 0 (D5 + D18). Apparaît au S0.1 (≥ J15 / phase_1).
 *
 * Référence IA : IA-25. Pattern : E.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PillarHeader } from '../../components/compositions';
import { Toile, type PillarScore, type PillarSlot } from '../../components/toile';
import { brandColors, interTextStyle, space } from '../../theme';
import { useAuth } from '../../hooks/AuthContext';
import { supabase } from '../../lib/supabase';
import type { ToileStackParamList } from '../../navigation/ToileStack';

type Nav = NativeStackNavigationProp<ToileStackParamList>;

type EvalRow = {
  pillar_id: string;
  evaluation_type: string;
  normalized_score: string | number;
};

export default function ToileTabScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const [evals, setEvals] = useState<EvalRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvals = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('pillar_evaluations')
      .select('pillar_id, evaluation_type, normalized_score')
      .eq('user_id', user.id);
    setEvals((data as EvalRow[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void fetchEvals();
  }, [fetchEvals]);

  useFocusEffect(
    useCallback(() => {
      void fetchEvals();
    }, [fetchEvals]),
  );

  /** Construit le tableau scores[] pour les 8 piliers depuis Supabase.
   *  - Pas d'éval → pending
   *  - Éval initiale seule → started + initialScore
   *  - Éval initiale + finale → completed + initialScore + finalScore */
  const scores: PillarScore[] = useMemo(() => {
    const slots: PillarSlot[] = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'];
    const byKey = new Map<string, EvalRow>();
    for (const e of evals) byKey.set(`${e.pillar_id}_${e.evaluation_type}`, e);
    return slots.map<PillarScore>((slot) => {
      const upper = slot.toUpperCase();
      const iniRow = byKey.get(`${upper}_initial`);
      const finRow = byKey.get(`${upper}_final`);
      if (!iniRow) return { pillarId: slot, state: 'pending' };
      const initialScore = Math.round(Number(iniRow.normalized_score));
      if (!finRow) return { pillarId: slot, state: 'started', initialScore };
      return {
        pillarId: slot,
        state: 'completed',
        initialScore,
        finalScore: Math.round(Number(finRow.normalized_score)),
      };
    });
  }, [evals]);

  const handlePillarPress = (id: PillarSlot) => {
    navigation.navigate('PillarBranchDetail', { pillarSlot: id });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: space[8] }}>
        <PillarHeader context="neutral" marker="Raw Adventure" title="Ma toile" />
        <View style={styles.body}>
          <Text style={styles.intro}>
            Chaque branche représente un pilier de ta vitalité. Elle se
            renforce à mesure que tu pratiques. Tap une branche pour le détail.
          </Text>
          <View style={styles.toileWrap}>
            <Toile scores={scores} variant="full" onPillarPress={handlePillarPress} />
          </View>
          {loading && <Text style={styles.hint}>Chargement…</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: brandColors.cream },
  body: { padding: space[5] },
  intro: { ...interTextStyle('bodyLarge'), color: brandColors.deep, marginBottom: space[5] },
  toileWrap: { alignItems: 'center', paddingVertical: space[4] },
  hint: {
    ...interTextStyle('caption'),
    color: '#8A7CA8',
    textAlign: 'center',
    marginTop: space[4],
  },
});

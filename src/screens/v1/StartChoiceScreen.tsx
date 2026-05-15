/**
 * StartChoiceScreen — IA-10b (choix de démarrage différé).
 *
 * Réf IA V3 §IA-10b + Feature Spec V1 Socle minimum §2.3 (démarrage différé)
 * + D24.
 *
 * Affiché conditionnellement après IA-10 quand l'utilisateur crée son compte
 * à moins de 4h du minuit local suivant. Pose explicitement le choix :
 *  - "On démarre maintenant" → accountCreatedAt = now()
 *  - "Je commence demain" → accountCreatedAt = startOfNextLocalDay()
 *    → bascule en `pre_phase_0_waiting`, l'utilisateur arrive sur IA-10c.
 *
 * Pas de fermeture par retour Android — l'utilisateur doit choisir explicitement.
 *
 * Référence IA : IA-10b. Pattern : A (écran narratif plein).
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/primitives';
import {
  interTextStyle,
  layout,
  pillarColors,
  space,
} from '../../theme';
import { useProgress } from '../../hooks/ProgressContext';
import { startOfNextLocalDay } from '../../lib/calendar';

export type StartChoiceScreenProps = {
  /** Callback appelé une fois `accountCreatedAt` posé. Le routeur enchaîne
   *  selon que l'utilisateur démarre maintenant (TabNavigator + IA-12) ou
   *  plus tard (IA-10c waiting screen). */
  onChoice: (mode: 'now' | 'tomorrow') => void;
};

export default function StartChoiceScreen({ onChoice }: StartChoiceScreenProps) {
  const { setAccountCreatedAt } = useProgress();
  const [loading, setLoading] = useState<'now' | 'tomorrow' | null>(null);

  const handleNow = async () => {
    setLoading('now');
    await setAccountCreatedAt(new Date().toISOString());
    onChoice('now');
  };

  const handleTomorrow = async () => {
    setLoading('tomorrow');
    await setAccountCreatedAt(startOfNextLocalDay());
    onChoice('tomorrow');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.body}>
        <View style={styles.head}>
          <Text style={styles.marker}>RAW ADVENTURE</Text>
          <Text style={styles.title}>On démarre maintenant{'\n'}ou demain matin ?</Text>
          <Text style={styles.subtitle}>
            Il est tard. Tu peux démarrer ton premier jour maintenant ou attendre
            demain pour profiter d'une journée complète.
          </Text>
        </View>
        <View style={styles.actions}>
          <Button
            label="On démarre maintenant"
            onPress={handleNow}
            loading={loading === 'now'}
            disabled={loading !== null && loading !== 'now'}
            fullWidth
            size="large"
            context="phase0"
          />
          <Button
            label="Je commence demain"
            variant="secondary"
            onPress={handleTomorrow}
            loading={loading === 'tomorrow'}
            disabled={loading !== null && loading !== 'tomorrow'}
            fullWidth
            size="large"
            context="phase0"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: pillarColors.phase0.bg },
  body: {
    flex: 1,
    padding: layout.screen.marginHorizontalWide,
    paddingTop: space[8],
    justifyContent: 'space-between',
  },
  head: { gap: space[4] },
  marker: {
    ...interTextStyle('caption'),
    color: pillarColors.phase0.text,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    opacity: 0.7,
  },
  title: {
    ...interTextStyle('display'),
    color: pillarColors.phase0.text,
  },
  subtitle: {
    ...interTextStyle('bodyLarge'),
    color: pillarColors.phase0.text,
  },
  actions: { gap: space[3], marginBottom: space[5] },
});

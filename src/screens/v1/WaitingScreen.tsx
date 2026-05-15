/**
 * WaitingScreen — IA-10c (attente pré-Phase 0, démarrage différé).
 *
 * Réf IA V3 §IA-10c + Feature Spec V1 Socle minimum §2.3 + D24.
 *
 * Affiché si l'utilisateur a choisi "Je commence demain" à IA-10b. Tab bar
 * en mode dégradé (onglet Profil seul disponible — masqué ici en V1 simple),
 * pas d'accueil ni de toile tant que minuit local n'est pas passé.
 *
 * L'app détecte automatiquement le passage de minuit à la prochaine ouverture
 * via `currentDayInParcours()` qui renvoie ≥ 1 dès que `now >= accountCreatedAt`.
 *
 * Bouton secondaire "En fait, on démarre maintenant" : repose
 * `accountCreatedAt = now()` et bascule immédiatement vers Phase 0.
 *
 * Référence IA : IA-10c. Pattern : A.
 */

import React, { useEffect, useState } from 'react';
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

export type WaitingScreenProps = {
  /** Callback appelé quand l'utilisateur tape "En fait on démarre maintenant"
   *  ou quand le passage de minuit est détecté automatiquement. */
  onStartNow: () => void;
};

export default function WaitingScreen({ onStartNow }: WaitingScreenProps) {
  const { accountCreatedAt, setAccountCreatedAt } = useProgress();
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Tick toutes les 30 secondes pour rafraîchir le compte à rebours.
  // Le passage de minuit est aussi détecté par le routeur (App.tsx) qui
  // re-calcule currentDay et change la destination automatiquement.
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const handleStartNow = async () => {
    setLoading(true);
    await setAccountCreatedAt(new Date().toISOString());
    onStartNow();
  };

  // Compte à rebours simple jusqu'à accountCreatedAt
  const remainingLabel = (() => {
    if (!accountCreatedAt) return '';
    const target = new Date(accountCreatedAt).getTime();
    const diffMs = target - now.getTime();
    if (diffMs <= 0) return 'On y va !';
    const totalMin = Math.floor(diffMs / 60_000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    if (h > 0) return `Démarrage dans ${h}h${m.toString().padStart(2, '0')}`;
    return `Démarrage dans ${m} min`;
  })();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.body}>
        <View style={styles.head}>
          <Text style={styles.marker}>RAW ADVENTURE</Text>
          <Text style={styles.title}>On reprend{'\n'}demain matin.</Text>
          <Text style={styles.subtitle}>
            Repose-toi ce soir. À ton premier réveil après minuit, ton parcours
            démarrera automatiquement.
          </Text>
          {remainingLabel && <Text style={styles.countdown}>{remainingLabel}</Text>}
        </View>
        <View style={styles.actions}>
          <Button
            label="En fait, on démarre maintenant"
            variant="secondary"
            onPress={handleStartNow}
            loading={loading}
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
  countdown: {
    ...interTextStyle('h3'),
    color: pillarColors.phase0.text,
    marginTop: space[4],
    opacity: 0.85,
  },
  actions: { gap: space[3], marginBottom: space[5] },
});

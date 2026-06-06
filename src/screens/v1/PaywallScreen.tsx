/**
 * PaywallScreen — fin Phase 0 (jour 14), avant S0.1.
 *
 * Réf Feature Spec abonnement V1.0 §5 (paywall fin Phase 0), §10 (Reader App
 * pattern Apple — pas de prix in-app, pas de CTA "Acheter").
 *
 * Pattern UI : full-screen, non-dismissable.
 *
 * Reader App rules respectées :
 *  - Aucun prix affiché
 *  - Aucun mot "abonnement" / "payer" / "souscrire"
 *  - CTA neutre "Continuer mon parcours" → ouvre WebBrowser sur la page
 *    rawadventure.world/abonnement qui héberge le Stripe Pricing Table
 *    (3 plans : mensuel, 6 mois, annuel)
 *
 * Flow paiement :
 *   PaywallScreen
 *     → WebBrowser sur rawadventure.world/abonnement
 *     → User choisit plan + paye via Stripe Checkout
 *     → Stripe webhook → Supabase Edge Function → update table subscriptions
 *     → Stripe redirect → rawadventure.world/checkout-success
 *     → User tap "Retourner dans l'app"
 *     → Deep link rawadventure://subscription-success
 *     → App reload SubscriptionContext → isActive = true
 *     → RootNavigator route TabNavigator (paywall disparaît)
 *
 * DEV : bouton "Mock active" reste dispo dans ProfilTabScreen pour bypass tests.
 */

import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { ArrowRight, ExternalLink } from 'lucide-react-native';
import { Button } from '../../components/primitives';
import {
  brandColors,
  interTextStyle,
  layout,
  pillarColors,
  space,
} from '../../theme';
import { useSubscription } from '../../hooks/SubscriptionContext';

const SUBSCRIBE_URL = 'https://rawadventure.world/abonnement/';

export default function PaywallScreen() {
  const { reload } = useSubscription();
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    try {
      // Ouvre le navigateur intégré iOS/Android (SFSafariViewController iOS /
      // Custom Tabs Android) — meilleure UX qu'un Linking.openURL (reste dans
      // l'app, retour automatique au close). Après paiement, Stripe redirige
      // vers rawadventure.world/checkout-success qui a un deep link
      // rawadventure://subscription-success → ferme automatiquement le browser
      // et déclenche notre handler dans App.tsx.
      const result = await WebBrowser.openBrowserAsync(SUBSCRIBE_URL, {
        // Match brand colors
        toolbarColor: pillarColors.phase0.bg,
        controlsColor: pillarColors.phase0.text,
        // Permet le close manuel via le bouton "Done" iOS / X Android
        dismissButtonStyle: 'close',
      });

      // Si user a fermé manuellement le browser (cancel, ou retour app),
      // on recharge le state SubscriptionContext au cas où le webhook
      // aurait déjà été déclenché en parallèle.
      if (result.type === 'cancel' || result.type === 'dismiss') {
        await reload();
      }
    } catch (e: any) {
      Alert.alert(
        'Impossible d\'ouvrir le navigateur',
        e.message ?? 'Réessaie dans un instant.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLater = () => {
    Alert.alert(
      'Plus tard',
      'Tu peux fermer l\'app. Tu reprendras où tu en es à la prochaine ouverture.',
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.body}>
          <View>
            <Text style={styles.marker}>FIN DE LA PHASE 0</Text>
            <Text style={styles.title}>Tu as terminé tes 14 jours.</Text>
            <Text style={styles.subtitle}>
              Quatorze jours pour préparer ton corps. La suite — 8 semaines guidées,
              un pilier par semaine — commence maintenant.
            </Text>
            <Text style={styles.paragraph}>
              Respiration, alimentation, mindset, mouvement, repos, passion, connexion
              au vivant, élimination. Chaque semaine isole un terrain pour que tu
              ressentes le travail dans le détail.
            </Text>
            <Text style={styles.paragraph}>
              Pour continuer, termine ton inscription depuis ton navigateur. Tu seras
              ramené dans l\'app à la fin.
            </Text>
          </View>

          <View style={styles.actions}>
            <Button
              label="Continuer mon parcours"
              onPress={handleContinue}
              loading={loading}
              IconRight={Platform.OS === 'ios' ? ExternalLink : ArrowRight}
              fullWidth
              size="large"
            />
            <Button
              label="Plus tard"
              variant="ghost"
              onPress={handleLater}
              disabled={loading}
              fullWidth
            />
            <Text style={styles.fine}>
              En continuant, tu acceptes nos CGU et notre Politique de confidentialité.
              {'\n'}[copy à valider]
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: pillarColors.phase0.bg },
  scroll: { flexGrow: 1 },
  body: {
    flex: 1,
    minHeight: 600,
    padding: layout.screen.marginHorizontalWide,
    paddingTop: space[6],
    justifyContent: 'space-between',
  },
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
    marginTop: space[3],
  },
  subtitle: {
    ...interTextStyle('bodyLarge'),
    color: pillarColors.phase0.text,
    marginTop: space[4],
  },
  paragraph: {
    ...interTextStyle('body'),
    color: pillarColors.phase0.text,
    marginTop: space[4],
  },
  actions: { gap: space[3], marginTop: space[6] },
  fine: {
    ...interTextStyle('caption'),
    color: brandColors.deep,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: space[3],
  },
});

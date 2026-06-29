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

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { openExternal } from '../../lib/openExternal';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react-native';
import { Button } from '../../components/primitives';
import {
  brandColors,
  interTextStyle,
  layout,
  pillarColors,
  space,
} from '../../theme';
import { useAuth } from '../../hooks/AuthContext';
import { useProgress } from '../../hooks/ProgressContext';
import { useSubscription } from '../../hooks/SubscriptionContext';

const SUBSCRIBE_BASE_URL = 'https://rawadventure.world/abonnement/';

export type PaywallScreenProps = {
  /** Si fourni → variant soft (back button + "Plus tard" ferme l'écran).
   *  Sinon → variant gate (RootNavigator, pas de back, Plus tard = ferme app). */
  onBack?: () => void;
};

// Module-level guard : reload-on-mount fire UNE seule fois par cycle de
// vie du bundle JS. Reset implicite à chaque reload du Metro bundler.
let paywallReloadedThisSession = false;

export default function PaywallScreen({ onBack }: PaywallScreenProps = {}) {
  const { user } = useAuth();
  const { reload } = useSubscription();
  const { currentDay, currentPhase } = useProgress();
  const [loading, setLoading] = useState(false);

  // Variant copy selon contexte parcours.
  const variant: 'fin_phase_0' | 'expired_phase_1' | 'expired_post_s8' =
    currentPhase === 'post_s8'
      ? 'expired_post_s8'
      : currentDay >= 17
        ? 'expired_phase_1'
        : 'fin_phase_0';

  const copy = {
    fin_phase_0: {
      marker: 'FIN DE LA PHASE 0',
      title: 'Tu as terminé tes 14 jours.',
      subtitle:
        'Quatorze jours pour préparer ton corps. La suite — 8 semaines guidées, un pilier par semaine — commence maintenant.',
      paragraph:
        'Respiration, alimentation, mindset, mouvement, repos, passion, connexion au vivant, élimination. Chaque semaine isole un terrain pour que tu ressentes le travail dans le détail.',
      ctaParagraph:
        "Pour continuer, termine ton inscription depuis ton navigateur. Tu seras ramené dans l'app à la fin.",
      laterAlertTitle: 'Phase 0 acquise',
      laterAlertMessage:
        'Tu peux fermer l\'app. Renouvelle quand tu seras prêt pour démarrer la Phase 1.',
    },
    expired_phase_1: {
      marker: 'ABONNEMENT EXPIRÉ',
      title: 'Ta progression Phase 1 est en pause.',
      subtitle:
        'Ton abonnement a expiré. Aucune progression perdue — tu reprends exactement où tu en étais dès renouvellement.',
      paragraph:
        'Toile, paliers, sessions, évaluations : tout reste enregistré côté serveur. Le programme attend que tu reviennes.',
      ctaParagraph:
        'Renouvelle ton abonnement depuis ton navigateur pour réactiver la Phase 1.',
      laterAlertTitle: 'Parcours en pause',
      laterAlertMessage:
        'Ton parcours Phase 1 est gelé jusqu\'au renouvellement. Aucune progression perdue. À la prochaine ouverture, tu retombes ici.',
    },
    expired_post_s8: {
      marker: 'ABONNEMENT EXPIRÉ',
      title: 'Mode consolidation libre en pause.',
      subtitle:
        'Ton abonnement a expiré. Les 10 semaines guidées restent acquises côté toile et progression.',
      paragraph:
        'Renouvelle pour réactiver le mode consolidation libre et continuer à explorer les 8 piliers à ton rythme.',
      ctaParagraph:
        'Renouvelle ton abonnement depuis ton navigateur.',
      laterAlertTitle: 'Consolidation en pause',
      laterAlertMessage:
        'Tes 10 semaines sont acquises. Renouvelle pour reprendre la consolidation libre.',
    },
  }[variant];

  // Reload subscription au montage — fire UNE seule fois par session via
  // module-level guard. Évite mount/unmount loop infinie quand
  // SubscriptionContext.loading=true cause LoadingScreen → unmount Paywall →
  // re-mount → reload → loop.
  useEffect(() => {
    if (paywallReloadedThisSession) return;
    paywallReloadedThisSession = true;
    void reload();
  }, [reload]);

  const handleContinue = async () => {
    setLoading(true);
    try {
      // Passe user_id + email en query params pour que la page abonnement
      // puisse les injecter dans le Stripe Pricing Table (attributs
      // client-reference-id + customer-email). Le webhook utilise
      // client_reference_id pour matcher l'user Supabase fiablement.
      const params = new URLSearchParams();
      if (user?.id) params.set('user_id', user.id);
      if (user?.email) params.set('email', user.email);
      const url = params.toString()
        ? `${SUBSCRIBE_BASE_URL}?${params.toString()}`
        : SUBSCRIBE_BASE_URL;

      // Ouvre le navigateur intégré iOS/Android (SFSafariViewController iOS /
      // Custom Tabs Android) — meilleure UX qu'un Linking.openURL (reste dans
      // l'app, retour automatique au close). Après paiement, Stripe redirige
      // vers rawadventure.world/checkout-success qui a un deep link
      // rawadventure://subscription-success → ferme automatiquement le browser
      // et déclenche notre handler dans App.tsx.
      const result = await openExternal(url, {
        // Match brand colors (ignoré sur web)
        toolbarColor: pillarColors.phase0.bg,
        controlsColor: pillarColors.phase0.text,
        // Permet le close manuel via le bouton "Done" iOS / X Android
        dismissButtonStyle: 'close',
        // Web : nouvel onglet pour ne pas remplacer l'app (l'URL est construite
        // sans async avant cet appel → popup autorisée). Évite que l'utilisateur
        // reste coincé sur la page Stripe sans retour in-app.
        webBehavior: 'new-tab',
      });

      // Reload SubscriptionContext quel que soit le mode de fermeture du
      // browser :
      //  - 'cancel' / 'dismiss' : user a fermé manuellement → check si
      //    webhook Stripe a propagé en parallèle
      //  - 'success' : deep link rawadventure://subscription-success a
      //    fermé le browser → user a payé, faut reload pour basculer
      //    isActive=true (sinon RootNavigator garde PaywallScreen, user
      //    coincé en boucle même après paiement réussi).
      // Sécurité ceinture+bretelles : couvre aussi le cas Expo Go où
      // le scheme custom ne fire pas correctement (deep link tomb̀e à plat
      // → user close browser manuellement, on retombe sur 'cancel').
      await reload();
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
    if (onBack) {
      // Variant soft — retour à l'écran précédent (hub J14/J15/J16).
      onBack();
      return;
    }
    Alert.alert(copy.laterAlertTitle, copy.laterAlertMessage);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header back button — soft variant uniquement (depuis hub J14/15/16
          via navigation.navigate). En mode gate (RootNavigator), pas de back. */}
      {onBack && (
        <View style={styles.headerBack}>
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Retour"
            hitSlop={12}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={brandColors.deep} />
          </Pressable>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.body}>
          <View>
            <Text style={styles.marker}>{copy.marker}</Text>
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.subtitle}>{copy.subtitle}</Text>
            <Text style={styles.paragraph}>{copy.paragraph}</Text>
            <Text style={styles.paragraph}>{copy.ctaParagraph}</Text>
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
              En continuant, tu acceptes nos{' '}
              <Text
                style={styles.link}
                onPress={() =>
                  Linking.openURL('https://rawadventure.world/cgu/').catch(() => {})
                }
                accessibilityRole="link"
              >
                conditions générales
              </Text>
              {' '}et notre{' '}
              <Text
                style={styles.link}
                onPress={() =>
                  Linking.openURL(
                    'https://rawadventure.world/politique-confidentialite/',
                  ).catch(() => {})
                }
                accessibilityRole="link"
              >
                politique de confidentialité
              </Text>
              .
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
  headerBack: {
    paddingHorizontal: layout.screen.marginHorizontalWide,
    paddingTop: space[2],
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
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
  link: {
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});

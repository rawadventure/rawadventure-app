/**
 * EmailPendingScreen — confirmation email en attente après signup.
 *
 * Sprint B email confirm — affiché par RootNavigator quand :
 *  - onboardingDone = true
 *  - session = null (Supabase n'a pas encore confirmé l'email)
 *  - pendingMigration ≠ null (signup fait, en attente clic lien email)
 *
 * Une fois que l'utilisateur clique le lien dans l'email reçu, Supabase
 * confirme + signe in via redirect intelligent (web:
 * `https://app.rawadventure.world/confirm-email` avec tokens en fragment,
 * détection auto via detectSessionInUrl ; natif: deep link
 * `rawadventure://confirm-email`). La session arrive via `onAuthStateChange`,
 * ProgressContext déclenche la migration différée (cf. useEffect dans
 * ProgressContext), RootNavigator bascule sur TabNavigator.
 *
 * Identifiant écran : IA-EmailPending (Sprint B).
 */

import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail } from 'lucide-react-native';
import { Button } from '../../components/primitives';
import {
  interTextStyle,
  layout,
  pillarColors,
  space,
} from '../../theme';
import { useAuth } from '../../hooks/AuthContext';
import { useProgress } from '../../hooks/ProgressContext';

export default function EmailPendingScreen() {
  const { resendConfirmationEmail, signOut } = useAuth();
  const { pendingMigration, clearPendingMigration } = useProgress();
  const [loading, setLoading] = useState(false);

  const email = pendingMigration?.email ?? 'ton email';

  const handleResend = async () => {
    if (!pendingMigration?.email) {
      Alert.alert('Erreur', 'Email introuvable. Annule et recommence l\'inscription.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await resendConfirmationEmail(pendingMigration.email);
      if (error) {
        Alert.alert('Envoi échoué', error.message);
        return;
      }
      Alert.alert('Email renvoyé', `Nouveau lien envoyé à ${pendingMigration.email}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMail = async () => {
    // Tente d'ouvrir l'app Mail système (iOS : message://, Android : mailto:).
    const url = Platform.OS === 'ios' ? 'message://' : 'mailto:';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Ouvre ton app Mail', 'Vérifie ta boîte mail pour trouver le lien.');
    }
  };

  const handleChangeEmail = async () => {
    // L'utilisateur veut recommencer avec un autre email : on efface la
    // pendingMigration et la session anonyme éventuelle, puis RootNavigator
    // affiche RegisterScreen.
    await clearPendingMigration();
    await signOut();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.body}>
          <View style={styles.top}>
            <View style={styles.iconWrap}>
              <Mail size={48} color={pillarColors.phase0.text} strokeWidth={1.5} />
            </View>
            <Text style={styles.marker}>CONFIRMATION</Text>
            <Text style={styles.title}>Vérifie ton email.</Text>
            <Text style={styles.subtitle}>
              On vient d'envoyer un lien de confirmation à {email}.
              {'\n\n'}
              Clique sur le lien dans cet email pour activer ton compte. Tu seras
              ramené directement dans l'app.
            </Text>
            <Text style={styles.hint}>
              Pas reçu ? Vérifie tes spams. Le lien expire dans 24 heures.
            </Text>
          </View>

          <View style={styles.actions}>
            {Platform.OS !== 'web' && (
              <Button
                label="Ouvrir mon app Mail"
                onPress={handleOpenMail}
                fullWidth
                size="large"
              />
            )}
            {Platform.OS === 'web' && (
              <Text style={styles.webHint}>
                Ouvre ton client mail habituel dans un autre onglet.
              </Text>
            )}
            <Button
              label="Renvoyer l'email"
              variant="ghost"
              onPress={handleResend}
              loading={loading}
              fullWidth
            />
            <Button
              label="Changer d'email"
              variant="ghost"
              onPress={handleChangeEmail}
              disabled={loading}
              fullWidth
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: pillarColors.phase0.bg },
  flex: { flex: 1 },
  body: {
    flex: 1,
    padding: layout.screen.marginHorizontalWide,
    paddingTop: space[6],
    justifyContent: 'space-between',
  },
  top: { alignItems: 'flex-start' },
  iconWrap: {
    marginBottom: space[4],
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
  hint: {
    ...interTextStyle('body'),
    color: pillarColors.phase0.text,
    opacity: 0.7,
    marginTop: space[4],
  },
  actions: { gap: space[3], marginBottom: space[5] },
  webHint: {
    ...interTextStyle('body'),
    color: pillarColors.phase0.text,
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: space[2],
  },
});

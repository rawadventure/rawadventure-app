/**
 * EmailPendingScreen — confirmation email en attente après signup.
 *
 * Sprint B email confirm — affiché par RootNavigator quand :
 *  - onboardingDone = true
 *  - session = null (Supabase n'a pas encore confirmé l'email)
 *  - pendingMigration ≠ null (signup fait, en attente confirmation)
 *
 * Sprint C auth PWA — la voie primaire est désormais le CODE à 6 chiffres
 * reçu par email (template Supabase "Confirm signup" avec `{{ .Token }}`) :
 * `verifyEmailOtp` crée la session DANS le contexte courant. Indispensable
 * sur PWA installée iOS où le click lien ouvre toujours un Safari fresh
 * (storage séparé) au lieu de la PWA. Le lien reste une voie secondaire —
 * s'il a été cliqué dans un autre navigateur, le code est consommé et la
 * recovery "J'ai déjà confirmé via le lien" retente un signInWithPassword
 * (mot de passe caché en mémoire depuis le signup, ou re-saisi).
 *
 * Tous les retours (erreurs, confirmations) sont en texte inline — jamais
 * Alert.alert, qui est un no-op sur react-native-web.
 *
 * Identifiant écran : IA-EmailPending (Sprint B).
 */

import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail } from 'lucide-react-native';
import { Button } from '../../components/primitives';
import PasswordInput from '../../components/PasswordInput';
import {
  brandColors,
  getInterFamily,
  interTextStyle,
  layout,
  neutralColors,
  pillarColors,
  radiusV1,
  semanticColors,
  space,
} from '../../theme';
import { useAuth, getCachedSignupPassword } from '../../hooks/AuthContext';
import { useProgress } from '../../hooks/ProgressContext';

type Status = { kind: 'error' | 'info'; text: string } | null;

export default function EmailPendingScreen() {
  const { resendConfirmationEmail, signOut, verifyEmailOtp, signInWithPassword } = useAuth();
  const { pendingMigration, clearPendingMigration } = useProgress();

  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  // Recovery "J'ai déjà confirmé via le lien" — révélée après erreur de code
  // ou via le bouton dédié. Si le mot de passe du signup n'est plus en
  // mémoire (bundle rechargé), on demande une re-saisie.
  const [showRecovery, setShowRecovery] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  const email = pendingMigration?.email ?? 'ton email';

  const handleVerifyCode = async () => {
    if (!pendingMigration?.email) {
      setStatus({ kind: 'error', text: "Email introuvable. Annule et recommence l'inscription." });
      return;
    }
    if (code.trim().length !== 6) {
      setStatus({ kind: 'error', text: 'Le code fait 6 chiffres.' });
      return;
    }
    setVerifying(true);
    setStatus(null);
    try {
      const { error } = await verifyEmailOtp(pendingMigration.email, code);
      if (error) {
        if (error.status === 429) {
          setStatus({ kind: 'error', text: 'Trop de tentatives. Réessaie dans une minute.' });
        } else {
          // Supabase renvoie la même 403 pour code invalide, expiré, ou déjà
          // consommé (lien cliqué dans un autre navigateur).
          setStatus({
            kind: 'error',
            text: 'Code invalide ou expiré. Si tu as déjà cliqué le lien de l\'email, utilise le bouton ci-dessous.',
          });
          setShowRecovery(true);
        }
        return;
      }
      // Succès : la session arrive via onAuthStateChange, RootNavigator
      // bascule sur le loader migration puis le hub. Rien d'autre à faire.
    } finally {
      setVerifying(false);
    }
  };

  const attemptSignIn = async (pwd: string) => {
    if (!pendingMigration?.email) return;
    setSigningIn(true);
    setStatus(null);
    try {
      const { error } = await signInWithPassword(pendingMigration.email, pwd);
      if (error) {
        const notConfirmed = /confirm/i.test(error.message);
        if (notConfirmed) {
          setStatus({
            kind: 'error',
            text: "Ton email n'est pas encore confirmé. Saisis le code reçu par email, ou clique le lien.",
          });
        } else if (error.status === 429) {
          setStatus({ kind: 'error', text: 'Trop de tentatives. Réessaie dans une minute.' });
        } else {
          setStatus({ kind: 'error', text: 'Mot de passe incorrect.' });
          setNeedsPassword(true);
        }
        return;
      }
      // Succès : session posée, RootNavigator prend le relais.
    } finally {
      setSigningIn(false);
    }
  };

  const handleAlreadyConfirmed = async () => {
    const cached = getCachedSignupPassword();
    if (cached) {
      await attemptSignIn(cached);
    } else {
      setNeedsPassword(true);
      setStatus({ kind: 'info', text: 'Saisis ton mot de passe pour te connecter.' });
    }
  };

  const handleResend = async () => {
    if (!pendingMigration?.email) {
      setStatus({ kind: 'error', text: "Email introuvable. Annule et recommence l'inscription." });
      return;
    }
    setResending(true);
    setStatus(null);
    try {
      const { error } = await resendConfirmationEmail(pendingMigration.email);
      if (error) {
        if (error.status === 429) {
          setStatus({ kind: 'error', text: 'Un email vient de partir. Attends une minute avant de renvoyer.' });
        } else {
          setStatus({ kind: 'error', text: `Envoi échoué : ${error.message}` });
        }
        return;
      }
      setStatus({
        kind: 'info',
        text: `Nouvel email envoyé à ${pendingMigration.email}. Le nouveau code remplace l'ancien.`,
      });
    } finally {
      setResending(false);
    }
  };

  const handleOpenMail = async () => {
    // Tente d'ouvrir l'app Mail système (iOS : message://, Android : mailto:).
    const url = Platform.OS === 'ios' ? 'message://' : 'mailto:';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Ouvre ton app Mail', 'Vérifie ta boîte mail pour trouver le code.');
    }
  };

  const handleChangeEmail = async () => {
    // L'utilisateur veut recommencer avec un autre email : on efface la
    // pendingMigration et la session anonyme éventuelle, puis RootNavigator
    // affiche RegisterScreen.
    await clearPendingMigration();
    await signOut();
  };

  const busy = verifying || resending || signingIn;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <View style={styles.top}>
            <View style={styles.iconWrap}>
              <Mail size={48} color={pillarColors.phase0.text} strokeWidth={1.5} />
            </View>
            <Text style={styles.marker}>CONFIRMATION</Text>
            <Text style={styles.title}>Vérifie ton email.</Text>
            <Text style={styles.subtitle}>
              On vient d'envoyer un code à 6 chiffres à {email}.
              {'\n\n'}
              Saisis-le ici pour activer ton compte et continuer.
            </Text>

            <TextInput
              style={styles.codeInput}
              value={code}
              onChangeText={(v) => setCode(v.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              maxLength={6}
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
              placeholder="000000"
              placeholderTextColor={neutralColors.textMuted}
              accessibilityLabel="Code de confirmation à 6 chiffres"
              editable={!busy}
            />

            {status && (
              <Text style={[styles.status, status.kind === 'error' && styles.statusError]}>
                {status.text}
              </Text>
            )}

            <Button
              label="Valider le code"
              onPress={handleVerifyCode}
              loading={verifying}
              disabled={busy || code.length !== 6}
              fullWidth
              size="large"
              context="phase0"
            />

            <Text style={styles.hint}>
              Pas reçu ? Vérifie tes spams. Le code expire dans 24 heures.
            </Text>
          </View>

          <View style={styles.actions}>
            {showRecovery && needsPassword && (
              <PasswordInput
                value={password}
                onChangeText={setPassword}
                placeholder="Ton mot de passe"
                accessibilityLabel="Mot de passe"
              />
            )}
            {showRecovery && (
              <Button
                label={needsPassword ? 'Me connecter' : "J'ai déjà confirmé via le lien"}
                variant="secondary"
                onPress={
                  needsPassword ? () => attemptSignIn(password) : handleAlreadyConfirmed
                }
                loading={signingIn}
                disabled={busy || (needsPassword && password.length === 0)}
                fullWidth
              />
            )}
            {!showRecovery && (
              <Button
                label="J'ai déjà confirmé via le lien"
                variant="ghost"
                onPress={handleAlreadyConfirmed}
                loading={signingIn}
                disabled={busy}
                fullWidth
              />
            )}
            {Platform.OS !== 'web' && (
              <Button
                label="Ouvrir mon app Mail"
                variant="ghost"
                onPress={handleOpenMail}
                disabled={busy}
                fullWidth
              />
            )}
            <Button
              label="Renvoyer l'email"
              variant="ghost"
              onPress={handleResend}
              loading={resending}
              disabled={busy}
              fullWidth
            />
            <Button
              label="Changer d'email"
              variant="ghost"
              onPress={handleChangeEmail}
              disabled={busy}
              fullWidth
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: pillarColors.phase0.bg },
  flex: { flex: 1 },
  body: {
    flexGrow: 1,
    padding: layout.screen.marginHorizontalWide,
    paddingTop: space[6],
    justifyContent: 'space-between',
  },
  top: { alignItems: 'stretch' },
  iconWrap: {
    marginBottom: space[4],
    alignSelf: 'flex-start',
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
  codeInput: {
    backgroundColor: neutralColors.surfaceElevated,
    borderRadius: radiusV1.md,
    borderWidth: 1.5,
    borderColor: neutralColors.borderVisible,
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    fontFamily: getInterFamily('700'),
    fontSize: 28,
    letterSpacing: 8,
    textAlign: 'center',
    color: brandColors.deep,
    marginTop: space[5],
    marginBottom: space[4],
  },
  status: {
    ...interTextStyle('body'),
    color: pillarColors.phase0.text,
    marginBottom: space[3],
  },
  statusError: {
    color: semanticColors.danger,
  },
  hint: {
    ...interTextStyle('body'),
    color: pillarColors.phase0.text,
    opacity: 0.7,
    marginTop: space[4],
  },
  actions: { gap: space[3], marginBottom: space[5], marginTop: space[6] },
});

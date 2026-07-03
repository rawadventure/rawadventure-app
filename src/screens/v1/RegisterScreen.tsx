/**
 * RegisterScreen — IA-10 V1 (création de compte OU connexion fin d'onboarding).
 *
 * Réf IA V3 §IA-10 + Feature Spec V1 Socle minimum §2.10 (migration local
 * → distant à la création de compte) + D24 (démarrage différé optionnel).
 *
 * Deux modes via toggle :
 *  - `register` (par défaut) : signUp + migration AsyncStorage → Supabase
 *  - `signin` : signInWithPassword pour les utilisateurs déjà inscrits. Pas
 *    de migration — leurs données vivent déjà côté Supabase. La session
 *    arrive → ProgressContext recharge → routeur enchaîne vers TabNavigator
 *    automatiquement.
 *
 * Toggle visuel : bouton ghost "J'ai déjà un compte" / "Créer un compte"
 * (cohérent maquette 4 onboarding slide 1 — design system V1.1 §10).
 *
 * Référence IA : IA-10. Pattern : D (variante saisie).
 */

import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import { Button } from '../../components/primitives';
import PasswordInput from '../../components/PasswordInput';
import { isValidEmail, isValidPassword } from '../../lib/validation';
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
import { useProgress } from '../../hooks/ProgressContext';
import { hoursUntilNextLocalMidnight } from '../../lib/calendar';
import { supabase } from '../../lib/supabase';

const D24_THRESHOLD_HOURS = 4;

type Mode = 'register' | 'signin' | 'forgot';

export type RegisterScreenProps = {
  /**
   * Callback invoqué après création de compte réussie + migration AsyncStorage.
   *
   * `requiresStartChoice` indique si IA-10b doit s'afficher (fenêtre D24).
   *
   * En mode `signin` (utilisateur existant), ce callback n'est pas appelé —
   * la session arrive via `onAuthStateChange` et le routeur fait son travail
   * automatiquement (saute IA-10 et IA-10b puisque l'utilisateur a déjà tout).
   */
  onRegistered: (args: { requiresStartChoice: boolean }) => void;
  /**
   * Sprint C auth PWA — mode initial forcé. `signin` quand on arrive depuis
   * le lien "J'ai déjà un compte" de la slide 1 onboarding.
   */
  initialMode?: 'register' | 'signin';
  /**
   * Sprint C auth PWA — présent quand l'écran est ouvert depuis la slide 1
   * onboarding (entrée connexion). Le toggle "Créer un compte" appelle alors
   * ce callback (retour onboarding, le vrai chemin de création) au lieu de
   * basculer en mode register — un signup ici court-circuiterait les slides
   * et créerait un compte sans données d'onboarding.
   */
  onSignupRedirect?: () => void;
};

export default function RegisterScreen({
  onRegistered,
  initialMode,
  onSignupRedirect,
}: RegisterScreenProps) {
  const {
    signUpWithPassword,
    signInWithPassword,
    resetPasswordForEmail,
    sessionExpired,
    clearSessionExpired,
  } = useAuth();
  const { migrateLocalToRemote, markPendingMigration } = useProgress();
  // Si on arrive ici suite à une session expirée (Sprint C polish auth),
  // on bascule directement sur le mode signin pour réduire la friction.
  const [mode, setMode] = useState<Mode>(
    initialMode ?? (sessionExpired ? 'signin' : 'register'),
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Mode forgot : email seul, pas de password.
    if (mode === 'forgot') {
      if (!email) {
        Alert.alert('Email manquant', 'Saisis ton email pour recevoir le lien.');
        return;
      }
      if (!isValidEmail(email)) {
        Alert.alert('Email invalide', 'Vérifie le format de ton email.');
        return;
      }
      setLoading(true);
      try {
        const { error } = await resetPasswordForEmail(email.trim());
        if (error) {
          Alert.alert('Envoi échoué', error.message);
          return;
        }
        Alert.alert(
          'Email envoyé',
          'Vérifie ta boîte mail. Le lien te ramène dans l\'app pour créer un nouveau mot de passe.',
          [{ text: 'OK', onPress: () => setMode('signin') }],
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email || !password) {
      Alert.alert('Champs manquants', 'Email et mot de passe requis.');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Email invalide', 'Vérifie le format de ton email.');
      return;
    }
    if (mode === 'register' && !isValidPassword(password)) {
      Alert.alert('Mot de passe trop court', '6 caractères minimum.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signin') {
        const { error } = await signInWithPassword(email.trim(), password);
        if (error) {
          Alert.alert('Connexion échouée', error.message);
          setLoading(false);
          return;
        }
        clearSessionExpired();
        // Session reçue via onAuthStateChange → ProgressContext recharge.
        // Le routeur bascule vers TabNavigator automatiquement.
        // Pas de callback onRegistered ni de migration ici : l'utilisateur a
        // déjà son profil Supabase, on ne touche pas à ses données.
        return;
      }

      // Mode register
      const { user, error } = await signUpWithPassword(email.trim(), password);
      if (error) {
        Alert.alert('Création échouée', error.message);
        setLoading(false);
        return;
      }
      if (!user) {
        Alert.alert('Erreur', 'Compte non créé. Réessaie.');
        setLoading(false);
        return;
      }

      // D24 : fenêtre démarrage différé ?
      const hoursRemaining = hoursUntilNextLocalMidnight();
      const requiresStartChoice = hoursRemaining > 0 && hoursRemaining <= D24_THRESHOLD_HOURS;
      const accountCreatedAtIso = new Date().toISOString();

      // Sprint B email confirm — Supabase a "Confirm email" ON. Si on n'a pas
      // de session immédiate, on stocke pendingMigration et on affiche
      // EmailPendingScreen via RootNavigator. La migration se déclenche
      // automatiquement quand la session arrive post-confirmation.
      //
      // L'email est stocké AVEC le pending : EmailPendingScreen en a besoin
      // immédiatement (saisie code OTP + renvoi) sans attendre un reload.
      await markPendingMigration(user.id, accountCreatedAtIso, email.trim());

      // Si Supabase a renvoyé une session immédiatement (Confirm email OFF
      // côté dashboard), on peut migrer tout de suite et passer à la suite.
      // Sinon, RootNavigator détectera pendingMigration et affichera
      // EmailPendingScreen.
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        await migrateLocalToRemote(user.id, accountCreatedAtIso);
        onRegistered({ requiresStartChoice });
      }
      // Sinon : on laisse RootNavigator router vers EmailPendingScreen au
      // prochain render via pendingMigration. Pas de callback onRegistered.
    } catch (e: any) {
      Alert.alert('Erreur', e.message ?? 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const isRegister = mode === 'register';
  const isForgot = mode === 'forgot';
  const title = isForgot
    ? 'Mot de passe oublié.'
    : isRegister
      ? 'On crée ton compte.'
      : 'Te revoilà.';
  const subtitle = isForgot
    ? 'Saisis ton email. On t\'envoie un lien pour créer un nouveau mot de passe.'
    : isRegister
      ? 'Tes 14 premiers jours sont gratuits. On a juste besoin de ton email pour sauvegarder ta progression.'
      : 'Connecte-toi avec ton email pour retrouver ton parcours.';
  const ctaLabel = isForgot
    ? 'Recevoir le lien'
    : isRegister
      ? 'Créer mon compte'
      : 'Me connecter';
  const toggleLabel = isForgot
    ? 'Retour à la connexion'
    : isRegister
      ? "J'ai déjà un compte"
      : 'Créer un compte';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.body}>
          <View>
            {sessionExpired && mode === 'signin' && (
              <View style={styles.expiredBanner}>
                <Text style={styles.expiredBannerText}>
                  Ta session a expiré. Reconnecte-toi pour reprendre ton parcours.
                </Text>
              </View>
            )}
            <Text style={styles.marker}>
              {isRegister ? 'ÉTAPE 10 SUR 10' : isForgot ? 'MOT DE PASSE OUBLIÉ' : 'CONNEXION'}
            </Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>

            <View style={styles.inputs}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={neutralColors.textMuted}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
              {!isForgot && (
                <PasswordInput
                  placeholder={
                    isRegister ? 'Mot de passe (6 caractères min)' : 'Mot de passe'
                  }
                  placeholderTextColor={neutralColors.textMuted}
                  autoComplete={isRegister ? 'password-new' : 'current-password'}
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                />
              )}
            </View>
          </View>

          <View style={styles.actions}>
            <Button
              label={ctaLabel}
              onPress={handleSubmit}
              loading={loading}
              IconRight={ArrowRight}
              fullWidth
              size="large"
            />
            <Button
              label={toggleLabel}
              variant="ghost"
              onPress={() => {
                if (isForgot) {
                  setMode('signin');
                } else if (!isRegister && onSignupRedirect) {
                  // Entrée depuis la slide 1 onboarding : la création de
                  // compte passe par l'onboarding complet, pas par ce toggle.
                  onSignupRedirect();
                } else {
                  setMode(isRegister ? 'signin' : 'register');
                }
              }}
              disabled={loading}
              fullWidth
            />
            {mode === 'signin' && (
              <Button
                label="Mot de passe oublié ?"
                variant="ghost"
                onPress={() => setMode('forgot')}
                disabled={loading}
                fullWidth
              />
            )}
            {isRegister && (
              <Text style={styles.fine}>
                En créant ton compte, tu acceptes nos{' '}
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
            )}
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
  inputs: { gap: space[3], marginTop: space[6] },
  input: {
    backgroundColor: neutralColors.surfaceElevated,
    borderRadius: radiusV1.md,
    borderWidth: 1.5,
    borderColor: neutralColors.borderVisible,
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    fontFamily: getInterFamily('400'),
    fontSize: 17,
    color: brandColors.deep,
  },
  actions: { gap: space[3], marginBottom: space[5] },
  fine: {
    ...interTextStyle('caption'),
    color: pillarColors.phase0.text,
    opacity: 0.7,
    textAlign: 'center',
  },
  link: {
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  expiredBanner: {
    backgroundColor: neutralColors.surfaceElevated,
    borderRadius: radiusV1.md,
    borderLeftWidth: 3,
    borderLeftColor: brandColors.deep,
    padding: space[3],
    marginBottom: space[5],
  },
  expiredBannerText: {
    ...interTextStyle('body'),
    color: brandColors.deep,
  },
});

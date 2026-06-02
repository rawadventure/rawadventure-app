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
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import { Button } from '../../components/primitives';
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
};

export default function RegisterScreen({ onRegistered }: RegisterScreenProps) {
  const { signUpWithPassword, signInWithPassword, resetPasswordForEmail } = useAuth();
  const { migrateLocalToRemote } = useProgress();
  const [mode, setMode] = useState<Mode>('register');
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
    if (mode === 'register' && password.length < 6) {
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

      // Migration AsyncStorage → Supabase (M7+A3). accountCreatedAt provisoire
      // en cas de D24 ; IA-10b le réécrira.
      await migrateLocalToRemote(user.id, new Date().toISOString());

      onRegistered({ requiresStartChoice });
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
            <Text style={styles.marker}>
              {isRegister ? 'ÉTAPE 10 SUR 10' : 'CONNEXION'}
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
                <TextInput
                  style={styles.input}
                  placeholder={
                    isRegister ? 'Mot de passe (6 caractères min)' : 'Mot de passe'
                  }
                  placeholderTextColor={neutralColors.textMuted}
                  secureTextEntry
                  autoCapitalize="none"
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
                En créant ton compte, tu acceptes nos CGU et notre politique de
                confidentialité. [copy à valider]
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
});

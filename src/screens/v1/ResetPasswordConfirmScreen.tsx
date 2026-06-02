/**
 * ResetPasswordConfirmScreen — saisie nouveau mot de passe post-deep link.
 *
 * Sprint A auth — affiché par RootNavigator quand AuthContext signale
 * `passwordRecoveryMode = true` (déclenché par l'event Supabase
 * `PASSWORD_RECOVERY` à l'ouverture du deep link `rawadventure://reset-password`
 * cliqué depuis l'email de reset).
 *
 * Une fois `updateUser({ password })` réussi, AuthContext repasse
 * `passwordRecoveryMode` à false et le RootNavigator résout l'état suivant
 * (TabNavigator si session active, RegisterScreen sinon).
 *
 * Identifiant écran : IA-Reset (pas d'IA-XX historique — ajouté Sprint A).
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

export default function ResetPasswordConfirmScreen() {
  const { updateUserPassword, clearPasswordRecoveryMode, signOut } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password || !confirm) {
      Alert.alert('Champs manquants', 'Saisis le nouveau mot de passe deux fois.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Mot de passe trop court', '6 caractères minimum.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Mots de passe différents', 'Les deux saisies ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await updateUserPassword(password);
      if (error) {
        Alert.alert('Mise à jour échouée', error.message);
        return;
      }
      Alert.alert(
        'Mot de passe mis à jour',
        'Tu peux maintenant continuer ton parcours.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    // L'utilisateur annule : on signOut pour éviter de rester dans une session
    // de récupération sans avoir confirmé un nouveau password.
    clearPasswordRecoveryMode();
    await signOut();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.body}>
          <View>
            <Text style={styles.marker}>RÉINITIALISATION</Text>
            <Text style={styles.title}>Nouveau mot de passe.</Text>
            <Text style={styles.subtitle}>
              Choisis un mot de passe d'au moins 6 caractères. Tu pourras te connecter
              avec à la prochaine ouverture.
            </Text>

            <View style={styles.inputs}>
              <TextInput
                style={styles.input}
                placeholder="Nouveau mot de passe"
                placeholderTextColor={neutralColors.textMuted}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirme le mot de passe"
                placeholderTextColor={neutralColors.textMuted}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
                value={confirm}
                onChangeText={setConfirm}
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.actions}>
            <Button
              label="Mettre à jour"
              onPress={handleSubmit}
              loading={loading}
              IconRight={ArrowRight}
              fullWidth
              size="large"
            />
            <Button
              label="Annuler"
              variant="ghost"
              onPress={handleCancel}
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
});

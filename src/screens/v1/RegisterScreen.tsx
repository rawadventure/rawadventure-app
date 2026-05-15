/**
 * RegisterScreen — IA-10 V1 (création de compte fin d'onboarding).
 *
 * Réf IA V3 §IA-10 + Feature Spec V1 Socle minimum §2.10 (migration local
 * → distant à la création de compte) + D24 (démarrage différé optionnel).
 *
 * Différence majeure vs V0 AuthScreen :
 *  - IA-10 V1 est la SUITE de l'onboarding (l'utilisateur a déjà répondu au
 *    questionnaire). Pas un écran de login isolé en amont. Ici on crée le
 *    compte uniquement, le signIn existant passe par un autre écran.
 *  - À la sortie réussie de signUp, on appelle `migrateLocalToRemote` qui
 *    pousse les 9 clés AsyncStorage anonymes vers Supabase.
 *  - Calcule `accountCreatedAt` selon D24 : `now()` si > 4h avant minuit local,
 *    sinon délègue le choix à IA-10b via `onRequireStartChoice()`.
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

export type RegisterScreenProps = {
  /**
   * Callback invoqué après création de compte réussie + migration AsyncStorage.
   * - Si paramètre `requiresStartChoice` est true (heure locale dans la fenêtre
   *   D24), le routeur doit afficher IA-10b. L'`accountCreatedAt` n'est PAS
   *   encore posé — c'est IA-10b qui le fixera.
   * - Sinon, l'`accountCreatedAt` est déjà posé sur `now()` et l'app peut
   *   enchaîner sur IA-12 (vidéo bienvenue) puis TabNavigator.
   */
  onRegistered: (args: { requiresStartChoice: boolean }) => void;
};

export default function RegisterScreen({ onRegistered }: RegisterScreenProps) {
  const { signUpWithPassword } = useAuth();
  const { migrateLocalToRemote } = useProgress();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Champs manquants', 'Email et mot de passe requis.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Mot de passe trop court', '6 caractères minimum.');
      return;
    }
    setLoading(true);
    try {
      const { user, error } = await signUpWithPassword(email.trim(), password);
      if (error) {
        Alert.alert('Erreur', error.message);
        setLoading(false);
        return;
      }
      if (!user) {
        Alert.alert('Erreur', 'Compte non créé. Réessaie.');
        setLoading(false);
        return;
      }

      // D24 : décision de démarrage immédiat ou différé.
      const hoursRemaining = hoursUntilNextLocalMidnight();
      const requiresStartChoice = hoursRemaining > 0 && hoursRemaining <= D24_THRESHOLD_HOURS;

      // Si pas de fenêtre D24 → on pose accountCreatedAt = now() tout de suite
      // et on migre. Sinon IA-10b se chargera de poser accountCreatedAt.
      if (!requiresStartChoice) {
        await migrateLocalToRemote(user.id, new Date().toISOString());
      } else {
        // Migration immédiate aussi MAIS sans poser accountCreatedAt définitif.
        // On utilise now() comme valeur temporaire ; IA-10b le réécrira.
        await migrateLocalToRemote(user.id, new Date().toISOString());
      }

      onRegistered({ requiresStartChoice });
    } catch (e: any) {
      Alert.alert('Erreur', e.message ?? 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.body}>
          <Text style={styles.marker}>ÉTAPE 10 SUR 10</Text>
          <Text style={styles.title}>On crée ton compte.</Text>
          <Text style={styles.subtitle}>
            Tes 14 premiers jours sont gratuits. On a juste besoin de ton email pour
            sauvegarder ta progression.
          </Text>

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
            <TextInput
              style={styles.input}
              placeholder="Mot de passe (6 caractères min)"
              placeholderTextColor={neutralColors.textMuted}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
          </View>

          <View style={styles.actions}>
            <Button
              label="Créer mon compte"
              onPress={handleRegister}
              loading={loading}
              IconRight={ArrowRight}
              fullWidth
              size="large"
            />
            <Text style={styles.fine}>
              En créant ton compte, tu acceptes nos CGU et notre politique de
              confidentialité. [copy à valider]
            </Text>
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

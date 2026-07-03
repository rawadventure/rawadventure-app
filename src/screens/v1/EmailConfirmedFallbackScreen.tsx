/**
 * EmailConfirmedFallbackScreen — atterrissage web `/confirm-email` hors contexte.
 *
 * Sprint C auth PWA. Affiché quand le lien de confirmation email est ouvert
 * dans un navigateur qui ne porte PAS l'état local du signup (cas typique :
 * PWA installée sur l'écran d'accueil iOS → click lien depuis Gmail → iOS
 * ouvre un Safari fresh, jamais la PWA). Sans cet écran, l'utilisateur
 * retombait sur l'onboarding slide 1 dans le mauvais navigateur.
 *
 * Le compte est bien confirmé côté Supabase — on l'invite simplement à
 * retourner dans son app d'origine. Aucune action possible ici, c'est un
 * cul-de-sac assumé.
 *
 * Détection côté RootNavigator : `pathname === '/confirm-email'` (web) et
 * pas de `pendingMigration` locale (un Safari classique qui partage le
 * localStorage a la pendingMigration → il migre et entre dans l'app).
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2 } from 'lucide-react-native';
import {
  interTextStyle,
  layout,
  pillarColors,
  space,
} from '../../theme';

export default function EmailConfirmedFallbackScreen() {
  // Supabase renvoie les erreurs (lien expiré / déjà utilisé) dans le hash :
  // `#error=access_denied&error_code=otp_expired&...`.
  const linkFailed =
    typeof window !== 'undefined' && window.location.hash.includes('error=');

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.body}>
        <View style={styles.head}>
          <Text style={styles.marker}>RAW ADVENTURE</Text>
          <View style={styles.iconRow}>
            <CheckCircle2 size={48} color={pillarColors.phase0.text} />
          </View>
          {linkFailed ? (
            <>
              <Text style={styles.title}>Lien expiré{'\n'}ou déjà utilisé.</Text>
              <Text style={styles.subtitle}>
                Retourne dans Raw Adventure — l'app sur ton écran d'accueil ou
                l'onglet resté ouvert. Tu peux y saisir le code reçu par email,
                ou demander un nouvel email.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.title}>Email confirmé.</Text>
              <Text style={styles.subtitle}>
                Ton compte est activé. Retourne dans Raw Adventure — l'app sur
                ton écran d'accueil ou l'onglet resté ouvert — pour continuer.
                {'\n\n'}
                Si on te demande un code, il se trouve dans l'email que tu as
                reçu.
              </Text>
            </>
          )}
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
  },
  head: { gap: space[4] },
  marker: {
    ...interTextStyle('caption'),
    color: pillarColors.phase0.text,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    opacity: 0.7,
  },
  iconRow: { marginTop: space[4] },
  title: {
    ...interTextStyle('display'),
    color: pillarColors.phase0.text,
  },
  subtitle: {
    ...interTextStyle('bodyLarge'),
    color: pillarColors.phase0.text,
  },
});

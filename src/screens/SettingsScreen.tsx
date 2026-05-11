import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert, ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius } from '../theme';
import { useAuth } from '../hooks/AuthContext';
import { supabase } from '../lib/supabase';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

export default function SettingsScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();
  const [loadingReset, setLoadingReset] = useState(false);
  const [resetSent,    setResetSent]    = useState(false);

  // ── Déconnexion ────────────────────────────────────────────────────────────
  const handleSignOut = () => {
    Alert.alert(
      'Se déconnecter',
      'Tu vas être déconnecté de ton compte.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Se déconnecter', style: 'destructive', onPress: signOut },
      ],
    );
  };

  // ── Réinitialisation mot de passe ──────────────────────────────────────────
  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setLoadingReset(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: 'https://rawadventure.world/reset-password',
      });
      if (error) throw error;
      setResetSent(true);
    } catch (e: any) {
      Alert.alert('Erreur', e.message || 'Une erreur est survenue.');
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon compte</Text>
        <View style={{ width: 80 }} />
      </View>

      <View style={styles.content}>

        {/* Profil */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>
              {user?.email?.[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <Text style={styles.profileSub}>Compte Raw Adventure</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsGroup}>

          {/* Reset mot de passe */}
          <TouchableOpacity
            style={styles.actionRow}
            onPress={handlePasswordReset}
            disabled={loadingReset || resetSent}
          >
            <Text style={styles.actionEmoji}>🔑</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Changer le mot de passe</Text>
              {resetSent
                ? <Text style={styles.actionSuccess}>Email envoyé — vérifie ta boîte mail ✓</Text>
                : <Text style={styles.actionDesc}>Un lien te sera envoyé par email</Text>
              }
            </View>
            {loadingReset
              ? <ActivityIndicator color={colors.green} size="small" />
              : <Text style={styles.actionChevron}>›</Text>
            }
          </TouchableOpacity>

        </View>

        {/* Déconnexion */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Se déconnecter</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Raw Adventure · v1.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn:   { flexDirection: 'row', alignItems: 'center', gap: 4, width: 80 },
  backArrow: { fontSize: 28, color: colors.green, lineHeight: 30 },
  backText:  { fontSize: 16, color: colors.green },
  headerTitle: { fontSize: 17, fontWeight: '600', color: colors.white },

  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.xl,
  },

  // Profil
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: { fontSize: 22, fontWeight: '700', color: colors.white },
  profileInfo:  { flex: 1 },
  profileEmail: { fontSize: 16, fontWeight: '600', color: colors.white },
  profileSub:   { fontSize: 13, color: colors.gray, marginTop: 2 },

  // Actions
  actionsGroup: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  actionEmoji:   { fontSize: 22, width: 30 },
  actionContent: { flex: 1, gap: 2 },
  actionTitle:   { fontSize: 16, color: colors.white },
  actionDesc:    { fontSize: 13, color: colors.gray },
  actionSuccess: { fontSize: 13, color: colors.greenLight },
  actionChevron: { fontSize: 22, color: colors.gray },

  // Déconnexion
  signOutBtn: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#FF3B3044',
    padding: spacing.md,
    alignItems: 'center',
  },
  signOutText: { fontSize: 16, fontWeight: '600', color: '#FF6B6B' },

  version: { textAlign: 'center', fontSize: 12, color: colors.border },
});

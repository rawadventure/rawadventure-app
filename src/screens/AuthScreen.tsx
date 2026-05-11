import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator,
  ScrollView,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { colors, spacing, radius } from '../theme';

type Mode = 'login' | 'register' | 'forgot';

export default function AuthScreen() {
  const [mode,     setMode]     = useState<Mode>('login');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  const switchMode = (m: Mode) => {
    setMode(m);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    // ── Mot de passe oublié ──────────────────────────────────────────────────
    if (mode === 'forgot') {
      if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
        setError('Entre une adresse email valide.');
        return;
      }
      setLoading(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(
          email.trim().toLowerCase(),
          { redirectTo: 'https://rawadventure.world/reset-password' },
        );
        if (error) throw error;
        setSuccess('Email envoyé ! Vérifie ta boîte mail pour réinitialiser ton mot de passe.');
        switchMode('login');
      } catch (e: any) {
        setError(e?.message || 'Une erreur est survenue.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // ── Login / Register ─────────────────────────────────────────────────────
    if (!email.trim() || !password) {
      setError('Remplis tous les champs.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Adresse email invalide.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
        });
        if (error) throw error;
        setSuccess('Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.');
        switchMode('login');
      }
    } catch (e: any) {
      const msg: string = e?.message ?? '';
      if (msg.includes('Invalid login credentials'))
        setError('Email ou mot de passe incorrect.');
      else if (msg.includes('User already registered') || msg.includes('already been registered'))
        setError('Cet email est déjà utilisé. Connecte-toi.');
      else if (msg.includes('Email not confirmed'))
        setError('Vérifie ta boîte mail pour confirmer ton compte avant de te connecter.');
      else if (msg.includes('Too many requests'))
        setError('Trop de tentatives. Attends quelques minutes.');
      else
        setError(msg || 'Une erreur est survenue. Réessaie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.brand}>⚡️ RAW ADVENTURE</Text>
            <Text style={styles.h1}>
              {mode === 'login' ? 'Content de te revoir.' : "Commence l'aventure."}
            </Text>
            <Text style={styles.sub}>
              {mode === 'login'
                ? 'Connecte-toi pour retrouver ta progression.'
                : 'Crée ton compte en 30 secondes.'}
            </Text>
          </View>

          {/* Onglets (masqués en mode "forgot") */}
          {mode !== 'forgot' && (
            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tab, mode === 'login' && styles.tabActive]}
                onPress={() => switchMode('login')}
              >
                <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
                  Connexion
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, mode === 'register' && styles.tabActive]}
                onPress={() => switchMode('register')}
              >
                <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>
                  Inscription
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Formulaire */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="ton@email.com"
                placeholderTextColor={colors.border}
                returnKeyType="next"
              />
            </View>

            {mode !== 'forgot' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mot de passe</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder={mode === 'register' ? 'Minimum 6 caractères' : '••••••••'}
                  placeholderTextColor={colors.border}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
                {mode === 'login' && (
                  <TouchableOpacity onPress={() => switchMode('forgot')} style={styles.forgotBtn}>
                    <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Message d'erreur */}
            {error !== '' && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️  {error}</Text>
              </View>
            )}

            {/* Message de succès */}
            {success !== '' && (
              <View style={styles.successBox}>
                <Text style={styles.successText}>✅  {success}</Text>
              </View>
            )}

            {/* Bouton principal */}
            <TouchableOpacity
              style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color={colors.white} />
                : <Text style={styles.primaryBtnText}>
                    {mode === 'login'
                      ? 'Se connecter →'
                      : mode === 'register'
                        ? 'Créer mon compte →'
                        : 'Envoyer le lien →'}
                  </Text>
              }
            </TouchableOpacity>

            {/* Retour depuis "mot de passe oublié" */}
            {mode === 'forgot' && (
              <TouchableOpacity onPress={() => switchMode('login')} style={styles.forgotBtn}>
                <Text style={styles.forgotText}>‹ Retour à la connexion</Text>
              </TouchableOpacity>
            )}

            {/* Mentions légales */}
            {mode === 'register' && (
              <Text style={styles.legal}>
                En créant un compte, tu acceptes nos Conditions Générales d'Utilisation et notre
                Politique de Confidentialité.
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.background },
  kav:    { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    justifyContent: 'center',
    gap: spacing.xl,
  },

  header: { gap: spacing.sm, paddingTop: spacing.xl },
  brand:  { fontSize: 13, fontWeight: '800', color: colors.green, letterSpacing: 3 },
  h1:     { fontSize: 30, fontWeight: '700', color: colors.white, lineHeight: 38 },
  sub:    { fontSize: 16, color: colors.gray, lineHeight: 24 },

  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  tabActive:     { backgroundColor: colors.green },
  tabText:       { fontSize: 15, fontWeight: '600', color: colors.gray },
  tabTextActive: { color: colors.white },

  form:       { gap: spacing.md },
  inputGroup: { gap: 8 },
  label:      {
    fontSize: 12,
    fontWeight: '700',
    color: colors.green,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.white,
  },

  errorBox: {
    backgroundColor: '#FF3B3018',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#FF3B3055',
    padding: spacing.md,
  },
  errorText: { fontSize: 14, color: '#FF6B6B', lineHeight: 20 },

  successBox: {
    backgroundColor: colors.greenDark + '33',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.green + '66',
    padding: spacing.md,
  },
  successText: { fontSize: 14, color: colors.greenLight, lineHeight: 20 },

  primaryBtn: {
    backgroundColor: colors.green,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText:     { fontSize: 17, fontWeight: '700', color: colors.white },
  forgotBtn:  { alignItems: 'flex-end', marginTop: 4 },
  forgotText: { fontSize: 13, color: colors.green },

  legal: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: spacing.sm,
  },
});

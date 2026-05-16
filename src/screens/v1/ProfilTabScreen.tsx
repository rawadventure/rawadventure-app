/**
 * ProfilTabScreen — IA-70 (placeholder Sprint 4).
 *
 * Réf IA V3 §IA-70 + design system V1.1 Pattern G (§10.7).
 *
 * Placeholder Sprint 4 : affiche infos minimales du parcours (jour courant,
 * streak, joker dispo, profil dynamique) + bouton signOut. L'écran complet
 * IA-70 avec wordmark, gestion abonnement (IA-71), paramètres (IA-72), aide
 * (IA-73), légal (IA-74/75), galerie paliers (IA-51) viendra en Sprint 5+.
 *
 * Référence IA : IA-70. Pattern : G.
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PillarHeader, StreakBubble } from '../../components/compositions';
import { Button, Card } from '../../components/primitives';
import { brandColors, interTextStyle, neutralColors, space } from '../../theme';
import { useAuth } from '../../hooks/AuthContext';
import { useProgress } from '../../hooks/ProgressContext';

export default function ProfilTabScreen() {
  const { user, signOut } = useAuth();
  const {
    currentDay,
    currentPhase,
    streak,
    jokerAvailable,
    profileDynamicId,
    accountCreatedAt,
    resetAll,
    seedDevStreak,
    seedDevPillarDay,
  } = useProgress();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: space[8] }}>
        <PillarHeader context="neutral" marker="Raw Adventure" title="Profil" />
        <View style={styles.body}>
          <Card title={user?.email ?? '(mode anonyme)'} subtitle="Compte" />

          <Card title="Parcours" subtitle="État actuel">
            <View style={styles.row}>
              <Text style={styles.label}>Jour :</Text>
              <Text style={styles.value}>{currentDay || '—'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Phase :</Text>
              <Text style={styles.value}>{currentPhase}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Profil dynamique :</Text>
              <Text style={styles.value}>{profileDynamicId ?? '—'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Démarré le :</Text>
              <Text style={styles.value}>
                {accountCreatedAt ? new Date(accountCreatedAt).toLocaleDateString('fr-FR') : '—'}
              </Text>
            </View>
          </Card>

          <Card title="Streak" subtitle={`Joker hebdo : ${jokerAvailable ? 'disponible' : 'consommé'}`}>
            <View style={{ alignItems: 'flex-start', marginTop: space[2] }}>
              <StreakBubble days={streak} />
            </View>
          </Card>

          <View style={styles.actions}>
            <Button label="Se déconnecter" variant="secondary" onPress={signOut} fullWidth />
            {__DEV__ && (
              <>
                <Button
                  label="(DEV) Aller au jour 3"
                  variant="ghost"
                  onPress={() => seedDevStreak(3)}
                  fullWidth
                />
                <Button
                  label="(DEV) Aller au jour 7 (palier)"
                  variant="ghost"
                  onPress={() => seedDevStreak(7)}
                  fullWidth
                />
                <Button
                  label="(DEV) Aller au jour 14"
                  variant="ghost"
                  onPress={() => seedDevStreak(14)}
                  fullWidth
                />
                <Button
                  label="(DEV) Aller au jour 15 (S0.1)"
                  variant="ghost"
                  onPress={() => seedDevStreak(15)}
                  fullWidth
                />
                <Button
                  label="(DEV) Aller au jour 16 (S0.2)"
                  variant="ghost"
                  onPress={() => seedDevStreak(16)}
                  fullWidth
                />
                <Button
                  label="(DEV) S1 — Jour 7 (éval finale)"
                  variant="ghost"
                  onPress={() => seedDevPillarDay('S1', 7)}
                  fullWidth
                />
                <Button
                  label="(DEV) S1 — Jour 1"
                  variant="ghost"
                  onPress={() => seedDevPillarDay('S1', 1)}
                  fullWidth
                />
                <Button
                  label="(DEV) Reset complet"
                  variant="destructive"
                  onPress={resetAll}
                  fullWidth
                />
              </>
            )}
          </View>

          <Text style={styles.note}>
            Sprint 4 — placeholder. L'écran IA-70 complet (abonnement, paramètres, aide,
            galerie paliers, légal) viendra en Sprint 5+.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: brandColors.cream },
  body: { padding: space[5], gap: space[4] },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: space[1] },
  label: { ...interTextStyle('body'), color: neutralColors.textSecondary },
  value: { ...interTextStyle('bodyLargeEmphasis'), color: brandColors.deep },
  actions: { gap: space[3], marginTop: space[5] },
  note: {
    ...interTextStyle('caption'),
    color: neutralColors.textSecondary,
    textAlign: 'center',
    marginTop: space[6],
  },
});

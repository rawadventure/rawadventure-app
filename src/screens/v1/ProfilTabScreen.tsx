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

import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import {
  cancelAllNotifications,
  requestNotificationPermission,
  scheduleLocalNotification,
} from '../../lib/notifications';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PillarHeader, StreakBubble } from '../../components/compositions';
import { Button, Card } from '../../components/primitives';
import { brandColors, interTextStyle, neutralColors, pillarColors, space } from '../../theme';
import { useAuth } from '../../hooks/AuthContext';
import { useProgress } from '../../hooks/ProgressContext';
import { useSubscription } from '../../hooks/SubscriptionContext';
import { supabase } from '../../lib/supabase';
import type { ProfilStackParamList } from '../../navigation/ProfilStack';

type Nav = NativeStackNavigationProp<ProfilStackParamList>;

export default function ProfilTabScreen() {
  const navigation = useNavigation<Nav>();
  const { user, signOut } = useAuth();
  const {
    state: subscriptionState,
    isActive: subscriptionActive,
    setMockSubscriptionState,
    resetSubscription,
    reload: reloadSubscription,
  } = useSubscription();
  const [portalLoading, setPortalLoading] = useState(false);

  /**
   * Ouvre le Stripe Customer Portal pour ce user.
   *
   * Flow :
   *  1. Call Edge Function `stripe-portal` avec JWT Authorization
   *  2. Reçoit URL Stripe portal session
   *  3. Ouvre via SFSafariViewController (iOS) / Custom Tabs (Android)
   *  4. User gère son abonnement (cancel, change plan, payment method, factures)
   *  5. Stripe redirect rawadventure.world/account-returned au close
   *  6. App détecte close manuel → reload SubscriptionContext
   *     (webhook customer.subscription.updated aura déjà MAJ row Supabase)
   */
  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        Alert.alert('Erreur', 'Tu dois être connecté pour gérer ton abonnement.');
        return;
      }

      const supabaseUrl = (supabase as any).supabaseUrl ?? '';
      const response = await fetch(`${supabaseUrl}/functions/v1/stripe-portal`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert(
          'Impossible d\'ouvrir le portail',
          data.message ?? data.error ?? 'Réessaie dans un instant.',
        );
        return;
      }

      if (!data.url) {
        Alert.alert('Erreur', 'Pas d\'URL retournée par le serveur.');
        return;
      }

      const result = await WebBrowser.openBrowserAsync(data.url, {
        toolbarColor: pillarColors.phase0.bg,
        controlsColor: pillarColors.phase0.text,
        dismissButtonStyle: 'close',
      });

      // Au close manuel, reload state (webhook a probablement firé entre-temps).
      if (result.type === 'cancel' || result.type === 'dismiss') {
        await reloadSubscription();
      }
    } catch (e: any) {
      Alert.alert(
        'Erreur',
        e.message ?? 'Impossible d\'ouvrir le portail. Vérifie ta connexion.',
      );
    } finally {
      setPortalLoading(false);
    }
  };
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

          <Card title="Mon abonnement" subtitle={subscriptionState.status}>
            <View style={styles.row}>
              <Text style={styles.label}>Statut :</Text>
              <Text style={styles.value}>{subscriptionState.status}</Text>
            </View>
            {subscriptionState.plan && (
              <View style={styles.row}>
                <Text style={styles.label}>Plan :</Text>
                <Text style={styles.value}>{subscriptionState.plan}</Text>
              </View>
            )}
            {subscriptionState.renewsAt && (
              <View style={styles.row}>
                <Text style={styles.label}>Renouvellement :</Text>
                <Text style={styles.value}>
                  {new Date(subscriptionState.renewsAt).toLocaleDateString('fr-FR')}
                </Text>
              </View>
            )}
            {/* Bouton portail Stripe — visible seulement si user a un abonnement
                (status != 'free'). En 'free', user n'a pas encore de
                stripe_customer_id → l'Edge Function renverrait 404. */}
            {subscriptionState.status !== 'free' && (
              <Button
                label="Gérer mon abonnement"
                variant="secondary"
                onPress={handleManageSubscription}
                loading={portalLoading}
                fullWidth
                style={{ marginTop: space[3] }}
              />
            )}
          </Card>

          <Card title="Streak" subtitle={`Joker hebdo : ${jokerAvailable ? 'disponible' : 'consommé'}`}>
            <View style={{ alignItems: 'flex-start', marginTop: space[2] }}>
              <StreakBubble days={streak} />
            </View>
            <Button
              label="Voir mes paliers"
              variant="secondary"
              onPress={() => navigation.navigate('PaliersGallery')}
              fullWidth
              style={{ marginTop: space[3] }}
            />
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
                  label="(DEV) Aller au jour 11 (charnière)"
                  variant="ghost"
                  onPress={() => seedDevStreak(11)}
                  fullWidth
                />
                <Button
                  label="(DEV) Aller au jour 14 (charnière)"
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
                  label="(DEV) Lancer éval initiale S2"
                  variant="ghost"
                  onPress={() => navigation.navigate('PillarEvaluation', { pillarId: 'S2', evaluationType: 'initial' })}
                  fullWidth
                />
                <Button
                  label="(DEV) Lancer éval initiale S3"
                  variant="ghost"
                  onPress={() => navigation.navigate('PillarEvaluation', { pillarId: 'S3', evaluationType: 'initial' })}
                  fullWidth
                />
                <Button
                  label="(DEV) Lancer éval initiale S4"
                  variant="ghost"
                  onPress={() => navigation.navigate('PillarEvaluation', { pillarId: 'S4', evaluationType: 'initial' })}
                  fullWidth
                />
                <Button
                  label="(DEV) Lancer éval initiale S5"
                  variant="ghost"
                  onPress={() => navigation.navigate('PillarEvaluation', { pillarId: 'S5', evaluationType: 'initial' })}
                  fullWidth
                />
                <Button
                  label="(DEV) Lancer éval initiale S6"
                  variant="ghost"
                  onPress={() => navigation.navigate('PillarEvaluation', { pillarId: 'S6', evaluationType: 'initial' })}
                  fullWidth
                />
                <Button
                  label="(DEV) Lancer éval initiale S7"
                  variant="ghost"
                  onPress={() => navigation.navigate('PillarEvaluation', { pillarId: 'S7', evaluationType: 'initial' })}
                  fullWidth
                />
                <Button
                  label="(DEV) Lancer éval initiale S8"
                  variant="ghost"
                  onPress={() => navigation.navigate('PillarEvaluation', { pillarId: 'S8', evaluationType: 'initial' })}
                  fullWidth
                />
                <Button
                  label="(DEV) S2 Activité physique — Jour 1"
                  variant="ghost"
                  onPress={() => seedDevPillarDay('S2', 1)}
                  fullWidth
                />
                <Button
                  label="(DEV) S3 Alimentation — Jour 1"
                  variant="ghost"
                  onPress={() => seedDevPillarDay('S3', 1)}
                  fullWidth
                />
                <Button
                  label="(DEV) S4 Connexion vivant — Jour 1"
                  variant="ghost"
                  onPress={() => seedDevPillarDay('S4', 1)}
                  fullWidth
                />
                <Button
                  label="(DEV) S5 Repos & régé. — Jour 1"
                  variant="ghost"
                  onPress={() => seedDevPillarDay('S5', 1)}
                  fullWidth
                />
                <Button
                  label="(DEV) S6 Passion — Jour 1"
                  variant="ghost"
                  onPress={() => seedDevPillarDay('S6', 1)}
                  fullWidth
                />
                <Button
                  label="(DEV) S7 Mindset — Jour 1"
                  variant="ghost"
                  onPress={() => seedDevPillarDay('S7', 1)}
                  fullWidth
                />
                <Button
                  label="(DEV) S8 Élim. & détox — Jour 1"
                  variant="ghost"
                  onPress={() => seedDevPillarDay('S8', 1)}
                  fullWidth
                />
                <Button
                  label="(DEV) S8 — Jour 7 (fin Phase 1)"
                  variant="ghost"
                  onPress={() => seedDevPillarDay('S8', 7)}
                  fullWidth
                />
                <Button
                  label="(DEV) Notif test dans 5s"
                  variant="ghost"
                  onPress={async () => {
                    const perm = await requestNotificationPermission();
                    if (perm !== 'granted') {
                      Alert.alert('Notifications', `Permission: ${perm}`);
                      return;
                    }
                    const id = await scheduleLocalNotification({
                      slot: 'dev.test',
                      title: 'Raw Adventure',
                      body: 'Test notification — Sprint 25 cadre technique. [copy à valider]',
                      triggerAt: new Date(Date.now() + 5000),
                    });
                    Alert.alert('Notifications', id ? `Planifiée (${id.slice(0, 8)}…)` : 'Échec planification');
                  }}
                  fullWidth
                />
                <Button
                  label="(DEV) Annuler toutes notifs"
                  variant="ghost"
                  onPress={async () => {
                    await cancelAllNotifications();
                    Alert.alert('Notifications', 'Toutes annulées');
                  }}
                  fullWidth
                />
                <Button
                  label="(DEV) Replanifier notifs Phase 0"
                  variant="ghost"
                  onPress={async () => {
                    const perm = await requestNotificationPermission();
                    if (perm !== 'granted') {
                      Alert.alert('Notifications', `Permission: ${perm}`);
                      return;
                    }
                    if (!accountCreatedAt) {
                      Alert.alert('Notifications', 'accountCreatedAt manquant — fais le parcours d\'abord');
                      return;
                    }
                    const { schedulePhase0Notifications } = await import(
                      '../../lib/phase0-scheduler'
                    );
                    const res = await schedulePhase0Notifications(
                      new Date(accountCreatedAt),
                    );
                    Alert.alert(
                      'Notifications Phase 0',
                      `Matin 8h : ${res.morningScheduled}\nRappel soir 20h : ${res.reminderScheduled}\nSkip (passées) : ${res.skipped}\nPermission denied : ${res.permissionDenied}`,
                    );
                  }}
                  fullWidth
                />
                <Button
                  label={`(DEV) Subscription : ${subscriptionState.status}`}
                  variant="ghost"
                  onPress={() => {
                    Alert.alert(
                      'Subscription state',
                      `status: ${subscriptionState.status}\nplan: ${subscriptionState.plan ?? '—'}\nrenewsAt: ${subscriptionState.renewsAt ?? '—'}\nisActive: ${subscriptionActive}`,
                    );
                  }}
                  fullWidth
                />
                <Button
                  label="(DEV) Mock subscription → active monthly"
                  variant="ghost"
                  onPress={() => {
                    const now = new Date();
                    const renews = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                    void setMockSubscriptionState({
                      status: 'active',
                      plan: 'monthly',
                      startedAt: now.toISOString(),
                      renewsAt: renews.toISOString(),
                      cancelledAt: null,
                    });
                  }}
                  fullWidth
                />
                <Button
                  label="(DEV) Mock subscription → expired"
                  variant="ghost"
                  onPress={() => {
                    void setMockSubscriptionState({
                      status: 'expired',
                      plan: 'monthly',
                      cancelledAt: new Date().toISOString(),
                    });
                  }}
                  fullWidth
                />
                <Button
                  label="(DEV) Mock subscription → past_due"
                  variant="ghost"
                  onPress={() => {
                    void setMockSubscriptionState({ status: 'past_due' });
                  }}
                  fullWidth
                />
                <Button
                  label="(DEV) Reset subscription → free"
                  variant="ghost"
                  onPress={resetSubscription}
                  fullWidth
                />
                <Button
                  label="(DEV) Reset complet"
                  variant="destructive"
                  onPress={async () => {
                    await resetAll();
                    await resetSubscription();
                  }}
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

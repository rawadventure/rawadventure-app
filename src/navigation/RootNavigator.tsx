/**
 * RootNavigator — orchestre les états du parcours utilisateur (M7 + A3).
 *
 * Réf Feature Spec V1 Socle minimum §2.1 (états globaux), §2.10 (migration
 * local → distant), §2.3 (D24 démarrage différé).
 *
 * INVERSION DU FLOW V0 (chantier M7+A3) : l'onboarding est désormais accessible
 * SANS création de compte. La création de compte intervient à la slide 10
 * (IA-10) uniquement. Conséquences :
 *
 *   1. Pas de session + !onboardingDone → OnboardingScreen (mode anonyme,
 *      AsyncStorage)
 *   2. Pas de session + onboardingDone → IA-10 RegisterScreen (création de
 *      compte avec migration AsyncStorage → Supabase)
 *   3. Session + onboardingDone + `awaitingStartChoice` → IA-10b (D24)
 *   4. Session + accountCreatedAt dans le futur → IA-10c WaitingScreen
 *   5. Session + parcours actif (currentDay >= 1) → TabNavigator (3 onglets)
 *
 * Le cas où un utilisateur a déjà une session existante (réouverture app
 * jours plus tard) est traité par la branche 5 directement — le routeur
 * lit `currentDay` qui est calculé depuis `accountCreatedAt`.
 */

import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../hooks/AuthContext';
import { useProgress } from '../hooks/ProgressContext';
import OnboardingScreen from '../screens/OnboardingScreen';
import RegisterScreen from '../screens/v1/RegisterScreen';
import StartChoiceScreen from '../screens/v1/StartChoiceScreen';
import WaitingScreen from '../screens/v1/WaitingScreen';
import TabNavigator from './TabNavigator';
import { brandColors } from '../theme';
import { computeProfileDynamicId } from '../lib/onboarding';

function LoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: brandColors.cream,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator color={brandColors.deep} size="large" />
    </View>
  );
}

export default function RootNavigator() {
  const { session, loading: authLoading } = useAuth();
  const {
    loading: progressLoading,
    onboardingDone,
    accountCreatedAt,
    currentDay,
    completeOnboarding,
  } = useProgress();

  // État transitoire post-register : si IA-10 a déterminé qu'on est dans la
  // fenêtre D24 (<4h avant minuit local), on affiche IA-10b avant le hub.
  const [awaitingStartChoice, setAwaitingStartChoice] = useState(false);

  // Chargement initial (auth + données)
  if (authLoading || progressLoading) {
    return <LoadingScreen />;
  }

  // 1. Onboarding pas terminé → 10 slides (mode anonyme si pas de session,
  //    Supabase si session existante)
  if (!onboardingDone) {
    return (
      <OnboardingScreen
        onComplete={async (answers) => {
          // Calcule l'ID profil dynamique à partir des réponses brutes.
          const profileId = computeProfileDynamicId({
            energy: answers.energy as unknown as number,
            body: answers.body,
            mental: answers.mental,
            motivation: answers.motivation,
          });
          await completeOnboarding(answers, profileId);
        }}
      />
    );
  }

  // 2. Onboarding terminé mais pas de compte → IA-10 RegisterScreen
  if (!session) {
    return (
      <RegisterScreen
        onRegistered={({ requiresStartChoice }) => {
          if (requiresStartChoice) {
            setAwaitingStartChoice(true);
          }
        }}
      />
    );
  }

  // 3. Post-register en fenêtre D24 → IA-10b ChoiceScreen
  if (awaitingStartChoice) {
    return (
      <StartChoiceScreen
        onChoice={() => {
          setAwaitingStartChoice(false);
          // La destination suivante (TabNavigator ou WaitingScreen) est résolue
          // au prochain render via `accountCreatedAt`.
        }}
      />
    );
  }

  // 4. Session + accountCreatedAt dans le futur → IA-10c WaitingScreen
  if (accountCreatedAt && new Date(accountCreatedAt).getTime() > Date.now()) {
    return <WaitingScreen onStartNow={() => { /* re-render via accountCreatedAt mise à jour */ }} />;
  }

  // 5. Parcours actif (currentDay >= 1) → TabNavigator
  // Sécurité : si pour une raison X accountCreatedAt est null alors qu'on a
  // une session + onboardingDone, on bascule sur TabNavigator quand même —
  // le HomeScreen V0 fera son métier en mode dégradé.
  if (currentDay >= 1 || !accountCreatedAt) {
    return <TabNavigator />;
  }

  return <LoadingScreen />;
}

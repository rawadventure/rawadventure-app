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
import { ActivityIndicator, Platform, View } from 'react-native';
import { useAuth } from '../hooks/AuthContext';
import { useProgress } from '../hooks/ProgressContext';
import OnboardingScreen from '../screens/v1/OnboardingScreenV1';
import EmailConfirmedFallbackScreen from '../screens/v1/EmailConfirmedFallbackScreen';
import RegisterScreen from '../screens/v1/RegisterScreen';
import ResetPasswordConfirmScreen from '../screens/v1/ResetPasswordConfirmScreen';
import EmailPendingScreen from '../screens/v1/EmailPendingScreen';
import StartChoiceScreen from '../screens/v1/StartChoiceScreen';
import WaitingScreen from '../screens/v1/WaitingScreen';
import PaywallScreen from '../screens/v1/PaywallScreen';
import { useSubscription } from '../hooks/SubscriptionContext';
import TabNavigator from './TabNavigator';
import { brandColors } from '../theme';
import { computeProfileDynamicId } from '../lib/onboarding';
import { devNow } from '../lib/devClock';

/**
 * Détecte l'atterrissage web sur le lien de confirmation email
 * (`https://app.rawadventure.world/confirm-email#...`). vercel.json rewrite
 * tout vers index.html, donc le pathname survit au boot de l'app.
 */
function isConfirmEmailLanding(): boolean {
  return (
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    window.location.pathname === '/confirm-email'
  );
}

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
  const { session, loading: authLoading, passwordRecoveryMode } = useAuth();
  const {
    loading: progressLoading,
    onboardingDone,
    accountCreatedAt,
    currentDay,
    currentPhase,
    completeOnboarding,
    pendingMigration,
  } = useProgress();
  const { isActive: subscriptionActive, loading: subscriptionLoading } = useSubscription();

  // État transitoire post-register : si IA-10 a déterminé qu'on est dans la
  // fenêtre D24 (<4h avant minuit local), on affiche IA-10b avant le hub.
  const [awaitingStartChoice, setAwaitingStartChoice] = useState(false);

  // Chargement initial (auth + données + subscription)
  if (authLoading || progressLoading || subscriptionLoading) {
    return <LoadingScreen />;
  }

  // 0. Password recovery (deep link reçu depuis email reset) — prime sur tout.
  //    Une session de récupération existe mais l'utilisateur doit créer un
  //    nouveau mot de passe avant de poursuivre. Sprint A auth.
  if (passwordRecoveryMode) {
    return <ResetPasswordConfirmScreen />;
  }

  // 0.5 Sprint C auth PWA — lien de confirmation ouvert dans un navigateur
  //     SANS état local du signup (typique : PWA installée iOS → click lien
  //     Gmail → Safari fresh). Le compte est confirmé côté Supabase ; on
  //     invite à retourner dans l'app d'origine au lieu de dérouler
  //     l'onboarding dans le mauvais contexte. Un Safari classique (non-PWA)
  //     partage le localStorage → pendingMigration présent → skip, la
  //     branche 0.6 prend le relais et la migration entre dans l'app.
  //     `!onboardingDone` : après migration réussie dans CE navigateur, le
  //     pathname est encore /confirm-email mais l'user est légitime → app.
  if (isConfirmEmailLanding() && !pendingMigration && !onboardingDone) {
    return <EmailConfirmedFallbackScreen />;
  }

  // 0.6 Session arrivée + migration en attente → la migration tourne dans
  //     ProgressContext (useEffect). Loader plutôt qu'un flash d'onboarding
  //     pendant que le profil remote passe onboarding_done=true.
  if (session && pendingMigration) {
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

  // 2a. Sprint B email confirm — Signup fait, en attente confirmation email.
  //     Affiché tant que pendingMigration existe et que la session n'est pas
  //     encore arrivée. La migration se déclenche automatiquement post-confirm
  //     via useEffect dans ProgressContext.
  if (!session && pendingMigration) {
    return <EmailPendingScreen />;
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
  if (accountCreatedAt && new Date(accountCreatedAt).getTime() > devNow()) {
    return <WaitingScreen onStartNow={() => { /* re-render via accountCreatedAt mise à jour */ }} />;
  }

  // 4.5 Paywall fin Phase 0 — Feature Spec abonnement V1 §5.
  //     Bloque l'accès à Phase 1+ quand currentDay > 14 et abonnement non
  //     actif. On laisse passer pendant Phase 0 (J1-J14) — la Phase 0 reste
  //     accessible à vie en mode `free` (cf. §4.2 mapping état → accès).
  //     `currentPhase !== 'phase_0'` couvre s0_1, s0_2, phase_1, post_s8.
  if (currentPhase !== 'phase_0' && !subscriptionActive) {
    return <PaywallScreen />;
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

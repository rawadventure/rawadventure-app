/**
 * HomeStack — stack interne de l'onglet Accueil.
 *
 * V1 (Sprint 14 hygiène) : routes V1 uniquement. Les écrans V0 (HomeScreen,
 * DayScreen, SettingsScreen, ConversionScreen, ChecklistScreen, AuthScreen,
 * OnboardingScreen, ProtocolScreen) ont été supprimés du repo car non
 * référencés depuis la refonte M7+A3 + IA-11 V1.
 *
 * La refonte IA-30 conversion (M5) viendra Sprint 15+ comme nouvel écran
 * V1. Les paramètres (IA-72) viendront via le tab Profil (déjà placeholder
 * dans ProfilTabScreen).
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreenV1 from '../screens/v1/HomeScreenV1';
import PaywallScreen from '../screens/v1/PaywallScreen';
import { useProgress } from '../hooks/ProgressContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Phase0ActionDetailScreen from '../screens/v1/Phase0ActionDetailScreen';
import PillarEvaluationScreen from '../screens/v1/PillarEvaluationScreen';
import PillarRecapScreen from '../screens/v1/PillarRecapScreen';
import PillarFinalRecapScreen from '../screens/v1/PillarFinalRecapScreen';
import PillarOverviewScreen from '../screens/v1/PillarOverviewScreen';
import SessionScreen from '../screens/v1/SessionScreen';
import PaliersGalleryScreen from '../screens/v1/PaliersGalleryScreen';
import type { Phase0ActionId } from '../data/phase0-actions';

export type Phase0StackParamList = {
  HomeV1: undefined;
  Phase0ActionDetail: { actionId: Phase0ActionId };
  PillarEvaluation: { pillarId: string; evaluationType?: 'initial' | 'final' };
  PillarRecap: { pillarId: string; evaluationType?: 'initial' | 'final' };
  PillarFinalRecap: { pillarId: string };
  PillarOverview: { pillarId?: string } | undefined;
  Session: { sessionIndex: 1 | 2 | 3; pillarId?: string };
  PaliersGallery: undefined;
  Paywall: undefined;
};

/** Wrapper PaywallScreen accessible depuis hub J14/15/16 via navigation.
 *  Injecte `onBack` → bouton retour visible, "Plus tard" referme l'écran. */
function PaywallSoftScreen() {
  const nav = useNavigation<NativeStackNavigationProp<Phase0StackParamList>>();
  return <PaywallScreen onBack={() => nav.goBack()} />;
}

const Stack = createNativeStackNavigator<Phase0StackParamList>();

/**
 * Wrapper qui force le remount de HomeScreenV1 quand la phase change
 * (phase_0 ↔ phase_1 ↔ post_s8) ou quand `currentPillarId` apparaît/disparaît.
 *
 * Rationale : HomeScreenV1 a des early returns vers Phase1HomeScreen /
 * ConsolidationHomeScreen APRÈS des `useState` / `useEffect` plus bas dans
 * le composant. Une transition in-place de phase_0 → phase_1 (par exemple
 * via le bouton DEV "Passer au jour suivant" ou via le useEffect auto-start
 * S1) provoque un mismatch de hook count entre renders ("Rendered fewer
 * hooks than expected"). Forcer un remount via `key` règle ça sans refactor
 * lourd (extraction de Phase 0 hub en sous-composant).
 */
function HomeV1Mount() {
  const { currentPhase, currentPillarId } = useProgress();
  const renderKey = `${currentPhase}_${currentPillarId ?? 'none'}`;
  return <HomeScreenV1 key={renderKey} />;
}

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeV1" component={HomeV1Mount} />
      <Stack.Screen name="Phase0ActionDetail" component={Phase0ActionDetailScreen} />
      <Stack.Screen name="PillarEvaluation" component={PillarEvaluationScreen} />
      <Stack.Screen name="PillarRecap" component={PillarRecapScreen} />
      <Stack.Screen name="PillarFinalRecap" component={PillarFinalRecapScreen} />
      <Stack.Screen name="PillarOverview" component={PillarOverviewScreen} />
      <Stack.Screen name="Session" component={SessionScreen} />
      <Stack.Screen name="PaliersGallery" component={PaliersGalleryScreen} />
      <Stack.Screen name="Paywall" component={PaywallSoftScreen} />
    </Stack.Navigator>
  );
}

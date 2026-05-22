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
  PillarOverview: undefined;
  Session: { sessionIndex: 1 | 2 | 3 };
  PaliersGallery: undefined;
};

const Stack = createNativeStackNavigator<Phase0StackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeV1" component={HomeScreenV1} />
      <Stack.Screen name="Phase0ActionDetail" component={Phase0ActionDetailScreen} />
      <Stack.Screen name="PillarEvaluation" component={PillarEvaluationScreen} />
      <Stack.Screen name="PillarRecap" component={PillarRecapScreen} />
      <Stack.Screen name="PillarFinalRecap" component={PillarFinalRecapScreen} />
      <Stack.Screen name="PillarOverview" component={PillarOverviewScreen} />
      <Stack.Screen name="Session" component={SessionScreen} />
      <Stack.Screen name="PaliersGallery" component={PaliersGalleryScreen} />
    </Stack.Navigator>
  );
}

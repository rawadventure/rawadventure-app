/**
 * HomeStack — stack interne de l'onglet Accueil.
 *
 * V1 (Sprint 5) : HomeScreenV1 (IA-11 Pattern B refondu) en écran racine,
 * avec Phase0ActionDetail (IA-13) comme écran enfant pour le détail d'une
 * action de Phase 0.
 *
 * Les écrans V0 (HomeScreen V0, DayScreen, SettingsScreen, ConversionScreen)
 * sont conservés sous des routes secondaires pour rester accessibles
 * pendant la transition Sprint 5 → Sprint 7 (refonte conversion + paramètres).
 * À retirer une fois les routes V1 équivalentes codées.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreenV1 from '../screens/v1/HomeScreenV1';
import Phase0ActionDetailScreen from '../screens/v1/Phase0ActionDetailScreen';
import PillarEvaluationScreen from '../screens/v1/PillarEvaluationScreen';
import PillarRecapScreen from '../screens/v1/PillarRecapScreen';
import PillarFinalRecapScreen from '../screens/v1/PillarFinalRecapScreen';
import SessionScreen from '../screens/v1/SessionScreen';
import DayScreen from '../screens/DayScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ConversionScreen from '../screens/ConversionScreen';
import type { Phase0ActionId } from '../data/phase0-actions';

export type Phase0StackParamList = {
  HomeV1: undefined;
  Phase0ActionDetail: { actionId: Phase0ActionId };
  PillarEvaluation: { pillarId: string; evaluationType?: 'initial' | 'final' };
  PillarRecap: { pillarId: string; evaluationType?: 'initial' | 'final' };
  PillarFinalRecap: { pillarId: string };
  Session: { sessionIndex: 1 | 2 | 3 };
  // Routes legacy V0 (Sprint 5 conserve, à retirer Sprint 7+)
  Day: { dayId: number };
  Settings: undefined;
  Conversion: undefined;
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
      <Stack.Screen name="Session" component={SessionScreen} />
      <Stack.Screen name="Day" component={DayScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Conversion" component={ConversionScreen} />
    </Stack.Navigator>
  );
}

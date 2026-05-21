/**
 * ToileStack — stack interne onglet Toile (Sprint 17 G).
 *
 * Encapsule la navigation IA-25 (vue principale) → IA-26 (détail branche).
 * Le NavigationContainer racine reste unique (App.tsx) ; ce stack est
 * imbriqué dans TabNavigator pour l'onglet 'toile'.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ToileTabScreen from '../screens/v1/ToileTabScreen';
import PillarBranchDetailScreen from '../screens/v1/PillarBranchDetailScreen';
import type { PillarSlot } from '../components/toile';

export type ToileStackParamList = {
  ToileMain: undefined;
  PillarBranchDetail: { pillarSlot: PillarSlot };
};

const Stack = createNativeStackNavigator<ToileStackParamList>();

export default function ToileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ToileMain" component={ToileTabScreen} />
      <Stack.Screen name="PillarBranchDetail" component={PillarBranchDetailScreen} />
    </Stack.Navigator>
  );
}

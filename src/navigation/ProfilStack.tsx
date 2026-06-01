/**
 * ProfilStack — stack interne onglet Profil (Sprint 19 — IA-51).
 *
 * Encapsule l'écran principal Profil (IA-70) + la galerie paliers (IA-51).
 * Permet de naviguer vers la galerie depuis le profil sans quitter l'onglet.
 *
 * Imbriqué dans TabNavigator pour l'onglet 'profil'.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfilTabScreen from '../screens/v1/ProfilTabScreen';
import PaliersGalleryScreen from '../screens/v1/PaliersGalleryScreen';
import PillarEvaluationScreen from '../screens/v1/PillarEvaluationScreen';
import PillarRecapScreen from '../screens/v1/PillarRecapScreen';

export type ProfilStackParamList = {
  ProfilMain: undefined;
  PaliersGallery: undefined;
  // DEV — permet de lancer IA-40 éval initiale depuis Profil (tests Phase 1).
  PillarEvaluation: { pillarId: string; evaluationType?: 'initial' | 'final' };
  PillarRecap: { pillarId: string; evaluationType?: 'initial' | 'final' };
};

const Stack = createNativeStackNavigator<ProfilStackParamList>();

export default function ProfilStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfilMain" component={ProfilTabScreen} />
      <Stack.Screen name="PaliersGallery" component={PaliersGalleryScreen} />
      <Stack.Screen name="PillarEvaluation" component={PillarEvaluationScreen} />
      <Stack.Screen name="PillarRecap" component={PillarRecapScreen} />
    </Stack.Navigator>
  );
}

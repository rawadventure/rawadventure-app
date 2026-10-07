/**
 * ProfilStack — stack interne onglet Profil (Sprint 19 — IA-51).
 *
 * Encapsule l'écran principal Profil (IA-70) + la galerie paliers (IA-51)
 * + la relecture des vidéos narratives (IA-70, sous-écran).
 * Permet de naviguer vers la galerie depuis le profil sans quitter l'onglet.
 *
 * Imbriqué dans TabNavigator pour l'onglet 'profil'.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfilTabScreen from '../screens/v1/ProfilTabScreen';
import PaliersGalleryScreen from '../screens/v1/PaliersGalleryScreen';
import NarrativeVideosScreen from '../screens/v1/NarrativeVideosScreen';
import PillarEvaluationScreen from '../screens/v1/PillarEvaluationScreen';
import PillarRecapScreen from '../screens/v1/PillarRecapScreen';
import PaywallScreen from '../screens/v1/PaywallScreen';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type ProfilStackParamList = {
  ProfilMain: undefined;
  PaliersGallery: undefined;
  // IA-70 — relecture des vidéos narratives débloquées (retour testeuse 7 oct 2026).
  NarrativeVideos: undefined;
  // DEV — permet de lancer IA-40 éval initiale depuis Profil (tests Phase 1).
  PillarEvaluation: { pillarId: string; evaluationType?: 'initial' | 'final' };
  PillarRecap: { pillarId: string; evaluationType?: 'initial' | 'final' };
  Paywall: undefined;
};

/** Wrapper PaywallScreen accessible depuis Profil. Injecte `onBack`. */
function PaywallSoftScreen() {
  const nav = useNavigation<NativeStackNavigationProp<ProfilStackParamList>>();
  return <PaywallScreen onBack={() => nav.goBack()} />;
}

const Stack = createNativeStackNavigator<ProfilStackParamList>();

export default function ProfilStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfilMain" component={ProfilTabScreen} />
      <Stack.Screen name="PaliersGallery" component={PaliersGalleryScreen} />
      <Stack.Screen name="NarrativeVideos" component={NarrativeVideosScreen} />
      <Stack.Screen name="PillarEvaluation" component={PillarEvaluationScreen} />
      <Stack.Screen name="PillarRecap" component={PillarRecapScreen} />
      <Stack.Screen name="Paywall" component={PaywallSoftScreen} />
    </Stack.Navigator>
  );
}

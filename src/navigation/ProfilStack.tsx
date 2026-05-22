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

export type ProfilStackParamList = {
  ProfilMain: undefined;
  PaliersGallery: undefined;
};

const Stack = createNativeStackNavigator<ProfilStackParamList>();

export default function ProfilStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfilMain" component={ProfilTabScreen} />
      <Stack.Screen name="PaliersGallery" component={PaliersGalleryScreen} />
    </Stack.Navigator>
  );
}

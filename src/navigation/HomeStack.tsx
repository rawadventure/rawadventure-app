/**
 * HomeStack — stack interne de l'onglet Accueil.
 *
 * Encapsule la navigation V0 entre HomeScreen, DayScreen, SettingsScreen et
 * ConversionScreen. Le NavigationContainer racine est unique au niveau App,
 * mais on peut imbriquer des navigators (recommandé par React Navigation).
 *
 * Les écrans V0 attendent la prop `navigation` de React Navigation — ce stack
 * la leur fournit. Les écrans Toile et Profil restent en-dehors du stack et
 * sont rendus directement par TabNavigator (pas de navigation interne en V1).
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DayScreen from '../screens/DayScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ConversionScreen from '../screens/ConversionScreen';
import type { RootStackParamList } from '../../App';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Day" component={DayScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Conversion" component={ConversionScreen} />
    </Stack.Navigator>
  );
}

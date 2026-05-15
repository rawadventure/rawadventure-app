import React, { useCallback, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';

import { AuthProvider } from './src/hooks/AuthContext';
import { ProgressProvider } from './src/hooks/ProgressContext';
import RootNavigator from './src/navigation/RootNavigator';

/**
 * Types de routes du stack interne « Accueil » (utilisé par HomeStack).
 * Maintenu ici pour rétro-compatibilité avec les imports V0 qui référencent
 * `../../App` (HomeScreen, DayScreen, SettingsScreen, ConversionScreen).
 */
export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Day: { dayId: number };
  Conversion: undefined;
  Settings: undefined;
};

// Empêche Expo d'auto-masquer le splash : on contrôle le moment précis où
// l'app est prête à s'afficher (polices Inter chargées).
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  // 5 poids Inter du design system V1.1 §3.2
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AuthProvider>
          <ProgressProvider>
            <NavigationContainer>
              <StatusBar style="dark" />
              <RootNavigator />
            </NavigationContainer>
          </ProgressProvider>
        </AuthProvider>
      </View>
    </SafeAreaProvider>
  );
}

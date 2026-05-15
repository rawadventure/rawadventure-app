import React, { useCallback, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';

import { AuthProvider, useAuth } from './src/hooks/AuthContext';
import { ProgressProvider, useProgress } from './src/hooks/ProgressContext';
import AuthScreen from './src/screens/AuthScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import DayScreen from './src/screens/DayScreen';
import ConversionScreen from './src/screens/ConversionScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { colors } from './src/theme';

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Day: { dayId: number };
  Conversion: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Empêche Expo d'auto-masquer le splash : on contrôle nous-mêmes le moment
// précis où l'app est prête à s'afficher (polices Inter chargées).
SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore : preventAutoHideAsync peut échouer si appelé après le hide auto.
});

// ─── Spinner de chargement ────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color={colors.green} size="large" />
    </View>
  );
}

// ─── Navigateur principal ─────────────────────────────────────────────────────

function AppNavigator() {
  const { session, loading: authLoading } = useAuth();
  const { loading: progressLoading, onboardingDone, completeOnboarding } = useProgress();

  // Chargement initial (auth + données)
  if (authLoading || progressLoading) return <LoadingScreen />;

  // Non connecté → écran de connexion / inscription
  if (!session) return <AuthScreen />;

  // Connecté mais onboarding non fait → onboarding
  if (!onboardingDone) {
    return <OnboardingScreen onComplete={completeOnboarding} />;
  }

  // Application principale
  // Note : l'auto-affichage du ConversionScreen à streak >= 14 a été retiré
  // (patch V0 minimal du 7 mai 2026 — décision A4 de l'audit V0 vs docs fondateurs).
  // Le ConversionScreen reste déclaré dans le Stack pour rester accessible par navigation,
  // mais n'est plus terminal après J14. La refonte complète de la conversion (Phase B
  // de M5) viendra plus tard en bloc avec M2 calendaire et M3 streak.
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Day" component={DayScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Conversion" component={ConversionScreen} />
    </Stack.Navigator>
  );
}

// ─── App racine ───────────────────────────────────────────────────────────────

export default function App() {
  // Chargement des 5 poids Inter utilisés par le design system V1.1 §3.2 :
  // 400 (body), 500 (caption), 600 (button/H3), 700 (H1/H2), 800 (Display).
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  // Masque le splash dès que les polices sont chargées (ou en erreur — dans ce
  // cas on continue avec la fallback system font plutôt que de bloquer l'app).
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

  // Tant que les polices ne sont pas chargées : rien rendu, le splash natif
  // reste visible (cf. preventAutoHideAsync ci-dessus).
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AuthProvider>
          <ProgressProvider>
            <NavigationContainer>
              <StatusBar style="light" />
              <AppNavigator />
            </NavigationContainer>
          </ProgressProvider>
        </AuthProvider>
      </View>
    </SafeAreaProvider>
  );
}

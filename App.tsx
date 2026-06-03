import React, { useCallback, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
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
import { SubscriptionProvider } from './src/hooks/SubscriptionContext';
import RootNavigator from './src/navigation/RootNavigator';
import {
  configureAndroidChannel,
  configureNotificationHandler,
} from './src/lib/notifications';

// Sprint 25 — cadre technique notifications (D32 plage silence 22h-8h).
// Configure handler foreground + canal Android au load module (idempotent).
configureNotificationHandler();
void configureAndroidChannel();

/**
 * RootStackParamList — type legacy V0 conservé pour réutilisation éventuelle.
 * En V1 c'est Phase0StackParamList (src/navigation/HomeStack.tsx) qui est
 * la source de vérité des routes Accueil.
 */
export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
};

// Empêche Expo d'auto-masquer le splash : on contrôle le moment précis où
// l'app est prête à s'afficher (polices Inter chargées).
SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Linking config — Sprint A auth + futur Sprint abonnement.
 *
 * Scheme `rawadventure://` déclaré dans app.json. Permet à Supabase de
 * rappeler l'app depuis le lien email de reset password
 * (`rawadventure://reset-password#access_token=...`). Stripe Payment Link
 * utilisera plus tard `rawadventure://subscription-success`.
 *
 * Pas de mapping de routes ici — la gestion se fait via les events
 * Supabase (`PASSWORD_RECOVERY`) captés dans AuthContext. NavigationContainer
 * a juste besoin du prefix pour ne pas bloquer l'ouverture du deep link.
 */
const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: [Linking.createURL('/'), 'rawadventure://'],
  config: {
    screens: {},
  },
};

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
            <SubscriptionProvider>
              <NavigationContainer linking={linking}>
                <StatusBar style="dark" />
                <RootNavigator />
              </NavigationContainer>
            </SubscriptionProvider>
          </ProgressProvider>
        </AuthProvider>
      </View>
    </SafeAreaProvider>
  );
}

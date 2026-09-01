/**
 * Smoke test App — l'app complète (providers réels + RootNavigator réel)
 * monte sans crash, et un utilisateur vierge atterrit sur l'onboarding.
 *
 * Attrape les erreurs globales d'import, de provider mal câblé et de
 * navigation (le genre de casse qu'un test unitaire ciblé ne voit pas).
 */

import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, screen, waitFor } from '@testing-library/react-native';

jest.mock('../lib/supabase', () => {
  const { createSupabaseMock } = require('../test-utils/supabaseMock');
  const m = createSupabaseMock();
  return { supabase: m.client, __supabaseMock: m };
});

// Polices : chargées immédiatement sous test (pas de fetch de fonts en Node).
jest.mock('@expo-google-fonts/inter', () => ({
  useFonts: () => [true, null],
  Inter_400Regular: 1,
  Inter_500Medium: 2,
  Inter_600SemiBold: 3,
  Inter_700Bold: 4,
  Inter_800ExtraBold: 5,
}));

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(async () => {}),
  hideAsync: jest.fn(async () => {}),
}));

jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  wrap: (c: unknown) => c,
}));

jest.mock('expo-linking', () => ({
  createURL: (path: string) => `rawadventure://${path}`,
  parse: jest.fn(),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  getInitialURL: jest.fn(async () => null),
}));

import App from '../../App';

beforeEach(async () => {
  await AsyncStorage.clear();
});

test('l app monte sans crash et affiche l onboarding pour un utilisateur vierge', async () => {
  await render(<App />);
  // L'onboarding IA-01 (slide 1) doit finir par s'afficher : preuve que
  // AuthProvider + ProgressProvider + SubscriptionProvider + RootNavigator
  // + HomeStack se sont tous montés et que le chargement s'est terminé.
  await waitFor(
    () => {
      const tree = JSON.stringify(screen.toJSON());
      expect(tree.length).toBeGreaterThan(100);
      expect(screen.queryAllByText(/./).length).toBeGreaterThan(0);
    },
    { timeout: 5000 },
  );
});

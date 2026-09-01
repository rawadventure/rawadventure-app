/**
 * Setup global Jest — mocks partagés par toute la suite.
 *
 * - AsyncStorage : mock officiel en mémoire (fourni par le package lui-même).
 * - expo-notifications / expo-device : mockés pour éviter les warnings Expo Go
 *   et les appels natifs impossibles en environnement Node.
 * - Variables Supabase : valeurs factices pour que src/lib/supabase.ts puisse
 *   s'importer sans .env (le client réel n'est jamais appelé — les tests qui
 *   touchent Supabase mockent le module src/lib/supabase).
 */

// React 19 : requis pour que les mises à jour d'état async soient couvertes
// par act() dans les tests de hooks/composants (@testing-library/react-native).
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

process.env.EXPO_PUBLIC_SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://test.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'test-anon-key';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(async () => 'mock-notification-id'),
  cancelScheduledNotificationAsync: jest.fn(async () => {}),
  cancelAllScheduledNotificationsAsync: jest.fn(async () => {}),
  getAllScheduledNotificationsAsync: jest.fn(async () => []),
  setNotificationChannelAsync: jest.fn(async () => {}),
  AndroidImportance: { MAX: 5, HIGH: 4, DEFAULT: 3 },
  SchedulableTriggerInputTypes: { DATE: 'date', TIME_INTERVAL: 'timeInterval' },
}));

jest.mock('expo-device', () => ({
  isDevice: true,
  modelName: 'JestTestDevice',
}));

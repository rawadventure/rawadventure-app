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
  PermissionStatus: {
    GRANTED: 'granted',
    DENIED: 'denied',
    UNDETERMINED: 'undetermined',
  },
  SchedulableTriggerInputTypes: { DATE: 'date', TIME_INTERVAL: 'timeInterval' },
}));

jest.mock('expo-device', () => ({
  isDevice: true,
  modelName: 'JestTestDevice',
}));

// Reanimated : mock officiel — withTiming/withSpring sautent à leur valeur
// finale de façon SYNCHRONE. Sans ça, les animations réelles (250-500 ms de
// rAF) débordent sur le test suivant → « overlapping act() calls » + arbres
// de rendu corrompus (les modales restaient invisibles pour les queries).
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

// Safe area : mock officiel du package (insets fixes, pas de natif).
jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default
);

// expo-av (VideoPreview) : stub — pas de lecteur natif sous Node. La migration
// expo-video à venir remplacera ce mock (voir mémoire chantier expo-video).
jest.mock('expo-av', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Video = React.forwardRef((props: Record<string, unknown>, ref: unknown) =>
    React.createElement(View, { ...props, ref, testID: props.testID ?? 'expo-av-video' }),
  );
  return {
    Video,
    ResizeMode: { CONTAIN: 'contain', COVER: 'cover', STRETCH: 'stretch' },
    VideoFullscreenUpdate: {
      PLAYER_WILL_PRESENT: 0,
      PLAYER_DID_PRESENT: 1,
      PLAYER_WILL_DISMISS: 2,
      PLAYER_DID_DISMISS: 3,
    },
    Audio: { setAudioModeAsync: jest.fn(async () => {}) },
  };
});

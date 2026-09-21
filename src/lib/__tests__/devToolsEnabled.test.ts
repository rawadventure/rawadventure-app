/**
 * Tests devToolsEnabled — F-07/K1 (audit Lou + décision Stéphane 18 sept) :
 * le panneau DEV est activé par __DEV__ OU par le flag de compte
 * profiles.dev_tools_enabled (posé au chargement du profil). Le flag env
 * Vercel EXPO_PUBLIC_ENABLE_DEV_PANEL ne doit PLUS rien activer : il
 * exposait le panneau (reset complet, mock abonnement, horloge) à tous les
 * testeurs du déploiement — R4/K1 de la vérif Stripe.
 */

import {
  isDevToolsEnabled,
  setDevToolsAccountFlag,
} from '../devToolsEnabled';

const g = globalThis as { __DEV__?: boolean };
let devBackup: boolean | undefined;

beforeEach(() => {
  devBackup = g.__DEV__;
  setDevToolsAccountFlag(false);
});

afterEach(() => {
  g.__DEV__ = devBackup;
  setDevToolsAccountFlag(false);
  delete process.env.EXPO_PUBLIC_ENABLE_DEV_PANEL;
});

test('__DEV__ actif → true (Expo Go, npx expo start)', () => {
  g.__DEV__ = true;
  expect(isDevToolsEnabled()).toBe(true);
});

test('build production sans flag compte → false', () => {
  g.__DEV__ = false;
  expect(isDevToolsEnabled()).toBe(false);
});

test('K1 : le flag env Vercel n active PLUS le panneau en production', () => {
  g.__DEV__ = false;
  process.env.EXPO_PUBLIC_ENABLE_DEV_PANEL = 'true';
  expect(isDevToolsEnabled()).toBe(false);
});

test('flag de compte (profiles.dev_tools_enabled) → true en production', () => {
  g.__DEV__ = false;
  setDevToolsAccountFlag(true);
  expect(isDevToolsEnabled()).toBe(true);
});

test('déconnexion / compte non flaggé : retombe à false', () => {
  g.__DEV__ = false;
  setDevToolsAccountFlag(true);
  setDevToolsAccountFlag(false);
  expect(isDevToolsEnabled()).toBe(false);
});

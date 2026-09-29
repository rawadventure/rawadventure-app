/**
 * Tests notice.ts — régression R9-10 (29 sept 2026) : sur PWA, un échec de
 * connexion passé par Alert.alert n'affichait RIEN (Alert de react-native-web
 * est un no-op). showNotice doit router vers window.alert sur web, et
 * supporter un callback de fermeture (utilisé par RegisterScreen pour
 * « Email envoyé » → retour au mode connexion).
 */

import { Alert, Platform } from 'react-native';
import { showNotice } from '../notice';

describe('showNotice', () => {
  const originalOS = Platform.OS;
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    (globalThis as any).window = (globalThis as any).window ?? {};
    (globalThis as any).window.alert = jest.fn();
  });

  afterEach(() => {
    (Platform as any).OS = originalOS;
    alertSpy.mockRestore();
  });

  test('web : passe par window.alert (Alert RN = no-op sur web)', () => {
    (Platform as any).OS = 'web';
    showNotice('Connexion échouée', 'Invalid login credentials');
    expect((globalThis as any).window.alert).toHaveBeenCalledWith(
      'Connexion échouée\n\nInvalid login credentials',
    );
    expect(alertSpy).not.toHaveBeenCalled();
  });

  test('web : onClose appelé après la fermeture du dialogue', () => {
    (Platform as any).OS = 'web';
    const onClose = jest.fn();
    showNotice('Email envoyé', 'Vérifie ta boîte mail.', onClose);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('natif : passe par Alert.alert sans bouton quand pas de onClose', () => {
    (Platform as any).OS = 'ios';
    showNotice('Titre', 'Message');
    expect(alertSpy).toHaveBeenCalledWith('Titre', 'Message', undefined);
  });

  test('natif : onClose branché sur le bouton OK', () => {
    (Platform as any).OS = 'ios';
    const onClose = jest.fn();
    showNotice('Titre', 'Message', onClose);
    const buttons = alertSpy.mock.calls[0][2] as {
      text: string;
      onPress?: () => void;
    }[];
    expect(buttons).toHaveLength(1);
    expect(buttons[0].text).toBe('OK');
    buttons[0].onPress?.();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

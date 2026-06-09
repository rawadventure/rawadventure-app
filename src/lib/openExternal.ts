/**
 * openExternal — helper unifié pour ouvrir URL externe.
 *
 * Native iOS/Android : SFSafariViewController / Custom Tabs via expo-web-browser
 *   → meilleure UX (reste dans l'app, retour automatique au close)
 *
 * Web : `window.location.href = url` (même onglet)
 *   → évite les popups bloquées par Safari après async fetch
 *   → l'utilisateur revient via le bouton "Back" du navigateur
 *
 * Usage :
 *   const result = await openExternal(url, { brandColor: '#...' });
 *   if (result.type === 'cancel' || result.type === 'dismiss') {
 *     // user closed manually — refresh state if needed
 *   }
 */

import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

export type OpenExternalOptions = {
  /** Couleur toolbar (iOS) / Custom Tabs (Android). Ignoré web. */
  toolbarColor?: string;
  /** Couleur des controls (iOS). Ignoré Android + web. */
  controlsColor?: string;
  /** Style bouton dismiss (iOS). Ignoré Android + web. */
  dismissButtonStyle?: 'done' | 'close' | 'cancel';
};

export type OpenExternalResult =
  | { type: 'opened' }
  | { type: 'cancel' }
  | { type: 'dismiss' };

export async function openExternal(
  url: string,
  options: OpenExternalOptions = {},
): Promise<OpenExternalResult> {
  if (Platform.OS === 'web') {
    // Sur web, redirige même onglet — évite popup bloquée Safari.
    // L'utilisateur revient via Back navigateur, ce qui déclenche
    // un re-mount des écrans React (pas besoin de reload manuel).
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
    return { type: 'opened' };
  }

  const result = await WebBrowser.openBrowserAsync(url, {
    toolbarColor: options.toolbarColor,
    controlsColor: options.controlsColor,
    dismissButtonStyle: options.dismissButtonStyle ?? 'close',
  });

  return result as OpenExternalResult;
}

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
  /**
   * Comportement web (ignoré natif).
   *  - `'same-tab'` (défaut) : `window.location.href` — remplace la page.
   *    À utiliser quand un `await` précède l'appel (sinon popup bloquée Safari).
   *  - `'new-tab'` : `window.open(_blank)` — l'app reste dans l'onglet
   *    d'origine, l'utilisateur ferme l'onglet ouvert pour revenir. N'utiliser
   *    QUE si AUCUN async ne précède l'appel (geste utilisateur direct), sinon
   *    le navigateur bloque la popup. Fallback automatique sur same-tab si
   *    `window.open` renvoie null (popup bloquée malgré tout).
   */
  webBehavior?: 'same-tab' | 'new-tab';
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
    if (typeof window !== 'undefined') {
      if (options.webBehavior === 'new-tab') {
        // Ouvre un nouvel onglet — l'app reste dans l'onglet d'origine
        // (utilisateur revient en fermant l'onglet Stripe). Possible
        // uniquement sans async préalable (geste direct). Fallback same-tab
        // si la popup est bloquée (window.open renvoie null).
        const opened = window.open(url, '_blank');
        if (!opened) window.location.href = url;
      } else {
        // Défaut : redirige même onglet — évite popup bloquée Safari après
        // un await. Retour via Back navigateur (re-mount des écrans React).
        window.location.href = url;
      }
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

/**
 * notice.ts — message bloquant simple multiplateforme.
 *
 * `Alert.alert` de react-native-web est un no-op (classe vide) : sur la PWA,
 * tout message passé par Alert n'apparaît JAMAIS. Ce helper route vers
 * `window.alert` sur web (dialogue natif navigateur, sobre) et vers
 * `Alert.alert` sur iOS/Android.
 *
 * V1 minimal — la couche superposée stylée prévue par la Feature Spec §2.5
 * (`copy.global.message-joker-consomme`) viendra avec le Brief contenu.
 */

import { Alert, Platform } from 'react-native';

export function showNotice(
  title: string,
  message: string,
  onClose?: () => void,
): void {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      // window.alert est bloquant : onClose s'exécute après la fermeture.
      window.alert(`${title}\n\n${message}`);
      onClose?.();
    }
    return;
  }
  Alert.alert(
    title,
    message,
    onClose ? [{ text: 'OK', onPress: onClose }] : undefined,
  );
}

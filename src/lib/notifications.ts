/**
 * notifications.ts — cadre technique notifications push V1.
 *
 * Réf Feature Spec V1 Socle minimum §2.9 + D32 (plage silence 22h-8h).
 *
 * D12 (calibrage produit — fréquence, copy précis par famille) reste reporté.
 * Ce module fournit uniquement le **cadre technique** :
 *  - permission request (idempotente)
 *  - schedule local notification (avec gating plage silence 22h-8h locales)
 *  - cancel all (idempotence — replan complet recommandé)
 *  - helper de calcul du prochain instant hors plage silence
 *
 * Contraintes V1 (§2.9) :
 *  - planification LOCALE uniquement (pas de serveur push)
 *  - plage silence 22h-8h locales : notifications dans cette fenêtre sont
 *    décalées au lendemain 8h
 *  - idempotence : appeler `cancelAllNotifications()` avant de replanifier
 *  - iOS limite ~64 notifications planifiées (suffisant V1)
 *
 * Pas encore utilisé en production V1 : la programmation effective des
 * familles (rappel quotidien Phase 0, rappel pilier, messages de fond,
 * paliers) attend D12 + Brief contenu V1 Mimi & Jacky.
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// ─── Plage silence (D32) ─────────────────────────────────────────────────────

const SILENCE_START_HOUR = 22; // 22h00 locales
const SILENCE_END_HOUR = 8; // 08h00 locales

/**
 * Vrai si la date donnée tombe dans la plage silence 22h00 → 08h00 locales.
 * Plage inclusive bas, exclusive haut : 22:00 inclus, 08:00 exclu.
 */
export function isInSilenceWindow(date: Date): boolean {
  const h = date.getHours();
  return h >= SILENCE_START_HOUR || h < SILENCE_END_HOUR;
}

/**
 * Décale une date vers le premier instant hors plage silence (08h00 du
 * jour ou lendemain). Si déjà hors plage, renvoie la date inchangée.
 */
export function shiftOutOfSilence(date: Date): Date {
  if (!isInSilenceWindow(date)) return date;
  const shifted = new Date(date);
  if (date.getHours() < SILENCE_END_HOUR) {
    // entre 00h et 08h → décale à 08h00 du même jour
    shifted.setHours(SILENCE_END_HOUR, 0, 0, 0);
  } else {
    // entre 22h et minuit → décale à 08h00 lendemain
    shifted.setDate(shifted.getDate() + 1);
    shifted.setHours(SILENCE_END_HOUR, 0, 0, 0);
  }
  return shifted;
}

// ─── Permissions ─────────────────────────────────────────────────────────────

export type PermissionStatus = 'granted' | 'denied' | 'undetermined' | 'unavailable';

/**
 * Demande la permission notification à l'utilisateur (idempotente — si déjà
 * accordée, renvoie 'granted' sans afficher de prompt).
 *
 * Sur simulator iOS : les notifications ne fonctionnent pas vraiment, mais
 * la permission peut être accordée. Sur device physique : prompt natif.
 *
 * Sur Android < 13 : pas de prompt système, permission implicite.
 * Sur Android 13+ : prompt POST_NOTIFICATIONS depuis API 33.
 */
export async function requestNotificationPermission(): Promise<PermissionStatus> {
  if (!Device.isDevice) {
    // Simulator / web — notifications non-supportées pratiquement.
    return 'unavailable';
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return 'granted';
  if (
    current.canAskAgain === false &&
    current.status === Notifications.PermissionStatus.DENIED
  ) {
    return 'denied';
  }
  const res = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });
  if (res.granted) return 'granted';
  if (res.status === Notifications.PermissionStatus.DENIED) return 'denied';
  return 'undetermined';
}

export async function getNotificationPermissionStatus(): Promise<PermissionStatus> {
  if (!Device.isDevice) return 'unavailable';
  const res = await Notifications.getPermissionsAsync();
  if (res.granted) return 'granted';
  if (res.status === Notifications.PermissionStatus.DENIED) return 'denied';
  return 'undetermined';
}

// ─── Configuration handler (foreground) ──────────────────────────────────────

/**
 * Configure le handler appelé quand une notification arrive avec l'app au
 * premier plan. Par défaut (sans config), iOS n'affiche rien en foreground.
 * Ici on affiche bannière + son + badge.
 *
 * À appeler une seule fois au boot (App.tsx).
 */
export function configureNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// ─── Scheduling ──────────────────────────────────────────────────────────────

export type ScheduleArgs = {
  /** Slot logique (cohérent avec `notifications_sent.notification_slot` du schéma V1.1). */
  slot: string;
  /** Titre affiché dans la notification. */
  title: string;
  /** Corps affiché. */
  body: string;
  /** Date locale cible. Si dans plage silence 22h-8h → décalée à 8h. */
  triggerAt: Date;
  /** Données utiles attachées (deep link, slot, etc.). Sérialisable JSON. */
  data?: Record<string, unknown>;
};

/**
 * Planifie une notification locale unique. Si `triggerAt` est dans la plage
 * silence, décalée à 8h00 (D32). Renvoie l'identifiant Expo de la notif
 * (utile pour annulation ciblée — sinon utiliser `cancelAllNotifications`
 * pour l'idempotence globale).
 *
 * Retourne `null` si permission non accordée (silencieux — caller doit
 * vérifier la permission en amont s'il veut feedback).
 */
export async function scheduleLocalNotification(args: ScheduleArgs): Promise<string | null> {
  const permission = await getNotificationPermissionStatus();
  if (permission !== 'granted') return null;

  const adjusted = shiftOutOfSilence(args.triggerAt);
  const now = Date.now();
  const secondsFromNow = Math.max(1, Math.round((adjusted.getTime() - now) / 1000));

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: args.title,
      body: args.body,
      data: { slot: args.slot, ...(args.data ?? {}) },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: secondsFromNow,
      repeats: false,
    },
  });
  return id;
}

/**
 * Annule toutes les notifications planifiées par l'app. Recommandé d'appeler
 * avant chaque replanification globale pour garantir l'idempotence
 * (contrainte 4 §2.9 — pas de doublons).
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Liste toutes les notifications actuellement planifiées (utile DEV / debug).
 */
export async function listScheduled(): Promise<Notifications.NotificationRequest[]> {
  return Notifications.getAllScheduledNotificationsAsync();
}

// ─── Android — canal par défaut ──────────────────────────────────────────────

/**
 * Configure le canal de notification Android par défaut. Requis Android 8+
 * pour que les notifs s'affichent. À appeler au boot (App.tsx).
 *
 * Pas d'effet sur iOS.
 */
export async function configureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Raw Adventure',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#3a5a3a',
  });
}

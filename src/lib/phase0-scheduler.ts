/**
 * phase0-scheduler.ts — orchestrateur planification notifications Phase 0.
 *
 * Réf D12 (drafts copy validés Mimi à venir), D32 (plage silence gérée par
 * `scheduleLocalNotification`), D26 (rappel soir annulé si action validée),
 * Feature Spec V1 Socle §2.9.
 *
 * Logique :
 *  - À la migration post-confirmation email, on planifie en bloc :
 *      • 14 notifs matin (8h00 locales J1-J14)
 *      • 14 rappels soir (20h00 locales J1-J14) — IDs stockés AsyncStorage
 *  - Quand l'utilisateur valide une action (premier coche de la journée),
 *    `cancelTodayReminder(currentDay)` annule le rappel soir de ce jour.
 *  - Avant planification : `cancelAllNotifications()` pour idempotence.
 *  - Les notifs passées (jour déjà écoulé) sont skip.
 *
 * Appelé depuis :
 *  - `ProgressContext.migrateLocalToRemote` (post-confirmation email)
 *  - `ProgressContext.validateDay` (annulation rappel soir au premier coche)
 *  - DEV button "Replanifier notifs Phase 0" (Profil)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PHASE_0_MORNING_NOTIFICATIONS,
  PHASE_0_REMINDER_NOTIFICATIONS,
} from '../data/phase0-notifications';
import * as Notifications from 'expo-notifications';
import {
  cancelAllNotifications,
  getNotificationPermissionStatus,
  scheduleLocalNotification,
} from './notifications';

/**
 * Clé AsyncStorage du map { day → expoNotificationId } pour les rappels soir.
 * Permet annulation ciblée d'un rappel soir donné quand l'action est validée.
 */
const REMINDER_IDS_KEY = 'phase0_reminder_ids';

type ReminderIdMap = Record<string, string>; // key = day (string), value = notif id

/**
 * Calcule la date cible d'une notification du jour `dayIndex` (1-14) à
 * l'heure `hour` locale, par rapport à `accountCreatedAt`.
 *
 * Exemple : si accountCreatedAt = 2026-06-03T14:00 et dayIndex = 1, hour = 8
 * → trigger 2026-06-04T08:00 locales (le lendemain matin).
 *
 * Si l'heure cible du jour J est déjà passée au moment de la planification,
 * la notification est skip (renvoie null).
 */
export function computePhase0NotificationTime(
  accountCreatedAt: Date,
  dayIndex: number,
  hour: number,
): Date | null {
  const target = new Date(accountCreatedAt);
  target.setDate(target.getDate() + dayIndex);
  target.setHours(hour, 0, 0, 0);
  if (target.getTime() <= Date.now()) {
    return null;
  }
  return target;
}

export type ScheduleResult = {
  morningScheduled: number;
  reminderScheduled: number;
  skipped: number;
  permissionDenied: boolean;
};

/**
 * Planifie en bloc les 14 notifs matin + 14 rappels soir Phase 0. Stocke les
 * IDs des rappels soir en AsyncStorage pour annulation ultérieure ciblée.
 *
 * Idempotent : `cancelAllNotifications` avant + AsyncStorage écrasé.
 */
export async function schedulePhase0Notifications(
  accountCreatedAt: Date,
): Promise<ScheduleResult> {
  const permission = await getNotificationPermissionStatus();
  if (permission !== 'granted') {
    return {
      morningScheduled: 0,
      reminderScheduled: 0,
      skipped: 0,
      permissionDenied: true,
    };
  }

  await cancelAllNotifications();
  await AsyncStorage.removeItem(REMINDER_IDS_KEY);

  let morningScheduled = 0;
  let reminderScheduled = 0;
  let skipped = 0;

  // Notifications matin 8h00 — pas d'ID à stocker (annulation globale suffit).
  for (const notif of PHASE_0_MORNING_NOTIFICATIONS) {
    const triggerAt = computePhase0NotificationTime(
      accountCreatedAt,
      notif.day,
      notif.hour,
    );
    if (!triggerAt) {
      skipped += 1;
      continue;
    }
    await scheduleLocalNotification({
      slot: notif.slot,
      title: notif.title,
      body: notif.body,
      triggerAt,
      data: { day: notif.day, kind: notif.kind, family: notif.family, phase: 'phase0' },
    });
    morningScheduled += 1;
  }

  // Rappels soir 20h00 — stocke ID par jour pour annulation ciblée.
  const reminderIds: ReminderIdMap = {};
  for (const notif of PHASE_0_REMINDER_NOTIFICATIONS) {
    const triggerAt = computePhase0NotificationTime(
      accountCreatedAt,
      notif.day,
      notif.hour,
    );
    if (!triggerAt) {
      skipped += 1;
      continue;
    }
    const id = await scheduleLocalNotification({
      slot: notif.slot,
      title: notif.title,
      body: notif.body,
      triggerAt,
      data: { day: notif.day, kind: notif.kind, family: notif.family, phase: 'phase0' },
    });
    if (id) {
      reminderIds[String(notif.day)] = id;
      reminderScheduled += 1;
    }
  }

  await AsyncStorage.setItem(REMINDER_IDS_KEY, JSON.stringify(reminderIds));

  return {
    morningScheduled,
    reminderScheduled,
    skipped,
    permissionDenied: false,
  };
}

/**
 * Annule le rappel soir 20h du jour donné. Appelé par `validateDay()` quand
 * l'utilisateur a coché au moins une action ce jour-là — pas besoin de le
 * relancer le soir.
 *
 * No-op si pas d'ID stocké (rappel déjà passé / déjà annulé / pas planifié).
 */
export async function cancelTodayReminder(day: number): Promise<void> {
  const raw = await AsyncStorage.getItem(REMINDER_IDS_KEY);
  if (!raw) return;
  const map: ReminderIdMap = JSON.parse(raw);
  const id = map[String(day)];
  if (!id) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    // Notification déjà déclenchée ou supprimée — silencieux.
  }
  delete map[String(day)];
  await AsyncStorage.setItem(REMINDER_IDS_KEY, JSON.stringify(map));
}

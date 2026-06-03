/**
 * phase0-scheduler.ts — orchestrateur planification notifications Phase 0.
 *
 * Réf D12 (drafts copy validés Mimi à venir), D32 (plage silence gérée par
 * `scheduleLocalNotification`), Feature Spec V1 Socle §2.9.
 *
 * Logique :
 *  - À l'arrivée de la session post-confirmation email, on planifie en bloc
 *    les 14 notifications Phase 0 (1 par jour à 9h locales).
 *  - Avant planification : `cancelAllNotifications()` pour idempotence.
 *  - Les notifications passées (jour déjà écoulé) sont skip.
 *  - Plage silence 22h-8h gérée automatiquement par `shiftOutOfSilence` côté
 *    scheduler — 9h00 est OK donc pas d'impact en pratique sur Phase 0.
 *
 * Appelé depuis :
 *  - `ProgressContext.migrateLocalToRemote` (post-confirmation email)
 *  - DEV button "Replanifier notifs Phase 0" (Profil)
 */

import { PHASE_0_NOTIFICATIONS } from '../data/phase0-notifications';
import {
  cancelAllNotifications,
  getNotificationPermissionStatus,
  scheduleLocalNotification,
} from './notifications';

/**
 * Calcule la date cible d'une notification du jour `dayIndex` (1-14) à
 * l'heure `hour` locale, par rapport à `accountCreatedAt`.
 *
 * Exemple : si accountCreatedAt = 2026-06-03T14:00 et dayIndex = 1, hour = 9
 * → trigger 2026-06-04T09:00 locales (le lendemain matin).
 *
 * Si l'heure cible du jour J est déjà passée au moment de la planification,
 * la notification est skip (renvoie null).
 */
export function computePhase0NotificationTime(
  accountCreatedAt: Date,
  dayIndex: number,
  hour: number,
): Date | null {
  // J1 = lendemain de accountCreatedAt à hour:00.
  // J2 = surlendemain, etc.
  const target = new Date(accountCreatedAt);
  target.setDate(target.getDate() + dayIndex);
  target.setHours(hour, 0, 0, 0);

  // Skip si déjà passé.
  if (target.getTime() <= Date.now()) {
    return null;
  }
  return target;
}

export type ScheduleResult = {
  scheduled: number;
  skipped: number;
  permissionDenied: boolean;
};

/**
 * Planifie en bloc les 14 notifications Phase 0 alignées sur
 * `accountCreatedAt`. Appelle `cancelAllNotifications` d'abord pour garantir
 * idempotence (pas de doublons si appelé plusieurs fois).
 *
 * Retourne le décompte (scheduled / skipped). Si permission non accordée,
 * scheduled=0 et permissionDenied=true.
 */
export async function schedulePhase0Notifications(
  accountCreatedAt: Date,
): Promise<ScheduleResult> {
  const permission = await getNotificationPermissionStatus();
  if (permission !== 'granted') {
    return { scheduled: 0, skipped: 0, permissionDenied: true };
  }

  await cancelAllNotifications();

  let scheduled = 0;
  let skipped = 0;

  for (const notif of PHASE_0_NOTIFICATIONS) {
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
      data: {
        day: notif.day,
        family: notif.family,
        phase: 'phase0',
      },
    });
    scheduled += 1;
  }

  return { scheduled, skipped, permissionDenied: false };
}

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-notifications', () => ({
  cancelScheduledNotificationAsync: jest.fn(),
}));

import { computePhase0NotificationTime } from '../phase0-scheduler';

describe('computePhase0NotificationTime', () => {
  it('J1 7h = lendemain matin', () => {
    const accountCreatedAt = new Date('2027-06-03T14:00:00');
    const result = computePhase0NotificationTime(accountCreatedAt, 1, 7);
    expect(result).not.toBeNull();
    expect(result!.getDate()).toBe(4);
    expect(result!.getMonth()).toBe(5); // juin
    expect(result!.getFullYear()).toBe(2027);
    expect(result!.getHours()).toBe(7);
    expect(result!.getMinutes()).toBe(0);
  });

  it('J1 20h = lendemain soir', () => {
    const accountCreatedAt = new Date('2027-06-03T14:00:00');
    const result = computePhase0NotificationTime(accountCreatedAt, 1, 20);
    expect(result).not.toBeNull();
    expect(result!.getDate()).toBe(4);
    expect(result!.getHours()).toBe(20);
  });

  it('J14 7h = 14 jours après accountCreatedAt', () => {
    const accountCreatedAt = new Date('2027-06-03T14:00:00');
    const result = computePhase0NotificationTime(accountCreatedAt, 14, 7);
    expect(result).not.toBeNull();
    expect(result!.getDate()).toBe(17);
    expect(result!.getHours()).toBe(7);
  });

  it('skip si trigger déjà passé', () => {
    const accountCreatedAt = new Date('2020-01-01T00:00:00');
    const result = computePhase0NotificationTime(accountCreatedAt, 1, 7);
    expect(result).toBeNull();
  });

  it('gère franchissement mois', () => {
    const accountCreatedAt = new Date('2026-06-25T14:00:00');
    const result = computePhase0NotificationTime(accountCreatedAt, 14, 7);
    expect(result).not.toBeNull();
    expect(result!.getMonth()).toBe(6); // juillet
    expect(result!.getDate()).toBe(9);
  });

  it('gère franchissement année', () => {
    const accountCreatedAt = new Date('2026-12-25T14:00:00');
    const result = computePhase0NotificationTime(accountCreatedAt, 14, 20);
    expect(result).not.toBeNull();
    expect(result!.getFullYear()).toBe(2027);
    expect(result!.getMonth()).toBe(0); // janvier
    expect(result!.getDate()).toBe(8);
    expect(result!.getHours()).toBe(20);
  });
});

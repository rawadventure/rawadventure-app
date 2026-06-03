import { computePhase0NotificationTime } from '../phase0-scheduler';

describe('computePhase0NotificationTime', () => {
  it('J1 9h = lendemain matin', () => {
    const accountCreatedAt = new Date('2026-06-03T14:00:00');
    const result = computePhase0NotificationTime(accountCreatedAt, 1, 9);
    expect(result).not.toBeNull();
    expect(result!.getDate()).toBe(4);
    expect(result!.getMonth()).toBe(5); // juin
    expect(result!.getFullYear()).toBe(2026);
    expect(result!.getHours()).toBe(9);
    expect(result!.getMinutes()).toBe(0);
  });

  it('J14 9h = 14 jours après accountCreatedAt', () => {
    const accountCreatedAt = new Date('2026-06-03T14:00:00');
    const result = computePhase0NotificationTime(accountCreatedAt, 14, 9);
    expect(result).not.toBeNull();
    expect(result!.getDate()).toBe(17);
    expect(result!.getHours()).toBe(9);
  });

  it('skip si trigger déjà passé', () => {
    const accountCreatedAt = new Date('2020-01-01T00:00:00');
    const result = computePhase0NotificationTime(accountCreatedAt, 1, 9);
    expect(result).toBeNull();
  });

  it('gère franchissement mois', () => {
    const accountCreatedAt = new Date('2026-06-25T14:00:00');
    const result = computePhase0NotificationTime(accountCreatedAt, 14, 9);
    expect(result).not.toBeNull();
    expect(result!.getMonth()).toBe(6); // juillet
    expect(result!.getDate()).toBe(9);
  });

  it('gère franchissement année', () => {
    const accountCreatedAt = new Date('2026-12-25T14:00:00');
    const result = computePhase0NotificationTime(accountCreatedAt, 14, 9);
    expect(result).not.toBeNull();
    expect(result!.getFullYear()).toBe(2027);
    expect(result!.getMonth()).toBe(0); // janvier
    expect(result!.getDate()).toBe(8);
  });
});

import { isValidEmail, isValidPassword } from '../validation';

describe('isValidEmail', () => {
  it('accepte les emails valides', () => {
    expect(isValidEmail('alice@example.com')).toBe(true);
    expect(isValidEmail('first.last@domain.co')).toBe(true);
    expect(isValidEmail('user+tag@proton.me')).toBe(true);
    expect(isValidEmail('a@b.cd')).toBe(true);
  });

  it('refuse les emails invalides', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('plain')).toBe(false);
    expect(isValidEmail('no-at-sign.com')).toBe(false);
    expect(isValidEmail('@no-local.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('user@domain')).toBe(false);
    expect(isValidEmail('user @space.com')).toBe(false);
    expect(isValidEmail('user@domain.x')).toBe(false); // TLD < 2
  });

  it('trim les espaces autour', () => {
    expect(isValidEmail('  alice@example.com  ')).toBe(true);
  });
});

describe('isValidPassword', () => {
  it('accepte 6 caractères ou plus', () => {
    expect(isValidPassword('123456')).toBe(true);
    expect(isValidPassword('abcdef')).toBe(true);
    expect(isValidPassword('a very long passphrase')).toBe(true);
  });

  it('refuse moins de 6 caractères', () => {
    expect(isValidPassword('')).toBe(false);
    expect(isValidPassword('12345')).toBe(false);
    expect(isValidPassword('abc')).toBe(false);
  });
});

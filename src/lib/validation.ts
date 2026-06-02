/**
 * validation.ts — helpers de validation côté UI.
 *
 * Sprint C polish auth — regex email + password strength minimal.
 *
 * Note : ces helpers sont indicatifs côté client (UX). La validation
 * autoritaire est faite par Supabase Auth côté serveur.
 */

/**
 * Regex email RFC 5322 simplifié. Couvre 99% des cas réels sans faux positifs
 * communs. Refuse les espaces, exige un @ et un TLD ≥ 2 caractères.
 */
const EMAIL_RE =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

/**
 * Password : 6 caractères min (aligné contrainte Supabase Auth par défaut).
 * Pas d'exigence majuscule/chiffre — friction inutile en V1.
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

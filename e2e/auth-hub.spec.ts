/**
 * E2E hub connecté — compte Supabase de test dédié (créé le 2 sept 2026).
 *
 * Identifiants via E2E_TEST_EMAIL / E2E_TEST_PASSWORD :
 *  - local : fichier `.env.e2e` (gitignoré, chargé par playwright.config.ts)
 *  - CI : secrets GitHub du même nom
 * Skippé proprement si absents.
 *
 * Premier passage du compte : l'onboarding s'affiche (onboarding_done=false
 * côté Supabase) — le test le complète une fois pour toutes. Passages
 * suivants : connexion → hub direct. Les tests restent en LECTURE SEULE sur
 * la progression (pas de validation de journée — D27 rendrait le 2e run du
 * jour flaky).
 */
import { expect, test, type Page } from '@playwright/test';

const EMAIL = process.env.E2E_TEST_EMAIL;
const PASSWORD = process.env.E2E_TEST_PASSWORD;

/** Complète les 9 slides d'onboarding (même parcours que onboarding.spec). */
async function completeOnboarding(page: Page) {
  const continuer = page.getByText('Continuer', { exact: true });
  await continuer.click(); // 1 → 2
  await continuer.click(); // 2 → 3
  await continuer.click(); // 3 → questionnaire P1
  await page.getByRole('radio', { name: 'Note 3 sur 5' }).click();
  await page.getByText('Neutre', { exact: true }).click();
  await continuer.click(); // → P2
  await page.getByText('Tranquille', { exact: true }).click();
  await page.getByText('Sérieusement', { exact: true }).click();
  await continuer.click(); // → projection
  await continuer.click(); // → profil dynamique
  await continuer.click(); // → comment ça marche
  await continuer.click(); // → engagement
  await page.getByRole('checkbox').click();
  await page.getByText('Créer mon compte', { exact: true }).click();
}

test.describe('Hub connecté (compte de test)', () => {
  test.skip(!EMAIL || !PASSWORD, 'E2E_TEST_EMAIL / E2E_TEST_PASSWORD non définis');

  test('connexion → hub Phase 0 avec actions du jour et streak', async ({ page }) => {
    await page.goto('/');
    await page.getByText("J'ai déjà un compte").click({ timeout: 30_000 });
    await page.getByPlaceholder('Email').fill(EMAIL!);
    await page.getByPlaceholder('Mot de passe', { exact: true }).fill(PASSWORD!);
    await page.getByText('Me connecter', { exact: true }).click();

    // Premier passage du compte : onboarding à compléter. Ensuite : hub direct.
    const hub = page.getByText('Actions du jour');
    const onboardingHero = page.getByText('14 jours offerts pour relancer ta machine', {
      exact: false,
    });
    await expect(hub.or(onboardingHero).first()).toBeVisible({ timeout: 30_000 });
    if (await onboardingHero.isVisible()) {
      await completeOnboarding(page);
    }

    await expect(hub).toBeVisible({ timeout: 30_000 });
    // Hub Phase 0 complet : jour de position, 7 actions, bouton validation.
    await expect(page.getByText(/Jour \d+ sur 14/)).toBeVisible();
    await expect(page.getByText('Activation matinale')).toBeVisible();
    await expect(page.getByText('Valider ma journée')).toBeVisible();
  });
});

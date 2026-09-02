/**
 * E2E hub connecté — OPTIONNEL : nécessite un compte Supabase de test.
 *
 * Skippé si E2E_TEST_EMAIL / E2E_TEST_PASSWORD ne sont pas définis.
 * Le compte de test doit exister (email confirmé). Les tests sont en
 * LECTURE SEULE (pas de validation de journée — D27 rendrait le 2e run
 * du jour flaky et polluerait la progression du compte).
 *
 * Local : E2E_TEST_EMAIL=... E2E_TEST_PASSWORD=... npm run test:e2e
 * CI : secrets GitHub du même nom (à configurer si souhaité).
 */
import { expect, test } from '@playwright/test';

const EMAIL = process.env.E2E_TEST_EMAIL;
const PASSWORD = process.env.E2E_TEST_PASSWORD;

test.describe('Hub connecté (compte de test)', () => {
  test.skip(!EMAIL || !PASSWORD, 'E2E_TEST_EMAIL / E2E_TEST_PASSWORD non définis');

  test('connexion → hub avec actions du jour et streak', async ({ page }) => {
    await page.goto('/');
    await page.getByText("J'ai déjà un compte").click({ timeout: 30_000 });
    await page.getByPlaceholder('Email').fill(EMAIL!);
    await page.getByPlaceholder(/mot de passe/i).fill(PASSWORD!);
    await page.getByText('Se connecter', { exact: false }).click();

    // Hub Phase 0 (ou Phase 1 selon la progression du compte de test).
    await expect(
      page.getByText(/Actions du jour|Session du (matin|midi|soir)/).first(),
    ).toBeVisible({ timeout: 30_000 });
  });
});

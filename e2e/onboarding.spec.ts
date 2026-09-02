/**
 * E2E onboarding — parcours anonyme complet dans un vrai navigateur.
 *
 * IA-01 → IA-09 (9 slides + questionnaire) → IA-10 RegisterScreen.
 * Chaque test part d'un contexte navigateur vierge (localStorage neuf).
 */
import { expect, test } from '@playwright/test';

test.describe('Onboarding — 10 slides', () => {
  test('boot : la slide 1 s affiche avec le hero et les deux actions', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByText('14 jours offerts pour relancer ta machine', { exact: false }),
    ).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText('Continuer', { exact: true })).toBeVisible();
    await expect(page.getByText("J'ai déjà un compte")).toBeVisible();
  });

  test('parcours complet : slides + questionnaire + engagement → RegisterScreen', async ({ page }) => {
    await page.goto('/');
    const continuer = page.getByText('Continuer', { exact: true });
    await expect(continuer).toBeVisible({ timeout: 30_000 });

    // Slide 1 (hero) → 2 (constat) → 3 (promesse)
    await continuer.click();
    await expect(page.getByText('Le constat')).toBeVisible();
    await continuer.click();
    await expect(page.getByText('La promesse')).toBeVisible();
    await continuer.click();

    // Slide 4 — questionnaire P1 : énergie (échelle 1-5) + corps (chips).
    await expect(page.getByText('ton énergie elle est où', { exact: false })).toBeVisible();
    await page.getByRole('radio', { name: 'Note 3 sur 5' }).click();
    await page.getByText('Neutre', { exact: true }).click();
    await continuer.click();

    // Slide 5 — questionnaire P2 : tête + engagement.
    await expect(page.getByText('ta tête elle est', { exact: false })).toBeVisible();
    await page.getByText('Tranquille', { exact: true }).click();
    await page.getByText('Sérieusement', { exact: true }).click();
    await continuer.click();

    // Slides 6 (projection) → 7 (profil dynamique) → 8 (comment ça marche).
    await expect(page.getByText('La projection')).toBeVisible();
    await continuer.click();
    // Slide profil dynamique — titre dépendant des réponses, on avance.
    await continuer.click();
    await expect(page.getByText('Comment ça marche')).toBeVisible();
    await continuer.click();

    // Slide 9 — engagement : case à cocher requise avant le CTA final.
    await expect(page.getByText('Un seul engagement.')).toBeVisible();
    await page.getByRole('checkbox').click();
    await page.getByText('Créer mon compte', { exact: true }).click();

    // IA-10 RegisterScreen : champ email visible.
    await expect(page.getByPlaceholder('Email')).toBeVisible({ timeout: 15_000 });
  });

  test('questionnaire bloquant : Continuer inactif tant que P1 est incomplet', async ({ page }) => {
    await page.goto('/');
    const continuer = page.getByText('Continuer', { exact: true });
    await expect(continuer).toBeVisible({ timeout: 30_000 });
    await continuer.click();
    await continuer.click();
    await continuer.click();
    await expect(page.getByText('ton énergie elle est où', { exact: false })).toBeVisible();
    // Sans réponses, le bouton Continuer est désactivé (validation par slide).
    await expect(page.getByRole('button', { name: 'Continuer' })).toBeDisabled();
    // Répondre débloque le bouton.
    await page.getByRole('radio', { name: 'Note 3 sur 5' }).click();
    await page.getByText('Neutre', { exact: true }).click();
    await expect(page.getByRole('button', { name: 'Continuer' })).toBeEnabled();
  });

  test('"J ai déjà un compte" mène à l écran de connexion', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText("J'ai déjà un compte")).toBeVisible({ timeout: 30_000 });
    await page.getByText("J'ai déjà un compte").click();
    await expect(page.getByPlaceholder('Email')).toBeVisible({ timeout: 15_000 });
  });
});

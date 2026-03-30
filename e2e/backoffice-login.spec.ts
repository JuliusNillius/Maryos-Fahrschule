import { test, expect } from '@playwright/test';

/**
 * E2E-Tests Backoffice-Login.
 * Prüft Formular und Submit-Button (kein echter Login mit Credentials).
 */
test.describe('Backoffice Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/backoffice/login');
  });

  test('Login-Seite lädt und zeigt Formular', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Maryo/i })).toBeVisible();
    await expect(page.getByLabel(/E-Mail/i)).toBeVisible();
    await expect(page.getByLabel(/Passwort/i)).toBeVisible();

    const submit = page.getByTestId('backoffice-login-submit');
    await expect(submit).toBeVisible();
    await expect(submit).toHaveText(/Anmelden/);
  });

  test('Submit-Button ist initial klickbar', async ({ page }) => {
    const submit = page.getByTestId('backoffice-login-submit');
    await expect(submit).toBeEnabled();
  });

  test('Link „Zur Website“ führt zur Startseite', async ({ page }) => {
    await page.getByRole('link', { name: /Zur Website/i }).click();
    await expect(page).not.toHaveURL(/\/backoffice\/login/);
    await expect(page.getByTestId('hero-cta-primary')).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

/**
 * E2E-Tests Startseite & zentrale Unterseiten.
 * Verwendet data-testid aus docs/BUTTON-CHECKLIST.md.
 */
test.describe('Startseite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Hero-CTAs sind sichtbar und klickbar', async ({ page }) => {
    const primary = page.getByTestId('hero-cta-primary');
    const secondary = page.getByTestId('hero-cta-secondary');

    await expect(primary).toBeVisible();
    await expect(secondary).toBeVisible();

    await primary.click();
    await expect(page).toHaveURL(/\#anmelden|anmelden/);
  });

  test('Primary CTA scrollt zu #anmelden', async ({ page }) => {
    await page.getByTestId('hero-cta-primary').click();
    await expect(page).toHaveURL(/\#anmelden|anmelden/);
  });

  test('FAQ-Accordion öffnet sich per Klick (FAQ-Seite)', async ({ page }) => {
    await page.goto('/de/faq');
    const secondFaq = page.getByTestId('faq-toggle-1');
    await expect(secondFaq).toBeVisible();
    await secondFaq.click();
    await expect(secondFaq).toHaveAttribute('aria-expanded', 'true');
  });

  test('Navbar: Backoffice-Link führt zu /backoffice', async ({ page }) => {
    const backoffice = page.getByTestId('navbar-backoffice');
    await expect(backoffice).toBeVisible();
    await backoffice.click();
    await expect(page).toHaveURL(/\/backoffice/);
  });

  test('WhatsApp-CTA ist sichtbar und hat korrekten Link', async ({ page }) => {
    const whatsapp = page.getByTestId('whatsapp-cta');
    await expect(whatsapp).toBeVisible();
    await expect(whatsapp).toHaveAttribute('href', /wa\.me|whatsapp/);
  });

  test('Preise-Seite: Preisrechner erreichbar', async ({ page }) => {
    await page.goto('/de/preise');
    await expect(page.locator('#preisrechner')).toBeVisible();
  });
});

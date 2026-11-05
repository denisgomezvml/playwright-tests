import { test, expect } from '@playwright/test';

test.describe('Desktop - Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display desktop-only content', async ({ page }) => {
    await expect(page.locator('.hidden-mobile')).toBeVisible();
  });

  test('should hide the hamburger menu', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Toggle menu' })).toBeHidden();
  });

  test('should navigate to the contact page from the navigation', async ({ page }) => {
    await page.getByRole('link', { name: 'Contact', exact: true }).click();
    await expect(page).toHaveURL(/contact\.html$/);
    await expect(page.getByRole('heading', { name: 'Contact us' })).toBeVisible();
  });

  for (const { button, url } of [
    { button: 'Open hero banner', url: /hero\.html$/ },
    { button: 'Open contact form', url: /contact\.html$/ },
    { button: 'Open form demo', url: /form\.html$/ },
  ]) {
    test(`should navigate using the "${button}" button`, async ({ page }) => {
      await page.getByRole('region', { name: 'Explore the pages' }).getByRole('link', { name: button }).click();
      await expect(page).toHaveURL(url);
    });
  }
});

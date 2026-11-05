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

  test('should navigate to the hero banner page from the call to action', async ({ page }) => {
    await page.getByRole('link', { name: 'See the hero banner' }).click();
    await expect(page).toHaveURL(/hero\.html$/);
  });
});

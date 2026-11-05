import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 13'] });

test.describe('Mobile - Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should hide desktop-only content', async ({ page }) => {
    await expect(page.locator('.hidden-mobile')).toBeHidden();
  });

  test('should open the menu and update aria-expanded', async ({ page }) => {
    const toggle = page.getByRole('button', { name: 'Toggle menu' });

    await test.step('Menu is initially collapsed', async () => {
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(page.getByRole('link', { name: 'Hero banner', exact: true })).toBeHidden();
    });

    await test.step('Tap the hamburger button', async () => {
      await toggle.tap();
    });

    await test.step('Menu is expanded', async () => {
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(page.getByRole('link', { name: 'Hero banner', exact: true })).toBeVisible();
    });
  });

  test('should close the menu on a second tap', async ({ page }) => {
    const toggle = page.getByRole('button', { name: 'Toggle menu' });
    await toggle.tap();
    await toggle.tap();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('should open the contact page by tapping its button', async ({ page }) => {
    await page.getByRole('link', { name: 'Open contact form' }).tap();
    await expect(page).toHaveURL(/contact\.html$/);
  });
});

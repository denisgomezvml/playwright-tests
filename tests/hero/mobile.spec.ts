import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 13'] });

test.describe('Mobile - Hero banner page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/hero.html');
  });

  test('should display the hero headline and call to action', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
  });

  test('should hide the illustration on mobile', async ({ page }) => {
    await expect(page.locator('.hero-art')).toBeHidden();
  });

  test('should show the details using touch and update aria-expanded', async ({ page }) => {
    const toggle = page.getByRole('button', { name: 'Show details' });
    await toggle.tap();
    await expect(page.locator('#hero-details')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hide details' })).toHaveAttribute('aria-expanded', 'true');
  });

  test('should not overflow horizontally', async ({ page }) => {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
});

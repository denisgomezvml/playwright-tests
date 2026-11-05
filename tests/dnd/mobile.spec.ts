import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 13'] });

test.describe('Mobile - Drag and hover page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dnd.html');
  });

  test('should reorder the list with the Move buttons by tapping', async ({ page }) => {
    await page.getByRole('button', { name: 'Move down Write tests' }).tap();
    await expect(page.getByRole('status')).toHaveText('Order: Review code, Write tests, Deploy site, Update docs');
  });

  test('should open and close the menu by tapping the toggle', async ({ page }) => {
    const toggle = page.getByRole('button', { name: 'Products' });
    await toggle.tap();
    await expect(page.getByRole('link', { name: 'Software' })).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await toggle.tap();
    await expect(page.getByRole('link', { name: 'Software' })).toBeHidden();
  });

  test('should not overflow horizontally', async ({ page }) => {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
});

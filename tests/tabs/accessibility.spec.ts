import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility - New tabs page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tabs.html');
  });

  test('should have no axe violations on the main page', async ({ page }) => {
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  });

  test('should have no axe violations on the page opened in a new tab', async ({ page, context }) => {
    const pagePromise = context.waitForEvent('page');
    await page.getByRole('link', { name: 'Open details in a new tab' }).click();
    const newPage = await pagePromise;
    await expect(newPage.getByRole('heading', { name: 'Details page' })).toBeVisible();

    const results = await new AxeBuilder({ page: newPage }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  });

  test('should open the link in a new tab with the keyboard', async ({ page, context }) => {
    const link = page.getByRole('link', { name: 'Open details in a new tab' });
    await link.focus();
    const pagePromise = context.waitForEvent('page');
    await page.keyboard.press('Enter');
    const newPage = await pagePromise;
    await expect(newPage.getByRole('status')).toHaveText('Opened from: link');
  });

  test('should reach the link and button in tab order', async ({ page }) => {
    await page.getByRole('link', { name: 'Open details in a new tab' }).focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Open tab with a button' })).toBeFocused();
  });
});

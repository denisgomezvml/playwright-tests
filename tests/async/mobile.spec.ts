import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 13'] });

test.describe('Mobile - Async content page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/async.html');
  });

  test('should show the delayed result after tapping the button', async ({ page }) => {
    await page.getByRole('button', { name: 'Load delayed result' }).tap();
    await expect(page.locator('#delayed-status')).toHaveText('Loading...');
    await expect(page.locator('#delayed-status')).toHaveText('Result loaded after 2 seconds');
  });

  test('should recover from a failed request by retrying with a tap', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Load flaky data' });
    await button.tap();
    await expect(page.getByRole('alert')).toHaveText('Request failed. Please try again.');
    await button.tap();
    await expect(page.locator('#flaky-status')).toHaveText('Flaky data loaded on attempt 2');
  });

  test('should keep the buttons visible without horizontal overflow', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Load delayed result' })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
});

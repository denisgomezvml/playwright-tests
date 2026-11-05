import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 13'] });

test.describe('Mobile - New tabs page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tabs.html');
  });

  test('should open the link in a new tab by tapping', async ({ page, context }) => {
    const pagePromise = context.waitForEvent('page');
    await page.getByRole('link', { name: 'Open details in a new tab' }).tap();
    const newPage = await pagePromise;
    await expect(newPage.getByRole('status')).toHaveText('Opened from: link');
  });

  test('should open a tab from the button by tapping', async ({ page }) => {
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'Open tab with a button' }).tap();
    const popup = await popupPromise;
    await expect(popup.getByRole('status')).toHaveText('Opened from: button');
  });

  test('should not overflow horizontally', async ({ page }) => {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
});

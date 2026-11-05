import { test, expect } from '@playwright/test';

test.describe('Desktop - New tabs page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tabs.html');
  });

  test('should open the link in a new tab', async ({ page, context }) => {
    const pagePromise = context.waitForEvent('page');
    await page.getByRole('link', { name: 'Open details in a new tab' }).click();
    const newPage = await pagePromise;

    await expect(newPage).toHaveURL(/new-tab\.html\?from=link$/);
    await expect(newPage.getByRole('heading', { name: 'Details page' })).toBeVisible();
    await expect(newPage.getByRole('status')).toHaveText('Opened from: link');
  });

  test('should keep the original tab open and unchanged', async ({ page, context }) => {
    const pagePromise = context.waitForEvent('page');
    await page.getByRole('link', { name: 'Open details in a new tab' }).click();
    await pagePromise;

    expect(context.pages()).toHaveLength(2);
    await expect(page).toHaveURL(/tabs\.html$/);
    await expect(page.getByRole('heading', { name: 'New tabs' })).toBeVisible();
  });

  test('should open a tab from a button using the popup event', async ({ page }) => {
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'Open tab with a button' }).click();
    const popup = await popupPromise;

    await expect(popup.getByRole('status')).toHaveText('Opened from: button');
  });

  test('should return to the original tab after closing the new one', async ({ page, context }) => {
    const pagePromise = context.waitForEvent('page');
    await page.getByRole('link', { name: 'Open details in a new tab' }).click();
    const newPage = await pagePromise;

    await newPage.close();
    expect(context.pages()).toHaveLength(1);
    await expect(page.getByRole('link', { name: 'Open details in a new tab' })).toBeVisible();
  });

  test('should declare noopener on the external-style link', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Open details in a new tab' });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener');
  });
});

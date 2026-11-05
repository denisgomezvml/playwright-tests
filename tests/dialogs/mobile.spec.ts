import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 13'] });

test.describe('Mobile - Dialogs page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dialogs.html');
  });

  test('should accept a confirm by tapping the button', async ({ page }) => {
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Show confirm' }).tap();
    await expect(page.locator('#dialog-result')).toHaveText('Confirmed: yes');
  });

  test('should answer a prompt after tapping the button', async ({ page }) => {
    page.once('dialog', (dialog) => dialog.accept('Mobile'));
    await page.getByRole('button', { name: 'Show prompt' }).tap();
    await expect(page.locator('#dialog-result')).toHaveText('Hello, Mobile');
  });

  test('should open and close the modal using touch', async ({ page }) => {
    await page.getByRole('button', { name: 'Open modal' }).tap();
    const modal = page.getByRole('dialog', { name: 'Subscribe to updates' });
    await expect(modal).toBeVisible();
    await modal.getByRole('button', { name: 'Close' }).tap();
    await expect(modal).toBeHidden();
  });

  test('should fit the modal inside the viewport', async ({ page }) => {
    await page.getByRole('button', { name: 'Open modal' }).tap();
    const box = await page.getByRole('dialog').boundingBox();
    const viewport = page.viewportSize();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width);
  });
});

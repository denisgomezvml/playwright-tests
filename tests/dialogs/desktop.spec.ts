import { test, expect } from '@playwright/test';

test.describe('Desktop - Dialogs page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dialogs.html');
  });

  test.describe('Native dialogs', () => {
    test('should accept an alert and read its message', async ({ page }) => {
      let message = '';
      page.once('dialog', async (dialog) => {
        expect(dialog.type()).toBe('alert');
        message = dialog.message();
        await dialog.accept();
      });

      await page.getByRole('button', { name: 'Show alert' }).click();

      await expect(page.locator('#dialog-result')).toHaveText('Alert dismissed');
      expect(message).toBe('Hello from alert');
    });

    test('should accept a confirm', async ({ page }) => {
      page.once('dialog', (dialog) => dialog.accept());
      await page.getByRole('button', { name: 'Show confirm' }).click();
      await expect(page.locator('#dialog-result')).toHaveText('Confirmed: yes');
    });

    test('should dismiss a confirm', async ({ page }) => {
      page.once('dialog', (dialog) => dialog.dismiss());
      await page.getByRole('button', { name: 'Show confirm' }).click();
      await expect(page.locator('#dialog-result')).toHaveText('Confirmed: no');
    });

    test('should answer a prompt with custom text', async ({ page }) => {
      page.once('dialog', async (dialog) => {
        expect(dialog.defaultValue()).toBe('Guest');
        await dialog.accept('Denis');
      });
      await page.getByRole('button', { name: 'Show prompt' }).click();
      await expect(page.locator('#dialog-result')).toHaveText('Hello, Denis');
    });

    test('should handle a prompt submitted empty', async ({ page }) => {
      page.once('dialog', (dialog) => dialog.accept(''));
      await page.getByRole('button', { name: 'Show prompt' }).click();
      await expect(page.locator('#dialog-result')).toHaveText('Hello, ');
    });

    test('should handle a cancelled prompt', async ({ page }) => {
      page.once('dialog', (dialog) => dialog.dismiss());
      await page.getByRole('button', { name: 'Show prompt' }).click();
      await expect(page.locator('#dialog-result')).toHaveText('Prompt cancelled');
    });
  });

  test.describe('HTML modal', () => {
    test('should open and close the modal', async ({ page }) => {
      const modal = page.getByRole('dialog', { name: 'Subscribe to updates' });

      await test.step('Modal is hidden initially', async () => {
        await expect(modal).toBeHidden();
      });

      await test.step('Open the modal', async () => {
        await page.getByRole('button', { name: 'Open modal' }).click();
        await expect(modal).toBeVisible();
      });

      await test.step('Close the modal', async () => {
        await modal.getByRole('button', { name: 'Close' }).click();
        await expect(modal).toBeHidden();
        await expect(page.locator('#modal-result')).toHaveText('Modal closed.');
      });
    });

    test('should accept inside the modal', async ({ page }) => {
      await page.getByRole('button', { name: 'Open modal' }).click();
      await page.getByRole('dialog').getByRole('button', { name: 'Accept' }).click();
      await expect(page.getByRole('dialog')).toBeHidden();
      await expect(page.locator('#modal-result')).toHaveText('Subscribed to the newsletter.');
    });

    test('should close the modal with the Escape key', async ({ page }) => {
      await page.getByRole('button', { name: 'Open modal' }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toBeHidden();
    });
  });
});

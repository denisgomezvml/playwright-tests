import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility - Dialogs page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dialogs.html');
  });

  test('should have no axe violations', async ({ page }) => {
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  });

  test('should have no axe violations while the modal is open', async ({ page }) => {
    await page.getByRole('button', { name: 'Open modal' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  });

  test('should label the modal through aria-labelledby', async ({ page }) => {
    await expect(page.locator('#modal')).toHaveAttribute('aria-labelledby', 'modal-title');
    await expect(page.locator('#modal-title')).toHaveText('Subscribe to updates');
  });

  test('should move focus into the modal and return it on close', async ({ page }) => {
    const opener = page.getByRole('button', { name: 'Open modal' });
    await opener.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog').getByRole('button', { name: 'Accept' })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(opener).toBeFocused();
  });

  test('should not move keyboard focus to the page behind the open modal', async ({ page }) => {
    await page.getByRole('button', { name: 'Open modal' }).click();
    const modal = page.getByRole('dialog');
    await expect(modal.getByRole('button', { name: 'Accept' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(modal.getByRole('button', { name: 'Close' })).toBeFocused();
    await expect(page.getByRole('button', { name: 'Show alert' })).not.toBeFocused();
  });

  test('should announce native dialog results through a status region', async ({ page }) => {
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Show confirm' }).click();
    await expect(page.getByRole('status').first()).toHaveText('Confirmed: yes');
  });
});

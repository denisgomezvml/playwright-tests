import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility - Async content page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/async.html');
  });

  test('should have no axe violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('should have no axe violations while the error and result are displayed', async ({ page }) => {
    const flaky = page.getByRole('button', { name: 'Load flaky data' });
    await flaky.click();
    await expect(page.getByRole('alert')).toHaveText('Request failed. Please try again.');
    await flaky.click();
    await expect(page.locator('#flaky-status')).toContainText('Flaky data loaded');

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  });

  test('should mark the status region as busy only while loading', async ({ page }) => {
    const status = page.locator('#delayed-status');
    await expect(status).not.toHaveAttribute('aria-busy', 'true');
    await page.getByRole('button', { name: 'Load delayed result' }).click();
    await expect(status).toHaveAttribute('aria-busy', 'true');
    await expect(status).not.toHaveAttribute('aria-busy', 'true');
  });

  test('should expose live regions for results and errors', async ({ page }) => {
    await expect(page.locator('#delayed-status')).toHaveAttribute('role', 'status');
    await expect(page.locator('#delayed-status')).toHaveAttribute('aria-live', 'polite');
    await expect(page.locator('#flaky-error')).toHaveAttribute('role', 'alert');
  });

  test('should trigger the delayed load with the keyboard', async ({ page }) => {
    await page.getByRole('button', { name: 'Load delayed result' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#delayed-status')).toHaveText('Result loaded after 2 seconds');
  });
});

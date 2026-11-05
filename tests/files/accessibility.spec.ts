import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility - Files page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/files.html');
  });

  test('should have no axe violations', async ({ page }) => {
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  });

  test('should have no axe violations after a rejected upload', async ({ page }) => {
    await page.getByLabel('Choose a file').setInputFiles({ name: 'bad.png', mimeType: 'image/png', buffer: Buffer.from('x') });
    await expect(page.getByRole('alert')).toHaveText('Only .csv and .txt files are allowed.');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  });

  test('should associate the file input with its label via for and id', async ({ page }) => {
    await expect(page.locator('label[for="file-input"]')).toBeVisible();
    await expect(page.locator('input#file-input')).toHaveAttribute('type', 'file');
  });

  test('should restrict accepted types with the accept attribute', async ({ page }) => {
    await expect(page.locator('#file-input')).toHaveAttribute('accept', '.csv,.txt');
  });

  test('should reach the file input and download link with the keyboard', async ({ page }) => {
    await page.getByLabel('Choose a file').focus();
    await expect(page.getByLabel('Choose a file')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Download CSV' })).toBeFocused();
  });

  test('should announce upload results through a status region', async ({ page }) => {
    await page.getByLabel('Choose a file').setInputFiles({ name: 'ok.txt', mimeType: 'text/plain', buffer: Buffer.from('ok') });
    await expect(page.getByRole('status')).toHaveText('Uploaded ok.txt (2 bytes)');
  });
});

import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 13'] });

test.describe('Mobile - Files page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/files.html');
  });

  test('should upload a file from a mobile device', async ({ page }) => {
    await page.getByLabel('Choose a file').setInputFiles({
      name: 'mobile.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from('x\n'),
    });
    await expect(page.getByRole('status')).toHaveText('Uploaded mobile.csv (2 bytes)');
  });

  test('should show the download link and keep it tappable', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Download CSV' });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('download', 'report.csv');
    const box = await link.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(32);
  });

  test('should not overflow horizontally', async ({ page }) => {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
});

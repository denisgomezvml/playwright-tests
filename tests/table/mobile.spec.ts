import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 13'] });

test.describe('Mobile - Table page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/table.html');
  });

  test('should paginate using touch', async ({ page }) => {
    await page.getByRole('button', { name: 'Next' }).tap();
    await expect(page.getByRole('status')).toHaveText('Page 2 of 5');
    await page.getByRole('button', { name: 'Previous' }).tap();
    await expect(page.getByRole('status')).toHaveText('Page 1 of 5');
  });

  test('should sort a column using touch', async ({ page }) => {
    await page.getByRole('button', { name: 'Name' }).tap();
    await expect(page.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'ascending');
  });

  test('should filter rows by typing', async ({ page }) => {
    await page.getByLabel('Filter').fill('engineer');
    await expect(page.getByText('Showing 1-5 of 7 rows')).toBeVisible();
  });

  test('should not overflow the page horizontally', async ({ page }) => {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
});

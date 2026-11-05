import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility - Table page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/table.html');
  });

  test('should have no axe violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('should have no axe violations after filtering to an empty table', async ({ page }) => {
    await page.getByLabel('Filter').fill('zzz-no-match');
    await expect(page.getByText('No results found.')).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  });

  test('should associate the filter input with its label via for and id', async ({ page }) => {
    await expect(page.locator('label[for="table-filter"]')).toBeVisible();
    await expect(page.locator('input#table-filter')).toBeVisible();
  });

  test('should expose table semantics: caption and column headers', async ({ page }) => {
    await expect(page.getByRole('table', { name: 'Employees' })).toBeVisible();
    await expect(page.getByRole('columnheader')).toHaveCount(4);
  });

  test('should update aria-sort when a column is sorted', async ({ page }) => {
    const header = page.getByRole('columnheader', { name: 'City' });
    await expect(header).toHaveAttribute('aria-sort', 'none');
    await page.getByRole('button', { name: 'City' }).click();
    await expect(header).toHaveAttribute('aria-sort', 'ascending');
    await page.getByRole('button', { name: 'City' }).click();
    await expect(header).toHaveAttribute('aria-sort', 'descending');
  });

  test('should sort and paginate with the keyboard', async ({ page }) => {
    await page.getByRole('button', { name: 'Name' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'ascending');

    await page.getByRole('button', { name: 'Next' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toHaveText('Page 2 of 5');
  });

  test('should announce page changes through a status region', async ({ page }) => {
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('status')).toHaveText('Page 2 of 5');
  });
});

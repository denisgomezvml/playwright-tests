import { test, expect, type Locator } from '@playwright/test';

async function columnValues(table: Locator, column: number): Promise<string[]> {
  return table.locator(`tbody tr td:nth-child(${column})`).allTextContents();
}

test.describe('Desktop - Table page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/table.html');
  });

  test('should show the first page with 5 rows', async ({ page }) => {
    await expect(page.getByRole('row')).toHaveCount(6); // header + 5 data rows
    await expect(page.getByRole('status')).toHaveText('Page 1 of 5');
    await expect(page.getByText('Showing 1-5 of 23 rows')).toBeVisible();
  });

  test.describe('Pagination', () => {
    test('should go to the next and previous page', async ({ page }) => {
      await test.step('Go to the next page', async () => {
        await page.getByRole('button', { name: 'Next' }).click();
        await expect(page.getByRole('status')).toHaveText('Page 2 of 5');
        await expect(page.getByRole('cell', { name: 'Frank Miller' })).toBeVisible();
      });

      await test.step('Go back to the previous page', async () => {
        await page.getByRole('button', { name: 'Previous' }).click();
        await expect(page.getByRole('status')).toHaveText('Page 1 of 5');
        await expect(page.getByRole('cell', { name: 'Alice Johnson' })).toBeVisible();
      });
    });

    test('should disable Previous on the first page', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Previous' })).toBeDisabled();
      await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled();
    });

    test('should disable Next and show 3 rows on the last page', async ({ page }) => {
      const next = page.getByRole('button', { name: 'Next' });
      for (let i = 0; i < 4; i++) await next.click();

      await expect(page.getByRole('status')).toHaveText('Page 5 of 5');
      await expect(next).toBeDisabled();
      await expect(page.getByRole('row')).toHaveCount(4); // header + 3 data rows
      await expect(page.getByText('Showing 21-23 of 23 rows')).toBeVisible();
    });
  });

  test.describe('Sorting', () => {
    test('should sort by name ascending then descending', async ({ page }) => {
      const table = page.getByRole('table');
      const nameHeader = page.getByRole('columnheader', { name: 'Name' });

      await test.step('Sort ascending', async () => {
        await page.getByRole('button', { name: 'Name' }).click();
        await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
        const names = await columnValues(table, 1);
        expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
        expect(names[0]).toBe('Alice Johnson');
      });

      await test.step('Sort descending', async () => {
        await page.getByRole('button', { name: 'Name' }).click();
        await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
        await expect(table.locator('tbody tr').first()).toContainText('Wendy Cruz');
      });
    });

    test('should sort the age column numerically', async ({ page }) => {
      await page.getByRole('button', { name: 'Age' }).click();
      await expect(page.getByRole('table').locator('tbody tr').first()).toContainText('23');

      await page.getByRole('button', { name: 'Age' }).click();
      await expect(page.getByRole('table').locator('tbody tr').first()).toContainText('47');
    });

    test('should reset aria-sort on the previously sorted column', async ({ page }) => {
      await page.getByRole('button', { name: 'Name' }).click();
      await page.getByRole('button', { name: 'City' }).click();
      await expect(page.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'none');
      await expect(page.getByRole('columnheader', { name: 'City' })).toHaveAttribute('aria-sort', 'ascending');
    });

    test('should return to page 1 when sorting', async ({ page }) => {
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Role' }).click();
      await expect(page.getByRole('status')).toHaveText('Page 1 of 5');
    });
  });

  test.describe('Filtering', () => {
    test('should filter rows by text and update the pagination', async ({ page }) => {
      await page.getByLabel('Filter').fill('engineer');
      await expect(page.getByText('Showing 1-5 of 7 rows')).toBeVisible();
      await expect(page.getByRole('status')).toHaveText('Page 1 of 2');
    });

    test('should filter case-insensitively across all columns', async ({ page }) => {
      await page.getByLabel('Filter').fill('AUSTIN');
      await expect(page.getByText('Showing 1-5 of 5 rows')).toBeVisible();
      await expect(page.getByRole('cell', { name: 'Uma Patel' })).toBeVisible();
    });

    test('should show an empty message when nothing matches', async ({ page }) => {
      await page.getByLabel('Filter').fill('zzz-no-match');
      await expect(page.getByText('No results found.')).toBeVisible();
      await expect(page.getByRole('row')).toHaveCount(1); // header only
      await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled();
    });

    test('should restore all rows when the filter is cleared', async ({ page }) => {
      await page.getByLabel('Filter').fill('zzz-no-match');
      await page.getByLabel('Filter').clear();
      await expect(page.getByText('Showing 1-5 of 23 rows')).toBeVisible();
      await expect(page.getByText('No results found.')).toBeHidden();
    });

    test('should combine filter, sort and pagination', async ({ page }) => {
      await page.getByLabel('Filter').fill('engineer');
      await page.getByRole('button', { name: 'Age' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await expect(page.getByRole('status')).toHaveText('Page 2 of 2');
      await expect(page.getByRole('row')).toHaveCount(3); // header + 2 rows
    });
  });
});

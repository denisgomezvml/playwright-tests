import { test, expect } from '@playwright/test';

test.describe('Desktop - Hero banner page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/hero.html');
  });

  test('should display the hero content', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Build faster with confidence' })).toBeVisible();
    await expect(page.getByText('A hero banner with a headline')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
  });

  test('should display the illustration on desktop', async ({ page }) => {
    await expect(page.getByRole('img', { name: /overlapping violet circles/ })).toBeVisible();
  });

  test('should navigate to the contact page from the call to action', async ({ page }) => {
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/contact\.html$/);
  });

  test('should show and hide the details', async ({ page }) => {
    const toggle = page.getByRole('button', { name: 'Show details' });
    const details = page.locator('#hero-details');

    await test.step('Details are hidden initially', async () => {
      await expect(details).toBeHidden();
    });

    await test.step('Click to show the details', async () => {
      await toggle.click();
      await expect(details).toBeVisible();
      await expect(page.getByRole('button', { name: 'Hide details' })).toBeVisible();
    });

    await test.step('Click again to hide the details', async () => {
      await page.getByRole('button', { name: 'Hide details' }).click();
      await expect(details).toBeHidden();
      await expect(page.getByRole('button', { name: 'Show details' })).toBeVisible();
    });
  });
});

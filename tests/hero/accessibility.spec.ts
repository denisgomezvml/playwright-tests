import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility - Hero banner page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/hero.html');
  });

  test('should have no axe violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('should label the hero section with its heading', async ({ page }) => {
    await expect(page.locator('.hero')).toHaveAttribute('aria-labelledby', 'hero-title');
    await expect(page.getByRole('region', { name: 'Build faster with confidence' })).toBeVisible();
  });

  test('should give the illustration an accessible name', async ({ page }) => {
    await expect(page.locator('.hero-art')).toHaveAttribute('aria-label', /\S/);
  });

  test('should expose aria-expanded and aria-controls on the details toggle', async ({ page }) => {
    const toggle = page.locator('#hero-details-toggle');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAttribute('aria-controls', 'hero-details');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  test('should toggle the details with the keyboard', async ({ page }) => {
    await page.getByRole('link', { name: 'Get started' }).focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Show details' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#hero-details')).toBeVisible();
  });
});

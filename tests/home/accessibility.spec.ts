import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility - Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have no axe violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('should have non-empty alt text on all images', async ({ page }) => {
    for (const img of await page.locator('img').all()) {
      await expect(img).toHaveAttribute('alt', /\S/);
    }
  });

  test('should expose ARIA attributes on the menu toggle', async ({ page }) => {
    const toggle = page.locator('#toggle-menu');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAttribute('aria-controls', 'nav-links');
    await expect(toggle).toHaveAttribute('aria-label', 'Toggle menu');
  });

  test('should mark the current page in the navigation', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('aria-current', 'page');
  });

  test('should support keyboard navigation through the nav links', async ({ page }) => {
    await page.getByRole('link', { name: 'Home', exact: true }).focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Hero banner', exact: true })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Contact', exact: true })).toBeFocused();
  });

  test('should label the pages section and expose every page button as a link', async ({ page }) => {
    const pageButtons = page.getByRole('region', { name: 'Explore the pages' }).getByRole('link');
    const navLinks = page.locator('#nav-links a');
    // Every page in the navigation except Home has a button on the home page.
    expect(await pageButtons.count()).toBeGreaterThanOrEqual(3);
    await expect(pageButtons).toHaveCount((await navLinks.count()) - 1);
  });
});

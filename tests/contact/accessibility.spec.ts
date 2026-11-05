import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility - Contact page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact.html');
  });

  test('should have no axe violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('should associate labels with inputs via for and id', async ({ page }) => {
    for (const id of ['name', 'email']) {
      await expect(page.locator(`label[for="${id}"]`)).toBeVisible();
      await expect(page.locator(`input#${id}`)).toBeVisible();
    }
  });

  test('should expose ARIA attributes on the menu toggle', async ({ page }) => {
    const toggle = page.locator('#toggle-menu');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAttribute('aria-controls', 'nav-links');
    await expect(toggle).toHaveAttribute('aria-label', 'Toggle menu');
  });

  test('should support keyboard navigation through the form', async ({ page }) => {
    await page.getByRole('link', { name: 'Form demo' }).focus();

    await test.step('Tab from the last nav link to the name input', async () => {
      await page.keyboard.press('Tab');
      await expect(page.getByLabel('Name')).toBeFocused();
    });

    await test.step('Tab to email and submit button', async () => {
      await page.keyboard.press('Tab');
      await expect(page.getByLabel('Email')).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: 'Submit' })).toBeFocused();
    });
  });

  test('should announce validation errors with an alert role', async ({ page }) => {
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('alert')).toHaveText('Name and email are required.');
  });
});

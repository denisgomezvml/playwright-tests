import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility - Drag and hover page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dnd.html');
  });

  test('should have no axe violations', async ({ page }) => {
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  });

  test('should have no axe violations while the menu is open', async ({ page }) => {
    await page.getByRole('button', { name: 'Products' }).click();
    await expect(page.getByRole('link', { name: 'Software' })).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  });

  test('should expose the menu toggle with aria-expanded and aria-controls', async ({ page }) => {
    const toggle = page.getByRole('button', { name: 'Products' });
    await expect(toggle).toHaveAttribute('aria-controls', 'menu-items');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  test('should close the menu with Escape and return focus to the toggle', async ({ page }) => {
    const toggle = page.getByRole('button', { name: 'Products' });
    await toggle.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Software' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('link', { name: 'Software' })).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test('should offer a keyboard alternative to dragging with a descriptive aria-label', async ({ page }) => {
    await expect(page.getByRole('list', { name: 'Tasks' })).toBeVisible();
    const button = page.getByRole('button', { name: 'Move down Write tests' });
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toHaveText('Order: Review code, Write tests, Deploy site, Update docs');
    await expect(button).toBeFocused();
  });
});

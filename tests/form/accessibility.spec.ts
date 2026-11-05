import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility - Form page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/form.html');
  });

  test('should have no axe violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('should associate labels with every form control via for and id', async ({ page }) => {
    for (const id of ['full-name', 'reg-email', 'country', 'message', 'terms', 'plan-free', 'plan-pro']) {
      await expect(page.locator(`label[for="${id}"]`)).toBeVisible();
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  });

  test('should mark invalid fields with aria-invalid and move focus to the first one', async ({ page }) => {
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByLabel('Full name')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByLabel('Full name')).toBeFocused();
  });

  test('should clear aria-invalid once the field is valid', async ({ page }) => {
    await page.getByRole('button', { name: 'Register' }).click();
    await page.getByLabel('Full name').fill('John Doe');
    await page.getByLabel('Email').fill('john@test.com');
    await page.getByLabel('Country').selectOption('mx');
    await page.getByLabel('I accept the terms').check();
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByLabel('Full name')).not.toHaveAttribute('aria-invalid', 'true');
  });

  test('should support keyboard navigation through the form fields', async ({ page }) => {
    await page.getByLabel('Full name').focus();
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Email')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Country')).toBeFocused();
  });
});

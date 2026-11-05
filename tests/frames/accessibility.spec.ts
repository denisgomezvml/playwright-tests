import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility - Frames page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/frames.html');
    await expect(page.frameLocator('iframe[title="Newsletter signup"]').getByLabel('Email')).toBeVisible();
  });

  test('should have no axe violations including the iframe and shadow DOM', async ({ page }) => {
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  });

  test('should give the iframe a descriptive title', async ({ page }) => {
    await expect(page.locator('#newsletter-frame')).toHaveAttribute('title', 'Newsletter signup');
  });

  test('should associate labels with inputs inside the iframe via for and id', async ({ page }) => {
    const frame = page.frameLocator('iframe[title="Newsletter signup"]');
    await expect(frame.locator('label[for="newsletter-email"]')).toBeVisible();
    await expect(frame.locator('input#newsletter-email')).toBeVisible();
  });

  test('should associate the label with the input inside the shadow root', async ({ page }) => {
    const card = page.locator('feedback-card');
    await expect(card.locator('label[for="feedback-input"]')).toBeVisible();
    await expect(card.locator('input#feedback-input')).toBeVisible();
  });

  test('should reach the iframe form with the keyboard', async ({ page }) => {
    const frame = page.frameLocator('iframe[title="Newsletter signup"]');
    await frame.getByLabel('Email').focus();
    await page.keyboard.type('key@test.com');
    await page.keyboard.press('Tab');
    await expect(frame.getByRole('button', { name: 'Subscribe' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(frame.getByRole('status')).toHaveText('Subscribed key@test.com');
  });

  test('should announce the validation error with an alert role', async ({ page }) => {
    const frame = page.frameLocator('iframe[title="Newsletter signup"]');
    await frame.getByRole('button', { name: 'Subscribe' }).click();
    await expect(frame.getByRole('alert')).toHaveText('Email is required.');
  });
});

import { test, expect } from '@playwright/test';

test.describe('Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display success message after form submission', async ({ page }) => {
    await test.step('Fill and submit the form', async () => {
      await page.getByLabel('Name').fill('John Doe');
      await page.getByLabel('Email').fill('john@test.com');
      await page.getByRole('button', { name: 'Submit' }).click();
    });

    await test.step('Verify success message is shown', async () => {
      await expect(page.locator('#result')).toHaveText('Form submitted successfully!');
    });
  });

  test('should show an error when fields are empty', async ({ page }) => {
    await test.step('Submit the empty form', async () => {
      await page.getByRole('button', { name: 'Submit' }).click();
    });

    await test.step('Verify validation error is shown', async () => {
      await expect(page.locator('#error')).toHaveText('Name and email are required.');
    });
  });

  test('should show an error for an invalid email', async ({ page }) => {
    await test.step('Submit an invalid email', async () => {
      await page.getByLabel('Name').fill('John Doe');
      await page.getByLabel('Email').fill('not-an-email');
      await page.getByRole('button', { name: 'Submit' }).click();
    });

    await test.step('Verify validation error is shown', async () => {
      await expect(page.locator('#error')).toHaveText('Please enter a valid email address.');
    });
  });

  test('should display desktop-only content', async ({ page }) => {
    await expect(page.locator('.hidden-mobile')).toBeVisible();
  });

  test('should hide the hamburger menu', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Toggle menu' })).toBeHidden();
  });
});

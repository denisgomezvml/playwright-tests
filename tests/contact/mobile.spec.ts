import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 13'] });

test.describe('Mobile - Contact page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact.html');
  });

  test('should submit the form using touch', async ({ page }) => {
    await page.getByLabel('Name').fill('Jane Doe');
    await page.getByLabel('Email').fill('jane@test.com');
    await page.getByRole('button', { name: 'Submit' }).tap();
    await expect(page.locator('#result')).toHaveText('Form submitted successfully!');
  });

  test('should show an error when fields are empty', async ({ page }) => {
    await page.getByRole('button', { name: 'Submit' }).tap();
    await expect(page.locator('#error')).toHaveText('Name and email are required.');
  });
});

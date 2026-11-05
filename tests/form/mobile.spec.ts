import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 13'] });

test.describe('Mobile - Form page', () => {
  test('should submit the registration form using touch', async ({ page }) => {
    await page.goto('/form.html');
    await page.getByLabel('Full name').fill('Jane Doe');
    await page.getByLabel('Email').fill('jane@test.com');
    await page.getByLabel('Country').selectOption('es');
    await page.getByLabel('I accept the terms').tap();
    await page.getByRole('button', { name: 'Register' }).tap();
    await expect(page.getByRole('status')).toHaveText('Registration complete for Jane Doe!');
  });

  test('should show validation errors on the registration form', async ({ page }) => {
    await page.goto('/form.html');
    await page.getByRole('button', { name: 'Register' }).tap();
    await expect(page.locator('#full-name-error')).toHaveText('Full name is required.');
  });
});

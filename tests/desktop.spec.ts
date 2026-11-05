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

test.describe('Desktop - Form page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/form.html');
  });

  test('should register successfully with valid data', async ({ page }) => {
    await test.step('Fill in the form', async () => {
      await page.getByLabel('Full name').fill('John Doe');
      await page.getByLabel('Email').fill('john@test.com');
      await page.getByLabel('Country').selectOption('mx');
      await page.getByLabel('Pro').check();
      await page.getByLabel('Message').fill('Hello there');
      await page.getByLabel('I accept the terms').check();
    });

    await test.step('Submit the form', async () => {
      await page.getByRole('button', { name: 'Register' }).click();
    });

    await test.step('Verify the success message', async () => {
      await expect(page.getByRole('status')).toHaveText('Registration complete for John Doe!');
    });
  });

  test('should show required errors when submitting an empty form', async ({ page }) => {
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.locator('#full-name-error')).toHaveText('Full name is required.');
    await expect(page.locator('#reg-email-error')).toHaveText('Email is required.');
    await expect(page.locator('#country-error')).toHaveText('Please select a country.');
    await expect(page.locator('#terms-error')).toHaveText('You must accept the terms.');
    await expect(page.getByRole('status')).toBeEmpty();
  });

  test('should show an error for an invalid email', async ({ page }) => {
    await page.getByLabel('Full name').fill('John Doe');
    await page.getByLabel('Email').fill('not-an-email');
    await page.getByLabel('Country').selectOption('co');
    await page.getByLabel('I accept the terms').check();
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.locator('#reg-email-error')).toHaveText('Please enter a valid email address.');
    await expect(page.getByRole('status')).toBeEmpty();
  });

  test('should select the free plan by default', async ({ page }) => {
    await expect(page.getByLabel('Free')).toBeChecked();
  });

  test('should navigate to the form page from the home page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Form demo' }).first().click();
    await expect(page).toHaveURL(/form\.html$/);
    await expect(page.getByRole('heading', { name: 'Registration form' })).toBeVisible();
  });
});

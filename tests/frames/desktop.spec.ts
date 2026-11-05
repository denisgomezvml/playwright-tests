import { test, expect } from '@playwright/test';

test.describe('Desktop - Frames page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/frames.html');
  });

  test.describe('Iframe form', () => {
    test('should subscribe using the form inside the iframe', async ({ page }) => {
      const frame = page.frameLocator('iframe[title="Newsletter signup"]');

      await test.step('Fill the email inside the frame', async () => {
        await frame.getByLabel('Email').fill('john@test.com');
      });

      await test.step('Submit and verify the result inside the frame', async () => {
        await frame.getByRole('button', { name: 'Subscribe' }).click();
        await expect(frame.getByRole('status')).toHaveText('Subscribed john@test.com');
      });
    });

    test('should require an email', async ({ page }) => {
      const frame = page.frameLocator('iframe[title="Newsletter signup"]');
      await frame.getByRole('button', { name: 'Subscribe' }).click();
      await expect(frame.getByRole('alert')).toHaveText('Email is required.');
    });

    test('should reject an invalid email', async ({ page }) => {
      const frame = page.frameLocator('iframe[title="Newsletter signup"]');
      await frame.getByLabel('Email').fill('not-an-email');
      await frame.getByRole('button', { name: 'Subscribe' }).click();
      await expect(frame.getByRole('alert')).toHaveText('Enter a valid email address.');
    });

    test('should expose the frame through the Frame API', async ({ page }) => {
      const handle = await page.locator('#newsletter-frame').elementHandle();
      const frame = await handle?.contentFrame();
      expect(frame).toBeTruthy();
      expect(frame!.url()).toContain('frame-form.html');
    });
  });

  test.describe('Shadow DOM component', () => {
    test('should send feedback through the shadow root', async ({ page }) => {
      const card = page.locator('feedback-card');

      await card.getByLabel('Your feedback').fill('Great site');
      await card.getByRole('button', { name: 'Send feedback' }).click();

      await expect(card.getByRole('status')).toHaveText('Thanks for your feedback: Great site');
    });

    test('should ask for feedback when the field is empty', async ({ page }) => {
      const card = page.locator('feedback-card');
      await card.getByRole('button', { name: 'Send feedback' }).click();
      await expect(card.getByRole('status')).toHaveText('Please write some feedback first.');
    });

    test('should not leak shadow content into the light DOM', async ({ page }) => {
      await expect(page.locator('feedback-card')).toHaveJSProperty('childElementCount', 0);
      await expect(page.locator('feedback-card')).toHaveJSProperty('shadowRoot.mode', 'open');
    });
  });
});

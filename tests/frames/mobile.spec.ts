import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 13'] });

test.describe('Mobile - Frames page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/frames.html');
  });

  test('should subscribe inside the iframe by tapping', async ({ page }) => {
    const frame = page.frameLocator('iframe[title="Newsletter signup"]');
    await frame.getByLabel('Email').fill('mobile@test.com');
    await frame.getByRole('button', { name: 'Subscribe' }).tap();
    await expect(frame.getByRole('status')).toHaveText('Subscribed mobile@test.com');
  });

  test('should send feedback in the shadow component by tapping', async ({ page }) => {
    const card = page.locator('feedback-card');
    await card.getByLabel('Your feedback').fill('Works on mobile');
    await card.getByRole('button', { name: 'Send feedback' }).tap();
    await expect(card.getByRole('status')).toHaveText('Thanks for your feedback: Works on mobile');
  });

  test('should keep the iframe within the viewport width', async ({ page }) => {
    const box = await page.locator('#newsletter-frame').boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x + box!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  });
});

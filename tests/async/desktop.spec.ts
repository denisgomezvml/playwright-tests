import { test, expect } from '@playwright/test';

test.describe('Desktop - Async content page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/async.html');
  });

  test.describe('Delayed result', () => {
    test('should show the result after the delay using auto-waiting', async ({ page }) => {
      await test.step('Click the button', async () => {
        await page.getByRole('button', { name: 'Load delayed result' }).click();
      });

      await test.step('Loading state is shown first', async () => {
        await expect(page.locator('#delayed-status')).toHaveText('Loading...');
      });

      await test.step('The result appears without any manual waiting', async () => {
        await expect(page.locator('#delayed-status')).toHaveText('Result loaded after 2 seconds');
      });
    });

    test('should disable the button while loading and enable it afterwards', async ({ page }) => {
      const button = page.getByRole('button', { name: 'Load delayed result' });
      await button.click();
      await expect(button).toBeDisabled();
      await expect(button).toBeEnabled();
    });

    test('should not show the result before 2 seconds have passed', async ({ page }) => {
      await page.clock.install();
      await page.goto('/async.html');
      await page.clock.pauseAt(new Date(Date.now() + 1000));

      await page.getByRole('button', { name: 'Load delayed result' }).click();

      await test.step('Just before 2 seconds the result is not there yet', async () => {
        await page.clock.runFor(1900);
        await expect(page.locator('#delayed-status')).toHaveText('Loading...');
      });

      await test.step('After 2 seconds the result is shown', async () => {
        await page.clock.runFor(200);
        await expect(page.locator('#delayed-status')).toHaveText('Result loaded after 2 seconds');
      });
    });

    test('should fail with a short timeout, proving the delay is real', async ({ page }) => {
      await page.getByRole('button', { name: 'Load delayed result' }).click();
      await expect(page.getByText('Result loaded after 2 seconds')).not.toBeVisible({ timeout: 500 });
    });
  });

  test.describe('Flaky request', () => {
    test('should fail on the first attempt', async ({ page }) => {
      await page.getByRole('button', { name: 'Load flaky data' }).click();
      await expect(page.getByRole('alert')).toHaveText('Request failed. Please try again.');
    });

    test('should succeed when retrying after a failure', async ({ page }) => {
      const button = page.getByRole('button', { name: 'Load flaky data' });

      await test.step('First attempt fails', async () => {
        await button.click();
        await expect(page.getByRole('alert')).toHaveText('Request failed. Please try again.');
      });

      await test.step('Second attempt succeeds and clears the error', async () => {
        await button.click();
        await expect(page.locator('#flaky-status')).toHaveText('Flaky data loaded on attempt 2');
        await expect(page.getByRole('alert')).toBeEmpty();
      });
    });

    test('should eventually succeed using expect.toPass retries', async ({ page }) => {
      const button = page.getByRole('button', { name: 'Load flaky data' });

      await expect(async () => {
        await button.click();
        await expect(page.locator('#flaky-status')).toContainText('Flaky data loaded', { timeout: 1500 });
      }).toPass({ timeout: 10_000 });
    });

    test('should alternate between failure and success', async ({ page }) => {
      const button = page.getByRole('button', { name: 'Load flaky data' });
      for (const attempt of [1, 2, 3, 4]) {
        await button.click();
        if (attempt % 2 === 1) {
          await expect(page.getByRole('alert')).toHaveText('Request failed. Please try again.');
        } else {
          await expect(page.locator('#flaky-status')).toHaveText(`Flaky data loaded on attempt ${attempt}`);
        }
        await expect(button).toBeEnabled();
      }
    });
  });
});

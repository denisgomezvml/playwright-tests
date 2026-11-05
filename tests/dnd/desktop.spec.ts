import { test, expect } from '@playwright/test';

const initialOrder = 'Order: Write tests, Review code, Deploy site, Update docs';

test.describe('Desktop - Drag and hover page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dnd.html');
  });

  test.describe('Reorderable list', () => {
    test('should show the initial order', async ({ page }) => {
      await expect(page.getByRole('status')).toHaveText(initialOrder);
      await expect(page.getByRole('listitem')).toHaveCount(4);
    });

    test('should reorder items by dragging one onto another', async ({ page }) => {
      await page.locator('.task-item', { hasText: 'Deploy site' })
        .dragTo(page.locator('.task-item', { hasText: 'Write tests' }));
      await expect(page.getByRole('status')).toHaveText('Order: Deploy site, Write tests, Review code, Update docs');
    });

    test('should move an item down by dragging it onto a later item', async ({ page }) => {
      await page.locator('.task-item', { hasText: 'Write tests' })
        .dragTo(page.locator('.task-item', { hasText: 'Update docs' }));
      await expect(page.getByRole('status')).toHaveText('Order: Review code, Deploy site, Update docs, Write tests');
    });

    test('should keep the order when dropping an item onto itself', async ({ page }) => {
      const item = page.locator('.task-item', { hasText: 'Review code' });
      await item.dragTo(item);
      await expect(page.getByRole('status')).toHaveText(initialOrder);
    });

    test('should reorder with the Move buttons', async ({ page }) => {
      await page.getByRole('button', { name: 'Move up Review code' }).click();
      await expect(page.getByRole('status')).toHaveText('Order: Review code, Write tests, Deploy site, Update docs');
    });
  });

  test.describe('Hover menu', () => {
    test('should open the menu on hover and close it when the mouse leaves', async ({ page }) => {
      const toggle = page.getByRole('button', { name: 'Products' });
      const software = page.getByRole('link', { name: 'Software' });

      await test.step('Menu is closed initially', async () => {
        await expect(software).toBeHidden();
      });

      await test.step('Hover opens the menu', async () => {
        await toggle.hover();
        await expect(software).toBeVisible();
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      });

      await test.step('Moving the mouse away closes it', async () => {
        await page.getByRole('heading', { name: 'Drag and drop and hover' }).hover();
        await expect(software).toBeHidden();
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      });
    });

    test('should keep the menu open while hovering its items', async ({ page }) => {
      await page.getByRole('button', { name: 'Products' }).hover();
      await page.getByRole('link', { name: 'Hardware' }).hover();
      await expect(page.getByRole('link', { name: 'Hardware' })).toBeVisible();
    });

    test('should navigate by clicking a menu item', async ({ page }) => {
      await page.getByRole('button', { name: 'Products' }).hover();
      await page.getByRole('link', { name: 'Services' }).click();
      await expect(page).toHaveURL(/#services$/);
    });
  });
});

import { readFile } from 'node:fs/promises';
import { test, expect } from '@playwright/test';

test.describe('Desktop - Files page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/files.html');
  });

  test.describe('Upload', () => {
    test('should show the name and size of an uploaded CSV', async ({ page }) => {
      await page.getByLabel('Choose a file').setInputFiles({
        name: 'data.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from('a,b\n1,2\n'),
      });
      await expect(page.getByRole('status')).toHaveText('Uploaded data.csv (8 bytes)');
    });

    test('should reject an unsupported file type', async ({ page }) => {
      await page.getByLabel('Choose a file').setInputFiles({
        name: 'image.png',
        mimeType: 'image/png',
        buffer: Buffer.from('fake'),
      });
      await expect(page.getByRole('alert')).toHaveText('Only .csv and .txt files are allowed.');
    });

    test('should reset the message when the selection is cleared', async ({ page }) => {
      const input = page.getByLabel('Choose a file');
      await input.setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hi') });
      await expect(page.getByRole('status')).toHaveText('Uploaded notes.txt (2 bytes)');
      await input.setInputFiles([]);
      await expect(page.getByRole('status')).toHaveText('No file selected.');
    });

    test('should accept a file chosen through the file chooser', async ({ page }) => {
      const chooserPromise = page.waitForEvent('filechooser');
      await page.getByLabel('Choose a file').click();
      const chooser = await chooserPromise;
      await chooser.setFiles({ name: 'chooser.txt', mimeType: 'text/plain', buffer: Buffer.from('abc') });
      await expect(page.getByRole('status')).toHaveText('Uploaded chooser.txt (3 bytes)');
    });
  });

  test.describe('Download', () => {
    test('should download the CSV with the expected name and content', async ({ page }) => {
      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('link', { name: 'Download CSV' }).click();
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toBe('report.csv');
      const path = await download.path();
      const content = await readFile(path, 'utf-8');
      expect(content.split('\n')[0]).toBe('id,name,city');
      expect(content).toContain('2,Bob,Boston');
    });
  });
});

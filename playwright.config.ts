import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx http-server site -p 8080 -s',
    url: 'http://localhost:8080',
    reuseExistingServer: true,
  },
  projects: [
    {
      name: 'desktop',
      testMatch: ['**/desktop.spec.ts', '**/accessibility.spec.ts'],
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } },
    },
    {
      name: 'mobile',
      testMatch: '**/mobile.spec.ts',
      use: { ...devices['iPhone 13'] },
    },
  ],
});

import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

// Runs the same tests against the webpack dev server (live reload) instead of the built site.
export default defineConfig(baseConfig, {
  use: { baseURL: 'http://localhost:3000' },
  webServer: {
    command: 'npx webpack serve --no-open',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
});

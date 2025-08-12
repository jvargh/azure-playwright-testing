import { defineConfig } from '@playwright/test';
import base from './playwright.config';

export default defineConfig({
  ...base,
  use: {
    ...base.use,
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'node ./src/server.js',
      url: 'http://localhost:3000',
      reuseExistingServer: true,
      timeout: 30000
  }
});

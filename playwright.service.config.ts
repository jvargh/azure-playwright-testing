// playwright.service.config.ts
import { defineConfig } from '@playwright/test';
import { getServiceConfig, ServiceOS } from '@azure/playwright';
import { DefaultAzureCredential } from '@azure/identity';
import base from './playwright.config';

// Debug: confirm env is visible when config loads
// Remove after verifying
console.log(`[debug] Initial PLAYWRIGHT_SERVICE_URL=${process.env.PLAYWRIGHT_SERVICE_URL || '<undefined>'}`);

// Normalize and validate the service URL early to avoid shell quirks
const candidate = (process.env.PLAYWRIGHT_SERVICE_URL || '').trim();
const pattern = /^https:\/\/[a-z0-9-]+\.api\.playwright\.microsoft\.com$/i;
if (!pattern.test(candidate)) {
  console.error('[error] PLAYWRIGHT_SERVICE_URL is missing or invalid. Expected e.g. https://eastus.api.playwright.microsoft.com');
} else {
  process.env.PLAYWRIGHT_SERVICE_URL = candidate; // ensure normalized form
}
console.log(`[debug] Using PLAYWRIGHT_SERVICE_URL=${process.env.PLAYWRIGHT_SERVICE_URL || '<undefined>'}`);

// Start from your base config and make it "service aware"
const serviceConfig = getServiceConfig(base, {
  exposeNetwork: '<loopback>',
  timeout: 3 * 60 * 1000,
  os: ServiceOS.LINUX,
  credential: new DefaultAzureCredential(),
});

// Export a single merged config, overriding baseURL for cloud runs
export default defineConfig({
  ...serviceConfig,
  use: {
    ...serviceConfig.use,
    baseURL: 'https://nodewebapp1-asa6dyfec6hvcdc9.centralus-01.azurewebsites.net',
    // keep your artifacts settings; these can also live in base config
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'on',
  },
  // Don’t try to start a local server in the service (browsers are in the cloud)
  webServer: undefined,
});

// playwright.service.config.ts
import { defineConfig } from '@playwright/test';
import { getServiceConfig, ServiceOS } from '@azure/playwright';
import { DefaultAzureCredential } from '@azure/identity';
import base from './playwright.config';

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

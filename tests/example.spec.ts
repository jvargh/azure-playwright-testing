import { test, expect } from '@playwright/test';

test('site is reachable and uses configured baseURL', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.ok()).toBeTruthy();
  // URL should start with configured base URL but avoid hard-coding a domain for portability
  await expect(page).toHaveURL(/\/\/[^/]+\//);
});

test('has a non-empty title', async ({ page }) => {
  await page.goto('/');
  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);
});

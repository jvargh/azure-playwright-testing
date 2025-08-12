import { test, expect } from '@playwright/test';

test('todomvc smoke: input visible, storage initialized, filter selected', async ({ page }) => {
  await page.goto('/todomvc');
  const input = page.getByPlaceholder('What needs to be done?');
  await expect(input).toBeVisible();
  await expect(page.getByTestId('todo-count')).toHaveText('0 items left');
  await expect(page.getByRole('link', { name: 'All' })).toHaveClass('selected');
  const storage = await page.evaluate(() => localStorage.getItem('react-todos'));
  expect(storage).toBeTruthy();
  expect(() => JSON.parse(storage!)).not.toThrow();
  expect(JSON.parse(storage!)).toEqual([]);
});

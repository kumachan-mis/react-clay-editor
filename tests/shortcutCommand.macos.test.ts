import test, { expect } from '@playwright/test';

import { linesToBe } from './testUtils';

test.beforeEach(async ({ page }) => {
  await page.goto('.');
  await page.locator('[data-selectid=editor-body]').click();
});

test('selectAll (Command+A)', async ({ page }) => {
  await page.keyboard.insertText(['1234567890', 'abcdefghijklm', 'nopqrstuvwxyz'].join('\n'));

  await page.keyboard.down('Meta');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Meta');

  await page.keyboard.type('.');

  expect(await page.locator('[data-selectid=editor-body]').inputValue()).toBe('.');
});

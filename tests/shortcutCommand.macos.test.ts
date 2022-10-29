import test from '@playwright/test';

import { linesToBe } from './testUtils';

test.beforeEach(async ({ page }) => {
  await page.goto('.');
  await page.locator('[data-selectid=editor-body]').click();
});

test('selectAll (Command+A)', async ({ page }) => {
  await page.keyboard.insertText(['1234567890', 'abcdefghijklm', 'nopqrstuvwxyz'].join('\n'));
  await page.keyboard.press('Meta+KeyA');
  await page.keyboard.type('.');
  await linesToBe(page, ['.']);
});

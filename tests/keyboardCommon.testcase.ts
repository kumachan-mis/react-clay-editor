import test from '@playwright/test';

import { linesToBe } from './testUtils';

export function keyboardCommonTests() {
  test('basic input', async ({ page }) => {
    await page.locator('[data-selectid=editor-body]').click();

    await page.keyboard.type('abc');

    await linesToBe(page, ['abc']);
  });
}

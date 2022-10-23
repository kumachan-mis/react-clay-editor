import { test } from '@playwright/test';

import { keyboardCommonTests } from './keyboardCommon.testcase';

test.describe('branket syntax', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bracket');
  });

  keyboardCommonTests();
});

test.describe('markdown syntax', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/markdown');
  });

  keyboardCommonTests();
});

import { linesToBe } from './testUtils';

import { test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./editor');
  await page.locator('[data-selectid=text-field]').click();
});

test('heading suggestion', async ({ page }) => {
  await page.keyboard.type('# ');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');

  await page.keyboard.type('# ');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');

  await page.keyboard.type('## Real');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');

  await page.keyboard.type('### S');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');

  await page.keyboard.type('### X');
  await page.keyboard.press('Enter');

  await linesToBe(page, [
    // expected lines
    '# React Clay Editor',
    '# Document Editor',
    '## Real Time',
    '### Syntactic',
    '### X',
    '',
  ]);
});

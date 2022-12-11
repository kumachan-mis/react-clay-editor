import test from '@playwright/test';

import { linesToBe } from './testUtils';

test.beforeEach(async ({ page }) => {
  await page.goto('.');
  await page.locator('[data-selectid=text-field]').click();
});

test('decoration suggestion', async ({ page }) => {
  await page.keyboard.type('[* ');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');

  await page.keyboard.type('[* ');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');

  await page.keyboard.type('[** Real');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');

  await page.keyboard.type('[*** S');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');

  await page.keyboard.type('[*** X');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');

  await linesToBe(page, [
    // expected lines
    '[* React Realtime Markup Editor]',
    '[* Document Editor]',
    '[** Real Time]',
    '[*** Syntactic]',
    '[*** X',
    ']',
  ]);
});

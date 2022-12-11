import test from '@playwright/test';

import { linesToBe } from './testUtils';

test.beforeEach(async ({ page }) => {
  await page.goto('.');
  await page.locator('[data-selectid=text-field]').click();
});

test('move up (ctrl+p)', async ({ page }) => {
  await page.keyboard.insertText(['abcde', 'fg', 'hijkl'].join('\n'));
  await page.locator('[data-selectid=char-L2C5]').click();

  await page.keyboard.press('Control+p');
  await page.keyboard.type('1');

  await page.keyboard.press('Control+p');
  await page.keyboard.type('2');

  await page.keyboard.press('Control+p');
  await page.keyboard.press('Control+p');
  await page.keyboard.type('3');

  await linesToBe(page, [
    // expected lines
    '3abc2de',
    'fg1',
    'hijkl',
  ]);
});

test('move down (ctrl+n)', async ({ page }) => {
  await page.keyboard.insertText(['abcde', 'fg', 'hijkl'].join('\n'));
  await page.locator('[data-selectid=char-L0C5]').click();

  await page.keyboard.press('Control+n');
  await page.keyboard.type('1');

  await page.keyboard.press('Control+n');
  await page.keyboard.type('2');

  await page.keyboard.press('Control+n');
  await page.keyboard.press('Control+n');
  await page.keyboard.type('3');

  await linesToBe(page, [
    // expected lines
    'abcde',
    'fg1',
    'hij2kl3',
  ]);
});

test('move left (ctrl+b)', async ({ page }) => {
  await page.keyboard.insertText(['ab', 'cd'].join('\n'));
  await page.locator('[data-selectid=char-L1C2]').click();

  await page.keyboard.press('Control+b');
  await page.keyboard.type('1');

  await page.keyboard.press('Control+b');
  await page.keyboard.press('Control+b');
  await page.keyboard.press('Control+b');
  await page.keyboard.type('2');

  await page.keyboard.press('Control+b');
  await page.keyboard.press('Control+b');
  await page.keyboard.press('Control+b');
  await page.keyboard.press('Control+b');
  await page.keyboard.type('3');

  await linesToBe(page, [
    // expected lines
    '3ab2',
    'c1d',
  ]);
});

test('move right (ctrl+f)', async ({ page }) => {
  await page.keyboard.insertText(['ab', 'cd'].join('\n'));
  await page.locator('[data-selectid=char-L0C0]').click();

  await page.keyboard.press('Control+f');
  await page.keyboard.type('1');

  await page.keyboard.press('Control+f');
  await page.keyboard.press('Control+f');
  await page.keyboard.type('2');

  await page.keyboard.press('Control+f');
  await page.keyboard.press('Control+f');
  await page.keyboard.press('Control+f');
  await page.keyboard.type('3');

  await linesToBe(page, [
    // expected lines
    'a1b',
    '2cd3',
  ]);
});

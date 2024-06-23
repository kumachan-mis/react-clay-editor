import { linesToBe } from './testUtils';

import { Page, test } from '@playwright/test';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('./editor');
});

test.beforeEach(async () => {
  await page.getByTestId('refresh-button').click();
  await page.locator('[data-selectid=text-field]').click();
});

test.afterAll(async () => {
  await page.close();
});

test('move up (ctrl+p)', async () => {
  await page.keyboard.insertText(['abcde', 'fg', 'hijkl'].join('\n'));
  await page.locator('[data-selectid=line-L2] [data-selectid=char-C5]').click();

  await page.keyboard.press('Control+p');
  await page.keyboard.type('1');

  await page.keyboard.press('Control+p');
  await page.keyboard.type('2');

  await page.keyboard.press('Control+p');
  await page.keyboard.press('Control+p');
  await page.keyboard.type('3');

  await linesToBe(page, [
    // Expected lines
    '3abc2de',
    'fg1',
    'hijkl',
  ]);
});

test('move down (ctrl+n)', async () => {
  await page.keyboard.insertText(['abcde', 'fg', 'hijkl'].join('\n'));
  await page.locator('[data-selectid=line-L0] [data-selectid=char-C5]').click();

  await page.keyboard.press('Control+n');
  await page.keyboard.type('1');

  await page.keyboard.press('Control+n');
  await page.keyboard.type('2');

  await page.keyboard.press('Control+n');
  await page.keyboard.press('Control+n');
  await page.keyboard.type('3');

  await linesToBe(page, [
    // Expected lines
    'abcde',
    'fg1',
    'hij2kl3',
  ]);
});

test('move left (ctrl+b)', async () => {
  await page.keyboard.insertText(['ab', 'cd'].join('\n'));
  await page.locator('[data-selectid=line-L1] [data-selectid=char-C2]').click();

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
    // Expected lines
    '3ab2',
    'c1d',
  ]);
});

test('move right (ctrl+f)', async () => {
  await page.keyboard.insertText(['ab', 'cd'].join('\n'));
  await page.locator('[data-selectid=line-L0] [data-selectid=char-C0]').click();

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
    // Expected lines
    'a1b',
    '2cd3',
  ]);
});

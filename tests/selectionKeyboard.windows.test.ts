import test from '@playwright/test';

import { linesToBe } from './testUtils';

test.beforeEach(async ({ page }) => {
  await page.goto('.');
  await page.locator('[data-selectid=editor-body]').click();
  await page.keyboard.insertText(
    [
      'Alice was beginning to get very tired of',
      'sitting by her sister on the bank,',
      'and of having nothing to do',
    ].join('\n')
  );
  await page.locator('[data-selectid=char-L1C18]').click();
});

test('select on move word top', async ({ page }) => {
  await page.keyboard.press('Shift+Control+ArrowLeft');

  await page.keyboard.type('.');

  await linesToBe(page, [
    'Alice was beginning to get very tired of',
    'sitting by her .ter on the bank,',
    'and of having nothing to do',
  ]);
});

test('select on move word bottom', async ({ page }) => {
  await page.keyboard.press('Shift+Control+ArrowRight');

  await page.keyboard.type('.');

  await linesToBe(page, [
    'Alice was beginning to get very tired of',
    'sitting by her sis. on the bank,',
    'and of having nothing to do',
  ]);
});

test('select on move line top', async ({ page }) => {
  await page.keyboard.press('Shift+Home');

  await page.keyboard.type('.');

  await linesToBe(page, [
    'Alice was beginning to get very tired of',
    '.ter on the bank,',
    'and of having nothing to do',
  ]);
});

test('select on move line bottom', async ({ page }) => {
  await page.keyboard.press('Shift+End');

  await page.keyboard.type('.');

  await linesToBe(page, [
    'Alice was beginning to get very tired of',
    'sitting by her sis.',
    'and of having nothing to do',
  ]);
});

test('select on move text top', async ({ page }) => {
  await page.keyboard.press('Shift+Control+Home');

  await page.keyboard.type('.');

  await linesToBe(page, ['.ter on the bank,', 'and of having nothing to do']);
});

test('select on move text bottom', async ({ page }) => {
  await page.keyboard.press('Shift+Control+End');

  await page.keyboard.type('.');

  await linesToBe(page, ['Alice was beginning to get very tired of', 'sitting by her sis.']);
});

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

test('select on move left', async ({ page }) => {
  await page.keyboard.down('Shift');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    'Alice was beginning to get very tired of',
    'sitting by her s.ter on the bank,',
    'and of having nothing to do',
  ]);
});

test('select on move right', async ({ page }) => {
  await page.keyboard.down('Shift');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    'Alice was beginning to get very tired of',
    'sitting by her sis.r on the bank,',
    'and of having nothing to do',
  ]);
});

test('select on move up', async ({ page }) => {
  await page.keyboard.press('Shift+ArrowUp');

  await page.keyboard.type('.');

  await linesToBe(page, ['Alice was beginnin.ter on the bank,', 'and of having nothing to do']);
});

test('select on move down', async ({ page }) => {
  await page.keyboard.press('Shift+ArrowDown');

  await page.keyboard.type('.');

  await linesToBe(page, ['Alice was beginning to get very tired of', 'sitting by her sis.ing to do']);
});

test('select none on move left then right', async ({ page }) => {
  await page.keyboard.down('Shift');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    'Alice was beginning to get very tired of',
    'sitting by her sis.ter on the bank,',
    'and of having nothing to do',
  ]);
});

test('select none on move down then up', async ({ page }) => {
  await page.keyboard.down('Shift');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    'Alice was beginning to get very tired of',
    'sitting by her sis.ter on the bank,',
    'and of having nothing to do',
  ]);
});

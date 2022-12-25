import test from '@playwright/test';

import { linesToBe } from './testUtils';

test.beforeEach(async ({ page }) => {
  await page.goto('./editor');
  await page.locator('[data-selectid=text-field]').click();
});

test('arrowleft', async ({ page }) => {
  await page.keyboard.type('ab');
  await page.keyboard.press('Enter');
  await page.keyboard.type('cd');

  await page.keyboard.press('ArrowLeft');
  await page.keyboard.type('1');

  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.type('2');

  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.type('3');

  await linesToBe(page, ['3ab2', 'c1d']);
});

test('arrowright', async ({ page }) => {
  await page.keyboard.type('ab');
  await page.keyboard.press('Enter');
  await page.keyboard.type('cd');

  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');

  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('1');

  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('2');

  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('3');

  await linesToBe(page, ['a1b', '2cd3']);
});

test('arrowup', async ({ page }) => {
  await page.keyboard.type('abcde');
  await page.keyboard.press('Enter');
  await page.keyboard.type('fg');
  await page.keyboard.press('Enter');
  await page.keyboard.type('hijkl');

  await page.keyboard.press('ArrowUp');
  await page.keyboard.type('1');

  await page.keyboard.press('ArrowUp');
  await page.keyboard.type('2');

  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.type('3');

  await linesToBe(page, ['3abc2de', 'fg1', 'hijkl']);
});

test('arrowdown', async ({ page }) => {
  await page.keyboard.type('abcde');
  await page.keyboard.press('Enter');
  await page.keyboard.type('fg');
  await page.keyboard.press('Enter');
  await page.keyboard.type('hijkl');

  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');

  await page.keyboard.press('ArrowDown');
  await page.keyboard.type('1');

  await page.keyboard.press('ArrowDown');
  await page.keyboard.type('2');

  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.type('3');

  await linesToBe(page, ['abcde', 'fg1', 'hij2kl3']);
});

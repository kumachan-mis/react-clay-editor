import test from '@playwright/test';

import { linesToBe } from './testUtils';

test.beforeEach(async ({ page }) => {
  await page.goto('./editor');
  await page.locator('[data-selectid=text-field]').click();
});

test('itemization enter (empty next)', async ({ page }) => {
  await page.keyboard.press('Space');
  await page.keyboard.type('item');
  await page.keyboard.press('Space');
  await page.keyboard.type('1');
  await page.keyboard.press('Enter');

  await page.keyboard.type('item');
  await page.keyboard.press('Space');
  await page.keyboard.type('2');
  await page.keyboard.press('Enter');

  await page.keyboard.press('Space');
  await page.keyboard.type('item');
  await page.keyboard.press('Space');
  await page.keyboard.type('3');
  await page.keyboard.press('Enter');

  await page.keyboard.type('item');
  await page.keyboard.press('Space');
  await page.keyboard.type('4');

  await linesToBe(page, [' item 1', ' item 2', '  item 3', '  item 4']);
});

test('itemization enter (non-empty next)', async ({ page }) => {
  await page.keyboard.press('Space');
  await page.keyboard.type('xx');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');

  await page.keyboard.press('Space');
  await page.keyboard.type('yy');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');

  await linesToBe(page, [' x', ' x', '  y', '  y']);
});

test('non-itemization enter', async ({ page }) => {
  await page.keyboard.type('-');
  await page.keyboard.press('Space');
  await page.keyboard.type('item');
  await page.keyboard.press('Space');
  await page.keyboard.type('1');
  await page.keyboard.press('Enter');

  await page.keyboard.type('item');
  await page.keyboard.press('Space');
  await page.keyboard.type('2');

  await linesToBe(page, ['- item 1', 'item 2']);
});

test('itemization backspace', async ({ page }) => {
  await page.keyboard.press('Space');
  await page.keyboard.type('i');

  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');

  await page.keyboard.type('.');

  await linesToBe(page, ['.']);
});

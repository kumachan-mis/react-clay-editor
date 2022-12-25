import test from '@playwright/test';

import { linesToBe } from './testUtils';

test.beforeEach(async ({ page }) => {
  await page.goto('./editor');
  await page.locator('[data-selectid=text-field]').click();
});

test('basic input', async ({ page }) => {
  await page.keyboard.type('abc');

  await linesToBe(page, ['abc']);
});

test('tab', async ({ page }) => {
  await page.keyboard.type('Hello');
  await page.keyboard.press('Tab');
  await page.keyboard.type('World');

  await linesToBe(page, ['Hello\tWorld']);
});

test('enter', async ({ page }) => {
  await page.keyboard.type('Hello');
  await page.keyboard.press('Enter');
  await page.keyboard.type('World');

  await linesToBe(page, ['Hello', 'World']);
});

test('backspace', async ({ page }) => {
  await page.keyboard.type('Hell');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Backspace');
  await page.keyboard.type('o');
  await page.keyboard.press('Enter');

  await page.keyboard.type('Wp');
  await page.keyboard.press('Backspace');
  await page.keyboard.type('orld');

  await linesToBe(page, ['Hello', 'World']);
});

test('backspace with selection', async ({ page }) => {
  await page.keyboard.type('Hello');
  await page.keyboard.press('Enter');
  await page.keyboard.type('World');

  await page.keyboard.press('Shift+Home');
  await page.keyboard.press('Backspace');

  await linesToBe(page, ['Hello', '']);
});

test('delete', async ({ page }) => {
  await page.keyboard.type('Hello');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Delete');
  await page.keyboard.type('o');
  await page.keyboard.press('Enter');

  await page.keyboard.type('Q');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Delete');
  await page.keyboard.press('Delete');
  await page.keyboard.press('Enter');
  await page.keyboard.type('World');

  await linesToBe(page, ['Hello', 'World']);
});

test('delete with selection', async ({ page }) => {
  await page.keyboard.type('Hello');
  await page.keyboard.press('Enter');
  await page.keyboard.type('World');

  await page.keyboard.press('Shift+Home');
  await page.keyboard.press('Delete');

  await linesToBe(page, ['Hello', '']);
});

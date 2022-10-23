import test from '@playwright/test';

import { linesToBe } from './testUtils';

test.beforeEach(async ({ page }) => {
  await page.goto('.');
  await page.locator('[data-selectid=editor-body]').click();
});

test('brackets auto-fill (empty)', async ({ page }) => {
  await page.keyboard.type('(');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('{');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('[');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('.');

  await linesToBe(page, ['(){}[].']);
});

test('brackets auto-fill (single-line selection)', async ({ page }) => {
  await page.keyboard.type('Hello');
  await page.keyboard.press('Space');
  await page.keyboard.type('Parens');
  await page.keyboard.press('Home');
  await page.keyboard.press('Shift+End');
  await page.keyboard.type('(');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('.');
  await page.keyboard.press('Enter');

  await page.keyboard.type('Hello');
  await page.keyboard.press('Space');
  await page.keyboard.type('Braces');
  await page.keyboard.press('Home');
  await page.keyboard.press('Shift+End');
  await page.keyboard.type('{');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('.');
  await page.keyboard.press('Enter');

  await page.keyboard.type('Hello');
  await page.keyboard.press('Space');
  await page.keyboard.type('Brackets');
  await page.keyboard.press('Home');
  await page.keyboard.press('Shift+End');
  await page.keyboard.type('[');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('.');

  await linesToBe(page, ['(Hello Parens).', '{Hello Braces}.', '[Hello Brackets].']);
});

test('brackets auto-fill (multi-line selection)', async ({ page }) => {
  await page.keyboard.type('Hello');
  await page.keyboard.press('Enter');
  await page.keyboard.type('Parens');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Home');
  await page.keyboard.press('Shift+ArrowDown');
  await page.keyboard.press('Shift+End');
  await page.keyboard.type('(');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('.');
  await page.keyboard.press('Enter');

  await page.keyboard.type('Hello');
  await page.keyboard.press('Enter');
  await page.keyboard.type('Braces');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Home');
  await page.keyboard.press('Shift+ArrowDown');
  await page.keyboard.press('Shift+End');
  await page.keyboard.type('{');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('.');
  await page.keyboard.press('Enter');

  await page.keyboard.type('Hello');
  await page.keyboard.press('Enter');
  await page.keyboard.type('Brackets');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Home');
  await page.keyboard.press('Shift+ArrowDown');
  await page.keyboard.press('Shift+End');
  await page.keyboard.type('[');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('.');

  await linesToBe(page, ['(Hello', 'Parens).', '{Hello', 'Braces}.', '[Hello', 'Brackets].']);
});

test('parens/braces/brackets auto-del', async ({ page }) => {
  await page.keyboard.type('(');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('{');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('[');
  await page.keyboard.press('ArrowRight');

  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Backspace');

  await page.keyboard.type('.');

  await linesToBe(page, ['.']);
});

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

test('brackets auto-fill (empty)', async () => {
  await page.keyboard.type('(');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('{');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('[');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('.');

  await linesToBe(page, ['(){}[].']);
});

test('brackets auto-fill (single-line selection)', async () => {
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

test('brackets auto-fill (multi-line selection)', async () => {
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

test('parens/braces/brackets auto-del', async () => {
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

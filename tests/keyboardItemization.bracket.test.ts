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

test('itemization enter (empty next)', async () => {
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

test('itemization enter (non-empty next)', async () => {
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

test('non-itemization enter', async () => {
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

test('itemization backspace', async () => {
  await page.keyboard.press('Space');
  await page.keyboard.type('i');

  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');

  await page.keyboard.type('.');

  await linesToBe(page, ['.']);
});

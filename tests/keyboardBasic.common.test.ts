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

test('basic input', async () => {
  await page.keyboard.type('abc');

  await linesToBe(page, ['abc']);
});

test('tab', async () => {
  await page.keyboard.type('Hello');
  await page.keyboard.press('Tab');
  await page.keyboard.type('World');

  await linesToBe(page, ['Hello\tWorld']);
});

test('enter', async () => {
  await page.keyboard.type('Hello');
  await page.keyboard.press('Enter');
  await page.keyboard.type('World');

  await linesToBe(page, ['Hello', 'World']);
});

test('backspace', async () => {
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

test('backspace with selection', async () => {
  await page.keyboard.type('Hello');
  await page.keyboard.press('Enter');
  await page.keyboard.type('World');

  await page.keyboard.press('Shift+Home');
  await page.keyboard.press('Backspace');

  await linesToBe(page, ['Hello', '']);
});

test('delete', async () => {
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

test('delete with selection', async () => {
  await page.keyboard.type('Hello');
  await page.keyboard.press('Enter');
  await page.keyboard.type('World');

  await page.keyboard.press('Shift+Home');
  await page.keyboard.press('Delete');

  await linesToBe(page, ['Hello', '']);
});

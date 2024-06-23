import { linesToBe } from './testUtils';

import { Page, test } from '@playwright/test';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('./editor');
});

test.beforeEach(async () => {
  const defaultText = [
    'Genius is one percent inspiration and',
    'ninety-nine percent perspiration',
    'by Thomas Edison',
  ].join('\n');

  await page.getByTestId('refresh-button').click();
  await page.locator('[data-selectid=text-field]').click();
  await page.keyboard.insertText(defaultText);
});

test.afterAll(async () => {
  await page.close();
});

test('select on move left', async () => {
  await page.locator('[data-selectid=line-L1] [data-selectid=char-C17]').click();

  await page.keyboard.down('Shift');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    // Expected lines
    'Genius is one percent inspiration and',
    'ninety-nine per.nt perspiration',
    'by Thomas Edison',
  ]);
});

test('select on move right', async () => {
  await page.locator('[data-selectid=line-L1] [data-selectid=char-C17]').click();

  await page.keyboard.down('Shift');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    // Expected lines
    'Genius is one percent inspiration and',
    'ninety-nine perce. perspiration',
    'by Thomas Edison',
  ]);
});

test('select on move up', async () => {
  await page.locator('[data-selectid=line-L1] [data-selectid=char-C17]').click();

  await page.keyboard.down('Shift');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    // Expected lines
    'Genius is one per.nt perspiration',
    'by Thomas Edison',
  ]);
});

test('select on move down', async () => {
  await page.locator('[data-selectid=line-L1] [data-selectid=char-C17]').click();

  await page.keyboard.down('Shift');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    // Expected lines
    'Genius is one percent inspiration and',
    'ninety-nine perce.',
  ]);
});

test('select on move line top', async () => {
  await page.locator('[data-selectid=line-L1] [data-selectid=char-C17]').click();

  await page.keyboard.down('Shift');
  await page.keyboard.press('Home');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    // Expected lines
    'Genius is one percent inspiration and',
    '.nt perspiration',
    'by Thomas Edison',
  ]);
});

test('select on move line bottom', async () => {
  await page.locator('[data-selectid=line-L1] [data-selectid=char-C17]').click();

  await page.keyboard.down('Shift');
  await page.keyboard.press('End');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    // Expected lines
    'Genius is one percent inspiration and',
    'ninety-nine perce.',
    'by Thomas Edison',
  ]);
});

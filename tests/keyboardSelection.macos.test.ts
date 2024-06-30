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

test('select on word top', async () => {
  await page.locator(':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C17]').click();

  await page.keyboard.down('Shift');
  await page.keyboard.press('Alt+ArrowLeft');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    // Expected lines
    'Genius is one percent inspiration and',
    'ninety-nine .nt perspiration',
    'by Thomas Edison',
  ]);
});

test('select on word bottom', async () => {
  await page.locator(':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C17]').click();

  await page.keyboard.down('Shift');
  await page.keyboard.press('Alt+ArrowRight');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    // Expected lines
    'Genius is one percent inspiration and',
    'ninety-nine perce. perspiration',
    'by Thomas Edison',
  ]);
});

test('select on text top', async () => {
  await page.locator(':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C17]').click();

  await page.keyboard.down('Shift');
  await page.keyboard.press('Meta+Home');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    // Expected lines
    '.nt perspiration',
    'by Thomas Edison',
  ]);
});

test('select on text bottom', async () => {
  await page.locator(':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C17]').click();

  await page.keyboard.down('Shift');
  await page.keyboard.press('Meta+End');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    // Expected lines
    'Genius is one percent inspiration and',
    'ninety-nine perce.',
  ]);
});

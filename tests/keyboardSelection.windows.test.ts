import { linesToBe } from './testUtils';

import { test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  const defaultText = [
    'Genius is one percent inspiration and',
    'ninety-nine percent perspiration',
    'by Thomas Edison',
  ].join('\n');

  await page.goto('./editor');
  await page.locator('[data-selectid=text-field]').click();
  await page.keyboard.insertText(defaultText);
});

test('select on word top', async ({ page }) => {
  await page.locator('[data-selectid=char-L1C17]').click();

  await page.keyboard.down('Shift');
  await page.keyboard.press('Control+ArrowLeft');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    'Genius is one percent inspiration and',
    'ninety-nine .nt perspiration',
    'by Thomas Edison',
  ]);
});

test('select on word bottom', async ({ page }) => {
  await page.locator('[data-selectid=char-L1C17]').click();

  await page.keyboard.down('Shift');
  await page.keyboard.press('Control+ArrowRight');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    'Genius is one percent inspiration and',
    'ninety-nine perce. perspiration',
    'by Thomas Edison',
  ]);
});

test('select on text top', async ({ page }) => {
  await page.locator('[data-selectid=char-L1C17]').click();

  await page.keyboard.down('Shift');
  await page.keyboard.press('Control+Home');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    '.nt perspiration',
    'by Thomas Edison',
  ]);
});

test('select on text bottom', async ({ page }) => {
  await page.locator('[data-selectid=char-L1C17]').click();

  await page.keyboard.down('Shift');
  await page.keyboard.press('Control+End');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    'Genius is one percent inspiration and',
    'ninety-nine perce.',
  ]);
});

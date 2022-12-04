import test from '@playwright/test';

import { linesToBe } from './testUtils';

test.beforeEach(async ({ page }) => {
  const defaultText = [
    'Genius is one percent inspiration and',
    'ninety-nine percent perspiration',
    'by Thomas Edison',
  ].join('\n');

  await page.goto('.');
  await page.locator('[data-selectid=text-field]').click();
  await page.keyboard.insertText(defaultText);
});

test('select on word top', async ({ page }) => {
  await page.locator('[data-selectid=char-L1C17]').click();

  await page.keyboard.down('Shift');
  await page.keyboard.press('Alt+ArrowLeft');
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
  await page.keyboard.press('Alt+ArrowRight');
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
  await page.keyboard.press('Meta+Home');
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
  await page.keyboard.press('Meta+End');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    'Genius is one percent inspiration and',
    'ninety-nine perce.',
  ]);
});

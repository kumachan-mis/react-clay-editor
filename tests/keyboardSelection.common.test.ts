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

test('select on move left', async ({ page }) => {
  await page.locator('[data-selectid=char-L1C17]').click();

  await page.keyboard.down('Shift');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    'Genius is one percent inspiration and',
    'ninety-nine per.nt perspiration',
    'by Thomas Edison',
  ]);
});

test('select on move right', async ({ page }) => {
  await page.locator('[data-selectid=char-L1C17]').click();

  await page.keyboard.down('Shift');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    'Genius is one percent inspiration and',
    'ninety-nine perce. perspiration',
    'by Thomas Edison',
  ]);
});

test('select on move up', async ({ page }) => {
  await page.locator('[data-selectid=char-L1C17]').click();

  await page.keyboard.down('Shift');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    'Genius is one per.nt perspiration',
    'by Thomas Edison',
  ]);
});

test('select on move down', async ({ page }) => {
  await page.locator('[data-selectid=char-L1C17]').click();

  await page.keyboard.down('Shift');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    'Genius is one percent inspiration and',
    'ninety-nine perce.',
  ]);
});

test('select on move line top', async ({ page }) => {
  await page.locator('[data-selectid=char-L1C17]').click();

  await page.keyboard.down('Shift');
  await page.keyboard.press('Home');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    'Genius is one percent inspiration and',
    '.nt perspiration',
    'by Thomas Edison',
  ]);
});

test('select on move line bottom', async ({ page }) => {
  await page.locator('[data-selectid=char-L1C17]').click();

  await page.keyboard.down('Shift');
  await page.keyboard.press('End');
  await page.keyboard.up('Shift');

  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    'Genius is one percent inspiration and',
    'ninety-nine perce.',
    'by Thomas Edison',
  ]);
});

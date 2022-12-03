import test from '@playwright/test';

import { linesToBe } from './testUtils';

test.beforeEach(async ({ page }) => {
  await page.goto('.');
  await page.locator('[data-selectid=text-field]').click();
});

test('quotation enter (empty next)', async ({ page }) => {
  await page.keyboard.type('>');
  await page.keyboard.press('Space');

  await page.keyboard.type('quotation');
  await page.keyboard.press('Space');
  await page.keyboard.type('1');
  await page.keyboard.press('Enter');

  await page.keyboard.type('quotation');
  await page.keyboard.press('Space');
  await page.keyboard.type('2');
  await page.keyboard.press('Enter');

  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');

  await page.keyboard.type('quotation');
  await page.keyboard.press('Space');
  await page.keyboard.type('3');
  await page.keyboard.press('Enter');

  await page.keyboard.type('quotation');
  await page.keyboard.press('Space');
  await page.keyboard.type('4');

  await linesToBe(page, ['> quotation 1', '> quotation 2', ' > quotation 3', ' > quotation 4']);
});

test('quotation enter (non-empty next)', async ({ page }) => {
  await page.keyboard.type('>');
  await page.keyboard.press('Space');

  await page.keyboard.type('pp');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');

  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');

  await page.keyboard.type('qq');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');

  await linesToBe(page, ['> p', '> p', ' > q', ' > q']);
});

test('quotation backspace', async ({ page }) => {
  await page.keyboard.type('>');
  await page.keyboard.press('Space');
  await page.keyboard.type('q');

  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');

  await page.keyboard.type('.');

  await linesToBe(page, ['.']);
});

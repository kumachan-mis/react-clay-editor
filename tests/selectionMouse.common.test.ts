import test from '@playwright/test';

import { dragAndDrop, linesToBe } from './testUtils';

test.beforeEach(async ({ page }) => {
  await page.goto('.');
  await page.locator('[data-selectid=editor-body]').click();
  await page.keyboard.insertText(
    [
      'Alice was beginning to get very tired of',
      'sitting by her sister on the bank,',
      'and of having nothing to do',
    ].join('\n')
  );
});

test('one line selection', async ({ page }) => {
  await dragAndDrop(page, '[data-selectid=char-L0C1]', '[data-selectid=char-L0C15]');
  await page.keyboard.press('Backspace');

  await linesToBe(page, [
    'Aning to get very tired of',
    'sitting by her sister on the bank,',
    'and of having nothing to do',
  ]);
});

test('two lines selection', async ({ page }) => {
  await dragAndDrop(page, '[data-selectid=char-L1C25]', '[data-selectid=char-L2C5]');
  await page.keyboard.press('Backspace');

  await linesToBe(page, [
    'Alice was beginning to get very tired of',
    'sitting by her sister on f having nothing to do',
  ]);
});

test('three lines selection', async ({ page }) => {
  await dragAndDrop(page, '[data-selectid=char-L0C29]', '[data-selectid=char-L2C10]');
  await page.keyboard.press('Backspace');

  await linesToBe(page, ['Alice was beginning to get veing nothing to do']);
});

test('double click selection', async ({ page }) => {
  await page.locator('[data-selectid=char-L2C15]').click({ clickCount: 2 });
  await page.keyboard.press('Backspace');

  await linesToBe(page, [
    'Alice was beginning to get very tired of',
    'sitting by her sister on the bank,',
    'and of having  to do',
  ]);
});

test('triple click selection', async ({ page }) => {
  await page.locator('[data-selectid=char-L2C15]').click({ clickCount: 3 });
  await page.keyboard.press('Backspace');

  await linesToBe(page, ['Alice was beginning to get very tired of', 'sitting by her sister on the bank,', '']);
});

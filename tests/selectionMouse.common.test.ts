import test, { Page } from '@playwright/test';

import { linesToBe } from './testUtils';

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
  await mouseSelect(page, '[data-selectid=char-L0C1]', '[data-selectid=char-L0C15]');
  await page.keyboard.press('Backspace');

  await linesToBe(page, [
    'Aning to get very tired of',
    'sitting by her sister on the bank,',
    'and of having nothing to do',
  ]);
});

test('two lines selection', async ({ page }) => {
  await mouseSelect(page, '[data-selectid=char-L1C25]', '[data-selectid=char-L2C5]');
  await page.keyboard.press('Backspace');

  await linesToBe(page, [
    'Alice was beginning to get very tired of',
    'sitting by her sister on f having nothing to do',
  ]);
});

test('three lines selection', async ({ page }) => {
  await mouseSelect(page, '[data-selectid=char-L0C29]', '[data-selectid=char-L2C10]');
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

async function mouseSelect(page: Page, fixedSelector: string, freeSelector: string) {
  const fixedBoundingBox = await page.locator(fixedSelector).boundingBox();
  const freeBoundingBox = await page.locator(freeSelector).boundingBox();
  if (!fixedBoundingBox || !freeBoundingBox) return;

  await page.mouse.move(fixedBoundingBox.x, fixedBoundingBox.y + fixedBoundingBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(freeBoundingBox.x, freeBoundingBox.y + freeBoundingBox.height / 2, { steps: 5 });
  await page.mouse.up();
}

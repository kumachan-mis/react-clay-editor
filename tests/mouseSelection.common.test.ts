import { mouseSelect, linesToBe, mouseMove } from './testUtils';

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

test('one line selection', async ({ page }) => {
  await mouseSelect(page, '[data-selectid=char-L0C1]', '[data-selectid=char-L0C15]');
  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    'G.ercent inspiration and',
    'ninety-nine percent perspiration',
    'by Thomas Edison',
  ]);
});

test('two lines selection', async ({ page }) => {
  await mouseSelect(page, '[data-selectid=char-L1C25]', '[data-selectid=char-L2C5]');
  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    'Genius is one percent inspiration and',
    'ninety-nine percent persp.omas Edison',
  ]);
});

test('three lines selection', async ({ page }) => {
  await mouseSelect(page, '[data-selectid=char-L0C29]', '[data-selectid=char-L2C10]');
  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    'Genius is one percent inspira.Edison',
  ]);
});

test('double click selection', async ({ page }) => {
  await page.locator('[data-selectid=char-L2C15]').click({ clickCount: 2 });
  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    'Genius is one percent inspiration and',
    'ninety-nine percent perspiration',
    'by Thomas .',
  ]);
});

test('triple click selection', async ({ page }) => {
  await page.locator('[data-selectid=char-L2C15]').click({ clickCount: 3 });
  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    'Genius is one percent inspiration and',
    'ninety-nine percent perspiration',
    '.',
  ]);
});

test('"down then up without move', async ({ page }) => {
  await mouseSelect(page, '[data-selectid=char-L2C15]', '[data-selectid=char-L2C15]');
  await page.keyboard.type('.');

  await linesToBe(page, [
    'Genius is one percent inspiration and',
    'ninety-nine percent perspiration',
    'by Thomas Ediso.n',
  ]);
});

test('move without down and up', async ({ page }) => {
  await mouseMove(page, '[data-selectid=char-L1C25]', '[data-selectid=char-L2C5]');
  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    'Genius is one percent inspiration and',
    'ninety-nine percent perspiration',
    'by Thomas Edison.',
  ]);
});

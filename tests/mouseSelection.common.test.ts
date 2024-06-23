import { mouseSelect, linesToBe, mouseMove } from './testUtils';

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

test('one line selection', async () => {
  await mouseSelect(
    page,
    '[data-selectid=line-L0] [data-selectid=char-C1]',
    '[data-selectid=line-L0] [data-selectid=char-C15]'
  );
  await page.keyboard.type('.');

  await linesToBe(page, [
    // Expected lines
    'G.ercent inspiration and',
    'ninety-nine percent perspiration',
    'by Thomas Edison',
  ]);
});

test('two lines selection', async () => {
  await mouseSelect(
    page,
    '[data-selectid=line-L1] [data-selectid=char-C25]',
    '[data-selectid=line-L2] [data-selectid=char-C5]'
  );
  await page.keyboard.type('.');

  await linesToBe(page, [
    // Expected lines
    'Genius is one percent inspiration and',
    'ninety-nine percent persp.omas Edison',
  ]);
});

test('three lines selection', async () => {
  await mouseSelect(
    page,
    '[data-selectid=line-L0] [data-selectid=char-C29]',
    '[data-selectid=line-L2] [data-selectid=char-C10]'
  );
  await page.keyboard.type('.');

  await linesToBe(page, [
    // Expected lines
    'Genius is one percent inspira.Edison',
  ]);
});

test('double click selection', async () => {
  await page.locator('[data-selectid=line-L2] [data-selectid=char-C15]').click({ clickCount: 2 });
  await page.keyboard.type('.');

  await linesToBe(page, [
    // Expected lines
    'Genius is one percent inspiration and',
    'ninety-nine percent perspiration',
    'by Thomas .',
  ]);
});

test('triple click selection', async () => {
  await page.locator('[data-selectid=line-L2] [data-selectid=char-C15]').click({ clickCount: 3 });
  await page.keyboard.type('.');

  await linesToBe(page, [
    // Expected lines
    'Genius is one percent inspiration and',
    'ninety-nine percent perspiration',
    '.',
  ]);
});

test('"down then up without move', async () => {
  await mouseSelect(
    page,
    '[data-selectid=line-L2] [data-selectid=char-C15]',
    '[data-selectid=line-L2] [data-selectid=char-C15]'
  );
  await page.keyboard.type('.');

  await linesToBe(page, [
    'Genius is one percent inspiration and',
    'ninety-nine percent perspiration',
    'by Thomas Ediso.n',
  ]);
});

test('move without down and up', async () => {
  await mouseMove(
    page,
    '[data-selectid=line-L1] [data-selectid=char-C25]',
    '[data-selectid=line-L2] [data-selectid=char-C5]'
  );
  await page.keyboard.type('.');

  await linesToBe(page, [
    // Expected lines
    'Genius is one percent inspiration and',
    'ninety-nine percent perspiration',
    'by Thomas Edison.',
  ]);
});

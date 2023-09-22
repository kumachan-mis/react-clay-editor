import { linesToBe } from './testUtils';

import { Page, test } from '@playwright/test';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('./editor');
});

test.beforeEach(async () => {
  await page.getByTestId('refresh-button').click();
  await page.locator('[data-selectid=text-field]').click();
});

test.afterAll(async () => {
  await page.close();
});

test('text suggestion', async () => {
  await page.keyboard.type('R');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');

  await page.keyboard.type('R');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');

  await page.keyboard.type('Real');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');

  await page.keyboard.type('S');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');

  await page.keyboard.type('X');
  await page.keyboard.press('Enter');

  await linesToBe(page, [
    // expected lines
    'React Clay Editor',
    'Real Time',
    'Real Time',
    'Syntactic',
    'X',
    '',
  ]);
});

test('bracket link suggestion', async () => {
  await page.keyboard.type('[');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');

  await page.keyboard.type('[');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');

  await page.keyboard.type('[@e');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');

  await page.keyboard.type('[@e');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');

  await page.keyboard.type('[@emotion/s');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');

  await page.keyboard.type('[k');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');

  await page.keyboard.type('[x');
  await page.keyboard.press('Enter');

  await linesToBe(page, [
    // expected lines
    '[react-clay-editor]',
    '[katex]',
    '[@emotion/react]',
    '[@emotion/styled]',
    '[@emotion/styled]',
    '[katex]',
    '[x',
    ']',
  ]);
});

test('hashtag suggestion', async () => {
  await page.keyboard.type('#');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');

  await page.keyboard.type('#');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');

  await page.keyboard.type('#@e');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');

  await page.keyboard.type('#@e');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');

  await page.keyboard.type('#@emotion/s');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');

  await page.keyboard.type('#k');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');

  await page.keyboard.type('#x');
  await page.keyboard.press('Enter');

  await linesToBe(page, [
    // expected lines
    '#react-clay-editor ',
    '#katex ',
    '#@emotion/react ',
    '#@emotion/styled ',
    '#@emotion/styled ',
    '#katex ',
    '#x',
    '',
  ]);
});

test('tagged link suggestion', async () => {
  await page.keyboard.type('[github:');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');

  await page.keyboard.type('[github: ');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');

  await page.keyboard.type('[github: @f');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');

  await page.keyboard.type('[github: x');
  await page.keyboard.press('Enter');

  await linesToBe(page, [
    // expected lines
    '[github: @kumachan-mis/react-clay-editor]',
    '[github: @KaTeX/KaTeX]',
    '[github: @facebook/react]',
    '[github: x',
    ']',
  ]);
});

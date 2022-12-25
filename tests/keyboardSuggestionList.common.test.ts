import test from '@playwright/test';

import { linesToBe } from './testUtils';

test.beforeEach(async ({ page }) => {
  await page.goto('./editor');
  await page.locator('[data-selectid=text-field]').click();
});

test('text suggestion', async ({ page }) => {
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
    'React Realtime Markup Editor',
    'Real Time',
    'Real Time',
    'Syntactic',
    'X',
    '',
  ]);
});

test('bracket link suggestion', async ({ page }) => {
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
    '[react-realtime-markup-editor]',
    '[katex]',
    '[@emotion/react]',
    '[@emotion/styled]',
    '[@emotion/styled]',
    '[katex]',
    '[x',
    ']',
  ]);
});

test('hashtag suggestion', async ({ page }) => {
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
    '#react-realtime-markup-editor ',
    '#katex ',
    '#@emotion/react ',
    '#@emotion/styled ',
    '#@emotion/styled ',
    '#katex ',
    '#x',
    '',
  ]);
});

test('tagged link suggestion', async ({ page }) => {
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
    '[github: @kumachan-mis/react-realtime-markup-editor]',
    '[github: @KaTeX/KaTeX]',
    '[github: @facebook/react]',
    '[github: x',
    ']',
  ]);
});

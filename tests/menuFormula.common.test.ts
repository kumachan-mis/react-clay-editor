import { linesToBe, mouseSelect } from './testUtils';

import { test, expect, Page } from '@playwright/test';

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

test('formula menu: inline-formula-button, no-selection, empty-line', async () => {
  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C0]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['$inline formula$']);

  await page.keyboard.type('f(x');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('g(y');
  await page.keyboard.press('ArrowRight');

  await linesToBe(page, ['$f(x)g(y)$']);
});

test('formula menu: display-formula-dropdown, no-selection, empty-line', async () => {
  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C0]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=display-formula-menu-item]').click();

  await linesToBe(page, ['$$display formula$$']);

  await page.keyboard.type('f(x');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('g(y');
  await page.keyboard.press('ArrowRight');

  await linesToBe(page, ['$$f(x)g(y)$$']);
});

test('formula menu: inline-formula-dropdown, no-selection, in-formula (inline)', async () => {
  await page.keyboard.insertText(['$f(x)$'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C2]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=inline-formula-menu-item]').click();

  await linesToBe(page, ['f(x)']);

  await page.keyboard.type('.');

  await linesToBe(page, ['f.(x)']);
});

test('formula menu: inline-formula-dropdown, no-selection, in-formula (display)', async () => {
  await page.keyboard.insertText(['$$f(x)$$'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C7]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=inline-formula-menu-item]').click();

  await linesToBe(page, ['$f(x)$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$f(x).$']);
});

test('formula menu: display-formula-dropdown, no-selection, in-formula (inline)', async () => {
  await page.keyboard.insertText(['$f(x)$'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C2]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=display-formula-menu-item]').click();

  await linesToBe(page, ['$$f(x)$$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$f.(x)$$']);
});

test('formula menu: display-formula-button, no-selection, in-formula (inline)', async () => {
  await page.keyboard.insertText(['$$f(x)$$'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C4]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['f(x)']);

  await page.keyboard.type('.');

  await linesToBe(page, ['f(.x)']);
});

test('formula menu: inline-formula-button, no-selection, in-normal', async () => {
  await page.keyboard.insertText(['normal text'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C9]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['normal te$inline formula$xt']);

  await page.keyboard.type('g(y');
  await page.keyboard.press('ArrowRight');

  await linesToBe(page, ['normal te$g(y)$xt']);
});

test('formula menu: inline-formula-dropdown, no-selection, in-normal-with-nextto-display', async () => {
  await page.keyboard.insertText(['$$f(x)g(x)$$text'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C12]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=inline-formula-menu-item]').click();

  await linesToBe(page, ['$$f(x)g(x)$$$inline formula$text']);

  await page.keyboard.type('h(t');
  await page.keyboard.press('ArrowRight');

  await linesToBe(page, ['$$f(x)g(x)$$$h(t)$text']);
});

test('formula menu: display-formula-dropdown, no-selection, in-normal', async () => {
  await page.keyboard.insertText(['normal text'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C9]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=display-formula-menu-item]').click();

  await linesToBe(page, ['normal te$$display formula$$xt']);

  await page.keyboard.type('g(y');
  await page.keyboard.press('ArrowRight');

  await linesToBe(page, ['normal te$$g(y)$$xt']);
});

test('formula menu: display-formula-dropdown, no-selection, in-normal-with-nextto-inline', async () => {
  await page.keyboard.insertText(['text$f(x)g(x)$'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C4]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=display-formula-menu-item]').click();

  await linesToBe(page, ['text$$display formula$$$f(x)g(x)$']);

  await page.keyboard.type('h(t');
  await page.keyboard.press('ArrowRight');

  await linesToBe(page, ['text$$h(t)$$$f(x)g(x)$']);
});

test('formula menu: inline-formula-dropdown, no-selection, in-normal-with-formula-left', async () => {
  await page.keyboard.insertText(['$f(x)$normal text'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C6]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=inline-formula-menu-item]').click();

  await linesToBe(page, ['$f(x)$$inline formula$normal text']);

  await page.keyboard.type('g(y');
  await page.keyboard.press('ArrowRight');

  await linesToBe(page, ['$f(x)$$g(y)$normal text']);
});

test('formula menu: inline-formula-button, no-selection, in-normal-with-formula-right', async () => {
  await page.keyboard.insertText(['normal text$$g(y)$$'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C11]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['normal text$inline formula$$$g(y)$$']);

  await page.keyboard.type('f(x');
  await page.keyboard.press('ArrowRight');

  await linesToBe(page, ['normal text$f(x)$$$g(y)$$']);
});

test('formula menu: inline-formula-dropdown, no-selection, other (content node)', async () => {
  await page.keyboard.insertText(['[bracket link]'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C11]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await expect(page.locator('[data-selectid=inline-formula-menu-item]')).toBeDisabled();

  await linesToBe(page, ['[bracket link]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[bracket li.nk]']);
});

test('formula menu: display-formula-dropdown, no-selection, other (block node)', async () => {
  await page.keyboard.insertText(['$$', 'nothing happened', '$$'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C3]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await expect(page.locator('[data-selectid=display-formula-menu-item]')).toBeDisabled();

  await linesToBe(page, ['$$', 'nothing happened', '$$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$', 'not.hing happened', '$$']);
});

test('formula menu: inline-formula-button, single-line-selection, in-formula-all (syntax and text)', async () => {
  await page.keyboard.insertText(['$formula string$'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C0]',
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C16]',
  );

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['formula string']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.']);
});

test('formula menu: display-formula-dropdown, single-line-selection, in-formula-all (text)', async () => {
  await page.keyboard.insertText(['$$formula string$$'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C2]',
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C16]',
  );

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=display-formula-menu-item]').click();

  await linesToBe(page, ['formula string']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.']);
});

test('formula menu: inline-formula-button, single-line-selection, in-formula-all (syntax)', async () => {
  await page.keyboard.insertText(['$formula string$'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C0]',
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C1]',
  );

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['formula string']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.formula string']);
});

test('formula menu: inline-formula-dropdown, single-line-selection, in-formula-left', async () => {
  await page.keyboard.insertText(['$\\sum_{i = 0}^{n-1} a_ib_i$'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C0]',
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C13]',
  );

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=inline-formula-menu-item]').click();

  await linesToBe(page, ['\\sum_{i = 0}$^{n-1} a_ib_i$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.$^{n-1} a_ib_i$']);
});

test('formula menu: inline-formula-button, single-line-selection, in-formula-mid', async () => {
  await page.keyboard.insertText(['$\\sum_{i = 0}^{n-1} a_ib_i$'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C6]',
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C14]',
  );

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['$\\sum_${i = 0}^${n-1} a_ib_i$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$\\sum_$.${n-1} a_ib_i$']);
});

test('formula menu: display-formula-dropdown, single-line-selection, in-formula-right', async () => {
  await page.keyboard.insertText(['$$\\sum_{i = 0}^{n-1} a_ib_i$$'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C21]',
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C28]',
  );

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=display-formula-menu-item]').click();

  await linesToBe(page, ['$$\\sum_{i = 0}^{n-1} $$a_ib_i']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$\\sum_{i = 0}^{n-1} $$.']);
});

test('formula menu: inline-formula-button, single-line-selection, in-normal', async () => {
  await page.keyboard.insertText(['$left formula$mid normal text$right formula$'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C16]',
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C24]',
  );

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['$left formula$mi$d normal$ text$right formula$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$left formula$mi$.$ text$right formula$']);
});

test('formula menu: inline-formula-dropdown, single-line-selection, in-normal-with-formula-left', async () => {
  await page.keyboard.insertText(['$left formula$mid normal text$right formula$'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C14]',
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C22]',
  );

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=inline-formula-menu-item]').click();

  await linesToBe(page, ['$left formula$$mid norm$al text$right formula$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$left formula$$.$al text$right formula$']);
});

test('formula menu: display-formula-dropdown, single-line-selection, in-normal-with-formula-right', async () => {
  await page.keyboard.insertText(['$left formula$mid normal text$right formula$'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C23]',
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C29]',
  );

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=display-formula-menu-item]').click();

  await linesToBe(page, ['$left formula$mid norma$$l text$$$right formula$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$left formula$mid norma$$.$$$right formula$']);
});

test('formula menu: inline-formula-dropdown, single-line-selection, other (mixed with foreigner)', async () => {
  await page.keyboard.insertText(['`code string`'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C3]',
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C8]',
  );

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await expect(page.locator('[data-selectid=inline-formula-menu-item]')).toBeDisabled();

  await linesToBe(page, ['`code string`']);

  await page.keyboard.type('.');

  await linesToBe(page, ['`co.ring`']);
});

test('formula menu: inline-formula-button, single-line-selection, other (mixed with friend)', async () => {
  await page.keyboard.insertText(['$left formula$mid normal text$right formula$'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C8]',
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C30]',
  );

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await expect(page.locator('[data-selectid=inline-formula-menu-item]')).toBeDisabled();

  await linesToBe(page, ['$left formula$mid normal text$right formula$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$left fo.right formula$']);
});

test('formula menu: block-formula, no-selection, empty-line', async () => {
  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C0]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, ['$$', 'block formula', '$$']);

  await page.keyboard.type('\\int f(x');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('g(y');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type(' dx');

  await linesToBe(page, ['$$', '\\int f(x)g(y) dx', '$$']);
});

test('formula menu: block-formula, no-selection, no-formula-line (with-trailing-meta)', async () => {
  await page.keyboard.insertText(['$$', '$$'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C2]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.']);
});

test('formula menu: block-formula, no-selection, no-formula-line (without-trailing-meta)', async () => {
  await page.keyboard.insertText(['$$'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C0]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.']);
});

test('formula menu: block-formula, no-selection, empty-formula', async () => {
  await page.keyboard.insertText(['$$', '', '$$'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C0]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.']);
});

test('formula menu: block-formula, no-selection, in-formula (formula)', async () => {
  await page.keyboard.insertText([' $$', ' f(x)g(y)', ' $$'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C3]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, [' f(x)g(y)']);

  await page.keyboard.type('.');

  await linesToBe(page, [' f(.x)g(y)']);
});

test('formula menu: block-formula, no-selection, in-formula (syntax)', async () => {
  await page.keyboard.insertText(['$$', 'f(x)g(y)', '\\lim_{z \\to 0} h(z)', '$$'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 4) [data-selectid=char-C2]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['f(x)g(y)', '\\lim_{z \\to 0} h(z)']);

  await page.keyboard.type('.');

  await linesToBe(page, ['f(x)g(y)', '\\lim_{z \\to 0} h(z).']);
});

test('formula menu: block-formula, no-selection, in-formula-top', async () => {
  await page.keyboard.insertText(['  $$', '  f(x)g(y)', '  r(x)\\theta(y)', '  $$'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C6]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['  f(x)g(y)', '  $$', '  r(x)\\theta(y)', '  $$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['  f(x).g(y)', '  $$', '  r(x)\\theta(y)', '  $$']);
});

test('formula menu: block-formula, no-selection, in-formula-mid', async () => {
  await page.keyboard.insertText(['$$', 'x = \\cos \\theta', 'y = \\sin \\theta', 'z = z_0', '$$'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 3) [data-selectid=char-C1]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, ['$$', 'x = \\cos \\theta', '$$', 'y = \\sin \\theta', '$$', 'z = z_0', '$$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$', 'x = \\cos \\theta', '$$', 'y. = \\sin \\theta', '$$', 'z = z_0', '$$']);
});

test('formula menu: block-formula, no-selection, in-formula-bottom', async () => {
  await page.keyboard.insertText(['  $$', '  x = \\cos \\theta;', '  y = \\sin \\theta', '  $$'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 3) [data-selectid=char-C9]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, ['  $$', '  x = \\cos \\theta;', '  $$', '  y = \\sin \\theta']);

  await page.keyboard.type('.');

  await linesToBe(page, ['  $$', '  x = \\cos \\theta;', '  $$', '  y = \\si.n \\theta']);
});

test('formula menu: block-formula, no-selection, in-other-line', async () => {
  await page.keyboard.insertText([' normal line'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C3]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, ['$$', ' normal line', '$$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$', ' no.rmal line', '$$']);
});

test('formula menu: block-formula, no-selection, in-other-line (with nested formula)', async () => {
  await page.keyboard.insertText([' $$', ' f(x)g(x)', ' $$', ' normal line'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C3]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, [' $$', ' f(x)g(x)', ' $$', '$$', ' normal line', '$$']);

  await page.keyboard.type('.');

  await linesToBe(page, [' $$', ' f(x)g(x)', ' $$', '$$', ' no.rmal line', '$$']);
});

test('formula menu: block-formula, no-selection, in-other-with-formula-above', async () => {
  await page.keyboard.insertText([' $$', ' f(x)g(x)', 'normal line'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C5]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, [' $$', ' f(x)g(x)', '$$', 'normal line', '$$']);

  await page.keyboard.type('.');

  await linesToBe(page, [' $$', ' f(x)g(x)', '$$', 'norma.l line', '$$']);
});

test('formula menu: block-formula, no-selection, in-other-with-formula-below', async () => {
  await page.keyboard.insertText([' normal line', '$$', 'f(x)g(x)', '$$'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C5]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, ['$$', ' normal line', '$$', '$$', 'f(x)g(x)', '$$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$', ' norm.al line', '$$', '$$', 'f(x)g(x)', '$$']);
});

test('formula menu: block-formula, selection, no-formula-line', async () => {
  await page.keyboard.insertText(['$$', '$$'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C0]',
    ':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C1]',
  );

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.']);
});

test('formula menu: block-formula, selection, all-formula-lines (syntax)', async () => {
  await page.keyboard.insertText(['$$', 'x = \\cos \\theta;', 'y = \\sin \\theta', '$$'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C1]',
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C2]',
  );

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, ['x = \\cos \\theta;', 'y = \\sin \\theta']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.x = \\cos \\theta;', 'y = \\sin \\theta']);
});

test('formula menu: block-formula, selection, all-formula-lines (formula)', async () => {
  await page.keyboard.insertText([' $$', ' x = \\cos \\theta;', ' y = \\sin \\theta'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C4]',
    ':nth-match([data-selectid^=line-L], 3) [data-selectid=char-C6]',
  );

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, [' x = \\cos \\theta;', ' y = \\sin \\theta']);

  await page.keyboard.type('.');

  await linesToBe(page, [' x =.sin \\theta']);
});

test('formula menu: block-formula, selection, all-formula-lines (formula and syntax)', async () => {
  await page.keyboard.insertText([' $$', ' x = \\cos \\theta;', ' y = \\sin \\theta'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C1]',
    ':nth-match([data-selectid^=line-L], 3) [data-selectid=char-C6]',
  );

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, [' x = \\cos \\theta;', ' y = \\sin \\theta']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.sin \\theta']);
});

test('formula menu: block-formula, selection, all-formula-lines-top', async () => {
  await page.keyboard.insertText([' $$', ' x = \\cos \\theta;', ' y = \\sin \\theta', ' $$'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C1]',
    ':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C5]',
  );

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, [' x = \\cos \\theta;', ' $$', ' y = \\sin \\theta', ' $$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.\\cos \\theta;', ' $$', ' y = \\sin \\theta', ' $$']);
});

test('formula menu: block-formula, selection, in-formula-mid', async () => {
  await page.keyboard.insertText([' $$', ' x = \\cos \\theta', ' y = \\sin \\theta', ' z = z_0', ' $$'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 3) [data-selectid=char-C8]',
    ':nth-match([data-selectid^=line-L], 3) [data-selectid=char-C0]',
  );

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, [' $$', ' x = \\cos \\theta', ' $$', ' y = \\sin \\theta', ' $$', ' z = z_0', ' $$']);

  await page.keyboard.type('.');

  await linesToBe(page, [' $$', ' x = \\cos \\theta', ' $$', '.n \\theta', ' $$', ' z = z_0', ' $$']);
});

test('formula menu: block-formula, selection, all-formula-lines-bottom', async () => {
  await page.keyboard.insertText([' $$', ' x = \\cos \\theta', ' y = \\sin \\theta'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 3) [data-selectid=char-C1]',
    ':nth-match([data-selectid^=line-L], 3) [data-selectid=char-C5]',
  );

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, [' $$', ' x = \\cos \\theta', ' $$', ' y = \\sin \\theta']);

  await page.keyboard.type('.');

  await linesToBe(page, [' $$', ' x = \\cos \\theta', ' $$', ' .\\sin \\theta']);
});

test('formula menu: block-formula, selection, all-other-lines', async () => {
  await page.keyboard.insertText(['normal line `formula string`', '$f(x)$ normal line'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C1]',
    ':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C3]',
  );

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, ['$$', 'normal line `formula string`', '$f(x)$ normal line', '$$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$', 'n.x)$ normal line', '$$']);
});

test('formula menu: block-formula, selection, in-other-with-formula-above', async () => {
  await page.keyboard.insertText(['normal text', 'normal text', '$$', 'f(x)g(x)'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C1]',
    ':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C3]',
  );

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, ['$$', 'normal text', 'normal text', '$$', '$$', 'f(x)g(x)']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$', 'n.mal text', '$$', '$$', 'f(x)g(x)']);
});

test('formula menu: block-formula, selection, in-other-with-formula-below', async () => {
  await page.keyboard.insertText(['$$', 'f(x)g(x)', '$$', 'normal text', 'normal text'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C9]',
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C11]',
  );

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, ['$$', 'f(x)g(x)', '$$', '$$', 'normal text', '$$', 'normal text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$', 'f(x)g(x)', '$$', '$$', 'normal te.', '$$', 'normal text']);
});

test('formula menu: block-formula, selection, mixed-lines (formula and other)', async () => {
  await page.keyboard.insertText(['$$', 'f(x)g(x)', '$$', 'normal text', 'normal text'].join('\n'));

  await page.locator('[data-selectid^=linegroup-L]').click();
  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 3) [data-selectid=char-C1]',
    ':nth-match([data-selectid^=line-L], 4) [data-selectid=char-C6]',
  );

  await expect(page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]')).toBeDisabled();

  await linesToBe(page, ['$$', 'f(x)g(x)', '$$', 'normal text', 'normal text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$', 'f(x)g(x)', '$. text', 'normal text']);
});

test('formula menu: block-formula, selection, mixed-lines (double formula)', async () => {
  await page.keyboard.insertText(['$$', 'x = \\cos \\theta', '$$', '$$', 'y = \\sin \\theta'].join('\n'));

  await page.locator(':nth-match([data-selectid^=linegroup-L], 2)').click();
  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C1]').click();
  await page.keyboard.press('Shift+ArrowUp');
  await page.keyboard.press('Shift+ArrowUp');
  await page.keyboard.press('Shift+ArrowRight');
  await page.keyboard.press('Shift+ArrowRight');
  await page.keyboard.press('Shift+ArrowRight');
  await page.keyboard.press('Shift+ArrowRight');

  await expect(page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]')).toBeDisabled();

  await linesToBe(page, ['$$', 'x = \\cos \\theta', '$$', '$$', 'y = \\sin \\theta']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$', 'x = \\.$', 'y = \\sin \\theta']);
});

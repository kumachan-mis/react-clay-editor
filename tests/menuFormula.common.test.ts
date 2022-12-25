import test, { expect } from '@playwright/test';

import { linesToBe, mouseSelect } from './testUtils';

test.beforeEach(async ({ page }) => {
  await page.goto('./editor');
  await page.locator('[data-selectid=text-field]').click();
});

test('formula menu: inline-formula-button, no-selection, empty-line', async ({ page }) => {
  await page.locator('[data-selectid=char-L0C0]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['$inline formula$']);

  await page.keyboard.type('f(x');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('g(y');
  await page.keyboard.press('ArrowRight');

  await linesToBe(page, ['$f(x)g(y)$']);
});

test('formula menu: display-formula-dropdown, no-selection, empty-line', async ({ page }) => {
  await page.locator('[data-selectid=char-L0C0]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=display-formula-menu-item]').click();

  await linesToBe(page, ['$$display formula$$']);

  await page.keyboard.type('f(x');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('g(y');
  await page.keyboard.press('ArrowRight');

  await linesToBe(page, ['$$f(x)g(y)$$']);
});

test('formula menu: inline-formula-dropdown, no-selection, in-formula (inline)', async ({ page }) => {
  await page.keyboard.insertText(['$f(x)$'].join('\n'));

  await page.locator('[data-selectid=char-L0C2]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=inline-formula-menu-item]').click();

  await linesToBe(page, ['f(x)']);

  await page.keyboard.type('.');

  await linesToBe(page, ['f.(x)']);
});

test('formula menu: inline-formula-dropdown, no-selection, in-formula (display)', async ({ page }) => {
  await page.keyboard.insertText(['$$f(x)$$'].join('\n'));

  await page.locator('[data-selectid=char-L0C7]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=inline-formula-menu-item]').click();

  await linesToBe(page, ['$f(x)$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$f(x).$']);
});

test('formula menu: display-formula-dropdown, no-selection, in-formula (inline)', async ({ page }) => {
  await page.keyboard.insertText(['$f(x)$'].join('\n'));

  await page.locator('[data-selectid=char-L0C2]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=display-formula-menu-item]').click();

  await linesToBe(page, ['$$f(x)$$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$f.(x)$$']);
});

test('formula menu: display-formula-button, no-selection, in-formula (inline)', async ({ page }) => {
  await page.keyboard.insertText(['$$f(x)$$'].join('\n'));

  await page.locator('[data-selectid=char-L0C4]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['f(x)']);

  await page.keyboard.type('.');

  await linesToBe(page, ['f(.x)']);
});

test('formula menu: inline-formula-button, no-selection, in-normal', async ({ page }) => {
  await page.keyboard.insertText(['normal text'].join('\n'));

  await page.locator('[data-selectid=char-L0C9]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['normal te$inline formula$xt']);

  await page.keyboard.type('g(y');
  await page.keyboard.press('ArrowRight');

  await linesToBe(page, ['normal te$g(y)$xt']);
});

test('formula menu: inline-formula-dropdown, no-selection, in-normal-with-nextto-display', async ({ page }) => {
  await page.keyboard.insertText(['$$f(x)g(x)$$text'].join('\n'));

  await page.locator('[data-selectid=char-L0C12]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=inline-formula-menu-item]').click();

  await linesToBe(page, ['$$f(x)g(x)$$$inline formula$text']);

  await page.keyboard.type('h(t');
  await page.keyboard.press('ArrowRight');

  await linesToBe(page, ['$$f(x)g(x)$$$h(t)$text']);
});

test('formula menu: display-formula-dropdown, no-selection, in-normal', async ({ page }) => {
  await page.keyboard.insertText(['normal text'].join('\n'));

  await page.locator('[data-selectid=char-L0C9]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=display-formula-menu-item]').click();

  await linesToBe(page, ['normal te$$display formula$$xt']);

  await page.keyboard.type('g(y');
  await page.keyboard.press('ArrowRight');

  await linesToBe(page, ['normal te$$g(y)$$xt']);
});

test('formula menu: display-formula-dropdown, no-selection, in-normal-with-nextto-inline', async ({ page }) => {
  await page.keyboard.insertText(['text$f(x)g(x)$'].join('\n'));

  await page.locator('[data-selectid=char-L0C4]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=display-formula-menu-item]').click();

  await linesToBe(page, ['text$$display formula$$$f(x)g(x)$']);

  await page.keyboard.type('h(t');
  await page.keyboard.press('ArrowRight');

  await linesToBe(page, ['text$$h(t)$$$f(x)g(x)$']);
});

test('formula menu: inline-formula-dropdown, no-selection, in-normal-with-formula-left', async ({ page }) => {
  await page.keyboard.insertText(['$f(x)$normal text'].join('\n'));

  await page.locator('[data-selectid=char-L0C6]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=inline-formula-menu-item]').click();

  await linesToBe(page, ['$f(x)$$inline formula$normal text']);

  await page.keyboard.type('g(y');
  await page.keyboard.press('ArrowRight');

  await linesToBe(page, ['$f(x)$$g(y)$normal text']);
});

test('formula menu: inline-formula-button, no-selection, in-normal-with-formula-right', async ({ page }) => {
  await page.keyboard.insertText(['normal text$$g(y)$$'].join('\n'));

  await page.locator('[data-selectid=char-L0C11]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['normal text$inline formula$$$g(y)$$']);

  await page.keyboard.type('f(x');
  await page.keyboard.press('ArrowRight');

  await linesToBe(page, ['normal text$f(x)$$$g(y)$$']);
});

test('formula menu: inline-formula-dropdown, no-selection, other (content node)', async ({ page }) => {
  await page.keyboard.insertText(['[bracket link]'].join('\n'));

  await page.locator('[data-selectid=char-L0C11]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await expect(page.locator('[data-selectid=inline-formula-menu-item]')).toBeDisabled();

  await linesToBe(page, ['[bracket link]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[bracket li.nk]']);
});

test('formula menu: display-formula-dropdown, no-selection, other (block node)', async ({ page }) => {
  await page.keyboard.insertText(['$$', 'nothing happened', '$$'].join('\n'));

  await page.locator('[data-selectid=char-L1C3]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await expect(page.locator('[data-selectid=display-formula-menu-item]')).toBeDisabled();

  await linesToBe(page, ['$$', 'nothing happened', '$$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$', 'not.hing happened', '$$']);
});

test('formula menu: inline-formula-button, single-line-selection, in-formula-all (syntax and text)', async ({
  page,
}) => {
  await page.keyboard.insertText(['$formula string$'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C0]', '[data-selectid=char-L0C16]');

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['formula string']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.']);
});

test('formula menu: display-formula-dropdown, single-line-selection, in-formula-all (text)', async ({ page }) => {
  await page.keyboard.insertText(['$$formula string$$'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C2]', '[data-selectid=char-L0C16]');

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=display-formula-menu-item]').click();

  await linesToBe(page, ['formula string']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.']);
});

test('formula menu: inline-formula-button, single-line-selection, in-formula-all (syntax)', async ({ page }) => {
  await page.keyboard.insertText(['$formula string$'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C0]', '[data-selectid=char-L0C1]');

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['formula string']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.formula string']);
});

test('formula menu: inline-formula-dropdown, single-line-selection, in-formula-left', async ({ page }) => {
  await page.keyboard.insertText(['$\\sum_{i = 0}^{n-1} a_ib_i$'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C0]', '[data-selectid=char-L0C13]');

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=inline-formula-menu-item]').click();

  await linesToBe(page, ['\\sum_{i = 0}$^{n-1} a_ib_i$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.$^{n-1} a_ib_i$']);
});

test('formula menu: inline-formula-button, single-line-selection, in-formula-mid', async ({ page }) => {
  await page.keyboard.insertText(['$\\sum_{i = 0}^{n-1} a_ib_i$'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C6]', '[data-selectid=char-L0C14]');

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['$\\sum_${i = 0}^${n-1} a_ib_i$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$\\sum_$.${n-1} a_ib_i$']);
});

test('formula menu: display-formula-dropdown, single-line-selection, in-formula-right', async ({ page }) => {
  await page.keyboard.insertText(['$$\\sum_{i = 0}^{n-1} a_ib_i$$'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C21]', '[data-selectid=char-L0C28]');

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=display-formula-menu-item]').click();

  await linesToBe(page, ['$$\\sum_{i = 0}^{n-1} $$a_ib_i']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$\\sum_{i = 0}^{n-1} $$.']);
});

test('formula menu: inline-formula-button, single-line-selection, in-normal', async ({ page }) => {
  await page.keyboard.insertText(['$left formula$mid normal text$right formula$'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C16]', '[data-selectid=char-L0C24]');

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['$left formula$mi$d normal$ text$right formula$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$left formula$mi$.$ text$right formula$']);
});

test('formula menu: inline-formula-dropdown, single-line-selection, in-normal-with-formula-left', async ({ page }) => {
  await page.keyboard.insertText(['$left formula$mid normal text$right formula$'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C14]', '[data-selectid=char-L0C22]');

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=inline-formula-menu-item]').click();

  await linesToBe(page, ['$left formula$$mid norm$al text$right formula$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$left formula$$.$al text$right formula$']);
});

test('formula menu: display-formula-dropdown, single-line-selection, in-normal-with-formula-right', async ({
  page,
}) => {
  await page.keyboard.insertText(['$left formula$mid normal text$right formula$'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C23]', '[data-selectid=char-L0C29]');

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=display-formula-menu-item]').click();

  await linesToBe(page, ['$left formula$mid norma$$l text$$$right formula$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$left formula$mid norma$$.$$$right formula$']);
});

test('formula menu: inline-formula-dropdown, single-line-selection, other (mixed with foreigner)', async ({ page }) => {
  await page.keyboard.insertText(['`code string`'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C3]', '[data-selectid=char-L0C8]');

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await expect(page.locator('[data-selectid=inline-formula-menu-item]')).toBeDisabled();

  await linesToBe(page, ['`code string`']);

  await page.keyboard.type('.');

  await linesToBe(page, ['`co.ring`']);
});

test('formula menu: inline-formula-button, single-line-selection, other (mixed with friend)', async ({ page }) => {
  await page.keyboard.insertText(['$left formula$mid normal text$right formula$'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C8]', '[data-selectid=char-L0C30]');

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await expect(page.locator('[data-selectid=inline-formula-menu-item]')).toBeDisabled();

  await linesToBe(page, ['$left formula$mid normal text$right formula$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$left fo.right formula$']);
});

test('formula menu: block-formula, no-selection, empty-line', async ({ page }) => {
  await page.locator('[data-selectid=char-L0C0]').click();

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

test('code menu: block-formula, no-selection, empty-formula', async ({ page }) => {
  await page.keyboard.insertText(['$$', '', '$$'].join('\n'));

  await page.locator('[data-selectid=char-L1C0]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.']);
});

test('formula menu: block-formula, no-selection, in-formula (formula)', async ({ page }) => {
  await page.keyboard.insertText([' $$', ' f(x)g(y)', ' $$'].join('\n'));

  await page.locator('[data-selectid=char-L1C3]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, [' f(x)g(y)']);

  await page.keyboard.type('.');

  await linesToBe(page, [' f(.x)g(y)']);
});

test('formula menu: block-formula, no-selection, in-formula (syntax)', async ({ page }) => {
  await page.keyboard.insertText(['$$', 'f(x)g(y)', '\\lim_{z \\to 0} h(z)', '$$'].join('\n'));

  await page.locator('[data-selectid=char-L3C2]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['f(x)g(y)', '\\lim_{z \\to 0} h(z)']);

  await page.keyboard.type('.');

  await linesToBe(page, ['f(x)g(y)', '\\lim_{z \\to 0} h(z).']);
});

test('formula menu: block-formula, no-selection, in-formula-top', async ({ page }) => {
  await page.keyboard.insertText(['  $$', '  f(x)g(y)', '  r(x)\\theta(y)', '  $$'].join('\n'));

  await page.locator('[data-selectid=char-L1C6]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['  f(x)g(y)', '  $$', '  r(x)\\theta(y)', '  $$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['  f(x).g(y)', '  $$', '  r(x)\\theta(y)', '  $$']);
});

test('formula menu: block-formula, no-selection, in-formula-mid', async ({ page }) => {
  await page.keyboard.insertText(['$$', 'x = \\cos \\theta', 'y = \\sin \\theta', 'z = z_0', '$$'].join('\n'));

  await page.locator('[data-selectid=char-L2C1]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, ['$$', 'x = \\cos \\theta', '$$', 'y = \\sin \\theta', '$$', 'z = z_0', '$$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$', 'x = \\cos \\theta', '$$', 'y. = \\sin \\theta', '$$', 'z = z_0', '$$']);
});

test('formula menu: block-formula, no-selection, in-formula-bottom', async ({ page }) => {
  await page.keyboard.insertText(['  $$', '  x = \\cos \\theta;', '  y = \\sin \\theta', '  $$'].join('\n'));

  await page.locator('[data-selectid=char-L2C9]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, ['  $$', '  x = \\cos \\theta;', '  $$', '  y = \\sin \\theta']);

  await page.keyboard.type('.');

  await linesToBe(page, ['  $$', '  x = \\cos \\theta;', '  $$', '  y = \\si.n \\theta']);
});

test('formula menu: block-formula, no-selection, in-other-line', async ({ page }) => {
  await page.keyboard.insertText([' normal line'].join('\n'));

  await page.locator('[data-selectid=char-L0C3]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, ['$$', ' normal line', '$$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$', ' no.rmal line', '$$']);
});

test('formula menu: block-formula, no-selection, in-other-line (with nested formula)', async ({ page }) => {
  await page.keyboard.insertText([' $$', ' f(x)g(x)', ' $$', ' normal line'].join('\n'));

  await page.locator('[data-selectid=char-L3C3]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, [' $$', ' f(x)g(x)', ' $$', '$$', ' normal line', '$$']);

  await page.keyboard.type('.');

  await linesToBe(page, [' $$', ' f(x)g(x)', ' $$', '$$', ' no.rmal line', '$$']);
});

test('formula menu: block-formula, no-selection, in-other-with-formula-above', async ({ page }) => {
  await page.keyboard.insertText([' $$', ' f(x)g(x)', 'normal line'].join('\n'));

  await page.locator('[data-selectid=char-L2C5]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, [' $$', ' f(x)g(x)', '$$', 'normal line', '$$']);

  await page.keyboard.type('.');

  await linesToBe(page, [' $$', ' f(x)g(x)', '$$', 'norma.l line', '$$']);
});

test('formula menu: block-formula, no-selection, in-other-with-formula-below', async ({ page }) => {
  await page.keyboard.insertText([' normal line', '$$', 'f(x)g(x)', '$$'].join('\n'));

  await page.locator('[data-selectid=char-L0C5]').click();

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, ['$$', ' normal line', '$$', '$$', 'f(x)g(x)', '$$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$', ' norm.al line', '$$', '$$', 'f(x)g(x)', '$$']);
});

test('formula menu: block-formula, selection, all-formula-lines (syntax)', async ({ page }) => {
  await page.keyboard.insertText(['$$', 'x = \\cos \\theta;', 'y = \\sin \\theta', '$$'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C1]', '[data-selectid=char-L0C2]');

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, ['x = \\cos \\theta;', 'y = \\sin \\theta']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.x = \\cos \\theta;', 'y = \\sin \\theta']);
});

test('formula menu: block-formula, selection, all-formula-lines (formula)', async ({ page }) => {
  await page.keyboard.insertText([' $$', ' x = \\cos \\theta;', ' y = \\sin \\theta'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L1C4]', '[data-selectid=char-L2C6]');

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, [' x = \\cos \\theta;', ' y = \\sin \\theta']);

  await page.keyboard.type('.');

  await linesToBe(page, [' x =.sin \\theta']);
});

test('formula menu: block-formula, selection, all-formula-lines (formula and syntax)', async ({ page }) => {
  await page.keyboard.insertText([' $$', ' x = \\cos \\theta;', ' y = \\sin \\theta'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C1]', '[data-selectid=char-L2C6]');

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, [' x = \\cos \\theta;', ' y = \\sin \\theta']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.sin \\theta']);
});

test('formula menu: block-formula, selection, all-formula-lines-top', async ({ page }) => {
  await page.keyboard.insertText([' $$', ' x = \\cos \\theta;', ' y = \\sin \\theta', ' $$'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C1]', '[data-selectid=char-L1C5]');

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, [' x = \\cos \\theta;', ' $$', ' y = \\sin \\theta', ' $$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.\\cos \\theta;', ' $$', ' y = \\sin \\theta', ' $$']);
});

test('formula menu: block-formula, selection, in-formula-mid', async ({ page }) => {
  await page.keyboard.insertText([' $$', ' x = \\cos \\theta', ' y = \\sin \\theta', ' z = z_0', ' $$'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L2C8]', '[data-selectid=char-L2C0]');

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, [' $$', ' x = \\cos \\theta', ' $$', ' y = \\sin \\theta', ' $$', ' z = z_0', ' $$']);

  await page.keyboard.type('.');

  await linesToBe(page, [' $$', ' x = \\cos \\theta', ' $$', '.n \\theta', ' $$', ' z = z_0', ' $$']);
});

test('formula menu: block-formula, selection, all-formula-lines-bottom', async ({ page }) => {
  await page.keyboard.insertText([' $$', ' x = \\cos \\theta', ' y = \\sin \\theta'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L2C1]', '[data-selectid=char-L2C5]');

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, [' $$', ' x = \\cos \\theta', ' $$', ' y = \\sin \\theta']);

  await page.keyboard.type('.');

  await linesToBe(page, [' $$', ' x = \\cos \\theta', ' $$', ' .\\sin \\theta']);
});

test('formula menu: block-formula, selection, all-other-lines', async ({ page }) => {
  await page.keyboard.insertText(['normal line `formula string`', '$f(x)$ normal line'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C1]', '[data-selectid=char-L1C3]');

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, ['$$', 'normal line `formula string`', '$f(x)$ normal line', '$$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$', 'n.x)$ normal line', '$$']);
});

test('formula menu: block-formula, selection, in-other-with-formula-above', async ({ page }) => {
  await page.keyboard.insertText(['normal text', 'normal text', '$$', 'f(x)g(x)'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C1]', '[data-selectid=char-L1C3]');

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, ['$$', 'normal text', 'normal text', '$$', '$$', 'f(x)g(x)']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$', 'n.mal text', '$$', '$$', 'f(x)g(x)']);
});

test('formula menu: block-formula, selection, in-other-with-formula-below', async ({ page }) => {
  await page.keyboard.insertText(['$$', 'f(x)g(x)', '$$', 'normal text', 'normal text'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L3C9]', '[data-selectid=char-L3C11]');

  await page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-formula-menu-item]').click();

  await linesToBe(page, ['$$', 'f(x)g(x)', '$$', '$$', 'normal text', '$$', 'normal text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$', 'f(x)g(x)', '$$', '$$', 'normal te.', '$$', 'normal text']);
});

test('formula menu: block-formula, selection, mixed-lines (formula and other)', async ({ page }) => {
  await page.keyboard.insertText(['$$', 'f(x)g(x)', '$$', 'normal text', 'normal text'].join('\n'));

  await page.locator('[data-selectid=linegroup-L1-1]').click();
  await mouseSelect(page, '[data-selectid=char-L2C1]', '[data-selectid=char-L3C6]');

  await expect(page.locator('[data-selectid=formula-menu] >> [data-selectid=dropdown-arrow-button]')).toBeDisabled();

  await linesToBe(page, ['$$', 'f(x)g(x)', '$$', 'normal text', 'normal text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$', 'f(x)g(x)', '$. text', 'normal text']);
});

test('formula menu: block-formula, selection, mixed-lines (double formula)', async ({ page }) => {
  await page.keyboard.insertText(['$$', 'x = \\cos \\theta', '$$', '$$', 'y = \\sin \\theta'].join('\n'));

  await page.locator('[data-selectid=linegroup-L4-4]').click();
  await page.locator('[data-selectid=char-L3C1]').click();
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

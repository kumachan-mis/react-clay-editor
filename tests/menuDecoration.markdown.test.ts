import { linesToBe, mouseSelect } from './testUtils';

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./editor');
  await page.locator('[data-selectid=text-field]').click();
});

test('decoration menus: bold, no-selection, empty-line', async ({ page }) => {
  await page.locator('[data-selectid=char-L0C0]').click();

  await page.locator('[data-selectid=bold-menu]').click();

  await linesToBe(page, ['*bold*']);

  await page.keyboard.type('React Realtime Markup Editor');

  await linesToBe(page, ['*React Realtime Markup Editor*']);
});

test('decoration menus: italic, no-selection, empty-line', async ({ page }) => {
  await page.locator('[data-selectid=char-L0C0]').click();

  await page.locator('[data-selectid=italic-menu]').click();

  await linesToBe(page, ['_italic_']);

  await page.keyboard.type('React Realtime Markup Editor');

  await linesToBe(page, ['_React Realtime Markup Editor_']);
});

test('decoration menus: bold, no-selection, in-bold', async ({ page }) => {
  await page.keyboard.insertText(['*bold text*'].join('\n'));

  await page.locator('[data-selectid=char-L0C2]').click();

  await page.locator('[data-selectid=bold-menu]').click();

  await linesToBe(page, ['bold text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['b.old text']);
});

test('decoration menus: italic, no-selection, in-italic', async ({ page }) => {
  await page.keyboard.insertText(['_italic text_'].join('\n'));

  await page.locator('[data-selectid=char-L0C4]').click();

  await page.locator('[data-selectid=italic-menu]').click();

  await linesToBe(page, ['italic text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['ita.lic text']);
});

test('decoration menus: bold, no-selection, in-italic', async ({ page }) => {
  await page.keyboard.insertText(['_italic text_'].join('\n'));

  await page.locator('[data-selectid=char-L0C7]').click();

  await expect(page.locator('[data-selectid=bold-menu]')).toBeDisabled();

  await linesToBe(page, ['_italic text_']);

  await page.keyboard.type('.');

  await linesToBe(page, ['_italic. text_']);
});

test('decoration menus: italic, no-selection, in-bold', async ({ page }) => {
  await page.keyboard.insertText(['*bold text*'].join('\n'));

  await page.locator('[data-selectid=char-L0C5]').click();

  await expect(page.locator('[data-selectid=italic-menu]')).toBeDisabled();

  await linesToBe(page, ['*bold text*']);

  await page.keyboard.type('.');

  await linesToBe(page, ['*bold. text*']);
});

test('decoration menus: bold, no-selection, in-normal-with-decoration-left', async ({ page }) => {
  await page.keyboard.insertText(['*important*'].join('\n'));

  await page.locator('[data-selectid=char-L0C11]').click();

  await page.locator('[data-selectid=bold-menu]').click();

  await linesToBe(page, ['*important**bold*']);

  await page.keyboard.type('really important');

  await linesToBe(page, ['*important**really important*']);
});

test('decoration menus: italic, no-selection, in-normal-with-decoration-right', async ({ page }) => {
  await page.keyboard.insertText(['_important_'].join('\n'));

  await page.locator('[data-selectid=char-L0C0]').click();

  await page.locator('[data-selectid=italic-menu]').click();

  await linesToBe(page, ['_italic__important_']);

  await page.keyboard.type('This is');

  await linesToBe(page, ['_This is__important_']);
});

test('decoration menus: bold, no-selection, other (content node)', async ({ page }) => {
  await page.keyboard.insertText(['[bracket link]'].join('\n'));

  await page.locator('[data-selectid=char-L0C4]').click();

  await expect(page.locator('[data-selectid=bold-menu]')).toBeDisabled();

  await linesToBe(page, ['[bracket link]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[bra.cket link]']);
});

test('decoration menus: italic, no-selection, other (block node)', async ({ page }) => {
  await page.keyboard.insertText(['```', 'code string', '```'].join('\n'));

  await page.locator('[data-selectid=char-L1C6]').click();

  await expect(page.locator('[data-selectid=italic-menu]')).toBeDisabled();

  await linesToBe(page, ['```', 'code string', '```']);

  await page.keyboard.type('.');

  await linesToBe(page, ['```', 'code s.tring', '```']);
});

test('decoration menus: bold, single-line-selection, in-decoration-all', async ({ page }) => {
  await page.keyboard.insertText(['*bold text*'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C0]', '[data-selectid=char-L0C11]');

  await page.locator('[data-selectid=bold-menu]').click();

  await linesToBe(page, ['bold text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.']);
});

test('decoration menus: italic, single-line-selection, in-decoration-all', async ({ page }) => {
  await page.keyboard.insertText(['_italic text_'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C0]', '[data-selectid=char-L0C1]');

  await page.locator('[data-selectid=italic-menu]').click();

  await linesToBe(page, ['italic text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.italic text']);
});

test('decoration menus: bold, single-line-selection, in-decoration-left (without-deco)', async ({ page }) => {
  await page.keyboard.insertText(['*left mid right*'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C1]', '[data-selectid=char-L0C5]');

  await page.locator('[data-selectid=bold-menu]').click();

  await linesToBe(page, ['left* mid right*']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.* mid right*']);
});

test('decoration menus: italic, single-line-selection, in-decoration-left (with-deco)', async ({ page }) => {
  await page.keyboard.insertText(['_left mid right_'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C0]', '[data-selectid=char-L0C5]');

  await page.locator('[data-selectid=italic-menu]').click();

  await linesToBe(page, ['left_ mid right_']);

  await page.keyboard.type('.');

  await linesToBe(page, ['._ mid right_']);
});

test('decoration menus: italic, single-line-selection, in-decoration-right (without-deco)', async ({ page }) => {
  await page.keyboard.insertText(['_left mid right_'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C9]', '[data-selectid=char-L0C15]');

  await page.locator('[data-selectid=italic-menu]').click();

  await linesToBe(page, ['_left mid_ right']);

  await page.keyboard.type('.');

  await linesToBe(page, ['_left mid_.']);
});

test('decoration menus: bold, single-line-selection, in-decoration-right (with-deco)', async ({ page }) => {
  await page.keyboard.insertText(['*left mid right*'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C9]', '[data-selectid=char-L0C16]');

  await page.locator('[data-selectid=bold-menu]').click();

  await linesToBe(page, ['*left mid* right']);

  await page.keyboard.type('.');

  await linesToBe(page, ['*left mid*.']);
});

test('decoration menus: bold, single-line-selection, in-decoration-mid', async ({ page }) => {
  await page.keyboard.insertText(['*left mid right*'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C5]', '[data-selectid=char-L0C10]');

  await page.locator('[data-selectid=bold-menu]').click();

  await linesToBe(page, ['*left* mid *right*']);

  await page.keyboard.type('.');

  await linesToBe(page, ['*left*.*right*']);
});

test('decoration menus: italic, single-line-selection, in-decoration-mid', async ({ page }) => {
  await page.keyboard.insertText(['_left mid right_'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C5]', '[data-selectid=char-L0C10]');

  await page.locator('[data-selectid=italic-menu]').click();

  await linesToBe(page, ['_left_ mid _right_']);

  await page.keyboard.type('.');

  await linesToBe(page, ['_left_._right_']);
});

test('decoration menus: bold, single-line-selection, in-normal', async ({ page }) => {
  await page.keyboard.insertText(['normal text'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C2]', '[data-selectid=char-L0C10]');

  await page.locator('[data-selectid=bold-menu]').click();

  await linesToBe(page, ['no*rmal tex*t']);

  await page.keyboard.type('.');

  await linesToBe(page, ['no*.*t']);
});

test('decoration menus: italic, single-line-selection, in-normal', async ({ page }) => {
  await page.keyboard.insertText(['normal text'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C2]', '[data-selectid=char-L0C10]');

  await page.locator('[data-selectid=italic-menu]').click();

  await linesToBe(page, ['no_rmal tex_t']);

  await page.keyboard.type('.');

  await linesToBe(page, ['no_._t']);
});

test('decoration menus: italic, single-line-selection, in-normal-with-decoration-left', async ({ page }) => {
  await page.keyboard.insertText(['_normal_ text'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C8]', '[data-selectid=char-L0C11]');

  await page.locator('[data-selectid=italic-menu]').click();

  await linesToBe(page, ['_normal__ te_xt']);

  await page.keyboard.type('.');

  await linesToBe(page, ['_normal__._xt']);
});

test('decoration menus: bold, single-line-selection, in-normal-with-decoration-right', async ({ page }) => {
  await page.keyboard.insertText(['normal *text*'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C2]', '[data-selectid=char-L0C7]');

  await page.locator('[data-selectid=bold-menu]').click();

  await linesToBe(page, ['no*rmal **text*']);

  await page.keyboard.type('.');

  await linesToBe(page, ['no*.**text*']);
});

test('decoration menus: bold, single-line-selection, other (mixed with friends)', async ({ page }) => {
  await page.keyboard.insertText(['normal *text*'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C2]', '[data-selectid=char-L0C10]');

  await expect(page.locator('[data-selectid=bold-menu]')).toBeDisabled();

  await linesToBe(page, ['normal *text*']);

  await page.keyboard.type('.');

  await linesToBe(page, ['no.xt*']);
});

test('decoration menus: italic, single-line-selection, other (mixed with foreigner)', async ({ page }) => {
  await page.keyboard.insertText(['normal #hashtag_link'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C2]', '[data-selectid=char-L0C12]');

  await expect(page.locator('[data-selectid=italic-menu]')).toBeDisabled();

  await linesToBe(page, ['normal #hashtag_link']);

  await page.keyboard.type('.');

  await linesToBe(page, ['no.tag_link']);
});

test('decoration menus: bold, multi-lines-selection', async ({ page }) => {
  await page.keyboard.insertText(['normal text', 'normal text too'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C2]', '[data-selectid=char-L1C4]');

  await expect(page.locator('[data-selectid=bold-menu]')).toBeDisabled();

  await linesToBe(page, ['normal text', 'normal text too']);

  await page.keyboard.type('.');

  await linesToBe(page, ['no.al text too']);
});

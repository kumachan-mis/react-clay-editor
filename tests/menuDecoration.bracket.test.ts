import { linesToBe, mouseSelect } from './testUtils';

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./editor');
  await page.locator('[data-selectid=text-field]').click();
});

test('decoration menus: bold, no-selection, empty-line', async ({ page }) => {
  await page.locator('[data-selectid=char-L0C0]').click();

  await page.locator('[data-selectid=bold-menu]').click();

  await linesToBe(page, ['[* bold]']);

  await page.keyboard.type('React Realtime Markup Editor');

  await linesToBe(page, ['[* React Realtime Markup Editor]']);
});

test('decoration menus: italic, no-selection, empty-line', async ({ page }) => {
  await page.locator('[data-selectid=char-L0C0]').click();

  await page.locator('[data-selectid=italic-menu]').click();

  await linesToBe(page, ['[/ italic]']);

  await page.keyboard.type('React Realtime Markup Editor');

  await linesToBe(page, ['[/ React Realtime Markup Editor]']);
});

test('decoration menus: underline, no-selection, empty-line', async ({ page }) => {
  await page.locator('[data-selectid=char-L0C0]').click();

  await page.locator('[data-selectid=underline-menu]').click();

  await linesToBe(page, ['[_ underline]']);

  await page.keyboard.type('React Realtime Markup Editor');

  await linesToBe(page, ['[_ React Realtime Markup Editor]']);
});

test('decoration menus: bold, no-selection, in-decoration', async ({ page }) => {
  await page.keyboard.insertText(['[* bold text]'].join('\n'));

  await page.locator('[data-selectid=char-L0C4]').click();

  await page.locator('[data-selectid=bold-menu]').click();

  await linesToBe(page, ['bold text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['b.old text']);
});

test('decoration menus: italic, no-selection, in-decoration', async ({ page }) => {
  await page.keyboard.insertText(['[* bold text]'].join('\n'));

  await page.locator('[data-selectid=char-L0C7]').click();

  await page.locator('[data-selectid=italic-menu]').click();

  await linesToBe(page, ['[*/ bold text]']);

  await page.keyboard.type(' italic');

  await linesToBe(page, ['[*/ bold italic text]']);
});

test('decoration menus: underline, no-selection, in-decoration', async ({ page }) => {
  await page.keyboard.insertText(['[/_ italic underline text]'].join('\n'));

  await page.locator('[data-selectid=char-L0C20]').click();

  await page.locator('[data-selectid=underline-menu]').click();

  await linesToBe(page, ['[/ italic underline text]']);

  await page.keyboard.press('Shift+Control+ArrowLeft');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');

  await linesToBe(page, ['[/ italic text]']);
});

test('decoration menus: bold, no-selection, in-lacked-with-decoration-both', async ({ page }) => {
  await page.keyboard.insertText(['[*/ left][/ text][/* right]'].join('\n'));

  await page.locator('[data-selectid=char-L0C14]').click();

  await page.locator('[data-selectid=bold-menu]').click();

  await linesToBe(page, ['[*/ left][/* text][/* right]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[*/ left][/* te.xt][/* right]']);
});

test('decoration menus: underline, no-selection, in-lacked-with-decoration-right', async ({ page }) => {
  await page.keyboard.insertText(['[_*/ left][/* text][_ right]'].join('\n'));

  await page.locator('[data-selectid=char-L0C16]').click();

  await page.locator('[data-selectid=underline-menu]').click();

  await linesToBe(page, ['[_*/ left][/*_ text][_ right]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[_*/ left][/*_ te.xt][_ right]']);
});

test('decoration menus: italic, no-selection, in-lacked-with-decoration-right', async ({ page }) => {
  await page.keyboard.insertText(['[*/ left][* text][* right]'].join('\n'));

  await page.locator('[data-selectid=char-L0C14]').click();

  await page.locator('[data-selectid=italic-menu]').click();

  await linesToBe(page, ['[*/ left][*/ text][* right]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[*/ left][*/ te.xt][* right]']);
});

test('decoration menus: italic, no-selection, in-normal', async ({ page }) => {
  await page.keyboard.insertText(['normal text'].join('\n'));

  await page.locator('[data-selectid=char-L0C6]').click();

  await page.locator('[data-selectid=italic-menu]').click();

  await linesToBe(page, ['normal[/ italic] text']);

  await page.keyboard.type('important');

  await linesToBe(page, ['normal[/ important] text']);
});

test('decoration menus: bold, no-selection, in-normal-with-decoration-left', async ({ page }) => {
  await page.keyboard.insertText(['[* important]'].join('\n'));

  await page.locator('[data-selectid=char-L0C13]').click();

  await page.locator('[data-selectid=bold-menu]').click();

  await linesToBe(page, ['[* important][* bold]']);

  await page.keyboard.type('really important');

  await linesToBe(page, ['[* important][* really important]']);
});

test('decoration menus: underline, no-selection, in-normal-with-decoration-right', async ({ page }) => {
  await page.keyboard.insertText(['[_ important]'].join('\n'));

  await page.locator('[data-selectid=char-L0C0]').click();

  await page.locator('[data-selectid=underline-menu]').click();

  await linesToBe(page, ['[_ underline][_ important]']);

  await page.keyboard.type('This is ');

  await linesToBe(page, ['[_ This is ][_ important]']);
});

test('decoration menus: bold, no-selection, other (section line)', async ({ page }) => {
  await page.keyboard.insertText(['`WYSIWYG` editor'].join('\n'));

  await page.locator('[data-selectid=char-L0C6]').click();

  await expect(page.locator('[data-selectid=bold-menu]')).toBeDisabled();

  await linesToBe(page, ['`WYSIWYG` editor']);

  await page.keyboard.type('.');

  await linesToBe(page, ['`WYSIW.YG` editor']);
});

test('decoration menus: italic, no-selection, other (content node)', async ({ page }) => {
  await page.keyboard.insertText(['[bracket link]'].join('\n'));

  await page.locator('[data-selectid=char-L0C4]').click();

  await expect(page.locator('[data-selectid=italic-menu]')).toBeDisabled();

  await linesToBe(page, ['[bracket link]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[bra.cket link]']);
});

test('decoration menus: underline, no-selection, other (block node)', async ({ page }) => {
  await page.keyboard.insertText(['```', 'code string', '```'].join('\n'));

  await page.locator('[data-selectid=char-L1C6]').click();

  await expect(page.locator('[data-selectid=underline-menu]')).toBeDisabled();

  await linesToBe(page, ['```', 'code string', '```']);

  await page.keyboard.type('.');

  await linesToBe(page, ['```', 'code s.tring', '```']);
});

test('decoration menus: bold, single-line-selection, in-decoration-all', async ({ page }) => {
  await page.keyboard.insertText(['[* bold text]'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C0]', '[data-selectid=char-L0C13]');

  await page.locator('[data-selectid=bold-menu]').click();

  await linesToBe(page, ['bold text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.']);
});

test('decoration menus: italic, single-line-selection, in-decoration-all', async ({ page }) => {
  await page.keyboard.insertText(['[_ underline text]'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C0]', '[data-selectid=char-L0C1]');

  await page.locator('[data-selectid=italic-menu]').click();

  await linesToBe(page, ['[_/ underline text]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.underline text]']);
});

test('decoration menus: underline, single-line-selection, in-decoration-all', async ({ page }) => {
  await page.keyboard.insertText(['[_/ underline italic text]'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C4]', '[data-selectid=char-L0C25]');

  await page.locator('[data-selectid=underline-menu]').click();

  await linesToBe(page, ['[/ underline italic text]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[/ .]']);
});

test('decoration menus: italic, single-line-selection, in-decoration-left (without-deco)', async ({ page }) => {
  await page.keyboard.insertText(['[* left mid right]'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C3]', '[data-selectid=char-L0C7]');

  await page.locator('[data-selectid=italic-menu]').click();

  await linesToBe(page, ['[*/ left][*  mid right]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[*/ .][*  mid right]']);
});

test('decoration menus: italic, single-line-selection, in-decoration-left (with-deco)', async ({ page }) => {
  await page.keyboard.insertText(['[* left mid right]'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C0]', '[data-selectid=char-L0C7]');

  await page.locator('[data-selectid=italic-menu]').click();

  await linesToBe(page, ['[*/ left][*  mid right]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.][*  mid right]']);
});

test('decoration menus: underline, single-line-selection, in-decoration-right (without-deco)', async ({ page }) => {
  await page.keyboard.insertText(['[*_ left mid right]'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C13]', '[data-selectid=char-L0C18]');

  await page.locator('[data-selectid=underline-menu]').click();

  await linesToBe(page, ['[*_ left mid ][* right]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[*_ left mid ][* .]']);
});

test('decoration menus: underline, single-line-selection, in-decoration-right (with-deco)', async ({ page }) => {
  await page.keyboard.insertText(['[*_ left mid right]'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C13]', '[data-selectid=char-L0C19]');

  await page.locator('[data-selectid=underline-menu]').click();

  await linesToBe(page, ['[*_ left mid ][* right]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[*_ left mid ][* .']);
});

test('decoration menus: bold, single-line-selection, in-decoration-mid', async ({ page }) => {
  await page.keyboard.insertText(['[* left mid right]'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C7]', '[data-selectid=char-L0C11]');

  await page.locator('[data-selectid=bold-menu]').click();

  await linesToBe(page, ['[* left] mid[*  right]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[* left].[*  right]']);
});

test('decoration menus: italic, single-line-selection, in-lacked-with-decoration-left', async ({ page }) => {
  await page.keyboard.insertText(['[*/ left][*  mid right]'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C12]', '[data-selectid=char-L0C16]');

  await page.locator('[data-selectid=italic-menu]').click();

  await linesToBe(page, ['[*/ left][*/  mid][*  right]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[*/ left][*/ .][*  right]']);
});

test('decoration menus: underline, single-line-selection, in-lacked-with-decoration-right', async ({ page }) => {
  await page.keyboard.insertText(['[*_ left][*  mid right]'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C5]', '[data-selectid=char-L0C9]');

  await page.locator('[data-selectid=underline-menu]').click();

  await linesToBe(page, ['[*_ l][* eft][*  mid right]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[*_ l][* .[*  mid right]']);
});

test('decoration menus: bold, single-line-selection, in-normal', async ({ page }) => {
  await page.keyboard.insertText(['normal text'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C2]', '[data-selectid=char-L0C10]');

  await page.locator('[data-selectid=bold-menu]').click();

  await linesToBe(page, ['no[* rmal tex]t']);

  await page.keyboard.type('.');

  await linesToBe(page, ['no[* .]t']);
});

test('decoration menus: italic, single-line-selection, in-normal', async ({ page }) => {
  await page.keyboard.insertText(['normal text'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C2]', '[data-selectid=char-L0C10]');

  await page.locator('[data-selectid=italic-menu]').click();

  await linesToBe(page, ['no[/ rmal tex]t']);

  await page.keyboard.type('.');

  await linesToBe(page, ['no[/ .]t']);
});

test('decoration menus: underline, single-line-selection, in-normal', async ({ page }) => {
  await page.keyboard.insertText(['normal text'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C2]', '[data-selectid=char-L0C10]');

  await page.locator('[data-selectid=underline-menu]').click();

  await linesToBe(page, ['no[_ rmal tex]t']);

  await page.keyboard.type('.');

  await linesToBe(page, ['no[_ .]t']);
});

test('decoration menus: italic, single-line-selection, in-normal-with-decoration-left', async ({ page }) => {
  await page.keyboard.insertText(['[/ normal] text'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C10]', '[data-selectid=char-L0C13]');

  await page.locator('[data-selectid=italic-menu]').click();

  await linesToBe(page, ['[/ normal][/  te]xt']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[/ normal][/ .]xt']);
});

test('decoration menus: bold, single-line-selection, in-normal-with-decoration-right', async ({ page }) => {
  await page.keyboard.insertText(['normal [* text]'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C2]', '[data-selectid=char-L0C7]');

  await page.locator('[data-selectid=bold-menu]').click();

  await linesToBe(page, ['no[* rmal ][* text]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['no[* .][* text]']);
});

test('decoration menus: underline, single-line-selection, other (mixed with friends)', async ({ page }) => {
  await page.keyboard.insertText(['normal [_ text]'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C2]', '[data-selectid=char-L0C12]');

  await expect(page.locator('[data-selectid=underline-menu]')).toBeDisabled();

  await linesToBe(page, ['normal [_ text]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['no.xt]']);
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

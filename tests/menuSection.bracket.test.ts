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

test('section menu: button, no-selection, empty-line', async () => {
  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C0]').click();

  await page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['[** larger]']);

  await page.keyboard.type('React Clay Editor');

  await linesToBe(page, ['[** React Clay Editor]']);
});

test('section menu: normal, no-selection, empty-line', async () => {
  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C0]').click();

  await page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=normal-section-menu-item]').click();

  await linesToBe(page, ['[* normal]']);

  await page.keyboard.type('React Clay Editor');

  await linesToBe(page, ['[* React Clay Editor]']);
});

test('section menu: larger, no-selection, empty-line', async () => {
  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C0]').click();

  await page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=larger-section-menu-item]').click();

  await linesToBe(page, ['[** larger]']);

  await page.keyboard.type('React Clay Editor');

  await linesToBe(page, ['[** React Clay Editor]']);
});

test('section menu: largest, no-selection, empty-line', async () => {
  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C0]').click();

  await page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=largest-section-menu-item]').click();

  await linesToBe(page, ['[*** largest]']);

  await page.keyboard.type('React Clay Editor');

  await linesToBe(page, ['[*** React Clay Editor]']);
});

test('section menu: button, no-selection, normal-line (normal text)', async () => {
  await page.keyboard.insertText(['WYSIWYG Editor'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C0]').click();

  await page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['[** WYSIWYG Editor]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[** .WYSIWYG Editor]']);
});

test('section menu: normal, no-selection, normal-line (normal text)', async () => {
  await page.keyboard.insertText(['WYSIWYG Editor'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C1]').click();

  await page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=normal-section-menu-item]').click();

  await linesToBe(page, ['[* WYSIWYG Editor]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[* W.YSIWYG Editor]']);
});

test('section menu: larger, selection, normal-line (normal text)', async () => {
  await page.keyboard.insertText(['WYSIWYG Editor'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C9]',
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C3]'
  );

  await page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=larger-section-menu-item]').click();

  await linesToBe(page, ['[** WYSIWYG Editor]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[** WYS.ditor]']);
});

test('section menu: button, no-selection, normal-line (decorated text)', async () => {
  await page.keyboard.insertText(['[WYSIWYG] Editor'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C8]').click();

  await page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['[** [WYSIWYG] Editor]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[** [WYSIWYG.] Editor]']);
});

test('section menu: largest, selection, normal-line (decorated text)', async () => {
  await page.keyboard.insertText(['[WYSIWYG] Editor'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C8]',
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C10]'
  );

  await page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=largest-section-menu-item]').click();

  await linesToBe(page, ['[*** [WYSIWYG] Editor]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[*** [WYSIWYG.Editor]']);
});

test('section menu: button, no-selection, section-line (normal text)', async () => {
  await page.keyboard.insertText(['[* WYSIWYG Editor]'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C6]').click();

  await page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['WYSIWYG Editor']);

  await page.keyboard.type('.');

  await linesToBe(page, ['WYS.IWYG Editor']);
});

test('section menu: normal, no-selection, section-line (normal text)', async () => {
  await page.keyboard.insertText(['[* WYSIWYG Editor]'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C18]').click();

  await page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=normal-section-menu-item]').click();

  await linesToBe(page, ['WYSIWYG Editor']);

  await page.keyboard.type('.');

  await linesToBe(page, ['WYSIWYG Editor.']);
});

test('section menu: button, no-selection, section-line (decorated text)', async () => {
  await page.keyboard.insertText(['[* #hashtag]'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C2]').click();

  await page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['#hashtag']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.#hashtag']);
});

test('section menu: largest, selection, section-line (decorated text)', async () => {
  await page.keyboard.insertText(['[* #hashtag]'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C4]',
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C5]'
  );

  await page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=largest-section-menu-item]').click();

  await linesToBe(page, ['[*** #hashtag]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[*** #.ashtag]']);
});

test('section menu: button, selection, section-line (larger text)', async () => {
  await page.keyboard.insertText(['[** WYSIWYG Editor]'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C6]',
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C8]'
  );

  await page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['WYSIWYG Editor']);

  await page.keyboard.type('.');

  await linesToBe(page, ['WY.WYG Editor']);
});

test('section menu: normal, no-selection, section-line (larger text)', async () => {
  await page.keyboard.insertText(['[** WYSIWYG Editor]'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C6]').click();

  await page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=normal-section-menu-item]').click();

  await linesToBe(page, ['[* WYSIWYG Editor]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[* WY.SIWYG Editor]']);
});

test('section menu: disabled, no-selection, section-like-line (bracket link)', async () => {
  await page.keyboard.insertText(['[** WYSIWYG Editor][bracket]'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C10]').click();

  await expect(page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-main-button]')).toBeDisabled();

  await linesToBe(page, ['[** WYSIWYG Editor][bracket]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[** WYSIWY.G Editor][bracket]']);
});

test('section menu: disabled, no-selection, section-like-line (spaces)', async () => {
  await page.keyboard.insertText(['[** WYSIWYG Editor] '].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C10]').click();

  await expect(page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-main-button]')).toBeDisabled();

  await linesToBe(page, ['[** WYSIWYG Editor] ']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[** WYSIWY.G Editor] ']);
});

test('section menu: disabled, selection, section-like-line (spaces)', async () => {
  await page.keyboard.insertText(['[** WYSIWYG Editor]  '].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C10]',
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C20]'
  );

  await expect(page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-arrow-button]')).toBeDisabled();

  await linesToBe(page, ['[** WYSIWYG Editor]  ']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[** WYSIWY. ']);
});

test('section menu: button, no-selection, other (line node)', async () => {
  await page.keyboard.insertText(['> [** Markup Editor]'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C17]').click();

  await expect(page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-main-button]')).toBeDisabled();

  await linesToBe(page, ['> [** Markup Editor]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['> [** Markup Edit.or]']);
});

test('section menu: disabled, no-selection, other (line node)', async () => {
  await page.keyboard.insertText(['  [** Markup Editor]'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C17]').click();

  await expect(page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-arrow-button]')).toBeDisabled();

  await linesToBe(page, ['  [** Markup Editor]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['  [** Markup Edit.or]']);
});

test('section menu: button, no-selection, other (block node)', async () => {
  await page.keyboard.insertText(['```', '[* block code]', '```'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C4]').click();

  await expect(page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-main-button]')).toBeDisabled();

  await linesToBe(page, ['```', '[* block code]', '```']);

  await page.keyboard.type('.');

  await linesToBe(page, ['```', '[* b.lock code]', '```']);
});

test('section menu: disabled, selection, other (block node)', async () => {
  await page.keyboard.insertText(['```', '[* block code]', '```'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C4]',
    ':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C3]'
  );

  await expect(page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-arrow-button]')).toBeDisabled();

  await linesToBe(page, ['```', '[* block code]', '```']);

  await page.keyboard.type('.');

  await linesToBe(page, ['```', '[* .lock code]', '```']);
});

test('section menu: button, multi-lines-selection', async () => {
  await page.keyboard.insertText(
    ['Editor', 'Source code editor, for editing source code', 'Text editor, for editing plain text'].join('\n')
  );

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C0]',
    ':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C11]'
  );

  await expect(page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-main-button]')).toBeDisabled();

  await linesToBe(page, [
    'Editor',
    'Source code editor, for editing source code',
    'Text editor, for editing plain text',
  ]);

  await page.keyboard.type('.');

  await linesToBe(page, ['. editor, for editing source code', 'Text editor, for editing plain text']);
});

test('section menu: disabled, multi-lines-selection', async () => {
  await page.keyboard.insertText(['Editor', ''].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C0]',
    ':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C0]'
  );

  await expect(page.locator('[data-selectid=section-menu] >> [data-selectid=dropdown-arrow-button]')).toBeDisabled();

  await linesToBe(page, ['Editor', '']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.']);
});

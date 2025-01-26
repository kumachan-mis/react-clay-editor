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

test('quotation menu: button, no-selection, empty-line', async () => {
  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C0]').click();

  await page.locator('[data-selectid=quotation-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['> ']);

  await page.keyboard.type('React Clay Editor');

  await linesToBe(page, ['> React Clay Editor']);
});

test('quotation menu: indent, no-selection, empty-line', async () => {
  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C0]').click();

  await page.locator('[data-selectid=quotation-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=indent-quotation-menu-item]').click();

  await linesToBe(page, ['> ']);

  await page.keyboard.type('React Clay Editor');

  await linesToBe(page, ['> React Clay Editor']);
});

test('quotation menu: outdent, no-selection, empty-line', async () => {
  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C0]').click();

  await page.locator('[data-selectid=quotation-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await expect(page.locator('[data-selectid=outdent-quotation-menu-item]')).toBeDisabled();

  await linesToBe(page, ['']);

  await page.keyboard.type('React Clay Editor');

  await linesToBe(page, ['React Clay Editor']);
});

test('quotation menu: button, no-selection, normal-line', async () => {
  await page.keyboard.insertText(['This will be a quotation text'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C5]').click();

  await page.locator('[data-selectid=quotation-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['> This will be a quotation text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['> This .will be a quotation text']);
});

test('quotation menu: indent, no-selection, normal-line', async () => {
  await page.keyboard.insertText(['This will be a quotation text'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C5]').click();

  await page.locator('[data-selectid=quotation-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=indent-quotation-menu-item]').click();

  await linesToBe(page, ['> This will be a quotation text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['> This .will be a quotation text']);
});

test('quotation menu: outdent, selection, normal-line', async () => {
  await page.keyboard.insertText(['This will not be a quotation text'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C5]',
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C8]',
  );

  await page.locator('[data-selectid=quotation-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await expect(page.locator('[data-selectid=outdent-quotation-menu-item]')).toBeDisabled();

  await linesToBe(page, ['This will not be a quotation text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['This .l not be a quotation text']);
});

test('quotation menu: button, no-selection, quoted-line', async () => {
  await page.keyboard.insertText(['> This will be a normal line'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C6]').click();

  await page.locator('[data-selectid=quotation-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['This will be a normal line']);

  await page.keyboard.type('.');

  await linesToBe(page, ['This. will be a normal line']);
});

test('quotation menu: indent, selection, quoted-line', async () => {
  await page.keyboard.insertText(['> This will be a nested quotation text'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C6]',
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C9]',
  );

  await page.locator('[data-selectid=quotation-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=indent-quotation-menu-item]').click();

  await linesToBe(page, [' > This will be a nested quotation text']);

  await page.keyboard.type('.');

  await linesToBe(page, [' > This.ll be a nested quotation text']);
});

test('quotation menu: outdent, no-selection, quoted-line', async () => {
  await page.keyboard.insertText(['> This will be a normal line'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C6]').click();

  await page.locator('[data-selectid=quotation-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=outdent-quotation-menu-item]').click();

  await linesToBe(page, ['This will be a normal line']);

  await page.keyboard.type('.');

  await linesToBe(page, ['This. will be a normal line']);
});

test('quotation menu: button, no-selection, nested-quoted-line', async () => {
  await page.keyboard.insertText(['\t> This will be also a normal line'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C6]').click();

  await page.locator('[data-selectid=quotation-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['This will be also a normal line']);

  await page.keyboard.type('.');

  await linesToBe(page, ['Thi.s will be also a normal line']);
});

test('quotation menu: indent, no-selection, nested-quoted-line', async () => {
  await page.keyboard.insertText(['\t> This will be a deep nested quotation text'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C6]').click();

  await page.locator('[data-selectid=quotation-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=indent-quotation-menu-item]').click();

  await linesToBe(page, [' \t> This will be a deep nested quotation text']);

  await page.keyboard.type('.');

  await linesToBe(page, [' \t> Thi.s will be a deep nested quotation text']);
});

test('quotation menu: outdent, no-selection, nested-quoted-line', async () => {
  await page.keyboard.insertText(['\t> This will be a shallow nested quotation text'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C6]').click();

  await page.locator('[data-selectid=quotation-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=outdent-quotation-menu-item]').click();

  await linesToBe(page, ['> This will be a shallow nested quotation text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['> Thi.s will be a shallow nested quotation text']);
});

test('quotation menu: button, no-selection, other-line (block node)', async () => {
  await page.keyboard.insertText(['$$', '\\int_a^b f(x) dx', '$$'].join('\n'));

  await page.locator(':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C6]').click();

  await expect(page.locator('[data-selectid=quotation-menu] >> [data-selectid=dropdown-main-button]')).toBeDisabled();

  await linesToBe(page, ['$$', '\\int_a^b f(x) dx', '$$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$', '\\int_a.^b f(x) dx', '$$']);
});

test('quotation menu: button, selection, all-normal-or-quoted-line', async () => {
  await page.keyboard.insertText(['This is normal text', '> This is a quotation text'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C7]',
    ':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C0]',
  );

  await page.locator('[data-selectid=quotation-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['> This is normal text', '> This is a quotation text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['> This is.> This is a quotation text']);
});

test('quotation menu: button, selection, all-quoted-line', async () => {
  await page.keyboard.insertText(['> This is a quotation text', '\t> This is also a quotation text'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C6]',
    ':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C2]',
  );

  await page.locator('[data-selectid=quotation-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['This is a quotation text', 'This is also a quotation text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['This.This is also a quotation text']);
});

test('quotation menu: indent, selection, all-normal-or-quoted-line', async () => {
  await page.keyboard.insertText(['This is normal text', '> This is a quotation text'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C11]',
    ':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C1]',
  );

  await page.locator('[data-selectid=quotation-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=indent-quotation-menu-item]').click();

  await linesToBe(page, ['> This is normal text', ' > This is a quotation text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['> This is nor. This is a quotation text']);
});

test('quotation menu: outdent, selection, all-normal-or-quoted-line', async () => {
  await page.keyboard.insertText(['This is normal text', '> This is a quotation text'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C11]',
    ':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C1]',
  );

  await page.locator('[data-selectid=quotation-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=outdent-quotation-menu-item]').click();

  await linesToBe(page, ['This is normal text', 'This is a quotation text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['This is nor.This is a quotation text']);
});

test('quotation menu: button, selection, has-other-line', async () => {
  await page.keyboard.insertText(['This is normal text', ' ```', ' code string', ' ```'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C11]',
    ':nth-match([data-selectid^=line-L], 3) [data-selectid=char-C3]',
  );

  await expect(page.locator('[data-selectid=quotation-menu] >> [data-selectid=dropdown-main-button]')).toBeDisabled();

  await linesToBe(page, ['This is normal text', ' ```', ' code string', ' ```']);

  await page.keyboard.type('.');

  await linesToBe(page, ['This is nor.de string', ' ```']);
});

test('quotation menu: disabled, selection, has-other-line', async () => {
  await page.keyboard.insertText(['This is normal text', ' ```', ' code string', ' ```'].join('\n'));

  await mouseSelect(
    page,
    ':nth-match([data-selectid^=line-L], 1) [data-selectid=char-C11]',
    ':nth-match([data-selectid^=line-L], 3) [data-selectid=char-C3]',
  );

  await expect(page.locator('[data-selectid=quotation-menu] >> [data-selectid=dropdown-arrow-button]')).toBeDisabled();

  await linesToBe(page, ['This is normal text', ' ```', ' code string', ' ```']);

  await page.keyboard.type('.');

  await linesToBe(page, ['This is nor.de string', ' ```']);
});

import { linesToBe, mouseSelect } from './testUtils';

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./editor');
  await page.locator('[data-selectid=text-field]').click();
});

test('itemization menu: button, no-selection, empty-line', async ({ page }) => {
  await page.locator('[data-selectid=char-L0C0]').click();

  await page.locator('[data-selectid=itemization-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, [' ']);

  await page.keyboard.type('React Clay Editor');

  await linesToBe(page, [' React Clay Editor']);
});

test('itemization menu: indent, no-selection, empty-line', async ({ page }) => {
  await page.locator('[data-selectid=char-L0C0]').click();

  await page.locator('[data-selectid=itemization-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=indent-itemization-menu-item]').click();

  await linesToBe(page, [' ']);

  await page.keyboard.type('React Clay Editor');

  await linesToBe(page, [' React Clay Editor']);
});

test('itemization menu: outdent, no-selection, empty-line', async ({ page }) => {
  await page.locator('[data-selectid=char-L0C0]').click();

  await page.locator('[data-selectid=itemization-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await expect(page.locator('[data-selectid=outdent-itemization-menu-item]')).toBeDisabled();

  await linesToBe(page, ['']);

  await page.keyboard.type('React Clay Editor');

  await linesToBe(page, ['React Clay Editor']);
});

test('itemization menu: button, no-selection, normal-line', async ({ page }) => {
  await page.keyboard.insertText(['This will be an item'].join('\n'));

  await page.locator('[data-selectid=char-L0C5]').click();

  await page.locator('[data-selectid=itemization-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, [' This will be an item']);

  await page.keyboard.type('.');

  await linesToBe(page, [' This .will be an item']);
});

test('itemization menu: indent, no-selection, normal-line', async ({ page }) => {
  await page.keyboard.insertText(['This will be an item'].join('\n'));

  await page.locator('[data-selectid=char-L0C5]').click();

  await page.locator('[data-selectid=itemization-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=indent-itemization-menu-item]').click();

  await linesToBe(page, [' This will be an item']);

  await page.keyboard.type('.');

  await linesToBe(page, [' This .will be an item']);
});

test('itemization menu: outdent, selection, normal-line', async ({ page }) => {
  await page.keyboard.insertText(['This will not be an item'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C5]', '[data-selectid=char-L0C8]');

  await page.locator('[data-selectid=itemization-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await expect(page.locator('[data-selectid=outdent-itemization-menu-item]')).toBeDisabled();

  await linesToBe(page, ['This will not be an item']);

  await page.keyboard.type('.');

  await linesToBe(page, ['This .l not be an item']);
});

test('itemization menu: button, no-selection, itemized-line', async ({ page }) => {
  await page.keyboard.insertText([' This will be a normal line'].join('\n'));

  await page.locator('[data-selectid=char-L0C5]').click();

  await page.locator('[data-selectid=itemization-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['This will be a normal line']);

  await page.keyboard.type('.');

  await linesToBe(page, ['This. will be a normal line']);
});

test('itemization menu: indent, selection, itemized-line', async ({ page }) => {
  await page.keyboard.insertText([' This will be a nested item'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C5]', '[data-selectid=char-L0C8]');

  await page.locator('[data-selectid=itemization-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=indent-itemization-menu-item]').click();

  await linesToBe(page, ['  This will be a nested item']);

  await page.keyboard.type('.');

  await linesToBe(page, ['  This.ll be a nested item']);
});

test('itemization menu: outdent, no-selection, itemized-line', async ({ page }) => {
  await page.keyboard.insertText([' This will be a normal line'].join('\n'));

  await page.locator('[data-selectid=char-L0C5]').click();

  await page.locator('[data-selectid=itemization-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=outdent-itemization-menu-item]').click();

  await linesToBe(page, ['This will be a normal line']);

  await page.keyboard.type('.');

  await linesToBe(page, ['This. will be a normal line']);
});

test('itemization menu: button, no-selection, nested-itemized-line', async ({ page }) => {
  await page.keyboard.insertText(['\t This will be also a normal line'].join('\n'));

  await page.locator('[data-selectid=char-L0C5]').click();

  await page.locator('[data-selectid=itemization-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['This will be also a normal line']);

  await page.keyboard.type('.');

  await linesToBe(page, ['Thi.s will be also a normal line']);
});

test('itemization menu: indent, no-selection, nested-itemized-line', async ({ page }) => {
  await page.keyboard.insertText(['\t This will be a deep nested item'].join('\n'));

  await page.locator('[data-selectid=char-L0C5]').click();

  await page.locator('[data-selectid=itemization-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=indent-itemization-menu-item]').click();

  await linesToBe(page, [' \t This will be a deep nested item']);

  await page.keyboard.type('.');

  await linesToBe(page, [' \t Thi.s will be a deep nested item']);
});

test('itemization menu: outdent, no-selection, nested-itemized-line', async ({ page }) => {
  await page.keyboard.insertText(['\t This will be a shallow nested item'].join('\n'));

  await page.locator('[data-selectid=char-L0C5]').click();

  await page.locator('[data-selectid=itemization-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=outdent-itemization-menu-item]').click();

  await linesToBe(page, [' This will be a shallow nested item']);

  await page.keyboard.type('.');

  await linesToBe(page, [' Thi.s will be a shallow nested item']);
});

test('itemization menu: button, no-selection, other-line (line node)', async ({ page }) => {
  await page.keyboard.insertText(['> This is a quotation'].join('\n'));

  await page.locator('[data-selectid=char-L0C13]').click();

  await expect(page.locator('[data-selectid=itemization-menu] >> [data-selectid=dropdown-main-button]')).toBeDisabled();

  await linesToBe(page, ['> This is a quotation']);

  await page.keyboard.type('.');

  await linesToBe(page, ['> This is a q.uotation']);
});

test('itemization menu: button, no-selection, other-line (block node)', async ({ page }) => {
  await page.keyboard.insertText(['$$', '\\int_a^b f(x) dx', '$$'].join('\n'));

  await page.locator('[data-selectid=char-L1C6]').click();

  await expect(page.locator('[data-selectid=itemization-menu] >> [data-selectid=dropdown-main-button]')).toBeDisabled();

  await linesToBe(page, ['$$', '\\int_a^b f(x) dx', '$$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$', '\\int_a.^b f(x) dx', '$$']);
});

test('itemization menu: disabled, no-selection, other-line (line node)', async ({ page }) => {
  await page.keyboard.insertText(['> This is a quotation'].join('\n'));

  await page.locator('[data-selectid=char-L0C13]').click();

  await expect(
    page.locator('[data-selectid=itemization-menu] >> [data-selectid=dropdown-arrow-button]')
  ).toBeDisabled();

  await linesToBe(page, ['> This is a quotation']);

  await page.keyboard.type('.');

  await linesToBe(page, ['> This is a q.uotation']);
});

test('itemization menu: disabled, no-selection, other-line (block node)', async ({ page }) => {
  await page.keyboard.insertText(['$$', '\\int_a^b f(x) dx', '$$'].join('\n'));

  await page.locator('[data-selectid=char-L1C6]').click();

  await expect(
    page.locator('[data-selectid=itemization-menu] >> [data-selectid=dropdown-arrow-button]')
  ).toBeDisabled();

  await linesToBe(page, ['$$', '\\int_a^b f(x) dx', '$$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$', '\\int_a.^b f(x) dx', '$$']);
});

test('itemization menu: button, selection, all-normal-or-itemized-line', async ({ page }) => {
  await page.keyboard.insertText(['\tThis is an item', 'This is normal text'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C6]', '[data-selectid=char-L1C0]');

  await page.locator('[data-selectid=itemization-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['\tThis is an item', ' This is normal text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['\tThis .This is normal text']);
});

test('itemization menu: button, selection, all-itemized-line', async ({ page }) => {
  await page.keyboard.insertText([' This is an item', '\t\tThis is also an item'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C6]', '[data-selectid=char-L1C1]');

  await page.locator('[data-selectid=itemization-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['This is an item', 'This is also an item']);

  await page.keyboard.type('.');

  await linesToBe(page, ['This .This is also an item']);
});

test('itemization menu: indent, selection, all-normal-or-itemized-line', async ({ page }) => {
  await page.keyboard.insertText(['This is normal text', '\tThis is an item'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C11]', '[data-selectid=char-L1C1]');

  await page.locator('[data-selectid=itemization-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=indent-itemization-menu-item]').click();

  await linesToBe(page, [' This is normal text', ' \tThis is an item']);

  await page.keyboard.type('.');

  await linesToBe(page, [' This is nor.This is an item']);
});

test('itemization menu: outdent, selection, all-normal-or-itemized-line', async ({ page }) => {
  await page.keyboard.insertText(['This is normal text', '\tThis is an item'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C11]', '[data-selectid=char-L1C1]');

  await page.locator('[data-selectid=itemization-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=outdent-itemization-menu-item]').click();

  await linesToBe(page, ['This is normal text', 'This is an item']);

  await page.keyboard.type('.');

  await linesToBe(page, ['This is nor.This is an item']);
});

test('itemization menu: button, selection, has-other-line', async ({ page }) => {
  await page.keyboard.insertText(['This is normal text', ' ```', ' code string', ' ```'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C11]', '[data-selectid=char-L2C3]');

  await expect(page.locator('[data-selectid=itemization-menu] >> [data-selectid=dropdown-main-button]')).toBeDisabled();

  await linesToBe(page, ['This is normal text', ' ```', ' code string', ' ```']);

  await page.keyboard.type('.');

  await linesToBe(page, ['This is nor.de string', ' ```']);
});

test('itemization menu: disabled, selection, has-other-line', async ({ page }) => {
  await page.keyboard.insertText(['This is normal text', ' ```', ' code string', ' ```'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C11]', '[data-selectid=char-L2C3]');

  await expect(
    page.locator('[data-selectid=itemization-menu] >> [data-selectid=dropdown-arrow-button]')
  ).toBeDisabled();

  await linesToBe(page, ['This is normal text', ' ```', ' code string', ' ```']);

  await page.keyboard.type('.');

  await linesToBe(page, ['This is nor.de string', ' ```']);
});

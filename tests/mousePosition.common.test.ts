import { linesToBe } from './testUtils';

import { Page, test } from '@playwright/test';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('./editor');
});

test.beforeEach(async () => {
  const defaultText = [
    // default text
    '01234',
    '01234$xyz$01234',
    '$$',
    '\\int f(x)dx',
    '\\int g(x)dx',
    '$$',
    '01234',
  ].join('\n');

  await page.getByTestId('refresh-button').click();
  await page.locator('[data-selectid=text-field]').click();
  await page.keyboard.insertText(defaultText);
});

test.afterAll(async () => {
  await page.close();
});

test('beginning of char', async () => {
  const boundingBox = await page.locator('[data-selectid=char-L0C2]').boundingBox();
  if (boundingBox) {
    await page.mouse.click(boundingBox.x + 2, boundingBox.y + boundingBox.height / 2);
  }
  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    '01.234',
    '01234$xyz$01234',
    '$$',
    '\\int f(x)dx',
    '\\int g(x)dx',
    '$$',
    '01234',
  ]);
});

test('end of char', async () => {
  const boundingBox = await page.locator('[data-selectid=char-L0C3]').boundingBox();
  if (boundingBox) {
    await page.mouse.click(boundingBox.x + boundingBox.width - 2, boundingBox.y + boundingBox.height / 2);
  }
  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    '0123.4',
    '01234$xyz$01234',
    '$$',
    '\\int f(x)dx',
    '\\int g(x)dx',
    '$$',
    '01234',
  ]);
});

test('beginning of char group', async () => {
  const boundingBox = await page.locator('[data-selectid=chargroup-L1C6-8]').boundingBox();
  if (boundingBox) {
    await page.mouse.click(boundingBox.x + 2, boundingBox.y + boundingBox.height / 2);
  }
  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    '01234',
    '01234$.xyz$01234',
    '$$',
    '\\int f(x)dx',
    '\\int g(x)dx',
    '$$',
    '01234',
  ]);
});

test('end of char group', async () => {
  const boundingBox = await page.locator('[data-selectid=chargroup-L1C6-8]').boundingBox();
  if (boundingBox) {
    await page.mouse.click(boundingBox.x + boundingBox.width - 2, boundingBox.y + boundingBox.height / 2);
  }
  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    '01234',
    '01234$xyz.$01234',
    '$$',
    '\\int f(x)dx',
    '\\int g(x)dx',
    '$$',
    '01234',
  ]);
});

test('beginning of line', async () => {
  const boundingBox = await page.locator('[data-selectid=line-L0]').boundingBox();
  if (boundingBox) {
    await page.mouse.click(boundingBox.x + 2, boundingBox.y + boundingBox.height / 2);
  }
  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    '.01234',
    '01234$xyz$01234',
    '$$',
    '\\int f(x)dx',
    '\\int g(x)dx',
    '$$',
    '01234',
  ]);
});

test('end of line', async () => {
  const boundingBox = await page.locator('[data-selectid=line-L0]').boundingBox();
  if (boundingBox) {
    await page.mouse.click(boundingBox.x + boundingBox.width - 2, boundingBox.y + boundingBox.height / 2);
  }
  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    '01234.',
    '01234$xyz$01234',
    '$$',
    '\\int f(x)dx',
    '\\int g(x)dx',
    '$$',
    '01234',
  ]);
});

test('beginning of line group', async () => {
  const boundingBox = await page.locator('[data-selectid=linegroup-L3-4]').boundingBox();
  if (boundingBox) {
    await page.mouse.click(boundingBox.x + boundingBox.width / 2, boundingBox.y + 2);
  }
  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    '01234',
    '01234$xyz$01234',
    '$$',
    '.\\int f(x)dx',
    '\\int g(x)dx',
    '$$',
    '01234',
  ]);
});

test('end of line group', async () => {
  const boundingBox = await page.locator('[data-selectid=linegroup-L3-4]').boundingBox();
  if (boundingBox) {
    await page.mouse.click(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height - 2);
  }
  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    '01234',
    '01234$xyz$01234',
    '$$',
    '\\int f(x)dx',
    '\\int g(x)dx.',
    '$$',
    '01234',
  ]);
});

test('end of text field', async () => {
  const boundingBox = await page.locator('[data-selectid=text-field-root]').boundingBox();
  if (boundingBox) {
    await page.mouse.click(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height - 2);
  }
  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    '01234',
    '01234$xyz$01234',
    '$$',
    '\\int f(x)dx',
    '\\int g(x)dx',
    '$$',
    '01234.',
  ]);
});

test('out of text field', async () => {
  await page.mouse.click(0, 0);
  await page.keyboard.type('.');

  await linesToBe(page, [
    // expected lines
    '01234',
    '01234$xyz$01234',
    '$$',
    '\\int f(x)dx',
    '\\int g(x)dx',
    '$$',
    '01234',
  ]);
});

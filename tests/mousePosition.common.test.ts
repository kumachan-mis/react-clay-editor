import test from '@playwright/test';

import { linesToBe } from './testUtils';

test.beforeEach(async ({ page }) => {
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

  await page.goto('.');
  await page.locator('[data-selectid=text-field]').click();
  await page.keyboard.insertText(defaultText);
});

test('beginning of char', async ({ page }) => {
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

test('end of char', async ({ page }) => {
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

test('beginning of char group', async ({ page }) => {
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

test('end of char group', async ({ page }) => {
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

test('beginning of line', async ({ page }) => {
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

test('end of line', async ({ page }) => {
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

test('beginning of line group', async ({ page }) => {
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

test('end of line group', async ({ page }) => {
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

test('end of text field', async ({ page }) => {
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

test('out of text field', async ({ page }) => {
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

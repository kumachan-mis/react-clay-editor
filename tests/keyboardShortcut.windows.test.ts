import test from '@playwright/test';

import { linesToBe } from './testUtils';

test.beforeEach(async ({ page }) => {
  await page.goto('./editor');
  await page.locator('[data-selectid=text-field]').click();
});

test('select all (ctrl+a)', async ({ page }) => {
  await page.keyboard.insertText(['Hello', 'World'].join('\n'));

  await page.keyboard.press('Control+a');
  await page.keyboard.type('.');

  await linesToBe(page, ['.']);
});

test('undo intert (ctrl+z)', async ({ page }) => {
  await page.keyboard.press('Control+z');

  await page.keyboard.type('abc');

  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');

  await page.keyboard.press('Control+z');
  await page.keyboard.press('Control+z');

  await page.keyboard.type('d');

  await linesToBe(page, ['ad']);
});

test('undo delete (ctrl+z)', async ({ page }) => {
  await page.keyboard.type('abc');
  await page.keyboard.press('Backspace');

  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');

  await page.keyboard.press('Control+z');

  await page.keyboard.type('d');

  await linesToBe(page, ['abcd']);
});

for (const { name, command } of [
  { name: 'ctrl+shift+z', command: 'Control+Shift+z' },
  { name: 'ctrl+y', command: 'Control+y' },
]) {
  test(`redo insert (${name})`, async ({ page }) => {
    await page.keyboard.press(command);

    await page.keyboard.type('abc');
    await page.keyboard.press('Control+z');
    await page.keyboard.press('Control+z');
    await page.keyboard.press('Control+z');

    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    await page.keyboard.press(command);
    await page.keyboard.press(command);

    await page.keyboard.type('d');

    await linesToBe(page, ['abd']);
  });
}

for (const { name, command } of [
  { name: 'ctrl+shift+z', command: 'Control+Shift+z' },
  { name: 'ctrl+y', command: 'Control+y' },
]) {
  test(`redo delete (${name})`, async ({ page }) => {
    await page.keyboard.type('abc');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Control+z');

    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    await page.keyboard.press(command);

    await page.keyboard.type('d');

    await linesToBe(page, ['abd']);
  });
}

test('move word top (ctrl+arrowleft)', async ({ page }) => {
  await page.keyboard.insertText(
    [
      // default text
      'three words,sentence.',
      'three words,sentence.',
      'three words,sentence.',
    ].join('\n')
  );
  await page.locator('[data-selectid=char-L1C19]').click();

  await page.keyboard.press('Control+ArrowLeft');
  await page.keyboard.type('0');
  await page.keyboard.press('ArrowLeft');

  await page.keyboard.press('Control+ArrowLeft');
  await page.keyboard.type('1');
  await page.keyboard.press('ArrowLeft');

  await page.keyboard.press('Control+ArrowLeft');
  await page.keyboard.type('2');
  await page.keyboard.press('ArrowLeft');

  await page.keyboard.press('Control+ArrowLeft');
  await page.keyboard.type('3');
  await page.keyboard.press('ArrowLeft');

  await linesToBe(page, [
    // expected lines
    'three words,sentence.',
    '32three 1words,0sentence.',
    'three words,sentence.',
  ]);
});

test('move word bottom (ctrl+arrowright)', async ({ page }) => {
  await page.keyboard.insertText(
    [
      // default text
      'three words,sentence.',
      'three words,sentence.',
      'three words,sentence.',
    ].join('\n')
  );
  await page.locator('[data-selectid=char-L1C0]').click();

  await page.keyboard.press('Control+ArrowRight');
  await page.keyboard.type('0');

  await page.keyboard.press('Control+ArrowRight');
  await page.keyboard.type('1');

  await page.keyboard.press('Control+ArrowRight');
  await page.keyboard.type('2');

  await page.keyboard.press('Control+ArrowRight');
  await page.keyboard.type('3');

  await linesToBe(page, [
    // expected lines
    'three words,sentence.',
    'three0 words1,sentence2.3',
    'three words,sentence.',
  ]);
});

test('move line top (home)', async ({ page }) => {
  await page.keyboard.insertText(
    [
      // default text
      'three words,sentence.',
      'three words,sentence.',
      'three words,sentence.',
    ].join('\n')
  );
  await page.locator('[data-selectid=char-L1C19]').click();

  await page.keyboard.press('Home');
  await page.keyboard.type('0');

  await page.keyboard.press('Home');
  await page.keyboard.type('1');

  await linesToBe(page, [
    // expected lines
    'three words,sentence.',
    '10three words,sentence.',
    'three words,sentence.',
  ]);
});

test('move line bottom (end)', async ({ page }) => {
  await page.keyboard.insertText(
    [
      // default text
      'three words,sentence.',
      'three words,sentence.',
      'three words,sentence.',
    ].join('\n')
  );
  await page.locator('[data-selectid=char-L1C0]').click();

  await page.keyboard.press('End');
  await page.keyboard.type('0');

  await page.keyboard.press('End');
  await page.keyboard.type('1');

  await linesToBe(page, [
    // expected lines
    'three words,sentence.',
    'three words,sentence.01',
    'three words,sentence.',
  ]);
});

test('move text top (ctrl+home)', async ({ page }) => {
  await page.keyboard.insertText(
    [
      // default text
      'three words,sentence.',
      'three words,sentence.',
      'three words,sentence.',
    ].join('\n')
  );
  await page.locator('[data-selectid=char-L1C19]').click();

  await page.keyboard.press('Control+Home');
  await page.keyboard.type('0');

  await linesToBe(page, [
    // expected lines
    '0three words,sentence.',
    'three words,sentence.',
    'three words,sentence.',
  ]);
});

test('move text bottom  (ctrl+end)', async ({ page }) => {
  await page.keyboard.insertText(
    [
      // default text
      'three words,sentence.',
      'three words,sentence.',
      'three words,sentence.',
    ].join('\n')
  );
  await page.locator('[data-selectid=char-L1C0]').click();

  await page.keyboard.press('Control+End');
  await page.keyboard.type('0');

  await linesToBe(page, [
    // expected lines
    'three words,sentence.',
    'three words,sentence.',
    'three words,sentence.0',
  ]);
});

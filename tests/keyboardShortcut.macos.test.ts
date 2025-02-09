import { linesToBe } from './testUtils';

import { Page, test } from '@playwright/test';

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

test('forward delete (ctrl+d)', async () => {
  await page.keyboard.type('Hellp');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Control+d');
  await page.keyboard.type('o');

  await page.keyboard.press('Enter');
  await page.keyboard.type('Q');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Control+d');
  await page.keyboard.press('Control+d');
  await page.keyboard.press('Enter');

  await page.keyboard.type('World');

  await linesToBe(page, ['Hello', 'World']);
});

test('select all (command+a)', async () => {
  await page.keyboard.insertText(['Hello', 'World'].join('\n'));

  await page.keyboard.press('Meta+a');
  await page.keyboard.type('.');

  await linesToBe(page, ['.']);
});

test('undo intert (command+z)', async () => {
  await page.keyboard.press('Meta+z');

  await page.keyboard.type('abc');

  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');

  await page.keyboard.press('Meta+z');
  await page.keyboard.press('Meta+z');

  await page.keyboard.type('d');

  await linesToBe(page, ['ad']);
});

test('undo delete (command+z)', async () => {
  await page.keyboard.type('abc');
  await page.keyboard.press('Backspace');

  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');

  await page.keyboard.press('Meta+z');

  await page.keyboard.type('d');

  await linesToBe(page, ['abcd']);
});

for (const { name, command } of [
  { name: 'command+shift+z', command: 'Meta+Shift+z' },
  { name: 'command+y', command: 'Meta+y' },
]) {
  test(`redo insert (${name})`, async () => {
    await page.keyboard.press(command);

    await page.keyboard.type('abc');
    await page.keyboard.press('Meta+z');
    await page.keyboard.press('Meta+z');
    await page.keyboard.press('Meta+z');

    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    await page.keyboard.press(command);
    await page.keyboard.press(command);

    await page.keyboard.type('d');

    await linesToBe(page, ['abd']);
  });
}

for (const { name, command } of [
  { name: 'command+shift+z', command: 'Meta+Shift+z' },
  { name: 'command+y', command: 'Meta+y' },
]) {
  test(`redo delete (${name})`, async () => {
    await page.keyboard.type('abc');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Meta+z');

    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    await page.keyboard.press(command);

    await page.keyboard.type('d');

    await linesToBe(page, ['abd']);
  });
}

test('move word top (alt+arrowleft)', async () => {
  await page.keyboard.insertText(
    [
      // Default text
      'three words,sentence.',
      'three words,sentence.',
      'three words,sentence.',
    ].join('\n'),
  );
  await page.locator(':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C19]').click();

  await page.keyboard.press('Alt+ArrowLeft');
  await page.keyboard.type('0');
  await page.keyboard.press('ArrowLeft');

  await page.keyboard.press('Alt+ArrowLeft');
  await page.keyboard.type('1');
  await page.keyboard.press('ArrowLeft');

  await page.keyboard.press('Alt+ArrowLeft');
  await page.keyboard.type('2');
  await page.keyboard.press('ArrowLeft');

  await page.keyboard.press('Alt+ArrowLeft');
  await page.keyboard.type('3');
  await page.keyboard.press('ArrowLeft');

  await linesToBe(page, [
    // Expected lines
    'three words,sentence.',
    '32three 1words,0sentence.',
    'three words,sentence.',
  ]);
});

test('move word bottom (alt+arrowright)', async () => {
  await page.keyboard.insertText(
    [
      // Default text
      'three words,sentence.',
      'three words,sentence.',
      'three words,sentence.',
    ].join('\n'),
  );
  await page.locator(':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C0]').click();

  await page.keyboard.press('Alt+ArrowRight');
  await page.keyboard.type('0');

  await page.keyboard.press('Alt+ArrowRight');
  await page.keyboard.type('1');

  await page.keyboard.press('Alt+ArrowRight');
  await page.keyboard.type('2');

  await page.keyboard.press('Alt+ArrowRight');
  await page.keyboard.type('3');

  await linesToBe(page, [
    // Expected lines
    'three words,sentence.',
    'three0 words1,sentence2.3',
    'three words,sentence.',
  ]);
});

for (const { name, command } of [
  { name: 'command+arrowleft', command: 'Meta+ArrowLeft' },
  { name: 'home', command: 'Home' },
  { name: 'ctrl+a', command: 'Control+a' },
]) {
  test(`move line top (${name})`, async () => {
    await page.keyboard.insertText(
      [
        // Default text
        'three words,sentence.',
        'three words,sentence.',
        'three words,sentence.',
      ].join('\n'),
    );
    await page.locator(':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C19]').click();

    await page.keyboard.press(command);
    await page.keyboard.type('0');

    await page.keyboard.press(command);
    await page.keyboard.type('1');

    await linesToBe(page, [
      // Expected lines
      'three words,sentence.',
      '10three words,sentence.',
      'three words,sentence.',
    ]);
  });
}

for (const { name, command } of [
  { name: 'command+arrowright', command: 'Meta+ArrowRight' },
  { name: 'end', command: 'End' },
  { name: 'ctrl+e', command: 'Control+e' },
]) {
  test(`move line bottom (${name})`, async () => {
    await page.keyboard.insertText(
      [
        // Default text
        'three words,sentence.',
        'three words,sentence.',
        'three words,sentence.',
      ].join('\n'),
    );
    await page.locator(':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C0]').click();

    await page.keyboard.press(command);
    await page.keyboard.type('0');

    await page.keyboard.press(command);
    await page.keyboard.type('1');

    await linesToBe(page, [
      // Expected lines
      'three words,sentence.',
      'three words,sentence.01',
      'three words,sentence.',
    ]);
  });
}

for (const { name, command } of [
  { name: 'command+arrowup', command: 'Meta+ArrowUp' },
  { name: 'command+home', command: 'Meta+Home' },
]) {
  test(`move text top (${name})`, async () => {
    await page.keyboard.insertText(
      [
        // Default text
        'three words,sentence.',
        'three words,sentence.',
        'three words,sentence.',
      ].join('\n'),
    );
    await page.locator(':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C19]').click();

    await page.keyboard.press(command);
    await page.keyboard.type('0');

    await linesToBe(page, [
      // Expected lines
      '0three words,sentence.',
      'three words,sentence.',
      'three words,sentence.',
    ]);
  });
}

for (const { name, command } of [
  { name: 'command+arrowdown', command: 'Meta+ArrowDown' },
  { name: 'command+end', command: 'Meta+End' },
]) {
  test(`move text bottom  (${name})`, async () => {
    await page.keyboard.insertText(
      [
        // Default text
        'three words,sentence.',
        'three words,sentence.',
        'three words,sentence.',
      ].join('\n'),
    );
    await page.locator(':nth-match([data-selectid^=line-L], 2) [data-selectid=char-C0]').click();

    await page.keyboard.press(command);
    await page.keyboard.type('0');

    await linesToBe(page, [
      // Expected lines
      'three words,sentence.',
      'three words,sentence.',
      'three words,sentence.0',
    ]);
  });
}

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

test('code menu: inline-code-button, no-selection, empty-line', async () => {
  await page.locator('[data-selectid=line-L0] [data-selectid=char-C0]').click();

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['`inline code`']);

  await page.keyboard.type('React Clay Editor');

  await linesToBe(page, ['`React Clay Editor`']);
});

test('code menu: inline-code-dropdown, no-selection, in-code', async () => {
  await page.keyboard.insertText(["`import { EditorRoot } from 'react-clay-editor'`"].join('\n'));

  await page.locator('[data-selectid=line-L0] [data-selectid=char-C6]').click();

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=inline-code-menu-item]').click();

  await linesToBe(page, ["import { EditorRoot } from 'react-clay-editor'"]);

  await page.keyboard.type('.');

  await linesToBe(page, ["impor.t { EditorRoot } from 'react-clay-editor'"]);
});

test('code menu: inline-code-button, no-selection, in-normal', async () => {
  await page.keyboard.insertText(['normal text'].join('\n'));

  await page.locator('[data-selectid=line-L0] [data-selectid=char-C9]').click();

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['normal te`inline code`xt']);

  await page.keyboard.type('const x = 1;');

  await linesToBe(page, ['normal te`const x = 1;`xt']);
});

test('code menu: inline-code-dropdown, no-selection, in-normal-with-code-left', async () => {
  await page.keyboard.insertText(['`const a = 0;`normal text'].join('\n'));

  await page.locator('[data-selectid=line-L0] [data-selectid=char-C14]').click();

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=inline-code-menu-item]').click();

  await linesToBe(page, ['`const a = 0;``inline code`normal text']);

  await page.keyboard.type(' const y = 2;');

  await linesToBe(page, ['`const a = 0;`` const y = 2;`normal text']);
});

test('code menu: inline-code-button, no-selection, in-normal-with-code-right', async () => {
  await page.keyboard.insertText(['normal text`const a = 0;`'].join('\n'));

  await page.locator('[data-selectid=line-L0] [data-selectid=char-C11]').click();

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['normal text`inline code``const a = 0;`']);

  await page.keyboard.type('const z = 3; ');

  await linesToBe(page, ['normal text`const z = 3; ``const a = 0;`']);
});

test('code menu: inline-code-dropdown, no-selection, other (content node)', async () => {
  await page.keyboard.insertText(['[bracket link]'].join('\n'));

  await page.locator('[data-selectid=line-L0] [data-selectid=char-C11]').click();

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await expect(page.locator('[data-selectid=inline-code-menu-item]')).toBeDisabled();

  await linesToBe(page, ['[bracket link]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[bracket li.nk]']);
});

test('code menu: inline-code-dropdown, no-selection, other (block node)', async () => {
  await page.keyboard.insertText(['```', 'nothing happened', '```'].join('\n'));

  await page.locator('[data-selectid=line-L1] [data-selectid=char-C3]').click();

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await expect(page.locator('[data-selectid=inline-code-menu-item]')).toBeDisabled();

  await linesToBe(page, ['```', 'nothing happened', '```']);

  await page.keyboard.type('.');

  await linesToBe(page, ['```', 'not.hing happened', '```']);
});

test('code menu: inline-code-button, single-line-selection, in-code-all (syntax and text)', async () => {
  await page.keyboard.insertText(["`import 'react'`"].join('\n'));

  await mouseSelect(
    page,
    '[data-selectid=line-L0] [data-selectid=char-C0]',
    '[data-selectid=line-L0] [data-selectid=char-C16]'
  );

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ["import 'react'"]);

  await page.keyboard.type('.');

  await linesToBe(page, ['.']);
});

test('code menu: inline-code-dropdown, single-line-selection, in-code-all (text)', async () => {
  await page.keyboard.insertText(["`import 'react'`"].join('\n'));

  await mouseSelect(
    page,
    '[data-selectid=line-L0] [data-selectid=char-C1]',
    '[data-selectid=line-L0] [data-selectid=char-C15]'
  );

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=inline-code-menu-item]').click();

  await linesToBe(page, ["import 'react'"]);

  await page.keyboard.type('.');

  await linesToBe(page, ['.']);
});

test('code menu: inline-code-button, single-line-selection, in-code-all (syntax)', async () => {
  await page.keyboard.insertText(["`import 'react'`"].join('\n'));

  await mouseSelect(
    page,
    '[data-selectid=line-L0] [data-selectid=char-C0]',
    '[data-selectid=line-L0] [data-selectid=char-C1]'
  );

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ["import 'react'"]);

  await page.keyboard.type('.');

  await linesToBe(page, [".import 'react'"]);
});

test('code menu: inline-code-dropdown, single-line-selection, in-code-left', async () => {
  await page.keyboard.insertText(["`import 'react'`"].join('\n'));

  await mouseSelect(
    page,
    '[data-selectid=line-L0] [data-selectid=char-C0]',
    '[data-selectid=line-L0] [data-selectid=char-C9]'
  );

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=inline-code-menu-item]').click();

  await linesToBe(page, ["import '`react'`"]);

  await page.keyboard.type('.');

  await linesToBe(page, [".`react'`"]);
});

test('code menu: inline-code-button, single-line-selection, in-code-mid', async () => {
  await page.keyboard.insertText(["`import 'react'`"].join('\n'));

  await mouseSelect(
    page,
    '[data-selectid=line-L0] [data-selectid=char-C3]',
    '[data-selectid=line-L0] [data-selectid=char-C10]'
  );

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ["`im`port 'r`eact'`"]);

  await page.keyboard.type('.');

  await linesToBe(page, ["`im`.`eact'`"]);
});

test('code menu: inline-code-dropdown, single-line-selection, in-code-right', async () => {
  await page.keyboard.insertText(["`import 'react'`"].join('\n'));

  await mouseSelect(
    page,
    '[data-selectid=line-L0] [data-selectid=char-C8]',
    '[data-selectid=line-L0] [data-selectid=char-C15]'
  );

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=inline-code-menu-item]').click();

  await linesToBe(page, ["`import `'react'"]);

  await page.keyboard.type('.');

  await linesToBe(page, ['`import `.']);
});

test('code menu: inline-code-button, single-line-selection, in-normal', async () => {
  await page.keyboard.insertText(['`left code`mid normal text`right code`'].join('\n'));

  await mouseSelect(
    page,
    '[data-selectid=line-L0] [data-selectid=char-C16]',
    '[data-selectid=line-L0] [data-selectid=char-C24]'
  );

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['`left code`mid n`ormal te`xt`right code`']);

  await page.keyboard.type('.');

  await linesToBe(page, ['`left code`mid n`.`xt`right code`']);
});

test('code menu: inline-code-dropdown, single-line-selection, in-normal-with-code-left', async () => {
  await page.keyboard.insertText(['`left code`mid normal text`right code`'].join('\n'));

  await mouseSelect(
    page,
    '[data-selectid=line-L0] [data-selectid=char-C11]',
    '[data-selectid=line-L0] [data-selectid=char-C19]'
  );

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=inline-code-menu-item]').click();

  await linesToBe(page, ['`left code``mid norm`al text`right code`']);

  await page.keyboard.type('.');

  await linesToBe(page, ['`left code``.`al text`right code`']);
});

test('code menu: inline-code-button, single-line-selection, in-normal-with-code-right', async () => {
  await page.keyboard.insertText(['`left code`mid normal text`right code`'].join('\n'));

  await mouseSelect(
    page,
    '[data-selectid=line-L0] [data-selectid=char-C20]',
    '[data-selectid=line-L0] [data-selectid=char-C26]'
  );

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['`left code`mid norma`l text``right code`']);

  await page.keyboard.type('.');

  await linesToBe(page, ['`left code`mid norma`.``right code`']);
});

test('code menu: inline-code-dropdown, single-line-selection, other (mixed with foreigner)', async () => {
  await page.keyboard.insertText(['$$\\int_a^b f(x)g(x) dx$$'].join('\n'));

  await mouseSelect(
    page,
    '[data-selectid=line-L0] [data-selectid=char-C3]',
    '[data-selectid=line-L0] [data-selectid=char-C8]'
  );

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await expect(page.locator('[data-selectid=inline-code-menu-item]')).toBeDisabled();

  await linesToBe(page, ['$$\\int_a^b f(x)g(x) dx$$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$\\.^b f(x)g(x) dx$$']);
});

test('code menu: inline-code-button, single-line-selection, other (mixed with friend)', async () => {
  await page.keyboard.insertText(['`left code`mid normal text`right code`'].join('\n'));

  await mouseSelect(
    page,
    '[data-selectid=line-L0] [data-selectid=char-C8]',
    '[data-selectid=line-L0] [data-selectid=char-C30]'
  );

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await expect(page.locator('[data-selectid=inline-code-menu-item]')).toBeDisabled();

  await linesToBe(page, ['`left code`mid normal text`right code`']);

  await page.keyboard.type('.');

  await linesToBe(page, ['`left co.ht code`']);
});

test('code menu: block-code, no-selection, empty-line', async () => {
  await page.locator('[data-selectid=line-L0] [data-selectid=char-C0]').click();

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-code-menu-item]').click();

  await linesToBe(page, ['```', 'block code', '```']);

  await page.keyboard.type('React Clay Editor');

  await linesToBe(page, ['```', 'React Clay Editor', '```']);
});

test('code menu: block-code, no-selection, empty-code', async () => {
  await page.keyboard.insertText(['```', '', '```'].join('\n'));

  await page.locator('[data-selectid=line-L1] [data-selectid=char-C0]').click();

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.']);
});

test('code menu: block-code, no-selection, in-code (code)', async () => {
  await page.keyboard.insertText([' ```', ' const a = 1;', ' ```'].join('\n'));

  await page.locator('[data-selectid=line-L1] [data-selectid=char-C3]').click();

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-code-menu-item]').click();

  await linesToBe(page, [' const a = 1;']);

  await page.keyboard.type('.');

  await linesToBe(page, [' co.nst a = 1;']);
});

test('code menu: block-code, no-selection, in-code (syntax)', async () => {
  await page.keyboard.insertText(['```', 'const a = 1;', 'const b = 2;', '```'].join('\n'));

  await page.locator('[data-selectid=line-L3] [data-selectid=char-C3]').click();

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['const a = 1;', 'const b = 2;']);

  await page.keyboard.type('.');

  await linesToBe(page, ['const a = 1;', 'const b = 2;.']);
});

test('code menu: block-code, no-selection, in-code-top', async () => {
  await page.keyboard.insertText(['  ```', '  const a = 1;', '  const b = 2;', '  ```'].join('\n'));

  await page.locator('[data-selectid=line-L1] [data-selectid=char-C6]').click();

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['  const a = 1;', '  ```', '  const b = 2;', '  ```']);

  await page.keyboard.type('.');

  await linesToBe(page, ['  cons.t a = 1;', '  ```', '  const b = 2;', '  ```']);
});

test('code menu: block-code, no-selection, in-code-mid', async () => {
  await page.keyboard.insertText(['```', 'const a = 1;', 'const b = 2;', 'const c = 3;', '```'].join('\n'));

  await page.locator('[data-selectid=line-L2] [data-selectid=char-C1]').click();

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-code-menu-item]').click();

  await linesToBe(page, ['```', 'const a = 1;', '```', 'const b = 2;', '```', 'const c = 3;', '```']);

  await page.keyboard.type('.');

  await linesToBe(page, ['```', 'const a = 1;', '```', 'c.onst b = 2;', '```', 'const c = 3;', '```']);
});

test('code menu: block-code, no-selection, in-code-bottom', async () => {
  await page.keyboard.insertText(['  ```', '  const a = 1;', '  const b = 2;', '  ```'].join('\n'));

  await page.locator('[data-selectid=line-L2] [data-selectid=char-C9]').click();

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['  ```', '  const a = 1;', '  ```', '  const b = 2;']);

  await page.keyboard.type('.');

  await linesToBe(page, ['  ```', '  const a = 1;', '  ```', '  const b. = 2;']);
});

test('code menu: block-code, no-selection, in-other-line', async () => {
  await page.keyboard.insertText([' normal line'].join('\n'));

  await page.locator('[data-selectid=line-L0] [data-selectid=char-C3]').click();

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-code-menu-item]').click();

  await linesToBe(page, ['```', ' normal line', '```']);

  await page.keyboard.type('.');

  await linesToBe(page, ['```', ' no.rmal line', '```']);
});

test('code menu: block-code, no-selection, in-other-line (with nested code)', async () => {
  await page.keyboard.insertText([' ```', ' const a = 1', ' ```', ' normal line'].join('\n'));

  await page.locator('[data-selectid=line-L3] [data-selectid=char-C3]').click();

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-code-menu-item]').click();

  await linesToBe(page, [' ```', ' const a = 1', ' ```', '```', ' normal line', '```']);

  await page.keyboard.type('.');

  await linesToBe(page, [' ```', ' const a = 1', ' ```', '```', ' no.rmal line', '```']);
});

test('code menu: block-code, no-selection, in-other-with-code-above', async () => {
  await page.keyboard.insertText([' ```', ' const a = 1;', 'normal line'].join('\n'));

  await page.locator('[data-selectid=line-L2] [data-selectid=char-C5]').click();

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-code-menu-item]').click();

  await linesToBe(page, [' ```', ' const a = 1;', '```', 'normal line', '```']);

  await page.keyboard.type('.');

  await linesToBe(page, [' ```', ' const a = 1;', '```', 'norma.l line', '```']);
});

test('code menu: block-code, no-selection, in-other-with-code-below', async () => {
  await page.keyboard.insertText([' normal line', '```', 'const a = 1;', '```'].join('\n'));

  await page.locator('[data-selectid=line-L0] [data-selectid=char-C5]').click();

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-code-menu-item]').click();

  await linesToBe(page, ['```', ' normal line', '```', '```', 'const a = 1;', '```']);

  await page.keyboard.type('.');

  await linesToBe(page, ['```', ' norm.al line', '```', '```', 'const a = 1;', '```']);
});

test('code menu: block-code, selection, all-code-lines (syntax)', async () => {
  await page.keyboard.insertText(['```', 'const a = 1;', 'const b = 2;', '```'].join('\n'));

  await mouseSelect(
    page,
    '[data-selectid=line-L0] [data-selectid=char-C1]',
    '[data-selectid=line-L0] [data-selectid=char-C3]'
  );

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['const a = 1;', 'const b = 2;']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.const a = 1;', 'const b = 2;']);
});

test('code menu: block-code, selection, all-code-lines (code)', async () => {
  await page.keyboard.insertText([' ```', ' const a = 1;', ' const b = 2;'].join('\n'));

  await mouseSelect(
    page,
    '[data-selectid=line-L1] [data-selectid=char-C4]',
    '[data-selectid=line-L2] [data-selectid=char-C6]'
  );

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-code-menu-item]').click();

  await linesToBe(page, [' const a = 1;', ' const b = 2;']);

  await page.keyboard.type('.');

  await linesToBe(page, [' con. b = 2;']);
});

test('code menu: block-code, selection, all-code-lines (code and syntax)', async () => {
  await page.keyboard.insertText([' ```', ' const a = 1;', ' const b = 2;'].join('\n'));

  await mouseSelect(
    page,
    '[data-selectid=line-L0] [data-selectid=char-C1]',
    '[data-selectid=line-L2] [data-selectid=char-C6]'
  );

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-code-menu-item]').click();

  await linesToBe(page, [' const a = 1;', ' const b = 2;']);

  await page.keyboard.type('.');

  await linesToBe(page, ['. b = 2;']);
});

test('code menu: block-code, selection, all-code-lines-top', async () => {
  await page.keyboard.insertText([' ```', ' const a = 1;', ' const b = 2;', ' ```'].join('\n'));

  await mouseSelect(
    page,
    '[data-selectid=line-L0] [data-selectid=char-C1]',
    '[data-selectid=line-L1] [data-selectid=char-C5]'
  );

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-code-menu-item]').click();

  await linesToBe(page, [' const a = 1;', ' ```', ' const b = 2;', ' ```']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.t a = 1;', ' ```', ' const b = 2;', ' ```']);
});

test('code menu: block-code, selection, in-code-mid', async () => {
  await page.keyboard.insertText([' ```', ' const a = 1;', ' const b = 2;', ' const c = 3;', ' ```'].join('\n'));

  await mouseSelect(
    page,
    '[data-selectid=line-L2] [data-selectid=char-C8]',
    '[data-selectid=line-L2] [data-selectid=char-C0]'
  );

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-code-menu-item]').click();

  await linesToBe(page, [' ```', ' const a = 1;', ' ```', ' const b = 2;', ' ```', ' const c = 3;', ' ```']);

  await page.keyboard.type('.');

  await linesToBe(page, [' ```', ' const a = 1;', ' ```', '. = 2;', ' ```', ' const c = 3;', ' ```']);
});

test('code menu: block-code, selection, all-code-lines-bottom', async () => {
  await page.keyboard.insertText([' ```', ' const a = 1;', ' const b = 2;'].join('\n'));

  await mouseSelect(
    page,
    '[data-selectid=line-L2] [data-selectid=char-C1]',
    '[data-selectid=line-L2] [data-selectid=char-C5]'
  );

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, [' ```', ' const a = 1;', ' ```', ' const b = 2;']);

  await page.keyboard.type('.');

  await linesToBe(page, [' ```', ' const a = 1;', ' ```', ' .t b = 2;']);
});

test('code menu: block-code, selection, all-other-lines', async () => {
  await page.keyboard.insertText(['normal line `code string`', '$f(x)$ normal line'].join('\n'));

  await mouseSelect(
    page,
    '[data-selectid=line-L0] [data-selectid=char-C1]',
    '[data-selectid=line-L1] [data-selectid=char-C3]'
  );

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-code-menu-item]').click();

  await linesToBe(page, ['```', 'normal line `code string`', '$f(x)$ normal line', '```']);

  await page.keyboard.type('.');

  await linesToBe(page, ['```', 'n.x)$ normal line', '```']);
});

test('code menu: block-code, selection, in-other-with-code-above', async () => {
  await page.keyboard.insertText(['normal text', 'normal text', '```', 'const a = 1;'].join('\n'));

  await mouseSelect(
    page,
    '[data-selectid=line-L0] [data-selectid=char-C1]',
    '[data-selectid=line-L1] [data-selectid=char-C3]'
  );

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-code-menu-item]').click();

  await linesToBe(page, ['```', 'normal text', 'normal text', '```', '```', 'const a = 1;']);

  await page.keyboard.type('.');

  await linesToBe(page, ['```', 'n.mal text', '```', '```', 'const a = 1;']);
});

test('code menu: block-code, selection, in-other-with-code-below', async () => {
  await page.keyboard.insertText(['```', 'const a = 1;', '```', 'normal text', 'normal text'].join('\n'));

  await mouseSelect(
    page,
    '[data-selectid=line-L3] [data-selectid=char-C9]',
    '[data-selectid=line-L3] [data-selectid=char-C11]'
  );

  await page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=block-code-menu-item]').click();

  await linesToBe(page, ['```', 'const a = 1;', '```', '```', 'normal text', '```', 'normal text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['```', 'const a = 1;', '```', '```', 'normal te.', '```', 'normal text']);
});

test('code menu: block-code, selection, mixed-lines (code and other)', async () => {
  await page.keyboard.insertText(['```', 'const a = 1;', '```', 'normal text', 'normal text'].join('\n'));

  await mouseSelect(
    page,
    '[data-selectid=line-L2] [data-selectid=char-C1]',
    '[data-selectid=line-L3] [data-selectid=char-C6]'
  );

  await expect(page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]')).toBeDisabled();

  await linesToBe(page, ['```', 'const a = 1;', '```', 'normal text', 'normal text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['```', 'const a = 1;', '`. text', 'normal text']);
});

test('code menu: block-code, selection, mixed-lines (double code)', async () => {
  await page.keyboard.insertText(['```', 'const a = 1;', '```', '```', 'const b = 2;'].join('\n'));

  await mouseSelect(
    page,
    '[data-selectid=line-L3] [data-selectid=char-C1]',
    '[data-selectid=line-L1] [data-selectid=char-C5]'
  );

  await expect(page.locator('[data-selectid=code-menu] >> [data-selectid=dropdown-arrow-button]')).toBeDisabled();

  await linesToBe(page, ['```', 'const a = 1;', '```', '```', 'const b = 2;']);

  await page.keyboard.type('.');

  await linesToBe(page, ['```', 'const.``', 'const b = 2;']);
});

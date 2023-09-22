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

test('link menus: bracket, no-selection, empty-line', async () => {
  await page.locator('[data-selectid=char-L0C0]').click();

  await page.locator('[data-selectid=bracket-menu]').click();

  await linesToBe(page, ['[bracket link]']);

  await page.keyboard.press('Enter');

  await linesToBe(page, ['[react-clay-editor]']);
});

test('link menus: hashtag, no-selection, empty-line', async () => {
  await page.locator('[data-selectid=char-L0C0]').click();

  await page.locator('[data-selectid=hashtag-menu]').click();

  await linesToBe(page, ['#hashtag_link ']);

  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  await linesToBe(page, ['#@emotion/react ']);
});

test('link menus: tagged-link-button, no-selection, empty-line', async () => {
  await page.locator('[data-selectid=char-L0C0]').click();

  await page.locator('[data-selectid=tagged-link-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['[npm: package]']);

  await page.keyboard.press('Enter');

  await linesToBe(page, ['[npm: react-clay-editor]']);
});

test('link menus: tagged-link-dropdown, no-selection, empty-line', async () => {
  await page.locator('[data-selectid=char-L0C0]').click();

  await page.locator('[data-selectid=tagged-link-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=github-tagged-link-menu-item]').click();

  await linesToBe(page, ['[github: @user/repository]']);

  await page.keyboard.press('Enter');

  await linesToBe(page, ['[github: @kumachan-mis/react-clay-editor]']);
});

test('link menus: bracket, no-selection, in-bracket-link', async () => {
  await page.keyboard.insertText(['[This is normal text]'].join('\n'));

  await page.locator('[data-selectid=char-L0C15]').click();

  await page.locator('[data-selectid=bracket-menu]').click();

  await linesToBe(page, ['This is normal text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['This is normal. text']);
});

test('link menus: bracket, no-selection, in-hashtag-link', async () => {
  await page.keyboard.insertText(['#nothing_happened'].join('\n'));

  await page.locator('[data-selectid=char-L0C5]').click();

  await expect(page.locator('[data-selectid=bracket-menu]')).toBeDisabled();

  await linesToBe(page, ['#nothing_happened']);

  await page.keyboard.type('.');

  await linesToBe(page, ['#noth.ing_happened']);
});

test('link menus: hashtag, no-selection, in-hashtag-link', async () => {
  await page.keyboard.insertText(['#normal_text'].join('\n'));

  await page.locator('[data-selectid=char-L0C5]').click();

  await page.locator('[data-selectid=hashtag-menu]').click();

  await linesToBe(page, ['normal text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['norm.al text']);
});

test('link menus: hashtag, no-selection, in-tagged-link', async () => {
  await page.keyboard.insertText(['[npm: nothing happend]'].join('\n'));

  await page.locator('[data-selectid=char-L0C8]').click();

  await expect(page.locator('[data-selectid=hashtag-menu]')).toBeDisabled();

  await linesToBe(page, ['[npm: nothing happend]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[npm: no.thing happend]']);
});

test('link menus: tagged-link-button, no-selection, in-tagged-link', async () => {
  await page.keyboard.insertText(['[npm: react]'].join('\n'));

  await page.locator('[data-selectid=char-L0C2]').click();

  await page.locator('[data-selectid=tagged-link-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['react']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.react']);
});

test('link menus: tagged-link-dropdown, no-selection, in-tagged-link (same tag)', async () => {
  await page.keyboard.insertText(['[npm: react]'].join('\n'));

  await page.locator('[data-selectid=char-L0C2]').click();

  await page.locator('[data-selectid=tagged-link-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=npm-tagged-link-menu-item]').click();

  await linesToBe(page, ['react']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.react']);
});

test('link menus: tagged-link-dropdown, no-selection, in-tagged-link (other tag)', async () => {
  await page.keyboard.insertText(['[npm: @facebook/react]'].join('\n'));

  await page.locator('[data-selectid=char-L0C2]').click();

  await page.locator('[data-selectid=tagged-link-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=github-tagged-link-menu-item]').click();

  await linesToBe(page, ['[github: @facebook/react]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[github: .@facebook/react]']);
});

test('link menus: tagged-link-button, no-selection, in-bracket-link', async () => {
  await page.keyboard.insertText(['[nothing happend]'].join('\n'));

  await page.locator('[data-selectid=char-L0C1]').click();

  await expect(page.locator('[data-selectid=tagged-link-menu] >> [data-selectid=dropdown-main-button]')).toBeDisabled();

  await linesToBe(page, ['[nothing happend]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[.nothing happend]']);
});

test('link menus: bracket, no-selection, in-normal', async () => {
  await page.keyboard.insertText(['normal text'].join('\n'));

  await page.locator('[data-selectid=char-L0C1]').click();

  await page.locator('[data-selectid=bracket-menu]').click();

  await linesToBe(page, ['n[bracket link]ormal text']);

  await page.keyboard.type('hello world');

  await linesToBe(page, ['n[hello world]ormal text']);
});

test('link menus: hashtag, no-selection, in-normal', async () => {
  await page.keyboard.insertText(['normal text'].join('\n'));

  await page.locator('[data-selectid=char-L0C3]').click();

  await page.locator('[data-selectid=hashtag-menu]').click();

  await linesToBe(page, ['nor#hashtag_link mal text']);

  await page.keyboard.type('hello_world ');

  await linesToBe(page, ['nor#hello_world mal text']);
});

test('link menus: tagged-link-button, no-selection, in-normal', async () => {
  await page.keyboard.insertText(['normal text'].join('\n'));

  await page.locator('[data-selectid=char-L0C2]').click();

  await page.locator('[data-selectid=tagged-link-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['no[npm: package]rmal text']);

  await page.keyboard.type('react');

  await linesToBe(page, ['no[npm: react]rmal text']);
});

test('link menus: tagged-link-dropdown, no-selection, in-normal', async () => {
  await page.keyboard.insertText(['normal text'].join('\n'));

  await page.locator('[data-selectid=char-L0C6]').click();

  await page.locator('[data-selectid=tagged-link-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=npm-tagged-link-menu-item]').click();

  await linesToBe(page, ['normal[npm: package] text']);

  await page.keyboard.type('react');

  await linesToBe(page, ['normal[npm: react] text']);
});

test('link menus: bracket, no-selection, other (content node)', async () => {
  await page.keyboard.insertText(['$f(x)g(x)$'].join('\n'));

  await page.locator('[data-selectid=char-L0C6]').click();

  await expect(page.locator('[data-selectid=bracket-menu]')).toBeDisabled();

  await linesToBe(page, ['$f(x)g(x)$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$f(x)g.(x)$']);
});

test('link menus: tagged-link-dropdown, no-selection, other (block node)', async () => {
  await page.keyboard.insertText(['$$', '\\sum_{i=0}^{n-1}a_nb_n', '$$'].join('\n'));

  await page.locator('[data-selectid=char-L1C17]').click();

  await expect(
    page.locator('[data-selectid=tagged-link-menu] >> [data-selectid=dropdown-arrow-button]')
  ).toBeDisabled();

  await linesToBe(page, ['$$', '\\sum_{i=0}^{n-1}a_nb_n', '$$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$', '\\sum_{i=0}^{n-1}a._nb_n', '$$']);
});

test('link menus: bracket, single-line-selection, in-bracket-link', async () => {
  await page.keyboard.insertText(['[This is normal text]'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C15]', '[data-selectid=char-L0C9]');

  await page.locator('[data-selectid=bracket-menu]').click();

  await linesToBe(page, ['This is normal text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['This is . text']);
});

test('link menus: bracket, single-line-selection, in-tagged-link', async () => {
  await page.keyboard.insertText(['[npm: nothing happened]'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C5]', '[data-selectid=char-L0C6]');

  await expect(page.locator('[data-selectid=bracket-menu]')).toBeDisabled();

  await linesToBe(page, ['[npm: nothing happened]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[npm:.nothing happened]']);
});

test('link menus: hashtag, single-line-selection, in-hashtag-link', async () => {
  await page.keyboard.insertText(['#normal_text'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C7]', '[data-selectid=char-L0C0]');

  await page.locator('[data-selectid=hashtag-menu]').click();

  await linesToBe(page, ['normal text']);

  await page.keyboard.type('.');

  await linesToBe(page, ['. text']);
});

test('link menus: hashtag, single-line-selection, in-bracket-link', async () => {
  await page.keyboard.insertText(['[nothing happend]'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C2]', '[data-selectid=char-L0C8]');

  await expect(page.locator('[data-selectid=hashtag-menu]')).toBeDisabled();

  await linesToBe(page, ['[nothing happend]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[n. happend]']);
});

test('link menus: tagged-link-dropdown, single-line-selection, in-tagged-link', async () => {
  await page.keyboard.insertText(['[npm: react-clay-editor]'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C5]', '[data-selectid=char-L0C16]');

  await page.locator('[data-selectid=tagged-link-menu] >> [data-selectid=dropdown-arrow-button]').click();
  await page.locator('[data-selectid=npm-tagged-link-menu-item]').click();

  await linesToBe(page, ['react-clay-editor']);

  await page.keyboard.type('.');

  await linesToBe(page, ['.-editor']);
});

test('link menus: tagged-link-dropdown, single-line-selection, in-bracket-link', async () => {
  await page.keyboard.insertText(['[nothing happend]'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C13]', '[data-selectid=char-L0C17]');

  await expect(
    page.locator('[data-selectid=tagged-link-menu] >> [data-selectid=dropdown-arrow-button]')
  ).toBeDisabled();

  await linesToBe(page, ['[nothing happend]']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[nothing happ.']);
});

test('link menus: bracket, single-line-selection, in-normal', async () => {
  await page.keyboard.insertText(['normal text'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C1]', '[data-selectid=char-L0C6]');

  await page.locator('[data-selectid=bracket-menu]').click();

  await linesToBe(page, ['n[ormal] text']);

  await page.keyboard.press('Enter');

  await linesToBe(page, ['n[', '] text']);
});

test('link menus: hashtag, single-line-selection, in-normal', async () => {
  await page.keyboard.insertText(['normal text'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C3]', '[data-selectid=char-L0C7]');

  await page.locator('[data-selectid=hashtag-menu]').click();

  await linesToBe(page, ['nor#mal_ text']);

  await page.keyboard.press('Enter');

  await linesToBe(page, ['nor#', ' text']);
});

test('link menus: tagged-link-button, single-line-selection, in-normal', async () => {
  await page.keyboard.insertText(['normal text'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C2]', '[data-selectid=char-L0C6]');

  await page.locator('[data-selectid=tagged-link-menu] >> [data-selectid=dropdown-main-button]').click();

  await linesToBe(page, ['no[npm: rmal] text']);

  await page.keyboard.press('Enter');

  await linesToBe(page, ['no[npm: ', '] text']);
});

test('link menus: tagged-link-button, single-line-selection, other (content node)', async () => {
  await page.keyboard.insertText(['$f(x)g(x)$'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C6]', '[data-selectid=char-L0C9]');

  await expect(page.locator('[data-selectid=tagged-link-menu] >> [data-selectid=dropdown-main-button]')).toBeDisabled();

  await linesToBe(page, ['$f(x)g(x)$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$f(x)g.$']);
});

test('link menus: bracket, single-line-selection, other (block node)', async () => {
  await page.keyboard.insertText(['$$', '\\sum_{i=0}^{n-1}a_nb_n', '$$'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L1C17]', '[data-selectid=char-L1C14]');

  await expect(page.locator('[data-selectid=bracket-menu]')).toBeDisabled();

  await linesToBe(page, ['$$', '\\sum_{i=0}^{n-1}a_nb_n', '$$']);

  await page.keyboard.type('.');

  await linesToBe(page, ['$$', '\\sum_{i=0}^{n-._nb_n', '$$']);
});

test('link menus: hashtag, single-line-selection, other (mixed with friend)', async () => {
  await page.keyboard.insertText(['#hashtag #hashtag2'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C1]', '[data-selectid=char-L0C12]');

  await expect(page.locator('[data-selectid=hashtag-menu]')).toBeDisabled();

  await linesToBe(page, ['#hashtag #hashtag2']);

  await page.keyboard.type('.');

  await linesToBe(page, ['#.shtag2']);
});

test('link menus: tagged-link-dropdown, single-line-selection, other (mixed with foreigner)', async () => {
  await page.keyboard.insertText(['[github: nothing_happened] `code string`'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C19]', '[data-selectid=char-L0C29]');

  await expect(
    page.locator('[data-selectid=tagged-link-menu] >> [data-selectid=dropdown-arrow-button]')
  ).toBeDisabled();

  await linesToBe(page, ['[github: nothing_happened] `code string`']);

  await page.keyboard.type('.');

  await linesToBe(page, ['[github: nothing_ha.ode string`']);
});

test('link menus: bracket, multi-lines-selection', async () => {
  await page.keyboard.insertText(['normal text', 'normal text too'].join('\n'));

  await mouseSelect(page, '[data-selectid=char-L0C7]', '[data-selectid=char-L1C4]');

  await expect(page.locator('[data-selectid=bracket-menu]')).toBeDisabled();

  await linesToBe(page, ['normal text', 'normal text too']);

  await page.keyboard.type('.');

  await linesToBe(page, ['normal .al text too']);
});

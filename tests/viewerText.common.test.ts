import test, { expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./viewer');
  await page.getByTestId('mock-textarea').click();
});

test('normal', async ({ page }) => {
  await page.keyboard.insertText('hello world');

  await expect(page.locator('[data-styleid=normal]').nth(0)).toHaveText('hello world');
});

test('hashtag', async ({ page }) => {
  await page.keyboard.insertText('#hashtagtest, #hashtag_test, #hashtag-test');

  await expect(page.locator('[data-styleid=hashtag]').nth(0)).toHaveText('#hashtagtest');
  await expect(page.locator('[data-styleid=hashtag]').nth(1)).toHaveText('#hashtag_test');
  await expect(page.locator('[data-styleid=hashtag]').nth(2)).toHaveText('#hashtag-test');
});

test('bracket link', async ({ page }) => {
  await page.keyboard.insertText('[bracket test]');

  await expect(page.locator('[data-styleid=bracket-link]').nth(0)).toHaveText('bracket test');
});

test('tagged link', async ({ page }) => {
  await page.keyboard.insertText('[npm: package name] [github: @username/repository]');
  await expect(page.locator('[data-styleid=npm-tagged-link]').nth(0)).toHaveText('npm: package name');
  await expect(page.locator('[data-styleid=github-tagged-link]').nth(0)).toHaveText('github: @username/repository');
});

test('formula', async ({ page }) => {
  await page.keyboard.insertText(
    [
      // input text
      '$f(x)$ $\\unknown$',
      '$$\\int_a^b f(x) dx$$',
      '$$',
      '\\int_a^b f(x) dx',
      '$$',
      '$$',
      '\\int_a^b g(y) dy',
    ].join('\n')
  );

  await expect(page.locator('[data-styleid=inline-formula]')).toHaveCount(2);
  await expect(page.locator('[data-styleid=display-formula]')).toHaveCount(1);
  await expect(page.locator('[data-styleid=block-formula]')).toHaveCount(2);
});

test('code', async ({ page }) => {
  await page.keyboard.insertText(
    [
      // input text
      "`import React from 'react';`",
      '```',
      'const Component = () => (',
      '  <>component</>',
      ');',
      '```',
      '```',
      'const AnotherComponent = () => (',
      '  <>another component </>',
      ');',
    ].join('\n')
  );

  await expect(page.locator('[data-styleid=inline-code]').nth(0)).toHaveText("import React from 'react';");
  await expect(page.locator('[data-styleid=block-code]').nth(0)).toHaveText(
    ['```', 'const Component = () => (', '  <>component</>', ');', '```'].join('\n')
  );
  await expect(page.locator('[data-styleid=block-code]').nth(1)).toHaveText(
    ['```', 'const AnotherComponent = () => (', '  <>another component </>', ');'].join('\n')
  );
});

test('quotation', async ({ page }) => {
  await page.keyboard.insertText('> Genius is one percent inspiration and ninety-nine percent perspiration');
  await expect(page.locator('[data-styleid=quotation]').nth(0)).toHaveText(
    'Genius is one percent inspiration and ninety-nine percent perspiration'
  );
});

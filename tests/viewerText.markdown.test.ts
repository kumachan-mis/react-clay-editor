import { test, expect, Page } from '@playwright/test';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('./viewer');
});

test.beforeEach(async () => {
  await page.getByTestId('refresh-button').click();
  await page.getByTestId('mock-textarea').click();
});

test.afterAll(async () => {
  await page.close();
});

test('heading', async () => {
  await page.keyboard.insertText(
    [
      // Input text
      '# Largest Heading',
      '## Larger Heading',
      '### Normal Heading',
      '#### Also Normal Heading',
    ].join('\n'),
  );

  await expect(page.locator('[data-styleid=heading-largest]').nth(0)).toHaveText('Largest Heading');
  await expect(page.locator('[data-styleid=heading-larger]').nth(0)).toHaveText('Larger Heading');
  await expect(page.locator('[data-styleid=heading-normal]').nth(0)).toHaveText('Normal Heading');
  await expect(page.locator('[data-styleid=heading-normal]').nth(1)).toHaveText('Also Normal Heading');
});

test('itemization', async () => {
  await page.keyboard.insertText(
    [
      // Input text
      '* itemized text',
      ' * nested itemized text',
      '- itemized text',
      '\t\t- nested itemized text',
    ].join('\n'),
  );

  await expect(page.locator('[data-styleid=itemization]').nth(0)).toHaveText(' itemized text');
  await expect(page.locator('[data-styleid=itemization]').nth(1)).toHaveText('  nested itemized text');
  await expect(page.locator('[data-styleid=itemization]').nth(2)).toHaveText(' itemized text');
  await expect(page.locator('[data-styleid=itemization]').nth(3)).toHaveText('   nested itemized text');
});

test('decoration', async () => {
  await page.keyboard.insertText(
    [
      // Input text
      '*bold text*_italic text_',
    ].join('\n'),
  );

  await expect(page.locator('[data-styleid=decoration-normal-bold]').nth(0)).toHaveText('bold text');
  await expect(page.locator('[data-styleid=decoration-normal-italic]').nth(0)).toHaveText('italic text');
});

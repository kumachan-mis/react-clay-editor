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

test('decoration', async () => {
  await page.keyboard.insertText(
    [
      // Input text
      '# Largest Text',
      '## Larger Text',
      '### Bold Text',
      '#### Also Bold Text',
      '*bold text*_italic text_',
    ].join('\n')
  );

  await expect(page.locator('[data-styleid=decoration-largest-bold]').nth(0)).toHaveText('Largest Text');
  await expect(page.locator('[data-styleid=decoration-larger-bold]').nth(0)).toHaveText('Larger Text');
  await expect(page.locator('[data-styleid=decoration-normal-bold]').nth(0)).toHaveText('Bold Text');
  await expect(page.locator('[data-styleid=decoration-normal-bold]').nth(1)).toHaveText('Also Bold Text');
  await expect(page.locator('[data-styleid=decoration-normal-bold]').nth(2)).toHaveText('bold text');
  await expect(page.locator('[data-styleid=decoration-normal-italic]').nth(0)).toHaveText('italic text');
});

test('itemization', async () => {
  await page.keyboard.insertText(
    [
      // Input text
      '* itemized text',
      ' * nested itemized text',
      '- itemized text',
      '\t\t- nested itemized text',
    ].join('\n')
  );

  await expect(page.locator('[data-styleid=itemization]').nth(0)).toHaveText(' itemized text');
  await expect(page.locator('[data-styleid=itemization]').nth(1)).toHaveText('  nested itemized text');
  await expect(page.locator('[data-styleid=itemization]').nth(2)).toHaveText(' itemized text');
  await expect(page.locator('[data-styleid=itemization]').nth(3)).toHaveText('   nested itemized text');
});

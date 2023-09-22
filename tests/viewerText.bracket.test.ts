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
      // input text
      '[**** Largest Text][*** Also Largest Text][** Larger Text]',
      '[* bold text][/ italic text][_ underlined text]',
    ].join('\n')
  );

  await expect(page.locator('[data-styleid=decoration-largest-bold]').nth(0)).toHaveText('Largest Text');
  await expect(page.locator('[data-styleid=decoration-largest-bold]').nth(1)).toHaveText('Also Largest Text');
  await expect(page.locator('[data-styleid=decoration-larger-bold]').nth(0)).toHaveText('Larger Text');
  await expect(page.locator('[data-styleid=decoration-normal-bold]').nth(0)).toHaveText('bold text');
  await expect(page.locator('[data-styleid=decoration-normal-italic]').nth(0)).toHaveText('italic text');
  await expect(page.locator('[data-styleid=decoration-normal-underline]').nth(0)).toHaveText('underlined text');
});

test('itemization', async () => {
  await page.keyboard.insertText(
    [
      // input text
      ' itemized text',
      '  nested itemized text',
      '\titemized text',
      '\t\t\tnested itemized text',
      '　箇条書きテキスト',
      '　　　　ネストした箇条書きテキスト',
    ].join('\n')
  );

  await expect(page.locator('[data-styleid=itemization]').nth(0)).toHaveText(' itemized text');
  await expect(page.locator('[data-styleid=itemization]').nth(1)).toHaveText('  nested itemized text');
  await expect(page.locator('[data-styleid=itemization]').nth(2)).toHaveText(' itemized text');
  await expect(page.locator('[data-styleid=itemization]').nth(3)).toHaveText('   nested itemized text');
  await expect(page.locator('[data-styleid=itemization]').nth(4)).toHaveText(' 箇条書きテキスト');
  await expect(page.locator('[data-styleid=itemization]').nth(5)).toHaveText('    ネストした箇条書きテキスト');
});

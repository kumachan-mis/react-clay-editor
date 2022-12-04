import test, { expect } from '@playwright/test';

import { linesToBe } from './testUtils';

test.beforeEach(async ({ page }) => {
  await page.goto('.');
  await page.locator('[data-selectid=text-field]').click();
});

test('text suggestion', async ({ page }) => {
  await expect(page.locator('text="Text Suggestion"')).toHaveCount(0);
  await page.keyboard.type('Re');
  await expect(page.locator('text="Text Suggestion"')).toHaveCount(1);
  await page.locator('text="Real Time"').click();
  await page.keyboard.type('.');
  await linesToBe(page, ['Real Time.']);
});

test('bracket link suggestion', async ({ page }) => {
  await expect(page.locator('text="Bracket Link Suggestion"')).toHaveCount(0);
  await page.keyboard.type('[');
  await expect(page.locator('text="Bracket Link Suggestion"')).toHaveCount(1);
  await page.locator('text="react-realtime-markup-editor"').click();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('.');
  await linesToBe(page, ['[react-realtime-markup-editor].']);
});

test('hashtag suggestion', async ({ page }) => {
  await expect(page.locator('text="Hashtag Suggestion"')).toHaveCount(0);
  await page.keyboard.type('#');
  await expect(page.locator('text="Hashtag Suggestion"')).toHaveCount(1);
  await page.locator('text="react-realtime-markup-editor"').click();
  await page.keyboard.type('.');
  await linesToBe(page, ['#react-realtime-markup-editor .']);
});

test('tagged link suggestion', async ({ page }) => {
  await expect(page.locator('text="Tagged Link Suggestion"')).toHaveCount(0);
  await page.keyboard.type('[github:');
  await expect(page.locator('text="Tagged Link Suggestion"')).toHaveCount(1);
  await page.locator('text="@kumachan-mis/react-realtime-markup-editor"').click();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('.');
  await linesToBe(page, ['[github: @kumachan-mis/react-realtime-markup-editor].']);
});

import { linesToBe } from './testUtils';

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./editor');
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
  await page.locator('text="react-clay-editor"').click();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('.');
  await linesToBe(page, ['[react-clay-editor].']);
});

test('hashtag suggestion', async ({ page }) => {
  await expect(page.locator('text="Hashtag Suggestion"')).toHaveCount(0);
  await page.keyboard.type('#');
  await expect(page.locator('text="Hashtag Suggestion"')).toHaveCount(1);
  await page.locator('text="react-clay-editor"').click();
  await page.keyboard.type('.');
  await linesToBe(page, ['#react-clay-editor .']);
});

test('tagged link suggestion', async ({ page }) => {
  await expect(page.locator('text="Tagged Link Suggestion"')).toHaveCount(0);
  await page.keyboard.type('[github:');
  await expect(page.locator('text="Tagged Link Suggestion"')).toHaveCount(1);
  await page.locator('text="@kumachan-mis/react-clay-editor"').click();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('.');
  await linesToBe(page, ['[github: @kumachan-mis/react-clay-editor].']);
});

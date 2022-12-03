import { expect, Page } from '@playwright/test';

export async function linesToBe(page: Page, lines: string[]): Promise<void> {
  for (let i = 0; i < lines.length; i++) {
    const locator = page.locator(`[data-selectid=line-L${i}]`);
    await expect(locator).toHaveCount(1);
    await locator.click();
    const line = await locator.first().textContent();
    expect(line?.substring(0, line.length - 1)).toBe(lines[i]);
  }
}

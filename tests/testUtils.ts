import { expect, Page } from '@playwright/test';

export async function linesToBe(page: Page, lines: string[]): Promise<void> {
  for (let i = 0; i < lines.length; i++) {
    // depending implementation detail: +1 means linegroup's facing meta line
    const groupLocator = page.locator(`[data-selectid^=linegroup-L${i + 1}-]`);
    if ((await groupLocator.count()) !== 0) await groupLocator.click();

    const lineLocator = page.locator(`[data-selectid=line-L${i}]`);
    await expect(lineLocator).toHaveCount(1);
    await lineLocator.click();

    const line = await lineLocator.first().textContent();
    expect(line?.substring(0, line.length - 1)).toBe(lines[i]);
  }

  // depending implementation detail: +1 means linegroup's facing meta line
  const groupLocator = page.locator(`[data-selectid^=linegroup-L${lines.length + 1}-]`);
  await expect(groupLocator).toHaveCount(0);

  const lineLocator = page.locator(`[data-selectid=line-L${lines.length}]`);
  await expect(lineLocator).toHaveCount(0);
}

import { expect, Page } from '@playwright/test';

export async function dragAndDrop(page: Page, srcSelector: string, tgtSelector: string) {
  const srcBoundingBox = await page.locator(srcSelector).boundingBox();
  if (!srcBoundingBox) return;
  const tgtBoundingBox = await page.locator(tgtSelector).boundingBox();
  if (!tgtBoundingBox) return;

  await page.mouse.move(srcBoundingBox.x, srcBoundingBox.y);
  await page.mouse.down();
  await page.mouse.move(tgtBoundingBox.x, tgtBoundingBox.y, { steps: 5 });
  await page.mouse.up();
}

export async function linesToBe(page: Page, lines: string[]): Promise<void> {
  for (let i = 0; i < lines.length; i++) {
    const locator = page.locator(`[data-selectid=line-L${i}]`);
    await expect(locator).toHaveCount(1);
    await locator.click();
    const line = await locator.first().textContent();
    expect(line?.substring(0, line.length - 1)).toBe(lines[i]);
  }

  const locator = page.locator(`[data-selectid=line-L${lines.length}]`);
  await expect(locator).toHaveCount(0);
}

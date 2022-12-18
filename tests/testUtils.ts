import { expect, Page } from '@playwright/test';

export async function mouseSelect(page: Page, fixedSelector: string, freeSelector: string) {
  const fixedBoundingBox = await page.locator(fixedSelector).boundingBox();
  const freeBoundingBox = await page.locator(freeSelector).boundingBox();
  if (!fixedBoundingBox || !freeBoundingBox) return;

  await page.mouse.move(fixedBoundingBox.x, fixedBoundingBox.y + fixedBoundingBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(freeBoundingBox.x, freeBoundingBox.y + freeBoundingBox.height / 2, { steps: 5 });
  await page.mouse.up();
}

export async function mouseMove(page: Page, fixedSelector: string, freeSelector: string) {
  const fixedBoundingBox = await page.locator(fixedSelector).boundingBox();
  const freeBoundingBox = await page.locator(freeSelector).boundingBox();
  if (!fixedBoundingBox || !freeBoundingBox) return;

  await page.mouse.move(fixedBoundingBox.x, fixedBoundingBox.y + fixedBoundingBox.height / 2);
  await page.mouse.move(freeBoundingBox.x, freeBoundingBox.y + freeBoundingBox.height / 2, { steps: 5 });
}

export async function linesToBe(page: Page, lines: string[]): Promise<void> {
  for (let i = 0; i < lines.length; i++) {
    const lineLocator = page.getByTestId(`mock-L${i}`);
    await expect(lineLocator).toHaveCount(1);

    const line = await lineLocator.first().textContent();
    expect(line).toBe(lines[i]);
  }

  const lineLocator = page.getByTestId(`mock-L${lines.length}`);
  await expect(lineLocator).toHaveCount(0);
}

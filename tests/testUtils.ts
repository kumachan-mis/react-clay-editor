import { expect, Page } from '@playwright/test';

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

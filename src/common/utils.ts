export function isMacOS(): boolean {
  return navigator.userAgent.indexOf('Mac OS X') > -1;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function createTestId(testId: string): string | undefined {
  return undefined;
}

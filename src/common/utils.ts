export function isMacOS(): boolean {
  return navigator.userAgent.indexOf('Mac OS X') > -1;
}

export function mergeClassNames(...classNames: (string | undefined)[]): string {
  return classNames.filter((className) => !!className).join(' ');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function createTestId(testId: string): string | undefined {
  return undefined;
}

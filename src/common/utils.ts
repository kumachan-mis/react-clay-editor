export function isMacOS(): boolean {
  return navigator.userAgent.indexOf('Mac OS X') > -1;
}

export function mergeClassNames(...classNames: (string | undefined)[]): string {
  return classNames.filter((className) => !!className).join(' ');
}

export function selectIdProps(selectId: string): { 'data-selectid': string } {
  return { 'data-selectid': selectId };
}

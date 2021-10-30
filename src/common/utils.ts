import { SelectIdProps } from './types';

export function isMacOS(): boolean {
  return navigator.userAgent.indexOf('Mac OS X') > -1;
}

export function mergeClassNames(...classNames: (string | undefined)[]): string {
  return classNames.filter((className) => !!className).join(' ');
}

export function selectIdProps(selectId: string): SelectIdProps {
  return { 'data-selectid': selectId, 'data-testid': process.env.ENVIRONMENT === 'test' ? selectId : undefined };
}

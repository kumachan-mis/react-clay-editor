import { TextLinesConstants } from './constants';

import { getRoot } from '../Editor/utils';

export function getTextCharElementAt(lineIndex: number, charIndex: number, element: HTMLElement): HTMLElement | null {
  let rootElement = getRoot(element);
  if (rootElement == null) rootElement = element;
  return rootElement.querySelector(`span[data-selectid="${TextLinesConstants.char.selectId(lineIndex, charIndex)}"]`);
}

export function mergeClassNames(...classNames: (string | undefined)[]): string {
  return classNames.filter((className) => !!className).join(' ');
}

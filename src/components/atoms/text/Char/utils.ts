import { getRoot } from '../../root/Root/utils';
import { LineConstants } from '../Line';

import { CharConstants } from './index';

export function getCharAt(lineIndex: number, charIndex: number, element: HTMLElement): HTMLElement | null {
  let rootElement = getRoot(element);
  if (!rootElement) rootElement = element;

  const lineSelector = `div[data-selectid="${LineConstants.selectId(lineIndex)}"]`;
  const lineElement = rootElement.querySelector<HTMLElement>(lineSelector);
  if (!lineElement) return null;

  const charSelector = `span[data-selectid="${CharConstants.selectId(charIndex)}"]`;
  const charElement = lineElement.querySelector<HTMLElement>(charSelector);
  if (!charElement) return null;

  return charElement;
}

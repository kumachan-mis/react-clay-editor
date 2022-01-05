import { getRoot } from '../Editor/utils';

import { ComponentConstants } from './components/constants';

export function getTextLineElementAt(lineIndex: number, element: HTMLElement): HTMLElement | null {
  let rootElement = getRoot(element);
  if (!rootElement) rootElement = element;
  return rootElement.querySelector(`div[data-selectid="${ComponentConstants.line.selectId(lineIndex)}"]`);
}

export function getTextCharElementAt(lineIndex: number, charIndex: number, element: HTMLElement): HTMLElement | null {
  let rootElement = getRoot(element);
  if (!rootElement) rootElement = element;
  return rootElement.querySelector(`span[data-selectid="${ComponentConstants.char.selectId(lineIndex, charIndex)}"]`);
}

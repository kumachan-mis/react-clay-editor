import { getRoot } from '../Editor/utils';
import { Node } from '../parser/types';

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

export function cursorOnNode(cursorLineIndex: number | undefined, node: Node): boolean {
  if (cursorLineIndex === undefined) return false;
  if (node.type === 'blockCode' || node.type === 'blockFormula') {
    const [first, last] = node.range;
    return first <= cursorLineIndex && cursorLineIndex <= last;
  }
  return cursorLineIndex === node.lineIndex;
}

import { TextLinesConstants } from './constants';

import { classNameToSelector } from '../common/utils';
import { EditorConstants } from '../Editor/constants';

export function getTextLineElementAt(lineIndex: number, element: HTMLElement): HTMLElement | null {
  const rootSelector = classNameToSelector(EditorConstants.editor.className);
  const lineSelector = classNameToSelector(TextLinesConstants.line.className(lineIndex));
  let rootElement = element.closest(rootSelector);
  if (rootElement == null) rootElement = element;
  return rootElement.querySelector(lineSelector);
}

export function getTextCharElementAt(lineIndex: number, charIndex: number, element: HTMLElement): HTMLElement | null {
  const rootSelector = classNameToSelector(EditorConstants.editor.className);
  const charSelector = classNameToSelector(TextLinesConstants.char.className(lineIndex, charIndex));
  let rootElement = element.closest(rootSelector);
  if (rootElement == null) rootElement = element;
  return rootElement.querySelector(charSelector);
}

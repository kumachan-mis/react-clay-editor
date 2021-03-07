import { TextLinesConstants } from './constants';

import { classNameToSelector } from '../utils';
import { EditorConstants } from '../Editor/constants';

export function getTextLineElementAt(lineIndex: number, element: HTMLElement): HTMLElement | null {
  const rootSelector = classNameToSelector(EditorConstants.editor.className);
  const rootElement = element.closest(rootSelector);
  if (rootElement == null) return null;
  const lineSelector = classNameToSelector(TextLinesConstants.line.className(lineIndex));
  return rootElement.querySelector(lineSelector);
}

export function getTextCharElementAt(
  lineIndex: number,
  charIndex: number,
  element: HTMLElement
): HTMLElement | null {
  const rootSelector = classNameToSelector(EditorConstants.editor.className);
  const rootElement = element.closest(rootSelector);
  if (rootElement == null) return null;
  const charSelector = classNameToSelector(TextLinesConstants.char.className(lineIndex, charIndex));
  return rootElement.querySelector(charSelector);
}

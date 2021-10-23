import { Props, State, TextSelection, TextRange } from './types';

import { getBody } from '../Editor/utils';
import { getTextCharElementAt } from '../TextLines/utils';
import { TextLinesConstants } from '../TextLines/constants';
import { CursorCoordinate } from '../Cursor/types';
import { cursorCoordinateToTextIndex } from '../Cursor/utils';

export function selectionPropsToState(props: Props, element: HTMLElement): State {
  const bodyRect = getBody(element)?.getBoundingClientRect();
  if (!props.textSelection || !bodyRect) {
    return { topDivPosition: undefined, centerDivPosition: undefined, bottomDivPosition: undefined };
  }

  const { start, end } = selectionToRange(props.textSelection);
  const startElement = getTextCharElementAt(start.lineIndex, start.charIndex, element);
  const endElement = getTextCharElementAt(end.lineIndex, end.charIndex, element);
  const startRect = startElement?.getBoundingClientRect();
  const endRect = endElement?.getBoundingClientRect();
  if (!startRect || !endRect) {
    return { topDivPosition: undefined, centerDivPosition: undefined, bottomDivPosition: undefined };
  }

  const startRectCenter = startRect.bottom - (startRect.bottom - startRect.top) / 2;
  const endRectCenter = endRect.bottom - (endRect.bottom - endRect.top) / 2;
  if (
    (startRect.top <= endRectCenter && endRectCenter <= startRect.bottom) ||
    (endRect.top <= startRectCenter && startRectCenter <= endRect.bottom)
  ) {
    const topDivPosition = undefined;
    const centerDivPosition = {
      top: Math.min(startRect.top, endRect.top) - bodyRect.top,
      left: startRect.left - bodyRect.left,
      width: endRect.left - startRect.left,
      height: Math.max(startRect.bottom, endRect.bottom) - Math.min(startRect.top, endRect.top),
    };
    const bottomDivPosition = undefined;
    return { topDivPosition, centerDivPosition, bottomDivPosition };
  } else {
    const topDivPosition = {
      top: startRect.top - bodyRect.top,
      left: startRect.left - bodyRect.left,
      width: bodyRect.right - startRect.left,
      height: startRect.height,
    };
    const centerDivPosition = {
      top: startRect.bottom - bodyRect.top,
      left: 0,
      width: bodyRect.width,
      height: endRect.top - startRect.bottom,
    };
    const bottomDivPosition = {
      top: endRect.top - bodyRect.top,
      left: 0,
      width: endRect.left - bodyRect.left,
      height: endRect.height,
    };
    return { topDivPosition, centerDivPosition, bottomDivPosition };
  }
}

export function getWordSelection(
  text: string,
  cursorCoordinate: CursorCoordinate | undefined
): TextSelection | undefined {
  if (!cursorCoordinate) return undefined;

  const wordRegex = new RegExp(TextLinesConstants.wordRegex, 'g');
  const lines = text.split('\n');
  const currentLine = lines[cursorCoordinate.lineIndex];
  let match: RegExpExecArray | null = null;
  while ((match = wordRegex.exec(currentLine))) {
    if (match === null) break;
    const from = wordRegex.lastIndex - match[0].length;
    const to = wordRegex.lastIndex;
    if (to < cursorCoordinate.charIndex) continue;
    if (from > cursorCoordinate.charIndex) break;
    return {
      fixed: { lineIndex: cursorCoordinate.lineIndex, charIndex: from },
      free: { lineIndex: cursorCoordinate.lineIndex, charIndex: to },
    };
  }
  return undefined;
}

export function getLineSelection(
  text: string,
  cursorCoordinate: CursorCoordinate | undefined
): TextSelection | undefined {
  if (!cursorCoordinate) return undefined;

  const lines = text.split('\n');
  const currentLine = lines[cursorCoordinate.lineIndex];
  return {
    fixed: { lineIndex: cursorCoordinate.lineIndex, charIndex: 0 },
    free: { lineIndex: cursorCoordinate.lineIndex, charIndex: currentLine.length },
  };
}

export function getSelectionText(text: string, textSelection: TextSelection | undefined): string {
  if (!textSelection) return '';
  const { start, end } = selectionToRange(textSelection);
  const startIndex = cursorCoordinateToTextIndex(text, start);
  const endIndex = cursorCoordinateToTextIndex(text, end);
  return text.substring(startIndex, endIndex);
}

export function selectionToRange(textSelection: TextSelection): TextRange {
  const { fixed, free } = textSelection;
  if (fixed.lineIndex < free.lineIndex) return { start: fixed, end: free };
  else if (fixed.lineIndex > free.lineIndex) return { start: free, end: fixed };
  else if (fixed.charIndex <= free.charIndex) return { start: fixed, end: free };
  else return { start: free, end: fixed };
}

import { wordRegex } from '../../../../common/constants';
import { CursorCoordinate } from '../../cursor/Cursor/types';
import { coordinatesAreEqual, cursorCoordinateToTextIndex } from '../../cursor/Cursor/utils';

import { TextSelection, TextRange } from './types';

export function getWordSelection(
  text: string,
  cursorCoordinate: CursorCoordinate | undefined
): TextSelection | undefined {
  if (!cursorCoordinate) return undefined;

  const groupWordRegex = new RegExp(wordRegex, 'g');
  const lines = text.split('\n');
  const currentLine = lines[cursorCoordinate.lineIndex];
  let match: RegExpExecArray | null = null;
  while ((match = groupWordRegex.exec(currentLine))) {
    if (!match) break;
    const from = groupWordRegex.lastIndex - match[0].length;
    const to = groupWordRegex.lastIndex;
    if (to < cursorCoordinate.charIndex) continue;
    if (from > cursorCoordinate.charIndex) break;
    if (from === to) return undefined;

    return { fixed: { ...cursorCoordinate, charIndex: from }, free: { ...cursorCoordinate, charIndex: to } };
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
  if (currentLine.length === 0) return undefined;
  return { fixed: { ...cursorCoordinate, charIndex: 0 }, free: { ...cursorCoordinate, charIndex: currentLine.length } };
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

export function copySelection(textSelection: TextSelection | undefined): TextSelection | undefined {
  if (!textSelection) return undefined;
  return { fixed: { ...textSelection.fixed }, free: { ...textSelection.free } };
}

export function undefinedIfZeroSelection(textSelection: TextSelection | undefined): TextSelection | undefined {
  if (!textSelection) return undefined;
  return !coordinatesAreEqual(textSelection.fixed, textSelection.free) ? textSelection : undefined;
}

import { WORD_REGEX } from '../../../../common/constants';
import { CursorCoordinate } from '../../../../types/cursor/cursorCoordinate';
import { CursorSelection } from '../../../../types/selection/cursorSelection';
import { CursorSelectionRange } from '../../../../types/selection/cursorSelectionRange';
import { coordinatesAreEqual, cursorCoordinateToTextIndex } from '../../cursor/Cursor/utils';

export function getWordSelection(
  text: string,
  cursorCoordinate: CursorCoordinate | undefined
): CursorSelection | undefined {
  if (!cursorCoordinate) return undefined;

  const groupWordRegex = new RegExp(WORD_REGEX, 'g');
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
): CursorSelection | undefined {
  if (!cursorCoordinate) return undefined;

  const lines = text.split('\n');
  const currentLine = lines[cursorCoordinate.lineIndex];
  if (currentLine.length === 0) return undefined;
  return { fixed: { ...cursorCoordinate, charIndex: 0 }, free: { ...cursorCoordinate, charIndex: currentLine.length } };
}

export function getSelectionText(text: string, cursorSelection: CursorSelection | undefined): string {
  if (!cursorSelection) return '';
  const { start, end } = selectionToRange(cursorSelection);
  const startIndex = cursorCoordinateToTextIndex(text, start);
  const endIndex = cursorCoordinateToTextIndex(text, end);
  return text.substring(startIndex, endIndex);
}

export function selectionToRange(cursorSelection: CursorSelection): CursorSelectionRange {
  const { fixed, free } = cursorSelection;
  if (fixed.lineIndex < free.lineIndex) return { start: fixed, end: free };
  else if (fixed.lineIndex > free.lineIndex) return { start: free, end: fixed };
  else if (fixed.charIndex <= free.charIndex) return { start: fixed, end: free };
  else return { start: free, end: fixed };
}

export function copySelection(cursorSelection: CursorSelection | undefined): CursorSelection | undefined {
  if (!cursorSelection) return undefined;
  return { fixed: { ...cursorSelection.fixed }, free: { ...cursorSelection.free } };
}

export function undefinedIfZeroSelection(cursorSelection: CursorSelection | undefined): CursorSelection | undefined {
  if (!cursorSelection) return undefined;
  return !coordinatesAreEqual(cursorSelection.fixed, cursorSelection.free) ? cursorSelection : undefined;
}

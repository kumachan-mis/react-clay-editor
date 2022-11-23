import { CursorCoordinate } from '../../../molecules/cursor/Cursor/types';
import { coordinatesAreEqual } from '../../../molecules/cursor/Cursor/utils';
import { CursorSelection } from '../../../molecules/selection/Selection/types';
import { EditorState } from '../types';

export function updateSelectionAfterCursorMove(
  cursorSelection: CursorSelection | undefined,
  cursorCoordinate: CursorCoordinate | undefined,
  newCursorCoordinate: CursorCoordinate | undefined,
  disabled = false
): CursorSelection | undefined {
  if (disabled || !cursorCoordinate) return undefined;
  const fixed = cursorSelection ? cursorSelection.fixed : cursorCoordinate;
  const free = newCursorCoordinate ? newCursorCoordinate : cursorCoordinate;
  return !coordinatesAreEqual(fixed, free) ? { fixed, free } : undefined;
}

export function resetTextSelection(state: EditorState): EditorState {
  return { ...state, cursorSelection: undefined, cursorScroll: 'none' };
}

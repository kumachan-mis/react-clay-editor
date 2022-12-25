import { coordinatesAreEqual } from 'src/components/molecules/cursor/Cursor/utils';
import { EditorState } from 'src/contexts/EditorStateContext';
import { CursorCoordinate } from 'src/types/cursor/cursorCoordinate';
import { CursorSelection } from 'src/types/selection/cursorSelection';

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

export function resetCursorSelection(state: EditorState): EditorState {
  return { ...state, cursorSelection: undefined, cursorScroll: 'none' };
}

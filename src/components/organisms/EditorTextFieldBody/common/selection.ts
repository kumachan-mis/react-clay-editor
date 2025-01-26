import { EditorState } from '../../../../contexts/EditorStateContext';
import { CursorCoordinate } from '../../../../types/cursor/cursorCoordinate';
import { CursorSelection } from '../../../../types/selection/cursorSelection';
import { coordinatesAreEqual } from '../../../molecules/cursor/Cursor/utils';

export function updateSelectionAfterCursorMove(
  cursorSelection: CursorSelection | undefined,
  cursorCoordinate: CursorCoordinate | undefined,
  newCursorCoordinate: CursorCoordinate | undefined,
  disabled = false,
): CursorSelection | undefined {
  if (disabled || !cursorCoordinate) return undefined;
  const fixed = cursorSelection ? cursorSelection.fixed : cursorCoordinate;
  const free = newCursorCoordinate ? newCursorCoordinate : cursorCoordinate;
  return !coordinatesAreEqual(fixed, free) ? { fixed, free } : undefined;
}

export function resetCursorSelection(state: EditorState): EditorState {
  return { ...state, cursorSelection: undefined, cursorScroll: 'none' };
}

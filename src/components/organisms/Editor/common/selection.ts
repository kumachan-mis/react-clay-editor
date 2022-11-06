import { CursorCoordinate } from '../../../molecules/cursor/Cursor/types';
import { coordinatesAreEqual } from '../../../molecules/cursor/Cursor/utils';
import { TextSelection } from '../../../molecules/selection/Selection/types';
import { State } from '../types';

export function updateSelectionAfterCursorMove(
  textSelection: TextSelection | undefined,
  cursorCoordinate: CursorCoordinate | undefined,
  newCursorCoordinate: CursorCoordinate | undefined,
  disabled = false
): TextSelection | undefined {
  if (disabled || !cursorCoordinate) return undefined;
  const fixed = textSelection ? textSelection.fixed : cursorCoordinate;
  const free = newCursorCoordinate ? newCursorCoordinate : cursorCoordinate;
  return !coordinatesAreEqual(fixed, free) ? { fixed, free } : undefined;
}

export function resetTextSelection(state: State): State {
  return { ...state, textSelection: undefined, selectionMouse: 'deactive' };
}

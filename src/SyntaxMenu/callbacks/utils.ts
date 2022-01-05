import { CursorCoordinate } from '../../Cursor/types';
import { moveCursor } from '../../Cursor/utils';
import { TextSelection } from '../../Selection/types';

export function updateSelectionByMenu(
  newText: string,
  newCursorCoordinate: CursorCoordinate | undefined,
  selectionAmount: number
): TextSelection | undefined {
  if (!newCursorCoordinate) return undefined;

  if (selectionAmount > 0) {
    const fixed = newCursorCoordinate;
    const free = moveCursor(newText, newCursorCoordinate, selectionAmount);
    return { fixed, free };
  } else if (selectionAmount < 0) {
    const fixed = moveCursor(newText, newCursorCoordinate, selectionAmount);
    const free = newCursorCoordinate;
    return { fixed, free };
  }
  return undefined;
}

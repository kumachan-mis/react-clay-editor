import { SelectionRectProps } from '../../../atoms/selection/SelectionRect';
import { CursorCoordinate } from '../../cursor/Cursor/types';

export type CursorSelection = {
  fixed: CursorCoordinate;
  free: CursorCoordinate;
};

export type CursorSelectionRange = {
  start: CursorCoordinate;
  end: CursorCoordinate;
};

export type SelectionProps = {
  cursorSelection: CursorSelection | undefined;
};

export type SelectionState = {
  topRectProps: SelectionRectProps | undefined;
  centerRectProps: SelectionRectProps | undefined;
  bottomRectProps: SelectionRectProps | undefined;
};

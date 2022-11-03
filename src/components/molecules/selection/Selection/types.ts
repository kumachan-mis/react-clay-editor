import { SelectionRectProps } from '../../../atoms/selection/SelectionRect';
import { CursorCoordinate } from '../../cursor/Cursor/types';

export interface TextSelection {
  fixed: CursorCoordinate;
  free: CursorCoordinate;
}

export interface TextRange {
  start: CursorCoordinate;
  end: CursorCoordinate;
}

export interface Props {
  textSelection: TextSelection | undefined;
}

export interface State {
  topRectProps: SelectionRectProps | undefined;
  centerRectProps: SelectionRectProps | undefined;
  bottomRectProps: SelectionRectProps | undefined;
}

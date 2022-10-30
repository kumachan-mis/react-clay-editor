import { SelectionRectProps } from '../../atoms/SelectionRect';
import { CursorCoordinate } from '../Cursor/types';

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

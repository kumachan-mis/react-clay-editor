import { CursorCoordinate } from '../Cursor/types';
import { SelectionRectProps } from '../components/atoms/SelectionRect';

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

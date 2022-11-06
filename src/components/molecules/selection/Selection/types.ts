import { SelectionRectProps } from '../../../atoms/selection/SelectionRect';
import { CursorCoordinate } from '../../cursor/Cursor/types';

export type TextSelection = {
  fixed: CursorCoordinate;
  free: CursorCoordinate;
};

export type TextRange = {
  start: CursorCoordinate;
  end: CursorCoordinate;
};

export type Props = {
  textSelection: TextSelection | undefined;
};

export type State = {
  topRectProps: SelectionRectProps | undefined;
  centerRectProps: SelectionRectProps | undefined;
  bottomRectProps: SelectionRectProps | undefined;
};

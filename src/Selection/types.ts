import { CursorCoordinate } from '../Cursor/types';

export interface TextSelection {
  fixed: CursorCoordinate;
  free: CursorCoordinate;
}

export interface TextRange {
  start: CursorCoordinate;
  end: CursorCoordinate;
}

export const enum SelectionWithMouse {
  Inactive,
  Started,
  Active,
}

export interface Props {
  textSelection: TextSelection | undefined;
}

export interface Position {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface State {
  topDivPosition: Position | undefined;
  centerDivPosition: Position | undefined;
  bottomDivPosition: Position | undefined;
}

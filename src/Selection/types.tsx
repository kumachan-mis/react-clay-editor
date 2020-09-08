import { CursorCoordinate } from "../Cursor/types";

export interface TextSelection {
  fixed: CursorCoordinate;
  free: CursorCoordinate;
}

export interface Props {
  textSelection: TextSelection | undefined;
}

export interface DivPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface State {
  topDivPosition: DivPosition | undefined;
  centerDivPosition: DivPosition | undefined;
  bottomDivPosition: DivPosition | undefined;
}

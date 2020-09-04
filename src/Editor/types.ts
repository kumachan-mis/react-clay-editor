import { CursorCoordinate } from "../Cursor/types";
import { Selection } from "../Selection/types";
import { TextStyle } from "../TextLines/types";

export const enum SelectionWithMouse {
  Inactive,
  Started,
  Active,
}

export interface Props {
  text: string;
  onChangeText: (text: string) => void;
  textStyle?: TextStyle;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export interface State {
  cursorCoordinate: CursorCoordinate | undefined;
  selectionWithMouse: SelectionWithMouse;
  isComposing: boolean;
  textSelection: Selection | undefined;
}

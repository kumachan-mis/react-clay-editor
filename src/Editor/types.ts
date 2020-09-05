import { CursorCoordinate } from "../Cursor/types";
import { Selection } from "../Selection/types";
import { DecorationSetting as Decoration } from "../TextLines/types";

export const enum SelectionWithMouse {
  Inactive,
  Started,
  Active,
}

export interface Props {
  text: string;
  onChangeText: (text: string) => void;
  decoration?: Decoration;
  bracketLinkProps?: (linkName: string) => React.AnchorHTMLAttributes<HTMLAnchorElement>;
  bracketLinkDisabled?: boolean;
  hashTagProps?: (hashTagName: string) => React.AnchorHTMLAttributes<HTMLAnchorElement>;
  hashTagDisabled?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export interface State {
  cursorCoordinate: CursorCoordinate | undefined;
  selectionWithMouse: SelectionWithMouse;
  isComposing: boolean;
  textSelection: Selection | undefined;
}

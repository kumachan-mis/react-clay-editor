import { CursorCoordinate } from "../Cursor/types";
import { TextSelection } from "../Selection/types";
import { DecorationSetting as Decoration } from "../TextLines/types";

export { Decoration };

export interface TaggedLink {
  linkNameRegex?: RegExp;
  props?: (linkName: string) => React.AnchorHTMLAttributes<HTMLAnchorElement>;
  tagHidden?: boolean;
}

export interface Props {
  text: string;
  onChangeText: (text: string) => void;
  decoration?: Decoration;
  bracketLinkProps?: (linkName: string) => React.AnchorHTMLAttributes<HTMLAnchorElement>;
  bracketLinkDisabled?: boolean;
  hashTagProps?: (hashTagName: string) => React.AnchorHTMLAttributes<HTMLAnchorElement>;
  hashTagDisabled?: boolean;
  taggedLinkMap?: { [tagName: string]: TaggedLink };
  disabled?: boolean;
  style?: React.CSSProperties;
}

export interface State {
  cursorCoordinate: CursorCoordinate | undefined;
  textAreaValue: string;
  isComposing: boolean;
  textSelection: TextSelection | undefined;
}

export const enum SelectionWithMouse {
  Inactive,
  Started,
  Active,
}

export type EditAction =
  | {
      actionType: "add";
      textIndex: number;
      text: string;
    }
  | {
      actionType: "delete";
      textIndex: number;
      text: string;
    };

export interface OptionState {
  selectionWithMouse: SelectionWithMouse;
  historyHead: number | undefined;
  editActionHistory: EditAction[];
}

export type ShortcutCommand = "selectAll" | "undo" | "redo";

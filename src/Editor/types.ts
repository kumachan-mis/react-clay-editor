import { CursorCoordinate, SuggestionType } from "../Cursor/types";
import { TextSelection, SelectionWithMouse } from "../Selection/types";
import { DecorationSetting as Decoration } from "../TextLines/types";

export { Decoration };

export interface BracketLinkProps {
  anchorProps?: (hashTagName: string) => React.AnchorHTMLAttributes<HTMLAnchorElement>;
  suggestions?: string[];
  disabled?: boolean;
}

export interface HashTagProps {
  anchorProps?: (hashTagName: string) => React.AnchorHTMLAttributes<HTMLAnchorElement>;
  suggestions?: string[];
  disabled?: boolean;
}

export interface TaggedLinkProps {
  linkNameRegex?: RegExp;
  anchorProps?: (linkName: string) => React.AnchorHTMLAttributes<HTMLAnchorElement>;
  suggestions?: string[];
  tagHidden?: boolean;
}

export interface Props {
  text: string;
  onChangeText: (text: string) => void;
  decoration?: Decoration;
  bracketLinkProps?: BracketLinkProps;
  hashTagProps?: HashTagProps;
  taggedLinkPropsMap?: { [tagName: string]: TaggedLinkProps };
  disabled?: boolean;
  style?: React.CSSProperties;
}

export interface EditAction {
  actionType: "insert" | "delete";
  coordinate: CursorCoordinate;
  text: string;
}

export interface State {
  cursorCoordinate: CursorCoordinate | undefined;
  textAreaValue: string;
  isComposing: boolean;
  suggestionType: SuggestionType;
  suggestions: string[];
  suggectionIndex: number;
  textSelection: TextSelection | undefined;
  selectionWithMouse: SelectionWithMouse;
  historyHead: number;
  editActionHistory: EditAction[];
}

export type ShortcutCommand = "selectAll" | "undo" | "redo";

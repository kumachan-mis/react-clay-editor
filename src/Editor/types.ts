import { CursorCoordinate, SuggestionType, SuggestionListDecoration } from "../Cursor/types";
import { TextSelection, SelectionWithMouse } from "../Selection/types";
import { TextDecoration } from "../TextLines/types";

export interface Decoration {
  text?: TextDecoration;
  suggestionList?: SuggestionListDecoration;
}

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
  textSelection: TextSelection | undefined;
  selectionWithMouse: SelectionWithMouse;
  historyHead: number;
  editActionHistory: EditAction[];
  suggestionType: SuggestionType;
  suggestions: string[];
  suggectionIndex: number;
}

export type ShortcutCommand = "selectAll" | "undo" | "redo";

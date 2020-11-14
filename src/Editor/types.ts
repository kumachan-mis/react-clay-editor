import { CursorCoordinate, SuggestionType, SuggestionListDecoration } from "../Cursor/types";
import { TextSelection, SelectionWithMouse } from "../Selection/types";
import { TextDecoration } from "../TextLines/types";

export interface Decoration {
  text?: TextDecoration;
  suggestionList?: SuggestionListDecoration;
}

export interface BracketLinkProps {
  anchorProps?: (
    linkName: string
  ) => React.ComponentProps<"a"> & { overriddenStyleOnHover?: React.CSSProperties };
  suggestions?: string[];
  initialSuggestionIndex?: number;
  disabled?: boolean;
}

export interface HashTagProps {
  anchorProps?: (
    hashTagName: string
  ) => React.ComponentProps<"a"> & { overriddenStyleOnHover?: React.CSSProperties };
  suggestions?: string[];
  initialSuggestionIndex?: number;
  disabled?: boolean;
}

export interface TaggedLinkProps {
  linkNameRegex?: RegExp;
  anchorProps?: (
    linkName: string
  ) => React.ComponentProps<"a"> & { overriddenStyleOnHover?: React.CSSProperties };
  suggestions?: string[];
  initialSuggestionIndex?: number;
  tagHidden?: boolean;
}

export interface CodeProps {
  codeProps?: (code: string) => React.ComponentProps<"code">;
  disabled?: boolean;
}

export interface FormulaProps {
  disabled?: boolean;
}

export interface Props {
  text: string;
  onChangeText: (text: string) => void;
  decoration?: Decoration;
  bracketLinkProps?: BracketLinkProps;
  hashTagProps?: HashTagProps;
  taggedLinkPropsMap?: { [tagName: string]: TaggedLinkProps };
  codeProps?: CodeProps;
  formulaProps?: FormulaProps;
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
  suggestionIndex: number;
}

export type ShortcutCommand = "selectAll" | "undo" | "redo";

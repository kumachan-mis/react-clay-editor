import { CursorCoordinate } from '../Cursor/types';
import { TextSelection } from '../Selection/types';
import { DecorationSettings } from '../TextLines/types';

export interface DecorationProps {
  settings?: DecorationSettings;
  suggestions?: string[];
  initialSuggestionIndex?: number;
}

export interface BracketLinkProps {
  anchorProps?: (linkName: string) => React.ComponentProps<'a'> & { overriddenStyleOnHover?: React.CSSProperties };
  suggestions?: string[];
  initialSuggestionIndex?: number;
  disabled?: boolean;
}

export interface HashTagProps {
  anchorProps?: (hashTagName: string) => React.ComponentProps<'a'> & { overriddenStyleOnHover?: React.CSSProperties };
  suggestions?: string[];
  initialSuggestionIndex?: number;
  disabled?: boolean;
}

export interface TaggedLinkProps {
  linkNameRegex?: RegExp;
  anchorProps?: (linkName: string) => React.ComponentProps<'a'> & { overriddenStyleOnHover?: React.CSSProperties };
  suggestions?: string[];
  initialSuggestionIndex?: number;
  tagHidden?: boolean;
}

export interface CodeProps {
  codeProps?: (code: string) => React.ComponentProps<'code'>;
  disabled?: boolean;
}

export interface FormulaProps {
  spanProps?: (formula: string) => React.ComponentProps<'span'>;
  disabled?: boolean;
}

export interface Props {
  text: string;
  onChangeText: (text: string) => void;
  syntax?: 'bracket' | 'markdown';
  decorationProps?: DecorationProps;
  bracketLinkProps?: BracketLinkProps;
  hashTagProps?: HashTagProps;
  taggedLinkPropsMap?: { [tagName: string]: TaggedLinkProps };
  codeProps?: CodeProps;
  formulaProps?: FormulaProps;
  readonly?: boolean;
  style?: React.CSSProperties;
}

export interface EditAction {
  actionType: 'insert' | 'delete';
  coordinate: CursorCoordinate;
  text: string;
}

export interface State {
  cursorCoordinate: CursorCoordinate | undefined;
  textAreaValue: string;
  isComposing: boolean;
  textSelection: TextSelection | undefined;
  selectionWithMouse: 'inactive' | 'fired' | 'active';
  historyHead: number;
  editActionHistory: EditAction[];
  suggestionType: 'text' | 'bracketLink' | 'hashTag' | 'taggedLink' | 'none';
  suggestions: string[];
  suggestionIndex: number;
}

export type ShortcutCommand =
  | 'forwardDelete'
  | 'backwardDelete'
  | 'selectAll'
  | 'undo'
  | 'redo'
  | 'moveUp'
  | 'moveDown'
  | 'moveLeft'
  | 'moveRight'
  | 'moveWordTop'
  | 'moveWordBottom'
  | 'moveLineTop'
  | 'moveLineBottom'
  | 'moveTextTop'
  | 'moveTextBottom';

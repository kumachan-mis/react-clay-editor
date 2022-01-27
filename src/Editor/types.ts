import { CursorCoordinate } from '../Cursor/types';
import { TextSelection } from '../Selection/types';
import {
  TextProps,
  BracketLinkProps,
  HashtagProps,
  TaggedLinkPropsMap,
  CodeProps,
  FormulaProps,
} from '../common/types';

export interface Props {
  text: string;
  onChangeText: (text: string) => void;
  syntax?: 'bracket' | 'markdown';
  textProps?: TextProps;
  bracketLinkProps?: BracketLinkProps;
  hashtagProps?: HashtagProps;
  taggedLinkPropsMap?: TaggedLinkPropsMap;
  codeProps?: CodeProps;
  formulaProps?: FormulaProps;
  readonly?: boolean;
  hideSyntaxMenu?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export type EditAction = SubstituteAction | InsertAction | DeleteAction;

export interface SubstituteAction {
  actionType: 'substitute';
  coordinate: CursorCoordinate;
  deletedText: string;
  insertedText: string;
}

export interface InsertAction {
  actionType: 'insert';
  coordinate: CursorCoordinate;
  text: string;
}

export interface DeleteAction {
  actionType: 'delete';
  coordinate: CursorCoordinate;
  text: string;
}

export interface State {
  cursorCoordinate: CursorCoordinate | undefined;
  textAreaValue: string;
  isComposing: boolean;
  textSelection: TextSelection | undefined;
  selectionMouse: 'deactive' | 'fired' | 'active-in' | 'active-up' | 'active-down';
  historyHead: number;
  editActionHistory: EditAction[];
  suggestionType: 'text' | 'bracketLink' | 'hashtag' | 'taggedLink' | 'none';
  suggestions: string[];
  suggestionIndex: number;
  suggestionStart: number;
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

import { CursorCoordinate } from '../Cursor/types';
import { TextSelection } from '../Selection/types';
import {
  TextVisual,
  BracketLinkVisual,
  HashtagVisual,
  TaggedLinkVisual,
  CodeVisual,
  FormulaVisual,
  TextLabels,
  BracketLabels,
  HashtagLabels,
  TaggedLinkLabels,
  CodeLabels,
  FormulaLabels,
  BracketLinkParsing,
  HashtagParsing,
  TaggedLinkParsing,
  CodeParsing,
  FormulaParsing,
  Suggestion,
} from '../common/types';

export interface Props {
  text: string;
  onChangeText: (text: string) => void;
  syntax?: 'bracket' | 'markdown';
  textProps?: TextProps;
  bracketLinkProps?: BracketLinkProps;
  hashtagProps?: HashtagProps;
  taggedLinkPropsMap?: { [tagName: string]: TaggedLinkProps };
  codeProps?: CodeProps;
  formulaProps?: FormulaProps;
  readonly?: boolean;
  hideMenu?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export type TextProps = TextVisual & TextLabels & Suggestion;

export type BracketLinkProps = BracketLinkVisual & BracketLabels & BracketLinkParsing & Suggestion;

export type HashtagProps = HashtagVisual & HashtagLabels & HashtagParsing & Suggestion;

export type TaggedLinkProps = TaggedLinkVisual & TaggedLinkLabels & TaggedLinkParsing & Suggestion;

export type CodeProps = CodeVisual & CodeLabels & CodeParsing;

export type FormulaProps = FormulaVisual & FormulaLabels & FormulaParsing;

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

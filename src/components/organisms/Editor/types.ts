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
} from '../../../common/types';
import { CursorCoordinate } from '../../molecules/cursor/Cursor/types';
import { TextSelection } from '../../molecules/selection/Selection/types';

export type Props = {
  text: string;
  onChangeText: (text: string) => void;
  syntax?: 'bracket' | 'markdown';
  textProps?: TextProps;
  bracketLinkProps?: BracketLinkProps;
  hashtagProps?: HashtagProps;
  taggedLinkPropsMap?: { [tagName: string]: TaggedLinkProps };
  codeProps?: CodeProps;
  formulaProps?: FormulaProps;
  hideMenu?: boolean;
  className?: string;
};

export type TextProps = TextVisual & TextLabels & Suggestion;

export type BracketLinkProps = BracketLinkVisual & BracketLabels & BracketLinkParsing & Suggestion;

export type HashtagProps = HashtagVisual & HashtagLabels & HashtagParsing & Suggestion;

export type TaggedLinkProps = TaggedLinkVisual & TaggedLinkLabels & TaggedLinkParsing & Suggestion;

export type CodeProps = CodeVisual & CodeLabels & CodeParsing;

export type FormulaProps = FormulaVisual & FormulaLabels & FormulaParsing;

export type State = {
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
};

export type EditAction = ReplaceAction | InsertAction | DeleteAction;

export type ReplaceAction = {
  actionType: 'replace';
  coordinate: CursorCoordinate;
  deletedText: string;
  insertedText: string;
};

export type InsertAction = {
  actionType: 'insert';
  coordinate: CursorCoordinate;
  text: string;
};

export type DeleteAction = {
  actionType: 'delete';
  coordinate: CursorCoordinate;
  text: string;
};

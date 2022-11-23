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
import { CursorSelection } from '../../molecules/selection/Selection/types';

export type EditorProps = {
  text: string;
  onChangeText: (text: string) => void;
  syntax?: 'bracket' | 'markdown';
  textProps?: TextProps;
  bracketLinkProps?: BracketLinkProps;
  hashtagProps?: HashtagProps;
  taggedLinkPropsMap?: { [tagName: string]: TaggedLinkProps };
  codeProps?: CodeProps;
  formulaProps?: FormulaProps;
  hideSyntaxMenu?: boolean;
  className?: string;
};

export type TextProps = TextVisual & TextLabels & Suggestion;

export type BracketLinkProps = BracketLinkVisual & BracketLabels & BracketLinkParsing & Suggestion;

export type HashtagProps = HashtagVisual & HashtagLabels & HashtagParsing & Suggestion;

export type TaggedLinkProps = TaggedLinkVisual & TaggedLinkLabels & TaggedLinkParsing & Suggestion;

export type CodeProps = CodeVisual & CodeLabels & CodeParsing;

export type FormulaProps = FormulaVisual & FormulaLabels & FormulaParsing;

export type EditorState = {
  cursorCoordinate: CursorCoordinate | undefined;
  cursorSelection: CursorSelection | undefined;
  cursorScroll: 'none' | 'fired' | 'pause' | 'up' | 'down';
  textAreaValue: string;
  textComposing: boolean;
  editActionHistoryHead: number;
  editActionHistory: EditAction[];
  suggestionType: 'none' | 'text' | 'bracketLink' | 'hashtag' | 'taggedLink';
  suggestions: string[];
  suggestionIndex: number;
  suggestionStart: number;
};

export type EditAction =
  | {
      actionType: 'replace';
      coordinate: CursorCoordinate;
      deletedText: string;
      insertedText: string;
    }
  | {
      actionType: 'insert';
      coordinate: CursorCoordinate;
      text: string;
    }
  | {
      actionType: 'delete';
      coordinate: CursorCoordinate;
      text: string;
    };

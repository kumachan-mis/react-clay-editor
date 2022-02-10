import { State } from '../Editor/types';
import {
  TextLabels,
  ItemizationLabels,
  BracketLabels,
  HashtagLabels,
  TaggedLinkLabels,
  CodeLabels,
  FormulaLabels,
  QuotationLabels,
  BracketLinkParsing,
  HashtagParsing,
  CodeParsing,
  FormulaParsing,
  Suggestion,
} from '../common/types';
import { BlockNode, LineNode } from '../parser/types';

export interface SyntaxMenuProps {
  text: string;
  nodes: (LineNode | BlockNode)[];
  state: State;
  setTextAndState: (text: string, state: State) => void;
  syntax?: 'bracket' | 'markdown';
  section?: SectionMenuProps;
  itemization?: ItemizationMenuProps;
  bracket?: BracketMenuProps;
  hashtag?: HashtagMenuProps;
  taggedLink?: { [tagName: string]: TaggedLinkMenuProps };
  code?: CodeMenuProps;
  formula?: FormulaMenuProps;
  quotation?: QuotationMenuProps;
  containerProps?: Omit<React.ComponentProps<'div'>, 'ref'>;
}

export type SectionMenuProps = TextLabels;

export type ItemizationMenuProps = ItemizationLabels;

export type BracketMenuProps = BracketLabels & BracketLinkParsing & Suggestion;

export type HashtagMenuProps = HashtagLabels & HashtagParsing & Suggestion;

export type TaggedLinkMenuProps = TaggedLinkLabels & Suggestion;

export type CodeMenuProps = CodeLabels & CodeParsing;

export type FormulaMenuProps = FormulaLabels & FormulaParsing;

export type QuotationMenuProps = QuotationLabels;

export interface ContentMenuProps {
  lineNodes: LineNode[];
  contentPosition: ContentPosition | undefined;
}

export interface LineMenuProps {
  lineNodes: LineNode[];
}

export interface BlockMenuProps {
  nodes: (LineNode | BlockNode)[];
  blockPosition: BlockPosition | undefined;
}

export interface CommonMenuProps {
  text: string;
  state: State;
  setTextAndState: (text: string, state: State) => void;
  syntax?: 'bracket' | 'markdown';
}

export type ContentPosition =
  | ContentPositionEmpty
  | ContentPositionLeftEnd
  | ContentPositionRightEnd
  | ContentPositionBetween
  | ContentPositionInner
  | ContentPositionNested;

export type ContentPositionEndPoint =
  | ContentPositionEmpty
  | ContentPositionLeftEnd
  | ContentPositionRightEnd
  | ContentPositionBetween;

export interface ContentPositionEmpty {
  type: 'empty';
  lineIndex: number;
}

export interface ContentPositionLeftEnd {
  type: 'leftend';
  lineIndex: number;
  contentIndexes: [number];
}

export interface ContentPositionRightEnd {
  type: 'rightend';
  lineIndex: number;
  contentIndexes: [number];
}

export interface ContentPositionBetween {
  type: 'between';
  lineIndex: number;
  contentIndexes: [number, number];
}

export interface ContentPositionInner {
  type: 'inner';
  lineIndex: number;
  contentIndexes: [number];
}

export interface ContentPositionNested {
  type: 'nested';
  lineIndex: number;
  contentIndexes: [number];
  childPosition: Exclude<ContentPosition, ContentPositionEmpty | ContentPositionNested>;
}

export interface BlockPosition {
  blockIndex: number;
}

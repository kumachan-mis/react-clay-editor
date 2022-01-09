import { State } from '../Editor/types';
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
  taggedLink?: TaggedLinkMenuPropsMap;
  code?: CodeMenuProps;
  formula?: FormulaMenuProps;
  quotation?: QuotationMenuProps;
  containerProps?: Omit<React.ComponentProps<'div'>, 'ref'>;
}

export interface SectionMenuProps {
  normalLabel?: string;
  largerLabel?: string;
  largestLabel?: string;
  disabled?: boolean;
}

export interface ItemizationMenuProps {
  indentLabel?: string;
  outdentLabel?: string;
  disabled?: boolean;
}

export interface BoldMenuProps {
  disabled?: boolean;
}

export interface ItalicMenuProps {
  disabled?: boolean;
}

export interface UnderlineMenuProps {
  disabled?: boolean;
}

export interface BracketMenuProps {
  suggestions?: string[];
  initialSuggestionIndex?: number;
  disabled?: boolean;
}

export interface HashtagMenuProps {
  suggestions?: string[];
  initialSuggestionIndex?: number;
  disabled?: boolean;
}

export interface TaggedLinkMenuProps {
  label?: string;
  suggestions?: string[];
  initialSuggestionIndex?: number;
  disabled?: boolean;
}

export interface TaggedLinkMenuPropsMap {
  tags?: { [tagName: string]: TaggedLinkMenuProps };
  disabled?: boolean;
}

export interface CodeMenuProps {
  inlineLabel?: string;
  blockLabel?: string;
  disabled?: boolean;
}

export interface FormulaMenuProps {
  inlineLabel?: string;
  displayLabel?: string;
  blockLabel?: string;
  disabled?: boolean;
}

export interface QuotationMenuProps {
  indentLabel?: string;
  outdentLabel?: string;
  disabled?: boolean;
}

export interface MenuCommonProps {
  text: string;
  state: State;
  nodes: LineNode[];
  contentPosition: ContentPosition | undefined;
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

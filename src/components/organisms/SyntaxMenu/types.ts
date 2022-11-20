import {
  BracketLabels,
  BracketLinkParsing,
  CodeLabels,
  CodeParsing,
  FormulaLabels,
  FormulaParsing,
  HashtagLabels,
  HashtagParsing,
  ItemizationLabels,
  QuotationLabels,
  Suggestion,
  TaggedLinkLabels,
  TextLabels,
} from '../../../common/types';
import { BlockNode } from '../../../parser/block/types';
import { LineNode } from '../../../parser/line/types';
import { MenuListProps } from '../../atoms/menu/MenuList';
import { State } from '../Editor/types';

export type SyntaxMenuProps = {
  text: string;
  nodes: (LineNode | BlockNode)[];
  state: State;
  onChangeText: (text: string) => void;
  setState: (state: State) => void;
  syntax?: 'bracket' | 'markdown';
  sectionProps?: SectionProps;
  itemizationProps?: ItemizationProps;
  bracketProps?: BracketProps;
  hashtagProps?: HashtagProps;
  taggedLinkPropsMap?: { [tagName: string]: TaggedLinkProps };
  codeProps?: CodeProps;
  formulaProps?: FormulaProps;
  quotationProps?: QuotationProps;
  listProps?: MenuListProps;
};

export type SectionProps = TextLabels;

export type ItemizationProps = ItemizationLabels;

export type BracketProps = BracketLabels & BracketLinkParsing & Suggestion;

export type HashtagProps = HashtagLabels & HashtagParsing & Suggestion;

export type TaggedLinkProps = TaggedLinkLabels & Suggestion;

export type CodeProps = CodeLabels & CodeParsing;

export type FormulaProps = FormulaLabels & FormulaParsing;

export type QuotationProps = QuotationLabels;

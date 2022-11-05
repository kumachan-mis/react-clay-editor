import { Suggestion } from '@testing-library/dom';

import { State } from '../../../Editor/types';
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
  TaggedLinkLabels,
  TextLabels,
} from '../../../common/types';
import { BlockNode, LineNode } from '../../../parser/types';
import { MenuListProps } from '../../atoms/menu/MenuList';

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
  listProps?: MenuListProps;
}

export type SectionMenuProps = TextLabels;

export type ItemizationMenuProps = ItemizationLabels;

export type BracketMenuProps = BracketLabels & BracketLinkParsing & Suggestion;

export type HashtagMenuProps = HashtagLabels & HashtagParsing & Suggestion;

export type TaggedLinkMenuProps = TaggedLinkLabels & Suggestion;

export type CodeMenuProps = CodeLabels & CodeParsing;

export type FormulaMenuProps = FormulaLabels & FormulaParsing;

export type QuotationMenuProps = QuotationLabels;

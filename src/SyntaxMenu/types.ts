import { State } from '../Editor/types';

export interface SyntaxMenuProps {
  text: string;
  state: State;
  setTextAndState: ([text, state]: [string, State]) => void;
  syntax?: 'bracket' | 'markdown';
  section?: SectionMenuProps;
  itemization?: ItemizationMenuProps;
  bracket?: BracketMenuProps;
  hashtag?: HashtagMenuProps;
  taggedLink?: TaggedLinkMenuPropsMap;
  code?: CodeMenuProps;
  formula?: FormulaMenuProps;
  quotation?: QuotationMenuProps;
  containerProps?: React.ComponentProps<'div'>;
}

export interface SectionMenuProps {
  normalLabel?: string;
  largerLabel?: string;
  largestLabel?: string;
}

export interface ItemizationMenuProps {
  indentLabel?: string;
  outdentLabel?: string;
}

export interface BracketMenuProps {
  suggestions?: string[];
  initialSuggestionIndex?: number;
}

export interface HashtagMenuProps {
  suggestions?: string[];
  initialSuggestionIndex?: number;
}

export interface TaggedLinkMenuProps {
  label?: string;
  suggestions?: string[];
  initialSuggestionIndex?: number;
}

export interface TaggedLinkMenuPropsMap {
  tags?: { [tagName: string]: TaggedLinkMenuProps };
}

export interface CodeMenuProps {
  inlineLabel?: string;
  blockLabel?: string;
}

export interface FormulaMenuProps {
  inlineLabel?: string;
  displayLabel?: string;
  blockLabel?: string;
}

export interface QuotationMenuProps {
  indentLabel?: string;
  outdentLabel?: string;
}

export interface MenuCommonProps {
  text: string;
  state: State;
  setTextAndState: ([text, state]: [string, State]) => void;
  syntax?: 'bracket' | 'markdown';
  disabled?: boolean;
}

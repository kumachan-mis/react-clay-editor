import { State } from '../Editor/types';

export interface SyntaxMenuProps {
  section: SectionMenuProps;
  bracket: BracketMenuProps;
  hashtag: HashtagMenuProps;
  taggedLink: TaggedLinkMenuPropsMap;
  code: CodeMenuProps;
  formula: FormulaMenuProps;
}

export interface SectionMenuProps {
  normalLabel?: string;
  largerLabel?: string;
  largestLabel?: string;
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
  tags: { [tagName: string]: TaggedLinkMenuProps };
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

export interface MenuCommonProps {
  editorState: [string, State];
  setEditorState: (editorState: [string, State]) => void;
  disabled?: boolean;
}

export interface TextProps {
  suggestions?: string[];
  initialSuggestionIndex?: number;
  normalLabel?: string;
  largerLabel?: string;
  largestLabel?: string;
}

export interface BracketLinkProps {
  anchorProps?: (linkName: string) => React.ComponentProps<'a'>;
  suggestions?: string[];
  initialSuggestionIndex?: number;
  disabled?: boolean;
}

export interface HashtagProps {
  anchorProps?: (hashtagName: string) => React.ComponentProps<'a'>;
  suggestions?: string[];
  initialSuggestionIndex?: number;
  disabled?: boolean;
}

export interface TaggedLinkProps {
  linkNameRegex?: RegExp;
  anchorProps?: (linkName: string) => React.ComponentProps<'a'>;
  suggestions?: string[];
  initialSuggestionIndex?: number;
  tagHidden?: boolean;
}
export type TaggedLinkPropsMap = { [tagName: string]: TaggedLinkProps };

export interface CodeProps {
  codeProps?: (code: string) => React.ComponentProps<'code'>;
  inlineLabel?: string;
  blockLabel?: string;
  disabled?: boolean;
}

export interface FormulaProps {
  spanProps?: (formula: string) => React.ComponentProps<'span'>;
  inlineLabel?: string;
  displayLabel?: string;
  blockLabel?: string;
  disabled?: boolean;
}

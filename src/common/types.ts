import React from 'react';

/**
 * Visual Props
 */

export interface TextVisual {
  colors?: TextColor[];
}

export interface BracketLinkVisual {
  anchorProps?: (linkName: string) => React.ComponentProps<'a'>;
}

export interface HashtagVisual {
  anchorProps?: (hashtagName: string) => React.ComponentProps<'a'>;
}

export interface TaggedLinkVisual {
  anchorProps?: (linkName: string) => React.ComponentProps<'a'>;
  tagHidden?: boolean;
}

export interface CodeVisual {
  codeProps?: (code: string) => React.ComponentProps<'code'>;
}

export interface FormulaVisual {
  spanProps?: (formula: string) => React.ComponentProps<'span'>;
}

/**
 * Label Props
 */

export interface TextLabels {
  normalLabel?: string;
  largerLabel?: string;
  largestLabel?: string;
}

export interface ItemizationLabels {
  indentLabel?: string;
  outdentLabel?: string;
}

export interface BracketLabels {
  label?: string;
}

export interface HashtagLabels {
  label?: string;
}

export interface TaggedLinkLabels {
  label?: string;
}

export interface CodeLabels {
  inlineLabel?: string;
  blockLabel?: string;
}

export interface FormulaLabels {
  inlineLabel?: string;
  displayLabel?: string;
  blockLabel?: string;
}

export interface QuotationLabels {
  indentLabel?: string;
  outdentLabel?: string;
}

/**
 * Parsing Props
 */

export interface BracketLinkParsing {
  disabled?: boolean;
}

export interface HashtagParsing {
  disabled?: boolean;
}

export interface TaggedLinkParsing {
  linkNameRegex?: RegExp;
}

export interface CodeParsing {
  disabled?: boolean;
}

export interface FormulaParsing {
  disabled?: boolean;
}

/**
 * Misc
 */

export interface TextColor {
  backgroundColor?: string;
  color?: string;
  lineRange: [number, number];
}

export interface Suggestion {
  suggestions?: string[];
  initialSuggestionIndex?: number;
}

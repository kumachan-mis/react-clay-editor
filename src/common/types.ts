import React from 'react';

/**
 * Visual Props
 */

export interface TextVisual {
  header?: string;
  headerSize?: 'normal' | 'larger' | 'largest';
  lineProps?: (lineIndex: number) => React.ComponentProps<'div'> | undefined;
}

export interface BracketLinkVisual {
  anchorProps?: (linkName: string, clickable: boolean) => React.ComponentProps<'a'> | undefined;
}

export interface HashtagVisual {
  anchorProps?: (hashtagName: string, clickable: boolean) => React.ComponentProps<'a'> | undefined;
}

export interface TaggedLinkVisual {
  anchorProps?: (linkName: string, clickable: boolean) => React.ComponentProps<'a'> | undefined;
  tagHidden?: boolean;
}

export interface CodeVisual {
  codeProps?: (code: string) => React.ComponentProps<'code'> | undefined;
}

export interface FormulaVisual {
  codeProps?: (formula: string) => React.ComponentProps<'code'> | undefined;
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

export interface Suggestion {
  suggestions?: string[];
  initialSuggestionIndex?: number;
}

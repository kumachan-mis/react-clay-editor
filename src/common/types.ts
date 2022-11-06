import React from 'react';

/**
 * Visual Props
 */

export type TextVisual = {
  header?: string;
  headerSize?: 'normal' | 'larger' | 'largest';
  lineProps?: (lineIndex: number) => React.PropsWithoutRef<React.ComponentProps<'div'>>;
};

export type BracketLinkVisual = {
  anchorProps?: (linkName: string, clickable: boolean) => React.PropsWithoutRef<React.ComponentProps<'a'>>;
};

export type HashtagVisual = {
  anchorProps?: (hashtagName: string, clickable: boolean) => React.PropsWithoutRef<React.ComponentProps<'a'>>;
};

export type TaggedLinkVisual = {
  anchorProps?: (linkName: string, clickable: boolean) => React.PropsWithoutRef<React.ComponentProps<'a'>>;
  tagHidden?: boolean;
};

export type CodeVisual = {
  codeProps?: (code: string) => React.PropsWithoutRef<React.ComponentProps<'code'>>;
};

export type FormulaVisual = {
  codeProps?: (formula: string) => React.PropsWithoutRef<React.ComponentProps<'code'>>;
};

/**
 * Label Props
 */

export type TextLabels = {
  normalLabel?: string;
  largerLabel?: string;
  largestLabel?: string;
};

export type ItemizationLabels = {
  indentLabel?: string;
  outdentLabel?: string;
};

export type BracketLabels = {
  label?: string;
};

export type HashtagLabels = {
  label?: string;
};

export type TaggedLinkLabels = {
  label?: string;
};

export type CodeLabels = {
  inlineLabel?: string;
  blockLabel?: string;
};

export type FormulaLabels = {
  inlineLabel?: string;
  displayLabel?: string;
  blockLabel?: string;
};

export type QuotationLabels = {
  indentLabel?: string;
  outdentLabel?: string;
};

/**
 * Parsing Props
 */

export type BracketLinkParsing = {
  disabled?: boolean;
};

export type HashtagParsing = {
  disabled?: boolean;
};

export type TaggedLinkParsing = {
  linkNameRegex?: RegExp;
};

export type CodeParsing = {
  disabled?: boolean;
};

export type FormulaParsing = {
  disabled?: boolean;
};

/**
 * Misc
 */

export type Suggestion = {
  suggestions?: string[];
  initialSuggestionIndex?: number;
};

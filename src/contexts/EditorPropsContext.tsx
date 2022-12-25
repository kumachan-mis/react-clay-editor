import { BracketLinkLabels } from '../types/label/bracketLink';
import { CodeLabels } from '../types/label/code';
import { FormulaLabels } from '../types/label/formula';
import { HashtagLabels } from '../types/label/hashtag';
import { ItemizationLabels } from '../types/label/itemization';
import { QuotationLabels } from '../types/label/quotation';
import { TaggedLinkLabels } from '../types/label/taggedLink';
import { TextLabels } from '../types/label/text';
import { BracketLinkParsing } from '../types/parsing/bracketLink';
import { CodeParsing } from '../types/parsing/code';
import { FormulaParsing } from '../types/parsing/formula';
import { HashtagParsing } from '../types/parsing/hashtag';
import { TaggedLinkParsing } from '../types/parsing/taggedLink';
import { Suggestion } from '../types/suggestion/suggestion';
import { BracketLinkVisual } from '../types/visual/bracketLink';
import { CodeVisual } from '../types/visual/code';
import { FormulaVisual } from '../types/visual/formula';
import { HashtagVisual } from '../types/visual/hashtag';
import { TaggedLinkVisual } from '../types/visual/taggedLink';
import { TextVisual } from '../types/visual/text';

import React from 'react';

export type EditorProps = {
  syntax?: 'bracket' | 'markdown';
  textProps?: TextProps;
  itemizationProps?: ItemizationProps;
  bracketLinkProps?: BracketLinkProps;
  hashtagProps?: HashtagProps;
  taggedLinkPropsMap?: { [tagName: string]: TaggedLinkProps };
  codeProps?: CodeProps;
  formulaProps?: FormulaProps;
  quotationProps?: QuotationProps;
  className?: string;
};

export type TextProps = TextVisual & TextLabels & Suggestion;

export type ItemizationProps = ItemizationLabels;

export type BracketLinkProps = BracketLinkVisual & BracketLinkLabels & BracketLinkParsing & Suggestion;

export type HashtagProps = HashtagVisual & HashtagLabels & HashtagParsing & Suggestion;

export type TaggedLinkProps = TaggedLinkVisual & TaggedLinkLabels & TaggedLinkParsing & Suggestion;

export type CodeProps = CodeVisual & CodeLabels & CodeParsing;

export type FormulaProps = FormulaVisual & FormulaLabels & FormulaParsing;

export type QuotationProps = QuotationLabels;

export const defaultEditorPropsValue: EditorProps = {};

const EditorPropsValueContext = React.createContext(defaultEditorPropsValue);

export function useEditorPropsValueContext(): EditorProps {
  return React.useContext(EditorPropsValueContext);
}

export const EditorPropsContextProvider: React.FC<React.PropsWithChildren<{ props: EditorProps }>> = ({
  props,
  children,
}) => <EditorPropsValueContext.Provider value={props}>{children}</EditorPropsValueContext.Provider>;

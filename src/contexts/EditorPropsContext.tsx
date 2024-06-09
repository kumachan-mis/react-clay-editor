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
  palette?: 'light' | 'dark';
  textProps?: EditorTextProps;
  itemizationProps?: EditorItemizationProps;
  bracketLinkProps?: EditorBracketLinkProps;
  hashtagProps?: EditorHashtagProps;
  taggedLinkPropsMap?: Record<string, EditorTaggedLinkProps>;
  codeProps?: EditorCodeProps;
  formulaProps?: EditorFormulaProps;
  quotationProps?: EditorQuotationProps;
};

export type EditorTextProps = TextVisual & TextLabels & Suggestion;

export type EditorItemizationProps = ItemizationLabels;

export type EditorBracketLinkProps = BracketLinkVisual & BracketLinkLabels & BracketLinkParsing & Suggestion;

export type EditorHashtagProps = HashtagVisual & HashtagLabels & HashtagParsing & Suggestion;

export type EditorTaggedLinkProps = TaggedLinkVisual & TaggedLinkLabels & TaggedLinkParsing & Suggestion;

export type EditorCodeProps = CodeVisual & CodeLabels & CodeParsing;

export type EditorFormulaProps = FormulaVisual & FormulaLabels & FormulaParsing;

export type EditorQuotationProps = QuotationLabels;

export const defaultEditorPropsValue: EditorProps = {};

const EditorPropsValueContext = React.createContext(defaultEditorPropsValue);

export function useEditorPropsValueContext(): EditorProps {
  return React.useContext(EditorPropsValueContext);
}

export const EditorPropsContextProvider: React.FC<React.PropsWithChildren<{ readonly props: EditorProps }>> = ({
  props,
  children,
}) => <EditorPropsValueContext.Provider value={props}>{children}</EditorPropsValueContext.Provider>;

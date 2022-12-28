import { BracketLinkLabels } from 'src/types/label/bracketLink';
import { CodeLabels } from 'src/types/label/code';
import { FormulaLabels } from 'src/types/label/formula';
import { HashtagLabels } from 'src/types/label/hashtag';
import { ItemizationLabels } from 'src/types/label/itemization';
import { QuotationLabels } from 'src/types/label/quotation';
import { TaggedLinkLabels } from 'src/types/label/taggedLink';
import { TextLabels } from 'src/types/label/text';
import { BracketLinkParsing } from 'src/types/parsing/bracketLink';
import { CodeParsing } from 'src/types/parsing/code';
import { FormulaParsing } from 'src/types/parsing/formula';
import { HashtagParsing } from 'src/types/parsing/hashtag';
import { TaggedLinkParsing } from 'src/types/parsing/taggedLink';
import { Suggestion } from 'src/types/suggestion/suggestion';
import { BracketLinkVisual } from 'src/types/visual/bracketLink';
import { CodeVisual } from 'src/types/visual/code';
import { FormulaVisual } from 'src/types/visual/formula';
import { HashtagVisual } from 'src/types/visual/hashtag';
import { TaggedLinkVisual } from 'src/types/visual/taggedLink';
import { TextVisual } from 'src/types/visual/text';

import React from 'react';

export type EditorProps = {
  syntax?: 'bracket' | 'markdown';
  textProps?: EditorTextProps;
  itemizationProps?: EditorItemizationProps;
  bracketLinkProps?: EditorBracketLinkProps;
  hashtagProps?: EditorHashtagProps;
  taggedLinkPropsMap?: { [tagName: string]: EditorTaggedLinkProps };
  codeProps?: EditorCodeProps;
  formulaProps?: EditorFormulaProps;
  quotationProps?: EditorQuotationProps;
  className?: string;
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

export const EditorPropsContextProvider: React.FC<React.PropsWithChildren<{ props: EditorProps }>> = ({
  props,
  children,
}) => <EditorPropsValueContext.Provider value={props}>{children}</EditorPropsValueContext.Provider>;

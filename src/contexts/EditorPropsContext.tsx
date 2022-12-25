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

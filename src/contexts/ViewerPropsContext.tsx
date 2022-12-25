import { BracketLinkParsing } from 'src/types/parsing/bracketLink';
import { CodeParsing } from 'src/types/parsing/code';
import { FormulaParsing } from 'src/types/parsing/formula';
import { HashtagParsing } from 'src/types/parsing/hashtag';
import { TaggedLinkParsing } from 'src/types/parsing/taggedLink';
import { BracketLinkVisual } from 'src/types/visual/bracketLink';
import { CodeVisual } from 'src/types/visual/code';
import { FormulaVisual } from 'src/types/visual/formula';
import { HashtagVisual } from 'src/types/visual/hashtag';
import { TaggedLinkVisual } from 'src/types/visual/taggedLink';
import { TextVisual } from 'src/types/visual/text';

import React from 'react';

export type ViewerProps = {
  syntax?: 'bracket' | 'markdown';
  textProps?: TextProps;
  bracketLinkProps?: BracketLinkProps;
  hashtagProps?: HashtagProps;
  taggedLinkPropsMap?: { [tagName: string]: TaggedLinkProps };
  codeProps?: CodeProps;
  formulaProps?: FormulaProps;
  className?: string;
};

export type TextProps = TextVisual;

export type BracketLinkProps = BracketLinkVisual & BracketLinkParsing;

export type HashtagProps = HashtagVisual & HashtagParsing;

export type TaggedLinkProps = TaggedLinkVisual & TaggedLinkParsing;

export type CodeProps = CodeVisual & CodeParsing;

export type FormulaProps = FormulaVisual & FormulaParsing;

export const defaultViewerPropsValue: ViewerProps = {};

const ViewerPropsValueContext = React.createContext(defaultViewerPropsValue);

export function useViewerPropsValueContext(): ViewerProps {
  return React.useContext(ViewerPropsValueContext);
}

export const ViewerPropsContextProvider: React.FC<React.PropsWithChildren<{ props: ViewerProps }>> = ({
  props,
  children,
}) => <ViewerPropsValueContext.Provider value={props}>{children}</ViewerPropsValueContext.Provider>;

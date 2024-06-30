import { BracketLinkParsing } from '../types/parsing/bracketLink';
import { CodeParsing } from '../types/parsing/code';
import { FormulaParsing } from '../types/parsing/formula';
import { HashtagParsing } from '../types/parsing/hashtag';
import { TaggedLinkParsing } from '../types/parsing/taggedLink';
import { BracketLinkVisual } from '../types/visual/bracketLink';
import { CodeVisual } from '../types/visual/code';
import { FormulaVisual } from '../types/visual/formula';
import { HashtagVisual } from '../types/visual/hashtag';
import { TaggedLinkVisual } from '../types/visual/taggedLink';

import React from 'react';

export type ViewerProps = {
  syntax?: 'bracket' | 'markdown';
  palette?: 'light' | 'dark';
  bracketLinkProps?: ViewerBracketLinkProps;
  hashtagProps?: ViewerHashtagProps;
  taggedLinkPropsMap?: Record<string, ViewerTaggedLinkProps>;
  codeProps?: ViewerCodeProps;
  formulaProps?: ViewerFormulaProps;
};

export type ViewerBracketLinkProps = BracketLinkVisual & BracketLinkParsing;

export type ViewerHashtagProps = HashtagVisual & HashtagParsing;

export type ViewerTaggedLinkProps = TaggedLinkVisual & TaggedLinkParsing;

export type ViewerCodeProps = CodeVisual & CodeParsing;

export type ViewerFormulaProps = FormulaVisual & FormulaParsing;

export const defaultViewerPropsValue: ViewerProps = {};

const ViewerPropsValueContext = React.createContext(defaultViewerPropsValue);

export function useViewerPropsValueContext(): ViewerProps {
  return React.useContext(ViewerPropsValueContext);
}

export const ViewerPropsContextProvider: React.FC<React.PropsWithChildren<{ readonly props: ViewerProps }>> = ({
  props,
  children,
}) => <ViewerPropsValueContext.Provider value={props}>{children}</ViewerPropsValueContext.Provider>;

import React from 'react';

import {
  TextVisual,
  BracketLinkVisual,
  HashtagVisual,
  TaggedLinkVisual,
  CodeVisual,
  FormulaVisual,
  BracketLinkParsing,
  HashtagParsing,
  TaggedLinkParsing,
  CodeParsing,
  FormulaParsing,
} from '../../../common/types';
import { useParser } from '../../../parser';
import { Text } from '../Text';

export type ViewerTextProps = TextVisual;

export type ViewerBracketLinkProps = BracketLinkVisual & BracketLinkParsing;

export type ViewerHashtagProps = HashtagVisual & HashtagParsing;

export type ViewerTaggedLinkProps = TaggedLinkVisual & TaggedLinkParsing;

export type ViewerCodeProps = CodeVisual & CodeParsing;

export type ViewerFormulaProps = FormulaVisual & FormulaParsing;

export type ViewerProps = {
  text: string;
  syntax?: 'bracket' | 'markdown';
  textProps?: ViewerTextProps;
  bracketLinkProps?: ViewerBracketLinkProps;
  hashtagProps?: ViewerHashtagProps;
  taggedLinkPropsMap?: { [tagName: string]: ViewerTaggedLinkProps };
  codeProps?: ViewerCodeProps;
  formulaProps?: ViewerFormulaProps;
  className?: string;
};

export const Viewer: React.FC<ViewerProps> = ({
  text,
  syntax,
  textProps,
  bracketLinkProps,
  hashtagProps,
  taggedLinkPropsMap,
  codeProps,
  formulaProps,
  className,
}) => {
  const nodes = useParser(text, syntax, bracketLinkProps, hashtagProps, taggedLinkPropsMap, codeProps, formulaProps);

  return (
    <Text
      nodes={nodes}
      textVisual={textProps}
      bracketLinkVisual={bracketLinkProps}
      hashtagVisual={hashtagProps}
      codeVisual={codeProps}
      formulaVisual={formulaProps}
      taggedLinkVisualMap={taggedLinkPropsMap}
      className={className}
    />
  );
};

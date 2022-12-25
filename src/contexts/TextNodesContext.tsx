import { ParsingOptions, parseText } from 'src/parser';
import { BlockNode } from 'src/parser/block/types';
import { LineNode } from 'src/parser/line/types';
import { createTaggedLinkRegex } from 'src/parser/taggedLink/parseTaggedLink';
import { BracketLinkParsing } from 'src/types/parsing/bracketLink';
import { CodeParsing } from 'src/types/parsing/code';
import { FormulaParsing } from 'src/types/parsing/formula';
import { HashtagParsing } from 'src/types/parsing/hashtag';
import { TaggedLinkParsing } from 'src/types/parsing/taggedLink';

import React from 'react';

export type ParserProps = {
  syntax?: 'bracket' | 'markdown';
  bracketLinkProps?: BracketLinkParsing;
  hashtagProps?: HashtagParsing;
  taggedLinkPropsMap?: { [tagName: string]: TaggedLinkParsing };
  codeProps?: CodeParsing;
  formulaProps?: FormulaParsing;
};

export const defaultTextNodes: (LineNode | BlockNode)[] = [];

const TextNodesValueContext = React.createContext(defaultTextNodes);

export function useTextNodesValueContext(): (LineNode | BlockNode)[] {
  return React.useContext(TextNodesValueContext);
}

export const TextNodesContextProvider: React.FC<React.PropsWithChildren<{ text: string; props: ParserProps }>> = ({
  text,
  props,
  children,
}) => {
  const options: ParsingOptions = {
    syntax: props.syntax,
    bracketLinkDisabled: props.bracketLinkProps?.disabled,
    hashtagDisabled: props.hashtagProps?.disabled,
    codeDisabled: props.codeProps?.disabled,
    formulaDisabled: props.formulaProps?.disabled,
    taggedLinkRegexes: Object.entries(props.taggedLinkPropsMap || {}).map(([tagName, taggedLinkProps]) =>
      createTaggedLinkRegex(tagName, taggedLinkProps.linkNameRegex)
    ),
  };

  const nodes = parseText(text, options);

  return <TextNodesValueContext.Provider value={nodes}>{children}</TextNodesValueContext.Provider>;
};

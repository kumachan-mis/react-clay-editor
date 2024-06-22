import { parseText, ParsingOptions, TopLevelNode } from '../parser';
import { createTaggedLinkRegex } from '../parser/taggedLink/parseTaggedLink';
import { BracketLinkParsing } from '../types/parsing/bracketLink';
import { CodeParsing } from '../types/parsing/code';
import { FormulaParsing } from '../types/parsing/formula';
import { HashtagParsing } from '../types/parsing/hashtag';
import { TaggedLinkParsing } from '../types/parsing/taggedLink';

import React from 'react';

export type ParserProps = {
  syntax?: 'bracket' | 'markdown';
  bracketLinkProps?: BracketLinkParsing;
  hashtagProps?: HashtagParsing;
  taggedLinkPropsMap?: Record<string, TaggedLinkParsing>;
  codeProps?: CodeParsing;
  formulaProps?: FormulaParsing;
};

export const defaultTextNodes: TopLevelNode[] = [];

const TextNodesValueContext = React.createContext(defaultTextNodes);

export function useTextNodesValueContext(): TopLevelNode[] {
  return React.useContext(TextNodesValueContext);
}

export const TextNodesContextProvider: React.FC<
  React.PropsWithChildren<{ readonly text: string; readonly props: ParserProps }>
> = ({ text, props, children }) => {
  const options: ParsingOptions = {
    syntax: props.syntax,
    bracketLinkDisabled: props.bracketLinkProps?.disabled,
    hashtagDisabled: props.hashtagProps?.disabled,
    codeDisabled: props.codeProps?.disabled,
    formulaDisabled: props.formulaProps?.disabled,
    taggedLinkRegexes: Object.entries(props.taggedLinkPropsMap ?? {}).map(([tagName, taggedLinkProps]) =>
      createTaggedLinkRegex(tagName, taggedLinkProps.linkNameRegex)
    ),
  };

  const nodes = parseText(text, options);

  return <TextNodesValueContext.Provider value={nodes}>{children}</TextNodesValueContext.Provider>;
};

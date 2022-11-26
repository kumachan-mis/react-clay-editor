import React from 'react';

import { parseText, ParsingOptions } from '../parser';
import { BlockNode } from '../parser/block/types';
import { LineNode } from '../parser/line/types';
import { createTaggedLinkRegex } from '../parser/taggedLink/parseTaggedLink';

import { EditorProps } from './EditorPropsContext';

export const defaultEditorTextNodes: (LineNode | BlockNode)[] = [];

const EditorTextNodesValueContext = React.createContext(defaultEditorTextNodes);

export function useEditorTextNodesValueContext(): (LineNode | BlockNode)[] {
  return React.useContext(EditorTextNodesValueContext);
}

export const EditorTextNodesContextProvider: React.FC<
  React.PropsWithChildren<{ text: string; props: EditorProps }>
> = ({ text, props, children }) => {
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

  return <EditorTextNodesValueContext.Provider value={nodes}>{children}</EditorTextNodesValueContext.Provider>;
};

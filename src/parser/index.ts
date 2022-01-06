import React from 'react';

import { BracketLinkProps, HashtagProps, TaggedLinkPropsMap, CodeProps, FormulaProps } from '../common/types';

import { parserConstants } from './constants';
import { parseText } from './parseText';
import { BlockNode, LineNode, ParsingOptions } from './types';
import { getHashtagName, getTagName } from './utils';

export function useParser(
  text: string,
  syntax?: 'bracket' | 'markdown',
  bracketLinkProps?: BracketLinkProps,
  hashtagProps?: HashtagProps,
  taggedLinkPropsMap?: TaggedLinkPropsMap,
  codeProps?: CodeProps,
  formulaProps?: FormulaProps
): (BlockNode | LineNode)[] {
  const nodes = React.useMemo(() => {
    const options: ParsingOptions = {
      syntax,
      disables: {
        bracketLink: bracketLinkProps?.disabled,
        hashtag: hashtagProps?.disabled,
        code: codeProps?.disabled,
        formula: formulaProps?.disabled,
      },
      taggedLinkRegexes: Object.entries(taggedLinkPropsMap || {}).map(([tagName, linkProps]) =>
        parserConstants.common.taggedLink(tagName, linkProps.linkNameRegex)
      ),
    };
    return parseText(text, options);
  }, [
    text,
    syntax,
    bracketLinkProps?.disabled,
    hashtagProps?.disabled,
    codeProps?.disabled,
    formulaProps?.disabled,
    taggedLinkPropsMap,
  ]);

  return nodes;
}

export function useLineNodes(nodes: (LineNode | BlockNode)[]): LineNode[] {
  const lineNodes = React.useMemo(() => {
    const lineNodes: LineNode[] = [];
    for (const node of nodes) {
      switch (node.type) {
        case 'blockCode':
        case 'blockFormula':
          lineNodes.push(node.facingMeta);
          lineNodes.push(...node.children);
          if (node.trailingMeta) lineNodes.push(node.trailingMeta);
          break;
        default:
          lineNodes.push(node);
      }
    }
    return lineNodes;
  }, [nodes]);
  return lineNodes;
}

export { parseText, getHashtagName, getTagName };

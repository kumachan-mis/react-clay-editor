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

export { parseText, getHashtagName, getTagName };

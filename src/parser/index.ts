import React from 'react';

import { BracketLinkParsing, HashtagParsing, TaggedLinkParsing, CodeParsing, FormulaParsing } from '../common/types';

import { parserConstants } from './constants';
import { parseText } from './parseText';
import { BlockNode, LineNode, ParsingOptions } from './types';

export function useParsingOptions(
  syntax?: 'bracket' | 'markdown',
  bracketLinkParsing?: BracketLinkParsing,
  hashtagParsing?: HashtagParsing,
  taggedLinkParsingMap?: { [tagName: string]: TaggedLinkParsing },
  codeParsing?: CodeParsing,
  formulaParsing?: FormulaParsing
): ParsingOptions {
  const options = React.useMemo(
    (): ParsingOptions => ({
      syntax,
      bracketLinkDisabled: bracketLinkParsing?.disabled,
      hashtagDisabled: hashtagParsing?.disabled,
      codeDisabled: codeParsing?.disabled,
      formulaDisabled: formulaParsing?.disabled,
      taggedLinkRegexes: Object.entries(taggedLinkParsingMap || {}).map(([tagName, linkParsing]) =>
        parserConstants.common.taggedLink(tagName, linkParsing.linkNameRegex)
      ),
    }),
    [
      syntax,
      bracketLinkParsing?.disabled,
      hashtagParsing?.disabled,
      codeParsing?.disabled,
      formulaParsing?.disabled,
      taggedLinkParsingMap,
    ]
  );
  return options;
}

export function useParser(text: string, options: ParsingOptions): (BlockNode | LineNode)[] {
  const nodes = React.useMemo(() => parseText(text, options), [text, options]);
  return nodes;
}

export function useOptionalParser(
  text: string | undefined,
  options: ParsingOptions
): (BlockNode | LineNode)[] | undefined {
  const nodes = React.useMemo(() => (text !== undefined ? parseText(text, options) : undefined), [text, options]);
  return nodes;
}

export { parseText };

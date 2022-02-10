import React from 'react';

import { BracketLinkParsing, HashtagParsing, TaggedLinkParsing, CodeParsing, FormulaParsing } from '../common/types';

import { parserConstants } from './constants';
import { parseText } from './parseText';
import { BlockNode, LineNode, ParsingOptions } from './types';

export function useParser(
  text: string,
  syntax?: 'bracket' | 'markdown',
  bracketLinkParsing?: BracketLinkParsing,
  hashtagParsing?: HashtagParsing,
  taggedLinkParsingMap?: { [tagName: string]: TaggedLinkParsing },
  codeParsing?: CodeParsing,
  formulaParsing?: FormulaParsing
): (BlockNode | LineNode)[] {
  const nodes = React.useMemo(() => {
    const options: ParsingOptions = {
      syntax,
      bracketLinkDisabled: bracketLinkParsing?.disabled,
      hashtagDisabled: hashtagParsing?.disabled,
      codeDisabled: codeParsing?.disabled,
      formulaDisabled: formulaParsing?.disabled,
      taggedLinkRegexes: Object.entries(taggedLinkParsingMap || {}).map(([tagName, linkParsing]) =>
        parserConstants.common.taggedLink(tagName, linkParsing.linkNameRegex)
      ),
    };
    return parseText(text, options);
  }, [
    text,
    syntax,
    bracketLinkParsing?.disabled,
    hashtagParsing?.disabled,
    codeParsing?.disabled,
    formulaParsing?.disabled,
    taggedLinkParsingMap,
  ]);

  return nodes;
}

export { parseText };

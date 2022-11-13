import React from 'react';

import { BracketLinkParsing, CodeParsing, FormulaParsing, HashtagParsing, TaggedLinkParsing } from '../../common/types';
import { BlockNode } from '../block/types';
import { ParsingOptions } from '../common/types';
import { LineNode } from '../line/types';
import { createTaggedLinkRegex } from '../taggedLink/parseTaggedLink';

import { parseText } from './parseText';

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
        createTaggedLinkRegex(tagName, linkParsing.linkNameRegex)
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

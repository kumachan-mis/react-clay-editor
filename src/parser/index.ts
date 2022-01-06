import { BracketLinkProps, HashtagProps, TaggedLinkPropsMap, CodeProps, FormulaProps } from '../common/types';

import { parserConstants } from './constants';
import { parseText } from './parseText';
import { Node, ParsingOptions } from './types';
import { getHashtagName, getTagName } from './utils';

export function useParser(
  text: string,
  syntax?: 'bracket' | 'markdown',
  bracketLinkProps?: BracketLinkProps,
  hashtagProps?: HashtagProps,
  taggedLinkPropsMap?: TaggedLinkPropsMap,
  codeProps?: CodeProps,
  formulaProps?: FormulaProps
): Node[] {
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
}

export { parseText, getHashtagName, getTagName };

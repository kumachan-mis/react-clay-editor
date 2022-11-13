import { ParsingContext, ParsingOptions } from '../common/types';
import { parseContent } from '../content/parseContent';
import { ContentNode } from '../content/types';

import { HashtagNode } from './types';

export const hashtagRegex = /^(?<left>.*?)#(?<linkName>[^\s!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]+)(?<right>.*)$/;

export function parseHashtag(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const { left, linkName, right } = text.match(hashtagRegex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: HashtagNode = {
    type: 'hashtag',
    lineIndex: context.lineIndex,
    range: [first, last],
    facingMeta: '#',
    linkName,
    trailingMeta: '',
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}

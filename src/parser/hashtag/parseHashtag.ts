import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';
import { ContentNode } from '../content/contentNode';
import { parseContent } from '../content/parseContent';

import { HashtagNode } from './hashtagNode';

export const hashtagRegex = /^(?<left>.*?)#(?<linkName>[^\s!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]+)(?<right>.*)$/;

export function parseHashtag(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const { left, linkName, right } = text.match(hashtagRegex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: HashtagNode = {
    type: 'hashtag',
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

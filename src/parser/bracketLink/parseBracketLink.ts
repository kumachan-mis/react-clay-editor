import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';
import { ContentNode } from '../content/contentNode';
import { parseContent } from '../content/parseContent';

import { BracketLinkNode } from './bracketLinkNode';

export const bracketLinkRegex = /^(?<left>.*?)\[(?<linkName>[^[\]]+)\](?<right>.*)$/;

export function parseBracketLink(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const { left, linkName, right } = text.match(bracketLinkRegex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: BracketLinkNode = {
    type: 'bracketLink',
    range: [first, last],
    facingMeta: '[',
    linkName,
    trailingMeta: ']',
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}

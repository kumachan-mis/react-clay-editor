import { ParsingContext, ParsingOptions } from '../common/types';
import { parseContent } from '../content/parseContent';
import { ContentNode } from '../content/types';

import { DecorationNode } from './types';

export const boldRegex = /^(?<left>.*?)\*(?<body>[^*\s](.*[^*\s])?)\*(?<right>.*)$/;

export function parseBold(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const { left, body, right } = text.match(boldRegex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: DecorationNode = {
    type: 'decoration',
    lineIndex: context.lineIndex,
    range: [first, last],
    facingMeta: '*',
    children: parseContent(body, { ...context, charIndex: first + 1, nested: true }, options),
    trailingMeta: '*',
    decoration: { ...context.decoration, bold: true },
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}

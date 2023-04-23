import { ParsingContext, ParsingOptions } from '../common/types';
import { parseContent } from '../content/parseContent';
import { ContentNode } from '../content/types';

import { DecorationNode } from './types';

export const italicBoldRegex = /^(?<left>.*?)_\*(?<body>[^_*\s](.*[^_*\s])?)\*_(?<right>.*)$/;

export function parseItalicBold(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const { left, body, right } = text.match(italicBoldRegex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: DecorationNode = {
    type: 'decoration',
    lineIndex: context.lineIndex,
    range: [first, last],
    facingMeta: '_*',
    children: parseContent(body, { ...context, charIndex: first + 2, nested: true }, options),
    trailingMeta: '*_',
    decoration: { ...context.decoration, italic: true, bold: true },
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}

import { ParsingContext, ParsingOptions } from '../common/types';
import { parseContent } from '../content/parseContent';
import { ContentNode } from '../content/types';

import { DecorationNode } from './types';

export const boldItalicRegex = /^(?<left>.*?)\*_(?<body>[^*_\s]([^_]*[^_\s])?)_\*(?<right>.*)$/;

export function parseBoldItalic(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const { left, body, right } = text.match(boldItalicRegex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: DecorationNode = {
    type: 'decoration',
    lineIndex: context.lineIndex,
    range: [first, last],
    facingMeta: '*_',
    children: parseContent(body, { ...context, charIndex: first + 2, nested: true }, options),
    trailingMeta: '_*',
    config: { ...context.decorationConfig, bold: true, italic: true },
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}

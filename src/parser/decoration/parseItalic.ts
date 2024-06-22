import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';
import { ContentNode } from '../content/contentNode';
import { parseContent } from '../content/parseContent';

import { DecorationNode } from './decorationNode';

export const italicRegex = /^(?<left>.*?)_(?<body>[^_\s]([^_]*[^_\s])?)_(?<right>.*)$/;

export function parseItalic(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const { left, body, right } = text.match(italicRegex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: DecorationNode = {
    type: 'decoration',
    lineIndex: context.lineIndex,
    range: [first, last],
    facingMeta: '_',
    children: parseContent(body, { ...context, charIndex: first + 1, nested: true }, options),
    trailingMeta: '_',
    config: { ...context.decorationConfig, italic: true },
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}

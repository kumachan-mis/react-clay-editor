import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';
import { ContentNode } from '../content/contentNode';
import { parseContent } from '../content/parseContent';

import { DecorationNode } from './decorationNode';

export const italicBoldRegex = /^(?<left>.*?)_\*(?<body>[^_*\s]([^*]*[^*\s])?)\*_(?<right>.*)$/;

export function parseItalicBold(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const { left, body, right } = italicBoldRegex.exec(text)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: DecorationNode = {
    type: 'decoration',
    range: [first, last],
    facingMeta: '_*',
    children: parseContent(body, { ...context, charIndex: first + 2, nested: true }, options),
    trailingMeta: '*_',
    config: { ...context.decorationConfig, italic: true, bold: true },
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}

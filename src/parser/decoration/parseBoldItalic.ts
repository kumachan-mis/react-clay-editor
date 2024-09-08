import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';
import { ContentNode } from '../content/contentNode';
import { CONTENT_LIMIT, parseContent } from '../content/parseContent';
import { parseNormal } from '../normal/parseNormal';

import { DecorationNode } from './decorationNode';

export const boldItalicRegex = /^(?<left>.*?)\*_(?<body>[^*_\s]([^_]*[^_\s])?)_\*(?<right>.*)$/;

export function parseBoldItalic(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  if (text.length > CONTENT_LIMIT) {
    return parseNormal(text, context);
  }

  const { left, body, right } = boldItalicRegex.exec(text)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: DecorationNode = {
    type: 'decoration',
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

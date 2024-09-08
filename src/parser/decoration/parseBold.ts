import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';
import { ContentNode } from '../content/contentNode';
import { CONTENT_LIMIT, parseContent } from '../content/parseContent';
import { parseNormal } from '../normal/parseNormal';

import { DecorationNode } from './decorationNode';

export const boldRegex = /^(?<left>.*?)\*(?<body>[^*\s]([^*]*[^*\s])?)\*(?<right>.*)$/;

export function parseBold(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  if (text.length > CONTENT_LIMIT) {
    return parseNormal(text, context);
  }

  const { left, body, right } = boldRegex.exec(text)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: DecorationNode = {
    type: 'decoration',
    range: [first, last],
    facingMeta: '*',
    children: parseContent(body, { ...context, charIndex: first + 1, nested: true }, options),
    trailingMeta: '*',
    config: { ...context.decorationConfig, bold: true },
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}

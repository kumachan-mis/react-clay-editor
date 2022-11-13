import { ParsingContext, ParsingOptions } from '../common/types';
import { parseContent } from '../content/parseContent';
import { ContentNode } from '../content/types';

import { InlineCodeNode } from './types';

export const inlineCodeRegex = /^(?<left>.*?)`(?<code>[^`]+)`(?<right>.*)$/;

export function parseInlineCode(text: string, context: ParsingContext, options: ParsingOptions): ContentNode[] {
  const { left, code, right } = text.match(inlineCodeRegex)?.groups as Record<string, string>;
  const [first, last] = [context.charIndex + left.length, context.charIndex + text.length - right.length - 1];

  const node: InlineCodeNode = {
    type: 'inlineCode',
    lineIndex: context.lineIndex,
    range: [first, last],
    facingMeta: '`',
    code,
    trailingMeta: '`',
  };

  return [
    ...parseContent(left, context, options),
    node,
    ...parseContent(right, { ...context, charIndex: last + 1 }, options),
  ];
}

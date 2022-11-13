import { ParsingContext, ParsingOptions } from '../common/types';
import { parseContent } from '../content/parseContent';

import { ItemizationNode } from './types';

export const bracketItemizationRegex = /^(?<indent>\s*)(?<bullet>\s)(?<content>(\S.*)?)$/;

export function parseBracketItemization(
  line: string,
  context: ParsingContext,
  options: ParsingOptions
): ItemizationNode {
  const { indent, bullet, content } = line.match(bracketItemizationRegex)?.groups as Record<string, string>;

  const node: ItemizationNode = {
    type: 'itemization',
    lineIndex: context.lineIndex,
    bullet,
    indentDepth: indent.length,
    contentLength: content.length,
    children: parseContent(content, { ...context, charIndex: indent.length + bullet.length }, options),
  };

  context.lineIndex++;

  return node;
}

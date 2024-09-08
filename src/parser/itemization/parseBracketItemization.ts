import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';
import { parseContent } from '../content/parseContent';

import { ItemizationNode } from './itemizationNode';

export const bracketItemizationRegex = /^(?<indent>\s*)(?<bullet>\s)(?<content>(\S.*)?)$/;

export function parseBracketItemization(
  line: string,
  context: ParsingContext,
  options: ParsingOptions
): ItemizationNode {
  const { indent, bullet, content } = bracketItemizationRegex.exec(line)?.groups as Record<string, string>;

  const node: ItemizationNode = {
    type: 'itemization',
    lineId: context.lineIds[context.lineIndex],
    indent,
    bullet,
    contentLength: content.length,
    children: parseContent(content, { ...context, charIndex: indent.length + bullet.length }, options),
    _lineIndex: context.lineIndex,
  };

  context.lineIndex++;

  return node;
}

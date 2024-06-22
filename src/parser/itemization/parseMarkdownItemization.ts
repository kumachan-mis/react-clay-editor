import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';
import { parseContent } from '../content/parseContent';

import { ItemizationNode } from './itemizationNode';

export const markdownItemizationRegex = /^(?<indent>\s*)(?<bullet>[*-] )(?<content>(.*)?)$/;

export function parseMarkdownItemization(
  line: string,
  context: ParsingContext,
  options: ParsingOptions
): ItemizationNode {
  const { indent, bullet, content } = line.match(markdownItemizationRegex)?.groups as Record<string, string>;

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

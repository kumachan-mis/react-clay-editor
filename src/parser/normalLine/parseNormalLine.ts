import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';
import { parseContent } from '../content/parseContent';

import { NormalLineNode } from './normalLineNode';

export function parseNormalLine(line: string, context: ParsingContext, options: ParsingOptions): NormalLineNode {
  const node: NormalLineNode = {
    type: 'normalLine',
    lineIndex: context.lineIndex,
    contentLength: line.length,
    children: parseContent(line, { ...context, charIndex: 0 }, options),
  };

  context.lineIndex++;

  return node;
}

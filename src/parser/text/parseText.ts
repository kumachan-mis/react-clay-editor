import { parseBlock } from '../block/parseBlock';
import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';
import { parseLine } from '../line/parseLine';

import { TopLevelNode } from './topLevelNode';

export function parseText(text: string, options: ParsingOptions): TopLevelNode[] {
  const nodes: TopLevelNode[] = [];
  const lines = text.split('\n');
  const context: ParsingContext = {
    lineIndex: 0,
    charIndex: 0,
    nested: false,
    decorationConfig: { size: 'normal', bold: false, italic: false, underline: false },
  };

  while (context.lineIndex < lines.length) {
    const blockNode = parseBlock(lines, context, options);
    if (blockNode) {
      nodes.push(blockNode);
      continue;
    }

    const lineNode = parseLine(lines[context.lineIndex], options, context);
    nodes.push(lineNode);
  }

  return nodes;
}

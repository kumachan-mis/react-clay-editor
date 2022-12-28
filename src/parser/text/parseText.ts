import { parseBlock } from '../block/parseBlock';
import { BlockNode } from '../block/types';
import { ParsingContext, ParsingOptions } from '../common/types';
import { parseLine } from '../line/parseLine';
import { LineNode } from '../line/types';

export function parseText(text: string, options: ParsingOptions): (BlockNode | LineNode)[] {
  const nodes: (BlockNode | LineNode)[] = [];
  const lines = text.split('\n');
  const context: ParsingContext = {
    lineIndex: 0,
    charIndex: 0,
    nested: false,
    decoration: { size: 'normal', bold: false, italic: false, underline: false },
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

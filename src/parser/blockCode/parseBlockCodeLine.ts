import { ParsingContext } from '../common/parsingContext';

import { BlockCodeLineNode } from './blockCodeLineNode';

export function createBlockCodeLineRegex(indentDepth: number): RegExp {
  return RegExp(`^(?<indent>\\s{${indentDepth}})(?<codeLine>.*)$`);
}

export function parseBlockCodeLine(line: string, context: ParsingContext, regex: RegExp): BlockCodeLineNode {
  const { indent, codeLine } = line.match(regex)?.groups as Record<string, string>;

  const node: BlockCodeLineNode = {
    type: 'blockCodeLine',
    lineId: context.lineIds[context.lineIndex],
    indent,
    codeLine,
    _lineIndex: context.lineIndex,
  };

  return node;
}

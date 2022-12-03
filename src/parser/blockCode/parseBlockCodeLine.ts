import { ParsingContext } from '../common/types';

import { BlockCodeLineNode } from './types';

export function createBlockCodeLineRegex(indentDepth: number): RegExp {
  return RegExp(`^(?<indent>\\s{${indentDepth}})(?<codeLine>.*)$`);
}

export function parseBlockCodeLine(line: string, context: ParsingContext, regex: RegExp): BlockCodeLineNode {
  const { indent, codeLine } = line.match(regex)?.groups as Record<string, string>;

  const node: BlockCodeLineNode = {
    type: 'blockCodeLine',
    lineIndex: context.lineIndex,
    indentDepth: indent.length,
    codeLine,
  };

  return node;
}

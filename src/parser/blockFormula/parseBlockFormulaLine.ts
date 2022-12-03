import { ParsingContext } from '../common/types';

import { BlockFormulaLineNode } from './types';

export function createBlockFormulaLineRegex(indentDepth: number): RegExp {
  return RegExp(`^(?<indent>\\s{${indentDepth}})(?<formulaLine>.*)$`);
}

export function parseBlockFormulaLine(line: string, context: ParsingContext, regex: RegExp): BlockFormulaLineNode {
  const { indent, formulaLine } = line.match(regex)?.groups as Record<string, string>;

  const node: BlockFormulaLineNode = {
    type: 'blockFormulaLine',
    lineIndex: context.lineIndex,
    indentDepth: indent.length,
    formulaLine,
  };

  return node;
}

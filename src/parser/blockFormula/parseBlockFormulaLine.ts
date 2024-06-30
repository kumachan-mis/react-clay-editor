import { ParsingContext } from '../common/parsingContext';

import { BlockFormulaLineNode } from './blockFormulaLineNode';

export function createBlockFormulaLineRegex(indentDepth: number): RegExp {
  return RegExp(`^(?<indent>\\s{${indentDepth}})(?<formulaLine>.*)$`);
}

export function parseBlockFormulaLine(line: string, context: ParsingContext, regex: RegExp): BlockFormulaLineNode {
  const { indent, formulaLine } = line.match(regex)?.groups as Record<string, string>;

  const node: BlockFormulaLineNode = {
    type: 'blockFormulaLine',
    lineId: context.lineIds[context.lineIndex],
    indent,
    formulaLine,
    _lineIndex: context.lineIndex,
  };

  return node;
}

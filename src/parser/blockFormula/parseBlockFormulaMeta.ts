import { ParsingContext } from '../common/parsingContext';

import { BlockFormulaMetaNode } from './blockFormulaMetaNode';

export const blockFormulaMetaRegex = /^(?<indent>\s*)(?<formulaMeta>\$\$)$/;

export function parseBlockFormulaMeta(line: string, context: ParsingContext): BlockFormulaMetaNode {
  const { indent, formulaMeta } = blockFormulaMetaRegex.exec(line)?.groups as Record<string, string>;

  const node: BlockFormulaMetaNode = {
    type: 'blockFormulaMeta',
    lineId: context.lineIds[context.lineIndex],
    indent,
    formulaMeta,
    _lineIndex: context.lineIndex,
  };

  return node;
}

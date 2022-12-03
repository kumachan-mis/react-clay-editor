import { ParsingContext } from '../common/types';

import { BlockFormulaMetaNode } from './types';

export const blockFormulaMetaRegex = /^(?<indent>\s*)(?<formulaMeta>\$\$)$/;

export function parseBlockFormulaMeta(line: string, context: ParsingContext): BlockFormulaMetaNode {
  const { indent, formulaMeta } = line.match(blockFormulaMetaRegex)?.groups as Record<string, string>;

  const node: BlockFormulaMetaNode = {
    type: 'blockFormulaMeta',
    lineIndex: context.lineIndex,
    indentDepth: indent.length,
    formulaMeta,
  };

  return node;
}

import { ParsingContext } from '../common/types';

import { createBlockFormulaLineRegex, parseBlockFormulaLine } from './parseBlockFormulaLine';
import { parseBlockFormulaMeta, blockFormulaMetaRegex } from './parseBlockFormulaMeta';
import { BlockFormulaNode } from './types';

export function parseBlockFormula(lines: string[], context: ParsingContext): BlockFormulaNode {
  const originalLineIndex = context.lineIndex;
  const facingMeta = parseBlockFormulaMeta(lines[context.lineIndex], context);
  const formulaLineRegex = createBlockFormulaLineRegex(facingMeta.indentDepth);
  context.lineIndex++;

  const node: BlockFormulaNode = {
    type: 'blockFormula',
    range: [originalLineIndex, context.lineIndex],
    facingMeta,
    children: [],
  };

  while (context.lineIndex < lines.length) {
    if (blockFormulaMetaRegex.test(lines[context.lineIndex])) {
      const mayTrailingMeta = parseBlockFormulaMeta(lines[context.lineIndex], context);
      if (mayTrailingMeta.indentDepth === facingMeta.indentDepth) {
        node.trailingMeta = mayTrailingMeta;
        context.lineIndex++;
      }
      node.range[1] = context.lineIndex - 1;
      return node;
    }

    if (!formulaLineRegex.test(lines[context.lineIndex])) break;
    node.children.push(parseBlockFormulaLine(lines[context.lineIndex], context, formulaLineRegex));
    context.lineIndex++;
  }

  node.range[1] = context.lineIndex - 1;
  return node;
}

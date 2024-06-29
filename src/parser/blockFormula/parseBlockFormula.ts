import { ParsingContext } from '../common/parsingContext';

import { BlockFormulaNode } from './blockFormulaNode';
import { createBlockFormulaLineRegex, parseBlockFormulaLine } from './parseBlockFormulaLine';
import { blockFormulaMetaRegex, parseBlockFormulaMeta } from './parseBlockFormulaMeta';

export function parseBlockFormula(lines: string[], context: ParsingContext): BlockFormulaNode {
  const facingMeta = parseBlockFormulaMeta(lines[context.lineIndex], context);
  const formulaLineRegex = createBlockFormulaLineRegex(facingMeta.indent.length);
  context.lineIndex++;

  const node: BlockFormulaNode = {
    type: 'blockFormula',
    facingMeta,
    children: [],
    _lineRange: [context.lineIndex - 1, context.lineIndex - 1],
  };

  while (context.lineIndex < lines.length) {
    if (blockFormulaMetaRegex.test(lines[context.lineIndex])) {
      const mayTrailingMeta = parseBlockFormulaMeta(lines[context.lineIndex], context);
      if (mayTrailingMeta.indent.length === facingMeta.indent.length) {
        node.trailingMeta = mayTrailingMeta;
        context.lineIndex++;
      }
      node._lineRange[1] = context.lineIndex - 1;
      return node;
    }

    if (!formulaLineRegex.test(lines[context.lineIndex])) break;
    node.children.push(parseBlockFormulaLine(lines[context.lineIndex], context, formulaLineRegex));
    context.lineIndex++;
  }

  node._lineRange[1] = context.lineIndex - 1;
  return node;
}

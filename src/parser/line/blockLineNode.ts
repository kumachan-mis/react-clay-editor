import { BlockCodeLineNode, blockCodeLineNodeEquals } from '../blockCode/blockCodeLineNode';
import { BlockCodeMetaNode, blockCodeMetaNodeEquals } from '../blockCode/blockCodeMetaNode';
import { BlockFormulaLineNode, blockFormulaLineNodeEquals } from '../blockFormula/blockFormulaLineNode';
import { BlockFormulaMetaNode, blockFormulaMetaNodeEquals } from '../blockFormula/blockFormulaMetaNode';
import { TextNode } from '../text/textNode';

export type BlockLineNode = BlockCodeMetaNode | BlockCodeLineNode | BlockFormulaMetaNode | BlockFormulaLineNode;

export function isBlockLineNode(node: TextNode): node is BlockLineNode {
  return ['blockCodeMeta', 'blockCodeLine', 'blockFormulaMeta', 'blockFormulaLine'].includes(node.type);
}

export function blockLineNodeEquals(a: BlockLineNode, b: BlockLineNode): boolean {
  if (a.type === 'blockCodeMeta' && b.type === 'blockCodeMeta') {
    return blockCodeMetaNodeEquals(a, b);
  } else if (a.type === 'blockCodeLine' && b.type === 'blockCodeLine') {
    return blockCodeLineNodeEquals(a, b);
  } else if (a.type === 'blockFormulaMeta' && b.type === 'blockFormulaMeta') {
    return blockFormulaMetaNodeEquals(a, b);
  } else if (a.type === 'blockFormulaLine' && b.type === 'blockFormulaLine') {
    return blockFormulaLineNodeEquals(a, b);
  }
  return false;
}

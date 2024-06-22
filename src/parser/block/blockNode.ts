import { BlockCodeNode, blockCodeNodeEquals } from '../blockCode/blockCodeNode';
import { BlockFormulaNode, blockFormulaNodeEquals } from '../blockFormula/blockFormulaNode';
import { TextNode } from '../text/textNode';

export type BlockNode = BlockCodeNode | BlockFormulaNode;

export function isBlockNode(node: TextNode): node is BlockNode {
  return ['blockCode', 'blockFormula'].includes(node.type);
}

export function blockNodeEquals(a: BlockNode, b: BlockNode): boolean {
  if (a.type === 'blockCode' && b.type === 'blockCode') {
    return blockCodeNodeEquals(a, b);
  } else if (a.type === 'blockFormula' && b.type === 'blockFormula') {
    return blockFormulaNodeEquals(a, b);
  }
  return false;
}

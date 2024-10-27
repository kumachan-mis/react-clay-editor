import {
  BlockFormulaLineNode,
  blockFormulaLineNodeToString,
  blockFormulaLineNodesEquals,
} from './blockFormulaLineNode';
import {
  BlockFormulaMetaNode,
  blockFormulaMetaNodeEquals,
  blockFormulaMetaNodeToString,
  optinalBlockFormulaMetaNodeEquals,
} from './blockFormulaMetaNode';

export type BlockFormulaNode = {
  type: 'blockFormula';
  facingMeta: BlockFormulaMetaNode;
  children: BlockFormulaLineNode[];
  trailingMeta?: BlockFormulaMetaNode;
  _lineRange: [number, number];
};

export function blockFormulaNodeEquals(prev: BlockFormulaNode, next: BlockFormulaNode): boolean {
  return (
    blockFormulaMetaNodeEquals(prev.facingMeta, next.facingMeta) &&
    blockFormulaLineNodesEquals(prev.children, next.children) &&
    optinalBlockFormulaMetaNodeEquals(prev.trailingMeta, next.trailingMeta)
  );
}

export function blockFormulaNodeToString(node: BlockFormulaNode): string {
  return (
    blockFormulaMetaNodeToString(node.facingMeta) +
    node.children.map((child) => '\n' + blockFormulaLineNodeToString(child)).join('') +
    (node.trailingMeta ? '\n' + blockFormulaMetaNodeToString(node.trailingMeta) : '')
  );
}

import { BlockFormulaLineNode, blockFormulaLineNodesEquals } from './blockFormulaLineNode';
import { BlockFormulaMetaNode, blockFormulaMetaNodeEquals } from './blockFormulaMetaNode';

export type BlockFormulaNode = {
  type: 'blockFormula';
  range: [number, number];
  facingMeta: BlockFormulaMetaNode;
  children: BlockFormulaLineNode[];
  trailingMeta?: BlockFormulaMetaNode;
};

export function blockFormulaNodeEquals(prev: BlockFormulaNode, next: BlockFormulaNode): boolean {
  return (
    prev.range[0] === next.range[0] &&
    prev.range[1] === next.range[1] &&
    blockFormulaMetaNodeEquals(prev.facingMeta, next.facingMeta) &&
    blockFormulaLineNodesEquals(prev.children, next.children) &&
    blockFormulaMetaNodeEquals(prev.trailingMeta, next.trailingMeta)
  );
}

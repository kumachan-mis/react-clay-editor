import { BlockCodeLineNode, blockCodeLineNodeToString, blockCodeLineNodesEquals } from './blockCodeLineNode';
import {
  BlockCodeMetaNode,
  blockCodeMetaNodeEquals,
  blockCodeMetaNodeToString,
  optinalBlockCodeMetaNodeEquals,
} from './blockCodeMetaNode';

export type BlockCodeNode = {
  type: 'blockCode';
  facingMeta: BlockCodeMetaNode;
  children: BlockCodeLineNode[];
  trailingMeta?: BlockCodeMetaNode;
  _lineRange: [number, number];
};

export function blockCodeNodeEquals(a: BlockCodeNode, b: BlockCodeNode): boolean {
  return (
    blockCodeMetaNodeEquals(a.facingMeta, b.facingMeta) &&
    blockCodeLineNodesEquals(a.children, b.children) &&
    optinalBlockCodeMetaNodeEquals(a.trailingMeta, b.trailingMeta)
  );
}

export function blockCodeNodeToString(node: BlockCodeNode): string {
  return (
    blockCodeMetaNodeToString(node.facingMeta) +
    '\n' +
    node.children.map(blockCodeLineNodeToString).join('\n') +
    (node.trailingMeta ? '\n' + blockCodeMetaNodeToString(node.trailingMeta) : '')
  );
}

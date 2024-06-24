import { BlockCodeLineNode, blockCodeLineNodesEquals } from './blockCodeLineNode';
import { BlockCodeMetaNode, blockCodeMetaNodeEquals, optinalBlockCodeMetaNodeEquals } from './blockCodeMetaNode';

export type BlockCodeNode = {
  type: 'blockCode';
  range: [number, number];
  facingMeta: BlockCodeMetaNode;
  children: BlockCodeLineNode[];
  trailingMeta?: BlockCodeMetaNode;
};

export function blockCodeNodeEquals(a: BlockCodeNode, b: BlockCodeNode): boolean {
  return (
    a.range[0] === b.range[0] &&
    a.range[1] === b.range[1] &&
    blockCodeMetaNodeEquals(a.facingMeta, b.facingMeta) &&
    blockCodeLineNodesEquals(a.children, b.children) &&
    optinalBlockCodeMetaNodeEquals(a.trailingMeta, b.trailingMeta)
  );
}

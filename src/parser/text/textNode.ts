import { BlockNode, blockNodeEquals, isBlockNode } from '../block/blockNode';
import { ContentNode, contentNodeEquals, isContentNode } from '../content/contentNode';
import { LineNode, isLineNode, lineNodeEquals } from '../line/lineNode';

export type TextNode = BlockNode | LineNode | ContentNode;

export function textNodeEquals(a: TextNode, b: TextNode): boolean {
  if (isBlockNode(a) && isBlockNode(b)) {
    return blockNodeEquals(a, b);
  } else if (isLineNode(a) && isLineNode(b)) {
    return lineNodeEquals(a, b);
  } else if (isContentNode(a) && isContentNode(b)) {
    return contentNodeEquals(a, b);
  }
  return false;
}

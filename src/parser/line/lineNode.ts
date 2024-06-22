import { TextNode } from '../text/textNode';

import { BlockLineNode, blockLineNodeEquals, isBlockLineNode } from './blockLineNode';
import { PureLineNode, isPureLineNode, pureLineNodeEquals } from './pureLineNode';

export type LineNode = BlockLineNode | PureLineNode;

export function isLineNode(node: TextNode): node is LineNode {
  return isBlockLineNode(node) || isPureLineNode(node);
}

export function lineNodeEquals(a: LineNode, b: LineNode): boolean {
  if (isBlockLineNode(a) && isBlockLineNode(b)) {
    return blockLineNodeEquals(a, b);
  } else if (isPureLineNode(a) && isPureLineNode(b)) {
    return pureLineNodeEquals(a, b);
  }
  return false;
}

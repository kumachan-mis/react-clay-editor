import { BlockNode } from '../block/blockNode';
import { blockLineNodeEquals, isBlockLineNode } from '../line/blockLineNode';
import { PureLineNode, isPureLineNode, pureLineNodeEquals } from '../line/pureLineNode';

export type TopLevelNode = PureLineNode | BlockNode;

export function topLevelNodeEquals(prev: TopLevelNode, next: TopLevelNode): boolean {
  if (isPureLineNode(prev) && isPureLineNode(next)) {
    return pureLineNodeEquals(prev, next);
  } else if (isBlockLineNode(prev) && isBlockLineNode(next)) {
    return blockLineNodeEquals(prev, next);
  }
  return false;
}

export function topLevelNodesEquals(prev: TopLevelNode[], next: TopLevelNode[]): boolean {
  return prev.length === next.length && prev.every((node, index) => topLevelNodeEquals(node, next[index]));
}

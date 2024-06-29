import { BlockNode, blockNodeToString } from '../block/blockNode';
import { blockLineNodeEquals, isBlockLineNode } from '../line/blockLineNode';
import { LineNode } from '../line/lineNode';
import { PureLineNode, isPureLineNode, pureLineNodeEquals, pureLineNodeToString } from '../line/pureLineNode';

export type TopLevelNode = PureLineNode | BlockNode;

export function topLevelNodeEquals(prev: TopLevelNode, next: TopLevelNode): boolean {
  if (isPureLineNode(prev) && isPureLineNode(next)) {
    return pureLineNodeEquals(prev, next);
  } else if (isBlockLineNode(prev) && isBlockLineNode(next)) {
    return blockLineNodeEquals(prev, next);
  }
  return false;
}

export function topLevelNodeToString(node: TopLevelNode): string {
  if (isPureLineNode(node)) {
    return pureLineNodeToString(node);
  } else {
    return blockNodeToString(node);
  }
}

export function topLevelNodesEquals(prev: TopLevelNode[], next: TopLevelNode[]): boolean {
  return prev.length === next.length && prev.every((node, index) => topLevelNodeEquals(node, next[index]));
}

export function topLevelNodeToLineNodes(nodes: TopLevelNode[]): LineNode[] {
  const lineNodes: LineNode[] = [];
  for (const node of nodes) {
    switch (node.type) {
      case 'blockCode':
      case 'blockFormula':
        lineNodes.push(node.facingMeta);
        lineNodes.push(...node.children);
        if (node.trailingMeta) lineNodes.push(node.trailingMeta);
        break;
      default:
        lineNodes.push(node);
    }
  }
  return lineNodes;
}

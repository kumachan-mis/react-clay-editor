import { TextNode } from '../../../../parser';

import { TextNodeVisuals, textNodeVisualsEquals } from './textNodeVisuals';

export type TextNodeProps<TTextNode extends TextNode = TextNode> = {
  node: TTextNode;
  editMode: boolean;
  linkForceClickable: boolean;
} & TextNodeVisuals;

export function createTextNodePropsEquals<TTextNode extends TextNode>(
  nodeEquals: (prevNode: TTextNode, nextNode: TTextNode) => boolean
): (prev: TextNodeProps<TTextNode>, next: TextNodeProps<TTextNode>) => boolean {
  return (prev, next) =>
    nodeEquals(prev.node, next.node) &&
    prev.editMode === next.editMode &&
    prev.linkForceClickable === next.linkForceClickable &&
    textNodeVisualsEquals(prev, next);
}

export function textNodesWithReactKey<TTextNode extends TextNode>(nodes: TTextNode[]): [React.Key, TTextNode][] {
  const result: [React.Key, TTextNode][] = [];

  const keyCountMap = new Map<string, number>();
  for (const node of nodes) {
    const nodeToBeStringified: Record<string, unknown> = { ...node };
    if (nodeToBeStringified.lineIndex) delete nodeToBeStringified.lineIndex;
    if (nodeToBeStringified.range) delete nodeToBeStringified.range;

    const key = JSON.stringify(nodeToBeStringified);
    const count = keyCountMap.get(key) ?? 0;
    keyCountMap.set(key, count + 1);

    result.push([`${count}:${key}`, node]);
  }

  return result;
}

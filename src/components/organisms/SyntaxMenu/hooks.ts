import React from 'react';

import { BlockNode, LineNode } from '../../../parser/types';

export function useLineNodes(nodes: (LineNode | BlockNode)[]): LineNode[] {
  const lineNodes = React.useMemo(() => {
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
  }, [nodes]);
  return lineNodes;
}

import { getLineRange } from '../common/utils';
import { BlockNode } from 'src/parser/block/types';
import { isBlockNode } from 'src/parser/block/utils';
import { LineNode } from 'src/parser/line/types';
import { CursorCoordinate } from 'src/types/cursor/cursorCoordinate';
import { CursorSelection } from 'src/types/selection/cursorSelection';

import React from 'react';

export type BlockPosition = {
  blockIndex: number;
};

export function useBlockPosition(
  nodes: (LineNode | BlockNode)[],
  cursorCoordinate: CursorCoordinate | undefined,
  cursorSelection: CursorSelection | undefined
): BlockPosition | undefined {
  const blockPosition = React.useMemo(() => {
    if (!cursorCoordinate) return undefined;
    const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, cursorSelection);
    const blockPosition = searchBlockPosition(firstLineIndex, nodes);
    if (!blockPosition) return undefined;
    const blockNode = nodes[blockPosition.blockIndex];
    if (!isBlockNode(blockNode) || lastLineIndex > blockNode.range[1]) return undefined;
    return blockPosition;
  }, [nodes, cursorCoordinate, cursorSelection]);
  return blockPosition;
}

function searchBlockPosition(lineIndex: number, nodes: (LineNode | BlockNode)[]): BlockPosition | undefined {
  if (nodes.length === 0) return undefined;

  const found = (() => {
    let [left, right] = [0, nodes.length - 1];
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      const node = nodes[mid];
      const range = isBlockNode(node) ? node.range : [node.lineIndex, node.lineIndex];
      if (lineIndex < range[0]) {
        right = mid - 1;
      } else if (range[1] < lineIndex) {
        left = mid + 1;
      } else {
        return mid;
      }
    }
    return left === right ? left : -1;
  })();

  if (found === -1) return undefined;
  return { blockIndex: found };
}

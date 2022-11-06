import React from 'react';

import { BlockNode, LineNode } from '../../../../parser/types';
import { isBlockNode } from '../../../../parser/utils';
import { CursorCoordinate } from '../../cursor/Cursor/types';
import { TextSelection } from '../../selection/Selection/types';
import { getLineRange } from '../common/utils';

import { BlockPosition } from './types';

export function useBlockPosition(
  nodes: (LineNode | BlockNode)[],
  cursorCoordinate: CursorCoordinate | undefined,
  textSelection: TextSelection | undefined
): BlockPosition | undefined {
  const blockPosition = React.useMemo(() => {
    if (!cursorCoordinate) return undefined;
    const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, textSelection);
    const blockPosition = searchBlockPosition(firstLineIndex, nodes);
    if (!blockPosition) return undefined;
    const blockNode = nodes[blockPosition.blockIndex];
    if (!isBlockNode(blockNode) || lastLineIndex > blockNode.range[1]) return undefined;
    return blockPosition;
  }, [nodes, cursorCoordinate, textSelection]);
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

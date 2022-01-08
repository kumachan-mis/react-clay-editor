import React from 'react';

import { CursorCoordinate } from '../Cursor/types';
import { BlockNode, LineNode } from '../parser/types';

import { ContentPosition } from './types';

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

export function useContentPosition(
  lineNodes: LineNode[],
  cursorCoordinate: CursorCoordinate | undefined
): ContentPosition | undefined {
  const contentPosition = React.useMemo(() => {
    if (!cursorCoordinate) return undefined;
    const lineNode = lineNodes[cursorCoordinate.lineIndex];
    if (lineNode.type !== 'normalLine' && lineNode.type !== 'itemization' && lineNode.type !== 'quotation') {
      return undefined;
    }
    const contentShallowIndex = rangeSearch(lineNode.children, cursorCoordinate.charIndex);
    const contentNode = lineNode.children[contentShallowIndex];
    let contentDeepIndex = undefined;
    if (contentNode.type === 'decoration') {
      contentDeepIndex = rangeSearch(contentNode.children, cursorCoordinate.charIndex);
    }
    return { lineIndex: cursorCoordinate.lineIndex, contentShallowIndex, contentDeepIndex };
  }, [lineNodes, cursorCoordinate]);
  return contentPosition;
}

function rangeSearch(sortedRangeObjs: { range: [number, number] }[], position: number): number {
  if (sortedRangeObjs.length === 0) return -1;

  const rangeMin = sortedRangeObjs[0].range[0];
  const rangeMax = sortedRangeObjs[sortedRangeObjs.length - 1].range[1];
  if (position < rangeMin || position > rangeMax + 1) return -1;

  if (position === rangeMax + 1) return sortedRangeObjs.length;

  let [left, right] = [0, sortedRangeObjs.length - 1];
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const rangeObj = sortedRangeObjs[mid];
    if (position < rangeObj.range[0]) {
      right = mid - 1;
    } else if (rangeObj.range[1] < position) {
      left = mid + 1;
    } else {
      return mid;
    }
  }
  return left;
}

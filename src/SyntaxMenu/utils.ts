import React from 'react';

import { CursorCoordinate } from '../Cursor/types';
import { TextSelection } from '../Selection/types';
import { BlockNode, ContentNode, LineNode } from '../parser/types';

import {
  ContentPosition,
  ContentPositionBetween,
  ContentPositionInner,
  ContentPositionLeftEnd,
  ContentPositionRightEnd,
} from './types';

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
  cursorCoordinate: CursorCoordinate | undefined,
  textSelection: TextSelection | undefined
): ContentPosition | undefined {
  const contentPosition = React.useMemo(() => {
    if (textSelection) return getContentPositionFromTextSelection(lineNodes, textSelection);
    if (cursorCoordinate) return getContentPositionFromCursorCoordinate(lineNodes, cursorCoordinate);
    return undefined;
  }, [lineNodes, cursorCoordinate, textSelection]);
  return contentPosition;
}

function getContentPositionFromTextSelection(
  lineNodes: LineNode[],
  textSelection: TextSelection
): ContentPosition | undefined {
  const { fixed, free } = textSelection;
  if (fixed.lineIndex !== free.lineIndex) return undefined;
  const lineNode = lineNodes[fixed.lineIndex];
  if (lineNode.type !== 'itemization' && lineNode.type !== 'quotation' && lineNode.type !== 'normalLine') {
    return undefined;
  }
  return recursiveGetContentPositionFromTextSelection(lineNode.children, textSelection);
}

function recursiveGetContentPositionFromTextSelection(
  contentNodes: ContentNode[],
  textSelection: TextSelection
): ContentPosition | undefined {
  const { fixed, free } = textSelection;
  const fixedContentPosition = searchContentPosition(contentNodes, fixed.charIndex);
  if (!fixedContentPosition) return undefined;
  if (free.charIndex === fixed.charIndex) return fixedContentPosition;

  let contentIndex = fixedContentPosition.contentIndexes[0];
  if (fixedContentPosition.type === 'between' && free.charIndex > fixed.charIndex) {
    contentIndex = fixedContentPosition.contentIndexes[1];
  }
  const contentNode = contentNodes[contentIndex];

  if (free.charIndex < contentNode.range[0] && free.charIndex > contentNode.range[1] + 1) return undefined;
  if (contentNode.type !== 'decoration') return { type: 'inner', contentIndexes: [contentIndex] };

  const childPosition = recursiveGetContentPositionFromTextSelection(contentNode.children, textSelection);
  if (!childPosition || childPosition.type === 'nested') {
    return { type: 'inner', contentIndexes: [contentIndex] };
  }
  return { type: 'nested', contentIndexes: [contentIndex], childPosition };
}

function getContentPositionFromCursorCoordinate(
  lineNodes: LineNode[],
  cursorCoordinate: CursorCoordinate
): ContentPosition | undefined {
  const lineNode = lineNodes[cursorCoordinate.lineIndex];
  if (lineNode.type !== 'itemization' && lineNode.type !== 'quotation' && lineNode.type !== 'normalLine') {
    return undefined;
  }
  return recursiveGetContentPositionFromCursorCoordinate(lineNode.children, cursorCoordinate);
}

function recursiveGetContentPositionFromCursorCoordinate(
  contentNodes: ContentNode[],
  cursorCoordinate: CursorCoordinate
): ContentPosition | undefined {
  const contentPosition = searchContentPosition(contentNodes, cursorCoordinate.charIndex);
  if (!contentPosition || contentPosition.type !== 'inner') return contentPosition;
  const contentNode = contentNodes[contentPosition.contentIndexes[0]];
  if (contentNode.type !== 'decoration') return contentPosition;
  const childPosition = recursiveGetContentPositionFromCursorCoordinate(contentNode.children, cursorCoordinate);
  if (!childPosition || childPosition.type === 'nested') return contentPosition;
  return { type: 'nested', contentIndexes: [...contentPosition.contentIndexes], childPosition };
}

function searchContentPosition(
  sortedRangeObjs: { range: [number, number] }[],
  position: number
): ContentPositionLeftEnd | ContentPositionRightEnd | ContentPositionBetween | ContentPositionInner | undefined {
  if (sortedRangeObjs.length === 0) return undefined;

  const rangeMin = sortedRangeObjs[0].range[0];
  const rangeMax = sortedRangeObjs[sortedRangeObjs.length - 1].range[1];
  if (position < rangeMin || position > rangeMax + 1) return undefined;

  if (position === rangeMin) return { type: 'leftend', contentIndexes: [0] };
  if (position === rangeMax + 1) return { type: 'rightend', contentIndexes: [sortedRangeObjs.length - 1] };

  const found = (() => {
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
  })();

  const rangeObj = sortedRangeObjs[found];
  if (position === rangeObj.range[0]) return { type: 'between', contentIndexes: [found - 1, found] };
  return { type: 'inner', contentIndexes: [found] };
}

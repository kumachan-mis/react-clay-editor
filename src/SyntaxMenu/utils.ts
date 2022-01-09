import React from 'react';

import { CursorCoordinate } from '../Cursor/types';
import { TextSelection } from '../Selection/types';
import { BlockNode, ContentNode, LineNode } from '../parser/types';
import { isPureLineNode } from '../parser/utils';

import { ContentPosition, ContentPositionNested } from './types';

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
    if (!cursorCoordinate) return undefined;
    if (textSelection) return getContentPositionFromTextSelection(lineNodes, textSelection);
    return getContentPositionFromCursorCoordinate(lineNodes, cursorCoordinate);
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
  if (!isPureLineNode(lineNode)) return undefined;
  return recursiveGetContentPositionFromTextSelection(lineNode.children, textSelection);
}

function recursiveGetContentPositionFromTextSelection(
  contentNodes: ContentNode[],
  textSelection: TextSelection
): ContentPosition | undefined {
  const { fixed, free } = textSelection;
  const fixedContentPosition = searchContentPosition(fixed, contentNodes);
  if (!fixedContentPosition || fixedContentPosition.type === 'empty') return undefined;
  if (free.charIndex === fixed.charIndex) return fixedContentPosition;

  let contentIndex = fixedContentPosition.contentIndexes[0];
  if (fixedContentPosition.type === 'between' && free.charIndex > fixed.charIndex) {
    contentIndex = fixedContentPosition.contentIndexes[1];
  }
  const contentNode = contentNodes[contentIndex];

  if (free.charIndex < contentNode.range[0] && free.charIndex > contentNode.range[1] + 1) return undefined;
  if (contentNode.type !== 'decoration') {
    return { type: 'inner', lineIndex: fixed.lineIndex, contentIndexes: [contentIndex] };
  }

  const childPosition = recursiveGetContentPositionFromTextSelection(contentNode.children, textSelection);
  if (!childPosition || childPosition.type === 'nested' || childPosition.type === 'empty') {
    return { type: 'inner', lineIndex: fixed.lineIndex, contentIndexes: [contentIndex] };
  }
  return { type: 'nested', lineIndex: fixed.lineIndex, contentIndexes: [contentIndex], childPosition };
}

function getContentPositionFromCursorCoordinate(
  lineNodes: LineNode[],
  cursorCoordinate: CursorCoordinate
): ContentPosition | undefined {
  const lineNode = lineNodes[cursorCoordinate.lineIndex];
  if (!isPureLineNode(lineNode)) return undefined;
  return recursiveGetContentPositionFromCursorCoordinate(lineNode.children, cursorCoordinate);
}

function recursiveGetContentPositionFromCursorCoordinate(
  contentNodes: ContentNode[],
  cursorCoordinate: CursorCoordinate
): ContentPosition | undefined {
  const contentPosition = searchContentPosition(cursorCoordinate, contentNodes);
  if (!contentPosition || contentPosition.type !== 'inner') return contentPosition;
  const contentNode = contentNodes[contentPosition.contentIndexes[0]];
  if (contentNode.type !== 'decoration') return contentPosition;
  const childPosition = recursiveGetContentPositionFromCursorCoordinate(contentNode.children, cursorCoordinate);
  if (!childPosition || childPosition.type === 'nested' || childPosition.type === 'empty') return contentPosition;
  return {
    type: 'nested',
    lineIndex: contentPosition.lineIndex,
    contentIndexes: [...contentPosition.contentIndexes],
    childPosition,
  };
}

function searchContentPosition(
  cursorCoordinate: CursorCoordinate,
  lineRangeObjs: ContentNode[]
): Exclude<ContentPosition, ContentPositionNested> | undefined {
  if (lineRangeObjs.length === 0) return { type: 'empty' };

  const { charIndex, lineIndex } = cursorCoordinate;
  const rangeMin = lineRangeObjs[0].range[0];
  const rangeMax = lineRangeObjs[lineRangeObjs.length - 1].range[1];
  if (charIndex < rangeMin || charIndex > rangeMax + 1) return undefined;

  if (charIndex === rangeMin) return { type: 'leftend', lineIndex, contentIndexes: [0] };
  if (charIndex === rangeMax + 1) return { type: 'rightend', lineIndex, contentIndexes: [lineRangeObjs.length - 1] };

  const found = (() => {
    let [left, right] = [0, lineRangeObjs.length - 1];
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      const rangeObj = lineRangeObjs[mid];
      if (charIndex < rangeObj.range[0]) {
        right = mid - 1;
      } else if (rangeObj.range[1] < charIndex) {
        left = mid + 1;
      } else {
        return mid;
      }
    }
    return left;
  })();

  const rangeObj = lineRangeObjs[found];
  if (charIndex === rangeObj.range[0]) return { type: 'between', lineIndex, contentIndexes: [found - 1, found] };
  return { type: 'inner', lineIndex, contentIndexes: [found] };
}

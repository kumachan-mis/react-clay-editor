import { TopLevelNode } from '../../../../parser';
import { CursorCoordinate } from '../../../../types/cursor/cursorCoordinate';
import { CursorSelection } from '../../../../types/selection/cursorSelection';
import { useEmbededLinkForceClickable } from '../../../atoms/text/EmbededLink/hooks';

import React from 'react';

export type UseTextNodeListReturn = {
  getEditMode: (node: TopLevelNode) => boolean;
  linkForceClickable: boolean;
};

export function useTextNodeList(
  cursorCoordinate?: CursorCoordinate,
  cursorSelection?: CursorSelection,
): UseTextNodeListReturn {
  const getEditMode = React.useCallback(
    (node: TopLevelNode) =>
      cursorOnTextNode(node, cursorCoordinate?.lineIndex) ||
      selectionOnTextNode(node, cursorSelection?.fixed.lineIndex, cursorSelection?.free.lineIndex),
    [cursorCoordinate?.lineIndex, cursorSelection?.fixed.lineIndex, cursorSelection?.free.lineIndex],
  );

  const linkForceClickable = useEmbededLinkForceClickable();

  return { getEditMode, linkForceClickable };
}

function cursorOnTextNode(node: TopLevelNode, cursorCoordinateLineIndex?: number): boolean {
  if (cursorCoordinateLineIndex === undefined) return false;
  if (node.type === 'blockCode' || node.type === 'blockFormula') {
    const [first, last] = node._lineRange;
    return first <= cursorCoordinateLineIndex && cursorCoordinateLineIndex <= last;
  }
  return cursorCoordinateLineIndex === node._lineIndex;
}

function selectionOnTextNode(
  node: TopLevelNode,
  cursorSelectionFixedLineIndex?: number,
  cursorSelectionFreeLineIndex?: number,
): boolean {
  if (cursorSelectionFixedLineIndex === undefined || cursorSelectionFreeLineIndex === undefined) return false;
  const startLineIndex = Math.min(cursorSelectionFixedLineIndex, cursorSelectionFreeLineIndex);
  const endLineIndex = Math.max(cursorSelectionFixedLineIndex, cursorSelectionFreeLineIndex);

  if (node.type === 'blockCode' || node.type === 'blockFormula') {
    const [first, last] = node._lineRange;
    return startLineIndex <= last && first <= endLineIndex;
  }
  return startLineIndex <= node._lineIndex && node._lineIndex <= endLineIndex;
}

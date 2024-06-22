import { TextNode } from '../../../../parser';
import { CursorCoordinate } from '../../../../types/cursor/cursorCoordinate';
import { CursorSelection } from '../../../../types/selection/cursorSelection';
import { useEmbededLinkForceClickable } from '../../../atoms/text/EmbededLink/hooks';

import React from 'react';

export type UseTextNodeListReturn = {
  getEditMode: (node: TextNode) => boolean;
  linkForceClickable: boolean;
};

export function useTextNodeList(
  cursorCoordinate?: CursorCoordinate,
  cursorSelection?: CursorSelection
): UseTextNodeListReturn {
  const getEditMode = React.useCallback(
    (node: TextNode) =>
      cursorOnTextNode(node, cursorCoordinate?.lineIndex) ||
      selectionOnTextNode(node, cursorSelection?.fixed.lineIndex, cursorSelection?.free.lineIndex),
    [cursorCoordinate?.lineIndex, cursorSelection?.fixed.lineIndex, cursorSelection?.free.lineIndex]
  );

  const linkForceClickable = useEmbededLinkForceClickable();

  return { getEditMode, linkForceClickable };
}

function cursorOnTextNode(node: TextNode, cursorCoordinateLineIndex?: number): boolean {
  if (cursorCoordinateLineIndex === undefined) return false;
  if (node.type === 'blockCode' || node.type === 'blockFormula') {
    const [first, last] = node.range;
    return first <= cursorCoordinateLineIndex && cursorCoordinateLineIndex <= last;
  }
  return cursorCoordinateLineIndex === node.lineIndex;
}

function selectionOnTextNode(
  node: TextNode,
  cursorSelectionFixedLineIndex?: number,
  cursorSelectionFreeLineIndex?: number
): boolean {
  if (cursorSelectionFixedLineIndex === undefined || cursorSelectionFreeLineIndex === undefined) return false;
  const startLineIndex = Math.min(cursorSelectionFixedLineIndex, cursorSelectionFreeLineIndex);
  const endLineIndex = Math.max(cursorSelectionFixedLineIndex, cursorSelectionFreeLineIndex);

  if (node.type === 'blockCode' || node.type === 'blockFormula') {
    const [first, last] = node.range;
    return startLineIndex <= last && first <= endLineIndex;
  }
  return startLineIndex <= node.lineIndex && node.lineIndex <= endLineIndex;
}

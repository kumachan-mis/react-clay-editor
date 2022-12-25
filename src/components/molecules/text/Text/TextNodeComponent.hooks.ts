import { selectionToRange } from '../../selection/Selection/utils';
import { useEmbededLinkForceClickable } from 'src/components/atoms/text/EmbededLink/hooks';
import { TextNode } from 'src/parser';
import { CursorCoordinate } from 'src/types/cursor/cursorCoordinate';
import { CursorSelection } from 'src/types/selection/cursorSelection';

import React from 'react';

export type UseTextNodeComponent = {
  getEditMode: (node: TextNode) => boolean;
  linkForceClickable: boolean;
};

export function useTextNodeComponent(
  cursorCoordinate?: CursorCoordinate,
  cursorSelection?: CursorSelection
): UseTextNodeComponent {
  const getEditMode = React.useCallback(
    (node: TextNode) => cursorOnTextNode(node, cursorCoordinate) || selectionOnTextNode(node, cursorSelection),
    [cursorCoordinate, cursorSelection]
  );

  const linkForceClickable = useEmbededLinkForceClickable();

  return { getEditMode, linkForceClickable };
}

function cursorOnTextNode(node: TextNode, cursorCoordinate?: CursorCoordinate): boolean {
  if (!cursorCoordinate) return false;
  if (node.type === 'blockCode' || node.type === 'blockFormula') {
    const [first, last] = node.range;
    return first <= cursorCoordinate.lineIndex && cursorCoordinate.lineIndex <= last;
  }
  return cursorCoordinate.lineIndex === node.lineIndex;
}

function selectionOnTextNode(node: TextNode, cursorSelection?: CursorSelection): boolean {
  if (!cursorSelection) return false;
  const { start, end } = selectionToRange(cursorSelection);

  if (node.type === 'blockCode' || node.type === 'blockFormula') {
    const [first, last] = node.range;
    return start.lineIndex <= last && first <= end.lineIndex;
  }
  return start.lineIndex <= node.lineIndex && node.lineIndex <= end.lineIndex;
}

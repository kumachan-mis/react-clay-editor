import React from 'react';

import { TextNode } from '../../../../parser';
import { useEmbededLinkForceClickable } from '../../../atoms/text/EmbededLink/hooks';
import { CursorCoordinate } from '../../cursor/Cursor/types';
import { CursorSelection } from '../../selection/Selection/types';
import { selectionToRange } from '../../selection/Selection/utils';

export type UseTextNodeComponent = {
  editMode: (node: TextNode) => boolean;
  linkForceClickable: boolean;
};

export function useTextNodeComponent(
  cursorCoordinate?: CursorCoordinate,
  cursorSelection?: CursorSelection
): UseTextNodeComponent {
  const editMode = React.useCallback(
    (node: TextNode) => cursorOnTextNode(node, cursorCoordinate) || selectionOnTextNode(node, cursorSelection),
    [cursorCoordinate, cursorSelection]
  );

  const linkForceClickable = useEmbededLinkForceClickable();

  return { editMode, linkForceClickable };
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

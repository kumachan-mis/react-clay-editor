import React from 'react';

import { useEmbededLinkForceClickable } from '../components/atoms/EmbededLink/hooks';
import { CursorCoordinate } from '../components/molecules/Cursor/types';
import { TextSelection } from '../components/molecules/Selection/types';
import { selectionToRange } from '../components/molecules/Selection/utils';
import { TextNode } from '../parser/types';

export type UseTextNodeComponent = {
  editMode: (node: TextNode) => boolean;
  linkForceClickable: boolean;
};

export function useTextNodeComponent(
  cursorCoordinate?: CursorCoordinate,
  textSelection?: TextSelection
): UseTextNodeComponent {
  const editMode = React.useCallback(
    (node: TextNode) => cursorOnTextNode(node, cursorCoordinate) || selectionOnTextNode(node, textSelection),
    [cursorCoordinate, textSelection]
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

function selectionOnTextNode(node: TextNode, textSelection?: TextSelection): boolean {
  if (!textSelection) return false;
  const { start, end } = selectionToRange(textSelection);

  if (node.type === 'blockCode' || node.type === 'blockFormula') {
    const [first, last] = node.range;
    return start.lineIndex <= last && first <= end.lineIndex;
  }
  return start.lineIndex <= node.lineIndex && node.lineIndex <= end.lineIndex;
}

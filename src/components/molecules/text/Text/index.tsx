import { TopLevelNode } from '../../../../parser';
import { CursorCoordinate } from '../../../../types/cursor/cursorCoordinate';
import { CursorSelection } from '../../../../types/selection/cursorSelection';
import { TextNodeVisuals } from '../common/textNodeVisuals';

import { TextNodeList } from './TextNodeList';
import { useTextNodeList } from './TextNodeList.hooks';

import React from 'react';

export type TextProps = {
  readonly nodes: TopLevelNode[];
  readonly cursorCoordinate?: CursorCoordinate;
  readonly cursorSelection?: CursorSelection;
} & TextNodeVisuals;

export const Text: React.FC<TextProps> = ({ nodes, cursorCoordinate, cursorSelection, ...visuals }) => {
  const { getEditMode, linkForceClickable } = useTextNodeList(cursorCoordinate, cursorSelection);

  return <TextNodeList {...visuals} getEditMode={getEditMode} linkForceClickable={linkForceClickable} nodes={nodes} />;
};

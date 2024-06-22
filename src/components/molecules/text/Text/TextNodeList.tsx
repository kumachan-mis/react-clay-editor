import { TopLevelNode } from '../../../../parser';
import { topLevelNodesEquals } from '../../../../parser/text/topLevelNode';
import { TextNodeVisuals, textNodeVisualsEquals } from '../common/textNodeVisuals';

import { TextNode } from './TextNode';

import React from 'react';

export type TextNodeListProps = {
  readonly nodes: TopLevelNode[];
  readonly getEditMode: (node: TopLevelNode) => boolean;
  readonly linkForceClickable: boolean;
} & TextNodeVisuals;

const TextNodeListComponent: React.FC<TextNodeListProps> = ({ nodes, getEditMode, ...rest }) => (
  <div>
    {nodes.map((node, index) => (
      <TextNode editMode={getEditMode(node)} key={index} node={node} {...rest} />
    ))}
  </div>
);

export const TextNodeList = React.memo(
  TextNodeListComponent,
  (prev, next) =>
    topLevelNodesEquals(prev.nodes, next.nodes) &&
    prev.getEditMode === next.getEditMode &&
    prev.linkForceClickable === next.linkForceClickable &&
    textNodeVisualsEquals(prev, next)
);

import { ItemizationNode, itemizationNodeEquals } from '../../../../parser/itemization/itemizationNode';
import { ItemBullet } from '../../../atoms/text/ItemBullet';
import { ItemBulletContent } from '../../../atoms/text/ItemBulletContent';
import { Line } from '../../../atoms/text/Line';
import { LineContent } from '../../../atoms/text/LineContent';
import { LineIndent } from '../../../atoms/text/LineIndent';
import { TextNode } from '../Text/TextNode';
import { TextNodeProps, createTextNodePropsEquals } from '../common/TextNodeProps';

import React from 'react';

export type ItemizationProps = TextNodeProps<ItemizationNode>;

export const ItemizationConstants = {
  styleId: 'itemization',
};

const ItemizationComponent: React.FC<ItemizationProps> = ({ node, editMode, ...rest }) => {
  const { lineIndex, indentDepth, bullet, contentLength, children } = node;
  const lineLength = indentDepth + bullet.length + contentLength;

  return (
    <Line data-styleid={ItemizationConstants.styleId} lineIndex={lineIndex}>
      <LineIndent indentDepth={indentDepth} />
      <ItemBullet bullet={bullet} indentDepth={indentDepth} />
      <LineContent indentDepth={indentDepth + 1} lineLength={lineLength}>
        <ItemBulletContent bullet={bullet} cursorOn={editMode} indentDepth={indentDepth} />
        {children.map((child, index) => (
          <TextNode editMode={editMode} key={index} node={child} {...rest} />
        ))}
      </LineContent>
    </Line>
  );
};

export const Itemization: React.FC<ItemizationProps> = React.memo(
  ItemizationComponent,
  createTextNodePropsEquals(itemizationNodeEquals)
);

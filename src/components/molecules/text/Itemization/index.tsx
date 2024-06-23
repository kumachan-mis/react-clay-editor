import { ItemizationNode, itemizationNodeEquals } from '../../../../parser/itemization/itemizationNode';
import { ItemBullet } from '../../../atoms/text/ItemBullet';
import { ItemBulletContent } from '../../../atoms/text/ItemBulletContent';
import { Line } from '../../../atoms/text/Line';
import { LineContent } from '../../../atoms/text/LineContent';
import { LineIndent } from '../../../atoms/text/LineIndent';
import { TextNodeProps, createTextNodePropsEquals } from '../common/TextNodeProps';

import React from 'react';

export type ItemizationProps = {
  readonly ChildComponent: React.FC<TextNodeProps>;
} & TextNodeProps<ItemizationNode>;

export const ItemizationConstants = {
  styleId: 'itemization',
};

const ItemizationComponent: React.FC<ItemizationProps> = ({ node, editMode, textVisual, ChildComponent, ...rest }) => {
  const { lineIndex, indentDepth, bullet, contentLength, children } = node;
  const lineLength = indentDepth + bullet.length + contentLength;
  const lineProps = textVisual?.lineProps?.(lineIndex);

  return (
    <Line lineIndex={lineIndex} {...lineProps} data-styleid={ItemizationConstants.styleId}>
      <LineIndent indentDepth={indentDepth} />
      <ItemBullet bullet={bullet} indentDepth={indentDepth} />
      <LineContent indentDepth={indentDepth + 1} lineLength={lineLength}>
        <ItemBulletContent bullet={bullet} cursorOn={editMode} indentDepth={indentDepth} />
        {children.map((child, index) => (
          <ChildComponent editMode={editMode} key={index} node={child} textVisual={textVisual} {...rest} />
        ))}
      </LineContent>
    </Line>
  );
};

export const Itemization: React.FC<ItemizationProps> = React.memo(
  ItemizationComponent,
  createTextNodePropsEquals(itemizationNodeEquals)
);

import React from 'react';

import { ItemizationNode, TextNode } from '../../../../parser/types';
import { ItemBullet } from '../../../atoms/text/ItemBullet';
import { ItemBulletContent } from '../../../atoms/text/ItemBulletContent';
import { Line } from '../../../atoms/text/Line';
import { LineContent } from '../../../atoms/text/LineContent';
import { LineIndent } from '../../../atoms/text/LineIndent';
import { TextNodeComponentProps } from '../common/types';

export type ItemizationProps = {
  ChildComponent: React.FC<TextNodeComponentProps<TextNode>>;
} & TextNodeComponentProps<ItemizationNode>;

export const Itemization: React.FC<ItemizationProps> = ({ node, editMode, textVisual, ChildComponent, ...rest }) => {
  const { lineIndex, indentDepth, bullet, contentLength, children } = node;
  const lineLength = indentDepth + bullet.length + contentLength;
  const lineProps = textVisual?.lineProps?.(lineIndex);
  const editModeValue = editMode(node);

  return (
    <Line lineIndex={lineIndex} {...lineProps}>
      <LineIndent lineIndex={lineIndex} indentDepth={indentDepth} />
      <ItemBullet lineIndex={lineIndex} indentDepth={indentDepth} bullet={bullet} />
      <LineContent lineIndex={lineIndex} indentDepth={indentDepth + 1} lineLength={lineLength}>
        <ItemBulletContent lineIndex={lineIndex} indentDepth={indentDepth} bullet={bullet} cursorOn={editModeValue} />
        {children.map((child, index) => (
          <ChildComponent key={index} node={child} editMode={editMode} textVisual={textVisual} {...rest} />
        ))}
      </LineContent>
    </Line>
  );
};

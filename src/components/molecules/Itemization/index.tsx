import React from 'react';

import { ItemizationNode, SyntaxNode } from '../../../parser/types';
import { ItemBullet } from '../../atoms/ItemBullet';
import { ItemBulletContent } from '../../atoms/ItemBulletContent';
import { Line } from '../../atoms/Line';
import { LineContent } from '../../atoms/LineContent';
import { LineIndent } from '../../atoms/LineIndent';
import { SyntaxNodeComponentProps } from '../_common/types';
import { cursorOnSyntaxNode } from '../_common/utils';

export type ItemizationProps = {
  ChildComponent: React.FC<SyntaxNodeComponentProps<SyntaxNode>>;
} & SyntaxNodeComponentProps<ItemizationNode>;

export const Itemization: React.FC<ItemizationProps> = ({
  node,
  cursorCoordinate,
  textSelection,
  textVisual,
  ChildComponent,
  ...rest
}) => {
  const { lineIndex, indentDepth, bullet, contentLength, children } = node;
  const lineLength = indentDepth + bullet.length + contentLength;
  const lineProps = textVisual?.lineProps?.(lineIndex);
  const cursorOn = cursorOnSyntaxNode(node, cursorCoordinate, textSelection);

  return (
    <Line lineIndex={lineIndex} {...lineProps}>
      <LineIndent lineIndex={lineIndex} indentDepth={indentDepth} />
      <ItemBullet lineIndex={lineIndex} indentDepth={indentDepth} bullet={bullet} />
      <LineContent lineIndex={lineIndex} indentDepth={indentDepth + 1} lineLength={lineLength}>
        <ItemBulletContent lineIndex={lineIndex} indentDepth={indentDepth} bullet={bullet} cursorOn={cursorOn} />
        {children.map((child, index) => (
          <ChildComponent
            key={index}
            node={child}
            cursorCoordinate={cursorCoordinate}
            textSelection={textSelection}
            textVisual={textVisual}
            {...rest}
          />
        ))}
      </LineContent>
    </Line>
  );
};

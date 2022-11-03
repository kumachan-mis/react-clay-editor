import React from 'react';

import { NormalLineNode, SyntaxNode } from '../../../parser/types';
import { Line } from '../../atoms/Line';
import { LineContent } from '../../atoms/LineContent';
import { SyntaxNodeComponentProps } from '../_common/types';

export type NormalLineProps = {
  ChildComponent: React.FC<SyntaxNodeComponentProps<SyntaxNode>>;
} & SyntaxNodeComponentProps<NormalLineNode>;

export const NormalLine: React.FC<NormalLineProps> = ({ node, textVisual, ChildComponent, ...rest }) => {
  const { lineIndex, contentLength, children } = node;
  const lineProps = textVisual?.lineProps?.(lineIndex);

  return (
    <Line lineIndex={lineIndex} {...lineProps}>
      <LineContent lineIndex={lineIndex} lineLength={contentLength}>
        {children.map((child, index) => (
          <ChildComponent key={index} node={child} textVisual={textVisual} {...rest} />
        ))}
      </LineContent>
    </Line>
  );
};

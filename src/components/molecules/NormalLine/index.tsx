import React from 'react';

import { NormalLineNode, TextNode } from '../../../parser/types';
import { Line } from '../../atoms/Line';
import { LineContent } from '../../atoms/LineContent';
import { TextNodeComponentProps } from '../_common/types';

export type NormalLineProps = {
  ChildComponent: React.FC<TextNodeComponentProps<TextNode>>;
} & TextNodeComponentProps<NormalLineNode>;

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

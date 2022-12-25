import { TextNodeComponentProps } from '../common/types';
import { Line } from 'src/components/atoms/text/Line';
import { LineContent } from 'src/components/atoms/text/LineContent';
import { TextNode } from 'src/parser';
import { NormalLineNode } from 'src/parser/normalLine/types';

import React from 'react';

export type NormalLineProps = {
  ChildComponent: React.FC<TextNodeComponentProps<TextNode>>;
} & TextNodeComponentProps<NormalLineNode>;

export const NormalLineConstants = {
  styleId: 'normal-line',
};

export const NormalLine: React.FC<NormalLineProps> = ({ node, textVisual, ChildComponent, ...rest }) => {
  const { lineIndex, contentLength, children } = node;
  const lineProps = textVisual?.lineProps?.(lineIndex);

  return (
    <Line lineIndex={lineIndex} {...lineProps} data-styleid={NormalLineConstants.styleId}>
      <LineContent lineIndex={lineIndex} lineLength={contentLength}>
        {children.map((child, index) => (
          <ChildComponent key={index} node={child} textVisual={textVisual} {...rest} />
        ))}
      </LineContent>
    </Line>
  );
};

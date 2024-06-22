import { NormalLineNode, normalLineNodeEquals } from '../../../../parser/normalLine/normalLineNode';
import { Line } from '../../../atoms/text/Line';
import { LineContent } from '../../../atoms/text/LineContent';
import { TextNodeProps, createTextNodePropsEquals } from '../common/TextNodeProps';

import React from 'react';

export type NormalLineProps = {
  readonly ChildComponent: React.FC<TextNodeProps>;
} & TextNodeProps<NormalLineNode>;

export const NormalLineConstants = {
  styleId: 'normal-line',
};

const NormalLineComponent: React.FC<NormalLineProps> = ({ node, textVisual, ChildComponent, ...rest }) => {
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

export const NormalLine: React.FC<NormalLineProps> = React.memo(
  NormalLineComponent,
  createTextNodePropsEquals(normalLineNodeEquals)
);

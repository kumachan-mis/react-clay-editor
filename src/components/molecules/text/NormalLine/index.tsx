import { NormalLineNode, normalLineNodeEquals } from '../../../../parser/normalLine/normalLineNode';
import { Line } from '../../../atoms/text/Line';
import { LineContent } from '../../../atoms/text/LineContent';
import { TextNode } from '../Text/TextNode';
import { TextNodeProps, createTextNodePropsEquals } from '../common/TextNodeProps';

import React from 'react';

export type NormalLineProps = TextNodeProps<NormalLineNode>;

export const NormalLineConstants = {
  styleId: 'normal-line',
};

const NormalLineComponent: React.FC<NormalLineProps> = ({ node, ...rest }) => {
  const { lineIndex, contentLength, children } = node;

  return (
    <Line data-styleid={NormalLineConstants.styleId} lineIndex={lineIndex}>
      <LineContent lineLength={contentLength}>
        {children.map((child, index) => (
          <TextNode key={index} node={child} {...rest} />
        ))}
      </LineContent>
    </Line>
  );
};

export const NormalLine: React.FC<NormalLineProps> = React.memo(
  NormalLineComponent,
  createTextNodePropsEquals(normalLineNodeEquals)
);

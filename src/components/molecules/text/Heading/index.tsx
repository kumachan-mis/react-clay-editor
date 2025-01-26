import { DecorationConfig } from '../../../../parser/decoration/decorationConfig';
import { HeadingNode, headingNodeEquals } from '../../../../parser/heading/headingNoode';
import { Line } from '../../../atoms/text/Line';
import { LineContent } from '../../../atoms/text/LineContent';
import { Decoration } from '../Decoration';
import { TextNodeProps, createTextNodePropsEquals } from '../common/TextNodeProps';

import React from 'react';

export type HeadingProps = TextNodeProps<HeadingNode>;

export const HeadingConstants = {
  styleId: (config: DecorationConfig) => `heading-${config.size}`,
};

const HeadingComponent: React.FC<HeadingProps> = ({ node, ...rest }) => {
  const {
    lineId,
    contentLength,
    children: { [0]: child },
  } = node;

  return (
    <Line data-styleid={HeadingConstants.styleId(child.config)} lineId={lineId}>
      <LineContent lineLength={contentLength}>
        <Decoration node={child} {...rest} />
      </LineContent>
    </Line>
  );
};

export const Heading: React.FC<HeadingProps> = React.memo(
  HeadingComponent,
  createTextNodePropsEquals(headingNodeEquals),
);

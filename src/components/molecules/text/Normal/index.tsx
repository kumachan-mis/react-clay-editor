import { NormalNode, normalNodeEquals } from '../../../../parser/normal/normalNode';
import { Char } from '../../../atoms/text/Char';
import { TextNodeProps } from '../common/TextNodeProps';

import React from 'react';

export type NormalProps = TextNodeProps<NormalNode>;

export const NormalConstants = {
  styleId: 'normal',
};

const NormalComponent: React.FC<NormalProps> = ({ node }) => {
  const { text } = node;
  const [first] = node.range;

  return (
    <span data-styleid={NormalConstants.styleId}>
      {[...text].map((char, index) => (
        <Char charIndex={first + index} key={first + index}>
          {char}
        </Char>
      ))}
    </span>
  );
};

export const Normal = React.memo(NormalComponent, (prev, next) => normalNodeEquals(prev.node, next.node));

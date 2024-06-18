import { NormalNode } from '../../../../parser/normal/types';
import { Char } from '../../../atoms/text/Char';
import { TextNodeComponentProps } from '../common/types';

import React from 'react';

export type NormalProps = TextNodeComponentProps<NormalNode>;

export const NormalConstants = {
  styleId: 'normal',
};

const NormalComponent: React.FC<NormalProps> = ({ node }) => {
  const { lineIndex, text } = node;
  const [first] = node.range;

  return (
    <span data-styleid={NormalConstants.styleId}>
      {[...text].map((char, index) => (
        <Char charIndex={first + index} key={first + index} lineIndex={lineIndex}>
          {char}
        </Char>
      ))}
    </span>
  );
};

function normalNodeEquals(a: NormalNode, b: NormalNode): boolean {
  return a.lineIndex === b.lineIndex && a.range[0] === b.range[0] && a.range[1] === b.range[1] && a.text === b.text;
}

export const Normal = React.memo(NormalComponent, (prev, next) => normalNodeEquals(prev.node, next.node));

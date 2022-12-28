import { NormalNode } from '../../../../parser/normal/types';
import { Char } from '../../../atoms/text/Char';
import { TextNodeComponentProps } from '../common/types';

import React from 'react';

export type NormalProps = TextNodeComponentProps<NormalNode>;

export const NormalConstants = {
  styleId: 'normal',
};

export const Normal: React.FC<NormalProps> = ({ node }) => {
  const { lineIndex, text } = node;
  const [first] = node.range;

  return (
    <span data-styleid={NormalConstants.styleId}>
      {[...text].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {char}
        </Char>
      ))}
    </span>
  );
};

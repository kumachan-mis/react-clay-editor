import React from 'react';

import { NormalNode } from '../../../../parser/types';
import { Char } from '../../../atoms/text/Char';
import { TextNodeComponentProps } from '../common/types';

export type NormalProps = TextNodeComponentProps<NormalNode>;

export const Normal: React.FC<NormalProps> = ({ node }) => {
  const { lineIndex, text } = node;
  const [first] = node.range;

  return (
    <>
      {[...text].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {char}
        </Char>
      ))}
    </>
  );
};

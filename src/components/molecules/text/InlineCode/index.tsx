import React from 'react';

import { InlineCodeNode } from '../../../../parser/inlineCode/types';
import { Char } from '../../../atoms/text/Char';
import { Monospace } from '../../../atoms/text/Monospace';
import { TextNodeComponentProps } from '../common/types';

export type InlineCodeProps = TextNodeComponentProps<InlineCodeNode>;

export const InlineCodeConstants = {
  styleId: 'inline-code',
};

export const InlineCode: React.FC<InlineCodeProps> = ({ node, getEditMode, codeVisual }) => {
  const { lineIndex, facingMeta, code, trailingMeta } = node;
  const [first, last] = node.range;
  const editMode = getEditMode(node);
  const codeElementProps = codeVisual?.codeProps?.(code);

  return (
    <Monospace {...codeElementProps} data-styleid={InlineCodeConstants.styleId}>
      {[...facingMeta].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {editMode ? char : ''}
        </Char>
      ))}
      {[...code].map((char, index) => (
        <Char
          key={first + facingMeta.length + index}
          lineIndex={lineIndex}
          charIndex={first + facingMeta.length + index}
        >
          {char}
        </Char>
      ))}
      {[...trailingMeta].map((char, index) => (
        <Char
          key={last - (trailingMeta.length - 1) + index}
          lineIndex={lineIndex}
          charIndex={last - (trailingMeta.length - 1) + index}
        >
          {editMode ? char : ''}
        </Char>
      ))}
    </Monospace>
  );
};

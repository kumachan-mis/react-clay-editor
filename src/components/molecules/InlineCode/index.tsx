import React from 'react';

import { InlineCodeNode } from '../../../parser/types';
import { Char } from '../../atoms/Char';
import { Monospace } from '../../atoms/Monospace';
import { SyntaxNodeComponentProps } from '../_common/types';

export type InlineCodeProps = SyntaxNodeComponentProps<InlineCodeNode>;

export const InlineCode: React.FC<InlineCodeProps> = ({ node, editMode, codeVisual }) => {
  const { lineIndex, facingMeta, code, trailingMeta } = node;
  const [first, last] = node.range;
  const editModeValue = editMode(node);
  const codeElementProps = codeVisual?.codeProps?.(code);

  return (
    <Monospace {...codeElementProps}>
      {[...facingMeta].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {editModeValue ? char : ''}
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
          {editModeValue ? char : ''}
        </Char>
      ))}
    </Monospace>
  );
};

import { InlineCodeNode, inlineCodeNodeEquals } from '../../../../parser/inlineCode/inlineCodeNode';
import { Char } from '../../../atoms/text/Char';
import { Monospace } from '../../../atoms/text/Monospace';
import { TextNodeProps } from '../common/TextNodeProps';

import React from 'react';

export type InlineCodeProps = TextNodeProps<InlineCodeNode>;

export const InlineCodeConstants = {
  styleId: 'inline-code',
};

const InlineCodeComponent: React.FC<InlineCodeProps> = ({ node, editMode, codeVisual }) => {
  const { facingMeta, code, trailingMeta } = node;
  const [first, last] = node.range;
  const codeElementProps = codeVisual?.codeProps?.(code);

  return (
    <Monospace {...codeElementProps} data-styleid={InlineCodeConstants.styleId}>
      {[...facingMeta].map((char, index) => (
        <Char charIndex={first + index} key={first + index}>
          {editMode ? char : ''}
        </Char>
      ))}
      {[...code].map((char, index) => (
        <Char charIndex={first + facingMeta.length + index} key={first + facingMeta.length + index}>
          {char}
        </Char>
      ))}
      {[...trailingMeta].map((char, index) => (
        <Char charIndex={last - (trailingMeta.length - 1) + index} key={last - (trailingMeta.length - 1) + index}>
          {editMode ? char : ''}
        </Char>
      ))}
    </Monospace>
  );
};

export const InlineCode = React.memo(
  InlineCodeComponent,
  (prev, next) =>
    inlineCodeNodeEquals(prev.node, next.node) && prev.editMode === next.editMode && prev.codeVisual === next.codeVisual
);

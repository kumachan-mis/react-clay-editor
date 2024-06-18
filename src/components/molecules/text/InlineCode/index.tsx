import { InlineCodeNode } from '../../../../parser/inlineCode/types';
import { Char } from '../../../atoms/text/Char';
import { Monospace } from '../../../atoms/text/Monospace';
import { TextNodeComponentProps } from '../common/types';

import React from 'react';

export type InlineCodeProps = TextNodeComponentProps<InlineCodeNode>;

export const InlineCodeConstants = {
  styleId: 'inline-code',
};

const InlineCodeComponent: React.FC<InlineCodeProps> = ({ node, getEditMode, codeVisual }) => {
  const { lineIndex, facingMeta, code, trailingMeta } = node;
  const [first, last] = node.range;
  const editMode = getEditMode(node);
  const codeElementProps = codeVisual?.codeProps?.(code);

  return (
    <Monospace {...codeElementProps} data-styleid={InlineCodeConstants.styleId}>
      {[...facingMeta].map((char, index) => (
        <Char charIndex={first + index} key={first + index} lineIndex={lineIndex}>
          {editMode ? char : ''}
        </Char>
      ))}
      {[...code].map((char, index) => (
        <Char
          charIndex={first + facingMeta.length + index}
          key={first + facingMeta.length + index}
          lineIndex={lineIndex}
        >
          {char}
        </Char>
      ))}
      {[...trailingMeta].map((char, index) => (
        <Char
          charIndex={last - (trailingMeta.length - 1) + index}
          key={last - (trailingMeta.length - 1) + index}
          lineIndex={lineIndex}
        >
          {editMode ? char : ''}
        </Char>
      ))}
    </Monospace>
  );
};

function inlineCodeNodeEquals(a: InlineCodeNode, b: InlineCodeNode): boolean {
  return (
    a.lineIndex === b.lineIndex &&
    a.range[0] === b.range[0] &&
    a.range[1] === b.range[1] &&
    a.facingMeta === b.facingMeta &&
    a.code === b.code &&
    a.trailingMeta === b.trailingMeta
  );
}

export const InlineCode = React.memo(
  InlineCodeComponent,
  (prev, next) =>
    inlineCodeNodeEquals(prev.node, next.node) &&
    prev.getEditMode === next.getEditMode &&
    prev.codeVisual === next.codeVisual
);

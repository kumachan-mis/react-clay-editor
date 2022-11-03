import React from 'react';

import { BracketLinkNode } from '../../../parser/types';
import { Char } from '../../atoms/Char';
import { EmbededLink } from '../../atoms/EmbededLink';
import { SyntaxNodeComponentProps } from '../_common/types';

export type BracketLinkProps = SyntaxNodeComponentProps<BracketLinkNode>;

export const BracketLink: React.FC<BracketLinkProps> = ({ node, editMode, linkForceClickable, bracketLinkVisual }) => {
  const { lineIndex, facingMeta, linkName, trailingMeta } = node;
  const [first, last] = node.range;
  const editModeValue = editMode(node);

  return (
    <EmbededLink
      editMode={editModeValue}
      forceClickable={linkForceClickable}
      anchorProps={(clickable) => bracketLinkVisual?.anchorProps?.(linkName, clickable)}
    >
      {[...facingMeta].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {editModeValue ? char : ''}
        </Char>
      ))}
      {[...linkName].map((char, index) => (
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
    </EmbededLink>
  );
};

import React from 'react';

import { BracketLinkNode } from '../../../parser/types';
import { Char } from '../../atoms/Char';
import { EmbededLink } from '../../atoms/EmbededLink';
import { SyntaxNodeComponentProps } from '../_common/types';
import { cursorOnSyntaxNode } from '../_common/utils';

export type BracketLinkProps = SyntaxNodeComponentProps<BracketLinkNode>;

export const BracketLink: React.FC<BracketLinkProps> = ({
  node,
  cursorCoordinate,
  textSelection,
  linkForceClickable,
  bracketLinkVisual,
}) => {
  const { lineIndex, facingMeta, linkName, trailingMeta } = node;
  const [first, last] = node.range;
  const cursorOn = cursorOnSyntaxNode(node, cursorCoordinate, textSelection);

  return (
    <EmbededLink
      cursorOn={cursorOn}
      forceClickable={linkForceClickable}
      anchorProps={(clickable) => bracketLinkVisual?.anchorProps?.(linkName, clickable)}
    >
      {[...facingMeta].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {cursorOn ? char : ''}
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
          {cursorOn ? char : ''}
        </Char>
      ))}
    </EmbededLink>
  );
};

import React from 'react';

import { BracketLinkNode } from '../../../../parser/bracketLink/types';
import { Char } from '../../../atoms/text/Char';
import { EmbededLink } from '../../../atoms/text/EmbededLink';
import { TextNodeComponentProps } from '../common/types';

export type BracketLinkProps = TextNodeComponentProps<BracketLinkNode>;

export const BracketLinkConstants = {
  styleId: 'bracket-link',
};

export const BracketLink: React.FC<BracketLinkProps> = ({
  node,
  getEditMode,
  linkForceClickable,
  bracketLinkVisual,
}) => {
  const { lineIndex, facingMeta, linkName, trailingMeta } = node;
  const [first, last] = node.range;
  const editMode = getEditMode(node);

  return (
    <EmbededLink
      editMode={editMode}
      forceClickable={linkForceClickable}
      anchorProps={(clickable) => bracketLinkVisual?.anchorProps?.(linkName, clickable)}
      data-styleid={BracketLinkConstants.styleId}
    >
      {[...facingMeta].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {editMode ? char : ''}
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
          {editMode ? char : ''}
        </Char>
      ))}
    </EmbededLink>
  );
};

import { BracketLinkNode } from '../../../../parser/bracketLink/types';
import { Char } from '../../../atoms/text/Char';
import { EmbededLink } from '../../../atoms/text/EmbededLink';
import { TextNodeComponentProps } from '../common/types';

import React from 'react';

export type BracketLinkProps = TextNodeComponentProps<BracketLinkNode>;

export const BracketLinkConstants = {
  styleId: 'bracket-link',
};

const BracketLinkComponent: React.FC<BracketLinkProps> = ({
  node,
  editMode,
  linkForceClickable,
  bracketLinkVisual,
}) => {
  const { lineIndex, facingMeta, linkName, trailingMeta } = node;
  const [first, last] = node.range;

  return (
    <EmbededLink
      anchorProps={(clickable) => bracketLinkVisual?.anchorProps?.(linkName, clickable)}
      data-styleid={BracketLinkConstants.styleId}
      editMode={editMode}
      forceClickable={linkForceClickable}
    >
      {[...facingMeta].map((char, index) => (
        <Char charIndex={first + index} key={first + index} lineIndex={lineIndex}>
          {editMode ? char : ''}
        </Char>
      ))}
      {[...linkName].map((char, index) => (
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
    </EmbededLink>
  );
};

function bracketLinkNodeEquals(a: BracketLinkNode, b: BracketLinkNode): boolean {
  return (
    a.lineIndex === b.lineIndex &&
    a.range[0] === b.range[0] &&
    a.range[1] === b.range[1] &&
    a.facingMeta === b.facingMeta &&
    a.linkName === b.linkName &&
    a.trailingMeta === b.trailingMeta
  );
}

export const BracketLink = React.memo(
  BracketLinkComponent,
  (prev, next) =>
    bracketLinkNodeEquals(prev.node, next.node) &&
    prev.editMode === next.editMode &&
    prev.linkForceClickable === next.linkForceClickable &&
    prev.bracketLinkVisual === next.bracketLinkVisual
);

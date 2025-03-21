import { BracketLinkNode, bracketLinkNodeEquals } from '../../../../parser/bracketLink/bracketLinkNode';
import { Char } from '../../../atoms/text/Char';
import { EmbededLink } from '../../../atoms/text/EmbededLink';
import { TextNodeProps } from '../common/TextNodeProps';

import React from 'react';

export type BracketLinkProps = TextNodeProps<BracketLinkNode>;

export const BracketLinkConstants = {
  styleId: 'bracket-link',
};

const BracketLinkComponent: React.FC<BracketLinkProps> = ({
  node,
  editMode,
  linkForceClickable,
  bracketLinkVisual,
}) => {
  const { facingMeta, linkName, trailingMeta } = node;
  const [first, last] = node.range;

  return (
    <EmbededLink
      anchorProps={(clickable) => bracketLinkVisual?.anchorProps?.(linkName, clickable)}
      data-styleid={BracketLinkConstants.styleId}
      editMode={editMode}
      forceClickable={linkForceClickable}
    >
      {facingMeta.split('').map((char, index) => (
        <Char charIndex={first + index} key={first + index}>
          {editMode ? char : ''}
        </Char>
      ))}
      {linkName.split('').map((char, index) => (
        <Char charIndex={first + facingMeta.length + index} key={first + facingMeta.length + index}>
          {char}
        </Char>
      ))}
      {trailingMeta.split('').map((char, index) => (
        <Char charIndex={last - (trailingMeta.length - 1) + index} key={last - (trailingMeta.length - 1) + index}>
          {editMode ? char : ''}
        </Char>
      ))}
    </EmbededLink>
  );
};

export const BracketLink = React.memo(
  BracketLinkComponent,
  (prev, next) =>
    bracketLinkNodeEquals(prev.node, next.node) &&
    prev.editMode === next.editMode &&
    prev.linkForceClickable === next.linkForceClickable &&
    prev.bracketLinkVisual === next.bracketLinkVisual,
);

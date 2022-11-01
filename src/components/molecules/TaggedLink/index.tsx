import React from 'react';

import { TaggedLinkNode } from '../../../parser/types';
import { getTagName, splitTag } from '../../../parser/utils';
import { Char } from '../../atoms/Char';
import { EmbededLink } from '../../atoms/EmbededLink';
import { SyntaxNodeComponentProps } from '../_common/types';
import { cursorOnSyntaxNode } from '../_common/utils';

export type TaggedLinkProps = SyntaxNodeComponentProps<TaggedLinkNode>;

export const TaggedLink: React.FC<TaggedLinkProps> = ({
  node,
  cursorCoordinate,
  textSelection,
  linkForceClickable,
  taggedLinkVisualMap,
}) => {
  const { lineIndex, linkName, trailingMeta } = node;
  const [facingMeta, tag] = splitTag(node.facingMeta);
  const [first, last] = node.range;
  const cursorOn = cursorOnSyntaxNode(node, cursorCoordinate, textSelection);
  const taggedLinkVisual = taggedLinkVisualMap?.[getTagName(node.facingMeta)];

  return (
    <EmbededLink
      cursorOn={cursorOn}
      forceClickable={linkForceClickable}
      anchorProps={(clickable) => taggedLinkVisual?.anchorProps?.(linkName, clickable)}
    >
      {[...facingMeta].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {cursorOn ? char : ''}
        </Char>
      ))}
      {[...tag].map((char, index) => (
        <Char
          key={first + facingMeta.length + index}
          lineIndex={lineIndex}
          charIndex={first + facingMeta.length + index}
        >
          {cursorOn || !taggedLinkVisual?.tagHidden ? char : ''}
        </Char>
      ))}
      {[...linkName].map((char, index) => (
        <Char
          key={first + facingMeta.length + tag.length + index}
          lineIndex={lineIndex}
          charIndex={first + facingMeta.length + tag.length + index}
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

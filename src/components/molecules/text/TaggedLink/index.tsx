import React from 'react';

import { TaggedLinkNode } from '../../../../parser/types';
import { getTagName, splitTag } from '../../../../parser/utils';
import { Char } from '../../../atoms/text/Char';
import { EmbededLink } from '../../../atoms/text/EmbededLink';
import { TextNodeComponentProps } from '../common/types';

export type TaggedLinkProps = TextNodeComponentProps<TaggedLinkNode>;

export const TaggedLink: React.FC<TaggedLinkProps> = ({ node, editMode, linkForceClickable, taggedLinkVisualMap }) => {
  const { lineIndex, linkName, trailingMeta } = node;
  const [facingMeta, tag] = splitTag(node.facingMeta);
  const [first, last] = node.range;
  const editModeValue = editMode(node);
  const taggedLinkVisual = taggedLinkVisualMap?.[getTagName(node.facingMeta)];

  return (
    <EmbededLink
      editMode={editModeValue}
      forceClickable={linkForceClickable}
      anchorProps={(clickable) => taggedLinkVisual?.anchorProps?.(linkName, clickable)}
    >
      {[...facingMeta].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {editModeValue ? char : ''}
        </Char>
      ))}
      {[...tag].map((char, index) => (
        <Char
          key={first + facingMeta.length + index}
          lineIndex={lineIndex}
          charIndex={first + facingMeta.length + index}
        >
          {editModeValue || !taggedLinkVisual?.tagHidden ? char : ''}
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
          {editModeValue ? char : ''}
        </Char>
      ))}
    </EmbededLink>
  );
};

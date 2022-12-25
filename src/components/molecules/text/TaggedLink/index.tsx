import React from 'react';

import { TaggedLinkNode } from '../../../../parser/taggedLink/types';
import { getTagName, splitTag } from '../../../../parser/taggedLink/utils';
import { Char } from '../../../atoms/text/Char';
import { EmbededLink } from '../../../atoms/text/EmbededLink';
import { TextNodeComponentProps } from '../common/types';

export type TaggedLinkProps = TextNodeComponentProps<TaggedLinkNode>;

export const TaggedLinkConstants = {
  styleId: (tagName: string) => `${tagName}-tagged-link`,
};

export const TaggedLink: React.FC<TaggedLinkProps> = ({
  node,
  getEditMode,
  linkForceClickable,
  taggedLinkVisualMap,
}) => {
  const { lineIndex, linkName, trailingMeta } = node;
  const [facingMeta, tag] = splitTag(node);
  const tagName = getTagName(node);
  const [first, last] = node.range;
  const editMode = getEditMode(node);
  const taggedLinkVisual = taggedLinkVisualMap?.[tagName];

  return (
    <EmbededLink
      editMode={editMode}
      forceClickable={linkForceClickable}
      anchorProps={(clickable) => taggedLinkVisual?.anchorProps?.(linkName, clickable)}
      data-styleid={TaggedLinkConstants.styleId(tagName)}
    >
      {[...facingMeta].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {editMode ? char : ''}
        </Char>
      ))}
      {[...tag].map((char, index) => (
        <Char
          key={first + facingMeta.length + index}
          lineIndex={lineIndex}
          charIndex={first + facingMeta.length + index}
        >
          {editMode || !taggedLinkVisual?.tagHidden ? char : ''}
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
          {editMode ? char : ''}
        </Char>
      ))}
    </EmbededLink>
  );
};

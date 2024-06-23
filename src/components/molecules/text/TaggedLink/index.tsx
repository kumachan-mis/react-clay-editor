import {
  TaggedLinkNode,
  getTagName,
  splitTag,
  taggedLinkNodeEquals,
} from '../../../../parser/taggedLink/taggedLinkNode';
import { Char } from '../../../atoms/text/Char';
import { EmbededLink } from '../../../atoms/text/EmbededLink';
import { TextNodeProps } from '../common/TextNodeProps';

import React from 'react';

export type TaggedLinkProps = TextNodeProps<TaggedLinkNode>;

export const TaggedLinkConstants = {
  styleId: (tagName: string) => `${tagName}-tagged-link`,
};

const TaggedLinkComponent: React.FC<TaggedLinkProps> = ({
  node,
  editMode,
  linkForceClickable,
  taggedLinkVisualMap,
}) => {
  const { linkName, trailingMeta } = node;
  const [facingMeta, tag] = splitTag(node);
  const tagName = getTagName(node);
  const [first, last] = node.range;
  const taggedLinkVisual = taggedLinkVisualMap?.[tagName];

  return (
    <EmbededLink
      anchorProps={(clickable) => taggedLinkVisual?.anchorProps?.(linkName, clickable)}
      data-styleid={TaggedLinkConstants.styleId(tagName)}
      editMode={editMode}
      forceClickable={linkForceClickable}
    >
      {[...facingMeta].map((char, index) => (
        <Char charIndex={first + index} key={first + index}>
          {editMode ? char : ''}
        </Char>
      ))}
      {[...tag].map((char, index) => (
        <Char charIndex={first + facingMeta.length + index} key={first + facingMeta.length + index}>
          {editMode || !taggedLinkVisual?.tagHidden ? char : ''}
        </Char>
      ))}
      {[...linkName].map((char, index) => (
        <Char
          charIndex={first + facingMeta.length + tag.length + index}
          key={first + facingMeta.length + tag.length + index}
        >
          {char}
        </Char>
      ))}
      {[...trailingMeta].map((char, index) => (
        <Char charIndex={last - (trailingMeta.length - 1) + index} key={last - (trailingMeta.length - 1) + index}>
          {editMode ? char : ''}
        </Char>
      ))}
    </EmbededLink>
  );
};

export const TaggedLink = React.memo(
  TaggedLinkComponent,
  (prev, next) =>
    taggedLinkNodeEquals(prev.node, next.node) &&
    prev.editMode === next.editMode &&
    prev.linkForceClickable === next.linkForceClickable &&
    prev.taggedLinkVisualMap === next.taggedLinkVisualMap
);

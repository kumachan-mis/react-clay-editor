import { TaggedLinkNode } from '../../../../parser/taggedLink/types';
import { getTagName, splitTag } from '../../../../parser/taggedLink/utils';
import { Char } from '../../../atoms/text/Char';
import { EmbededLink } from '../../../atoms/text/EmbededLink';
import { TextNodeComponentProps } from '../common/types';

import React from 'react';

export type TaggedLinkProps = TextNodeComponentProps<TaggedLinkNode>;

export const TaggedLinkConstants = {
  styleId: (tagName: string) => `${tagName}-tagged-link`,
};

const TaggedLinkComponent: React.FC<TaggedLinkProps> = ({
  node,
  editMode,
  linkForceClickable,
  taggedLinkVisualMap,
}) => {
  const { lineIndex, linkName, trailingMeta } = node;
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
        <Char charIndex={first + index} key={first + index} lineIndex={lineIndex}>
          {editMode ? char : ''}
        </Char>
      ))}
      {[...tag].map((char, index) => (
        <Char
          charIndex={first + facingMeta.length + index}
          key={first + facingMeta.length + index}
          lineIndex={lineIndex}
        >
          {editMode || !taggedLinkVisual?.tagHidden ? char : ''}
        </Char>
      ))}
      {[...linkName].map((char, index) => (
        <Char
          charIndex={first + facingMeta.length + tag.length + index}
          key={first + facingMeta.length + tag.length + index}
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

function taggedLinkNodeEquals(a: TaggedLinkNode, b: TaggedLinkNode): boolean {
  return (
    a.lineIndex === b.lineIndex &&
    a.range[0] === b.range[0] &&
    a.range[1] === b.range[1] &&
    a.linkName === b.linkName &&
    a.trailingMeta === b.trailingMeta
  );
}

export const TaggedLink = React.memo(
  TaggedLinkComponent,
  (prev, next) =>
    taggedLinkNodeEquals(prev.node, next.node) &&
    prev.editMode === next.editMode &&
    prev.linkForceClickable === next.linkForceClickable &&
    prev.taggedLinkVisualMap === next.taggedLinkVisualMap
);

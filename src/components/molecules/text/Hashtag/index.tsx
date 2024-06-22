import { HashtagNode, getHashtagName, hashtagNodeEquals } from '../../../../parser/hashtag/hashtagNode';
import { Char } from '../../../atoms/text/Char';
import { EmbededLink } from '../../../atoms/text/EmbededLink';
import { TextNodeProps } from '../common/TextNodeProps';

import React from 'react';

export type HashtagProps = TextNodeProps<HashtagNode>;

export const HashtagConstants = {
  styleId: 'hashtag',
};

const HashtagComponent: React.FC<HashtagProps> = ({ node, editMode, linkForceClickable, hashtagVisual }) => {
  const { lineIndex, facingMeta, linkName, trailingMeta } = node;
  const [first] = node.range;

  return (
    <EmbededLink
      anchorProps={(clickable) => hashtagVisual?.anchorProps?.(getHashtagName(node), clickable)}
      data-styleid={HashtagConstants.styleId}
      editMode={editMode}
      forceClickable={linkForceClickable}
    >
      {[...facingMeta, ...linkName, ...trailingMeta].map((char, index) => (
        <Char charIndex={first + index} key={first + index} lineIndex={lineIndex}>
          {char}
        </Char>
      ))}
    </EmbededLink>
  );
};

export const Hashtag = React.memo(
  HashtagComponent,
  (prev, next) =>
    hashtagNodeEquals(prev.node, next.node) &&
    prev.editMode === next.editMode &&
    prev.linkForceClickable === next.linkForceClickable &&
    prev.hashtagVisual === next.hashtagVisual
);

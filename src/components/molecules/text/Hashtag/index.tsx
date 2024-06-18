import { HashtagNode } from '../../../../parser/hashtag/types';
import { getHashtagName } from '../../../../parser/hashtag/utils';
import { Char } from '../../../atoms/text/Char';
import { EmbededLink } from '../../../atoms/text/EmbededLink';
import { TextNodeComponentProps } from '../common/types';

import React from 'react';

export type HashtagProps = TextNodeComponentProps<HashtagNode>;

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

function hashtagNodeEquals(a: HashtagNode, b: HashtagNode): boolean {
  return (
    a.lineIndex === b.lineIndex &&
    a.range[0] === b.range[0] &&
    a.range[1] === b.range[1] &&
    a.facingMeta === b.facingMeta &&
    a.linkName === b.linkName &&
    a.trailingMeta === b.trailingMeta
  );
}

export const Hashtag = React.memo(
  HashtagComponent,
  (prev, next) =>
    hashtagNodeEquals(prev.node, next.node) &&
    prev.editMode === next.editMode &&
    prev.linkForceClickable === next.linkForceClickable &&
    prev.hashtagVisual === next.hashtagVisual
);

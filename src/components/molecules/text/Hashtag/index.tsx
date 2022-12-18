import React from 'react';

import { HashtagNode } from '../../../../parser/hashtag/types';
import { getHashtagName } from '../../../../parser/hashtag/utils';
import { Char } from '../../../atoms/text/Char';
import { EmbededLink } from '../../../atoms/text/EmbededLink';
import { TextNodeComponentProps } from '../common/types';

export type HashtagProps = TextNodeComponentProps<HashtagNode>;

export const Hashtag: React.FC<HashtagProps> = ({ node, getEditMode, linkForceClickable, hashtagVisual }) => {
  const { lineIndex, facingMeta, linkName, trailingMeta } = node;
  const [first] = node.range;
  const editMode = getEditMode(node);

  return (
    <EmbededLink
      editMode={editMode}
      forceClickable={linkForceClickable}
      anchorProps={(clickable) => hashtagVisual?.anchorProps?.(getHashtagName(node), clickable)}
    >
      {[...facingMeta, ...linkName, ...trailingMeta].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {char}
        </Char>
      ))}
    </EmbededLink>
  );
};

import { TextNodeComponentProps } from '../common/types';
import { Char } from 'src/components/atoms/text/Char';
import { EmbededLink } from 'src/components/atoms/text/EmbededLink';
import { HashtagNode } from 'src/parser/hashtag/types';
import { getHashtagName } from 'src/parser/hashtag/utils';

import React from 'react';

export type HashtagProps = TextNodeComponentProps<HashtagNode>;

export const HashtagConstants = {
  styleId: 'hashtag',
};

export const Hashtag: React.FC<HashtagProps> = ({ node, getEditMode, linkForceClickable, hashtagVisual }) => {
  const { lineIndex, facingMeta, linkName, trailingMeta } = node;
  const [first] = node.range;
  const editMode = getEditMode(node);

  return (
    <EmbededLink
      editMode={editMode}
      forceClickable={linkForceClickable}
      anchorProps={(clickable) => hashtagVisual?.anchorProps?.(getHashtagName(node), clickable)}
      data-styleid={HashtagConstants.styleId}
    >
      {[...facingMeta, ...linkName, ...trailingMeta].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {char}
        </Char>
      ))}
    </EmbededLink>
  );
};

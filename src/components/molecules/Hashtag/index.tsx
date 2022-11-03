import React from 'react';

import { HashtagNode } from '../../../parser/types';
import { getHashtagName } from '../../../parser/utils';
import { Char } from '../../atoms/Char';
import { EmbededLink } from '../../atoms/EmbededLink';
import { SyntaxNodeComponentProps } from '../_common/types';

export type HashtagProps = SyntaxNodeComponentProps<HashtagNode>;

export const Hashtag: React.FC<HashtagProps> = ({ node, editMode, linkForceClickable, hashtagVisual }) => {
  const { lineIndex, facingMeta, linkName, trailingMeta } = node;
  const [first] = node.range;
  const editModeValue = editMode(node);

  return (
    <EmbededLink
      editMode={editModeValue}
      forceClickable={linkForceClickable}
      anchorProps={(active) => hashtagVisual?.anchorProps?.(getHashtagName(linkName), active)}
    >
      {[...facingMeta, ...linkName, ...trailingMeta].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {char}
        </Char>
      ))}
    </EmbededLink>
  );
};

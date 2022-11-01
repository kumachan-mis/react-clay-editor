import React from 'react';

import { HashtagNode } from '../../../parser/types';
import { getHashtagName } from '../../../parser/utils';
import { Char } from '../../atoms/Char';
import { EmbededLink } from '../../atoms/EmbededLink';
import { SyntaxNodeComponentProps } from '../_common/types';
import { cursorOnSyntaxNode } from '../_common/utils';

export type HashtagProps = SyntaxNodeComponentProps<HashtagNode>;

export const Hashtag: React.FC<HashtagProps> = ({
  node,
  cursorCoordinate,
  textSelection,
  linkForceClickable,
  hashtagVisual,
}) => {
  const { lineIndex, facingMeta, linkName, trailingMeta } = node;
  const [first] = node.range;
  const cursorOn = cursorOnSyntaxNode(node, cursorCoordinate, textSelection);

  return (
    <EmbededLink
      cursorOn={cursorOn}
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

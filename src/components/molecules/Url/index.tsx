import React from 'react';

import { UrlNode } from '../../../parser/types';
import { Char } from '../../atoms/Char';
import { EmbededLink } from '../../atoms/EmbededLink';
import { SyntaxNodeComponentProps } from '../_common/types';
import { cursorOnSyntaxNode } from '../_common/utils';

export type UrlProps = SyntaxNodeComponentProps<UrlNode>;

export const Url: React.FC<UrlProps> = ({ node, cursorCoordinate, textSelection, linkForceClickable }) => {
  const { lineIndex, url } = node;
  const [first] = node.range;
  const cursorOn = cursorOnSyntaxNode(node, cursorCoordinate, textSelection);

  return (
    <EmbededLink
      cursorOn={cursorOn}
      forceClickable={linkForceClickable}
      anchorProps={() => ({ href: url, target: '_blank', rel: 'noopener noreferrer' })}
    >
      {[...url].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {char}
        </Char>
      ))}
    </EmbededLink>
  );
};

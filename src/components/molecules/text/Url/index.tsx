import React from 'react';

import { UrlNode } from '../../../../parser/types';
import { Char } from '../../../atoms/text/Char';
import { EmbededLink } from '../../../atoms/text/EmbededLink';
import { TextNodeComponentProps } from '../common/types';

export type UrlProps = TextNodeComponentProps<UrlNode>;

export const Url: React.FC<UrlProps> = ({ node, editMode, linkForceClickable }) => {
  const { lineIndex, url } = node;
  const [first] = node.range;
  const editModeValue = editMode(node);

  return (
    <EmbededLink
      editMode={editModeValue}
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

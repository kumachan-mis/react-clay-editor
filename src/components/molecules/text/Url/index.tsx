import { TextNodeComponentProps } from '../common/types';
import { Char } from 'src/components/atoms/text/Char';
import { EmbededLink } from 'src/components/atoms/text/EmbededLink';
import { UrlNode } from 'src/parser/url/types';

import React from 'react';

export type UrlProps = TextNodeComponentProps<UrlNode>;

export const UrlConstants = {
  styleId: 'url',
};

export const Url: React.FC<UrlProps> = ({ node, getEditMode, linkForceClickable }) => {
  const { lineIndex, url } = node;
  const [first] = node.range;
  const editMode = getEditMode(node);

  return (
    <EmbededLink
      editMode={editMode}
      forceClickable={linkForceClickable}
      anchorProps={() => ({ href: url, target: '_blank', rel: 'noopener noreferrer' })}
      data-styleid={UrlConstants.styleId}
    >
      {[...url].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {char}
        </Char>
      ))}
    </EmbededLink>
  );
};

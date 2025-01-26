import { UrlNode, urlNodeEquals } from '../../../../parser/url/urlNode';
import { Char } from '../../../atoms/text/Char';
import { EmbededLink } from '../../../atoms/text/EmbededLink';
import { TextNodeProps } from '../common/TextNodeProps';

import React from 'react';

export type UrlProps = TextNodeProps<UrlNode>;

export const UrlConstants = {
  styleId: 'url',
};

const UrlComponent: React.FC<UrlProps> = ({ node, editMode, linkForceClickable }) => {
  const { url } = node;
  const [first] = node.range;

  return (
    <EmbededLink
      anchorProps={() => ({ href: url, target: '_blank', rel: 'noopener noreferrer' })}
      data-styleid={UrlConstants.styleId}
      editMode={editMode}
      forceClickable={linkForceClickable}
    >
      {url.split('').map((char, index) => (
        <Char charIndex={first + index} key={first + index}>
          {char}
        </Char>
      ))}
    </EmbededLink>
  );
};

export const Url = React.memo(
  UrlComponent,
  (prev, next) =>
    urlNodeEquals(prev.node, next.node) &&
    prev.editMode === next.editMode &&
    prev.linkForceClickable === next.linkForceClickable,
);

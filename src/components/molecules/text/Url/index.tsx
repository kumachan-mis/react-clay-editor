import { UrlNode } from '../../../../parser/url/types';
import { Char } from '../../../atoms/text/Char';
import { EmbededLink } from '../../../atoms/text/EmbededLink';
import { TextNodeComponentProps } from '../common/types';

import React from 'react';

export type UrlProps = TextNodeComponentProps<UrlNode>;

export const UrlConstants = {
  styleId: 'url',
};

const UrlComponent: React.FC<UrlProps> = ({ node, getEditMode, linkForceClickable }) => {
  const { lineIndex, url } = node;
  const [first] = node.range;
  const editMode = getEditMode(node);

  return (
    <EmbededLink
      anchorProps={() => ({ href: url, target: '_blank', rel: 'noopener noreferrer' })}
      data-styleid={UrlConstants.styleId}
      editMode={editMode}
      forceClickable={linkForceClickable}
    >
      {[...url].map((char, index) => (
        <Char charIndex={first + index} key={first + index} lineIndex={lineIndex}>
          {char}
        </Char>
      ))}
    </EmbededLink>
  );
};

function urlNodeEquals(a: UrlNode, b: UrlNode): boolean {
  return a.lineIndex === b.lineIndex && a.range[0] === b.range[0] && a.range[1] === b.range[1] && a.url === b.url;
}

export const Url = React.memo(
  UrlComponent,
  (prev, next) =>
    urlNodeEquals(prev.node, next.node) &&
    prev.getEditMode === next.getEditMode &&
    prev.linkForceClickable === next.linkForceClickable
);

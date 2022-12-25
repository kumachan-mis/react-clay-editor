import { TextNodeComponentProps } from '../common/types';
import { LineGroup } from 'src/components/atoms/text/LineGroup';
import { BlockCodeNode } from 'src/parser/blockCode/types';

import { BlockCodeLine } from './BlockCodeLine';
import { BlockCodeMeta } from './BlockCodeMeta';

import React from 'react';

export type BlockCodeProps = TextNodeComponentProps<BlockCodeNode>;

export const BlockCodeConstants = {
  styleId: 'block-code',
};

export const BlockCode: React.FC<BlockCodeProps> = ({ node, ...rest }) => {
  const { facingMeta, children, trailingMeta } = node;
  const [first, last] = node.range;

  return (
    <LineGroup
      firstLineIndex={first + 1}
      lastLineIndex={trailingMeta ? last - 1 : last}
      data-styleid={BlockCodeConstants.styleId}
    >
      <BlockCodeMeta node={facingMeta} {...rest} />
      {children.map((child, index) => (
        <BlockCodeLine key={index} node={child} {...rest} />
      ))}
      {trailingMeta && <BlockCodeMeta node={trailingMeta} {...rest} />}
    </LineGroup>
  );
};

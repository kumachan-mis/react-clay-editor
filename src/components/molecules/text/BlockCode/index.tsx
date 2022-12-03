import React from 'react';

import { BlockCodeNode } from '../../../../parser/blockCode/types';
import { LineGroup } from '../../../atoms/text/LineGroup';
import { TextNodeComponentProps } from '../common/types';

import { BlockCodeLine } from './BlockCodeLine';
import { BlockCodeMeta } from './BlockCodeMeta';

export type BlockCodeProps = TextNodeComponentProps<BlockCodeNode>;

export const BlockCode: React.FC<BlockCodeProps> = ({ node, ...rest }) => {
  const { facingMeta, children, trailingMeta } = node;
  const [first, last] = node.range;

  return (
    <LineGroup firstLineIndex={first + 1} lastLineIndex={trailingMeta ? last - 1 : last}>
      <BlockCodeMeta node={facingMeta} {...rest} />
      {children.map((child, index) => (
        <BlockCodeLine key={index} node={child} {...rest} />
      ))}
      {trailingMeta && <BlockCodeMeta node={trailingMeta} {...rest} />}
    </LineGroup>
  );
};

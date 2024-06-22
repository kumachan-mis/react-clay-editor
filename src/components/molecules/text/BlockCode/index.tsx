import { BlockCodeNode, blockCodeNodeEquals } from '../../../../parser/blockCode/blockCodeNode';
import { LineGroup } from '../../../atoms/text/LineGroup';
import { TextNodeProps, createTextNodePropsEquals } from '../common/TextNodeProps';

import { BlockCodeLine } from './BlockCodeLine';
import { BlockCodeMeta } from './BlockCodeMeta';

import React from 'react';

export type BlockCodeProps = TextNodeProps<BlockCodeNode>;

export const BlockCodeConstants = {
  styleId: 'block-code',
};

const BlockCodeComponent: React.FC<BlockCodeProps> = ({ node, ...rest }) => {
  const { facingMeta, children, trailingMeta } = node;
  const [first, last] = node.range;

  return (
    <LineGroup
      data-styleid={BlockCodeConstants.styleId}
      firstLineIndex={first + 1}
      lastLineIndex={trailingMeta ? last - 1 : last}
    >
      <BlockCodeMeta node={facingMeta} {...rest} />
      {children.map((child, index) => (
        <BlockCodeLine key={index} node={child} {...rest} />
      ))}
      {trailingMeta && <BlockCodeMeta node={trailingMeta} {...rest} />}
    </LineGroup>
  );
};

export const BlockCode = React.memo(BlockCodeComponent, createTextNodePropsEquals(blockCodeNodeEquals));

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

  const firstNode = children.length > 0 ? children[0] : facingMeta;
  const lastNode = children.length > 0 ? children[children.length - 1] : (trailingMeta ?? facingMeta);

  return (
    <LineGroup data-styleid={BlockCodeConstants.styleId} firstLineId={firstNode.lineId} lastLineId={lastNode.lineId}>
      <BlockCodeMeta node={facingMeta} {...rest} />
      {children.map((child) => (
        <BlockCodeLine key={child.lineId} node={child} {...rest} />
      ))}
      {trailingMeta && <BlockCodeMeta node={trailingMeta} {...rest} />}
    </LineGroup>
  );
};

export const BlockCode = React.memo(BlockCodeComponent, createTextNodePropsEquals(blockCodeNodeEquals));

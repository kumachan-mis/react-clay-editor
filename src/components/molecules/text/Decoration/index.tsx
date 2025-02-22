import { DecorationConfig } from '../../../../parser/decoration/decorationConfig';
import { DecorationNode, decorationNodeEquals } from '../../../../parser/decoration/decorationNode';
import { Char } from '../../../atoms/text/Char';
import { DecorationContent } from '../../../atoms/text/DecorationContent';
import { TextNode } from '../Text/TextNode';
import { TextNodeProps, createTextNodePropsEquals } from '../common/TextNodeProps';

import React from 'react';

export type DecorationProps = TextNodeProps<DecorationNode>;

export const DecorationConstants = {
  styleId: (config: DecorationConfig) => {
    let selctid = `decoration-${config.size}`;
    if (config.bold) selctid += '-bold';
    if (config.italic) selctid += '-italic';
    if (config.underline) selctid += '-underline';
    return selctid;
  },
};

const DecorationComponent: React.FC<DecorationProps> = ({ node, editMode, ...rest }) => {
  const { facingMeta, config, trailingMeta, children } = node;
  const [first, last] = node.range;

  return (
    <DecorationContent {...config} data-styleid={DecorationConstants.styleId(config)}>
      {facingMeta.split('').map((char, index) => (
        <Char charIndex={first + index} key={first + index}>
          {editMode ? char : ''}
        </Char>
      ))}
      {children.map((child, index) => (
        <TextNode editMode={editMode} key={index} node={child} {...rest} />
      ))}
      {trailingMeta.split('').map((char, index) => (
        <Char charIndex={last - (trailingMeta.length - 1) + index} key={last - (trailingMeta.length - 1) + index}>
          {editMode ? char : ''}
        </Char>
      ))}
    </DecorationContent>
  );
};

export const Decoration: React.FC<DecorationProps> = React.memo(
  DecorationComponent,
  createTextNodePropsEquals(decorationNodeEquals),
);

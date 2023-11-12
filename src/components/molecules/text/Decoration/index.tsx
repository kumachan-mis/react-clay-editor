import { TextNode } from '../../../../parser';
import { DecorationNode, DecorationConfig } from '../../../../parser/decoration/types';
import { Char } from '../../../atoms/text/Char';
import { DecorationContent } from '../../../atoms/text/DecorationContent';
import { TextNodeComponentProps } from '../common/types';

import React from 'react';

export type DecorationProps = {
  ChildComponent: React.FC<TextNodeComponentProps<TextNode>>;
} & TextNodeComponentProps<DecorationNode>;

export const DecorationConstants = {
  styleId: (config: DecorationConfig) => {
    let selctid = `decoration-${config.size}`;
    if (config.bold) selctid += '-bold';
    if (config.italic) selctid += '-italic';
    if (config.underline) selctid += '-underline';
    return selctid;
  },
};

export const Decoration: React.FC<DecorationProps> = ({ node, getEditMode, ChildComponent, ...rest }) => {
  const { lineIndex, facingMeta, config, trailingMeta, children } = node;
  const [first, last] = node.range;
  const editMode = getEditMode(node);

  return (
    <DecorationContent {...config} data-styleid={DecorationConstants.styleId(config)}>
      {[...facingMeta].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {editMode ? char : ''}
        </Char>
      ))}
      {children.map((child, index) => (
        <ChildComponent key={index} node={child} getEditMode={getEditMode} {...rest} />
      ))}
      {[...trailingMeta].map((char, index) => (
        <Char
          key={last - (trailingMeta.length - 1) + index}
          lineIndex={lineIndex}
          charIndex={last - (trailingMeta.length - 1) + index}
        >
          {editMode ? char : ''}
        </Char>
      ))}
    </DecorationContent>
  );
};

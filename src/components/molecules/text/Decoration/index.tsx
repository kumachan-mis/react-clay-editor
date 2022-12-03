import styled from '@emotion/styled';
import React from 'react';

import { TextNode } from '../../../../parser';
import { DecorationNode, Decoration as DecorationStyle } from '../../../../parser/decoration/types';
import { Char } from '../../../atoms/text/Char';
import { TextNodeComponentProps } from '../common/types';

export type DecorationProps = {
  ChildComponent: React.FC<TextNodeComponentProps<TextNode>>;
} & TextNodeComponentProps<DecorationNode>;

export const Decoration: React.FC<DecorationProps> = ({ node, editMode, ChildComponent, ...rest }) => {
  const { lineIndex, facingMeta, decoration, trailingMeta, children } = node;
  const [first, last] = node.range;
  const editModeValue = editMode(node);

  return (
    <StyledDecoration {...decoration}>
      {[...facingMeta].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {editModeValue ? char : ''}
        </Char>
      ))}
      {children.map((child, index) => (
        <ChildComponent key={index} node={child} editMode={editMode} {...rest} />
      ))}
      {[...trailingMeta].map((char, index) => (
        <Char
          key={last - (trailingMeta.length - 1) + index}
          lineIndex={lineIndex}
          charIndex={last - (trailingMeta.length - 1) + index}
        >
          {editModeValue ? char : ''}
        </Char>
      ))}
    </StyledDecoration>
  );
};

export const StyledDecoration = styled.span(
  (props: DecorationStyle) => `
  font-size: ${{ largest: '24px', larger: '20px', normal: '16px' }[props.size]};
  ${props.bold ? 'font-weight: bold;' : ''}
  ${props.italic ? 'font-style: italic;' : ''}
  ${props.underline ? 'border-bottom: 1px solid;' : ''}
`
);

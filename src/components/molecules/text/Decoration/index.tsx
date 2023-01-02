import { TextNodeComponentProps } from '../common/types';
import { Char } from 'src/components/atoms/text/Char';
import { TextNode } from 'src/parser';
import { DecorationNode, Decoration as DecorationStyle } from 'src/parser/decoration/types';

import styled from '@emotion/styled';
import React from 'react';

export type DecorationProps = {
  ChildComponent: React.FC<TextNodeComponentProps<TextNode>>;
} & TextNodeComponentProps<DecorationNode>;

export const DecorationConstants = {
  styleId: (decoration: DecorationStyle) => {
    let selctid = `decoration-${decoration.size}`;
    if (decoration.bold) selctid += '-bold';
    if (decoration.italic) selctid += '-italic';
    if (decoration.underline) selctid += '-underline';
    return selctid;
  },
};

export const Decoration: React.FC<DecorationProps> = ({ node, getEditMode, ChildComponent, ...rest }) => {
  const { lineIndex, facingMeta, decoration, trailingMeta, children } = node;
  const [first, last] = node.range;
  const editMode = getEditMode(node);

  return (
    <StyledDecoration {...decoration} data-styleid={DecorationConstants.styleId(decoration)}>
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
    </StyledDecoration>
  );
};

export const StyledDecoration = styled.span(
  (props: DecorationStyle) => `
  font-size: ${{ largest: '1.8rem', larger: '1.34rem', normal: '1rem' }[props.size]};
  ${props.bold ? 'font-weight: bold;' : ''}
  ${props.italic ? 'font-style: italic;' : ''}
  ${props.underline ? 'border-bottom: 1px solid;' : ''}
`
);

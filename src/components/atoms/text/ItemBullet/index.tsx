import { Char } from '../Char';

import styled from '@emotion/styled';
import React from 'react';

export type ItemBulletProps = {
  lineIndex: number;
  indentDepth: number;
  bullet: string;
};

export const ItemBullet: React.FC<ItemBulletProps> = ({ lineIndex, indentDepth }) => (
  <StyledItemBullet charIndex={indentDepth} lineIndex={lineIndex} indentDepth={indentDepth}>
    <StyledItemBulletInner />{' '}
  </StyledItemBullet>
);

const StyledItemBullet = styled(Char, {
  shouldForwardProp: (name) => name !== 'indentDepth',
})<{
  indentDepth: number;
}>(
  (props) => `
  position: absolute;
  width: 1.5em;
  margin-left: ${1.5 * props.indentDepth}em;
`
);

const StyledItemBulletInner = styled.span(
  (props) => `
  top: 0.5em;
  right: 0.75em;
  position: absolute;
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: ${props.theme.base.color};
`
);

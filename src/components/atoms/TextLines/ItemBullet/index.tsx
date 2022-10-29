import styled from '@emotion/styled';
import React from 'react';

import { Char } from '../Char';

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

const StyledItemBullet = styled(Char)<{
  indentDepth: number;
}>(
  (props) => `
  position: absolute;
  width: 1.5em;
  margin-left: ${1.5 * props.indentDepth}em;
`
);

const StyledItemBulletInner = styled.span`
  top: 0.5em;
  right: 0.75em;
  position: absolute;
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #000000;
`;

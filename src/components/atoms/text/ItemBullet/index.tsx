import { Char } from '../Char';

import styled from '@emotion/styled';
import React from 'react';

export type ItemBulletProps = {
  readonly indentDepth: number;
  readonly bullet: string;
};

const StyledItemBullet = styled(Char, {
  shouldForwardProp: (name) => name !== 'indentDepth',
})<{
  indentDepth: number;
}>(
  (props) => `
  position: absolute;
  width: 1.5em;
  margin-left: ${1.5 * props.indentDepth}em;
`,
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
`,
);

const ItemBulletComponent: React.FC<ItemBulletProps> = ({ indentDepth }) => (
  <StyledItemBullet charIndex={indentDepth} indentDepth={indentDepth}>
    <StyledItemBulletInner />{' '}
  </StyledItemBullet>
);

export const ItemBullet = React.memo(ItemBulletComponent);

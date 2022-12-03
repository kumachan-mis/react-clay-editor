import styled from '@emotion/styled';
import React from 'react';

export type MenuListProps = React.PropsWithoutRef<React.ComponentProps<'div'>>;

export const MenuList: React.FC<MenuListProps> = ({ ...rest }) => <StyledMenuList role="menubar" {...rest} />;

const StyledMenuList = styled.div`
  width: 100%;
  min-height: 36px;
  display: flex;
  list-style: none;
  align-items: center;
  overflow-x: scroll;

  > [role='menuitem'] {
    margin: 0px 4px;
  }
`;

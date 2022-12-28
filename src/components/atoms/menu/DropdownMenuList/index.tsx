import { FONT_SIZES } from '../../../../common/constants';

import styled from '@emotion/styled';
import React from 'react';

export type DropdownMenuListProps = {
  open: boolean;
} & React.PropsWithoutRef<React.ComponentProps<'ul'>>;

export const DropdownMenuListConstants = {
  selectId: 'dropdown-menu-list',
};

export const DropdownMenuList: React.FC<DropdownMenuListProps> = ({ open, ...rest }) =>
  !open ? (
    <></>
  ) : (
    <StyledDropdownMenuList data-selectid={DropdownMenuListConstants.selectId}>
      <StyledDropdownMenuListInner role="menu" {...rest} />
    </StyledDropdownMenuList>
  );

const StyledDropdownMenuList = styled.div`
  min-width: 200px;
  font-size: ${FONT_SIZES.menuitem};
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
  background-color: rgba(255, 255, 255);
  z-index: 1;
  position: absolute;
`;

const StyledDropdownMenuListInner = styled.ul`
  width: 100%;
  margin: 0px;
  padding: 0px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.04);
  list-style: none;
`;

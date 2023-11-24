import styled from '@emotion/styled';
import React from 'react';

export type DropdownMenuListProps = {
  readonly open: boolean;
} & React.PropsWithoutRef<React.ComponentProps<'ul'>>;

export const DropdownMenuListConstants = {
  selectId: 'dropdown-menu-list',
};

export const DropdownMenuList: React.FC<DropdownMenuListProps> = ({ open, ...rest }) =>
  open && (
    <StyledDropdownMenuList data-selectid={DropdownMenuListConstants.selectId}>
      <StyledDropdownMenuListInner role="menu" {...rest} />
    </StyledDropdownMenuList>
  );

const StyledDropdownMenuList = styled.div(
  (props) => `
  min-width: 200px;
  border-radius: 8px;
  border: 1px solid ${props.theme.list.borderColor};
  box-shadow: 0px 4px 8px ${props.theme.list.shadowColor};
  background-color: ${props.theme.list.backgroundColor};
  z-index: 1;
  position: absolute;
`
);

const StyledDropdownMenuListInner = styled.ul`
  width: 100%;
  margin: 0px;
  padding: 0px;
  border-radius: 8px;
  list-style: none;
`;

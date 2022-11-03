import styled from '@emotion/styled';
import React from 'react';

import { createTestId } from '../../../../common/utils';

export type DropdownMenuListProps = {
  open: boolean;
  anchorEl: HTMLElement | null;
} & React.ComponentProps<'ul'>;

export const DropdownMenuListConstants = {
  selectId: 'dropdown-menu-list',
  testId: 'dropdown-menu-list',
};

export const DropdownMenuList: React.FC<DropdownMenuListProps> = ({ open, anchorEl, ...rest }) => {
  const anchorRect = anchorEl?.getBoundingClientRect();

  return !open ? (
    <></>
  ) : (
    <StyledDropdownMenuList
      data-selectid={DropdownMenuListConstants.selectId}
      data-testid={createTestId(DropdownMenuListConstants.testId)}
    >
      <StyledDropdownMenuListInner left={anchorRect?.left || 0} top={anchorRect?.bottom || 0} role="menu" {...rest} />
    </StyledDropdownMenuList>
  );
};

const StyledDropdownMenuList = styled.div`
  min-width: 200px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
  background-color: rgba(255, 255, 255);
  z-index: 1;
  position: absolute;
`;

const StyledDropdownMenuListInner = styled.ul<{ left: number; top: number }>(
  (props) => `
  width: 100%;
  margin: 0px;
  padding: 0px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.04);
  list-style: none;
  left: ${props.left}px;
  top: ${props.top}px;
`
);

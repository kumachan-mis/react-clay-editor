import styled from '@emotion/styled';
import React from 'react';

export type DropdownMenuListItemProps = {
  selected?: boolean;
  disabled?: boolean;
} & React.ComponentProps<'li'>;

export const DropdownMenuListItem: React.FC<DropdownMenuListItemProps> = ({ selected, disabled, ...rest }) => (
  <StyledDropdownMenuListItem role="menuitem" aria-selected={selected} aria-disabled={disabled} {...rest} />
);

const StyledDropdownMenuListItem = styled.li`
  padding: 2px 8px;
  border-radius: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.12);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.2);
  }

  &[aria-selected='true'] {
    background-color: #d9ebff;

    &:hover {
      background-color: #d9e9f7;
    }
  }

  &[aria-disabled='true'] {
    background-color: rgba(0, 0, 0, 0.02);
    border: 1px solid rgba(0, 0, 0, 0.04);
    cursor: unset;
    color: rgba(0, 0, 0, 0.2);
  }
`;

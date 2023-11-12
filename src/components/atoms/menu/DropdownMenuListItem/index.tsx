import styled from '@emotion/styled';
import React from 'react';

export type DropdownMenuListItemProps = {
  selected?: boolean;
  disabled?: boolean;
} & React.PropsWithoutRef<React.ComponentProps<'li'>>;

export const DropdownMenuListItem: React.FC<DropdownMenuListItemProps> = ({ selected, disabled, ...rest }) => (
  <StyledDropdownMenuListItem role="menuitem" aria-selected={selected} aria-disabled={disabled} {...rest} />
);

const StyledDropdownMenuListItem = styled.li(
  (props) => `
  padding: 2px 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  border-radius: 8px;
  border-bottom: 1px solid ${props.theme.listItem.dividerColor};

  color: ${props.theme.listItem.unselectedColor};
  background-color: ${props.theme.listItem.unselectedBackgroundColor};
  &:hover {
    background-color: ${props.theme.listItem.unselectedHoverBackgroundColor};
  }

  &[aria-selected='true'] {
    color: ${props.theme.listItem.selectedColor};
    background-color: ${props.theme.listItem.selectedBackgroundColor};
    &:hover {
      background-color: ${props.theme.listItem.selectedHoverBackgroundColor};
    }
  }

  &[aria-disabled='true'] {
    color: ${props.theme.listItem.disabledColor};
    background-color: ${props.theme.listItem.disabledBackgroundColor};
    cursor: unset;
  }
`
);

import styled from '@emotion/styled';
import React from 'react';

export type IconButtonMenuProps = {
  pressed?: boolean;
} & React.ComponentProps<'button'>;

export const IconButtonMenu: React.FC<IconButtonMenuProps> = ({ pressed, ...rest }) => (
  <StyledIconButtonMenu role="menuitem" aria-pressed={pressed} {...rest} />
);

const StyledIconButtonMenu = styled.button`
  width: 26px;
  height: 26px;
  padding: 1px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  background-color: rgba(0, 0, 0, 0.04);

  svg {
    fill: rgba(0, 0, 0);
    width: 16px;
    height: 16px;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.12);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.2);
  }

  &[aria-pressed='true'] {
    background-color: #d9ebff;

    &:hover {
      background-color: #d9e9f7;
    }
  }

  &:disabled {
    background-color: rgba(0, 0, 0, 0.02);
    border: 1px solid rgba(0, 0, 0, 0.04);
    cursor: unset;

    svg {
      fill: rgba(0, 0, 0, 0.2);
    }
  }
`;

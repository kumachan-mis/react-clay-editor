import styled from '@emotion/styled';
import React from 'react';

import { createTestId } from '../../../common/utils';
import { ArrowIcon } from '../../../icons/ArrowIcon';

export type DropdownMenuButtonProps = {
  open: boolean;
  onOpen: (anchorEl: HTMLElement) => void;
  onClose: () => void;
  pressed?: boolean;
  disabled?: boolean;
  buttonProps?: React.ComponentProps<'button'>;
} & React.ComponentProps<'div'>;

export const DropdownMenuButtonConstants = {
  main: {
    selectid: 'dropdown-main-button',
    testId: 'dropdown-main-button',
  },
  arrow: {
    selectid: 'dropdown-arrow-button',
    testId: 'dropdown-arrow-button',
  },
};

export const DropdownMenuButton: React.FC<DropdownMenuButtonProps> = ({
  open,
  onOpen,
  onClose,
  pressed,
  disabled,
  buttonProps,
  children,
  ...rest
}) => {
  const arrowRef = React.useRef<HTMLButtonElement>(null);

  const handleOnArrowClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => (open ? onClose() : onOpen(event.currentTarget)),
    [open, onClose, onOpen]
  );

  const handleOnClickAway = React.useCallback(
    (event: MouseEvent) => {
      if (!arrowRef.current || arrowRef.current.contains(event.target as Node)) return;
      onClose();
    },
    [onClose, arrowRef]
  );

  React.useEffect(() => {
    document.addEventListener('click', handleOnClickAway);
    return () => {
      document.removeEventListener('click', handleOnClickAway);
    };
  }, [handleOnClickAway]);

  const { disabled: mainDisabled, ...mainRest } = buttonProps || {};

  return (
    <StyledDropdownMenuButton role="group" aria-pressed={pressed} aria-disabled={disabled} {...rest}>
      <StyledDropdownMainButton
        disabled={disabled || mainDisabled}
        {...mainRest}
        data-selectid={DropdownMenuButtonConstants.main.selectid}
        data-testid={createTestId(DropdownMenuButtonConstants.main.testId)}
      >
        {children}
      </StyledDropdownMainButton>
      <StyledDropdownArrowButton
        disabled={disabled}
        ref={arrowRef}
        onClick={handleOnArrowClick}
        aria-haspopup="true"
        aria-expanded={open}
        data-selectid={DropdownMenuButtonConstants.arrow.selectid}
        data-testid={createTestId(DropdownMenuButtonConstants.arrow.testId)}
      >
        <ArrowIcon />
      </StyledDropdownArrowButton>
    </StyledDropdownMenuButton>
  );
};

const StyledDropdownMenuButton = styled.div`
  height: 26px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  display: flex;

  &[aria-pressed='true'] {
    background-color: #d9ebff;

    &:hover {
      background-color: #d9e9f7;
    }
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }

  &[aria-disabled='true'] {
    background-color: rgba(0, 0, 0, 0.02);
    border: 1px solid rgba(0, 0, 0, 0.04);
    cursor: unset;
  }
`;

const StyledDropdownBaseButton = styled.button`
  height: 26px;
  border: unset;
  padding: 1px;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.04);

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
    border: unset;
    cursor: unset;

    svg {
      fill: rgba(0, 0, 0, 0.2);
    }
  }
`;

const StyledDropdownMainButton = styled(StyledDropdownBaseButton)`
  width: 26px;
  border-radius: 8px 0px 0px 8px;

  svg {
    fill: rgba(0, 0, 0);
    width: 16px;
    height: 16px;
  }
`;

const StyledDropdownArrowButton = styled(StyledDropdownBaseButton)`
  width: 16px;
  border-radius: 0px 8px 8px 0px;

  svg {
    fill: rgba(0, 0, 0, 0.8);
    width: 8px;
    height: 8px;
  }
`;

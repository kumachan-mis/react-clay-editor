import { ArrowIcon } from '../../../../icons/ArrowIcon';

import styled from '@emotion/styled';
import React from 'react';

export type DropdownMenuButtonProps = {
  readonly open: boolean;
  readonly onOpen: (anchorEl: HTMLElement) => void;
  readonly onClose: () => void;
  readonly pressed?: boolean;
  readonly disabled?: boolean;
  readonly buttonProps?: React.PropsWithoutRef<React.ComponentProps<'button'>>;
} & React.PropsWithoutRef<React.ComponentProps<'div'>>;

export const DropdownMenuButtonConstants = {
  main: {
    selectId: 'dropdown-main-button',
  },
  arrow: {
    selectId: 'dropdown-arrow-button',
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
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (open) {
        onClose();
      } else {
        onOpen(event.currentTarget);
      }
    },
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

  const { disabled: mainDisabled, ...mainRest } = buttonProps ?? {};

  return (
    <StyledDropdownMenuButton aria-disabled={disabled} aria-pressed={pressed} role="group" {...rest}>
      <StyledDropdownMainButton
        disabled={disabled ?? mainDisabled}
        {...mainRest}
        data-selectid={DropdownMenuButtonConstants.main.selectId}
      >
        {children}
      </StyledDropdownMainButton>
      <StyledDropdownArrowButton
        aria-expanded={open}
        aria-haspopup="true"
        data-selectid={DropdownMenuButtonConstants.arrow.selectId}
        disabled={disabled}
        onClick={handleOnArrowClick}
        ref={arrowRef}
      >
        <ArrowIcon />
      </StyledDropdownArrowButton>
    </StyledDropdownMenuButton>
  );
};

const StyledDropdownMenuButton = styled.div`
  display: flex;
  height: 26px;
  border-radius: 8px;
`;

const StyledDropdownBaseButton = styled.button(
  (props) => `
  height: 100%;
  padding: 1px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid ${props.theme.iconButton.borderColor};

  background-color: ${props.theme.iconButton.unselectedBackgroundColor};
  &:hover {
    background-color: ${props.theme.iconButton.unselectedHoverBackgroundColor};
  }
  svg {
    fill: ${props.theme.iconButton.unselectedIconColor};
  }

  &[aria-pressed='true'] {
    background-color: ${props.theme.iconButton.selectedBackgroundColor};
    &:hover {
      background-color: ${props.theme.iconButton.selectedHoverBackgroundColor};
    }
    svg {
      fill: ${props.theme.iconButton.unselectedIconColor};
    }
  }

  &:disabled {
    background-color: ${props.theme.iconButton.disabledBackgroundColor};
    cursor: unset;
    svg {
      fill: ${props.theme.iconButton.disabledIconColor};
    }
  }
`
);

const StyledDropdownMainButton = styled(StyledDropdownBaseButton)`
  width: 26px;
  border-radius: 8px 0px 0px 8px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const StyledDropdownArrowButton = styled(StyledDropdownBaseButton)`
  width: 16px;
  border-radius: 0px 8px 8px 0px;

  svg {
    width: 8px;
    height: 8px;
  }
`;

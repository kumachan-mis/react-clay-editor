import * as React from 'react';

import { mergeClassNames } from '../../common/utils';
import { ArrowIcon } from '../icons';

import { ComponentConstants } from './constants';
import {
  DropdownMenuAnchorProps,
  DropdownMenuItemProps,
  DropdownMenuListProps,
  DropdownMenuProps,
  IconButtonMenuProps,
  MenuContainerProps,
} from './types';

export const MenuContainer: React.FC<MenuContainerProps> = ({ className, children, ...rest }) => {
  const constants = ComponentConstants.menuContainer;
  return (
    <div className={mergeClassNames(className, constants.className)} role="menubar" {...rest}>
      {children}
    </div>
  );
};

export const IconButtonMenu: React.FC<IconButtonMenuProps> = ({ active, className, children, ...rest }) => {
  const constants = ComponentConstants.iconButtonMenu;
  let buttonClassName = mergeClassNames(className, constants.className);
  if (active) buttonClassName = mergeClassNames(buttonClassName, ComponentConstants.active.className);

  return (
    <button className={buttonClassName} role="menuitem" {...rest}>
      {children}
    </button>
  );
};

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, ...rest }) => (
  <span role="menuitem" {...rest}>
    {children}
  </span>
);

export const DropdownMenuAnchor: React.FC<DropdownMenuAnchorProps> = ({
  open,
  onOpen,
  onClose,
  buttonProps,
  active,
  disabled,
  className,
  children,
  ...rest
}) => {
  const arrowRef = React.useRef<HTMLButtonElement | null>(null);

  const handleOnClickAway = React.useCallback(
    (event: MouseEvent) => {
      if (!arrowRef.current || arrowRef.current.contains(event.target as Node)) return;
      onClose();
    },
    [onClose, arrowRef]
  );
  const handleOnArrowClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => (open ? onClose() : onOpen(event.currentTarget)),
    [open, onClose, onOpen]
  );

  React.useEffect(() => {
    document.addEventListener('click', handleOnClickAway);
    return () => {
      document.removeEventListener('click', handleOnClickAway);
    };
  }, [handleOnClickAway]);

  const constants = ComponentConstants.dropdownMenuAnchor;

  let anchorClassName = mergeClassNames(className, constants.className);
  if (active) anchorClassName = mergeClassNames(anchorClassName, ComponentConstants.active.className);
  if (disabled) anchorClassName = mergeClassNames(anchorClassName, ComponentConstants.disabled.className);

  const { className: buttonClassName, disabled: buttonDisabled, ...buttonRest } = buttonProps || {};

  return (
    <div className={anchorClassName} {...rest}>
      <button
        className={mergeClassNames(buttonClassName, constants.button.className)}
        disabled={disabled || buttonDisabled}
        data-selectid={constants.button.selectId}
        {...buttonRest}
      >
        {children}
      </button>
      <button
        className={constants.arrow.className}
        disabled={disabled}
        ref={arrowRef}
        onClick={handleOnArrowClick}
        aria-haspopup="true"
        aria-expanded={open}
        data-selectid={constants.arrow.selectId}
      >
        <ArrowIcon />
      </button>
    </div>
  );
};

export const DropdownMenuList: React.FC<DropdownMenuListProps> = ({
  open,
  anchorEl,
  className,
  style,
  children,
  ...rest
}) => {
  const anchorRect = anchorEl?.getBoundingClientRect();
  const [left, top] = [anchorRect?.left || 0, anchorRect?.bottom || 0];
  const constants = ComponentConstants.dropdownMenuList;

  return !open ? (
    <></>
  ) : (
    <div className={constants.className} data-selectid={constants.selectId}>
      <ul
        className={mergeClassNames(className, constants.container.className)}
        role="menu"
        style={{ left, top, ...style }}
        {...rest}
      >
        {children}
      </ul>
    </div>
  );
};

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  active,
  disabled,
  className,
  children,
  ...rest
}) => {
  const constants = ComponentConstants.dropdownMenuItem;
  let itemClassName = mergeClassNames(className, constants.className);
  if (active) itemClassName = mergeClassNames(itemClassName, ComponentConstants.active.className);
  if (disabled) itemClassName = mergeClassNames(itemClassName, ComponentConstants.disabled.className);

  return (
    <li className={itemClassName} role="menuitem button" {...rest}>
      {children}
    </li>
  );
};

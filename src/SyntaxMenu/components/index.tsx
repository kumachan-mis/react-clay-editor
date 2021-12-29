import * as React from 'react';

import { mergeClassNames } from '../../common/utils';
import { ArrowIcon } from '../icons';

import { ComponentConstants } from './constants';
import {
  DropdownMenuProps,
  DropdownMenuAnchorProps,
  DropdownMenuItemProps,
  DropdownMenuListProps,
  IconButtonMenuProps,
  MenuContainerProps,
} from './types';

export const MenuContainer: React.FC<MenuContainerProps> = ({ className, children, ...rest }) => {
  const constants = ComponentConstants.menuContainer;
  return (
    <div className={mergeClassNames(className, constants.className)} {...rest}>
      {children}
    </div>
  );
};

export const IconButtonMenu: React.FC<IconButtonMenuProps> = ({ className, children, ...rest }) => {
  const constants = ComponentConstants.iconButtonMenu;
  return (
    <button className={mergeClassNames(className, constants.className)} {...rest}>
      {children}
    </button>
  );
};

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ onClose, children }) => {
  const rootRef = React.useRef<HTMLSpanElement | null>(null);

  const handleOnClickAway = React.useCallback(
    (event: MouseEvent) => {
      if (!rootRef.current || rootRef.current.contains(event.target as Node)) return;
      onClose();
    },
    [onClose, rootRef]
  );

  React.useEffect(() => {
    document.addEventListener('click', handleOnClickAway);
    return () => {
      document.removeEventListener('click', handleOnClickAway);
    };
  }, [handleOnClickAway]);

  return <span ref={(ref) => (rootRef.current = ref)}>{children}</span>;
};

export const DropdownMenuAnchor: React.FC<DropdownMenuAnchorProps> = ({
  open,
  onOpen,
  onClose,
  className,
  children,
  ...rest
}) => {
  const handleOnClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => (open ? onClose() : onOpen(event.currentTarget)),
    [open, onOpen, onClose]
  );
  const constants = ComponentConstants.dropdownMenuAnchor;

  return (
    <div className={constants.className}>
      <button className={mergeClassNames(className, constants.icon.className)} {...rest}>
        {children}
      </button>
      <button className={constants.arrow.className} onClick={handleOnClick}>
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
    <ul className={mergeClassNames(className, constants.className)} style={{ left, top, ...style }} {...rest}>
      {children}
    </ul>
  );
};

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ className, children, ...rest }) => {
  const constants = ComponentConstants.dropdownMenuItem;
  return (
    <li className={mergeClassNames(className, constants.className)} {...rest}>
      {children}
    </li>
  );
};

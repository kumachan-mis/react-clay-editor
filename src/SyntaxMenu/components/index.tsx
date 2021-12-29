import * as React from 'react';

import { mergeClassNames } from '../../common/utils';
import { SyntaxMenuConstants } from '../constants';
import { ArrowIcon } from '../icons';

import { DropdownAnchorProps, DropdownMenuItemProps, DropdownMenuProps, IconButtonProps } from './types';

export const IconButton: React.FC<IconButtonProps> = ({ className, children, ...rest }) => {
  const constants = SyntaxMenuConstants.iconButton;
  return (
    <button className={mergeClassNames(className, constants.className)} {...rest}>
      {children}
    </button>
  );
};

export const DropdownAnchor: React.FC<DropdownAnchorProps> = ({
  open,
  onOpen,
  onClose,
  className,
  children,
  ...rest
}) => {
  const handleOnClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.nativeEvent.stopImmediatePropagation();
      open ? onClose?.() : onOpen?.(event.currentTarget);
    },
    [open, onOpen, onClose]
  );
  const constants = SyntaxMenuConstants.dropdownAnchor;

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

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  open,
  anchorEl,
  onClose,
  className,
  style,
  children,
  ...rest
}) => {
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const handleOnClickAway = React.useCallback(
    (event: MouseEvent) => {
      if (!rootRef.current || rootRef.current.contains(event.target as Node)) return;
      onClose?.();
    },
    [onClose, rootRef]
  );

  React.useEffect(() => {
    document.addEventListener('click', handleOnClickAway);
    return () => {
      document.removeEventListener('click', handleOnClickAway);
    };
  }, [handleOnClickAway]);

  const anchorRect = anchorEl?.getBoundingClientRect();
  const [left, top] = [anchorRect?.left || 0, anchorRect?.bottom || 0];
  const constants = SyntaxMenuConstants.dropdownMenu;

  return (
    <div ref={(ref) => (rootRef.current = ref)}>
      {open && (
        <ul className={mergeClassNames(className, constants.className)} style={{ left, top, ...style }} {...rest}>
          {children}
        </ul>
      )}
    </div>
  );
};

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ className, children, ...rest }) => {
  const constants = SyntaxMenuConstants.dropdownMenuItem;
  return (
    <li className={mergeClassNames(className, constants.className)} {...rest}>
      {children}
    </li>
  );
};

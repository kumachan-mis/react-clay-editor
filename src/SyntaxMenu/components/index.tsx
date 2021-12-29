import * as React from 'react';

import { mergeClassNames } from '../../common/utils';
import { SyntaxMenuConstants } from '../constants';
import { ArrowIcon } from '../icons';

export const IconButton: React.FC<React.ComponentProps<'button'>> = ({ className, children, ...rest }) => {
  const constants = SyntaxMenuConstants.iconButton;
  return (
    <button className={mergeClassNames(className, constants.className)} {...rest}>
      {children}
    </button>
  );
};

export const DropdownAnchor: React.FC<React.ComponentProps<'button'>> = ({ className, children, ...rest }) => {
  const constants = SyntaxMenuConstants.dropdownAnchor;
  return (
    <div className={constants.className}>
      <button className={mergeClassNames(className, constants.icon.className)} {...rest}>
        {children}
      </button>
      <button className={constants.arrow.className}>
        <ArrowIcon />
      </button>
    </div>
  );
};

export const DropdownMenu: React.FC<React.ComponentProps<'ul'>> = ({ className, children, ...rest }) => {
  const constants = SyntaxMenuConstants.dropdownMenu;
  return (
    <ul className={mergeClassNames(className, constants.className)} {...rest}>
      {children}
    </ul>
  );
};

export const DropdownMenuItem: React.FC<React.ComponentProps<'li'>> = ({ className, children, ...rest }) => {
  const constants = SyntaxMenuConstants.dropdownMenuItem;
  return (
    <li className={mergeClassNames(className, constants.className)} {...rest}>
      {children}
    </li>
  );
};

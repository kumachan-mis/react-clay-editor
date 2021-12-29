import * as React from 'react';

import { mergeClassNames } from '../../common/utils';
import { SyntaxMenuConstants } from '../constants';

export const IconButton: React.FC<React.ComponentProps<'button'>> = ({ className, children, ...rest }) => {
  const constants = SyntaxMenuConstants.iconButton;
  return (
    <button className={mergeClassNames(className, constants.className)} {...rest}>
      {children}
    </button>
  );
};

export const DropdownArrow: React.FC<React.ComponentProps<'button'>> = ({ className, children, ...rest }) => {
  const constants = SyntaxMenuConstants.dropdownArrow;
  return (
    <button className={mergeClassNames(className, constants.className)} {...rest}>
      {children}
    </button>
  );
};

export const DropdownMenu: React.FC<React.ComponentProps<'ul'>> = ({ className, children, ...rest }) => {
  const constants = SyntaxMenuConstants.dropdownArrow;
  return (
    <ul className={mergeClassNames(className, constants.className)} {...rest}>
      {children}
    </ul>
  );
};

export const DropdownMenuItem: React.FC<React.ComponentProps<'li'>> = ({ className, children, ...rest }) => {
  const constants = SyntaxMenuConstants.dropdownArrow;
  return (
    <li className={mergeClassNames(className, constants.className)} {...rest}>
      {children}
    </li>
  );
};

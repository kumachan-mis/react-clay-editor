import React from 'react';

import { UnderlineIcon } from '../../../../icons/UnderlineIcon';
import { IconButtonMenu } from '../../../atoms/menu/IconButtonMenu';

export type UnderlineMenuProps = {
  menuSwitch: 'on' | 'off' | 'disabled';
  onButtonClick: () => void;
};

export const UnderlineMenuConstants = {
  testId: 'underline-menu',
};

export const UnderlineMenu: React.FC<UnderlineMenuProps> = ({ menuSwitch, onButtonClick }) => (
  <IconButtonMenu pressed={menuSwitch === 'on'} disabled={menuSwitch === 'disabled'} onClick={onButtonClick}>
    <UnderlineIcon />
  </IconButtonMenu>
);

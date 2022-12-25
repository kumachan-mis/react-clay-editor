import { IconButtonMenu } from 'src/components/atoms/menu/IconButtonMenu';
import { UnderlineIcon } from 'src/icons/UnderlineIcon';

import React from 'react';

export type UnderlineMenuProps = {
  menuSwitch: 'on' | 'off' | 'disabled';
  onButtonClick: () => void;
};

export const UnderlineMenuConstants = {
  selectId: 'underline-menu',
};

export const UnderlineMenu: React.FC<UnderlineMenuProps> = ({ menuSwitch, onButtonClick }) => (
  <IconButtonMenu
    pressed={menuSwitch === 'on'}
    disabled={menuSwitch === 'disabled'}
    onClick={onButtonClick}
    data-selectid={UnderlineMenuConstants.selectId}
  >
    <UnderlineIcon />
  </IconButtonMenu>
);

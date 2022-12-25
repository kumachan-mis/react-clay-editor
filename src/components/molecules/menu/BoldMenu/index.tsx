import { IconButtonMenu } from 'src/components/atoms/menu/IconButtonMenu';
import { BoldIcon } from 'src/icons/BoldIcon';

import React from 'react';

export type BoldMenuProps = {
  menuSwitch: 'on' | 'off' | 'disabled';
  onButtonClick: () => void;
};

export const BoldMenuConstants = {
  selectId: 'bold-menu',
};

export const BoldMenu: React.FC<BoldMenuProps> = ({ menuSwitch, onButtonClick }) => (
  <IconButtonMenu
    pressed={menuSwitch === 'on'}
    disabled={menuSwitch === 'disabled'}
    onClick={onButtonClick}
    data-selectid={BoldMenuConstants.selectId}
  >
    <BoldIcon />
  </IconButtonMenu>
);

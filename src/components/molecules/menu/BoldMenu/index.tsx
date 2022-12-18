import React from 'react';

import { BoldIcon } from '../../../../icons/BoldIcon';
import { IconButtonMenu } from '../../../atoms/menu/IconButtonMenu';

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

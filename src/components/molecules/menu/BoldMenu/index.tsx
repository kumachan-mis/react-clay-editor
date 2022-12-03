import React from 'react';

import { BoldIcon } from '../../../../icons/BoldIcon';
import { IconButtonMenu } from '../../../atoms/menu/IconButtonMenu';

export type BoldMenuProps = {
  menuSwitch: 'on' | 'off' | 'disabled';
  onButtonClick: () => void;
};

export const BoldMenuConstants = {
  testId: 'bold-menu',
};

export const BoldMenu: React.FC<BoldMenuProps> = ({ menuSwitch, onButtonClick }) => (
  <IconButtonMenu pressed={menuSwitch === 'on'} disabled={menuSwitch === 'disabled'} onClick={onButtonClick}>
    <BoldIcon />
  </IconButtonMenu>
);

import { IconButtonMenu } from 'src/components/atoms/menu/IconButtonMenu';
import { BracketIcon } from 'src/icons/BracketIcon';

import React from 'react';

export type BracketMenuProps = {
  menuSwitch: 'on' | 'off' | 'disabled';
  onButtonClick: () => void;
};

export const BracketMenuConstants = {
  selectId: 'bracket-menu',
  defaultLabel: 'bracket link',
};

export const BracketMenu: React.FC<BracketMenuProps> = ({ menuSwitch, onButtonClick }) => (
  <IconButtonMenu
    pressed={menuSwitch === 'on'}
    disabled={menuSwitch === 'disabled'}
    onClick={onButtonClick}
    data-selectid={BracketMenuConstants.selectId}
  >
    <BracketIcon />
  </IconButtonMenu>
);

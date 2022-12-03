import React from 'react';

import { BracketIcon } from '../../../../icons/BracketIcon';
import { IconButtonMenu } from '../../../atoms/menu/IconButtonMenu';

export type BracketMenuProps = {
  menuSwitch: 'on' | 'off' | 'disabled';
  onButtonClick: () => void;
};

export const BracketMenuConstants = {
  testId: 'bracket-menu',
  defaultLabel: 'bracket link',
};

export const BracketMenu: React.FC<BracketMenuProps> = ({ menuSwitch, onButtonClick }) => (
  <IconButtonMenu pressed={menuSwitch === 'on'} disabled={menuSwitch === 'disabled'} onClick={onButtonClick}>
    <BracketIcon />
  </IconButtonMenu>
);

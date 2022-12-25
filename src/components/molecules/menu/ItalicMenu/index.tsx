import { IconButtonMenu } from 'src/components/atoms/menu/IconButtonMenu';
import { ItalicIcon } from 'src/icons/ItalicIcon';

import React from 'react';

export type ItalicMenuProps = {
  menuSwitch: 'on' | 'off' | 'disabled';
  onButtonClick: () => void;
};

export const ItalicMenuConstants = {
  selectId: 'italic-menu',
};

export const ItalicMenu: React.FC<ItalicMenuProps> = ({ menuSwitch, onButtonClick }) => (
  <IconButtonMenu
    pressed={menuSwitch === 'on'}
    disabled={menuSwitch === 'disabled'}
    onClick={onButtonClick}
    data-selectid={ItalicMenuConstants.selectId}
  >
    <ItalicIcon />
  </IconButtonMenu>
);

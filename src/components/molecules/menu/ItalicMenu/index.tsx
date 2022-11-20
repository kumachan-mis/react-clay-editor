import React from 'react';

import { createTestId } from '../../../../common/utils';
import { ItalicIcon } from '../../../../icons/ItalicIcon';
import { IconButtonMenu } from '../../../atoms/menu/IconButtonMenu';

export type ItalicMenuProps = {
  menuSwitch: 'on' | 'off' | 'disabled';
  onButtonClick: () => void;
};

export const ItalicMenuConstants = {
  testId: 'italic-menu',
};

export const ItalicMenu: React.FC<ItalicMenuProps> = ({ menuSwitch, onButtonClick }) => (
  <IconButtonMenu
    pressed={menuSwitch === 'on'}
    disabled={menuSwitch === 'disabled'}
    onClick={onButtonClick}
    data-testid={createTestId(ItalicMenuConstants.testId)}
  >
    <ItalicIcon />
  </IconButtonMenu>
);

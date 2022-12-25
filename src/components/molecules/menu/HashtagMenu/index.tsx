import { IconButtonMenu } from 'src/components/atoms/menu/IconButtonMenu';
import { HashtagIcon } from 'src/icons/HashtagIcon';

import React from 'react';

export type HashtagMenuProps = {
  menuSwitch: 'on' | 'off' | 'disabled';
  onButtonClick: () => void;
};

export const HashtagMenuConstants = {
  selectId: 'hashtag-menu',
  defaultLabel: 'hashtag link',
};

export const HashtagMenu: React.FC<HashtagMenuProps> = ({ menuSwitch, onButtonClick }) => (
  <IconButtonMenu
    pressed={menuSwitch === 'on'}
    disabled={menuSwitch === 'disabled'}
    onClick={onButtonClick}
    data-selectid={HashtagMenuConstants.selectId}
  >
    <HashtagIcon />
  </IconButtonMenu>
);

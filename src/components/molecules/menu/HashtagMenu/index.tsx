import React from 'react';

import { createTestId } from '../../../../common/utils';
import { HashtagIcon } from '../../../../icons/HashtagIcon';
import { IconButtonMenu } from '../../../atoms/menu/IconButtonMenu';

export type HashtagMenuProps = {
  menuSwitch: 'on' | 'off' | 'disabled';
  onButtonClick: () => void;
};

export const HashtagMenuConstants = {
  testId: 'hashtag-menu',
  defaultLabel: 'hashtag link',
};

export const HashtagMenu: React.FC<HashtagMenuProps> = ({ menuSwitch, onButtonClick }) => (
  <IconButtonMenu
    pressed={menuSwitch === 'on'}
    disabled={menuSwitch === 'disabled'}
    onClick={onButtonClick}
    data-testid={createTestId(HashtagMenuConstants.testId)}
  >
    <HashtagIcon />
  </IconButtonMenu>
);

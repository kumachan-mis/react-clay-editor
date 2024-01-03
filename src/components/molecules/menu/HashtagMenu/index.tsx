import { HashtagIcon } from '../../../../icons/HashtagIcon';
import { IconButtonMenu } from '../../../atoms/menu/IconButtonMenu';

export type HashtagMenuProps = {
  readonly menuSwitch: 'on' | 'off' | 'disabled';
  readonly onButtonClick: () => void;
};

export const HashtagMenuConstants = {
  selectId: 'hashtag-menu',
  defaultLabel: 'hashtag link',
};

export const HashtagMenu: React.FC<HashtagMenuProps> = ({ menuSwitch, onButtonClick }) => (
  <IconButtonMenu
    data-selectid={HashtagMenuConstants.selectId}
    disabled={menuSwitch === 'disabled'}
    onClick={onButtonClick}
    pressed={menuSwitch === 'on'}
  >
    <HashtagIcon />
  </IconButtonMenu>
);

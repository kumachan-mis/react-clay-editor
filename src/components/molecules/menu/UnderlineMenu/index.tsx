import { UnderlineIcon } from '../../../../icons/UnderlineIcon';
import { IconButtonMenu } from '../../../atoms/menu/IconButtonMenu';

export type UnderlineMenuProps = {
  readonly menuSwitch: 'on' | 'off' | 'disabled';
  readonly onButtonClick: () => void;
};

export const UnderlineMenuConstants = {
  selectId: 'underline-menu',
};

export const UnderlineMenu: React.FC<UnderlineMenuProps> = ({ menuSwitch, onButtonClick }) => (
  <IconButtonMenu
    data-selectid={UnderlineMenuConstants.selectId}
    disabled={menuSwitch === 'disabled'}
    onClick={onButtonClick}
    pressed={menuSwitch === 'on'}
  >
    <UnderlineIcon />
  </IconButtonMenu>
);

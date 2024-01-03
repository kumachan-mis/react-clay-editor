import { BoldIcon } from '../../../../icons/BoldIcon';
import { IconButtonMenu } from '../../../atoms/menu/IconButtonMenu';

export type BoldMenuProps = {
  readonly menuSwitch: 'on' | 'off' | 'disabled';
  readonly onButtonClick: () => void;
};

export const BoldMenuConstants = {
  selectId: 'bold-menu',
};

export const BoldMenu: React.FC<BoldMenuProps> = ({ menuSwitch, onButtonClick }) => (
  <IconButtonMenu
    data-selectid={BoldMenuConstants.selectId}
    disabled={menuSwitch === 'disabled'}
    onClick={onButtonClick}
    pressed={menuSwitch === 'on'}
  >
    <BoldIcon />
  </IconButtonMenu>
);

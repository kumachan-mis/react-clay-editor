import { BracketIcon } from '../../../../icons/BracketIcon';
import { IconButtonMenu } from '../../../atoms/menu/IconButtonMenu';

export type BracketMenuProps = {
  readonly menuSwitch: 'on' | 'off' | 'disabled';
  readonly onButtonClick: () => void;
};

export const BracketMenuConstants = {
  selectId: 'bracket-menu',
  defaultLabel: 'bracket link',
};

export const BracketMenu: React.FC<BracketMenuProps> = ({ menuSwitch, onButtonClick }) => (
  <IconButtonMenu
    data-selectid={BracketMenuConstants.selectId}
    disabled={menuSwitch === 'disabled'}
    onClick={onButtonClick}
    pressed={menuSwitch === 'on'}
  >
    <BracketIcon />
  </IconButtonMenu>
);

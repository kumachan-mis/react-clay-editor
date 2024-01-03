import { ItalicIcon } from '../../../../icons/ItalicIcon';
import { IconButtonMenu } from '../../../atoms/menu/IconButtonMenu';

export type ItalicMenuProps = {
  readonly menuSwitch: 'on' | 'off' | 'disabled';
  readonly onButtonClick: () => void;
};

export const ItalicMenuConstants = {
  selectId: 'italic-menu',
};

export const ItalicMenu: React.FC<ItalicMenuProps> = ({ menuSwitch, onButtonClick }) => (
  <IconButtonMenu
    data-selectid={ItalicMenuConstants.selectId}
    disabled={menuSwitch === 'disabled'}
    onClick={onButtonClick}
    pressed={menuSwitch === 'on'}
  >
    <ItalicIcon />
  </IconButtonMenu>
);
